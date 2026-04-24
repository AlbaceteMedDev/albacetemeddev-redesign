// ═══════════════════════════════════════════════════════════════
// Albacete MedDev — Redesign JS
// Splash loader + Scroll reveals + Mobile menu
// ═══════════════════════════════════════════════════════════════

// Splash loader — switch body state after splash exits (matches CSS timing)
(function initSplash(){
  // After splash-out animation completes (starts 1400ms, duration 500ms = 1900ms total)
  setTimeout(() => {
    document.body.classList.remove('is-loading');
    document.body.classList.add('is-loaded');
  }, 1600);
})();

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
    // Exact match OR current path starts with href (for section roots like /products)
    if (current === hrefPath || (hrefPath !== '/' && current.startsWith(hrefPath + '/'))){
      // Prefer the longest matching href so /products/collagen matches /products, but /products/collagen also wins if a specific link exists
      if (hrefPath.length > bestLen){
        bestMatch = link;
        bestLen = hrefPath.length;
      }
    }
  });
  // Clear existing actives then apply
  if (bestMatch){
    // Find matching desktop + mobile versions (same href)
    const activeHref = bestMatch.getAttribute('href');
    const activePath = activeHref.replace(/\/+$/, '') || '/';
    links.forEach(l => {
      const p = (l.getAttribute('href') || '').replace(/\/+$/, '') || '/';
      if (p === activePath) l.classList.add('is-active');
    });
  }
})();

// Scroll-triggered reveal for .scroll-reveal elements
(function initScrollReveal(){
  const els = document.querySelectorAll('.scroll-reveal');
  if (!('IntersectionObserver' in window) || els.length === 0){
    els.forEach(el => el.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        // stagger children within the same observer entry
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
  }

  toggle.addEventListener('click', () => {
    setOpen(!menu.classList.contains('is-open'));
  });

  // Close when a link is tapped
  menu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => setOpen(false));
  });

  // Close on Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) setOpen(false);
  });
})();

// Subtle nav background intensifies on scroll
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

// FAQ accordion — click to expand
(function initFAQ(){
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      if (!item) return;
      const isOpen = item.classList.contains('is-open');
      // close siblings in same faq group
      const parent = item.parentElement;
      if (parent) parent.querySelectorAll('.faq-item.is-open').forEach(i => i.classList.remove('is-open'));
      if (!isOpen) item.classList.add('is-open');
    });
  });
})();
