/* sx-convert (house style): one quiet reveal per block on Contact, the Ovena store, Portal and 404.
   Progressive only: blocks hide only after html.cx-io is set here, blocks already on screen never
   hide, and reduced-motion visitors get no animation. window.cxReady tells the inline head
   script this file arrived, so it keeps html.sx-js. */
(() => {
  const root = document.documentElement;
  root.classList.add('sx-js');
  window.cxReady = true;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const els = [...document.querySelectorAll('.sx-reveal')];

  if (reduced || !('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('is-in'));
    return;
  }

  const vh = innerHeight;
  els.forEach(el => { if (el.getBoundingClientRect().top < vh * 0.94) el.classList.add('is-in'); });

  const io = new IntersectionObserver(entries => {
    let i = 0;
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.style.setProperty('--sx-delay', `${Math.min(i++, 3) * 60}ms`);
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.08 });
  els.forEach(el => { if (!el.classList.contains('is-in')) io.observe(el); });
  root.classList.add('cx-io');

  const showAll = () => els.forEach(el => el.classList.add('is-in'));
  addEventListener('beforeprint', showAll);
  addEventListener('hashchange', showAll);
})();
