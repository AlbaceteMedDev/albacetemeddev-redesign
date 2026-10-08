/* The complete reference remains readable without JavaScript. */
(() => {
  const toc = document.querySelector('.science-toc');
  if (!toc) return;
  const mobile = matchMedia('(max-width:800px)');
  const reduced = matchMedia('(prefers-reduced-motion:reduce)');
  function sizeToc() { toc.open = !mobile.matches; }
  sizeToc(); mobile.addEventListener('change', sizeToc);
  const links = [...toc.querySelectorAll('ol a')];
  const chapters = links.map(link => document.querySelector(link.getAttribute('href')));
  links.forEach(link => link.addEventListener('click', () => { if (mobile.matches) toc.open = false; }));
  let queued = false;
  function trackChapter() {
    queued = false;
    const line = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h')) + (mobile.matches ? 100 : 60);
    let active = 0;
    chapters.forEach((chapter, index) => { if (chapter.getBoundingClientRect().top <= line) active = index; });
    links.forEach((link, index) => {
      if (index === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  window.addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(trackChapter); } }, {passive:true});
  window.addEventListener('resize', trackChapter, {passive:true}); trackChapter();
  const print = toc.querySelector('[data-print-science]');
  print.hidden = false; print.addEventListener('click', () => window.print());

  const tools = document.querySelector('.science-find');
  const query = tools.querySelector('input');
  const rows = [...document.querySelectorAll('.science-product-list li')];
  const showAll = document.querySelector('[data-science-show-all]');
  const status = document.querySelector('[data-science-results]');
  const empty = document.querySelector('.science-empty');
  const clear = tools.querySelector('[data-science-clear]');
  const normalize = text => text.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const entries = rows.map(row => ({row, text:normalize(row.dataset.search || row.textContent)}));
  let expanded = false;
  let category = '';
  const categories = [...tools.querySelectorAll('[data-science-category]')];
  categories.forEach(button => button.addEventListener('click', () => {
    category = button.dataset.scienceCategory;
    categories.forEach(item => item.setAttribute('aria-pressed', String(item === button)));
    filter();
  }));
  function filter() {
    const terms = normalize(query.value).trim().split(/\s+/).filter(Boolean);
    let matches = 0, visible = 0;
    entries.forEach(({row, text}) => {
      const match = terms.every(term => text.includes(term)) && (!category || row.dataset.category === category);
      if (match) matches++;
      row.hidden = !match || (!terms.length && !category && !expanded && visible >= 6);
      if (!row.hidden) visible++;
    });
    status.textContent = terms.length || category ? `${matches} ${matches === 1 ? 'product' : 'products'} found` : `Showing ${visible} of ${rows.length} products`;
    empty.hidden = matches > 0;
    showAll.hidden = !!terms.length || !!category;
    showAll.textContent = expanded ? 'Show fewer products' : `Show all ${rows.length} products`;
    showAll.setAttribute('aria-expanded', String(expanded));
    clear.hidden = !query.value && !category;
  }
  query.addEventListener('input', filter);
  clear.addEventListener('click', () => { query.value = ''; category = ''; categories.forEach(button => button.setAttribute('aria-pressed', String(!button.dataset.scienceCategory))); filter(); query.focus(); });
  showAll.addEventListener('click', () => {
    expanded = !expanded; filter();
    if (!expanded) document.getElementById('product-reference').scrollIntoView({behavior:reduced.matches ? 'instant' : 'smooth', block:'start'});
  });
  tools.hidden = false; filter();
})();
