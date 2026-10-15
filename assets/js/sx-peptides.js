/* sx-peptides: small, progressive helpers for the peptide storefront (/products/peptides/).
   The page's own inline script still owns filtering, search, the count and the URL state; this file only
   1. mirrors each filter toggle's on/off state to aria-pressed, so assistive technology hears it, and
   2. after a filter option is chosen from the sticky rail, brings the top of the shelf back into view when the
      reader has scrolled past it (the shelf above them may have just shrunk), and
   3. keeps the focused option wholly in view (WCAG 2.4.11, focus not obscured): inside the rail when the rail
      scrolls on its own, and inside the window while the rail is not yet pinned; a filter chosen in the URL is
      scrolled into the rail's own view at load (the page is not moved then).
   Nothing here adds words. */
(() => {
  const pills = [...document.querySelectorAll('#pep-filters .pep-pill')];
  if (!pills.length) return;
  const sync = b => b.setAttribute('aria-pressed', b.classList.contains('is-on') ? 'true' : 'false');
  pills.forEach(b => {
    sync(b);
    new MutationObserver(() => sync(b)).observe(b, { attributes: true, attributeFilter: ['class'] });
  });

  const shelf = document.querySelector('.pepx-results');
  const rail = document.querySelector('.pepx-rail');
  if (!shelf || !rail) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const wide = matchMedia('(min-width: 1024px)');
  const offset = () => {
    const cs = getComputedStyle(document.documentElement);
    return (parseFloat(cs.getPropertyValue('--nav-h')) || 72) + 57 + 16;
  };
  /* the rail scrolls on its own only when its options are taller than the window allows (sx-peptides.css). A
     focused option is brought fully into view with the rail's 16px scroll padding and the page's own scroll
     padding (the nav and section bar, house-motion.js): "nearest" moves nothing when it is already in view. */
  rail.addEventListener('focusin', e => {
    const b = e.target.closest && e.target.closest('.pep-pill');
    if (!b || !wide.matches) return;
    try { b.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' }); } catch (_) { b.scrollIntoView(false); }
  });
  /* a filter arriving in the URL may sit below the rail's fold: scroll the rail (only the rail) to show it */
  const chosen = [...rail.querySelectorAll('.pep-pill.is-on:not([data-value=""])')].pop();
  if (chosen && wide.matches && rail.scrollHeight > rail.clientHeight + 1) {
    const r = chosen.getBoundingClientRect(), box = rail.getBoundingClientRect();
    if (r.bottom > box.bottom - 16) rail.scrollTop += r.bottom - box.bottom + 16;
  }
  pills.forEach(b => b.addEventListener('click', () => {
    if (!wide.matches) return;
    requestAnimationFrame(() => {
      const top = shelf.getBoundingClientRect().top;
      if (top < offset() - 1) {
        scrollTo({ top: scrollY + top - offset(), behavior: reduced.matches ? 'auto' : 'smooth' });
      }
    });
  }));
})();
