/* Home (house style, Oct 2026): one hero fade once any session intro has finished, one fade-in per block
   on scroll, the pinned question story, and the product showcase (tabs filter a draggable rail).
   Every hidden state is gated on a class added by script, so the page is complete and readable without JS. */
(() => {
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  root.classList.add('sx-home-js');

  // Hero: fade in once the session intro (if any) has closed.
  const go = () => root.classList.add('sx-go');
  const started = performance.now();
  (function waitForIntro() {
    const open = document.querySelector('dialog.amd-intro[open]');
    if ((!open && !root.classList.contains('amd-intro-pending')) || performance.now() - started > 9000) return go();
    requestAnimationFrame(waitForIntro);
  })();

  // Blocks below the fold fade in once; anything already on screen is left alone.
  const items = [...document.querySelectorAll('.sx-reveal')];
  if (!('IntersectionObserver' in window) || reduced) { items.forEach(el => el.classList.add('is-in')); return; }
  items.forEach(el => { if (el.getBoundingClientRect().top < innerHeight) el.classList.add('is-in'); });
  root.classList.add('sx-reveal-on');
  const io = new IntersectionObserver(entries => {
    let k = 0;
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.style.setProperty('--sx-delay', `${Math.min(k++, 2) * 80}ms`);
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  items.filter(el => !el.classList.contains('is-in')).forEach(el => io.observe(el));
})();

/* Question story: pinned on wide, tall screens; the three questions advance with scroll.
   The stepper sits directly above the question it controls. Phones, short screens, reduced motion
   and no-JS all get the plain stacked list. */
(() => {
  const story = document.querySelector('.sx-story');
  if (!story) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const track = story.querySelector('.sx-story-track');
  const grid = story.querySelector('.sx-story-grid');
  const list = story.querySelector('.sx-steps');
  const steps = [...story.querySelectorAll('.sx-step')];
  const n = steps.length;
  const mq = matchMedia('(min-width: 1000px) and (min-height: 700px)');
  let pinned = false, current = -1, ticking = false;

  // Each step is labelled with its own link title ("Evaluate a product", ...).
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

  function goTo(i, instant) {
    const top = track.getBoundingClientRect().top + scrollY;
    const span = track.offsetHeight - innerHeight;
    scrollTo({ top: top + span * ((i + .3) / n), behavior: reduced || instant ? 'auto' : 'smooth' });
  }
  function set(i) {
    if (i === current) return;
    current = i;
    story.dataset.step = String(i);
    steps.forEach((s, k) => { s.classList.toggle('is-active', k === i); s.classList.toggle('is-past', k < i); });
    btns.forEach((b, k) => (k === i ? b.setAttribute('aria-current', 'step') : b.removeAttribute('aria-current')));
  }
  function update() {
    ticking = false;
    if (!pinned) return;
    const r = track.getBoundingClientRect();
    const span = track.offsetHeight - innerHeight;
    const p = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
    set(Math.min(n - 1, Math.floor(p * n)));
  }
  function mode() {
    pinned = mq.matches && !reduced;
    story.classList.toggle('is-pinned', pinned);
    current = -1;
    if (!pinned) {
      delete story.dataset.step;
      steps.forEach(s => s.classList.remove('is-active', 'is-past'));
      btns.forEach(b => b.removeAttribute('aria-current'));
    } else update();
  }
  const queue = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener('scroll', queue, { passive: true });
  addEventListener('resize', queue);
  mq.addEventListener ? mq.addEventListener('change', mode) : mq.addListener(mode);
  // Keyboard users: tabbing into a question that is not on screen scrolls the story to it.
  story.addEventListener('focusin', e => {
    if (!pinned) return;
    const s = e.target.closest('.sx-step');
    if (s && steps.indexOf(s) !== current) goTo(steps.indexOf(s), true);
  });
  mode();
})();

/* Product showcase: the category tabs swap the stage and filter the rail to that category
   (plus the closing "full portfolio" tile). Without JS every product is listed. */
(() => {
  const show = document.querySelector('[data-show]');
  if (!show) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const tablist = show.querySelector('[role="tablist"]');
  const tabs = [...tablist.querySelectorAll('[role="tab"]')];
  const ink = tablist.querySelector('.sx-tab-ink');
  const panels = tabs.map(t => document.getElementById(t.getAttribute('aria-controls').split(/\s+/)[0]));
  const rail = show.querySelector('[data-rail]');
  const tiles = [...rail.querySelectorAll('.sx-tile')];
  const ctrl = show.querySelector('.sx-rail-ctrl');
  const meter = ctrl.querySelector('.sx-rail-meter span');
  const [prev, next] = ctrl.querySelectorAll('.sx-rail-btn');
  let active = 0, ticking = false;

  show.classList.add('is-live');
  tablist.hidden = false;
  ctrl.hidden = false;
  panels.forEach((p, i) => { p.setAttribute('role', 'tabpanel'); p.setAttribute('aria-labelledby', tabs[i].id); });

  const pad = () => parseFloat(getComputedStyle(rail).paddingLeft) || 0;
  const behavior = () => (reduced ? 'auto' : 'smooth');
  const shown = () => tiles.filter(t => !t.hidden);

  function moveInk() {
    const t = tabs[active];
    ink.style.setProperty('--x', `${t.offsetLeft}px`);
    ink.style.setProperty('--w', `${t.offsetWidth}px`);
  }
  function select(i, { focus = false, animate = true } = {}) {
    active = (i + tabs.length) % tabs.length;
    const cat = tabs[active].dataset.cat;
    tabs.forEach((t, k) => { const on = k === active; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
    panels.forEach((p, k) => p.classList.toggle('is-active', k === active));
    let k = 0;
    tiles.forEach(t => {
      const on = !t.dataset.cat || t.dataset.cat === cat;
      t.hidden = !on;
      if (on) t.style.setProperty('--i', k++);
    });
    rail.classList.remove('is-drag', 'is-swap');
    rail.scrollLeft = 0;
    if (animate && !reduced) { void rail.offsetWidth; rail.classList.add('is-swap'); }
    moveInk();
    sync();
    if (focus) tabs[active].focus();
  }

  tabs.forEach((t, i) => t.addEventListener('click', () => { if (i !== active) select(i); }));
  tablist.addEventListener('keydown', e => {
    const map = { ArrowRight: active + 1, ArrowDown: active + 1, ArrowLeft: active - 1, ArrowUp: active - 1, Home: 0, End: tabs.length - 1 };
    if (!(e.key in map)) return;
    e.preventDefault();
    select(map[e.key], { focus: true });
  });

  // Rail state: progress meter and button availability (aria-disabled keeps keyboard focus in place).
  function sync() {
    ticking = false;
    const max = rail.scrollWidth - rail.clientWidth, sl = rail.scrollLeft;
    meter.style.setProperty('--p', max > 2 ? (.08 + .92 * sl / max).toFixed(3) : '1');
    prev.setAttribute('aria-disabled', String(sl <= 2));
    next.setAttribute('aria-disabled', String(sl >= max - 2));
  }
  rail.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(sync); } }, { passive: true });

  // Previous / next page of tiles.
  function page(dir) {
    const v = shown();
    if (v.length < 2) return;
    const step = v[1].offsetLeft - v[0].offsetLeft;
    const visible = rail.clientWidth - pad() * 2;
    const count = Math.max(1, Math.floor(visible / step));
    rail.scrollBy({ left: dir * count * step, behavior: behavior() });
  }
  prev.addEventListener('click', () => { if (prev.getAttribute('aria-disabled') !== 'true') page(-1); });
  next.addEventListener('click', () => { if (next.getAttribute('aria-disabled') !== 'true') page(1); });

  // Arrow keys move between the visible tiles once a tile has focus.
  rail.addEventListener('keydown', e => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    const v = shown(), links = v.map(t => t.querySelector('a'));
    const i = links.indexOf(document.activeElement);
    if (i < 0) return;
    const j = clamp(i + (e.key === 'ArrowRight' ? 1 : -1), 0, links.length - 1);
    if (j === i) return;
    e.preventDefault();
    links[j].focus({ preventScroll: true });
    const t = v[j], sl = rail.scrollLeft, p = pad();
    if (t.offsetLeft - p < sl || t.offsetLeft + t.offsetWidth > sl + rail.clientWidth - p) {
      rail.scrollTo({ left: Math.max(0, t.offsetLeft - p), behavior: behavior() });
    }
  });

  // Mouse drag to scroll; touch keeps native momentum scrolling.
  let drag = null, dragged = false;
  rail.addEventListener('pointerdown', e => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    drag = { x: e.clientX, sl: rail.scrollLeft, moved: false };
  });
  addEventListener('pointermove', e => {
    if (!drag) return;
    const dx = e.clientX - drag.x;
    if (!drag.moved && Math.abs(dx) > 6) { drag.moved = true; rail.classList.add('is-drag'); }
    if (drag.moved) rail.scrollLeft = drag.sl - dx;
  });
  addEventListener('pointerup', () => {
    if (!drag) return;
    const moved = drag.moved;
    drag = null;
    if (!moved) return;
    dragged = true;
    setTimeout(() => { dragged = false; }, 60);
    const sl = rail.scrollLeft, p = pad();
    const near = shown().reduce((a, t) => (Math.abs(t.offsetLeft - p - sl) < Math.abs(a.offsetLeft - p - sl) ? t : a));
    rail.classList.remove('is-drag');
    rail.scrollTo({ left: Math.max(0, near.offsetLeft - p), behavior: behavior() });
  });
  rail.addEventListener('click', e => { if (dragged) { e.preventDefault(); e.stopPropagation(); } }, true);

  let rt;
  addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { moveInk(); sync(); }, 120); });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(moveInk);
  select(0, { animate: false });

  function clamp(v, a, b) { return Math.min(b, Math.max(a, v)); }
})();

/* Ticker pause/play control: the product-name ticker keeps moving by default (owner's choice) but can be stopped. */
(() => {
  const m = document.querySelector('.sx-marquee');
  if (!m || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
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
  m.append(b);
})();
