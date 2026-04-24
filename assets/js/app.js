// ═══════════════════════════════════════════════════════════════
// Albacete MedDev — Redesign JS
// Splash + scroll reveals + nav + FAQ
// + Woah moments: counters, live dashboard, view transitions,
//   magnetic CTAs, hero text scramble
// ═══════════════════════════════════════════════════════════════

// Detect reduced-motion once; use to short-circuit showy animations
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(hover: none)').matches;

// Splash loader — fires on every page load (including in-session nav)
(function initSplash(){
  function runSplash(){
    // Reset to is-loading state in case the page was restored from bfcache
    document.body.classList.remove('is-loaded');
    document.body.classList.add('is-loading');
    // Reflow + restart the splash CSS animation
    const splash = document.querySelector('.splash');
    if (splash){
      const mark = splash.querySelector('.splash-mark');
      splash.style.animation = 'none';
      if (mark) mark.style.animation = 'none';
      void splash.offsetHeight;  // force reflow
      splash.style.animation = '';
      if (mark) mark.style.animation = '';
    }
    setTimeout(() => {
      document.body.classList.remove('is-loading');
      document.body.classList.add('is-loaded');
    }, 1600);
  }

  // First page load
  runSplash();

  // Re-run splash when navigating back/forward (bfcache restore)
  window.addEventListener('pageshow', (e) => {
    if (e.persisted) runSplash();
  });
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
// WOAH MOMENT #1 — Animated number counters
// ═══════════════════════════════════════════════════════════════
(function initCounters(){
  if (prefersReducedMotion) return;

  const easeOutQuart = t => 1 - Math.pow(1 - t, 4);

  // Parse a stat value like "20+", "100%", "$596K", "360°", "$2.98M", "173%", "55-93%"
  // Returns { prefix, target, suffix } or null if not numeric
  // Skips things like "1:1", "24 / 7", "Real-time", "Role-based", "In-house"
  function parseStat(text){
    const trimmed = text.trim();
    // Reject text-only values up-front
    if (!/\d/.test(trimmed)) return null;
    // Reject ratios with colons or forward slashes separating numbers
    if (/\d\s*[:/]\s*\d/.test(trimmed)) return null;

    // Handle ranges like "55-93%" — show dash+target prefix, animate upper
    const rangeMatch = trimmed.match(/^([^\d]*)([\d,.]+)\s*[–-]\s*([\d,.]+)(.*)$/);
    if (rangeMatch) {
      const target = parseFloat(rangeMatch[3].replace(/,/g, ''));
      if (isNaN(target)) return null;
      return {
        prefix: rangeMatch[1] + rangeMatch[2] + '–',
        target,
        suffix: rangeMatch[4],
        decimals: (rangeMatch[3].split('.')[1] || '').length
      };
    }
    // Standard: optional $, number, optional suffix
    const m = trimmed.match(/^(\$?)([\d,.]+)(.*)$/);
    if (!m) return null;
    const target = parseFloat(m[2].replace(/,/g, ''));
    if (isNaN(target)) return null;
    return {
      prefix: m[1],
      target,
      suffix: m[3],
      decimals: (m[2].split('.')[1] || '').length
    };
  }

  function formatValue(current, decimals){
    if (decimals > 0) return current.toFixed(decimals);
    return Math.round(current).toLocaleString();
  }

  function animate(el, parsed, duration = 1200){
    const start = performance.now();
    function step(now){
      const t = Math.min(1, (now - start) / duration);
      const eased = easeOutQuart(t);
      const val = parsed.target * eased;
      el.textContent = parsed.prefix + formatValue(val, parsed.decimals) + parsed.suffix;
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Targets: every numeric .value/.stat-value inside stats containers, plus product-card h3 that looks numeric
  const selectors = [
    '.stats-grid .value',
    '.stats-grid .stat-value',
    '.lg-hero-stats .value',
    '.wp-hero-stats .value',
    '.cs-hero-stats .value',
    '.pm-hero-stats .value',
    '.rcm-hero-stats .value',
    '.stat .value',            // catch-all in stat containers
    '.product-card h3',         // numeric product card titles (e.g. 173%, 55–93%, 3–5 added minutes)
    '.pm-kpi .value'
  ];
  const targets = document.querySelectorAll(selectors.join(','));

  targets.forEach(el => {
    // Skip if already has a non-numeric value (preserves "In-house", "Role-based" etc)
    // We look at the text content without child spans first
    const rawText = el.textContent;
    const parsed = parseStat(rawText);
    if (!parsed) return;
    // Store original HTML for restoration if needed; replace with initial zero state
    el.dataset.counterOriginal = el.innerHTML;
    el.textContent = parsed.prefix + '0' + parsed.suffix;
    el.dataset.counterReady = '1';
  });

  if (!('IntersectionObserver' in window)){
    // Fallback: set final values immediately
    targets.forEach(el => {
      if (el.dataset.counterReady === '1' && el.dataset.counterOriginal){
        el.innerHTML = el.dataset.counterOriginal;
      }
    });
    return;
  }

  function startObserving(){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const original = el.dataset.counterOriginal;
        if (!original) return;
        const parsed = parseStat(original.replace(/<[^>]+>/g, ''));
        if (!parsed){
          el.innerHTML = original;
          io.unobserve(el);
          return;
        }
        animate(el, parsed, 1200);
        setTimeout(() => { el.innerHTML = original; }, 1300);
        io.unobserve(el);
      });
    }, {
      // Require 60% visible AND 100px up from bottom — so counters only
      // fire when user actually sees them, not while hidden by the splash
      threshold: 0.6,
      rootMargin: '0px 0px -100px 0px'
    });

    targets.forEach(el => {
      if (el.dataset.counterReady === '1') io.observe(el);
    });
  }

  // Wait until after the splash (1600ms) + hero reveal animation (~2060ms for
  // the stats row at reveal-delay 4) have played, then start observing.
  // Using a fixed delay is more reliable than polling for class changes.
  setTimeout(startObserving, 2200);
})();


// ═══════════════════════════════════════════════════════════════
// WOAH MOMENT #2 — Portal dashboard live pulse
// ═══════════════════════════════════════════════════════════════
(function initLiveDashboard(){
  const shell = document.querySelector('.pm-shell');
  if (!shell || prefersReducedMotion) return;

  // ——— Live pulse on the green dot (CSS handles the glow; JS triggers on mount) ———
  const liveDots = shell.querySelectorAll('.dot-live');
  liveDots.forEach(d => d.classList.add('is-pulsing'));

  // ——— Sparklines draw in ———
  const sparks = shell.querySelectorAll('.pm-kpi .spark polyline');
  sparks.forEach(p => {
    const len = p.getTotalLength ? p.getTotalLength() : 200;
    p.style.strokeDasharray = len;
    p.style.strokeDashoffset = len;
    p.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(0.19, 1, 0.22, 1)';
  });

  // ——— Bar chart bars animate from 0 ———
  const bars = shell.querySelectorAll('.pm-bar');
  bars.forEach((bar, i) => {
    const finalHeight = bar.style.height;
    bar.style.height = '0%';
    bar.style.transition = 'height 0.9s cubic-bezier(0.19, 1, 0.22, 1)';
    bar.dataset.finalHeight = finalHeight;
  });

  // ——— KPI counters for the dashboard (handled by counter observer above) ———

  // ——— Trigger animations when shell is in view ———
  if (!('IntersectionObserver' in window)) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      // Sparklines
      sparks.forEach((p, i) => {
        setTimeout(() => { p.style.strokeDashoffset = '0'; }, 300 + i * 120);
      });
      // Bars
      bars.forEach((bar, i) => {
        setTimeout(() => { bar.style.height = bar.dataset.finalHeight; }, 600 + i * 70);
      });
      io.unobserve(shell);
      // Kick off live ticks after entrance animation settles
      setTimeout(startLiveTicks, 2400);
    });
  }, { threshold: 0.2 });
  io.observe(shell);

  // ——— Periodic "live data" updates ———
  function startLiveTicks(){
    const tbody = shell.querySelector('.pm-card:first-of-type');
    const kpiActive = shell.querySelector('.pm-kpi:nth-child(1) .value');
    const kpiOrders = shell.querySelector('.pm-kpi:nth-child(2) .value');

    // Pool of fake orders to cycle in
    const pool = [
      { pid: '#1314', product: 'Collagen 4×6', patient: 'A. Brooks', status: 'sent', label: 'Approved' },
      { pid: '#1319', product: 'Exosome Gel', patient: 'S. Park',   status: 'ok',   label: 'Shipped' },
      { pid: '#1324', product: 'ActiGraft+',  patient: 'D. Cohen',  status: 'rev',  label: 'In review' },
      { pid: '#1330', product: 'UltraMist',   patient: 'N. Flores', status: 'ok',   label: 'Delivered' },
      { pid: '#1336', product: 'Tri-Membrane', patient: 'L. Nakamura', status: 'paid', label: 'Paid' },
      { pid: '#1341', product: 'MicroDoc',    patient: 'G. Singh',  status: 'sent', label: 'Approved' },
    ];
    let poolIndex = 0;
    let activeCount = 84;
    let ordersCount = 27;

    function addRow(){
      if (!tbody) return;
      const o = pool[poolIndex % pool.length];
      poolIndex++;

      const row = document.createElement('div');
      row.className = 'pm-row';
      row.innerHTML = `
        <div class="patient"><span class="pid">${o.pid}</span>${o.product} · ${o.patient.replace(' ', '&nbsp;')}</div>
        <span class="date">Now</span>
        <span class="status ${o.status}">${o.label}</span>
      `;
      row.style.maxHeight = '0px';
      row.style.opacity = '0';
      row.style.overflow = 'hidden';
      row.style.transition = 'max-height 0.5s cubic-bezier(0.19, 1, 0.22, 1), opacity 0.5s ease';

      // Insert AFTER the header element inside the card
      const header = tbody.querySelector('header');
      if (header && header.nextSibling){
        tbody.insertBefore(row, header.nextSibling);
      } else {
        tbody.appendChild(row);
      }

      // Expand
      requestAnimationFrame(() => {
        row.style.maxHeight = '60px';
        row.style.opacity = '1';
      });

      // Limit table length — remove the last row
      const allRows = tbody.querySelectorAll('.pm-row');
      if (allRows.length > 5){
        const last = allRows[allRows.length - 1];
        last.style.maxHeight = '0px';
        last.style.opacity = '0';
        setTimeout(() => last.remove(), 500);
      }

      // Tick up counters
      activeCount++;
      ordersCount++;
      if (kpiActive) kpiActive.textContent = activeCount;
      if (kpiOrders) kpiOrders.textContent = ordersCount;
    }

    // First tick after 3s, then every 7s
    setTimeout(addRow, 3000);
    setInterval(addRow, 7000);
  }
})();


// ═══════════════════════════════════════════════════════════════
// WOAH MOMENT #3 — Magnetic primary CTAs
// ═══════════════════════════════════════════════════════════════
(function initMagneticButtons(){
  if (prefersReducedMotion || isTouch) return;

  const PULL_RADIUS = 80;      // px — outer influence radius
  const STRENGTH = 0.35;        // 0..1 — how much the btn moves toward cursor
  const buttons = document.querySelectorAll('.btn-primary, .nav-cta, .hero-actions .btn');

  buttons.forEach(btn => {
    let rafId = null;
    let targetX = 0, targetY = 0;
    let currentX = 0, currentY = 0;

    function onMouseMove(e){
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < PULL_RADIUS){
        // Pull toward cursor
        const factor = (1 - dist / PULL_RADIUS) * STRENGTH;
        targetX = dx * factor;
        targetY = dy * factor;
        if (!rafId) rafId = requestAnimationFrame(loop);
      } else if (currentX !== 0 || currentY !== 0) {
        // Spring back
        targetX = 0;
        targetY = 0;
        if (!rafId) rafId = requestAnimationFrame(loop);
      }
    }

    function onMouseLeave(){
      targetX = 0;
      targetY = 0;
      if (!rafId) rafId = requestAnimationFrame(loop);
    }

    function loop(){
      currentX += (targetX - currentX) * 0.18;
      currentY += (targetY - currentY) * 0.18;
      if (Math.abs(currentX) < 0.1 && Math.abs(currentY) < 0.1 && targetX === 0 && targetY === 0){
        currentX = 0;
        currentY = 0;
        btn.style.transform = '';
        rafId = null;
        return;
      }
      btn.style.transform = `translate(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px)`;
      rafId = requestAnimationFrame(loop);
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    btn.addEventListener('mouseleave', onMouseLeave);
  });
})();


// ═══════════════════════════════════════════════════════════════
// WOAH MOMENT #4 — Interactive Portal ("Try Me")
// ═══════════════════════════════════════════════════════════════
// Turn the dashboard mock into a click-around demo. Sidebar nav items
// swap the main content between 5 distinct views. A pulsing "Try me"
// chip invites the first click and disappears after interaction.
(function initInteractivePortal(){
  const shell = document.querySelector('.pm-shell');
  if (!shell) return;
  const navItems = shell.querySelectorAll('.pm-nav-item[data-view]');
  const views = shell.querySelectorAll('.pm-view[data-view]');
  const urlBar = shell.querySelector('.pm-url');
  const chip = shell.querySelector('.pm-tryme');
  if (navItems.length === 0 || views.length === 0) return;

  function switchView(viewName, itemEl){
    // Update active nav
    navItems.forEach(i => i.classList.remove('active'));
    if (itemEl) itemEl.classList.add('active');
    // Swap view panels
    views.forEach(v => v.classList.remove('is-active'));
    const target = shell.querySelector(`.pm-view[data-view="${viewName}"]`);
    if (target){
      target.classList.add('is-active');
    } else {
      // Fallback: default dashboard
      const dash = shell.querySelector('.pm-view[data-view="dashboard"]');
      if (dash) dash.classList.add('is-active');
    }
    // Update URL bar
    if (urlBar) urlBar.textContent = `portal.albacetemeddev.com / ${viewName.replace(/-/g, '-')}`;
    // Hide try-me chip once user interacts
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
})();
