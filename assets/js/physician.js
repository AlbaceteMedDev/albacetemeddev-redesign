/* Progressive enhancements; the complete portfolio remains available without JS. */
(() => {
  const normalize = value => value.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '');
  const path = location.pathname.replace(/\/+$/, '') || '/';
  document.querySelectorAll('.nav-links a, .mobile-menu > a').forEach(link => {
    const target = new URL(link.href).pathname.replace(/\/+$/, '') || '/';
    if (path === target) link.setAttribute('aria-current', 'page');
  });
  const mobile = document.getElementById('mobile-menu');
  const toggle = document.querySelector('.nav-toggle');
  if (mobile && toggle) {
    const desktop = matchMedia('(min-width:1101px)');
    desktop.addEventListener('change', () => {
      if (desktop.matches && toggle.getAttribute('aria-expanded') === 'true') toggle.click();
    });
    document.addEventListener('keydown', event => {
      if (event.key !== 'Tab' || toggle.getAttribute('aria-expanded') !== 'true') return;
      const items = [toggle, ...mobile.querySelectorAll('a')];
      const first = items[0], last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    });
  }
  document.querySelectorAll('.faq-q').forEach((button, i) => {
    const item = button.closest('.faq-item');
    const panel = item?.querySelector('.faq-a');
    if (!item || !panel) return;
    button.setAttribute('aria-expanded', String(item.classList.contains('is-open')));
    panel.id ||= `faq-answer-${i}`;
    button.setAttribute('aria-controls', panel.id);
    button.addEventListener('click', () => {
      document.querySelectorAll('.faq-q').forEach(q => q.setAttribute('aria-expanded', String(q.closest('.faq-item')?.classList.contains('is-open'))));
    });
  });
  function setupLibrary(kind) {
    const tools = document.querySelector(`[data-${kind}-tools]`);
    if (!tools) return;
    const catalog = kind === 'catalog';
    const query = document.getElementById(`${kind}-search`);
    const select = document.getElementById(`${kind}-${catalog ? 'category' : 'grade'}`);
    const cards = [...document.querySelectorAll(catalog ? '.page-catalog main .product-card' : '.ev-card')];
    const groups = [...document.querySelectorAll(catalog ? '.category-header' : '.ev-group')].map(heading => ({heading, grid:heading.nextElementSibling}));
    const status = document.querySelector(`[data-${kind}-status]`);
    const empty = document.querySelector(`[data-${kind}-empty]`);
    const index = document.querySelector('.category-index');
    if (catalog) groups.forEach(({heading,grid}) => {
      const option = document.createElement('option'); option.value = heading.id; option.textContent = heading.querySelector('h3').textContent;
      select.append(option);
      grid.querySelectorAll('.product-card').forEach(card => { card.dataset.catalogCategory = heading.id; });
    });
    const entries = cards.map(card => ({card, text:normalize(card.textContent + ' ' + [...card.querySelectorAll('[title]')].map(x=>x.title).join(' ')), category:catalog ? card.dataset.catalogCategory : (card.querySelector('.ev-grade')?.textContent.trim() || 'N/A')}));
    function update() {
      const terms = normalize(query.value).trim().split(/\s+/).filter(Boolean);
      let count = 0;
      entries.forEach(({card,text,category}) => {
        const show = terms.every(term => text.includes(term)) && (!select.value || category === select.value);
        card.hidden = !show; if (show) count++;
      });
      groups.forEach(({heading,grid}) => {
        const show = [...grid.querySelectorAll(catalog ? '.product-card' : '.ev-card')].some(card => !card.hidden);
        heading.hidden = !show; grid.hidden = !show;
      });
      status.textContent = `${count} of ${cards.length} ${catalog ? 'products' : 'evidence entries'} shown`;
      empty.hidden = count > 0;
      if (index) index.hidden = terms.length > 0 || !!select.value;
    }
    function reset() { query.value = ''; select.value = ''; update(); }
    function revealHash() {
      let id; try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
      const target = document.getElementById(id);
      if (!target) return;
      if (target.matches('.ev-card,.sheet-entry,.category-header')) {
        reset();
        const details = target.querySelector('details'); if (details && catalog) details.open = true;
      }
    }
    query.addEventListener('input', update); select.addEventListener('change', update);
    document.querySelector(`[data-${kind}-reset]`).addEventListener('click', () => { reset(); query.focus(); });
    window.addEventListener('hashchange', revealHash);
    tools.hidden = false; update(); revealHash();
  }
  setupLibrary('catalog'); setupLibrary('evidence');
})();
