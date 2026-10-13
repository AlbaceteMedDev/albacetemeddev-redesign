/* Home v3: hero entrance + healing-matrix canvas, scroll reveals, scroll-lit manifesto, pinned question story,
   product showcase (tabs filter a draggable rail), progress hairline, custom cursor.
   Every hidden state is gated on JS adding a class, so the page is complete and readable without this file. */
(() => {
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasIO = 'IntersectionObserver' in window;

  // Start the hero entrance once the session intro (if any) has finished.
  const go = () => root.classList.add('sx-go');
  const started = performance.now();
  (function waitForIntro() {
    const open = document.querySelector('dialog.amd-intro[open]');
    if ((!open && !root.classList.contains('amd-intro-pending')) || performance.now() - started > 9000) return go();
    requestAnimationFrame(waitForIntro);
  })();

  // Scroll reveals with a light stagger inside each batch.
  const items = document.querySelectorAll('.sx-reveal');
  if (!hasIO || reduced) {
    items.forEach(el => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver(entries => {
      entries.filter(e => e.isIntersecting).forEach((e, i) => {
        e.target.style.setProperty('--sx-delay', `${i * 90}ms`);
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    items.forEach(el => io.observe(el));
  }

  // Closing arch: draw the line once, and only run its spark while the section is on screen.
  const cta = document.querySelector('.sx-cta');
  const archSvg = cta && cta.querySelector('.sx-cta-arch');
  if (cta) {
    if (!hasIO || reduced) { cta.classList.add('is-in'); if (archSvg && archSvg.pauseAnimations) archSvg.pauseAnimations(); }
    else {
      if (archSvg && archSvg.pauseAnimations) archSvg.pauseAnimations();
      new IntersectionObserver(([e]) => {
        if (e.isIntersecting) cta.classList.add('is-in');
        if (archSvg && archSvg.pauseAnimations) e.isIntersecting ? archSvg.unpauseAnimations() : archSvg.pauseAnimations();
      }, { threshold: 0.2 }).observe(cta);
    }
  }

  // Healing matrix: drifting gold nodes that knit together, drawn toward the pointer. Paused off-screen.
  const canvas = document.querySelector('.sx-matrix');
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  const hero = canvas.parentElement;
  let w = 0, h = 0, nodes = [], running = false, visible = true;
  const mouse = { x: -9999, y: -9999 };

  function size() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = hero.clientWidth; h = hero.clientHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round(Math.min(110, Math.max(36, (w * h) / 16000)));
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - .5) * .22, vy: (Math.random() - .5) * .22,
      r: Math.random() * 1.6 + .5, p: Math.random() * Math.PI * 2
    }));
  }

  function frame(t) {
    ctx.clearRect(0, 0, w, h);
    const link = Math.min(170, w / 8);
    for (const n of nodes) {
      if (!reduced) {
        const dx = mouse.x - n.x, dy = mouse.y - n.y, d2 = dx * dx + dy * dy;
        if (d2 < 220 * 220) { n.vx += dx * .00002; n.vy += dy * .00002; }
        n.vx *= .995; n.vy *= .995;
        n.x += n.vx; n.y += n.vy;
        if (n.x < -20) n.x = w + 20; else if (n.x > w + 20) n.x = -20;
        if (n.y < -20) n.y = h + 20; else if (n.y > h + 20) n.y = -20;
      }
    }
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j], dx = a.x - b.x, dy = a.y - b.y, d = Math.hypot(dx, dy);
        if (d < link) {
          ctx.strokeStyle = `rgba(216,181,106,${(1 - d / link) * .22})`;
          ctx.lineWidth = .6;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
        }
      }
    }
    for (const n of nodes) {
      const tw = .55 + .45 * Math.sin(t / 900 + n.p);
      ctx.fillStyle = `rgba(241,213,148,${.35 + tw * .5})`;
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
    }
    if (running) requestAnimationFrame(frame);
  }

  function start() { if (!running && visible && !reduced && !document.hidden) { running = true; requestAnimationFrame(frame); } }
  function stop() { running = false; }

  size();
  if (reduced) { frame(0); } else { start(); }
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { size(); if (reduced) frame(0); }, 150); });
  hero.addEventListener('pointermove', e => { const r = hero.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
  hero.addEventListener('pointerleave', () => { mouse.x = mouse.y = -9999; });
  if (hasIO) new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? start() : stop(); }).observe(hero);
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
})();

/* Manifesto: the opening sentence lights up word by word as it travels into view (no pinning).
   The rest of the statement, including the gold line, is always at full strength. */
(() => {
  const text = document.querySelector('[data-scrub]');
  if (!text) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduced) return;
  const first = [...text.childNodes].find(n => n.nodeType === 3 && n.textContent.trim());
  if (!first) return;
  const src = first.textContent;
  const lead = (src.match(/^[^.]*\.\s*/) || [src])[0];
  const frag = document.createDocumentFragment();
  lead.split(/(\s+)/).forEach(part => {
    if (!part) return;
    if (/^\s+$/.test(part)) frag.append(part);
    else { const s = document.createElement('span'); s.className = 'w'; s.textContent = part; frag.append(s); }
  });
  frag.append(src.slice(lead.length));
  first.replaceWith(frag);
  const words = [...text.querySelectorAll('.w')];
  let last = -1, ticking = false;
  const update = () => {
    ticking = false;
    const r = text.getBoundingClientRect(), vh = innerHeight;
    if (r.bottom < -vh || r.top > vh * 2) return;
    const p = Math.min(1, Math.max(0, (vh * .92 - r.top) / (vh * .42)));
    const lit = Math.round(p * words.length);
    if (lit === last) return;
    last = lit;
    words.forEach((w, i) => w.classList.toggle('on', i < lit));
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
  update();
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

/* Hero light + arch parallax, magnetic buttons, custom cursor (fine pointers, motion allowed). */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  if (!fine || reduced) return;

  const hero = document.querySelector('.sx-hero');
  const arch = document.querySelector('[data-parallax]');
  if (hero) hero.addEventListener('pointermove', e => {
    const r = hero.getBoundingClientRect();
    hero.style.setProperty('--hx', `${e.clientX - r.left}px`);
    hero.style.setProperty('--hy', `${e.clientY - r.top}px`);
    if (arch) {
      const x = (e.clientX / innerWidth - .5), y = (e.clientY / innerHeight - .5);
      arch.style.transform = `translate3d(${x * -14}px, ${y * -14}px, 0)`;
    }
  });

  document.querySelectorAll('.sx-btn').forEach(b => {
    b.addEventListener('pointermove', e => {
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .18}px, ${(e.clientY - r.top - r.height / 2) * .3}px)`;
    });
    b.addEventListener('pointerleave', () => { b.style.transform = ''; });
  });

  // Eased ring + precise dot; the ring's loop only runs while it is catching up.
  const ring = Object.assign(document.createElement('div'), { className: 'sx-cursor' });
  const dot = Object.assign(document.createElement('div'), { className: 'sx-cursor-dot' });
  ring.setAttribute('aria-hidden', 'true'); dot.setAttribute('aria-hidden', 'true');
  document.body.append(ring, dot);
  let mx = -100, my = -100, rx = -100, ry = -100, raf = 0;
  const loop = () => {
    rx += (mx - rx) * .18; ry += (my - ry) * .18;
    ring.style.transform = `translate3d(${rx}px,${ry}px,0)`;
    raf = Math.abs(mx - rx) + Math.abs(my - ry) > .4 ? requestAnimationFrame(loop) : 0;
  };
  addEventListener('pointermove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate3d(${mx}px,${my}px,0)`;
    if (!raf) raf = requestAnimationFrame(loop);
  }, { passive: true });
  document.addEventListener('pointerover', e => ring.classList.toggle('is-hover', !!e.target.closest('a,button,[role="tab"]')));
  document.addEventListener('pointerleave', () => { mx = my = -100; if (!raf) raf = requestAnimationFrame(loop); });
  // Hide the ring and dot when the pointer leaves the window (pointerleave on document is unreliable).
  addEventListener('mouseout', e => { if (!e.relatedTarget) { mx = my = rx = ry = -100; ring.style.transform = dot.style.transform = 'translate3d(-100px,-100px,0)'; } });
})();

/* Scroll progress hairline. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const bar = Object.assign(document.createElement('div'), { className: 'sx-progress' });
  bar.setAttribute('aria-hidden', 'true');
  document.body.append(bar);
  let ticking = false;
  const paint = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
    ticking = false;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(paint); } }, { passive: true });
  paint();
})();
