// Ovena Health storefront section (amazon-store page).
// Loads the live catalog through /api/ovena-products (a Cloudflare Pages
// Function that proxies ovenahealth.com's public product feed) and renders
// product cards. "Add to cart" hands the chosen variant to ovenahealth.com's
// cart in a new tab, where checkout completes. If the feed is unavailable the
// section falls back to a plain link to the store.
(function initOvenaStore(){
  const root = document.getElementById('ovena-products');
  if (!root) return;
  const STORE = 'https://www.ovenahealth.com';
  const money = (v) => '$' + Number(v).toFixed(2);

  function el(tag, cls, text){
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function addLink(variantId){
    return STORE + '/cart/add?id=' + encodeURIComponent(variantId) + '&quantity=1&return_to=%2Fcart';
  }
  function fallback(){
    root.innerHTML = '';
    const box = el('div', 'ov-fallback');
    box.appendChild(el('p', null, 'The live catalog is taking a moment to load.'));
    const a = el('a', 'btn btn-primary', 'Open ovenahealth.com ');
    a.href = STORE; a.target = '_blank'; a.rel = 'noopener';
    a.appendChild(el('span', 'arrow', '→'));
    box.appendChild(a);
    root.appendChild(box);
  }
  function card(p){
    const productUrl = STORE + '/products/' + encodeURIComponent(p.handle);
    const variants = p.variants.filter((v) => v && v.id);
    let current = variants.find((v) => v.available) || variants[0];

    const art = el('article', 'ov-card');
    const media = el('a', 'ov-card-media');
    media.href = productUrl; media.target = '_blank'; media.rel = 'noopener';
    if (p.image){
      const img = el('img');
      img.src = p.image; img.alt = p.title; img.loading = 'lazy'; img.decoding = 'async';
      media.appendChild(img);
    }
    art.appendChild(media);

    const body = el('div', 'ov-card-body');
    if (p.type) body.appendChild(el('div', 'ov-card-type', p.type));
    const h3 = el('h3', 'ov-card-title');
    const tl = el('a', null, p.title);
    tl.href = productUrl; tl.target = '_blank'; tl.rel = 'noopener';
    h3.appendChild(tl);
    body.appendChild(h3);

    const row = el('div', 'ov-card-row');
    const price = el('div', 'ov-card-price', money(current.price));
    const add = el('a', 'btn btn-primary ov-card-add');
    add.target = '_blank'; add.rel = 'noopener';

    function sync(){
      price.textContent = money(current.price);
      if (current.available){
        add.textContent = 'Add to cart ';
        add.appendChild(el('span', 'arrow', '→'));
        add.href = addLink(current.id);
        add.classList.remove('is-disabled');
        add.removeAttribute('aria-disabled');
      } else {
        add.textContent = 'Sold out';
        add.removeAttribute('href');
        add.classList.add('is-disabled');
        add.setAttribute('aria-disabled', 'true');
      }
    }
    if (variants.length > 1){
      const wrap = el('label', 'ov-card-select');
      wrap.appendChild(el('span', 'sr-only', 'Option for ' + p.title));
      const sel = el('select');
      variants.forEach((v) => {
        const o = el('option', null, v.title + (v.available ? '' : ' — sold out'));
        o.value = String(v.id);
        sel.appendChild(o);
      });
      sel.value = String(current.id);
      sel.addEventListener('change', () => {
        current = variants.find((v) => String(v.id) === sel.value) || current;
        sync();
      });
      wrap.appendChild(sel);
      row.appendChild(wrap);
    }
    row.appendChild(price);
    body.appendChild(row);
    sync();
    body.appendChild(add);
    art.appendChild(body);
    return art;
  }
  function render(products){
    root.innerHTML = '';
    if (!products.length){ fallback(); return; }
    const grid = el('div', 'ov-grid');
    products.forEach((p) => grid.appendChild(card(p)));
    root.appendChild(grid);
    root.classList.add('is-ready');
  }

  fetch('/api/ovena-products', { headers: { accept: 'application/json' } })
    .then((r) => { if (!r.ok) throw new Error('feed ' + r.status); return r.json(); })
    .then((data) => render(Array.isArray(data.products) ? data.products : []))
    .catch(fallback);
})();
