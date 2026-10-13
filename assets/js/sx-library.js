/* sx-library: reference-library motion (catalog, scientific portfolio, evidence).
   Progressive only: every element is visible without this file. Reveal-hidden states apply
   only after html.sxl-io is set below, and elements already on screen are never hidden. */
(() => {
  const root = document.documentElement;
  root.classList.add('sx-js');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;
  const raf = fn => { let q = false; return e => { if (q) return; q = true; requestAnimationFrame(() => { q = false; fn(e); }); }; };

  // Scroll progress hairline.
  if (!reduced) {
    const bar = document.createElement('div');
    bar.className = 'sxl-progress'; bar.setAttribute('aria-hidden', 'true');
    document.body.append(bar);
    const update = () => {
      const max = root.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0})`;
    };
    addEventListener('scroll', raf(update), { passive: true });
    addEventListener('resize', raf(update), { passive: true });
    update();
  }

  // Reveal targets (fade-up) and draw targets (hairline only, never hidden).
  const reveal = [
    '.catalog-group > header', '.catalog-item', '.catalog-disclosure',
    '.science-product-list > li', '.science-materials > div', '.science-note', '.science-dressing > figure',
    '.science-dressing > div', '.science-device', '.science-study', '.science-endpoint', '.science-end',
    '.library-tools', '.ev-legend', '.ev-counts', '.ev-group', '.ev-card', '.ev-foot'
  ].join(',');
  const draw = '.science-chapter';
  const revealEls = [...document.querySelectorAll(reveal)];
  const drawEls = [...document.querySelectorAll(draw)];
  revealEls.forEach(el => el.classList.add('sx-reveal'));
  drawEls.forEach(el => el.classList.add('sxl-draw'));
  const all = [...revealEls, ...drawEls];

  if (reduced || !('IntersectionObserver' in window)) {
    all.forEach(el => el.classList.add('is-in'));
  } else {
    // Anything already in (or above) the first viewport shows at once, without a flash.
    const vh = innerHeight;
    all.forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.94 && (r.width || r.height)) el.classList.add('is-in', 'sxl-instant');
    });
    const io = new IntersectionObserver(entries => {
      let i = 0;
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.style.setProperty('--sxl-delay', `${Math.min(i++, 5) * 85}ms`);
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -7% 0px', threshold: 0.08 });
    all.forEach(el => { if (!el.classList.contains('is-in')) io.observe(el); });
    root.classList.add('sxl-io');
    // Drop the instant flag after first paint so later hovers keep their transitions.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      document.querySelectorAll('.sxl-instant').forEach(el => el.classList.remove('sxl-instant'));
    }));
    // Failsafe: a hash jump or print never leaves content hidden.
    addEventListener('beforeprint', () => all.forEach(el => el.classList.add('is-in')));
  }

  if (reduced || !fine) return;

  // Pointer spotlight on cards.
  const spot = '.catalog-item, .science-product-list > li, .science-device, .ev-card';
  document.querySelectorAll(spot).forEach(el => {
    el.addEventListener('pointermove', raf(e => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    }));
  });

  // Gentle 3D tilt on product cards.
  document.querySelectorAll('.catalog-item, .science-product-list > li').forEach(el => {
    el.addEventListener('pointermove', raf(e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      el.classList.add('sxl-tilting');
      el.style.transform = `rotateY(${(x * 5).toFixed(2)}deg) rotateX(${(-y * 5).toFixed(2)}deg) translateY(-6px)`;
    }));
    el.addEventListener('pointerleave', () => { el.classList.remove('sxl-tilting'); el.style.transform = ''; });
  });

  // Hero light + parallax.
  document.querySelectorAll('.catalog-intro, .science-hero, .sx-lib--evidence .hero').forEach(hero => {
    hero.addEventListener('pointermove', raf(e => {
      const r = hero.getBoundingClientRect();
      hero.classList.add('sxl-hero-on');
      hero.style.setProperty('--hx', `${e.clientX - r.left}px`);
      hero.style.setProperty('--hy', `${e.clientY - r.top}px`);
      hero.style.setProperty('--px', (((e.clientX - r.left) / r.width) * 2 - 1).toFixed(3));
      hero.style.setProperty('--py', (((e.clientY - r.top) / r.height) * 2 - 1).toFixed(3));
    }));
    hero.addEventListener('pointerleave', () => {
      hero.classList.remove('sxl-hero-on');
      hero.style.setProperty('--px', 0); hero.style.setProperty('--py', 0);
    });
  });
})();

/* Pause the orbital rings whenever they are off screen or the tab is hidden. */
(() => {
  const orbits = document.querySelector('.sxl-orbits');
  if (!orbits || !('IntersectionObserver' in window)) return;
  let onScreen = true;
  const sync = () => orbits.classList.toggle('is-paused', !onScreen || document.hidden);
  new IntersectionObserver(([e]) => { onScreen = e.isIntersecting; sync(); }).observe(orbits);
  document.addEventListener('visibilitychange', sync);
})();

/* Healing matrix on the cream heroes: faint gold nodes that knit together near the pointer.
   Decorative, paused off screen or in hidden tabs, skipped for reduced motion and small screens. */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || innerWidth < 700) return;
  document.querySelectorAll('.catalog-intro, .science-hero').forEach(hero => {
    const canvas = document.createElement('canvas');
    canvas.className = 'sxl-matrix'; canvas.setAttribute('aria-hidden', 'true');
    hero.prepend(canvas);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let w = 0, h = 0, nodes = [], running = false, visible = false;
    const mouse = { x: -9999, y: -9999 };
    function size() {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      w = hero.clientWidth; h = hero.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(70, Math.max(28, (w * h) / 22000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - .5) * .18, vy: (Math.random() - .5) * .18,
        r: Math.random() * 1.4 + .6, p: Math.random() * Math.PI * 2
      }));
    }
    function frame(t) {
      ctx.clearRect(0, 0, w, h);
      const link = Math.min(150, w / 9);
      for (const n of nodes) {
        const dx = mouse.x - n.x, dy = mouse.y - n.y;
        if (dx * dx + dy * dy < 200 * 200) { n.vx += dx * .000018; n.vy += dy * .000018; }
        n.vx *= .996; n.vy *= .996; n.x += n.vx; n.y += n.vy;
        if (n.x < -20) n.x = w + 20; else if (n.x > w + 20) n.x = -20;
        if (n.y < -20) n.y = h + 20; else if (n.y > h + 20) n.y = -20;
      }
      ctx.lineWidth = .7;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < link) {
            ctx.strokeStyle = `rgba(154,116,49,${(1 - d / link) * .3})`;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        ctx.fillStyle = `rgba(154,116,49,${.36 + (.5 + .5 * Math.sin(t / 900 + n.p)) * .44})`;
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
      }
      if (running) requestAnimationFrame(frame);
    }
    const start = () => { if (!running && visible && !document.hidden) { running = true; requestAnimationFrame(frame); } };
    const stop = () => { running = false; };
    size();
    let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(size, 160); });
    hero.addEventListener('pointermove', e => { const r = hero.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
    hero.addEventListener('pointerleave', () => { mouse.x = mouse.y = -9999; });
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? start() : stop(); }).observe(hero);
    document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
  });
})();
