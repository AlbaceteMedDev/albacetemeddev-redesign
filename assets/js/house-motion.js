/* House motion layer, v4: crafted, brand-derived motion shared by every page. See HOUSE-STYLE.md (Motion v2 rules).
   Progressive only. Nothing is hidden without this file: every hidden state is gated on html.hm-on, which is set
   here and never under prefers-reduced-motion. Elements inside [data-motion-off] are left alone. Content inside a
   page-group reveal block (.sx-reveal / .scroll-reveal) starts when that block reveals, so the two read as one
   entrance instead of two. Adding .is-in to an armed element reveals it at once (print, hash jumps and tools).
   Nothing in the first viewport is ever armed: what is on screen at load is on screen at first paint. */
(() => {
  'use strict';
  if (window.__houseMotion) return;
  window.__houseMotion = true;

  const doc = document, root = doc.documentElement;
  const mqCalm = matchMedia('(prefers-reduced-motion: reduce)');
  const mqFine = matchMedia('(hover: hover) and (pointer: fine)');
  let calm = mqCalm.matches;
  const OFF = '[data-motion-off]';
  const GROUP = '.sx-reveal, .scroll-reveal';
  const isShown = el => el.classList.contains('is-in') || el.classList.contains('is-visible');
  const raf = fn => requestAnimationFrame(fn);
  const idle = fn => ('requestIdleCallback' in window ? requestIdleCallback(fn, {timeout: 600}) : setTimeout(fn, 60));
  const make = (tag, attrs) => { const el = doc.createElement(tag); if (attrs) for (const k in attrs) el.setAttribute(k, attrs[k]); return el; };
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const sstep = x => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
  const rgba = s => { const m = String(s).match(/[\d.]+/g); return m ? {r: +m[0], g: +m[1], b: +m[2], a: m[3] === undefined ? 1 : +m[3]} : null; };
  const lum = c => (0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b) / 255;

  /* ── Reveal engine ───────────────────────────────────────────────────
     arm(el, job): job.play(delayMs) animates once; job.finish() shows it at once. */
  const armed = new Map();
  let queue = [], queued = false;
  const flush = () => {
    queued = false;
    const list = [...new Set(queue)].filter(el => armed.has(el));
    queue = [];
    list.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));
    list.forEach((el, i) => {
      const job = armed.get(el);
      if (!job) return;
      armed.delete(el); unwatch(el);
      job.play(Math.min(i, 2) * 60 + (chained.has(el) && el.tagName !== 'IMG' ? 40 : 0));
    });
  };
  const trigger = el => { if (!armed.has(el)) return; queue.push(el); if (!queued) { queued = true; raf(flush); } };
  const io = 'IntersectionObserver' in window
    ? new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) trigger(e.target); }), {rootMargin: '0px 0px -5% 0px'})
    : null;
  const waiting = new Map();
  const chained = new WeakSet();
  const classWatch = new MutationObserver(records => records.forEach(r => {
    const el = r.target;
    if (!isShown(el)) return;
    if (armed.has(el)) trigger(el);
    const list = waiting.get(el);
    if (list) { waiting.delete(el); list.forEach(trigger); }
  }));
  function unwatch(el) { if (io) io.unobserve(el); }
  function arm(el, job) {
    armed.set(el, job);
    el.classList.add('reveal'); // shared hook: tooling that adds .is-in to .reveal shows it at once
    classWatch.observe(el, {attributes: true, attributeFilter: ['class']});
    const block = el.parentElement && el.parentElement.closest(GROUP);
    if (block && !isShown(block)) {
      if (!waiting.has(block)) { waiting.set(block, []); classWatch.observe(block, {attributes: true, attributeFilter: ['class']}); }
      waiting.get(block).push(el);
      chained.add(el);
    } else if (io) io.observe(el);
    else job.finish();
  }
  function finishAll() {
    armed.forEach((job, el) => { unwatch(el); job.finish(); });
    armed.clear(); waiting.clear(); queue = [];
  }
  // Any part of it inside the viewport (or above it) at start: never armed.
  const inFirstView = el => el.getBoundingClientRect().top < innerHeight;
  const visible = el => { const r = el.getBoundingClientRect(); return r.width > 0 && r.height > 0; };

  /* ── 1. Page transitions. The sequence itself is CSS (out 120ms, then in 180ms; the nav cuts once). Here, the
     gold line under the nav while the next page loads, and on the incoming page the same line completing and
     fading as the content arrives. ── */
  function transitions() {
    const nav = doc.querySelector('.nav');
    const bar = nav ? make('hm-bar', {'aria-hidden': 'true'}) : null;
    if (bar) nav.append(bar);
    let timer = 0;
    const reset = () => { clearTimeout(timer); root.classList.remove('hm-going', 'hm-arrive'); };
    const start = () => {
      if (calm || !bar) return;
      reset(); void bar.offsetWidth;
      root.classList.add('hm-going');
      timer = setTimeout(reset, 12000);
    };
    const sameSite = href => { try { const u = new URL(href, location.href); return u.origin === location.origin && (u.pathname !== location.pathname || u.search !== location.search); } catch { return false; } };
    const nav2 = window.navigation;
    if (nav2 && typeof nav2.addEventListener === 'function') {
      nav2.addEventListener('navigate', e => {
        if (e.hashChange || e.downloadRequest != null || e.formData || (e.destination && e.destination.sameDocument)) return;
        if (e.destination && sameSite(e.destination.url)) start();
      });
      nav2.addEventListener('navigateerror', reset);
    } else {
      addEventListener('click', e => {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        const a = e.target.closest && e.target.closest('a[href]');
        if (!a || a.hasAttribute('download') || (a.target && a.target !== '_self')) return;
        if (sameSite(a.href)) start();
      });
    }
    // Incoming page: the line is already complete when the content arrives, then fades.
    addEventListener('pagereveal', e => {
      if (!e.viewTransition || calm || !bar) return;
      root.classList.add('hm-arrive');
      timer = setTimeout(() => root.classList.remove('hm-arrive'), 700);
    });
    addEventListener('pageshow', e => { if (e.persisted) reset(); });
  }

  /* ── 2. Hover vocabulary. Each button is read once at rest and given its hover colours; the change itself is
     CSS (whole button, 140ms). Arrow glyphs are wrapped so they can nudge 4px. Nav and footer links are plain CSS
     (signature.css) and need nothing here. ── */
  const BTN = ['a.btn', 'button.btn', 'a.clinical-button', 'button.clinical-button', 'a.sx-btn', 'button.sx-btn',
    'a.cx-btn', 'button.cx-btn', '.nav-links .nav-cta'].join(',');
  const NUDGE = 'a.back-link'; // keeps its own hover underline; only its arrow answers
  const ARROWS = {'→': [4, 0], '↗': [3, -3], '↓': [0, 4], '←': [-4, 0], '↘': [3, 3], '↑': [0, -4], '↙': [-3, 3], '↖': [-3, -3]};
  const ARROW_RE = /^(\s*)([→↗↓←↘↑↙↖])(\s*)$|^([\s\S]*?\S)(\s+)([→↗↓←↘↑↙↖])(\s*)$|^(\s*)([→↗↓←↘↑↙↖])(\s+)([\s\S]*\S)(\s*)$/;
  function markArrow(el) {
    const setDir = (node, g) => { const d = ARROWS[g]; node.classList.add('hm-arw'); node.style.setProperty('--hm-ax', `${d[0]}px`); node.style.setProperty('--hm-ay', `${d[1]}px`); };
    // A child element holding just an arrow glyph.
    for (const c of el.children) {
      const t = c.textContent.trim();
      if (c.children.length === 0 && ARROWS[t]) { setDir(c, t); return; }
    }
    // An arrow at either end of a text node: wrap the glyph (wording and accessible name are unchanged).
    for (const n of [...el.childNodes]) {
      if (n.nodeType !== 3) continue;
      const m = n.data.match(ARROW_RE);
      if (!m || m[1] !== undefined) continue;
      const w = make('hm-ar');
      if (m[4] !== undefined) { w.textContent = m[6]; n.replaceWith(m[4] + m[5], w, ...(m[7] ? [m[7]] : [])); setDir(w, m[6]); }
      else { w.textContent = m[9]; n.replaceWith(...(m[8] ? [m[8]] : []), w, m[10] + m[11] + (m[12] || '')); setDir(w, m[9]); }
      return;
    }
  }
  const css = c => `rgba(${c.r},${c.g},${c.b},${c.a})`;
  const near = (a, b) => !!a && !!b && Math.abs(a.r - b.r) + Math.abs(a.g - b.g) + Math.abs(a.b - b.b) < 12 && Math.abs(a.a - b.a) < 0.1;
  // Hover colours for one button, read at rest. Gold fill: a slightly lighter gold with a navy label. Navy (dark)
  // fill: #1b3a5c. Outline (no fill): a 12% tint of its own label colour. Any other fill: 12% of the label mixed in.
  // The edge follows the fill when the border was the fill's own colour; otherwise it keeps its resting colour.
  function hoverColours(el) {
    const cs = getComputedStyle(el);
    const bg = rgba(cs.backgroundColor), ink = rgba(cs.color) || {r: 22, g: 33, b: 46, a: 1};
    const edge = rgba(cs.borderTopColor);
    const hasBorder = parseFloat(cs.borderTopWidth) > 0 && edge && edge.a > 0.05;
    let hover, label = css(ink);
    if (!bg || bg.a < 0.2) hover = `rgba(${ink.r},${ink.g},${ink.b},${(0.12 * ink.a).toFixed(3)})`;
    else if (bg.r > 150 && bg.g > 110 && bg.b < 150 && bg.r - bg.b > 60) { hover = '#e6c477'; label = 'var(--sx-navy,#10233a)'; }
    else if (lum(bg) < 0.2) hover = '#1b3a5c';
    else hover = `rgb(${Math.round(bg.r * 0.88 + ink.r * 0.12)},${Math.round(bg.g * 0.88 + ink.g * 0.12)},${Math.round(bg.b * 0.88 + ink.b * 0.12)})`;
    const keepEdge = hasBorder && !(bg && bg.a >= 0.2 && near(edge, bg));
    return {hover, label, edge: keepEdge ? css(edge) : hasBorder ? hover : 'transparent'};
  }
  function hovers() {
    const skip = el => el.closest(OFF) || el.closest('.mobile-menu, dialog');
    // Read pass first (computed styles), then one write pass.
    const btns = [...doc.querySelectorAll(BTN)].filter(el => !skip(el) && !el.classList.contains('hm-btn'))
      .map(el => ({el, c: hoverColours(el)}));
    btns.forEach(({el, c}) => {
      el.style.setProperty('--hm-hover', c.hover);
      el.style.setProperty('--hm-ink', c.label);
      el.style.setProperty('--hm-edge', c.edge);
      el.classList.add('hm-btn');
      markArrow(el);
    });
    doc.querySelectorAll(NUDGE).forEach(el => {
      if (skip(el) || el.classList.contains('hm-nudge')) return;
      el.classList.add('hm-nudge');
      markArrow(el);
    });
  }

  /* ── 3. Drawn underlines on inline prose links ─────────────────────── */
  function underlines() {
    if (!(window.CSS && CSS.supports('color', 'color-mix(in srgb, red 50%, transparent)'))) return;
    doc.querySelectorAll('main :is(p, li, dd, td, figcaption, blockquote, small) a[href]').forEach(a => {
      if (a.closest(OFF) || a.classList.contains('hm-btn') || a.querySelector('img, svg, picture')) return;
      const cs = getComputedStyle(a);
      if (cs.display === 'inline' && cs.textDecorationLine.includes('underline') && cs.backgroundImage === 'none') a.classList.add('hm-ul');
    });
  }

  /* ── 4. Headline reveals, below the fold only. Nothing masks or clips the words: each word is an unclipped
     inline box, the words of one visual line fade in together while they settle 8px, 320ms, lines 50ms apart (at
     most two steps), so a headline is complete in about 420ms. Lines are measured after the fonts load and again
     on resize. A heading whose layout the split would change, or that sits against a clipping edge, is left alone.
     After the reveal the original markup returns. ── */
  const HEAD_SKIP = '.sx-rise, .sx-hero, dialog, [hidden], [aria-hidden="true"], .mobile-menu, nav, footer';
  const HL_MS = 320, HL_STEP = 50;
  const heads = new Set();
  function splitWords(h) {
    const walker = doc.createTreeWalker(h, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(t => {
      if (!t.data.trim()) return;
      const frag = doc.createDocumentFragment();
      t.data.split(/(\s+)/).forEach(s => {
        if (!s) return;
        if (/^\s+$/.test(s)) { frag.append(s); return; }
        // A word keeps its own break points (after a hyphen, dash or slash) as separate boxes.
        s.split(/(?<=[-‐–—/])(?=.)/).forEach(part => { const w = make('hm-w'); w.textContent = part; frag.append(w); });
      });
      t.replaceWith(frag);
    });
  }
  function measure(list) {
    const plan = list.map(h => {
      const words = [...h.querySelectorAll('hm-w')];
      return {words, tops: words.map(w => w.getBoundingClientRect().top), gap: parseFloat(getComputedStyle(h).fontSize) * 0.5};
    });
    plan.forEach(({words, tops, gap}) => {
      let line = 0, last = null;
      tops.forEach((top, i) => {
        if (last !== null && top - last > gap) { line++; last = top; }
        if (last === null) last = top;
        words[i].style.setProperty('--l', line);
      });
    });
  }
  function restore(h) {
    h.querySelectorAll('hm-w').forEach(w => w.replaceWith(...w.childNodes));
    h.normalize();
    h.classList.remove('hm-hl', 'hm-in', 'hm-now', 'reveal');
    h.style.removeProperty('--hm-d');
    if (!h.getAttribute('style')) h.removeAttribute('style');
    if (!h.getAttribute('class')) h.removeAttribute('class');
  }
  // An ancestor that clips close below the heading would cut the descenders while the words settle.
  function clipsBelow(h, r) {
    for (let a = h.parentElement; a && a !== doc.body; a = a.parentElement) {
      const cs = getComputedStyle(a);
      if (/hidden|clip|auto|scroll/.test(cs.overflowY + cs.overflowX) && a.getBoundingClientRect().bottom < r.bottom + 12) return true;
      if (a.tagName === 'MAIN') break;
    }
    return false;
  }
  function headings() {
    const list = [...doc.querySelectorAll('main :is(h1, h2)')].filter(h => {
      if (h.closest(OFF) || h.closest(HEAD_SKIP) || h.matches(GROUP)) return false;
      if (h.querySelector('img, svg, input, button, select, textarea, [class*="line"], [class*="word"], [class*="char"]')) return false;
      const text = h.textContent.trim();
      return text && text.length <= 220 && visible(h) && !inFirstView(h) && !clipsBelow(h, h.getBoundingClientRect());
    });
    // Read, split, read again: a split that changes the heading's box (a different line break) is undone.
    const before = list.map(h => h.getBoundingClientRect());
    list.forEach(splitWords);
    const kept = list.filter((h, i) => {
      const r = h.getBoundingClientRect();
      if (Math.abs(r.height - before[i].height) < 1 && Math.abs(r.width - before[i].width) < 1) return true;
      restore(h);
      return false;
    });
    kept.forEach(h => {
      h.classList.add('hm-hl');
      heads.add(h);
      const done = () => { heads.delete(h); restore(h); };
      arm(h, {
        play(delay) {
          h.style.setProperty('--hm-d', `${delay}ms`);
          h.classList.add('hm-in');
          setTimeout(done, delay + 2 * HL_STEP + HL_MS + 80);
        },
        finish() { h.classList.add('hm-now', 'hm-in'); done(); }
      });
    });
    const remeasure = () => measure([...heads].filter(h => !h.classList.contains('hm-in')));
    remeasure();
    (doc.fonts && doc.fonts.ready ? doc.fonts.ready : Promise.resolve()).then(() => raf(remeasure));
    let rt = 0, lastW = innerWidth;
    addEventListener('resize', () => {
      if (innerWidth === lastW) return;
      lastW = innerWidth; clearTimeout(rt); rt = setTimeout(remeasure, 160);
    }, {passive: true});
  }

  /* ── 5. Images, below the fold only. Every image fades up 8px in 240ms, with no clip and no scale, except a
     wide editorial photograph (600px or more, not part of a listing): its mask opens upward (and, where its frame
     crops it, it settles from 1.05). Nothing is ever held behind a block: an image that is still loading when it
     comes into view fades in when it arrives. ── */
  const IMG_FADE_MS = 240, IMG_LIFT_MIN = 600;
  const IMG_SKIP = '[class*="logo"], [class*="identity"], .nav, footer, dialog, [aria-hidden="true"], [hidden], .mobile-menu';
  const loaded = img => img.complete && img.naturalWidth > 0;
  function isListing(img) {
    if (img.closest('a[href], li, article, [class*="card"]')) return true;
    // Repeating tiles that each hold an image (a grid of products, not an editorial photograph): the image's own
    // wrapper or the one above it has two or more like siblings with images.
    let n = img.closest('picture') || img;
    for (let depth = 0; depth < 2 && (n = n.parentElement); depth++) {
      const p = n.parentElement;
      if (!p) break;
      let peers = 0;
      for (const s of p.children) if (s !== n && s.tagName === n.tagName && s.className === n.className && s.querySelector('img')) peers++;
      if (peers >= 2) return true;
    }
    return false;
  }
  function images() {
    const plan = [];
    doc.querySelectorAll('main img').forEach(img => {
      if (img.closest(OFF) || img.closest(IMG_SKIP) || /\.svg(\?|$)/i.test(img.currentSrc || img.src)) return;
      const r = img.getBoundingClientRect();
      if (r.width < 48 || r.height < 48 || inFirstView(img)) return;
      // The settle (1.05 to 1) only where the frame crops the photo; otherwise its edges would move.
      const frame = (img.closest('picture') || img).parentElement, fs = getComputedStyle(frame);
      const crop = /hidden|clip/.test(fs.overflow) && Math.abs(frame.getBoundingClientRect().width - r.width) < 3;
      plan.push({img, lift: r.width >= IMG_LIFT_MIN && !isListing(img), crop});
    });
    plan.forEach(({img, lift, crop}) => {
      img.classList.add(lift ? 'hm-lift' : 'hm-fade');
      let anim = null;
      const finish = () => {
        if (anim) anim.cancel();
        img.classList.add('hm-shown');
        img.classList.remove('reveal');
      };
      const fade = (delay, ms, rise) => {
        img.classList.add('hm-shown');
        if (!img.animate) return;
        anim = img.animate([{opacity: 0, translate: `0 ${rise}px`}, {opacity: 1, translate: '0 0'}],
          {duration: ms, delay, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards'});
      };
      arm(img, {
        play(delay) {
          if (!loaded(img)) {
            // Still loading: no block, no wait. It fades in when it arrives.
            img.classList.remove('hm-lift'); img.classList.add('hm-fade');
            const go = () => fade(0, IMG_FADE_MS, 8);
            img.addEventListener('load', go, {once: true});
            img.addEventListener('error', finish, {once: true});
            return;
          }
          if (!lift || !img.animate) return fade(delay, IMG_FADE_MS, 8);
          img.classList.add('hm-shown');
          anim = img.animate(crop ? [{clipPath: 'inset(100% 0 0 0)', scale: '1.05'}, {clipPath: 'inset(0 0 0 0)', scale: '1'}]
            : [{clipPath: 'inset(100% 0 0 0)'}, {clipPath: 'inset(0 0 0 0)'}],
            {duration: 680, delay, easing: 'cubic-bezier(.2,.7,.2,1)', fill: 'backwards'});
        },
        finish
      });
    });
  }

  /* ── 6. The "+" field. The logo's plus, as thin 1px registration marks on a precise grid aligned to the content
     edge of each navy page header. Marks live only in the open areas: none within 64px of any line of text, link,
     button, form control or image in the header (feathered over 24px), and none on or against cards. A moving
     pointer parts them: marks either side of its path are pushed apart (up to 10px) and turn away from each other
     (up to 20 degrees), in white/mist only, never above 55% opacity. How far the field opens follows the pointer's
     speed; when it stops, every mark settles back on a critically damped spring (no overshoot) and stays closed
     until the pointer moves again. Nothing trails behind the pointer. At rest a slow, faint diagonal wave passes.
     Touch: the parting travels slowly with the scroll position. Reduced motion: a static faint grid. Paused
     off-screen and in hidden tabs. ── */
  function findFieldHost() {
    if (doc.body.classList.contains('page-home')) return null;
    const main = doc.querySelector('main');
    if (!main) return null;
    const heroish = el => [...el.classList].some(c => c === 'hero' || /-hero$/.test(c));
    const navy = el => { const c = rgba(getComputedStyle(el).backgroundColor); return !!c && c.a >= 0.9 && lum(c) <= 0.2; };
    const atTop = el => { const r = el.getBoundingClientRect(); return r.top + scrollY <= 160 && r.width >= innerWidth * 0.9 && r.height >= 200 ? r : null; };
    const heroes = [...main.querySelectorAll('section, header, div')].filter(heroish);
    for (const el of heroes) if (!el.closest(OFF) && atTop(el) && navy(el)) return el;
    // A page that is all header (the 404): its navy <main>, or the body when <main> is narrower than the screen.
    if (heroes.length || main.closest(OFF)) return null;
    const mr = main.getBoundingClientRect();
    if (mr.top + scrollY > 160 || mr.height < 200 || mr.height > innerHeight * 1.5 || !navy(main)) return null;
    if (mr.width >= innerWidth * 0.9) return main;
    const b = doc.body;
    return navy(b) && b.getBoundingClientRect().height <= innerHeight * 1.5 ? b : null;
  }
  // Exact step of a critically damped spring toward target T (angular frequency w, e = exp(-w dt)), in place on
  // typed arrays: stable at any frame time. A step that would cross the target stops on it, so a mark never
  // overshoots its rest point.
  function crit(xs, vs, i, T, w, dt, e) {
    const x = xs[i], v = vs[i], d = x - T, c = v + w * d;
    let nx = T + (d + c * dt) * e, nv = (v - w * c * dt) * e;
    if (d !== 0 && (nx - T) * d < 0) { nx = T; nv = 0; }
    xs[i] = nx; vs[i] = nv;
  }
  function plusField() {
    const host = findFieldHost();
    if (!host) return;
    const cv = make('canvas', {'aria-hidden': 'true', class: 'hm-field'});
    const ctx = cv.getContext && cv.getContext('2d');
    if (!ctx) return;
    host.classList.add('hm-field-host');
    // Body-hosted (the 404): <main> wears the same navy as the body; let the field show through it.
    if (host === doc.body) { const m = doc.querySelector('main'); if (m && getComputedStyle(m).backgroundColor === getComputedStyle(host).backgroundColor) m.classList.add('hm-field-clear'); }
    if (getComputedStyle(host).position === 'static') host.classList.add('hm-field-pos');
    host.append(cv);
    const nav = doc.querySelector('.nav');
    const MIST = '211,219,228';                       // the only colour in the field
    const CLEAR = 64, FEATHER = 24, PANEL_GAP = 16;    // keep-clear distances (px)
    const PUSH = 10, SIG = 24, SIG_A = 60, TURN = 20 * Math.PI / 180, REACH = 180;
    const OMEGA = 22;                                  // spring: settles in about 0.2s, critically damped
    const A_OPEN = 0.26, A_MAX = 0.55, A_WAVE = 0.12;
    const WAVE_V = 0.26, WAVE_W = 80, WAVE_GAP = 4200;
    let W = 0, H = 0, dpr = 1, N = 0, ARM = 4.5;
    let X, Y, BASE, KF, Q, DX, DY, RT, VX, VY, VR, qMax = 0, half = 0;

    function layout() {
      const hr = host.getBoundingClientRect();
      dpr = Math.min(2, devicePixelRatio || 1);
      W = hr.width; H = hr.height;
      cv.width = Math.max(1, Math.round(W * dpr)); cv.height = Math.max(1, Math.round(H * dpr));
      half = dpr === 1 ? 0.5 : 0;
      const s = W < 700 ? 28 : 32;
      ARM = W < 700 ? 4 : 4.5;
      // Anchor: columns on the content edge (the headline's left), rows on the headline's top.
      const h1 = host.querySelector('h1') || host.querySelector('h2, p');
      const ar = h1 ? h1.getBoundingClientRect() : {left: hr.left + 24, top: hr.top + 120};
      const x0 = ((ar.left - hr.left) % s + s) % s, y0 = ((ar.top - hr.top) % s + s) % s;
      // Keep-clear boxes: every line of text, every link, button, form control and image. Panels (opaque or fully
      // bordered boxes such as cards): no marks under or against them.
      const keep = [], panels = [];
      const INTERACTIVE = /^(A|BUTTON|INPUT|SELECT|TEXTAREA|LABEL|SUMMARY|IMG|SVG|VIDEO|PICTURE|IFRAME)$/i;
      host.querySelectorAll('*').forEach(el => {
        if (el === cv) return;
        const r = el.getBoundingClientRect();
        if (!r.width || !r.height) return;
        const cs = getComputedStyle(el);
        if (cs.visibility === 'hidden' || cs.display === 'none') return;
        const bg = rgba(cs.backgroundColor);
        const boxed = ['Top', 'Right', 'Bottom', 'Left'].every(k => parseFloat(cs[`border${k}Width`]) > 0 && (rgba(cs[`border${k}Color`]) || {a: 0}).a > 0.1);
        if ((bg && bg.a > 0.5) || boxed) { if (r.width < W * 0.9) panels.push(r); }
        if (INTERACTIVE.test(el.tagName) || el.getAttribute('role') === 'button' || el.hasAttribute('tabindex')) keep.push(r);
      });
      // Words: the line boxes of the text itself (a heading's block box spans the whole column; its words do not).
      const tw = doc.createTreeWalker(host, NodeFilter.SHOW_TEXT), range = doc.createRange();
      while (tw.nextNode()) {
        const t = tw.currentNode, pe = t.parentElement;
        if (!t.data.trim() || !pe || pe.closest('canvas, script, style, template, noscript')) continue;
        range.selectNodeContents(t);
        for (const r of range.getClientRects()) if (r.width > 1 && r.height > 1) keep.push(r);
      }
      // Rows hidden under the fixed nav are skipped (document coordinates, so a relayout mid-scroll agrees).
      const navH = nav && getComputedStyle(nav).position === 'fixed' ? nav.getBoundingClientRect().height : 0;
      const top = hr.top + scrollY;
      const pts = [], cand = new Map(), key = (x, y) => `${Math.round(x)},${Math.round(y)}`;
      for (let y = y0; y < H - 6; y += s) {
        if (y < 6 || top + y < navH + 22) continue;
        for (let x = x0; x < W - 6; x += s) {
          if (x < 6) continue;
          const ax = hr.left + x, ay = hr.top + y;
          let inPanel = false;
          for (const p of panels) if (ax > p.left - PANEL_GAP && ax < p.right + PANEL_GAP && ay > p.top - PANEL_GAP && ay < p.bottom + PANEL_GAP) { inPanel = true; break; }
          if (inPanel) continue;
          let d = 1e9;
          for (const w of keep) {
            const dx = Math.max(w.left - ax, 0, ax - w.right), dy = Math.max(w.top - ay, 0, ay - w.bottom);
            if (dx > d || dy > d) continue;
            const dd = Math.hypot(dx, dy);
            if (dd < d) d = dd;
          }
          // Feathered keep-clear edge: nothing within CLEAR, full strength from CLEAR + FEATHER.
          const k = sstep(clamp((d - CLEAR) / FEATHER, 0, 1));
          if (k > 0.02) cand.set(key(x, y), [x, y, k]);
        }
      }
      // A mark stands only as part of a patch (three or more of its eight neighbours present): no stray marks
      // left along the edges of the keep-clear zones.
      cand.forEach(([x, y, k]) => {
        let n = 0;
        for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) if ((i || j) && cand.has(key(x + i * s, y + j * s))) n++;
        if (n >= 3) pts.push(x, y, k);
      });
      const same = N === pts.length / 3 && DX; // a relayout that keeps the grid keeps each mark's motion
      N = pts.length / 3;
      X = new Float32Array(N); Y = new Float32Array(N); BASE = new Float32Array(N); KF = new Float32Array(N); Q = new Float32Array(N);
      if (!same) { DX = new Float32Array(N); DY = new Float32Array(N); RT = new Float32Array(N); VX = new Float32Array(N); VY = new Float32Array(N); VR = new Float32Array(N); }
      qMax = 0;
      for (let i = 0; i < N; i++) {
        const x = pts[i * 3], y = pts[i * 3 + 1], k = pts[i * 3 + 2];
        X[i] = Math.round(x) + half; Y[i] = Math.round(y) + half;
        // The last rows ease off toward the header's lower edge, so the field ends rather than being cut.
        const edge = 0.45 + 0.55 * sstep(clamp((H - y) / 96, 0, 1));
        KF[i] = k;
        BASE[i] = A_OPEN * k * edge * (calm ? 0.6 : 1);   // reduced motion: a static, fainter grid
        Q[i] = x * 0.8 + y * 0.6;                         // wave direction: top-left to bottom-right
        if (Q[i] > qMax) qMax = Q[i];
      }
    }

    /* Pointer state (host coordinates). Velocity is smoothed; the opening follows speed, so a resting pointer
       (or sensor jitter of a pixel or two) leaves the field closed. */
    let px = -1e4, py = -1e4, inside = false, lastMove = -1e9;
    let sx = 0, sy = 0, dirX = 1, dirY = 0, open = 0, lx = null, ly = null;
    let wave = -1, nextWave = 0, rafId = 0, last = 0, seen = true, wake = 0;
    // Touch: a virtual pointer that travels a diagonal across the header as the page scrolls, slowly.
    const touch = !mqFine.matches;
    let vx = 0, vy = 0, vInit = false;

    function point(x, y, now) { px = x; py = y; inside = true; lastMove = now; }
    function scrollTarget() {
      const u = clamp(scrollY / Math.max(1, H * 0.85), 0, 1);
      return [W * (0.12 + 0.76 * u), H * (0.22 + 0.5 * u)];
    }

    function frame(t) {
      rafId = 0;
      const dt = last ? Math.min(0.034, (t - last) / 1000) : 1 / 60;
      last = t;
      if (touch) {
        const [tx, ty] = scrollTarget();
        if (!vInit) { vx = tx; vy = ty; vInit = true; }
        const a = 1 - Math.exp(-dt / 0.45);
        const nx = vx + (tx - vx) * a, ny = vy + (ty - vy) * a;
        if (Math.hypot(nx - vx, ny - vy) > 0.15) point(nx, ny, t);
        vx = nx; vy = ny;
        if (t - lastMove > 500) inside = false;
      }
      // Smoothed velocity (px/s) from the pointer's travel this frame.
      let ix = 0, iy = 0;
      if (inside && lx !== null) { ix = (px - lx) / dt; iy = (py - ly) / dt; }
      lx = inside ? px : null; ly = inside ? py : null;
      const av = 1 - Math.exp(-dt / 0.06);
      sx += (ix - sx) * av; sy += (iy - sy) * av;
      const speed = Math.hypot(sx, sy);
      if (speed > 8) { dirX = sx / speed; dirY = sy / speed; }
      const want = inside ? sstep(clamp((speed - 20) / 220, 0, 1)) : 0;
      open += (want - open) * (1 - Math.exp(-dt / (want > open ? 0.08 : 0.2)));
      if (open < 0.002 && want === 0) open = 0;
      // Idle wave: only when the pointer has been still for a while and the field is closed.
      if (wave < 0 && t >= nextWave && t - lastMove > 2200 && open === 0) wave = t;
      const front = wave >= 0 ? (t - wave) * WAVE_V - WAVE_W * 3 : -1e9;
      if (wave >= 0 && front > qMax + WAVE_W * 3) { wave = -1; nextWave = t + WAVE_GAP; }

      // Targets: marks either side of the pointer's path part (odd in the perpendicular offset, so the two sides
      // move apart and turn away from each other), within a short lens around the pointer only.
      const nX = -dirY, nY = dirX, inv2s = 1 / (2 * SIG * SIG), inv2a = 1 / (2 * SIG_A * SIG_A), e = Math.exp(-OMEGA * dt);
      // The springs lag a moving target by about 2v/omega; the lens is placed that far ahead, so the parting sits on
      // the pointer instead of behind it.
      const lead = Math.min(60, speed * 2 / OMEGA), cx = px + dirX * lead, cy = py + dirY * lead;
      let busy = false;
      for (let i = 0; i < N; i++) {
        let tx = 0, ty = 0, tr = 0;
        if (open > 0) {
          const rx = X[i] - cx, ry = Y[i] - cy;
          if (rx < REACH && rx > -REACH && ry < REACH && ry > -REACH) {
            const p = nX * rx + nY * ry, a = dirX * rx + dirY * ry;
            const m = open * KF[i] * (p / SIG) * Math.exp(0.5 - p * p * inv2s) * Math.exp(-a * a * inv2a);
            if (m > 0.004 || m < -0.004) { tx = nX * PUSH * m; ty = nY * PUSH * m; tr = TURN * m; }
          }
        }
        if (tx || ty || tr || DX[i] || DY[i] || RT[i] || VX[i] || VY[i] || VR[i]) {
          crit(DX, VX, i, tx, OMEGA, dt, e);
          crit(DY, VY, i, ty, OMEGA, dt, e);
          crit(RT, VR, i, tr, OMEGA, dt, e);
          if (!tx && !ty && !tr && Math.abs(DX[i]) + Math.abs(DY[i]) < 0.02 && Math.abs(VX[i]) + Math.abs(VY[i]) < 0.05 && Math.abs(RT[i]) < 0.002 && Math.abs(VR[i]) < 0.01) {
            DX[i] = DY[i] = RT[i] = VX[i] = VY[i] = VR[i] = 0;
          } else busy = true;
        }
      }
      draw(front);
      if (busy || open > 0 || wave >= 0 || (touch && inside) || (inside && speed > 0.5)) { kick(); return; }
      last = 0;
      schedule();
    }

    function draw(front) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.lineWidth = 1;
      const LV = 40, bk = [];
      for (let i = 0; i < N; i++) {
        let a = BASE[i], L = ARM;
        if (front > -1e8) {
          const q = (Q[i] - front) / WAVE_W, b = Math.exp(-q * q);
          if (b > 0.01) { a += b * A_WAVE * KF[i]; L += b * 0.75; }
        }
        const dx = DX[i], dy = DY[i], r = RT[i];
        // A parted mark (a lip) brightens toward 55%, and its arms lengthen a little.
        const o = Math.min(1, Math.hypot(dx, dy) / PUSH);
        a = Math.min(A_MAX, a + o * (A_MAX - A_OPEN) * KF[i]);
        L *= 1 + o * 0.25;
        const lv = Math.round(a * LV);
        if (!lv) continue;
        const path = bk[lv] || (bk[lv] = new Path2D());
        // One arm whole; the other in two halves that stop at the first arm's edge (half a line width from the
        // centre), so no pixel is painted twice and no mark is ever brighter than its own alpha.
        const x = X[i] + dx, y = Y[i] + dy;
        const cs = r === 0 ? 1 : Math.cos(r), sn = r === 0 ? 0 : Math.sin(r);
        path.moveTo(x - cs * L, y - sn * L); path.lineTo(x + cs * L, y + sn * L);
        path.moveTo(x + sn * 0.5, y - cs * 0.5); path.lineTo(x + sn * L, y - cs * L);
        path.moveTo(x - sn * 0.5, y + cs * 0.5); path.lineTo(x - sn * L, y + cs * L);
      }
      bk.forEach((path, lv) => { if (path) { ctx.strokeStyle = `rgba(${MIST},${(lv / LV).toFixed(3)})`; ctx.stroke(path); } });
    }

    const blocked = () => !seen || doc.hidden;
    function kick() { if (!rafId && !blocked()) rafId = requestAnimationFrame(frame); }
    function schedule() {
      clearTimeout(wake);
      if (blocked()) return;
      const now = performance.now();
      wake = setTimeout(kick, Math.max(60, Math.max(nextWave, lastMove + 2200) - now));
    }

    layout();
    draw(-1e9);
    const relayout = () => { layout(); draw(-1e9); if (!calm) kick(); };
    let rq = 0;
    const queueLayout = () => { if (!rq) rq = requestAnimationFrame(() => { rq = 0; relayout(); }); };
    if ('ResizeObserver' in window) new ResizeObserver(queueLayout).observe(host);
    else addEventListener('resize', queueLayout, {passive: true});
    // Text settles after the fonts load and after page-group entrances: measure again.
    (doc.fonts && doc.fonts.ready ? doc.fonts.ready : Promise.resolve()).then(queueLayout);
    setTimeout(queueLayout, 1100); setTimeout(queueLayout, 2400);
    if (calm) {
      mqCalm.addEventListener && mqCalm.addEventListener('change', () => location.reload());
      return;
    }
    nextWave = performance.now() + 600;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(es => { seen = es[es.length - 1].isIntersecting; if (seen) { last = 0; kick(); } }).observe(host);
    }
    doc.addEventListener('visibilitychange', () => { if (!doc.hidden) { last = 0; kick(); } });
    const local = e => { const r = host.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    host.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      const [x, y] = local(e);
      point(x, y, performance.now());
      kick();
    }, {passive: true});
    host.addEventListener('pointerleave', e => { if (e.pointerType === 'mouse' || e.pointerType === 'pen') { inside = false; kick(); } });
    if (touch) addEventListener('scroll', kick, {passive: true});
    kick();
  }

  /* ── Start ─────────────────────────────────────────────────────────── */
  const safe = fn => { try { fn(); } catch (err) { if (window.console) console.warn('house-motion:', err); } };
  safe(transitions);
  safe(hovers);
  idle(() => safe(underlines));
  if (!calm && io) {
    root.classList.add('hm-on');
    safe(headings);
    safe(images);
  }
  safe(plusField);
  addEventListener('beforeprint', finishAll);
  addEventListener('hashchange', finishAll);
  mqCalm.addEventListener && mqCalm.addEventListener('change', () => {
    calm = mqCalm.matches;
    if (calm) { finishAll(); root.classList.remove('hm-on', 'hm-going', 'hm-arrive'); }
  });
})();
