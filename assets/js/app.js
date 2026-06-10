// ═══════════════════════════════════════════════════════════════
// Albacete MedDev — Redesign JS
// Splash + scroll reveals + nav + FAQ
// + Woah moments: counters, live dashboard, view transitions,
//   magnetic CTAs, hero text scramble
// ═══════════════════════════════════════════════════════════════

// Detect reduced-motion once; use to short-circuit showy animations
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(hover: none)').matches;

// Splash loader — full splash on the session's first view, instant after.
// An inline <head> guard sets html.no-splash pre-paint for returning views;
// this block keeps body classes + sessionStorage in sync.
(function initSplash(){
  function splashSeen(){
    try{ return !!sessionStorage.getItem('amd-splash'); }catch(e){ return false; }
  }
  function markSeen(){
    try{ sessionStorage.setItem('amd-splash', '1'); }catch(e){}
  }
  function skipSplash(){
    document.documentElement.classList.add('no-splash');
    document.body.classList.remove('is-loading');
    document.body.classList.add('is-loaded');
  }
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
      markSeen();
    }, 1100);
  }

  // First page load
  if (splashSeen()) skipSplash();
  else runSplash();

  // Back/forward (bfcache restore): never replay the splash mid-session
  window.addEventListener('pageshow', (e) => {
    if (e.persisted){
      if (splashSeen()) skipSplash();
      else runSplash();
    }
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
(function initCardSpotlight(){
  if (isTouch) return;
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('pointermove', (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', ((e.clientX - r.left) / r.width * 100).toFixed(2) + '%');
      card.style.setProperty('--my', ((e.clientY - r.top) / r.height * 100).toFixed(2) + '%');
    }, { passive: true });
  });
})();

// ═══════════════════════════════════════════════════════════════
// Hero constellation — ambient gold particle field, home hero only.
// Starts after window load (protects LCP), pauses offscreen/hidden,
// reacts gently to the pointer. Skipped for reduced-motion users.
// ═══════════════════════════════════════════════════════════════
(function initHeroParticles(){
  if (prefersReducedMotion) return;
  const hero = document.querySelector('main > .hero:not(.hero-compact):not(.hero-split-layout)');
  if (!hero || !hero.querySelector('.aurora')) return;

  window.addEventListener('load', () => setTimeout(start, 700), { once: true });

  function start(){
    const canvas = document.createElement('canvas');
    canvas.className = 'hero-particles';
    canvas.setAttribute('aria-hidden', 'true');
    hero.appendChild(canvas);
    const ctx = canvas.getContext('2d');
    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0, parts = [], running = false, raf = 0;
    const mouse = { x: -9999, y: -9999 };
    const COUNT = window.innerWidth < 700 ? 30 : 64;
    const LINK = window.innerWidth < 700 ? 95 : 125;

    function resize(){
      W = hero.clientWidth; H = hero.clientHeight;
      canvas.width = W * DPR; canvas.height = H * DPR;
      canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    function seed(){
      parts = Array.from({ length: COUNT }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.22,
        vy: (Math.random() - 0.5) * 0.22,
        r: 0.8 + Math.random() * 1.5
      }));
    }
    function frame(){
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      for (const p of parts){
        // Gentle pointer attraction within 160px
        const dxm = mouse.x - p.x, dym = mouse.y - p.y;
        const dm2 = dxm * dxm + dym * dym;
        if (dm2 < 25600 && dm2 > 1){
          const f = 0.012 / Math.sqrt(dm2);
          p.vx += dxm * f; p.vy += dym * f;
        }
        // Speed cap + drift
        p.vx = Math.max(-0.5, Math.min(0.5, p.vx));
        p.vy = Math.max(-0.5, Math.min(0.5, p.vy));
        p.x += p.vx; p.y += p.vy;
        if (p.x < -10) p.x = W + 10; else if (p.x > W + 10) p.x = -10;
        if (p.y < -10) p.y = H + 10; else if (p.y > H + 10) p.y = -10;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 6.2832);
        ctx.fillStyle = 'rgba(212,169,74,0.35)';
        ctx.fill();
      }
      // Constellation links
      for (let i = 0; i < parts.length; i++){
        for (let j = i + 1; j < parts.length; j++){
          const dx = parts[i].x - parts[j].x, dy = parts[i].y - parts[j].y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK * LINK){
            const a = (1 - Math.sqrt(d2) / LINK) * 0.14;
            ctx.strokeStyle = 'rgba(212,169,74,' + a.toFixed(3) + ')';
            ctx.lineWidth = 0.7;
            ctx.beginPath();
            ctx.moveTo(parts[i].x, parts[i].y);
            ctx.lineTo(parts[j].x, parts[j].y);
            ctx.stroke();
          }
        }
      }
      raf = requestAnimationFrame(frame);
    }
    function play(){ if (!running){ running = true; raf = requestAnimationFrame(frame); } }
    function pause(){ running = false; cancelAnimationFrame(raf); }

    resize(); seed();
    canvas.classList.add('is-live');
    play();

    hero.addEventListener('pointermove', (e) => {
      const r = canvas.getBoundingClientRect();
      mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top;
    }, { passive: true });
    hero.addEventListener('pointerleave', () => { mouse.x = -9999; mouse.y = -9999; }, { passive: true });
    window.addEventListener('resize', () => { resize(); seed(); }, { passive: true });
    document.addEventListener('visibilitychange', () => document.hidden ? pause() : play());
    new IntersectionObserver((es) => es.forEach(e => e.isIntersecting ? play() : pause()))
      .observe(hero);
  }
})();

// ═══════════════════════════════════════════════════════════════
// Command palette (⌘K / Ctrl+K / "/") — instant site-wide jump.
// HCPCS-code aware: typing "G0465" or "97610" goes straight to the
// right product page. Pure progressive enhancement.
// ═══════════════════════════════════════════════════════════════
(function initCommandPalette(){
  const INDEX = [
    { t: 'Home', s: 'Page', p: '/', k: 'home overview albacete' },
    { t: 'Products & Solutions', s: 'Page', p: '/products/', k: 'products portfolio solutions catalog' },
    { t: 'ActiGraft+ — Whole Blood Clot', s: 'Product', p: '/products/actigraft/', k: 'actigraft autologous blood clot G0465 G0460 NCD 270.3 diabetic foot ulcer DFU legacy point-of-care' },
    { t: 'UltraMist — Ultrasound Therapy', s: 'Product', p: '/products/ultramist/', k: 'ultramist ultrasound 97610 sanuwave saline mist NLFU non-contact painless' },
    { t: 'Collagen Wound Care Program', s: 'Product', p: '/products/collagen/', k: 'collagen A6021 A6023 A6253 bovine SSI surgical site infection propack incision' },
    { t: 'Exosomes & Birth Tissue', s: 'Product', p: '/products/exosomes/', k: "exosomes wharton's jelly birth tissue placental MSC regenerative biologics" },
    { t: 'Adhesion Barrier — Amniotic Membrane', s: 'Product', p: '/products/adhesion-barrier/', k: 'adhesion barrier C1762 amniotic membrane laparoscopic robotic trocar da vinci chorion-free' },
    { t: 'Advanced Biologics — Microlyte & Wraps', s: 'Product', p: '/products/advanced-biologics/', k: 'microlyte SAM A2005 tri-membrane membrane wrap lyte biolab silver antimicrobial 510k' },
    { t: 'MicroDoc — Disposable NPWT', s: 'Product', p: '/products/microdoc/', k: 'microdoc NPWT negative pressure disposable single-use home health' },
    { t: 'Medical Supplies Wholesaler', s: 'Product', p: '/products/wholesaler/', k: 'wholesale supplies foam alginate compression surgical prep catalog hospital' },
    { t: 'Scientific Portfolio', s: 'Page', p: '/scientific-portfolio/', k: 'science evidence MMP biofilm cascade studies clinical data mechanism' },
    { t: 'Revenue Cycle Management', s: 'Service', p: '/revenue-cycle/', k: 'revenue cycle RCM acuitymd denials leakage billing recovery' },
    { t: 'Legal Guidance', s: 'Service', p: '/legal-guidance/', k: 'legal audit RAC UPIC CERT stark anti-kickback AKS HIPAA malpractice counsel attorney' },
    { t: 'Consultative Services', s: 'Service', p: '/consulting/', k: 'consulting advisory coding formulary operations market access' },
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
    window.location.href = r.p;
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
