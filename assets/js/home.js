/* Home signature motion: healing-matrix canvas, staged hero entrance, scroll reveals, card spotlight/tilt. */
(() => {
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;

  // Start the hero entrance once the session intro (if any) has finished.
  const go = () => root.classList.add('sx-go');
  const started = performance.now();
  (function waitForIntro() {
    const open = document.querySelector('dialog.amd-intro[open]');
    if ((!open && !root.classList.contains('amd-intro-pending')) || performance.now() - started > 9000) return go();
    requestAnimationFrame(waitForIntro);
  })();

  // Scroll reveals with light stagger inside each group.
  const items = document.querySelectorAll('.sx-reveal');
  if (!('IntersectionObserver' in window) || reduced) {
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

  // Pointer spotlight on path tiles; gentle 3D tilt on portfolio cards.
  if (fine && !reduced) {
    document.querySelectorAll('.sx-path').forEach(el => el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    }));
    document.querySelectorAll('.sx-card').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        el.style.transform = `rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-6px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }

  // Healing matrix: drifting gold nodes that knit together, drawn toward the pointer.
  const canvas = document.querySelector('.sx-matrix');
  if (!canvas || !canvas.getContext) return;
  const ctx = canvas.getContext('2d');
  const hero = canvas.parentElement;
  let w = 0, h = 0, dpr = 1, nodes = [], running = false, visible = true;
  const mouse = { x: -9999, y: -9999 };

  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
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
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? start() : stop(); }).observe(hero);
  document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
})();

/* Wow layer: manifesto scrub, hero parallax + light, magnetic buttons, custom cursor. */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;

  // Split manifesto into words; light them up with scroll progress.
  const text = document.querySelector('[data-scrub]');
  if (text) {
    const wrap = node => {
      [...node.childNodes].forEach(n => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) frag.append(part);
            else { const s = document.createElement('span'); s.className = 'w'; s.textContent = part; frag.append(s); }
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) wrap(n);
      });
    };
    wrap(text);
    const words = [...text.querySelectorAll('.w')];
    const section = text.closest('.sx-manifesto');
    if (reduced) words.forEach(w => w.classList.add('on'));
    else {
      const update = () => {
        const r = section.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, -r.top / (r.height - innerHeight) * 1.15));
        const lit = Math.round(p * words.length);
        words.forEach((w, i) => w.classList.toggle('on', i < lit));
      };
      addEventListener('scroll', update, { passive: true }); update();
    }
  }

  if (!fine || reduced) return;

  // Hero light + arch parallax.
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

  // Magnetic buttons.
  document.querySelectorAll('.sx-btn').forEach(b => {
    b.addEventListener('pointermove', e => {
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .18}px, ${(e.clientY - r.top - r.height / 2) * .3}px)`;
    });
    b.addEventListener('pointerleave', () => { b.style.transform = ''; });
  });

  // Custom cursor: eased ring + precise dot.
  const ring = Object.assign(document.createElement('div'), { className: 'sx-cursor' });
  const dot = Object.assign(document.createElement('div'), { className: 'sx-cursor-dot' });
  ring.setAttribute('aria-hidden', 'true'); dot.setAttribute('aria-hidden', 'true');
  document.body.append(ring, dot);
  let mx = -100, my = -100, rx = -100, ry = -100;
  addEventListener('pointermove', e => { mx = e.clientX; my = e.clientY; dot.style.transform = `translate3d(${mx}px,${my}px,0)`; }, { passive: true });
  (function loop() { rx += (mx - rx) * .18; ry += (my - ry) * .18; ring.style.transform = `translate3d(${rx}px,${ry}px,0)`; requestAnimationFrame(loop); })();
  document.addEventListener('pointerover', e => ring.classList.toggle('is-hover', !!e.target.closest('a,button')));
  document.addEventListener('pointerleave', () => { mx = my = -100; });
})();

/* Wow layer 2: scroll progress hairline + desktop section index (labels reuse each section's own eyebrow). */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const bar = Object.assign(document.createElement('div'), { className: 'sx-progress' });
  bar.setAttribute('aria-hidden', 'true');
  document.body.append(bar);
  let ticking = false;
  const paint = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
    ticking = false;
  };
  if (!reduced) { addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(paint); } }, { passive: true }); paint(); }

  const sections = [...document.querySelectorAll('.sx-home > section, .sx-home > nav.sx-paths')]
    .map(s => ({ el: s, label: (s.querySelector('.sx-eyebrow')?.textContent || '').trim() }))
    .filter(s => s.label);
  if (!sections.length || !('IntersectionObserver' in window)) return;
  const nav = document.createElement('nav');
  nav.className = 'sx-index';
  nav.setAttribute('aria-label', 'Page sections');
  sections.forEach((s, i) => {
    const b = document.createElement('button');
    b.type = 'button';
    b.innerHTML = '<span></span>';
    b.querySelector('span').textContent = s.label;
    b.setAttribute('aria-label', s.label);
    b.addEventListener('click', () => s.el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' }));
    s.btn = b; nav.append(b);
  });
  document.body.append(nav);
  requestAnimationFrame(() => nav.classList.add('is-ready'));
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => { if (e.isIntersecting) sections.forEach(s => s.btn.setAttribute('aria-current', s.el === e.target ? 'true' : 'false')); });
  }, { rootMargin: '-45% 0px -50% 0px' });
  sections.forEach(s => io.observe(s.el));
})();
