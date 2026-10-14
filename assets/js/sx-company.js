/* Company & services pages (house style, Oct 2026; v5 Oct 14).
   1) Route diagrams (P1, v6): a 1px track with '+' stations runs along each step list; a 2px navy line draws
      over it with the scroll. The step being read (the last station the reading line has passed, or on a
      horizontal row the step whose share of the row's travel the scroll is in) gets a filled gold dot, and its
      heading stays at full strength while the others dim (still AA). Decoration only: an aria-hidden SVG beside
      the steps' own markup. Under reduced motion it is drawn complete and still, with no step singled out.
   2) One quiet reveal per content block that starts below the fold: opacity plus a 12px rise, once.
   Nothing is hidden without this script, without IntersectionObserver, or under reduced motion. */
(() => {
  'use strict';
  const doc = document, root = doc.documentElement;
  root.classList.add('sx-js', 'sx-co-ready');
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasIO = 'IntersectionObserver' in window;
  const clamp = v => (v < 0 ? 0 : v > 1 ? 1 : v);
  const safe = fn => { try { fn(); } catch (err) { if (window.console) console.warn('sx-company:', err); } };

  safe(routes); // first: it wraps each step list, so the wrapper takes that block's single reveal
  safe(fades);

  function fades() {
    if (calm || !hasIO) return;
    const blocks = [...doc.querySelectorAll('main :is(section, .sx-band) > .container > *, main .services-direct')]
      .filter(el => !el.hidden && !el.closest('.hero, .sx-co-hero, .services-workspace'));
    const fold = innerHeight * 0.92;
    const io = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    }), {rootMargin: '0px 0px -8% 0px', threshold: 0});
    blocks.forEach(el => {
      if (el.getBoundingClientRect().top < fold) return; // already on screen: no entrance
      el.classList.add('sx-reveal', 'sx-fade');
      io.observe(el);
    });
    addEventListener('beforeprint', () => blocks.forEach(el => el.classList.add('is-in')));
  }

  function routes() {
    const NS = 'http://www.w3.org/2000/svg';
    // list, its steps, and the element a station lines up with when the line runs down the margin
    const SETS = [
      ['.process-grid', '.process-step', '.step-num'],
      ['.rcm-process', '.rcm-step', '.step-num'],
      ['.cs-caps', '.cs-cap', 'h4'],
      ['.wp-caps', '.wp-cap', 'h4']
    ];
    // Where the reader is: a vertical route is drawn down to this line, and the step it last passed is current.
    const READ = 0.55;
    // Horizontal rows are read while the list travels from its first row's top at 85% of the viewport to its last
    // row's top at 30%; each step gets an equal share of that travel, in reading order, so the current step
    // follows the scroll position exactly and rows take their turns one after another.
    const ROW_IN = 0.85, ROW_OUT = 0.30;
    const make = (tag, attrs) => { const n = doc.createElementNS(NS, tag); for (const k in attrs) n.setAttribute(k, attrs[k]); return n; };
    SETS.forEach(([list, item, anchor]) => doc.querySelectorAll('main ' + list).forEach(box => {
      const steps = [...box.children].filter(c => c.matches(item));
      if (steps.length > 1) safe(() => route(box, steps, anchor));
    }));


    function route(box, steps, anchorSel) {
      const wrap = doc.createElement('div');
      wrap.className = 'sx-route-wrap';
      box.before(wrap);
      wrap.append(box);
      box.classList.add('sx-route');
      const svg = make('svg', {class: 'sx-route-svg', 'aria-hidden': 'true', focusable: 'false'});
      const gTrack = make('g', {}), gLine = make('g', {}), gNode = make('g', {});
      svg.append(gTrack, gLine, gNode);
      wrap.append(svg);
      const nodes = steps.map(() => {
        const g = make('g', {class: 'rt-node'});
        const mark = make('g', {class: 'rt-mark'});
        mark.append(make('path', {d: 'M-6 0H6M0-6V6'}));
        g.append(mark, make('circle', {class: 'rt-dot', r: '5'}));
        gNode.append(g);
        return g;
      });

      let segs = [], at = [], cur = [], reached = [], active = -1;
      let raf = 0, prev = 0, seen = !hasIO;

      function addSeg(kind, a, len, d) {
        gTrack.append(make('path', {class: 'rt-track', d}));
        const line = make('path', {class: 'rt-line', d, pathLength: '1'});
        gLine.append(line);
        segs.push({kind, a, len, line});
      }
      function layout() {
        const cs = getComputedStyle(box);
        const vertical = cs.getPropertyValue('--route').trim() === 'v';
        const br = box.getBoundingClientRect();
        const W = br.width, H = br.height;
        svg.style.left = box.offsetLeft + 'px';
        svg.style.top = box.offsetTop + 'px';
        svg.setAttribute('width', W); svg.setAttribute('height', H);
        svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
        gTrack.textContent = ''; gLine.textContent = '';
        const before = segs.map(s => s.kind).join();
        segs = []; at = [];
        if (vertical) {
          const x = parseFloat(cs.getPropertyValue('--route-x')) || 8;
          // a station sits on the first line of its label; the spine runs on to the end of the last step,
          // so the last step has its own stretch of line (and its own turn as the current step)
          const ys = steps.map(s => {
            const a = s.querySelector(anchorSel) || s;
            const r = a.getBoundingClientRect();
            const lh = parseFloat(getComputedStyle(a).lineHeight) || r.height;
            return r.top - br.top + Math.min(lh, r.height) / 2;
          });
          const last = steps[steps.length - 1].getBoundingClientRect();
          const y0 = ys[0], yEnd = Math.max(ys[ys.length - 1] + 24, last.bottom - br.top - 12);
          const len = Math.max(1, yEnd - y0);
          addSeg('v', y0, len, `M${x} ${y0}V${yEnd}`);
          ys.forEach((y, i) => { at[i] = {seg: 0, p: (y - y0) / len}; nodes[i].setAttribute('transform', `translate(${x} ${y})`); });
        } else {
          // one line per row, along the row's top edge; a station where each step's text begins
          const rows = [];
          steps.forEach((s, i) => {
            const r = s.getBoundingClientRect();
            const x = r.left - br.left + (parseFloat(getComputedStyle(s).paddingLeft) || 0);
            const y = r.top - br.top;
            let row = rows.find(q => Math.abs(q.y - y) < 4);
            if (!row) rows.push(row = {y, items: []});
            row.items.push({i, x});
          });
          // Rows are read one after another: the steps share the list's scroll travel equally in reading order,
          // so a second row does not start before the first is finished.
          let from = 0;
          rows.forEach((row, k) => {
            addSeg('h', row.y, W, `M0 ${row.y}H${W}`);
            const n = row.items.length;
            Object.assign(segs[k], {from, n, y0: rows[0].y, y1: rows[rows.length - 1].y, total: steps.length});
            from += n;
            // stations are drawn where the text starts, but each step's turn is an equal share of the row
            row.items.forEach(({i, x}, j) => { at[i] = {seg: k, p: j / n}; nodes[i].setAttribute('transform', `translate(${x} ${row.y})`); });
          });
        }
        if (segs.map(s => s.kind).join() !== before) cur = calm ? segs.map(() => 1) : targets();
      }
      function targets() {
        const vh = innerHeight, top = box.getBoundingClientRect().top;
        const end = scrollY + vh >= root.scrollHeight - 4; // the page cannot scroll further: finish
        return segs.map(s => {
          if (end) return 1;
          if (s.kind === 'v') return clamp((vh * READ - (top + s.a)) / s.len);
          const g = clamp((vh * ROW_IN - (top + s.y0)) / (s.y1 - s.y0 + vh * (ROW_IN - ROW_OUT)));
          return clamp((g * s.total - s.from) / s.n);
        });
      }
      function render() {
        segs.forEach((s, k) => { s.line.style.strokeDashoffset = cur[k] < 0.001 ? '1.02' : (1 - cur[k]).toFixed(4); });
        let last = -1;
        nodes.forEach((g, i) => {
          const c = cur[at[i].seg];
          const on = c > 0.002 && c >= at[i].p - 0.004;
          if (on !== reached[i]) { reached[i] = on; g.classList.toggle('is-reached', on); steps[i].classList.toggle('is-reached', on); }
          if (on) last = i;
        });
        // the drawing complete (or not begun): no step singled out, every heading at full strength
        const act = cur.every(c => c > 0.999) ? -1 : last;
        if (act !== active) {
          if (active >= 0) { nodes[active].classList.remove('is-active'); steps[active].classList.remove('is-active'); }
          active = act;
          if (act >= 0) { nodes[act].classList.add('is-active'); steps[act].classList.add('is-active'); }
          box.classList.toggle('has-active', act >= 0);
        }
      }

      layout();
      render();
      let rq = 0;
      const relayout = () => { if (!rq) rq = requestAnimationFrame(() => { rq = 0; layout(); render(); kick(); }); };
      if ('ResizeObserver' in window) new ResizeObserver(relayout).observe(box);
      else addEventListener('resize', relayout, {passive: true});
      if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(relayout);
      addEventListener('beforeprint', () => { cur = segs.map(() => 1); render(); });
      if (calm) return;

      // Scroll-linked with a short physical lag; runs only while the list is on screen and something moves.
      function frame(t) {
        raf = 0;
        const dt = prev ? Math.min(64, t - prev) : 16;
        prev = t;
        const k = 1 - Math.exp(-dt / 90);
        const tg = targets();
        let moving = false;
        for (let i = 0; i < cur.length; i++) {
          const d = tg[i] - cur[i];
          if (Math.abs(d) > 0.0006) { cur[i] += d * k; moving = true; } else cur[i] = tg[i];
        }
        render();
        if (moving) raf = requestAnimationFrame(frame); else prev = 0;
      }
      function kick() { if (!raf && seen && !calm) raf = requestAnimationFrame(frame); }
      if (hasIO) new IntersectionObserver(es => { seen = es[es.length - 1].isIntersecting; if (seen) kick(); }).observe(wrap);
      addEventListener('scroll', kick, {passive: true});
      kick();
    }
  }
})();
