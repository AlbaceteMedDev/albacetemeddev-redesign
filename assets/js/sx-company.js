/* Company & services pages (house style, Oct 2026).
   One quiet reveal per content block that starts below the fold: opacity plus a 12px rise, once.
   Nothing is hidden without this script, without IntersectionObserver, or under reduced motion. */
(() => {
  const root = document.documentElement;
  root.classList.add('sx-js', 'sx-co-ready');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) return;

  const blocks = [...document.querySelectorAll('main :is(section, .sx-band) > .container > *, main .services-direct')]
    .filter(el => !el.hidden && !el.closest('.hero, .sx-co-hero, .services-workspace'));
  const fold = innerHeight * 0.92;
  const io = new IntersectionObserver(entries => entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('is-in');
    io.unobserve(entry.target);
  }), { rootMargin: '0px 0px -8% 0px', threshold: 0 });

  blocks.forEach(el => {
    if (el.getBoundingClientRect().top < fold) return; // already on screen: no entrance
    el.classList.add('sx-reveal', 'sx-fade');
    io.observe(el);
  });
})();
