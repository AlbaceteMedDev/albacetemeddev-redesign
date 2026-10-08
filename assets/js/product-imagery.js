/* The linked image still opens if the optional viewer cannot initialize. */
(() => {
  const triggers = [...document.querySelectorAll('[data-product-image]')];
  if (!triggers.length || !window.HTMLDialogElement) return;
  fetch('/assets/data/portfolio.json?v=20261008-images').then(response => {
    if (!response.ok) throw new Error('Product reference unavailable');
    return response.json();
  }).then(products => {
    const byId = new Map(products.filter(p => p.visual).map(p => [p.slug, p]));
    const dialog = document.createElement('dialog');
    dialog.className = 'image-dialog';
    dialog.setAttribute('aria-labelledby', 'image-dialog-title');
    dialog.innerHTML = '<header><p>Product imagery &amp; source reference</p><button type="button" class="image-dialog-close" aria-label="Close image viewer">×</button></header><div class="image-dialog-grid"><div class="image-dialog-view"><div class="image-view-switch" role="group" aria-label="Choose image"><button type="button" data-image-mode="illustration" aria-pressed="true">Illustrative photograph</button><button type="button" data-image-mode="reference" aria-pressed="false">Manufacturer reference</button></div><div class="image-dialog-stage"><img alt=""></div><p class="image-dialog-status" role="status"></p></div><div class="image-dialog-info"><p class="image-dialog-maker"></p><h2 id="image-dialog-title"></h2><dl><div><dt>Format</dt><dd data-image-format></dd></div><div><dt>Material / technology</dt><dd data-image-material></dd></div></dl><a data-image-product>Product details →</a><a data-image-source target="_blank" rel="noopener">Manufacturer documentation ↗</a><a data-image-original target="_blank" rel="noopener">Original reference file ↗</a></div></div>';
    document.body.append(dialog);
    const stage = dialog.querySelector('.image-dialog-stage');
    const image = stage.querySelector('img');
    const status = dialog.querySelector('.image-dialog-status');
    let current, opener;
    function show(mode) {
      stage.dataset.view = mode;
      const reference = mode === 'reference';
      image.alt = reference ? current.visual.referenceAlt : current.visual.alt;
      image.src = reference ? current.visual.reference : `/assets/images/editorial/${current.photo}.webp`;
      status.textContent = reference ? current.visual.referenceNote : 'Illustrative photograph based on the manufacturer reference. Consult the current package and instructions for use.';
      dialog.querySelectorAll('[data-image-mode]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.imageMode === mode)));
    }
    image.addEventListener('error', () => { status.textContent = 'This image could not load. Open the original reference file below.'; });
    triggers.forEach(trigger => trigger.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !byId.has(trigger.dataset.productImage)) return;
      event.preventDefault(); current = byId.get(trigger.dataset.productImage); opener = trigger;
      dialog.querySelector('.image-dialog-maker').textContent = current.maker;
      dialog.querySelector('h2').textContent = current.name;
      dialog.querySelector('[data-image-format]').textContent = current.form;
      dialog.querySelector('[data-image-material]').textContent = current.material;
      dialog.querySelector('[data-image-product]').href = current.url;
      dialog.querySelector('[data-image-source]').href = current.source;
      dialog.querySelector('[data-image-original]').href = current.visual.referenceUrl;
      show(trigger.dataset.imageView || 'illustration');
      dialog.showModal(); dialog.scrollTop = 0;
      dialog.querySelector('.image-dialog-close').focus({preventScroll:true});
    }));
    dialog.querySelectorAll('[data-image-mode]').forEach(button => button.addEventListener('click', () => show(button.dataset.imageMode)));
    dialog.querySelector('.image-dialog-close').addEventListener('click', () => dialog.close());
    dialog.addEventListener('close', () => opener?.focus({preventScroll:true}));
    dialog.addEventListener('click', event => {
      if (event.target !== dialog) return;
      const box = dialog.getBoundingClientRect();
      if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
    });
  }).catch(() => { /* Original image links remain functional. */ });
})();
