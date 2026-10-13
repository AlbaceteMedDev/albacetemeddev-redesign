/* sx-library (house style): one quiet reveal per block on the catalog, scientific portfolio and
   evidence library. Progressive only: nothing is hidden until html.sxl-io is set, blocks already
   on screen never hide, and reduced-motion visitors get no animation at all. */
(() => {
  const root = document.documentElement;
  root.classList.add('sx-js');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const targets = [
    '.catalog-group > header', '.catalog-item', '.catalog-disclosure',
    '.science-product-list > li', '.science-materials', '.science-note', '.science-dressing',
    '.science-device', '.science-study', '.science-endpoint', '.science-end',
    '.library-tools', '.ev-legend', '.ev-counts', '.ev-group', '.ev-card', '.ev-foot'
  ].join(',');
  const els = [...document.querySelectorAll(targets)];
  els.forEach(el => el.classList.add('sx-reveal'));

  if (reduced || !('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('is-in'));
    return;
  }

  // Anything already in (or above) the first viewport shows at once, without a flash.
  const vh = innerHeight;
  els.forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.top < vh * 0.94) el.classList.add('is-in', 'sxl-instant');
  });

  const io = new IntersectionObserver(entries => {
    let i = 0;
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.style.setProperty('--sxl-delay', `${Math.min(i++, 3) * 60}ms`);
      e.target.classList.add('is-in');
      io.unobserve(e.target);
    });
  }, { rootMargin: '0px 0px -6% 0px', threshold: 0.06 });
  els.forEach(el => { if (!el.classList.contains('is-in')) io.observe(el); });
  root.classList.add('sxl-io');

  // Drop the instant flag after first paint so later state changes keep their transitions.
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.querySelectorAll('.sxl-instant').forEach(el => el.classList.remove('sxl-instant'));
  }));

  // Hash jumps, filtering and print never leave a block hidden.
  const showAll = () => els.forEach(el => el.classList.add('is-in'));
  addEventListener('beforeprint', showAll);
  addEventListener('hashchange', showAll);
  document.addEventListener('input', e => { if (e.target.closest('.visual-catalog-tools, .library-tools, .science-find')) showAll(); });
  document.addEventListener('click', e => { if (e.target.closest('.science-filters, [data-reset-visual], [data-evidence-reset], .science-show-all')) showAll(); });
})();
