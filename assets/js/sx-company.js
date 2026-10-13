/* Company & services pages: staged hero entrance, scroll reveals, gold node network,
   card spotlight + tilt, magnetic buttons and word-lit statements. Vanilla, no dependencies. */
(() => {
  const root = document.documentElement;
  root.classList.add('sx-js', 'sx-co-ready');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  // Hero entrance (headline rise, emblem fade).
  requestAnimationFrame(() => root.classList.add('sx-go'));

  // Scroll reveals with a light stagger inside each batch (data-stagger is honoured).
  const items = [...document.querySelectorAll('main .scroll-reveal, main .sx-reveal, .sx-co-direct .services-direct')];
  if (!('IntersectionObserver' in window) || reduced) {
    items.forEach(el => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver(entries => {
      entries.filter(e => e.isIntersecting).forEach((e, i) => {
        const own = parseInt(e.target.dataset.stagger || '', 10);
        const delay = Number.isFinite(own) ? Math.min(own, 480) : Math.min(i * 90, 450);
        e.target.style.setProperty('--sx-delay', `${delay}ms`);
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    items.forEach(el => io.observe(el));
  }

  // Scroll progress hairline (shared with the home page vocabulary).
  if (!reduced) {
    const bar = document.createElement('div');
    bar.className = 'sx-co-progress';
    bar.setAttribute('aria-hidden', 'true');
    document.body.append(bar);
    let queued = false;
    const paint = () => {
      queued = false;
      const max = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${max > 0 ? Math.min(1, scrollY / max) : 0})`;
    };
    addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(paint); } }, { passive: true });
    addEventListener('resize', paint);
    paint();
  }

  // FAQ rows are clickable divs; give them button semantics for keyboard users.
  document.querySelectorAll('.faq-q').forEach(q => {
    if (q.tagName === 'BUTTON' || q.hasAttribute('tabindex')) return;
    q.setAttribute('role', 'button');
    q.tabIndex = 0;
    q.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); q.click(); }
    });
  });

  // Word-lit statements: words brighten as the block crosses the viewport.
  document.querySelectorAll('[data-sx-scrub]').forEach(text => {
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
        } else if (n.nodeType === 1 && n.tagName === 'EM') n.classList.add('w');
        else if (n.nodeType === 1) wrap(n);
      });
    };
    wrap(text);
    if (reduced) return;
    const words = [...text.querySelectorAll('.w')];
    text.classList.add('is-scrub');
    let ticking = false;
    const update = () => {
      ticking = false;
      const r = text.getBoundingClientRect();
      const vh = innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.88 - r.top) / (vh * 0.5)));
      const lit = Math.round(p * words.length);
      words.forEach((w, i) => w.classList.toggle('on', i < lit));
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    addEventListener('resize', update);
    update();
  });

  if (fine && !reduced) {
    // Pointer spotlight on glass cards and rows.
    const spot = '.cs-cap,.finding-card,.process-step,.rcm-step,.product-card,.specialty-card,.content-block,.hero-spec-panel,.engagement-steps>li,.review-outline,.scope-row,.wp-cap';
    document.querySelectorAll(`main :is(${spot})`).forEach(el => el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    }));

    // Gentle 3D tilt on the numbered step cards.
    document.querySelectorAll('main :is(.process-step,.rcm-step,.cs-cap,.sx-co--software .product-card,.engagement-steps>li)').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        el.style.transform = `perspective(1100px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateY(-4px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });

    // Magnetic primary actions (uses `translate`, so existing transforms stay intact).
    document.querySelectorAll('main :is(.hero,.cta-band,.sx-co-direct) :is(.btn-primary,.btn-secondary,.services-direct a)').forEach(b => {
      b.addEventListener('pointermove', e => {
        const r = b.getBoundingClientRect();
        b.style.translate = `${(e.clientX - r.left - r.width / 2) * .16}px ${(e.clientY - r.top - r.height / 2) * .28 - 2}px`;
      });
      b.addEventListener('pointerleave', () => { b.style.translate = ''; });
    });

    // Hero light follows the pointer.
    document.querySelectorAll('.sx-co-fx').forEach(fx => {
      const host = fx.parentElement;
      host.addEventListener('pointermove', e => {
        const r = fx.getBoundingClientRect();
        fx.style.setProperty('--hx', `${e.clientX - r.left}px`);
        fx.style.setProperty('--hy', `${e.clientY - r.top}px`);
      });
    });
  }

  // Gold node network behind each hero (the home "healing matrix", lighter).
  document.querySelectorAll('canvas.sx-co-net').forEach(canvas => {
    if (!canvas.getContext) return;
    const ctx = canvas.getContext('2d');
    const box = canvas.parentElement, host = box.parentElement;
    let w = 0, h = 0, nodes = [], running = false, visible = true;
    const mouse = { x: -9999, y: -9999 };

    function size() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = box.clientWidth; h = box.clientHeight;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(90, Math.max(28, (w * h) / 19000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - .5) * .2, vy: (Math.random() - .5) * .2,
        r: Math.random() * 1.5 + .5, p: Math.random() * Math.PI * 2
      }));
    }

    function frame(t) {
      ctx.clearRect(0, 0, w, h);
      const link = Math.min(160, w / 7);
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
            ctx.strokeStyle = `rgba(216,181,106,${(1 - d / link) * .2})`;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
      }
      for (const n of nodes) {
        const tw = .55 + .45 * Math.sin(t / 900 + n.p);
        ctx.fillStyle = `rgba(241,213,148,${.3 + tw * .5})`;
        ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill();
      }
    }

    let raf = 0;
    const loop = t => { frame(t); raf = running ? requestAnimationFrame(loop) : 0; };
    const start = () => { if (!running && visible && !reduced && !document.hidden) { running = true; if (!raf) raf = requestAnimationFrame(loop); } };
    const stop = () => { running = false; if (raf) { cancelAnimationFrame(raf); raf = 0; } };
    size();
    if (reduced) frame(0); else start();
    let rt;
    addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { size(); if (reduced || !running) frame(performance.now()); }, 150); });
    host.addEventListener('pointermove', e => { const r = box.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
    host.addEventListener('pointerleave', () => { mouse.x = mouse.y = -9999; });
    if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => { visible = e.isIntersecting; visible ? start() : stop(); }).observe(box);
    document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
  });
})();
