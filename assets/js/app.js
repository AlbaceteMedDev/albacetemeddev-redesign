// Albacete MedDev: navigation, clinical illustrations, search, and portal demo.

// Detect reduced-motion once; use to short-circuit showy animations
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(hover: none)').matches;

// Splash loader — the classic logo splash plays on every page load; the home
// page's first load of the session opens with the video ident instead (an
// inline <head> guard sets html.ident-pending pre-paint when sessionStorage
// has no 'amd-ident'). html.no-splash is now only used for bfcache restores.
document.documentElement.classList.add('no-splash');
document.body.classList.remove('is-loading');
document.body.classList.add('is-loaded');

// Highlight the current page in the nav and mobile menu
(function highlightActiveNav(){
  const current = (window.location.pathname || '/').replace(/\/+$/, '') || '/';
  const links = document.querySelectorAll('.nav-links > li > a, .mobile-menu > a');
  let bestMatch = null;
  let bestLen = -1;
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('#') || href.startsWith('mailto') || href.startsWith('tel') || href.startsWith('http')) return;
    const hrefPath = href.replace(/\/+$/, '') || '/';
    if (current === hrefPath || (hrefPath !== '/' && current.startsWith(hrefPath + '/'))){
      if (hrefPath.length > bestLen){
        bestMatch = link;
        bestLen = hrefPath.length;
      }
    }
  });
  if (bestMatch){
    const activeHref = bestMatch.getAttribute('href');
    const activePath = activeHref.replace(/\/+$/, '') || '/';
    links.forEach(l => {
      const p = (l.getAttribute('href') || '').replace(/\/+$/, '') || '/';
      if (p === activePath) l.classList.add('is-active');
    });
  }
})();

// Scroll-triggered reveal
(function initScrollReveal(){
  const els = document.querySelectorAll('.scroll-reveal');
  if (!('IntersectionObserver' in window) || els.length === 0){
    els.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        const target = entry.target;
        const stagger = parseInt(target.dataset.stagger || '0', 10);
        setTimeout(() => target.classList.add('is-visible'), stagger);
        io.unobserve(target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
  els.forEach(el => io.observe(el));
})();

// Mobile menu toggle
(function initMobileMenu(){
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.mobile-menu');
  const body = document.body;
  if (!toggle || !menu) return;

  function setOpen(open){
    toggle.classList.toggle('is-open', open);
    menu.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    body.style.overflow = open ? 'hidden' : '';
    menu.inert = !open;
    menu.setAttribute('aria-hidden', String(!open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (!open && menu.contains(document.activeElement)) toggle.focus();
  }

  toggle.addEventListener('click', () => {
    setOpen(!menu.classList.contains('is-open'));
  });

  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => setOpen(false));
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) setOpen(false);
  });
})();

// Mobile menu accordions — one section open at a time
(function initMobileAccordions(){
  const menu = document.querySelector('.mobile-menu');
  if (!menu) return;
  menu.addEventListener('click', e => {
    const btn = e.target.closest('.m-parent');
    if (!btn) return;
    const open = btn.getAttribute('aria-expanded') === 'true';
    menu.querySelectorAll('.m-parent').forEach(b => b.setAttribute('aria-expanded', 'false'));
    btn.setAttribute('aria-expanded', open ? 'false' : 'true');
  });
})();

// Nav background on scroll
(function initNavScroll(){
  const nav = document.querySelector('.nav');
  if (!nav) return;
  function onScroll(){
    if (window.scrollY > 20) nav.classList.add('is-scrolled');
    else nav.classList.remove('is-scrolled');
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });
})();

// One-shot grasper grab animation — fires when the heading scrolls into view
(function initGrabAnimation(){
  if (prefersReducedMotion) return;
  const grabTarget = document.querySelector('.grab-target');
  if (!grabTarget || !('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting){
        // Small delay so the motion reads as intentional, not jarring on scroll
        setTimeout(() => grabTarget.classList.add('is-grabbing'), 200);
        io.disconnect();
      }
    });
  }, { threshold: 0.6 });
  io.observe(grabTarget);
})();

// One-shot Microlyte SAM comparison animations — play once per visit, then stop
(function initSamAnimations(){
  if (prefersReducedMotion || !('IntersectionObserver' in window)) return;

  // LEFT panel — rigid dressing + voids
  const rigidGroup = document.querySelector('.sam-rigid-group');
  if (rigidGroup){
    const leftContainer = rigidGroup.closest('svg');
    if (leftContainer){
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          rigidGroup.classList.add('is-animating');
          leftContainer.querySelectorAll('.sam-void-mid, .sam-void-left, .sam-void-right')
            .forEach(el => el.classList.add('is-animating'));
          io.disconnect();
        });
      }, { threshold: 0.5 });
      io.observe(leftContainer);
    }
  }

  // RIGHT panel — PVA film + contact dots (dots fade in AFTER film settles)
  const pvaGroup = document.querySelector('.sam-pva-group');
  if (pvaGroup){
    const rightContainer = pvaGroup.closest('svg');
    if (rightContainer){
      const contacts = rightContainer.querySelectorAll('.sam-contact');
      const io = new IntersectionObserver((entries) => {
        entries.forEach(e => {
          if (!e.isIntersecting) return;
          pvaGroup.classList.add('is-animating');
          // Delay each contact dot sequentially so they appear AFTER the film
          // has settled (~2.4s into the 2.8s fall animation)
          contacts.forEach((dot, i) => {
            setTimeout(() => dot.classList.add('is-animating'), 2400 + i * 120);
          });
          io.disconnect();
        });
      }, { threshold: 0.5 });
      io.observe(rightContainer);
    }
  }
})();

// FAQ accordion
(function initFAQ(){
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      if (!item) return;
      const isOpen = item.classList.contains('is-open');
      const parent = item.parentElement;
      if (parent) parent.querySelectorAll('.faq-item.is-open').forEach(i => i.classList.remove('is-open'));
      if (!isOpen) item.classList.add('is-open');
    });
  });
})();





// ═══════════════════════════════════════════════════════════════
// Interactive portal demonstration
// ═══════════════════════════════════════════════════════════════
// Turn the dashboard mock into a click-around demo:
// - Sidebar nav items swap between 7 distinct views
// - "View all" links jump to the relevant view
// - Filter pills (Orders) actually filter rows by status
// - Export links/tiles trigger an XLSX-flies-to-computer animation
// - Clicking Dr. Romero opens an account summary popover
// - Pulsing "Try me" chip invites the first click, hides after
(function initInteractivePortal(){
  const shell = document.querySelector('.pm-shell');
  if (!shell) return;
  const shellWrap = shell.closest('.pm-shell-wrap') || shell;
  const navItems = shell.querySelectorAll('.pm-nav-item[data-view]');
  const views = shell.querySelectorAll('.pm-view[data-view]');
  const urlBar = shell.querySelector('.pm-url');
  // Chip lives OUTSIDE the shell (on the wrapper) so overflow:hidden doesn't clip it
  const chip = shellWrap.querySelector('.pm-tryme') || shell.querySelector('.pm-tryme');
  const computer = shell.querySelector('#pm-computer');
  if (navItems.length === 0 || views.length === 0) return;

  // ——— View switching ———
  function switchView(viewName, itemEl){
    // Update sidebar active state: if itemEl not passed, find first nav item with matching data-view
    navItems.forEach(i => i.classList.remove('active'));
    if (itemEl){
      itemEl.classList.add('active');
    } else {
      const firstMatch = shell.querySelector(`.pm-nav-item[data-view="${viewName}"]`);
      if (firstMatch) firstMatch.classList.add('active');
    }
    // Swap view panels
    views.forEach(v => v.classList.remove('is-active'));
    const target = shell.querySelector(`.pm-view[data-view="${viewName}"]`);
    if (target) target.classList.add('is-active');
    // Update URL bar
    if (urlBar) urlBar.textContent = `portal.albacetemeddev.com / ${viewName}`;
    // Hide try-me chip
    if (chip) chip.classList.add('is-hidden');
  }

  navItems.forEach(item => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const view = item.dataset.view;
      if (!view) return;
      switchView(view, item);
    });
  });

  // ——— View-all links: navigate to a view ———
  shell.querySelectorAll('[data-goto]').forEach(el => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const view = el.dataset.goto;
      if (view) switchView(view);
    });
  });

  // ——— Filter pills (Orders view) ———
  shell.querySelectorAll('.pm-pill[data-filter]').forEach(pill => {
    pill.addEventListener('click', () => {
      const filter = pill.dataset.filter;
      // Update active state on pill row
      const row = pill.parentElement;
      row.querySelectorAll('.pm-pill').forEach(p => p.classList.remove('is-active'));
      pill.classList.add('is-active');
      // Filter order rows
      const ordersView = shell.querySelector('.pm-view[data-view="orders"]');
      if (!ordersView) return;
      ordersView.querySelectorAll('.pm-row[data-status]').forEach(r => {
        const match = filter === 'all' || r.dataset.status === filter;
        r.style.display = match ? '' : 'none';
        r.style.opacity = match ? '1' : '0';
      });
    });
  });

  // ——— Export animation: XLSX flies to mini-computer ———
  function triggerExport(trigger, filename){
    if (!computer) return;
    const shellRect = shell.getBoundingClientRect();
    const trigRect = trigger.getBoundingClientRect();
    const compRect = computer.getBoundingClientRect();

    // File starts at the trigger's center, positioned relative to shell
    const fileSize = { w: 30, h: 38 };
    const startX = (trigRect.left + trigRect.width/2) - shellRect.left - fileSize.w/2;
    const startY = (trigRect.top + trigRect.height/2) - shellRect.top - fileSize.h/2;
    const endX = (compRect.left + compRect.width/2) - shellRect.left - fileSize.w/2;
    const endY = (compRect.top + compRect.height/2) - shellRect.top - fileSize.h/2;

    const file = document.createElement('div');
    file.className = 'pm-file-particle';
    file.style.left = startX + 'px';
    file.style.top = startY + 'px';
    shell.appendChild(file);

    // Kick off animation on next frame
    requestAnimationFrame(() => {
      file.style.transition = 'transform 900ms cubic-bezier(0.45, 0, 0.55, 1), opacity 900ms ease';
      file.style.transform = `translate(${endX - startX}px, ${endY - startY}px) scale(0.3) rotate(360deg)`;
      // Fade out in the last 200ms
      setTimeout(() => { file.style.opacity = '0.2' }, 700);
    });

    // Update computer screen text + receiving state
    const screenText = computer.querySelector('.pm-screen-text');
    const originalText = screenText ? screenText.textContent : '';
    computer.classList.add('is-receiving');
    if (screenText) screenText.textContent = filename || 'portal.xlsx';

    setTimeout(() => { file.remove(); }, 1000);
    setTimeout(() => {
      computer.classList.remove('is-receiving');
      if (screenText) screenText.textContent = 'idle';
    }, 2600);
  }

  shell.querySelectorAll('[data-export]').forEach(el => {
    el.style.cursor = 'pointer';
    el.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      triggerExport(el, el.dataset.export);
    });
  });

  // ——— Dr. Romero account popover ———
  const userTrigger = shell.querySelector('#pm-user-trigger');
  const accountCard = shell.querySelector('#pm-account-card');
  const accountClose = shell.querySelector('#pm-account-close');
  if (userTrigger && accountCard){
    userTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      accountCard.classList.toggle('is-open');
    });
    if (accountClose){
      accountClose.addEventListener('click', (e) => {
        e.stopPropagation();
        accountCard.classList.remove('is-open');
      });
    }
    // Click anywhere else closes it
    document.addEventListener('click', (e) => {
      if (accountCard.classList.contains('is-open') &&
          !accountCard.contains(e.target) &&
          !userTrigger.contains(e.target)){
        accountCard.classList.remove('is-open');
      }
    });
  }
})();

// ═══════════════════════════════════════════════════════════════
// Card spotlight — hover glow follows the cursor (desktop only;
// touch and no-JS fall back to the static top-right hotspot)
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// Hero constellation — ambient gold particle field, home hero only.
// Starts after window load (protects LCP), pauses offscreen/hidden,
// reacts gently to the pointer. Skipped for reduced-motion users.
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// Command palette (⌘K / Ctrl+K / "/") — instant site-wide jump.
// HCPCS-code aware: typing "G0465" or "97610" goes straight to the
// right product page. Pure progressive enhancement.
// ═══════════════════════════════════════════════════════════════
(function initCommandPalette(){
  const INDEX = [
    { t: 'Clinical evidence library', s: 'Page', p: '/evidence/', k: 'evidence studies trials clinical literature IFU' },
    { t: 'Practice services', s: 'Page', p: '/services/', k: 'practice services operations' },
    { t: 'Wound imaging software', s: 'Page', p: '/software/', k: 'software stratametric imaging' },
    { t: 'Ovena Health', s: 'Page', p: '/amazon-store/', k: 'ovena patient supplies store' },
    { t: 'Home', s: 'Page', p: '/', k: 'home overview albacete' },
    { t: 'Palisade Dual-Membrane', s: 'Product', p: '/products/palisade/', k: 'palisade sheet membrane' },
    { t: 'Sentry SL', s: 'Product', p: '/products/sentry-sl/', k: 'sentry sheet membrane' },
    { t: 'APIS', s: 'Product', p: '/products/apis/', k: 'apis collagen manuka' },
    { t: 'Interfyl', s: 'Product', p: '/products/interfyl/', k: 'interfyl flowable particulate' },
    { t: 'XCelliStem', s: 'Product', p: '/products/xcellistem/', k: 'xcellistem ECM powder A2004' },
    { t: 'Peptide catalog', s: 'Product', p: '/products/peptides/', k: 'peptides compounded catalog' },
    { t: 'Products & Solutions', s: 'Page', p: '/products/', k: 'products portfolio solutions catalog' },
    { t: 'ActiGraft+ — Whole Blood Clot', s: 'Product', p: '/products/actigraft/', k: 'actigraft autologous blood clot G0465 G0460 NCD 270.3 diabetic foot ulcer DFU legacy point-of-care' },
    { t: 'UltraMist — Ultrasound Therapy', s: 'Product', p: '/products/ultramist/', k: 'ultramist ultrasound 97610 sanuwave saline mist NLFU non-contact painless' },
    { t: 'Arobella Qoustic', s: 'Product', p: '/products/arobella/', k: 'arobella qoustic ultrasonic debridement' },
    { t: 'Exosomes & Birth Tissue', s: 'Product', p: '/products/exosomes/', k: "exosomes wharton's jelly birth tissue placental MSC regenerative biologics" },
    { t: 'Adhesion Barrier — Amniotic Membrane', s: 'Product', p: '/products/adhesion-barrier/', k: 'adhesion barrier C1762 amniotic membrane laparoscopic robotic trocar da vinci chorion-free' },
    { t: 'BioLab Sciences Biologics', s: 'Product', p: '/products/advanced-biologics/', k: 'microlyte SAM A2005 tri-membrane membrane wrap lyte biolab silver antimicrobial 510k' },
    { t: 'MicroDoc — Disposable NPWT', s: 'Product', p: '/products/microdoc/', k: 'microdoc NPWT negative pressure disposable single-use home health' },
    { t: 'Medical Supplies Wholesaler', s: 'Product', p: '/products/wholesaler/', k: 'wholesale supplies foam alginate compression surgical prep catalog hospital' },
    { t: 'Scientific Portfolio', s: 'Page', p: '/scientific-portfolio/', k: 'science evidence MMP biofilm cascade studies clinical data mechanism' },
    { t: 'Revenue Cycle Management', s: 'Service', p: '/services/revenue-cycle/', k: 'revenue cycle RCM acuitymd denials leakage billing recovery' },
    { t: 'Consultative Services', s: 'Service', p: '/services/consulting/', k: 'consulting advisory coding formulary operations market access' },
    { t: 'Provider Portal', s: 'Service', p: '/portal/', k: 'portal ordering tracking documentation reporting login claims' },
    { t: 'Why Partner', s: 'Page', p: '/why-partner/', k: 'why partner partnership support training escalation' },
    { t: 'About Albacete MedDev', s: 'Page', p: '/about/', k: 'about team company process discover align implement optimize' },
    { t: 'Schedule a Consultation', s: 'Action', p: '/contact/', k: 'contact schedule consultation demo talk meet form' },
    { t: 'Call 551-497-3428', s: 'Action', p: 'tel:5514973428', k: 'call phone number' },
    { t: 'Email gabe@albacetemeddev.com', s: 'Action', p: 'mailto:gabe@albacetemeddev.com', k: 'email mail message' }
  ];

  // ── Inject nav button ──
  const navInner = document.querySelector('.nav-inner');
  const navToggle = document.querySelector('.nav-toggle');
  if (navInner && navToggle){
    const btn = document.createElement('button');
    btn.className = 'nav-search';
    btn.setAttribute('aria-label', 'Search the site (Cmd+K)');
    btn.innerHTML = '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/></svg><span class="ns-label">Search</span><kbd>&#8984;K</kbd>';
    navInner.insertBefore(btn, navToggle);
    btn.addEventListener('click', open);
  }

  // ── Inject dialog ──
  const root = document.createElement('div');
  root.className = 'cmdk';
  root.hidden = true;
  root.innerHTML =
    '<div class="cmdk-panel" role="dialog" aria-modal="true" aria-label="Site search">' +
      '<div class="cmdk-input-row">' +
        '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.5" y2="16.5"/></svg>' +
        '<input type="text" placeholder="Search pages, products, HCPCS codes&hellip;" aria-label="Search" autocomplete="off" spellcheck="false">' +
        '<kbd>esc</kbd>' +
        '<button class="cmdk-close" aria-label="Close search">&#10005;</button>' +
      '</div>' +
      '<div class="cmdk-list" role="listbox"></div>' +
      '<div class="cmdk-foot"><span><b>&uarr;&darr;</b> navigate</span><span><b>&crarr;</b> open</span><span><b>esc</b> close</span></div>' +
    '</div>';
  document.body.appendChild(root);
  const input = root.querySelector('input');
  const list = root.querySelector('.cmdk-list');
  let results = [], active = 0;

  function score(item, q){
    const t = item.t.toLowerCase(), k = item.k.toLowerCase();
    let s = 0;
    for (const w of q.split(/\s+/)){
      if (!w) continue;
      if (t.startsWith(w)) s += 5;
      else if (t.includes(w)) s += 3;
      if (k.split(/\s+/).some(kw => kw.startsWith(w))) s += 3;
      else if (k.includes(w)) s += 1;
      if (s === 0) return 0;   // every word must match somewhere
    }
    return s;
  }
  function render(){
    const q = input.value.trim().toLowerCase();
    results = !q
      ? INDEX.slice(0, 8)
      : INDEX.map(i => [score(i, q), i]).filter(x => x[0] > 0)
             .sort((a, b) => b[0] - a[0]).map(x => x[1]).slice(0, 9);
    active = 0;
    list.innerHTML = results.length
      ? results.map((r, i) =>
          '<div class="cmdk-item' + (i === 0 ? ' is-active' : '') + '" role="option" data-i="' + i + '">' +
            '<span class="ci-title">' + r.t + '</span><span class="ci-section">' + r.s + '</span>' +
          '</div>').join('')
      : '<div class="cmdk-empty">No matches &mdash; try a product name or HCPCS code</div>';
  }
  function highlight(){
    list.querySelectorAll('.cmdk-item').forEach((el, i) => el.classList.toggle('is-active', i === active));
    const el = list.querySelector('.cmdk-item.is-active');
    if (el) el.scrollIntoView({ block: 'nearest' });
  }
  function go(i){
    const r = results[i];
    if (!r) return;
    close();
    const destination = new URL(r.p, window.location.href);
    if (destination.href === window.location.href && destination.hash) {
      window.dispatchEvent(new Event('albacete:reveal-product'));
    } else {
      window.location.href = r.p;
    }
  }
  function open(){
    root.hidden = false;
    document.body.style.overflow = 'hidden';
    input.value = '';
    render();
    input.focus();
  }
  function close(){
    root.hidden = true;
    document.body.style.overflow = '';
  }

  document.addEventListener('keydown', (e) => {
    if (document.querySelector('dialog[open]')) return;
    const tag = (document.activeElement || {}).tagName;
    const typing = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT';
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k'){
      e.preventDefault();
      root.hidden ? open() : close();
    } else if (e.key === '/' && root.hidden && !typing){
      e.preventDefault();
      open();
    } else if (!root.hidden){
      if (e.key === 'Escape'){ e.preventDefault(); close(); }
      else if (e.key === 'ArrowDown'){ e.preventDefault(); active = Math.min(active + 1, results.length - 1); highlight(); }
      else if (e.key === 'ArrowUp'){ e.preventDefault(); active = Math.max(active - 1, 0); highlight(); }
      else if (e.key === 'Enter'){ e.preventDefault(); go(active); }
    }
  });
  input.addEventListener('input', render);
  root.querySelector('.cmdk-close').addEventListener('click', close);
  list.addEventListener('click', (e) => {
    const item = e.target.closest('.cmdk-item');
    if (item) go(parseInt(item.dataset.i, 10));
  });
  list.addEventListener('pointermove', (e) => {
    const item = e.target.closest('.cmdk-item');
    if (item){ active = parseInt(item.dataset.i, 10); highlight(); }
  });
  root.addEventListener('click', (e) => { if (e.target === root) close(); });
})();


// ═══════════════════════════════════════════════════════════════
// Touch spotlight — on devices with no hover, the card glow follows
// the scroll instead of the cursor: cards light up as they cross the
// center band of the viewport.
// ═══════════════════════════════════════════════════════════════


// ═══════════════════════════════════════════════════════════════
// Mega menu v2 — hover-intent controller
// Opens on hover with a short intent delay, forgives the travel to
// the panel with a grace period, click-toggles on touch, closes on
// Escape/outside click, and drives the category rail + feature pane.
// ═══════════════════════════════════════════════════════════════
(function initMegaMenu(){
  const drops = document.querySelectorAll('.nav-dropdown');
  if (!drops.length) return;
  const OPEN_DELAY = 70, CLOSE_DELAY = 280;

  function controller(li){
    const trigger = li.querySelector('.dropdown-trigger');
    let openT = null, closeT = null;
    const open = () => {
      clearTimeout(closeT);
      drops.forEach(d => {
        if (d === li) return;
        d.classList.remove('is-open');
        d.querySelector('.dropdown-trigger')?.setAttribute('aria-expanded', 'false');
      });
      li.classList.remove('is-dismissed');
      li.classList.add('is-open');
      if (trigger) trigger.setAttribute('aria-expanded', 'true');
    };
    const close = () => {
      clearTimeout(openT);
      li.classList.remove('is-open');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    };
    li.addEventListener('pointerenter', (e) => {
      if (e.pointerType === 'touch') return;
      clearTimeout(closeT);
      openT = setTimeout(open, OPEN_DELAY);
    });
    li.addEventListener('pointerleave', (e) => {
      if (e.pointerType === 'touch') return;
      clearTimeout(openT);
      closeT = setTimeout(close, CLOSE_DELAY);
    });
    if (trigger) trigger.addEventListener('click', (e) => {
      // touch / pen: first tap opens, second follows the link
      if (matchMedia('(hover: none)').matches && !li.classList.contains('is-open')){
        e.preventDefault();
        open();
      }
    });
    li.addEventListener('focusin', () => {
      if (!matchMedia('(hover: none)').matches && !li.classList.contains('is-dismissed')) open();
    });
    li.addEventListener('focusout', (e) => {
      if (!li.contains(e.relatedTarget)) {
        close();
        li.classList.remove('is-dismissed');
      }
    });
    if (trigger) trigger.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowDown' && e.key !== 'ArrowRight') return;
      const target = li.querySelector('.mega2-cat.is-active');
      if (!target) return;
      e.preventDefault();
      open();
      target.focus();
    });
    return { li, close };
  }

  const instances = [...drops].map(controller);
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-dropdown')) instances.forEach(i => i.close());
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape'){
      const openLi = document.activeElement.closest('.nav-dropdown') || document.querySelector('.nav-dropdown.is-open');
      if (openLi){
        instances.forEach(i => i.close());
        openLi.classList.add('is-dismissed');
        const t = openLi.querySelector('.dropdown-trigger');
        if (t) t.focus();
      }
    }
  });

  // Category rail + feature pane
  const mega = document.querySelector('.mega2');
  if (!mega) return;
  const cats = mega.querySelectorAll('.mega2-cat');
  const lists = mega.querySelectorAll('.mega2-list');
  const img = mega.querySelector('.mega2-img');
  const blurb = mega.querySelector('.mega2-blurb');
  const cap = mega.querySelector('.mega2-cap');

  function setFeature(url, text, title){
    if (url){
      img.style.backgroundImage = 'url(' + url + ')';
      img.classList.add('has-img');
      img.classList.toggle('is-vector', /\.svg(\?|$)/i.test(url));
    } else {
      img.classList.remove('has-img');
    }
    if (text) blurb.textContent = text;
    if (title) cap.textContent = title;
  }

  function activate(cat){
    cats.forEach(c => {
      const selected = c === cat;
      c.classList.toggle('is-active', selected);
      c.setAttribute('aria-selected', String(selected));
      c.tabIndex = selected ? 0 : -1;
    });
    lists.forEach(l => l.classList.toggle('is-active', l.dataset.cat === cat.dataset.cat));
    setFeature(cat.dataset.img || null, cat.dataset.desc, cat.textContent.replace(/\d+$/, '').trim());
  }

  cats.forEach(cat => {
    cat.addEventListener('pointerenter', () => activate(cat));
    cat.addEventListener('focus', () => activate(cat));
    cat.addEventListener('click', () => activate(cat));
    cat.addEventListener('keydown', (e) => {
      const rail = [...cats];
      const i = rail.indexOf(cat);
      let next;
      if (e.key === 'ArrowDown') next = rail[(i + 1) % rail.length];
      if (e.key === 'ArrowUp') next = rail[(i - 1 + rail.length) % rail.length];
      if (e.key === 'Home') next = rail[0];
      if (e.key === 'End') next = rail[rail.length - 1];
      if (e.key === 'ArrowRight') next = [...lists].find(l => l.dataset.cat === cat.dataset.cat)?.querySelector('a');
      if (next) { e.preventDefault(); next.focus(); }
    });
  });

  mega.querySelector('.mega2-rail')?.setAttribute('aria-orientation', 'vertical');
  cats.forEach(cat => {
    cat.id = 'product-category-' + cat.dataset.cat;
    cat.setAttribute('aria-controls', 'product-list-' + cat.dataset.cat);
  });
  lists.forEach(list => {
    list.id = 'product-list-' + list.dataset.cat;
    list.setAttribute('role', 'tabpanel');
    list.setAttribute('aria-labelledby', 'product-category-' + list.dataset.cat);
  });
  activate(mega.querySelector('.mega2-cat.is-active') || cats[0]);

  mega.querySelectorAll('.mega2-item').forEach(item => {
    const preview = () => {
      // A name-only entry must not inherit another product's photograph.
      setFeature(item.dataset.img || null,
        item.querySelector('.mega2-desc')?.textContent,
        item.querySelector('.mega2-name')?.textContent);
    };
    item.addEventListener('pointerenter', preview);
    item.addEventListener('focus', preview);
    item.addEventListener('keydown', (e) => {
      if (e.key !== 'ArrowLeft') return;
      e.preventDefault();
      mega.querySelector('.mega2-cat.is-active')?.focus();
    });
  });
})();
