/* sx-product: dossier motion for product detail pages (Oct 2026).
   Progressive only: every page is complete and readable without this file.
   Adds scroll reveals, a scroll-spy section nav with a gliding indicator,
   pointer spotlights, a gentle 3D tilt on the hero vitrine, keyboard access
   for the FAQ rows, and pauses decorative loops while they are off-screen. */
(() => {
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;
  const hasIO = 'IntersectionObserver' in window;
  root.classList.add('sx-js');
  if (!reduced && hasIO) root.classList.add('sx-armed');

  /* 1. Scroll reveals (hidden state only exists under html.sx-armed). */
  const revealSel = [
    '.product-facts', '.product-overview .editorial-split>div:first-child', '.product-notes article',
    '.product-reading .editorial-split>div:first-child', '.research-links>a', '.product-next>.container',
    '.catalog-item', '.catalog-disclosure', '.category-header'
  ].join(',');
  const targets = [...document.querySelectorAll(revealSel)];
  targets.forEach(el => el.classList.add('sx-reveal'));
  if (root.classList.contains('sx-armed')) {
    const io = new IntersectionObserver(entries => {
      entries.filter(e => e.isIntersecting).forEach((e, i) => {
        e.target.style.setProperty('--sx-delay', `${i * 90}ms`);
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    targets.forEach(el => io.observe(el));
  } else {
    targets.forEach(el => el.classList.add('is-in'));
  }

  /* 2. Section nav: scroll-spy with a gliding indicator. */
  const navH = () => parseFloat(getComputedStyle(root).getPropertyValue('--nav-h')) || 80;
  document.querySelectorAll('.product-reading-nav>.container, .reading-nav>.container').forEach(bar => {
    const links = [...bar.querySelectorAll('a[href^="#"]')];
    const pairs = links.map(a => [a, document.getElementById(decodeURIComponent(a.hash.slice(1)))]).filter(p => p[1]);
    if (!pairs.length) return;
    const ind = document.createElement('i');
    ind.className = 'sxp-indicator';
    ind.setAttribute('aria-hidden', 'true');
    bar.prepend(ind);
    let current = null;
    const place = () => {
      if (!current) { ind.classList.remove('is-on'); return; }
      ind.style.setProperty('--x', `${current.offsetLeft}px`);
      ind.style.setProperty('--w', `${current.offsetWidth}px`);
      ind.classList.add('is-on');
    };
    const setActive = a => {
      if (a === current) return;
      links.forEach(l => {
        l.classList.toggle('is-active', l === a);
        if (l === a) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current');
      });
      current = a;
      place();
      if (a && bar.scrollWidth > bar.clientWidth + 2) {
        bar.scrollTo({ left: Math.max(0, a.offsetLeft - 20), behavior: reduced ? 'auto' : 'smooth' });
      }
    };
    let queued = false;
    const spy = () => {
      queued = false;
      const line = navH() + bar.offsetHeight + innerHeight * 0.22;
      let active = null;
      for (const [a, sec] of pairs) if (sec.getBoundingClientRect().top <= line) active = a;
      setActive(active);
    };
    addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(spy); } }, { passive: true });
    addEventListener('resize', () => { place(); spy(); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);
    spy();
  });

  /* 3. Keyboard access for FAQ rows that are not native buttons. */
  document.querySelectorAll('.faq-q').forEach(q => {
    if (q.tagName === 'BUTTON' || q.hasAttribute('tabindex')) return;
    q.setAttribute('role', 'button');
    q.tabIndex = 0;
    q.querySelector('.faq-icon')?.setAttribute('aria-hidden', 'true');
    q.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); q.click(); }
    });
  });

  /* 4. Pause infinite decorative loops while off-screen. */
  if (hasIO && !reduced) {
    const still = new IntersectionObserver(entries => {
      entries.forEach(e => e.target.classList.toggle('sxp-paused', !e.isIntersecting));
    }, { rootMargin: '80px 0px' });
    document.querySelectorAll('.product-editorial-hero, .product-reading, .product-next, .cta-band, .section, .faq-section').forEach(el => still.observe(el));
  }

  if (!fine || reduced) return;

  /* 5. Pointer spotlight (delegated, so the 54-card catalog costs one listener). */
  const spotSel = '.research-links>a, .product-facts>div, .product-card, .pep-card';
  document.addEventListener('pointermove', e => {
    const el = e.target.closest && e.target.closest(spotSel);
    if (!el) return;
    const r = el.getBoundingClientRect();
    el.style.setProperty('--mx', `${e.clientX - r.left}px`);
    el.style.setProperty('--my', `${e.clientY - r.top}px`);
  }, { passive: true });

  /* 6. Gentle 3D tilt: hero vitrine and family cards. */
  const tilt = (el, amount, lift) => {
    el.addEventListener('pointermove', e => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      el.style.transform = `rotateY(${(x * amount).toFixed(2)}deg) rotateX(${(-y * amount).toFixed(2)}deg) translateY(${lift}px)`;
    });
    el.addEventListener('pointerleave', () => { el.style.transform = ''; });
  };
  const fig = document.querySelector('.product-editorial-grid figure');
  if (fig) tilt(fig, 5, -2);
  document.querySelectorAll('.catalog-item').forEach(el => tilt(el, 5, -6));
})();
