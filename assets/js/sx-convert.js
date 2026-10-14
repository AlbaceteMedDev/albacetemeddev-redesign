/* sx-convert (house style): one quiet reveal per block on Contact, the Ovena store, Portal and 404;
   on the Portal, the preview's sparklines and bars draw once when it first comes into view (v5).
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

  // Portal preview: the first time it comes into view its sparklines draw and its bars rise, once.
  const device = document.querySelector('.cx-portal .cx-device');
  if (device) {
    if (device.getBoundingClientRect().top < vh * 0.75) device.classList.add('pm-drawn');
    else {
      const dio = new IntersectionObserver(es => {
        if (!es.some(e => e.isIntersecting)) return;
        device.classList.add('pm-drawn');
        dio.disconnect();
      }, { rootMargin: '0px 0px -25% 0px', threshold: 0 });
      dio.observe(device);
    }
  }
  root.classList.add('cx-io');

  const showAll = () => {
    els.forEach(el => el.classList.add('is-in'));
    if (device) device.classList.add('pm-drawn');
  };
  addEventListener('beforeprint', showAll);
  addEventListener('hashchange', showAll);
})();
