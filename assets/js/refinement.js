/* Product links reveal the matching native quick view. */
(() => {
  function revealProduct() {
    let id;
    try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { return; }
    if (!id) return;
    const entry = document.getElementById(id);
    if (!entry?.classList.contains('sheet-entry')) return;
    const details = entry.querySelector('details');
    if (details) details.open = true;
    entry.querySelector('summary')?.focus({ preventScroll: true });
    entry.scrollIntoView({ behavior: 'instant', block: 'start' });
  }
  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[href]');
    if (!link || link.target === '_blank') return;
    const destination = new URL(link.href, window.location.href);
    if (destination.origin === window.location.origin &&
        destination.pathname.replace(/\/$/, '') === window.location.pathname.replace(/\/$/, '') &&
        destination.hash && destination.hash === window.location.hash) {
      revealProduct();
    }
  });
  window.addEventListener('hashchange', revealProduct);
  window.addEventListener('albacete:reveal-product', revealProduct);
  revealProduct();
})();
