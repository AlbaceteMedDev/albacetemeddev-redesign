// ═══════════════════════════════════════════════════════════════
// Albacete MedDev — Redesign JS
// Splash + scroll reveals + nav + FAQ
// + Woah moments: counters, live dashboard, view transitions,
//   magnetic CTAs, hero text scramble
// ═══════════════════════════════════════════════════════════════

// Detect reduced-motion once; use to short-circuit showy animations
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = window.matchMedia('(hover: none)').matches;

// Splash loader — skip on subsequent nav within session (view transitions take over)
(function initSplash(){
  const alreadyVisited = sessionStorage.getItem('amd-visited') === '1';
  if (alreadyVisited){
    // Instantly skip the splash — dispatch is-loaded immediately
    const splash = document.querySelector('.splash');
    if (splash) splash.style.display = 'none';
    document.body.classList.remove('is-loading');
    document.body.classList.add('is-loaded');
  } else {
    setTimeout(() => {
      document.body.classList.remove('is-loading');
      document.body.classList.add('is-loaded');
      sessionStorage.setItem('amd-visited', '1');
    }, 1600);
  }
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

  // Parse a stat value like "20+", "100%", "$596K", "360°", "$2.98M", "173%", "5–10"
  // Returns { prefix, target, suffix } or null if not numeric
  function parseStat(text){
    const trimmed = text.trim();
    // Handle ranges like "5–10" or "55–93%" — animate the second (larger) number
    const rangeMatch = trimmed.match(/^([^\d]*)([\d,.]+)\s*[–-]\s*([\d,.]+)(.*)$/);
    if (rangeMatch) {
      const prefix = rangeMatch[1] + rangeMatch[2] + '–';
      const target = parseFloat(rangeMatch[3].replace(/,/g, ''));
      return isNaN(target) ? null : { prefix, target, suffix: rangeMatch[4], decimals: (rangeMatch[3].split('.')[1] || '').length };
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
      animate(el, parsed, 1100);
      // After animation, restore original HTML so any inner <span> styling comes back
      setTimeout(() => { el.innerHTML = original; }, 1200);
      io.unobserve(el);
    });
  }, { threshold: 0.35 });

  targets.forEach(el => {
    if (el.dataset.counterReady === '1') io.observe(el);
  });
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
// WOAH MOMENT #4 — Hero text scramble reveal
// ═══════════════════════════════════════════════════════════════
(function initTextScramble(){
  if (prefersReducedMotion) return;
  // Skip if this is a subsequent in-session nav — the view-transition handles the moment
  const alreadyVisited = sessionStorage.getItem('amd-scrambled') === '1';
  if (alreadyVisited) return;
  sessionStorage.setItem('amd-scrambled', '1');

  const heroH1 = document.querySelector('.hero h1');
  if (!heroH1) return;

  const CHARS = '!<>-_\\/[]{}—=+*^?#_______ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const DURATION = 1100;     // total scramble duration
  const CHAR_LOCK_MS = 90;   // how long each char stays settled

  // Walk text nodes and collect (node, originalText) pairs, preserving tags/structure
  const textNodes = [];
  function walk(node){
    if (node.nodeType === 3 /* text */ && node.textContent.trim().length > 0){
      textNodes.push({ node, original: node.textContent });
    } else if (node.nodeType === 1 /* element */ && node.tagName !== 'BR'){
      node.childNodes.forEach(walk);
    }
  }
  walk(heroH1);
  if (textNodes.length === 0) return;

  // Determine total chars across all nodes for timing
  const totalChars = textNodes.reduce((s, t) => s + t.original.length, 0);
  if (totalChars === 0) return;

  // For each char, calculate its "settle time" as a fraction of DURATION
  let charIndex = 0;
  const schedule = textNodes.map(({ node, original }) => {
    const chars = original.split('').map(ch => {
      const settleAt = (charIndex / totalChars) * (DURATION - CHAR_LOCK_MS);
      charIndex++;
      return { ch, settleAt };
    });
    return { node, original, chars };
  });

  // Hero must be visible immediately — we animate its text content, not opacity
  function randomChar(){
    return CHARS[Math.floor(Math.random() * CHARS.length)];
  }

  const startTime = performance.now();
  function frame(){
    const elapsed = performance.now() - startTime;
    let allDone = true;
    schedule.forEach(({ node, original, chars }) => {
      const out = chars.map(({ ch, settleAt }) => {
        if (ch === ' ' || ch === '\u00a0') return ch; // preserve spaces
        if (elapsed >= settleAt + CHAR_LOCK_MS) return ch;
        if (elapsed >= settleAt) return ch; // locked
        allDone = false;
        return randomChar();
      }).join('');
      node.textContent = out;
    });
    if (!allDone) requestAnimationFrame(frame);
    else {
      // Restore the literal originals (safety)
      schedule.forEach(({ node, original }) => { node.textContent = original; });
    }
  }
  // Start after splash has cleared (or immediately if skipped)
  const delay = document.body.classList.contains('is-loaded') ? 100 : 1700;
  setTimeout(() => requestAnimationFrame(frame), delay);
})();
