/* Company & services pages (house style, Oct 2026; Minimal v7 Oct 15).
   One quiet reveal per content block that starts below the fold: opacity plus a 12px rise over 600ms, once
   (timing and easing come from the v7 tokens in sx-company.css). The v5 route diagrams (a scroll-drawn line with
   '+' stations and dimmed headings) are retired in v7: step lists keep a single hairline and read as plain text.
   Nothing is hidden without this script, without IntersectionObserver, or under reduced motion. */
(() => {
  'use strict';
  const doc = document, root = doc.documentElement;
  root.classList.add('sx-js', 'sx-co-ready');
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasIO = 'IntersectionObserver' in window;

  try { fades(); } catch (err) { if (window.console) console.warn('sx-company:', err); }

  function fades() {
    if (calm || !hasIO) return;
    const blocks = [...doc.querySelectorAll('main :is(section, .sx-band) > .container > *, main .services-direct')]
      .filter(el => !el.hidden && !el.closest('.hero, .sx-co-hero, .services-workspace'));
    const fold = innerHeight * 0.92;
    const io = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    }), {rootMargin: '0px 0px -8% 0px', threshold: 0});
    blocks.forEach(el => {
      if (el.getBoundingClientRect().top < fold) return; // already on screen: no entrance
      el.classList.add('sx-reveal', 'sx-fade');
      io.observe(el);
    });
    addEventListener('beforeprint', () => blocks.forEach(el => el.classList.add('is-in')));
  }
})();
