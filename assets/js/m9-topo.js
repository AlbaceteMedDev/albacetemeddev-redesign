/* m9-topo (Futurist v9, "precision instrument"): a 3D wound topography drawn by hand on a 2D canvas.
   A smooth crater shaped by a few gaussians, drawn as iso-depth contour rings stacked at their depths, a sparse
   wireframe and a LiDAR-like point cloud in perspective, one thin gold ring at the deepest contour and a depth gauge
   at the deepest point. It turns slowly (1 deg/s), leans toward the pointer (12 deg at most; on touch it follows the
   page scroll instead), and a thin scan plane passes through it every few seconds.
   Mount: <div data-m9-topo>. Anything inside stays until the canvas has drawn, then is hidden but keeps its space,
   so the layout never changes. Options (data attributes on the mount):
     data-m9-theme="dark"   white and steel hairlines for a navy ground (default: navy and accent on white or grey)
     data-m9-sway="22"      sway 22 deg either side of the start angle (peaking at 1 deg/s) instead of turning round
     data-m9-yaw="-18"      the start angle in degrees
     data-m9-len, data-m9-wid, data-m9-depth   readouts, only words already on the page: the length and width
                            dimension lines and the max-depth leader. Without them the module draws no text.
   Off screen or in a hidden tab it stops; reduced motion gets one still frame; without JS the mount is unchanged.
   A "m9-scan" event on the mount runs a scan pass at once.
   Used in two places only (the motif is reserved for them): the home precision panel and the software hero. */
(() => {
  const mounts = [...document.querySelectorAll('[data-m9-topo]')];
  if (!mounts.length || !window.HTMLCanvasElement) return;
  const RMQ = matchMedia('(prefers-reduced-motion: reduce)');
  const FINE = matchMedia('(hover: hover) and (pointer: fine)');
  const D = Math.PI / 180;
  const MONO = '"JetBrains Mono", ui-monospace, SFMono-Regular, Menlo, Consolas, monospace';
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));

  /* ── The model, built once: u, v in [-L, L] (the skin plane, length by width), z = depth below it, 0..1 ── */
  const L = 1.2, AY = 38 / 42, ZS = .62, F = 3.4;
  const GS = [[-.1, .06, .42, .37, 1], [.3, -.12, .23, .21, .4], [-.36, -.26, .19, .24, .3], [.12, .36, .2, .17, .24]];
  const raw = (u, v) => { let z = 0; for (const g of GS) { const p = (u - g[0]) / g[2], q = (v - g[1]) / g[3]; z += g[4] * Math.exp(-.5 * (p * p + q * q)); } return z; };
  const N = 60, W1 = N + 1, ST = 2 * L / N;
  let peak = 0, pu = 0, pv = 0;
  const vals = new Float32Array(W1 * W1);
  for (let j = 0; j <= N; j++) for (let i = 0; i <= N; i++) {
    const z = raw(-L + i * ST, -L + j * ST);
    vals[j * W1 + i] = z;
    if (z > peak) { peak = z; pu = -L + i * ST; pv = -L + j * ST; }
  }
  // the wound bed with a soft raised lip at its edge (it follows the wound's own outline)
  const shape = f => f - .07 * Math.exp(-(((f - .05) / .035) ** 2));
  const depth = (u, v) => shape(raw(u, v) / peak);
  for (let k = 0; k < vals.length; k++) vals[k] = shape(vals[k] / peak);

  // marching squares: corners a(i,j) b(i+1,j) c(i+1,j+1) d(i,j+1); edges 0 ab, 1 bc, 2 dc, 3 ad
  const CASES = [[], [3, 0], [0, 1], [3, 1], [1, 2], [3, 0, 1, 2], [0, 2], [3, 2], [2, 3], [0, 2], [0, 1, 2, 3], [1, 2], [1, 3], [0, 1], [0, 3], []];
  function contour(t) {
    const out = [];
    for (let j = 0; j < N; j++) for (let i = 0; i < N; i++) {
      const a = vals[j * W1 + i], b = vals[j * W1 + i + 1], c = vals[(j + 1) * W1 + i + 1], d = vals[(j + 1) * W1 + i];
      const cs = CASES[(a > t) | ((b > t) << 1) | ((c > t) << 2) | ((d > t) << 3)];
      if (!cs.length) continue;
      const u0 = -L + i * ST, v0 = -L + j * ST;
      const e = k => k === 0 ? [u0 + ST * (t - a) / (b - a), v0] : k === 1 ? [u0 + ST, v0 + ST * (t - b) / (c - b)]
        : k === 2 ? [u0 + ST * (t - d) / (c - d), v0 + ST] : [u0, v0 + ST * (t - a) / (d - a)];
      for (let s = 0; s < cs.length; s += 2) { const p = e(cs[s]), q = e(cs[s + 1]); out.push(p[0], p[1], q[0], q[1]); }
    }
    return new Float32Array(out);
  }
  const RINGS = [.12, .24, .36, .48, .6, .72].map(t => ({ t, seg: contour(t) }));
  const EDGE = contour(.03), GOLD = contour(.88);
  // the wound's extent (for the dimension lines)
  let u1 = L, u2 = -L, v1 = L, v2 = -L;
  for (let k = 0; k < EDGE.length; k += 2) { u1 = Math.min(u1, EDGE[k]); u2 = Math.max(u2, EDGE[k]); v1 = Math.min(v1, EDGE[k + 1]); v2 = Math.max(v2, EDGE[k + 1]); }
  // the scan bed: a circle of radius R on the skin plane (round, so turning never changes the fit); a sparse
  // wireframe clipped to it (lines along the length and across), and a LiDAR-like point cloud, denser in the wound
  const R = 1.22, WL = 24, wire = [];
  for (let dir = 0; dir < 2; dir++) for (let l = 1; l < WL; l++) {
    const a = -R + l * 2 * R / WL, half = Math.sqrt(R * R - a * a), ns = Math.max(4, Math.round(half * 40));
    const line = new Float32Array((ns + 1) * 3);
    for (let k = 0; k <= ns; k++) {
      const b = -half + k * 2 * half / ns, u = dir ? b : a, v = (dir ? a : b) / AY; // world X = u, world Y = v * AY
      line.set([u, v, depth(u, v)], k * 3);
    }
    wire.push(line);
  }
  let seed = 7;
  const rnd = () => { seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t ^= t + Math.imul(t ^ (t >>> 7), 61 | t); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const pts = [];
  while (pts.length < 2600) {
    const u = (rnd() * 2 - 1) * R, y = (rnd() * 2 - 1) * R, v = y / AY, z = depth(u, v);
    if (u * u + y * y < R * R && (z > .03 || rnd() < .12)) pts.push(u, v, z);
  }
  const PTS = new Float32Array(pts);

  /* ── One instance per mount ── */
  function mount(el) {
    const dark = el.dataset.m9Theme === 'dark';
    const C = dark
      ? { frame: 'rgba(255,255,255,.3)', wire: [255, 255, 255, .11], pt: 'rgba(255,255,255,.5)', ring: [150, 184, 232], edge: 'rgba(255,255,255,.82)',
          gold: '#dab156', scan: [150, 184, 232], ink: '#e9eef4', back: '#10233a' }
      : { frame: 'rgba(16,35,58,.34)', wire: [16, 35, 58, .12], pt: 'rgba(16,35,58,.42)', ring: [43, 94, 167], edge: 'rgba(16,35,58,.85)',
          gold: '#b8892c', scan: [43, 94, 167], ink: '#1d2125', back: '#fff' };
    const rgba = (c, a) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;
    const sway = parseFloat(el.dataset.m9Sway) || 0;
    const yaw0 = (parseFloat(el.dataset.m9Yaw) || -24) * D;
    const lab = { len: el.dataset.m9Len, wid: el.dataset.m9Wid, dep: el.dataset.m9Depth };
    const texts = !!(lab.len || lab.wid || lab.dep);
    const E0 = 41 * D;
    const cv = document.createElement('canvas');
    cv.className = 'm9-topo-canvas';
    cv.setAttribute('aria-hidden', 'true');
    el.append(cv);
    const ctx = cv.getContext('2d');
    if (!ctx) { cv.remove(); return; }

    let w = 0, h = 0, dpr = 1, S = 1, cx = 0, cy = 0;
    let t = 0, last = 0, raf = 0, seen = false, scanT = -1, nextScan = 1.4;
    // a slow device (more than 7ms a draw on average) draws half the point cloud
    let step = 3, cost = 0, frames = 0;
    let tx = 0, ty = 0, ox = 0, oy = 0, px = null, py = null;
    let c = 1, s = 0, ce = 1, se = 0;
    const calm = () => RMQ.matches;

    function angles(yaw, el2) { c = Math.cos(yaw); s = Math.sin(yaw); ce = Math.cos(el2); se = Math.sin(el2); }
    // model to screen: X along the length, Y across, Z up (depth goes down)
    let X = 0, Y = 0, K = 1;
    function P(u, v, z) { return Q(u, v * AY, -z * ZS); }
    // world to screen
    function Q(x0, y0, z0) {
      const x1 = x0 * c - y0 * s, y1 = x0 * s + y0 * c;
      const dist = y1 * ce - z0 * se;
      K = F / (F + dist);
      X = cx + x1 * K * S;
      Y = cy - (y1 * se + z0 * ce) * K * S;
      return dist;
    }
    // scale and centre so the model fits at every angle it can take
    function fit() {
      let a = 1e9, b = -1e9, lo = 1e9, hi = -1e9;
      S = 1; cx = 0; cy = 0;
      const yaws = sway ? [-1, -.5, 0, .5, 1].map(k => yaw0 + k * (sway + 12) * D) : Array.from({ length: 24 }, (_, k) => k * 15 * D);
      for (const yw of yaws) for (const e of [E0 - 10 * D, E0 + 10 * D]) {
        angles(yw, e);
        for (let k = 0; k < 24; k++) {
          const q = k * Math.PI / 12, rr = R + .1;
          P(rr * Math.cos(q), rr * Math.sin(q) / AY, 0); a = Math.min(a, X); b = Math.max(b, X); lo = Math.min(lo, Y); hi = Math.max(hi, Y);
          P(.8 * Math.cos(q), .8 * Math.sin(q) / AY, 1.02); a = Math.min(a, X); b = Math.max(b, X); lo = Math.min(lo, Y); hi = Math.max(hi, Y);
          P(.8 * Math.cos(q), .8 * Math.sin(q) / AY, -.36); lo = Math.min(lo, Y);
        }
        if (texts) for (const [u, v] of [[u1, v1 - .26], [u2, v1 - .26], [u2 + .26, v1], [u2 + .26, v2]]) {
          P(u, v, 0); a = Math.min(a, X); b = Math.max(b, X); lo = Math.min(lo, Y); hi = Math.max(hi, Y);
        }
      }
      const padL = texts ? 16 : 18, padR = texts ? 72 : 18, padT = texts ? 26 : 14, padB = texts ? 30 : 14;
      S = Math.min((w - padL - padR) / (b - a), (h - padT - padB) / (hi - lo));
      cx = padL + (w - padL - padR) / 2 - (a + b) / 2 * S;
      cy = padT + (h - padT - padB) / 2 - (lo + hi) / 2 * S;
    }
    function size() {
      const r = el.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = Math.max(1, Math.round(r.width)); h = Math.max(1, Math.round(r.height));
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr);
      fit();
    }

    let eTop = 0, eRight = 0;
    function seg(arr, z, box) {
      ctx.beginPath();
      if (box) { eTop = 1e9; eRight = -1e9; }
      for (let k = 0; k < arr.length; k += 4) {
        P(arr[k], arr[k + 1], z); ctx.moveTo(X, Y);
        if (box) { eTop = Math.min(eTop, Y); eRight = Math.max(eRight, X); }
        P(arr[k + 2], arr[k + 3], z); ctx.lineTo(X, Y);
      }
      ctx.stroke();
    }
    function label(str, x, y, align) {
      ctx.font = `500 11px ${MONO}`;
      const tw = ctx.measureText(str).width;
      let lx = align === 'center' ? x - tw / 2 : align === 'right' ? x - tw : x;
      lx = clamp(lx, 4, w - tw - 4);
      ctx.fillStyle = C.back;
      ctx.fillRect(lx - 4, y - 9, tw + 8, 17);
      ctx.fillStyle = C.ink;
      ctx.textBaseline = 'middle';
      ctx.fillText(str, lx, y);
    }
    function slash(x, y) { ctx.moveTo(x - 4, y + 4); ctx.lineTo(x + 4, y - 4); }

    function draw() {
      if (Math.min(window.devicePixelRatio || 1, 2) !== dpr) size();
      const yaw = yaw0 + (sway ? sway * D * Math.sin(t / sway) : t * D) + ox * 12 * D;
      angles(yaw, E0 + oy * 10 * D);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.lineWidth = 1; ctx.lineCap = 'round'; ctx.lineJoin = 'round';

      // the skin plane: the scan bed's ring with measurement ticks (every 5 degrees, longer every 30)
      ctx.strokeStyle = C.frame;
      ctx.beginPath();
      for (let k = 0; k <= 96; k++) { const q = k * Math.PI / 48; P(R * Math.cos(q), R * Math.sin(q) / AY, 0); k ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }
      for (let k = 0; k < 72; k++) {
        const q = k * Math.PI / 36, m = k % 6 ? .04 : .1, cq = Math.cos(q), sq = Math.sin(q) / AY;
        P(R * cq, R * sq, 0); ctx.moveTo(X, Y); P((R + m) * cq, (R + m) * sq, 0); ctx.lineTo(X, Y);
      }
      ctx.stroke();

      // the wireframe, each line fainter with distance
      for (const line of wire) {
        const n = line.length / 3, m = (n >> 1) * 3;
        const d = P(line[m], line[m + 1], 0);
        ctx.strokeStyle = rgba(C.wire, C.wire[3] * (.45 + .55 * clamp((1.3 - d) / 2.6, 0, 1)));
        ctx.beginPath();
        for (let k = 0; k < n; k++) { P(line[k * 3], line[k * 3 + 1], line[k * 3 + 2]); k ? ctx.lineTo(X, Y) : ctx.moveTo(X, Y); }
        ctx.stroke();
      }

      // the scan plane's position (model u), when a pass is running
      let sp = null;
      if (scanT >= 0) sp = (-R + .04) + (2 * R - .08) * scanT;

      // the point cloud; points the scan plane is passing light up
      ctx.fillStyle = C.pt;
      const hot = [];
      for (let k = 0; k < PTS.length; k += step) {
        P(PTS[k], PTS[k + 1], PTS[k + 2]);
        if (sp !== null && Math.abs(PTS[k] - sp) < .07) { hot.push(X, Y); continue; }
        ctx.fillRect(X - .6, Y - .6, 1.2, 1.2);
      }

      // the wound edge, the iso-depth rings at their depths, and the deepest ring in gold
      ctx.strokeStyle = C.edge; ctx.lineWidth = 1.25; seg(EDGE, .03, true);
      ctx.lineWidth = 1;
      RINGS.forEach(r => { ctx.strokeStyle = rgba(C.ring, .38 + .55 * r.t); seg(r.seg, r.t); });
      ctx.strokeStyle = C.gold; ctx.lineWidth = 1.5; seg(GOLD, .88);
      ctx.lineWidth = 1;

      // the scan plane: a thin sheet, its outline, and the profile it cuts through the wound
      if (sp !== null) {
        const fade = Math.min(1, scanT / .08, (1 - scanT) / .08);
        const half = Math.sqrt(Math.max(0, R * R - sp * sp)), prof = [];
        for (let k = 0; k <= 64; k++) { const v = (-half + k * 2 * half / 64) / AY; P(sp, v, Math.max(0, depth(sp, v))); prof.push(X, Y); }
        // the sheet: a straight top edge above the plane, its foot the surface profile
        ctx.beginPath();
        P(sp, -half / AY, -.34); ctx.moveTo(X, Y); P(sp, half / AY, -.34); ctx.lineTo(X, Y);
        for (let k = prof.length - 2; k >= 0; k -= 2) ctx.lineTo(prof[k], prof[k + 1]);
        ctx.closePath();
        ctx.fillStyle = rgba(C.scan, .08 * fade); ctx.fill();
        ctx.beginPath();
        P(sp, -half / AY, -.34); ctx.moveTo(X, Y); P(sp, half / AY, -.34); ctx.lineTo(X, Y);
        ctx.strokeStyle = rgba(C.scan, .55 * fade); ctx.stroke();
        ctx.beginPath();
        for (let k = 0; k < prof.length; k += 2) k ? ctx.lineTo(prof[k], prof[k + 1]) : ctx.moveTo(prof[k], prof[k + 1]);
        ctx.strokeStyle = rgba(C.scan, fade); ctx.lineWidth = 1.75; ctx.stroke(); ctx.lineWidth = 1;
        ctx.fillStyle = rgba(C.scan, fade);
        for (let k = 0; k < hot.length; k += 2) ctx.fillRect(hot[k] - 1, hot[k + 1] - 1, 2, 2);
      }

      // the depth gauge: from the deepest point straight up through the skin plane
      ctx.strokeStyle = C.edge;
      ctx.setLineDash([2, 3]);
      P(pu, pv, 1); const bx = X, by = Y;
      P(pu, pv, -.28); const gx = bx, gy = texts ? Math.min(Y, eTop - 16) : Y;
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(gx, gy); ctx.stroke();
      ctx.setLineDash([]);
      ctx.beginPath();
      ctx.moveTo(bx - 5, by); ctx.lineTo(bx + 5, by); ctx.moveTo(bx, by - 5); ctx.lineTo(bx, by + 5);
      P(pu, pv, 0); ctx.moveTo(X - 4, Y); ctx.lineTo(X + 4, Y);
      if (!texts) { ctx.moveTo(gx - 4, gy); ctx.lineTo(gx + 4, gy); }
      ctx.stroke();
      ctx.strokeStyle = C.gold; ctx.beginPath(); ctx.arc(bx, by, 3.5, 0, 7); ctx.stroke();

      if (!texts) return;
      ctx.strokeStyle = C.edge;
      // the max-depth leader: up from the deepest point, then out to the right, clear of the rings
      if (lab.dep) {
        const lx = Math.max(gx + 24, eRight - 40);
        ctx.beginPath(); ctx.moveTo(gx, gy); ctx.lineTo(lx, gy); ctx.stroke();
        label(lab.dep, lx + 6, gy, 'left');
      }
      // dimension lines on the skin plane: the length in front of the wound, the width to its right
      const vf = v1 - .26, ur = u2 + .26;
      ctx.beginPath();
      P(u1, vf, 0); const ax = X, ay = Y; ctx.moveTo(X, Y); P(u2, vf, 0); const bx2 = X, by2 = Y; ctx.lineTo(X, Y);
      slash(ax, ay); slash(bx2, by2);
      P(u1, vf + .16, 0); ctx.moveTo(X, Y); P(u1, vf - .05, 0); ctx.lineTo(X, Y);
      P(u2, vf + .16, 0); ctx.moveTo(X, Y); P(u2, vf - .05, 0); ctx.lineTo(X, Y);
      P(ur, v1, 0); const cx2 = X, cy2 = Y; ctx.moveTo(X, Y); P(ur, v2, 0); const dx = X, dy = Y; ctx.lineTo(X, Y);
      slash(cx2, cy2); slash(dx, dy);
      P(ur - .16, v1, 0); ctx.moveTo(X, Y); P(ur + .05, v1, 0); ctx.lineTo(X, Y);
      P(ur - .16, v2, 0); ctx.moveTo(X, Y); P(ur + .05, v2, 0); ctx.lineTo(X, Y);
      ctx.stroke();
      if (lab.len) label(lab.len, (ax + bx2) / 2, Math.max(ay, by2) + 14, 'center');
      if (lab.wid) label(lab.wid, Math.max(cx2, dx) + 10, (cy2 + dy) / 2, 'left');
    }

    function frame(now) {
      raf = 0;
      const dt = last ? Math.min(.064, (now - last) / 1000) : 0;
      last = now;
      t += dt;
      // lean toward the pointer (or with the page scroll on touch), eased
      const k = 1 - Math.exp(-dt / .22);
      ox += (tx - ox) * k; oy += (ty - oy) * k;
      // the scan: a 2.2s pass every few seconds
      if (scanT >= 0) { scanT += dt / 2.2; if (scanT >= 1) { scanT = -1; nextScan = t + 4.6; } }
      else if (t >= nextScan) scanT = 0;
      const t0 = performance.now();
      draw();
      if (step === 3 && frames < 60) { cost += performance.now() - t0; if (++frames === 60 && cost / 60 > 7) step = 6; }
      if (seen && !document.hidden && !calm()) raf = requestAnimationFrame(frame);
    }
    function run() { if (!raf && seen && !document.hidden && !calm()) { last = 0; raf = requestAnimationFrame(frame); } }
    function still() { if (calm() || !raf) draw(); }

    function aim() {
      if (calm() || !seen) return;
      const r = el.getBoundingClientRect();
      if (FINE.matches && px !== null) {
        tx = clamp((px - (r.left + r.width / 2)) / (innerWidth / 2), -1, 1);
        ty = clamp((py - (r.top + r.height / 2)) / (innerHeight / 2), -1, 1);
      } else {
        tx = 0;
        ty = clamp((r.top + r.height / 2 - innerHeight / 2) / (innerHeight / 2), -1, 1);
      }
    }
    addEventListener('pointermove', e => { if (e.pointerType === 'mouse') { px = e.clientX; py = e.clientY; aim(); } }, { passive: true });
    addEventListener('scroll', aim, { passive: true });
    el.addEventListener('m9-scan', () => { if (scanT < 0 && !calm()) { scanT = 0; run(); } });

    size();
    if ('ResizeObserver' in window) new ResizeObserver(() => { size(); still(); }).observe(el);
    else addEventListener('resize', () => { size(); still(); });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([e]) => { seen = e.isIntersecting; if (seen) { aim(); run(); } }, { rootMargin: '80px 0px' }).observe(el);
    } else seen = true;
    document.addEventListener('visibilitychange', run);
    RMQ.addEventListener && RMQ.addEventListener('change', () => { ox = oy = tx = ty = 0; scanT = -1; still(); run(); });
    draw();
    el.setAttribute('data-m9-ready', '');
    if (texts && document.fonts && document.fonts.load) document.fonts.load(`500 11px "JetBrains Mono"`).then(still, () => {});
    run();
  }
  mounts.forEach(el => { try { mount(el); } catch (e) { console.warn('[m9-topo]', e); } });
})();
