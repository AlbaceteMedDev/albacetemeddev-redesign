/* The public portal preview uses fictional data and local sample downloads. */
(() => {
  const shell = document.querySelector('.pm-shell');
  if (!shell) return;

  const buttons = [...shell.querySelectorAll('.pm-nav-item[data-view]')];
  const views = [...shell.querySelectorAll('.pm-view[data-view]')];
  const selector = shell.querySelector('#pm-view-select');
  const sectionName = shell.querySelector('[data-portal-section]');
  const mobile = matchMedia('(max-width: 1024px)');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  function switchView(name, moveFocus = false) {
    const target = views.find(view => view.dataset.view === name);
    if (!target) return;
    buttons.forEach(button => {
      const active = button.dataset.view === name;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    views.forEach(view => {
      const active = view === target;
      view.hidden = !active;
      view.classList.toggle('is-active', active);
    });
    selector.value = name;
    sectionName.textContent = selector.selectedOptions[0].textContent;
    if (moveFocus) target.querySelector('h3').focus({ preventScroll: true });

    const toolbar = shell.querySelector('.pm-mobile-navigation');
    const top = mobile.matches ? toolbar.getBoundingClientRect().bottom : parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--nav-h'));
    const rect = target.getBoundingClientRect();
    if (rect.top < top || rect.top > innerHeight * 0.8) {
      target.scrollIntoView({ block: 'start', behavior: reduced.matches ? 'instant' : 'smooth' });
    }
  }

  buttons.forEach(button => button.addEventListener('click', () => switchView(button.dataset.view, true)));
  selector.addEventListener('change', () => switchView(selector.value));
  shell.querySelectorAll('[data-goto]').forEach(button => {
    button.addEventListener('click', () => switchView(button.dataset.goto, true));
  });

  const orders = shell.querySelector('[data-view="orders"].pm-view');
  const rows = [...orders.querySelectorAll('.pm-row[data-status]')];
  const filters = [...orders.querySelectorAll('[data-filter]')];
  const result = orders.querySelector('[data-order-results]');
  filters.forEach(button => {
    const count = rows.filter(row => button.dataset.filter === 'all' || row.dataset.status === button.dataset.filter).length;
    button.querySelector('[data-filter-count]').textContent = count;
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      filters.forEach(item => {
        const active = item === button;
        item.classList.toggle('is-active', active);
        item.setAttribute('aria-pressed', String(active));
      });
      rows.forEach(row => { row.hidden = filter !== 'all' && row.dataset.status !== filter; });
      const visible = rows.filter(row => !row.hidden).length;
      result.textContent = `${visible} of ${rows.length} sample orders shown`;
    });
  });
  result.textContent = `${rows.length} of ${rows.length} sample orders shown`;

  const account = document.getElementById('pm-account-card');
  let accountTrigger;
  document.querySelectorAll('[data-portal-account]').forEach(button => {
    button.addEventListener('click', () => {
      accountTrigger = button;
      account.showModal();
    });
  });
  document.getElementById('pm-account-close').addEventListener('click', () => account.close());
  account.addEventListener('close', () => accountTrigger?.focus());
  account.addEventListener('click', event => {
    if (event.target !== account) return;
    const rect = account.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) account.close();
  });
})();
