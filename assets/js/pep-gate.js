/* pep-gate: the professional-use confirmation on /products/peptides/ (Oct 17).
   - Shown before the catalog, once per browser session (sessionStorage 'amd-pep-pro' = '1'; every read and write in
     try/catch, so with storage blocked it simply asks again on the next visit).
   - An accessible modal: role="dialog", aria-modal, labelled by its heading and described by its text. While it is
     open the rest of the page is inert (and aria-hidden for older readers), Tab and Shift+Tab stay inside it, and
     focus is held inside it. Escape does NOT dismiss it: only the confirm button reveals the page; "Leave this page"
     is a plain link to /products/. On confirm, focus returns to where it was (at load that is the page, so <main>).
   - Without JS nothing is gated: the dialog stays hidden and the page shows normally with its notice band. The page's
     head script only holds the page behind the backdrop until this file mounts the dialog (and lets go after 6s if
     this file never arrives). Print always shows the page (sx-peptides.css).
   Words are the page's own (in the markup); nothing here adds any. */
(() => {
  const KEY = 'amd-pep-pro', root = document.documentElement;
  const gate = document.getElementById('pep-gate');
  const done = () => { try { return sessionStorage.getItem(KEY) === '1'; } catch (e) { return false; } };
  if (!gate || done()) { root.classList.remove('pep-gate-wait'); return; }

  const panel = gate.querySelector('[role="dialog"]');
  const confirm = gate.querySelector('[data-pep-gate-ok]');
  const main = document.getElementById('main');
  let prev = document.activeElement, inerted = [];
  const stops = () => [...panel.querySelectorAll('a[href],button:not([disabled])')];

  function onKey(e) {
    if (e.key === 'Escape' || e.key === 'Esc') {          // never dismiss into the page
      e.preventDefault(); e.stopImmediatePropagation();
      return;
    }
    if (e.key !== 'Tab') return;
    const list = stops(), first = list[0], last = list[list.length - 1], at = document.activeElement;
    if (e.shiftKey && (at === first || at === panel || !panel.contains(at))) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && (at === last || !panel.contains(at))) { e.preventDefault(); first.focus(); }
  }
  function onFocusIn(e) {                                  // a fallback where `inert` is not supported
    if (!gate.contains(e.target)) panel.focus({ preventScroll: true });
  }

  function open() {
    inerted = [...document.body.children].filter(el => el !== gate && !el.inert &&
      !/^(SCRIPT|STYLE|TEMPLATE|NOSCRIPT|LINK)$/.test(el.tagName));
    inerted.forEach(el => { el.dataset.pepGateAh = el.getAttribute('aria-hidden') ?? ''; el.inert = true; el.setAttribute('aria-hidden', 'true'); });
    gate.hidden = false;
    root.classList.add('pep-gate-open');
    root.classList.remove('pep-gate-wait');
    document.addEventListener('keydown', onKey, true);
    document.addEventListener('focusin', onFocusIn, true);
    panel.focus({ preventScroll: true });
  }

  function close() {
    try { sessionStorage.setItem(KEY, '1'); } catch (e) { /* storage blocked: ask again next visit */ }
    document.removeEventListener('keydown', onKey, true);
    document.removeEventListener('focusin', onFocusIn, true);
    inerted.forEach(el => {                                // put back exactly what each element had
      const ah = el.dataset.pepGateAh; delete el.dataset.pepGateAh;
      el.inert = false;
      if (ah) el.setAttribute('aria-hidden', ah); else el.removeAttribute('aria-hidden');
    });
    inerted = [];
    gate.hidden = true;
    root.classList.remove('pep-gate-open');
    let back = prev && prev !== document.body && prev !== root && document.contains(prev) && !gate.contains(prev) ? prev : main;
    if (back === main && main && !main.hasAttribute('tabindex')) main.setAttribute('tabindex', '-1');
    if (back) back.focus({ preventScroll: true });
  }

  confirm.addEventListener('click', close);
  open();
})();
