/* m9-grades (Futurist v9): the evidence hero's grade matrix. Decorative (the mount is aria-hidden) and drawn from the
   page itself, so it always matches it: one square cell per graded product (each product header's grade,
   .ev-head .ev-grade--a/b/c/d; products not clinically graded are left out), stacked in four columns from A to D on a
   hairline lattice, filled in tints of the accent (A strongest). No words, no numbers.
   On load a scan line rises through it and each row fills as the line passes; with reduced motion it is drawn at once.
   Mount: <div class="m9g" data-m9-grades aria-hidden="true"></div>. Its box is reserved by assets/css/m9-hero.css
   (only when JS runs); if the page has no graded products the mount is hidden. */
(() => {
  const el = document.querySelector('[data-m9-grades]');
  if (!el) return;
  const NS = 'http://www.w3.org/2000/svg';
  const KEYS = ['a', 'b', 'c', 'd'];
  const n = { a: 0, b: 0, c: 0, d: 0 };
  document.querySelectorAll('main .ev-head .ev-grade').forEach(g => {
    const k = KEYS.find(x => g.classList.contains('ev-grade--' + x));
    if (k) n[k]++;
  });
  const max = Math.max(n.a, n.b, n.c, n.d);
  if (!max) { el.hidden = true; return; }

  // geometry (user units): cells on a pitch, a few columns per grade, a gutter between grades; the lattice runs two
  // rows above the tallest stack; a margin inside the corner marks
  const P = 30, C = 22, IN = (P - C) / 2, GUT = 18, M = 34;
  const per = max <= 12 ? 2 : max <= 27 ? 3 : 4;
  const W = 4 * per * P + 3 * GUT;
  const rows = Math.max(Math.ceil(max / per) + 2, 5);
  const H = rows * P;
  const gx = i => i * (per * P + GUT);

  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', `${-M} ${-M} ${W + 2 * M} ${H + 2 * M}`);
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  svg.setAttribute('focusable', 'false');
  svg.setAttribute('aria-hidden', 'true');
  const add = (tag, attrs, parent) => {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) e.setAttribute(k, attrs[k]);
    (parent || svg).appendChild(e);
    return e;
  };

  // the lattice: each grade's own graph paper
  let d = '';
  for (let i = 0; i < 4; i++) {
    const x0 = gx(i);
    for (let c = 0; c <= per; c++) d += `M${x0 + c * P} 0V${H}`;
    for (let r = 0; r < rows; r++) d += `M${x0} ${r * P}H${x0 + per * P}`;
  }
  add('path', { class: 'm9g-lat', d });
  // the baseline, with a short tick under each grade
  let b = `M0 ${H}H${W}`;
  for (let i = 0; i < 4; i++) b += `M${gx(i) + per * P / 2} ${H}v8`;
  add('path', { class: 'm9g-base', d: b });

  // the cells, bottom row first, left to right within a grade; each row fills when the scan line (eased with the
  // house curve, cubic-bezier(.22,.61,.36,1)) reaches its middle
  const rise = Math.ceil(max / per), top = rise * P + P / 2;
  const T = .5 + rise * .14, LAG = .12;
  const bz = (a, b, t) => 3 * a * t * (1 - t) * (1 - t) + 3 * b * t * t * (1 - t) + t * t * t;
  const when = f => { let lo = 0, hi = 1; for (let i = 0; i < 24; i++) { const m = (lo + hi) / 2; if (bz(.61, 1, m) < f) lo = m; else hi = m; } return bz(.22, .36, lo); };
  KEYS.forEach((k, i) => {
    for (let j = 0; j < n[k]; j++) {
      const r = Math.floor(j / per), c = j % per;
      const cell = add('rect', {
        class: 'm9g-c m9g-c--' + k,
        x: gx(i) + c * P + IN, y: H - (r + 1) * P + IN, width: C, height: C, rx: 2
      });
      cell.style.setProperty('--d', (LAG + when((r + .5) * P / top) * T).toFixed(3) + 's');
    }
  });
  // the scan line: from the baseline up past the tallest stack
  const scan = add('line', { class: 'm9g-scan', x1: -6, x2: W + 6, y1: H, y2: H });
  scan.style.setProperty('--rise', -top + 'px');
  el.style.setProperty('--t', T.toFixed(2) + 's');

  el.style.aspectRatio = `${W + 2 * M} / ${H + 2 * M}`;
  el.appendChild(svg);
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches) el.classList.add('is-scan');
})();
