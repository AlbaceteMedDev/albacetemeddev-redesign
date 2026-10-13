/* sx-product: quiet enhancements for product detail pages (house style, Oct 2026).
   Progressive only: every page is complete and readable without this file.
   1. One simple fade-in per block (opacity + 12px rise, once).
   2. Section nav scroll-spy: marks the current section link (aria-current).
   3. FAQ rows report their open state to assistive technology. */
(() => {
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasIO = 'IntersectionObserver' in window;
  root.classList.add('sx-js');
  if (!reduced && hasIO) root.classList.add('sx-armed');

  /* 1. Block reveals (the hidden state only exists under html.sx-armed). */
  const revealSel = [
    '.product-facts', '.product-overview .editorial-split', '.product-reading .editorial-split',
    '.product-next>.container', '.visual-catalog-grid', '.catalog-disclosure',
    '.editorial-specialty .section-header', '.editorial-specialty .products-grid',
    '.editorial-specialty .content-grid', '.editorial-specialty .faq', '.editorial-specialty .cta-band .container>div'
  ].join(',');
  const targets = [...document.querySelectorAll(revealSel)];
  targets.forEach(el => el.classList.add('sx-reveal'));
  if (root.classList.contains('sx-armed')) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { rootMargin: '0px 0px -6% 0px', threshold: 0.08 });
    targets.forEach(el => io.observe(el));
  } else {
    targets.forEach(el => el.classList.add('is-in'));
  }

  /* 2. Section nav: scroll-spy. */
  const navH = () => parseFloat(getComputedStyle(root).getPropertyValue('--nav-h')) || 72;
  document.querySelectorAll('.product-reading-nav>.container, .reading-nav>.container').forEach(bar => {
    const links = [...bar.querySelectorAll('a[href^="#"]')];
    const pairs = links.map(a => [a, document.getElementById(decodeURIComponent(a.hash.slice(1)))]).filter(p => p[1]);
    if (!pairs.length) return;
    let current = null;
    const setActive = a => {
      if (a === current) return;
      links.forEach(l => {
        l.classList.toggle('is-active', l === a);
        if (l === a) l.setAttribute('aria-current', 'true'); else l.removeAttribute('aria-current');
      });
      current = a;
      if (a && bar.scrollWidth > bar.clientWidth + 2) {
        bar.scrollTo({ left: Math.max(0, a.offsetLeft - 24), behavior: reduced ? 'auto' : 'smooth' });
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
    addEventListener('resize', spy, { passive: true });
    spy();
  });

  /* 3. FAQ rows (opened by app.js): expose expanded state; the +/× glyph is decorative. */
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    if (!q) return;
    q.querySelector('.faq-icon')?.setAttribute('aria-hidden', 'true');
    const sync = () => q.setAttribute('aria-expanded', String(item.classList.contains('is-open')));
    sync();
    new MutationObserver(sync).observe(item, { attributes: true, attributeFilter: ['class'] });
  });
})();
