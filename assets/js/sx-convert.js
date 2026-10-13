/* sx-convert motion layer (Contact, Ovena store, Portal, 404): scroll reveals, healing-matrix
   canvas, pointer light + spotlight, card tilt, magnetic buttons, portal device tilt,
   scroll progress hairline and the home page's cursor. Mirrors assets/js/home.js. */
(() => {
  const root = document.documentElement;
  root.classList.add('sx-js');
  window.cxReady = true;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(pointer: fine)').matches;

  /* Scroll reveals with a light stagger inside each batch. */
  let io = null;
  if ('IntersectionObserver' in window && !reduced) {
    io = new IntersectionObserver(entries => {
      entries.filter(e => e.isIntersecting).forEach((e, i) => {
        e.target.style.setProperty('--sx-delay', `${i * 90}ms`);
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
  }
  const watch = el => { if (io) io.observe(el); else el.classList.add('is-in'); };
  document.querySelectorAll('.sx-reveal, .cx-wipe, .cx-draw').forEach(watch);

  /* Pointer spotlight (--mx/--my) on tiles and channels; tilt on cards; magnetic buttons. */
  const spot = el => el.addEventListener('pointermove', e => {
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  });
  const tilt = el => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      el.style.transform = `rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-6px)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  };
  const magnet = b => {
    b.addEventListener('pointermove', e => {
      const r = b.getBoundingClientRect();
      b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .16}px, ${(e.clientY - r.top - r.height / 2) * .28}px)`;
    });
    b.addEventListener('pointerleave', () => { b.style.transform = ''; });
  };
  const enhance = scope => {
    if (!fine || reduced) return;
    scope.querySelectorAll('.cx-tile, .cx-channel').forEach(spot);
    scope.querySelectorAll('.cx-tilt').forEach(tilt);
    scope.querySelectorAll('.cx-btn').forEach(magnet);
  };
  enhance(document);

  /* Ovena live catalog renders later: reveal + enhance its cards when they arrive. */
  const shop = document.getElementById('ovena-products');
  if (shop && 'MutationObserver' in window) {
    new MutationObserver(() => {
      shop.querySelectorAll('.ov-card:not([data-cx])').forEach(card => {
        card.dataset.cx = '1'; card.classList.add('sx-reveal'); watch(card);
        if (fine && !reduced) { spot(card); tilt(card); }
      });
    }).observe(shop, { childList: true, subtree: true });
  }

  /* Hero pointer light. */
  if (fine && !reduced) document.querySelectorAll('[data-cx-light]').forEach(hero => {
    hero.addEventListener('pointermove', e => {
      const r = hero.getBoundingClientRect();
      hero.style.setProperty('--hx', `${e.clientX - r.left}px`);
      hero.style.setProperty('--hy', `${e.clientY - r.top}px`);
    });
  });

  /* One rAF-throttled scroll pass: progress hairline + portal device tilt. */
  const bar = reduced ? null : Object.assign(document.createElement('div'), { className: 'cx-progress' });
  if (bar) { bar.setAttribute('aria-hidden', 'true'); document.body.append(bar); }
  const shell = document.querySelector('.cx-device .pm-shell');
  const wide = matchMedia('(min-width: 1025px)');
  let ticking = false;
  function onScroll() {
    ticking = false;
    if (bar) {
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
    }
    if (shell) {
      if (reduced || !wide.matches) { shell.style.transform = ''; return; }
      const r = shell.parentElement.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (innerHeight - r.top) / (innerHeight * .75)));
      const e = 1 - Math.pow(1 - p, 3);
      shell.style.transform = e >= .992 ? '' : `rotateX(${(1 - e) * 16}deg) scale(${.9 + e * .1})`;
    }
  }
  const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } };
  addEventListener('scroll', req, { passive: true });
  addEventListener('resize', req);
  onScroll();

  /* Healing matrix: drifting gold nodes that knit together, drawn toward the pointer. */
  document.querySelectorAll('canvas.cx-matrix').forEach(canvas => {
    if (!canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    const host = canvas.parentElement;
    let w = 0, h = 0, nodes = [], running = false, visible = true;
    const mouse = { x: -9999, y: -9999 };
    const density = +canvas.dataset.density || 16000;
    function size() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = host.clientWidth; h = host.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(100, Math.max(30, (w * h) / density)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - .5) * .22, vy: (Math.random() - .5) * .22,
        r: Math.random() * 1.6 + .5, p: Math.random() * Math.PI * 2
      }));
    }
    function frame(t) {
      ctx.clearRect(0, 0, w, h);
      const link = Math.min(170, w / 7);
      if (!reduced) for (const n of nodes) {
        const dx = mouse.x - n.x, dy = mouse.y - n.y;
        if (dx * dx + dy * dy < 220 * 220) { n.vx += dx * .00002; n.vy += dy * .00002; }
        n.vx *= .995; n.vy *= .995; n.x += n.vx; n.y += n.vy;
        if (n.x < -20) n.x = w + 20; else if (n.x > w + 20) n.x = -20;
        if (n.y < -20) n.y = h + 20; else if (n.y > h + 20) n.y = -20;
      }
      ctx.lineWidth = .6;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < link) {
            ctx.strokeStyle = `rgba(216,181,106,${(1 - d / link) * .22})`;
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
    const start = () => { if (!running && visible && !reduced && !document.hidden) { running = true; requestAnimationFrame(frame); } };
    const stop = () => { running = false; };
    size();
    if (reduced) frame(0); else start();
    let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { size(); if (reduced) frame(0); }, 150); });
    host.addEventListener('pointermove', e => { const r = host.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
    host.addEventListener('pointerleave', () => { mouse.x = mouse.y = -9999; });
    if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? start() : stop(); }).observe(host);
    document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
  });

  /* Cursor: eased ring + precise dot (fine pointers only); the loop sleeps when settled. */
  if (!fine || reduced) return;
  const ring = Object.assign(document.createElement('div'), { className: 'cx-cursor' });
  const dot = Object.assign(document.createElement('div'), { className: 'cx-cursor-dot' });
  ring.setAttribute('aria-hidden', 'true'); dot.setAttribute('aria-hidden', 'true');
  document.body.append(ring, dot);
  let mx = -100, my = -100, rx = -100, ry = -100, looping = false;
  function loop() {
    rx += (mx - rx) * .18; ry += (my - ry) * .18;
    ring.style.transform = `translate3d(${rx}px,${ry}px,0)`;
    if (Math.abs(mx - rx) + Math.abs(my - ry) > .3 && !document.hidden) requestAnimationFrame(loop);
    else looping = false;
  }
  addEventListener('pointermove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate3d(${mx}px,${my}px,0)`;
    if (!looping) { looping = true; requestAnimationFrame(loop); }
  }, { passive: true });
  document.addEventListener('pointerover', e => {
    const field = !!e.target.closest('input:not([type=submit]),textarea');
    ring.classList.toggle('is-field', field);
    ring.classList.toggle('is-hover', !field && !!e.target.closest('a,button,select,summary,.faq-q,label'));
  });
  document.addEventListener('pointerleave', () => { mx = my = -100; if (!looping) { looping = true; requestAnimationFrame(loop); } });
})();
