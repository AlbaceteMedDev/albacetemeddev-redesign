/* Home (Model v8, Oct 15 2026). Calm and content first: every heading, paragraph, button and photograph is readable
   at first paint or as soon as its block enters view.
   hero    a carousel of three rounded panels; the global carousel (house-motion.js) gives it round arrows, dots and
           arrow-key scrolling. Nothing plays by itself. Without JS the panels stack (home.css).
   reveal  below the hero, each block fades up 12px (600ms, the house easing, its parts 60ms apart), once, as it enters.
   rail    the category tabs filter a horizontal product rail (crossfade); drag, swipe, key or use the round arrows.
           On phones the tabs are a scrollable row of pills; the chosen tab is brought into view.
   ticker  keeps moving (owner's choice), can be stopped with its own button (WCAG 2.2.2) at the end of its strip,
           rests while off screen. Without JS, or with reduced motion, the names stand still and wrap so every one is
           visible (home.css).
   Every hidden state is gated on html.sx-mo (JS + motion allowed) or on JS-only classes, so without JS, or with
   reduced motion, the page is complete and static. */
(() => {
  const R = document.documentElement;
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const MO = !RM;
  const IO = 'IntersectionObserver' in window;
  const EASE = 'cubic-bezier(.22,.61,.36,1)'; // --m8-ease
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const safe = f => { try { f(); } catch (e) { console.warn('[home]', e); } };
  R.classList.add('sx-home-js');
  if (MO) R.classList.add('sx-mo');

  /* ── Below the hero: each block fades up once as it enters view (its parts 60ms apart, CSS). Blocks that arrive
       together are a beat apart, never more than 120ms. Keyboard focus never waits on an entrance. ── */
  function reveals() {
    const blocks = $$('.sx-reveal');
    if (!MO || !IO) { blocks.forEach(b => b.classList.add('is-in')); return; }
    const io = new IntersectionObserver(es => {
      let n = 0;
      es.forEach(e => {
        if (!e.isIntersecting) return;
        const b = e.target;
        io.unobserve(b);
        b.style.setProperty('--sx-bd', `${Math.min(n++, 2) * 60}ms`);
        b.classList.add('is-in');
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0 });
    blocks.forEach(b => io.observe(b));
    document.addEventListener('focusin', e => {
      const t = e.target;
      if (!t.closest || !t.closest('.sx-home')) return;
      const hit = [];
      for (let el = t.closest('.sx-reveal'); el; el = el.parentElement && el.parentElement.closest('.sx-reveal')) if (!el.classList.contains('is-in')) hit.push(el);
      if (!hit.length) return;
      hit.forEach(el => { io.unobserve(el); el.classList.add('sx-now', 'is-in'); });
      requestAnimationFrame(() => requestAnimationFrame(() => hit.forEach(el => el.classList.remove('sx-now'))));
    });
  }

  /* ── Product rail: the category tabs filter the products (plus the closing "full portfolio" card) in a horizontal
       card rail. The rail is the global carousel (house-motion.js adds its round arrows and keeps them in step); here:
       the tabs (a tablist whose one panel is the rail), a crossfade on a tab change (what is on screen fades out in
       200ms, the new cards fade in over 500ms, 60ms apart), mouse drag with a little throw, and arrow keys that move
       focus card to card. The three category cards above are always shown. No JS: every product is listed. ── */
  function showcase() {
    const show = $('[data-show]');
    if (!show) return;
    const tablist = $('[role="tablist"]', show), tabs = $$('[role="tab"]', tablist);
    const rail = $('[data-rail]', show), tiles = $$('.sx-tile', rail), box = rail.closest('.m8-carousel') || rail.parentElement;
    let active = 0, items = [], aim = -1, aimT = 0, swapping = false;

    tablist.hidden = false;
    box.setAttribute('role', 'tabpanel');
    box.removeAttribute('aria-label');

    const shown = () => tiles.filter(t => !t.hidden);
    const behavior = () => (RM ? 'auto' : 'smooth');
    const pad = () => parseFloat(getComputedStyle(rail).paddingLeft) || 0;
    const maxScroll = () => Math.max(0, rail.scrollWidth - rail.clientWidth);
    const measure = () => { items = shown().map(t => ({ el: t, left: t.offsetLeft })); };
    // the global carousel recounts its slides and resets its arrows on a scroll event
    const resync = () => rail.dispatchEvent(new Event('scroll'));

    // Phones: the tabs are a scrollable row; bring the chosen tab fully into view (the row only, never the page).
    function reveal() {
      const t = tabs[active], room = tablist.scrollWidth - tablist.clientWidth;
      if (room <= 2) return;
      const p = parseFloat(getComputedStyle(tablist).paddingLeft) || 0;
      const lo = t.offsetLeft - p, hi = t.offsetLeft + t.offsetWidth + p - tablist.clientWidth;
      const want = clamp(tablist.scrollLeft, hi, lo);
      if (Math.abs(want - tablist.scrollLeft) > 1) tablist.scrollTo({ left: clamp(want, 0, room), behavior: behavior() });
    }
    const inView = () => {
      const lo = rail.scrollLeft, hi = lo + rail.clientWidth;
      return shown().filter(t => t.offsetLeft + t.offsetWidth > lo && t.offsetLeft < hi);
    };
    // Show the chosen category; with animateIn, the cards on screen fade in.
    function apply(animateIn) {
      const cat = tabs[active].dataset.cat;
      box.setAttribute('aria-labelledby', tabs[active].id);
      tiles.forEach(t => { t.hidden = !(!t.dataset.cat || t.dataset.cat === cat); });
      rail.classList.remove('is-drag', 'is-free');
      rail.scrollTo({ left: 0, behavior: 'instant' });
      aim = -1;
      measure();
      resync();
      if (!animateIn) return;
      inView().forEach((t, k) => t.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, delay: Math.min(k, 3) * 60, easing: EASE, fill: 'backwards' }));
    }
    function select(i, { focus = false, animate = true } = {}) {
      active = (i + tabs.length) % tabs.length;
      tabs.forEach((t, k) => { const on = k === active; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
      reveal();
      if (focus) tabs[active].focus({ preventScroll: true }); // the row brings it into view (reveal), the page stays put
      if (!animate || !MO || !rail.animate) { apply(false); return; }
      if (swapping) return; // the fade already under way lands on the latest choice
      swapping = true;
      const outs = inView().map(el => el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: EASE, fill: 'forwards' }));
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

    // One card per step. Steps during a glide count on from where the glide is going.
    const lastIdx = () => { const max = maxScroll(), p = pad(), i = items.findIndex(it => it.left - p >= max - 1); return i < 0 ? items.length - 1 : i; };
    function stepTo(j) {
      const it = items[j];
      if (!it) return;
      aim = j;
      clearTimeout(aimT);
      aimT = setTimeout(() => { aim = -1; }, 900);
      rail.scrollTo({ left: clamp(it.left - pad(), 0, maxScroll()), behavior: behavior() });
    }
    if ('onscrollend' in rail) rail.addEventListener('scrollend', () => { aim = -1; });

    // Keyboard: arrow keys move between cards; the focused card comes to the left edge (as far as the rail goes).
    rail.addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const links = items.map(it => it.el.querySelector('a'));
      const i = links.indexOf(document.activeElement);
      if (i < 0) return;
      const j = clamp(i + (e.key === 'ArrowRight' ? 1 : -1), 0, links.length - 1);
      if (j === i) return;
      e.preventDefault();
      links[j].focus({ preventScroll: true });
      stepTo(Math.min(j, lastIdx()));
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
    addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { measure(); reveal(); }, 120); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure);
    addEventListener('load', measure);
    select(0, { animate: false });
  }

  /* ── Ticker: keeps moving by default (owner's choice), can be stopped (WCAG 2.2.2), rests while off screen.
       The 44px control sits in its own slot at the right end of the band, outside the moving names and their faded
       edges (home.css). Its label says what it will do; its icon shows pause or play. .has-toggle turns the moving
       band on, so without JS or with reduced motion the names stand still and wrap. ── */
  function ticker() {
    const m = $('.sx-marquee');
    if (!m || RM) return;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'sx-marquee-toggle';
    const sync = paused => {
      m.classList.toggle('is-paused', paused);
      b.setAttribute('aria-label', paused ? 'Play product names' : 'Pause product names');
    };
    b.addEventListener('click', () => sync(!m.classList.contains('is-paused')));
    sync(false);
    m.classList.add('has-toggle');
    m.append(b);
    if (IO) new IntersectionObserver(([e]) => m.classList.toggle('is-off', !e.isIntersecting)).observe(m);
  }

  [reveals, showcase, ticker].forEach(safe);
})();
