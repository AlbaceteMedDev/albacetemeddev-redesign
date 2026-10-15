/* Home (Minimal v7, Oct 15 2026). Calm and content first: every heading, paragraph, button and photograph is
   readable at first paint or as soon as its block enters view.
   hero    static and calm: eyebrow, headline, one line of copy, one primary and one text link, the offer row and
           the photograph. No canvas, no pointer effects.
   reveal  below the hero, each block fades up 12px (600ms, --v7-ease, its parts 60ms apart), once, as it enters.
   story   three questions in order; each step fades up in place as it enters view (one of the reveal blocks).
   show    tabs filter the stage and the products (a crossfade); a native scroll-snap rail you can drag, swipe,
           key or step one card at a time. On phones the tabs are a scrollable segmented row; the chosen tab is
           brought into view.
   ticker  keeps moving (owner's choice), can be stopped with its own button (WCAG 2.2.2) in a slot at the end of
           the band, rests while off screen. Without JS, or with reduced motion, the names stand still and wrap so
           every one is visible (home.css).
   Every hidden state is gated on html.sx-mo (JS + motion allowed) or on JS-only classes, so without JS, or with
   reduced motion, the page is complete and static. */
(() => {
  const R = document.documentElement;
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const MO = !RM;
  const IO = 'IntersectionObserver' in window;
  const EASE = 'cubic-bezier(.22,.61,.36,1)'; // --v7-ease
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

  /* ── Product showcase: tabs swap the stage and filter the products (plus the closing "full portfolio" card).
       A native horizontal scroll-snap rail: drag with a mouse (with a little throw), swipe, trackpad, keyboard, or
       step one card at a time with the arrows; each move lands a card on the left edge. A thin line under the rail
       shows how far it has scrolled; when every card already fits, the line and arrows are hidden. A tab change is
       a crossfade: what is on screen fades out (200ms), then the new stage and cards fade in (500ms, 60ms apart).
       No JS: everything is listed. ── */
  function showcase() {
    const show = $('[data-show]');
    if (!show) return;
    const tablist = $('[role="tablist"]', show), tabs = $$('[role="tab"]', tablist), ink = $('.sx-tab-ink', tablist);
    const panels = tabs.map(t => document.getElementById(t.getAttribute('aria-controls').split(/\s+/)[0]));
    const rail = $('[data-rail]', show), tiles = $$('.sx-tile', rail), ctrl = $('.sx-rail-ctrl', show);
    const meter = $('.sx-rail-meter span', ctrl), [prev, next] = $$('.sx-rail-btn', ctrl);
    let active = 0, raf = 0, items = [], fits = false, aim = -1, aimT = 0, swapping = false;

    show.classList.add('is-live');
    tablist.hidden = false;
    panels.forEach((p, i) => { p.setAttribute('role', 'tabpanel'); p.setAttribute('aria-labelledby', tabs[i].id); });

    const shown = () => tiles.filter(t => !t.hidden);
    const behavior = () => (RM ? 'auto' : 'smooth');
    const pad = () => parseFloat(getComputedStyle(rail).paddingLeft) || 0;
    const maxScroll = () => Math.max(0, rail.scrollWidth - rail.clientWidth);

    function measure() {
      items = shown().map(t => ({ el: t, left: t.offsetLeft, w: t.offsetWidth }));
      fits = maxScroll() <= 2;
      ctrl.hidden = fits; // every card is already in view: no line or arrows
      kick();
    }
    function frame() {
      raf = 0;
      const sl = rail.scrollLeft, max = maxScroll();
      meter.style.setProperty('--p', max > 2 ? (.08 + .92 * clamp(sl / max, 0, 1)).toFixed(3) : '1');
      prev.setAttribute('aria-disabled', String(max <= 2 || sl <= 2));
      next.setAttribute('aria-disabled', String(max <= 2 || sl >= max - 2));
    }
    function kick() { if (!raf) raf = requestAnimationFrame(frame); }

    function moveInk() {
      const t = tabs[active];
      ink.style.setProperty('--x', `${t.offsetLeft}px`);
      ink.style.setProperty('--w', `${t.offsetWidth}px`);
      // Phones: the tabs are a scrollable row; bring the chosen tab fully into view (the row only, never the page).
      const room = tablist.scrollWidth - tablist.clientWidth;
      if (room > 2) {
        const pad = parseFloat(getComputedStyle(tablist).paddingLeft) || 0;
        const lo = t.offsetLeft - pad, hi = t.offsetLeft + t.offsetWidth + pad - tablist.clientWidth;
        const want = clamp(tablist.scrollLeft, hi, lo);
        if (Math.abs(want - tablist.scrollLeft) > 1) tablist.scrollTo({ left: clamp(want, 0, room), behavior: behavior() });
      }
    }
    const inView = () => {
      const lo = rail.scrollLeft, hi = lo + rail.clientWidth;
      return shown().filter(t => t.offsetLeft + t.offsetWidth > lo && t.offsetLeft < hi);
    };
    // Show the chosen category; with animateIn, its stage and the cards on screen fade in.
    function apply(animateIn) {
      const cat = tabs[active].dataset.cat;
      panels.forEach((p, k) => p.classList.toggle('is-active', k === active));
      tiles.forEach(t => { t.hidden = !(!t.dataset.cat || t.dataset.cat === cat); });
      rail.classList.remove('is-drag', 'is-free');
      rail.scrollTo({ left: 0, behavior: 'instant' });
      aim = -1;
      measure();
      if (!animateIn) return;
      panels[active].animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, easing: EASE, fill: 'backwards' });
      inView().forEach((t, k) => t.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, delay: Math.min(k, 3) * 60, easing: EASE, fill: 'backwards' }));
    }
    function select(i, { focus = false, animate = true } = {}) {
      active = (i + tabs.length) % tabs.length;
      tabs.forEach((t, k) => { const on = k === active; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
      moveInk();
      if (focus) tabs[active].focus({ preventScroll: true }); // the row brings it into view (moveInk), the page stays put
      if (!animate || !MO || !show.animate) { apply(false); return; }
      if (swapping) return; // the fade already under way lands on the latest choice
      swapping = true;
      const outs = [];
      const fadeOut = el => outs.push(el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: EASE, fill: 'forwards' }));
      const old = panels.find(p => p.classList.contains('is-active'));
      if (old) fadeOut(old);
      inView().forEach(fadeOut);
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
