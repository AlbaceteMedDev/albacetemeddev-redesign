/* Home (house style, Motion v4, Oct 2026). Content first: every heading, paragraph, button and photograph is
   readable at first paint or within 400ms of entering view, and nothing pins or takes over scrolling for browsing.
   hero    the field of "+" registration marks (the logo's plus) on a canvas behind the content, with the shared
           layer's behaviour: kept 64px clear of every line of text and every control, parted up to 9px either side
           of the moving pointer and closed by a critically damped spring; mist only. The photograph fades in (CSS).
   story   pinned narrative (three questions): each step change fades the old step out, then the new one in.
   show    a native scroll-snap rail you can drag, swipe, key or step one card at a time; the counter and the gold
           rule name the leftmost fully visible card. Tabs filter with a staggered exit, then a staggered entry.
   also    evidence connectors that draw with the scroll, whole-control colour hovers (CSS), drawn underlines on
           text links, and a closing statement whose weight settles as it arrives.
   Every hidden state is gated on html.sx-mo (JS + motion allowed) or on JS-only classes, so without JS, or with
   reduced motion, the page is complete and static. Animation is transform / opacity, rAF-driven, paused off screen. */
(() => {
  const R = document.documentElement;
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const MO = !RM;
  const IO = 'IntersectionObserver' in window;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const sstep = t => t * t * (3 - 2 * t);
  const navH = () => parseFloat(getComputedStyle(R).getPropertyValue('--nav-h')) || 72;
  const safe = f => { try { f(); } catch (e) { console.warn('[home]', e); } };
  // Scroll without the page-wide smooth behaviour (the pinned story maps scroll to its steps 1:1).
  const jump = y => { const b = R.style.scrollBehavior; R.style.scrollBehavior = 'auto'; scrollTo(0, y); R.style.scrollBehavior = b; };
  R.classList.add('sx-home-js');
  if (MO) R.classList.add('sx-mo');

  /* ── Split a heading into masked words; words on one rendered line share a stagger index (--l) ── */
  function split(el) {
    if (!el || el._w) return el && el._w;
    const words = [];
    (function walk(node) {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 1) return walk(n);
        if (n.nodeType !== 3 || !n.textContent.trim()) return;
        const f = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(p => {
          if (!p) return;
          if (!p.trim()) { f.append(p); return; }
          const w = document.createElement('span'), i = document.createElement('span');
          w.className = 'sx-w'; i.className = 'sx-wi'; i.textContent = p;
          w.append(i); f.append(w); words.push(w);
        });
        n.replaceWith(f);
      });
    })(el);
    el._w = words;
    el.classList.add('sx-split');
    lines(el);
    return words;
  }
  function lines(el) {
    if (!el || !el._w) return;
    let k = -1, top = -1e9;
    el._w.forEach(w => { const t = w.getBoundingClientRect().top; if (t > top + 4) { top = t; k++; } w.style.setProperty('--l', k); });
  }

  /* ── The "+" field: the shared layer's field (house-motion.js §6), hosted by the home hero so the motif behaves
     the same on every page. Thin 1px registration marks on a 32px grid (28px on phones) aligned to the headline's
     left edge and top. Marks live only in the open areas: none within 64px of any line of text, link, button or
     offer-strip item (feathered over 24px, so moving decoration never reaches words or controls), none on the
     photograph. A moving pointer parts them: marks either side of its path are pushed apart (up to 9px) and turn
     away from each other (up to 20 degrees), in mist only, never above 55% opacity. How far the field opens follows
     the pointer's speed; when it stops, every mark settles back on a critically damped spring (no overshoot) and
     stays closed until the pointer moves again. Nothing trails behind the pointer. At rest a slow, faint diagonal
     wave passes. Touch: the parting travels slowly with the scroll. Reduced motion: a static faint grid. Paused
     off screen, in hidden tabs and while the intro is open. */
  // Exact step of a critically damped spring toward target T (angular frequency w, e = exp(-w dt)), in place on
  // typed arrays: stable at any frame time; a step that would cross the target stops on it (never overshoots).
  function crit(xs, vs, i, T, w, dt, e) {
    const x = xs[i], v = vs[i], d = x - T, c = v + w * d;
    let nx = T + (d + c * dt) * e, nv = (v - w * c * dt) * e;
    if (d !== 0 && (nx - T) * d < 0) { nx = T; nv = 0; }
    xs[i] = nx; vs[i] = nv;
  }
  function plusField() {
    const hero = $('.sx-hero'), cont = hero && $('.container', hero);
    if (!cont) return;
    const cv = document.createElement('canvas'), ctx = cv.getContext && cv.getContext('2d');
    if (!ctx) return;
    cv.className = 'sx-field';
    cv.setAttribute('aria-hidden', 'true');
    hero.prepend(cv);
    const MIST = '211,219,228';                       // the only colour in the field
    const CLEAR = 64, FEATHER = 24, PHOTO_GAP = 16;    // keep-clear distances (px)
    const PUSH = 9, SIG = 30, SIG_A = 60, TURN = 20 * Math.PI / 180, REACH = 180;
    const OMEGA = 22;                                  // spring: settles in about 0.2s, critically damped
    const A_OPEN = .26, A_MAX = .55, A_WAVE = .12;
    const WAVE_V = .26, WAVE_W = 80, WAVE_GAP = 4200;
    let W = 0, H = 0, dpr = 1, N = 0, ARM = 4.5, qMax = 0;
    let X, Y, BASE, KF, Q, DX, DY, RT, VX, VY, VR;

    function layout() {
      const hr = hero.getBoundingClientRect();
      dpr = Math.min(2, devicePixelRatio || 1);
      W = hr.width; H = hr.height;
      cv.width = Math.max(1, Math.round(W * dpr)); cv.height = Math.max(1, Math.round(H * dpr));
      const half = dpr === 1 ? .5 : 0, s = W < 700 ? 28 : 32;
      ARM = W < 700 ? 4 : 4.5;
      // Anchor: columns on the content edge (the headline's left), rows on the headline's top.
      const ar = ($('h1', hero) || cont).getBoundingClientRect();
      const x0 = ((ar.left - hr.left) % s + s) % s, y0 = ((ar.top - hr.top) % s + s) % s;
      // Keep-clear boxes (hero coordinates): every rendered line of text, every link and button, every offer-strip
      // item, and the fixed nav's links and buttons where they sit over the hero at the top of the page.
      const keep = [], photo = [];
      const box = (list, r, dy = 0) => { if (r.width > 1 && r.height > 1) list.push([r.left - hr.left, r.top - hr.top + dy, r.right - hr.left, r.bottom - hr.top + dy]); };
      // only what can be seen: a closed dropdown's links are laid out but invisible, and must not carve holes
      const seenEl = el => el.checkVisibility ? el.checkVisibility({ opacityProperty: true, visibilityProperty: true }) : getComputedStyle(el).visibility !== 'hidden';
      const tw = document.createTreeWalker(hero, NodeFilter.SHOW_TEXT), range = document.createRange();
      while (tw.nextNode()) {
        const t = tw.currentNode, pe = t.parentElement;
        if (!t.data.trim() || !pe || pe.closest('canvas, script, style, [hidden], .sx-marquee') || !seenEl(pe)) continue;
        range.selectNodeContents(t);
        for (const r of range.getClientRects()) box(keep, r);
      }
      $$('a, button, .sx-offer li', hero).forEach(el => { if (!el.closest('[hidden], .sx-marquee') && seenEl(el)) box(keep, el.getBoundingClientRect()); });
      const nav = $('.nav');
      if (nav && getComputedStyle(nav).position === 'fixed') $$('a, button', nav).forEach(el => { if (el.offsetParent && seenEl(el)) box(keep, el.getBoundingClientRect(), -scrollY); });
      $$('.sx-hero-photo', hero).forEach(el => box(photo, el.getBoundingClientRect()));
      // Rows: below the fixed nav, and above the offer strip (the field never reaches the strip or the ticker).
      const off = $('.sx-offer', hero), ob = off && off.getBoundingClientRect();
      const yTop = navH() + 22, yBot = ob && ob.height ? ob.top - hr.top : H - 6;
      const pts = [];
      for (let y = y0; y < yBot; y += s) {
        if (y < yTop) continue;
        for (let x = x0; x < W - 6; x += s) {
          if (x < 6) continue;
          let skip = false;
          for (const b of photo) if (x > b[0] - PHOTO_GAP && x < b[2] + PHOTO_GAP && y > b[1] - PHOTO_GAP && y < b[3] + PHOTO_GAP) { skip = true; break; }
          if (skip) continue;
          let d = 1e9;
          for (const b of keep) {
            const dx = Math.max(b[0] - x, 0, x - b[2]), dy = Math.max(b[1] - y, 0, y - b[3]);
            if (dx > d || dy > d) continue;
            const dd = Math.hypot(dx, dy);
            if (dd < d) d = dd;
          }
          // Feathered keep-clear edge: nothing within CLEAR, full strength from CLEAR + FEATHER.
          const k = sstep(clamp((d - CLEAR) / FEATHER, 0, 1));
          if (k > .02) pts.push(x, y, k);
        }
      }
      const same = N === pts.length / 3 && DX; // a relayout that keeps the grid keeps each mark's motion
      N = pts.length / 3;
      X = new Float32Array(N); Y = new Float32Array(N); BASE = new Float32Array(N); KF = new Float32Array(N); Q = new Float32Array(N);
      if (!same) { DX = new Float32Array(N); DY = new Float32Array(N); RT = new Float32Array(N); VX = new Float32Array(N); VY = new Float32Array(N); VR = new Float32Array(N); }
      qMax = 0;
      for (let i = 0; i < N; i++) {
        const x = pts[i * 3], y = pts[i * 3 + 1], k = pts[i * 3 + 2];
        X[i] = Math.round(x) + half; Y[i] = Math.round(y) + half;
        KF[i] = k;
        BASE[i] = A_OPEN * k * (MO ? 1 : .6);           // reduced motion: a static, fainter grid
        Q[i] = x * .8 + y * .6;                          // wave direction: top-left to bottom-right
        if (Q[i] > qMax) qMax = Q[i];
      }
    }

    /* Pointer state (hero coordinates). Velocity is smoothed; the opening follows speed, so a resting pointer
       (or sensor jitter of a pixel or two) leaves the field closed. */
    let px = -1e4, py = -1e4, inside = false, lastMove = -1e9;
    let sx = 0, sy = 0, dirX = 1, dirY = 0, open = 0, lx = null, ly = null;
    let wave = -1, nextWave = 0, raf = 0, last = 0, seen = true, wake = 0;
    // Touch: a virtual pointer that travels a diagonal across the hero as the page scrolls, slowly.
    const touch = !matchMedia('(hover: hover) and (pointer: fine)').matches;
    let vx = 0, vy = 0, vInit = false;
    function point(x, y, now) { px = x; py = y; inside = true; lastMove = now; }
    function scrollTarget() {
      const u = clamp(scrollY / Math.max(1, H * .85), 0, 1);
      return [W * (.12 + .76 * u), H * (.22 + .5 * u)];
    }

    function frame(t) {
      raf = 0;
      const dt = last ? Math.min(.034, (t - last) / 1000) : 1 / 60;
      last = t;
      if (touch) {
        const [tx, ty] = scrollTarget();
        if (!vInit) { vx = tx; vy = ty; vInit = true; }
        const a = 1 - Math.exp(-dt / .45), nx = vx + (tx - vx) * a, ny = vy + (ty - vy) * a;
        if (Math.hypot(nx - vx, ny - vy) > .15) point(nx, ny, t);
        vx = nx; vy = ny;
        if (t - lastMove > 500) inside = false;
      }
      // Smoothed velocity (px/s) from the pointer's travel this frame.
      let ix = 0, iy = 0;
      if (inside && lx !== null) { ix = (px - lx) / dt; iy = (py - ly) / dt; }
      lx = inside ? px : null; ly = inside ? py : null;
      const av = 1 - Math.exp(-dt / .06);
      sx += (ix - sx) * av; sy += (iy - sy) * av;
      const speed = Math.hypot(sx, sy);
      if (speed > 8) { dirX = sx / speed; dirY = sy / speed; }
      const want = inside ? sstep(clamp((speed - 20) / 220, 0, 1)) : 0;
      open += (want - open) * (1 - Math.exp(-dt / (want > open ? .08 : .2)));
      if (open < .002 && want === 0) open = 0;
      // Idle wave: only when the pointer has been still for a while and the field is closed.
      if (wave < 0 && t >= nextWave && t - lastMove > 2200 && open === 0) wave = t;
      const front = wave >= 0 ? (t - wave) * WAVE_V - WAVE_W * 3 : -1e9;
      if (wave >= 0 && front > qMax + WAVE_W * 3) { wave = -1; nextWave = t + WAVE_GAP; }

      // Targets: marks either side of the pointer's path part (odd in the perpendicular offset, so the two sides
      // move apart and turn away from each other), within a short lens around the pointer only.
      const nX = -dirY, nY = dirX, inv2s = 1 / (2 * SIG * SIG), inv2a = 1 / (2 * SIG_A * SIG_A), e = Math.exp(-OMEGA * dt);
      let busy = false;
      for (let i = 0; i < N; i++) {
        let tx = 0, ty = 0, tr = 0;
        if (open > 0) {
          const rx = X[i] - px, ry = Y[i] - py;
          if (rx < REACH && rx > -REACH && ry < REACH && ry > -REACH) {
            const p = nX * rx + nY * ry, a = dirX * rx + dirY * ry;
            const m = open * KF[i] * (p / SIG) * Math.exp(.5 - p * p * inv2s) * Math.exp(-a * a * inv2a);
            if (m > .004 || m < -.004) { tx = nX * PUSH * m; ty = nY * PUSH * m; tr = TURN * m; }
          }
        }
        if (tx || ty || tr || DX[i] || DY[i] || RT[i] || VX[i] || VY[i] || VR[i]) {
          crit(DX, VX, i, tx, OMEGA, dt, e);
          crit(DY, VY, i, ty, OMEGA, dt, e);
          crit(RT, VR, i, tr, OMEGA, dt, e);
          if (!tx && !ty && !tr && Math.abs(DX[i]) + Math.abs(DY[i]) < .02 && Math.abs(VX[i]) + Math.abs(VY[i]) < .05 && Math.abs(RT[i]) < .002 && Math.abs(VR[i]) < .01) {
            DX[i] = DY[i] = RT[i] = VX[i] = VY[i] = VR[i] = 0;
          } else busy = true;
        }
      }
      draw(front);
      if (busy || open > 0 || wave >= 0 || (touch && inside) || (inside && speed > .5)) { kick(); return; }
      last = 0;
      schedule();
    }

    function draw(front) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 1;
      const LV = 40, bk = [];
      for (let i = 0; i < N; i++) {
        let a = BASE[i], L = ARM;
        if (front > -1e8) {
          const q = (Q[i] - front) / WAVE_W, b = Math.exp(-q * q);
          if (b > .01) { a += b * A_WAVE * KF[i]; L += b * .75; }
        }
        const dx = DX[i], dy = DY[i], r = RT[i];
        // A parted mark (a lip) brightens toward 55%, and its arms lengthen a little.
        const o = Math.min(1, Math.hypot(dx, dy) / PUSH);
        a = Math.min(A_MAX, a + o * (A_MAX - A_OPEN) * KF[i]);
        L *= 1 + o * .25;
        const lv = Math.round(a * LV);
        if (!lv) continue;
        const path = bk[lv] || (bk[lv] = new Path2D());
        // One arm whole; the other in two halves that stop at the first arm's edge, so no pixel is painted twice.
        const x = X[i] + dx, y = Y[i] + dy;
        const cs = r === 0 ? 1 : Math.cos(r), sn = r === 0 ? 0 : Math.sin(r);
        path.moveTo(x - cs * L, y - sn * L); path.lineTo(x + cs * L, y + sn * L);
        path.moveTo(x + sn * .5, y - cs * .5); path.lineTo(x + sn * L, y - cs * L);
        path.moveTo(x - sn * .5, y + cs * .5); path.lineTo(x - sn * L, y + cs * L);
      }
      bk.forEach((path, lv) => { if (path) { ctx.strokeStyle = `rgba(${MIST},${(lv / LV).toFixed(3)})`; ctx.stroke(path); } });
    }

    const blocked = () => !seen || document.hidden || !!document.querySelector('dialog[open]');
    function kick() {
      if (raf || !MO) return;
      if (blocked()) { clearTimeout(wake); if (seen && !document.hidden) wake = setTimeout(kick, 400); return; } // the intro: look again shortly
      raf = requestAnimationFrame(frame);
    }
    function schedule() {
      clearTimeout(wake);
      if (blocked()) return;
      wake = setTimeout(kick, Math.max(60, Math.max(nextWave, lastMove + 2200) - performance.now()));
    }

    layout();
    draw(-1e9);
    let rq = 0;
    const relayout = () => { if (!rq) rq = requestAnimationFrame(() => { rq = 0; layout(); draw(-1e9); kick(); }); };
    if ('ResizeObserver' in window) new ResizeObserver(relayout).observe(hero); else addEventListener('resize', relayout, { passive: true });
    // Text settles after the fonts load (and the replay control appears after the intro): measure again.
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout);
    addEventListener('load', relayout);
    setTimeout(relayout, 1100); setTimeout(relayout, 2400);
    if (!MO) return;
    nextWave = performance.now() + 600;
    if (IO) new IntersectionObserver(es => { seen = es[es.length - 1].isIntersecting; if (seen) { last = 0; kick(); } }).observe(hero);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) { last = 0; kick(); } });
    const local = e => { const r = hero.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    hero.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      const [x, y] = local(e);
      point(x, y, performance.now());
      kick();
    }, { passive: true });
    hero.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse' || e.pointerType === 'pen') { inside = false; kick(); } });
    if (touch) addEventListener('scroll', kick, { passive: true });
    kick();
  }

  /* ── Below the hero: one short entrance (≤400ms) as each block enters view. Headings rise out of
       descender-safe masks; copy, links and buttons fade up. Service rows enter one by one. ── */
  function reveals() {
    const blocks = $$('.sx-reveal'), rows = $$('.sx-row');
    if (!MO || !IO) { [...blocks, ...rows].forEach(b => b.classList.add('is-in')); return; }
    blocks.forEach(b => $$('.sx-h2, .sx-manifesto-text', b).forEach(split));
    const io = new IntersectionObserver(es => {
      let n = 0;
      es.forEach(e => {
        if (!e.isIntersecting) return;
        const b = e.target;
        io.unobserve(b);
        $$('.sx-split', b).forEach(lines);
        // blocks that arrive together are staggered by a beat, never more than 120ms
        b.style.setProperty('--sx-bd', `${Math.min(n++, 2) * 60}ms`);
        b.classList.add('is-in');
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0 });
    [...blocks, ...rows].forEach(b => io.observe(b));
    // keyboard focus never waits on an entrance: a block that receives focus is shown at once
    document.addEventListener('focusin', e => {
      const t = e.target;
      if (!t.closest || !t.closest('.sx-home')) return;
      const hit = [];
      for (let el = t.closest('.sx-reveal, .sx-row'); el; el = el.parentElement && el.parentElement.closest('.sx-reveal, .sx-row')) if (!el.classList.contains('is-in')) hit.push(el);
      if (!hit.length) return;
      hit.forEach(el => { io.unobserve(el); $$('.sx-split', el).forEach(lines); el.classList.add('sx-now', 'is-in'); });
      requestAnimationFrame(() => requestAnimationFrame(() => hit.forEach(el => el.classList.remove('sx-now'))));
    });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => blocks.forEach(b => $$('.sx-split', b).forEach(lines)));
  }

  /* ── Question story: pinned on wide, tall screens (a three-step narrative, not browsing); the questions advance
       with scroll. The pinned band (stepper + question left, visual right) is held centred under the nav while 200vh
       of scroll moves it through its three steps. A step change never shows two states: the outgoing one fades out
       (120ms), then the incoming one fades up (200ms) — all in CSS. Phones, short screens, reduced motion and no-JS
       get the plain stacked list. ── */
  function story() {
    const st = $('.sx-story');
    if (!st) return;
    const track = $('.sx-story-track', st), pin = $('.sx-story-pin', st), grid = $('.sx-story-grid', st), list = $('.sx-steps', st);
    const steps = $$('.sx-step', st), n = steps.length, vis = steps.map(s => $('.sx-step-visual', s));
    const mq = matchMedia('(min-width: 1000px) and (min-height: 700px)');
    let pinned = false, current = -1, ticking = false, stick = 0;

    // Stepper: each step is labelled with its own link title ("Evaluate a product", ...).
    const nav = document.createElement('div');
    nav.className = 'sx-story-nav';
    nav.setAttribute('role', 'group');
    nav.setAttribute('aria-labelledby', 'sx-story-title');
    const btns = steps.map((s, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      const num = document.createElement('span');
      num.className = 'sx-story-num';
      num.textContent = String(i + 1).padStart(2, '0');
      const label = document.createElement('span');
      label.className = 'sx-story-label';
      label.textContent = (s.querySelector('.sx-step-cta strong') || s.querySelector('h3')).textContent.trim();
      b.append(num, label);
      b.addEventListener('click', () => goTo(i));
      nav.append(b);
      return b;
    });
    grid.insertBefore(nav, list);

    // Where the band rests: centred in the space under the nav (never closer than 8px to it).
    function metrics() {
      stick = Math.round(Math.max(navH() + 8, (innerHeight + navH() - pin.offsetHeight) / 2));
      st.style.setProperty('--sx-pin-top', `${stick}px`);
    }
    const span = () => Math.max(1, track.offsetHeight - pin.offsetHeight);
    function goTo(i, instant) {
      const y = track.getBoundingClientRect().top + scrollY - stick + span() * ((i + .3) / n);
      if (RM || instant) jump(y); else scrollTo({ top: y, behavior: 'smooth' });
    }
    function set(i) {
      if (i === current) return;
      current = i;
      st.dataset.step = String(i);
      steps.forEach((s, k) => s.classList.toggle('is-active', k === i));
      vis.forEach((v, k) => v.classList.toggle('is-shown', k === i));
      btns.forEach((b, k) => (k === i ? b.setAttribute('aria-current', 'step') : b.removeAttribute('aria-current')));
    }
    function update() {
      ticking = false;
      if (!pinned) return;
      const p = clamp((stick - track.getBoundingClientRect().top) / span(), 0, 1);
      set(Math.min(n - 1, Math.floor(p * n)));
    }
    function mode() {
      pinned = mq.matches && MO;
      st.classList.toggle('is-pinned', pinned);
      current = -1;
      if (!pinned) {
        delete st.dataset.step;
        st.style.removeProperty('--sx-pin-top');
        steps.forEach(s => s.classList.remove('is-active'));
        vis.forEach(v => v.classList.remove('is-shown'));
        btns.forEach(b => b.removeAttribute('aria-current'));
        return;
      }
      metrics();
      update();
    }
    const queue = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    addEventListener('scroll', queue, { passive: true });
    addEventListener('resize', () => { if (pinned) metrics(); queue(); });
    mq.addEventListener ? mq.addEventListener('change', mode) : mq.addListener(mode);
    // Keyboard users: tabbing into a question that is not on screen scrolls the story to it.
    st.addEventListener('focusin', e => {
      if (!pinned) return;
      st.classList.add('is-kbd');
      const s = e.target.closest('.sx-step');
      if (s && steps.indexOf(s) !== current) { goTo(steps.indexOf(s), true); update(); }
    });
    st.addEventListener('focusout', e => { if (!st.contains(e.relatedTarget)) st.classList.remove('is-kbd'); });
    st.addEventListener('pointerdown', () => st.classList.remove('is-kbd'));
    mode();
  }

  /* ── Product showcase: tabs swap the stage and filter the products (plus the closing "full portfolio" card).
       A native horizontal scroll-snap rail: drag with a mouse (with a little throw), swipe, trackpad, keyboard, or
       step one card at a time with the buttons; each move lands a card on the left edge. The counter and the gold
       rule always name the leftmost fully visible card. When every card already fits, the counter, track and
       arrows are hidden. A tab change: the cards on screen leave one after another, then the new set arrives one
       after another (never all half-faded at once). No JS: everything is listed. ── */
  function showcase() {
    const show = $('[data-show]');
    if (!show) return;
    const tablist = $('[role="tablist"]', show), tabs = $$('[role="tab"]', tablist), ink = $('.sx-tab-ink', tablist);
    const panels = tabs.map(t => document.getElementById(t.getAttribute('aria-controls').split(/\s+/)[0]));
    const rail = $('[data-rail]', show), tiles = $$('.sx-tile', rail), ctrl = $('.sx-rail-ctrl', show);
    const meter = $('.sx-rail-meter span', ctrl), [prev, next] = $$('.sx-rail-btn', ctrl);
    let active = 0, raf = 0, items = [], idx = -1, near = null, fits = false, aim = -1, aimT = 0, swapping = false;

    // index counter ("01 / 11"): decorative, the card list itself is the accessible content
    const count = document.createElement('span');
    count.className = 'sx-count';
    count.setAttribute('aria-hidden', 'true');
    count.innerHTML = '<span class="sx-count-cur"><span class="sx-count-n">01</span></span><span class="sx-count-tot"></span>';
    const cn = $('.sx-count-n', count), tot = $('.sx-count-tot', count);
    ctrl.prepend(count);

    show.classList.add('is-live');
    tablist.hidden = false;
    panels.forEach((p, i) => { p.setAttribute('role', 'tabpanel'); p.setAttribute('aria-labelledby', tabs[i].id); });

    const shown = () => tiles.filter(t => !t.hidden);
    const behavior = () => (RM ? 'auto' : 'smooth');
    const pad = () => parseFloat(getComputedStyle(rail).paddingLeft) || 0;
    const two = v => String(v).padStart(2, '0');
    const maxScroll = () => Math.max(0, rail.scrollWidth - rail.clientWidth);

    function measure() {
      items = shown().map(t => ({ el: t, left: t.offsetLeft, w: t.offsetWidth, prod: !!t.dataset.cat }));
      tot.textContent = `/ ${two(items.filter(o => o.prod).length)}`;
      fits = maxScroll() <= 2;
      ctrl.hidden = fits; // every card is already in view: no counter, track or arrows
      kick();
    }
    function setIndex(i) {
      if (i === idx) return;
      const first = idx < 0;
      idx = i;
      cn.textContent = two(i + 1);
      // one number in one fixed box: the new one simply replaces the old and settles a hair upward (no overlap, no clip)
      if (!first && MO && cn.animate) cn.animate([{ transform: 'translateY(.1em)', opacity: .45 }, { transform: 'none', opacity: 1 }], { duration: 220, easing: 'cubic-bezier(.16,1,.3,1)' });
    }
    function frame() {
      raf = 0;
      const sl = rail.scrollLeft, max = maxScroll(), pl = pad(), lo = sl + pl - 1, hi = sl + rail.clientWidth - pl + 1;
      // the leftmost product card that is fully in view; mid-swipe, when none is, the one most in view
      let el = null, bi = 0, k = 0, most = -1, mk = 0, mel = null;
      for (const it of items) {
        if (!it.prod) continue;
        if (it.left >= lo && it.left + it.w <= hi) { el = it.el; bi = k; break; }
        const v = Math.min(it.left + it.w, hi) - Math.max(it.left, lo);
        if (v > most) { most = v; mk = k; mel = it.el; }
        k++;
      }
      if (!el) { el = mel; bi = mk; }
      if (fits) el = null;
      if (el !== near) { if (near) near.classList.remove('is-near'); near = el; if (near) near.classList.add('is-near'); }
      setIndex(bi);
      meter.style.setProperty('--p', max > 2 ? (.08 + .92 * clamp(sl / max, 0, 1)).toFixed(3) : '1');
      prev.setAttribute('aria-disabled', String(max <= 2 || sl <= 2));
      next.setAttribute('aria-disabled', String(max <= 2 || sl >= max - 2));
    }
    function kick() { if (!raf) raf = requestAnimationFrame(frame); }

    function moveInk() {
      const t = tabs[active];
      ink.style.setProperty('--x', `${t.offsetLeft}px`);
      ink.style.setProperty('--w', `${t.offsetWidth}px`);
    }
    const inView = () => {
      const lo = rail.scrollLeft, hi = lo + rail.clientWidth;
      return shown().filter(t => t.offsetLeft + t.offsetWidth > lo && t.offsetLeft < hi);
    };
    // Show the chosen category; with animateIn, its stage fades up and its cards arrive one after another.
    function apply(animateIn) {
      const cat = tabs[active].dataset.cat;
      panels.forEach((p, k) => p.classList.toggle('is-active', k === active));
      tiles.forEach(t => { t.hidden = !(!t.dataset.cat || t.dataset.cat === cat); });
      rail.classList.remove('is-drag', 'is-free');
      rail.scrollTo({ left: 0, behavior: 'instant' });
      idx = -1; aim = -1;
      measure();
      if (!animateIn) return;
      panels[active].animate([{ opacity: 0 }, { opacity: 1 }], { duration: 200, easing: 'ease-out', fill: 'backwards' });
      inView().forEach((t, k) => {
        t.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 240, delay: k * 35, easing: 'ease-out', fill: 'backwards' });
        const img = $('.sx-tile-media img', t);
        if (img) img.animate([{ scale: 1.03 }, { scale: 1 }], { duration: 420, delay: k * 35, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards' });
      });
    }
    function select(i, { focus = false, animate = true } = {}) {
      active = (i + tabs.length) % tabs.length;
      tabs.forEach((t, k) => { const on = k === active; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
      moveInk();
      if (focus) tabs[active].focus();
      if (!animate || !MO || !show.animate) { apply(false); return; }
      if (swapping) return; // the exit already under way lands on the latest choice
      swapping = true;
      // out first: the stage fades (120ms) and the cards on screen leave 30ms apart; only then does the new set come in
      const outs = [];
      const old = panels.find(p => p.classList.contains('is-active'));
      if (old) outs.push(old.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 120, easing: 'ease-in', fill: 'forwards' }));
      inView().forEach((t, k) => outs.push(t.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 110, delay: k * 30, easing: 'ease-in', fill: 'forwards' })));
      Promise.all(outs.map(a => a.finished.catch(() => {}))).then(() => {
        swapping = false;
        apply(true);
        outs.forEach(a => a.cancel());
      });
    }

    tabs.forEach((t, i) => t.addEventListener('click', () => { if (i !== active) select(i); }));
    tablist.addEventListener('keydown', e => {
      const map = { ArrowRight: active + 1, ArrowDown: active + 1, ArrowLeft: active - 1, ArrowUp: active - 1, Home: 0, End: tabs.length - 1 };
      if (!(e.key in map)) return;
      e.preventDefault();
      select(map[e.key], { focus: true });
    });
    rail.addEventListener('scroll', kick, { passive: true });

    // One card per press. Presses during a glide count on from where the glide is going.
    const leftIdx = () => { const lo = rail.scrollLeft + pad() - 1, i = items.findIndex(it => it.left >= lo); return i < 0 ? items.length - 1 : i; };
    const lastIdx = () => { const max = maxScroll(), p = pad(), i = items.findIndex(it => it.left - p >= max - 1); return i < 0 ? items.length - 1 : i; };
    function stepTo(j) {
      const it = items[j];
      if (!it) return;
      aim = j;
      clearTimeout(aimT);
      aimT = setTimeout(() => { aim = -1; }, 900);
      rail.scrollTo({ left: clamp(it.left - pad(), 0, maxScroll()), behavior: behavior() });
    }
    function page(dir) {
      if (items.length < 2) return;
      stepTo(clamp((aim >= 0 ? aim : leftIdx()) + dir, 0, lastIdx()));
    }
    if ('onscrollend' in rail) rail.addEventListener('scrollend', () => { aim = -1; });
    prev.addEventListener('click', () => { if (prev.getAttribute('aria-disabled') !== 'true') page(-1); });
    next.addEventListener('click', () => { if (next.getAttribute('aria-disabled') !== 'true') page(1); });

    // Keyboard: arrow keys move between cards; the focused card comes to the left edge (as far as the rail goes),
    // so the counter and its rule follow it.
    rail.addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const links = items.map(it => it.el.querySelector('a'));
      const i = links.indexOf(document.activeElement);
      if (i < 0) return;
      const j = clamp(i + (e.key === 'ArrowRight' ? 1 : -1), 0, links.length - 1);
      if (j === i) return;
      e.preventDefault();
      links[j].focus({ preventScroll: true });
      stepTo(j);
    });

    // Mouse drag: the rail follows the pointer 1:1 (snap off), then is thrown to the nearest card's left edge.
    // Touch and trackpads keep native scrolling.
    let drag = null, dragged = false, free = 0;
    const release = () => { clearTimeout(free); rail.classList.remove('is-free'); };
    rail.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse' || e.button !== 0 || maxScroll() < 2) return;
      drag = { x: e.clientX, sl: rail.scrollLeft, moved: false, hist: [{ x: e.clientX, t: e.timeStamp }] };
    });
    addEventListener('pointermove', e => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) > 6) { drag.moved = true; clearTimeout(free); rail.classList.add('is-drag', 'is-free'); const sel = getSelection(); if (sel) sel.removeAllRanges(); }
      if (!drag.moved) return;
      rail.scrollLeft = drag.sl - dx;
      drag.hist.push({ x: e.clientX, t: e.timeStamp });
      if (drag.hist.length > 6) drag.hist.shift();
    });
    const up = () => {
      if (!drag) return;
      const d = drag;
      drag = null;
      rail.classList.remove('is-drag');
      if (!d.moved) return;
      dragged = true;
      setTimeout(() => { dragged = false; }, 60);
      const a = d.hist[0], b = d.hist[d.hist.length - 1];
      const v = b.t > a.t ? clamp((b.x - a.x) / (b.t - a.t), -3, 3) : 0; // px per ms
      const want = rail.scrollLeft - v * 200, p = pad();
      let j = 0;
      items.forEach((it, k) => { if (Math.abs(it.left - p - want) < Math.abs(items[j].left - p - want)) j = k; });
      stepTo(Math.min(j, lastIdx()));
      // snapping comes back once the throw has landed
      if ('onscrollend' in rail) rail.addEventListener('scrollend', release, { once: true });
      free = setTimeout(release, 900);
    };
    addEventListener('pointerup', up);
    addEventListener('pointercancel', up);
    rail.addEventListener('click', e => { if (dragged) { e.preventDefault(); e.stopPropagation(); } }, true);

    let rt;
    const relayout = () => { clearTimeout(rt); rt = setTimeout(() => { measure(); moveInk(); }, 120); };
    addEventListener('resize', relayout);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { moveInk(); measure(); });
    addEventListener('load', () => measure());
    select(0, { animate: false });
  }

  /* ── Evidence: the four connectors draw out of the hub with the scroll; each node's gold rule lights as its
       line arrives. The words are always visible. ── */
  function evidence() {
    const map = $('.sx-ev-map');
    if (!map || !MO) return;
    const paths = $$('.sx-ev-lines path', map), nodes = $$('.sx-ev-nodes li', map), hub = $('.sx-ev-hub', map);
    const mq = matchMedia('(min-width: 701px)');
    let tk = false, on = false;
    function update() {
      tk = false;
      if (!on) return;
      const r = map.getBoundingClientRect(), vh = innerHeight;
      const p = clamp((vh * .92 - r.top) / (vh * .5), 0, 1);
      hub.style.setProperty('--hp', sstep(clamp(p / .3, 0, 1)).toFixed(3));
      paths.forEach((path, i) => {
        const d = sstep(clamp((p - .1 - i * .1) / .5, 0, 1));
        path.style.clipPath = `inset(-40% ${((1 - d) * 100).toFixed(2)}% -40% 0)`;
        if (nodes[i]) nodes[i].classList.toggle('is-lit', d > .97);
      });
    }
    function mode() {
      on = mq.matches;
      map.classList.toggle('is-draw', on);
      if (!on) { paths.forEach(p => { p.style.clipPath = ''; }); nodes.forEach(nd => nd.classList.remove('is-lit')); hub.style.removeProperty('--hp'); }
      update();
    }
    addEventListener('scroll', () => { if (on && !tk) { tk = true; requestAnimationFrame(update); } }, { passive: true });
    addEventListener('resize', () => { if (!tk) { tk = true; requestAnimationFrame(update); } });
    mq.addEventListener ? mq.addEventListener('change', mode) : mq.addListener(mode);
    mode();
  }

  /* ── Hovers: buttons, step links and service rows change colour as a whole (CSS; the same vocabulary as the shared
       layer, no sweeps). Here: the service rows' "+" mark, and drawn underlines on text links. ── */
  function hovers() {
    // service rows: a "+" turns into place where the arrow was
    $$('.sx-row').forEach(row => {
      const p = document.createElement('span');
      p.className = 'sx-row-plus';
      p.setAttribute('aria-hidden', 'true');
      row.append(p);
    });
    const place = () => $$('.sx-row').forEach(row => {
      const a = $('.sx-row-arrow', row);
      if (a) row.style.setProperty('--plus-y', `${a.offsetTop + a.offsetHeight / 2 - 18}px`);
    });
    place();
    addEventListener('resize', place);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);
    // text links: wrap the label so the underline can draw under the words only (the arrow is never underlined)
    $$('.sx-home :is(.sx-link, .sx-panel-links a, .sx-contact-link)').forEach(a => {
      const t = [...a.childNodes].find(nd => nd.nodeType === 3 && nd.textContent.trim());
      if (!t) return;
      const s = document.createElement('span');
      s.className = 'sx-ul';
      t.replaceWith(s);
      s.append(t);
      a.classList.add('is-ul');
    });
  }

  /* ── Closing statement: arrives light and open, then settles to its set weight within 900ms. The starting
       tracking is chosen so each line keeps its length, so nothing re-wraps and it reads the whole time. ── */
  function closing() {
    const t = $('.sx-cta-title');
    if (!t || !MO) return;
    const fit = () => {
      const c = t.cloneNode(true);
      c.removeAttribute('id');
      c.setAttribute('aria-hidden', 'true');
      Object.assign(c.style, { position: 'absolute', left: '0', top: '0', visibility: 'hidden', whiteSpace: 'nowrap', width: 'auto', maxWidth: 'none', transition: 'none', letterSpacing: '-.022em', fontWeight: '600' });
      t.parentNode.append(c);
      const w6 = c.getBoundingClientRect().width;
      c.style.fontWeight = '300';
      const w3 = c.getBoundingClientRect().width;
      c.remove();
      const fs = parseFloat(getComputedStyle(t).fontSize) || 16, n = Math.max(1, t.textContent.length);
      t.style.setProperty('--sx-ls0', `${(-.022 + Math.max(0, w6 - w3) / (n * fs)).toFixed(4)}em`);
    };
    fit();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    addEventListener('resize', fit);
  }

  /* ── Ticker: keeps moving by default (owner's choice), can be stopped (WCAG 2.2.2), rests while off screen.
       The control sits in its own slot at the end of the band, outside the moving names. ── */
  function ticker() {
    const m = $('.sx-marquee');
    if (!m || RM) return;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'sx-marquee-toggle';
    const sync = paused => {
      m.classList.toggle('is-paused', paused);
      b.setAttribute('aria-pressed', String(paused));
      b.setAttribute('aria-label', paused ? 'Play product names' : 'Pause product names');
    };
    b.addEventListener('click', () => sync(!m.classList.contains('is-paused')));
    sync(false);
    m.classList.add('has-toggle');
    m.append(b);
    if (IO) new IntersectionObserver(([e]) => m.classList.toggle('is-off', !e.isIntersecting)).observe(m);
  }

  [plusField, hovers, reveals, story, showcase, evidence, closing, ticker].forEach(safe);
})();
