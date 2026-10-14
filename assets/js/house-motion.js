/* House motion layer, v5: crafted, brand-derived motion shared by every page. See HOUSE-STYLE.md (Motion v2 rules).
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

  /* ── 6. The "+" field. The logo's plus, as thin 1px registration marks on a precise grid, in three places: navy
     inner page headers (mist), a band along the top edge of the footer on desktop, and the open space of the phone
     menu. Paper headers carry no field. Where marks stand is one smooth mask, never a keep-clear traced around each
     word: in a header, the words, controls, images and cards together make one text column, and the field fades in
     from the column's edges toward the outer edges of the screen over 200px (beginning 24px out), so it flanks the
     column and is never clipped into steps or blobs; it also eases in under the nav and out toward the header's lower
     edge. The footer band fades the same way with distance from the footer's content (over 160px), so it is fullest
     at the outer edges. Only marks at least 120px from any text or control (the nav's included) react to the
     pointer: those either side of its path are pushed apart (up to 10px) and turn away from each other (up to 20
     degrees), as far as the pointer is fast, and settle back on a critically damped spring when it stops. At rest a
     slow, faint diagonal wave passes. Touch screens and reduced motion: static (reduced motion also fainter).
     Paused off-screen and in hidden tabs. ── */
  const TONES = {
    mist: {rgb: '211,219,228', open: 0.26, max: 0.55, wave: 0.12},  // navy page headers
    foot: {rgb: '211,219,228', open: 0.2, max: 0.42, wave: 0.08},   // the footer band
    menu: {rgb: '211,219,228', open: 0.17, max: 0.45, wave: 0.1}    // the phone menu
  };
  const vwidth = () => doc.documentElement.clientWidth || innerWidth;
  const narrow = () => vwidth() < 700;
  const theNav = () => doc.querySelector('.nav');
  // Lower edge of the fixed nav in its resting (full-height) layout, whatever state the smart nav is in.
  const navRest = () => { const n = theNav(); return n && getComputedStyle(n).position === 'fixed' ? n.offsetHeight : 0; };
  const bgOf = el => {
    for (let n = el; n && n.nodeType === 1; n = n.parentElement) { const c = rgba(getComputedStyle(n).backgroundColor); if (c && c.a >= 0.9) return c; }
    return null;
  };

  function findFieldHost() {
    if (doc.body.classList.contains('page-home')) return null;           // the home page has its own field
    const main = doc.querySelector('main');
    if (!main) return null;
    const heroish = el => [...el.classList].some(c => c === 'hero' || /-hero$/.test(c) || /(^|-)intro$/.test(c));
    const atTop = el => { const r = el.getBoundingClientRect(); return r.top + scrollY <= 160 && r.width >= vwidth() * 0.75 && r.height >= 200; };
    const heroes = [...main.querySelectorAll('section, header, div')].filter(heroish);
    for (const el of heroes) {
      if (el.closest(OFF) || !atTop(el)) continue;
      if (el.querySelector('canvas:not(.hm-field)')) return null;         // a page-specific field already lives here
      const c = bgOf(el);
      if (!c) continue;
      const L = lum(c);
      if (L <= 0.2) return {host: el, tone: 'mist'};
      if (L >= 0.85) return null;                                         // paper headers: no field
    }
    // A page that is all header (the 404): its navy <main>, or the body when <main> is narrower than the screen.
    if (heroes.length || main.closest(OFF)) return null;
    const navy = el => { const c = rgba(getComputedStyle(el).backgroundColor); return !!c && c.a >= 0.9 && lum(c) <= 0.2; };
    const mr = main.getBoundingClientRect();
    if (mr.top + scrollY > 160 || mr.height < 200 || mr.height > innerHeight * 1.5 || !navy(main)) return null;
    if (mr.width >= innerWidth * 0.9) return {host: main, tone: 'mist'};
    const b = doc.body;
    return navy(b) && b.getBoundingClientRect().height <= innerHeight * 1.5 ? {host: b, tone: 'mist', body: true} : null;
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
  // What a field keeps clear of, inside a root: line boxes of words and controls (keep), images, panels (opaque or
  // fully bordered boxes such as cards) and printed rules (thin borders and thin ::before/::after lines). Hidden
  // things, and anything that lies outside the box given (an off-screen skip link, say), are left out.
  function scanKeep(root, skip, box) {
    const keep = [], imgs = [], panels = [], rules = [], vw = vwidth();
    const inBox = r => !box || (r.right > box.left && r.left < box.right && r.bottom > box.top && r.top < box.bottom);
    const CTRL = /^(A|BUTTON|INPUT|SELECT|TEXTAREA|LABEL|SUMMARY)$/i, MEDIA = /^(IMG|SVG|VIDEO|PICTURE|IFRAME|CANVAS)$/i;
    root.querySelectorAll('*').forEach(el => {
      if (el === skip || (el.classList && el.classList.contains('hm-field'))) return;
      const r = el.getBoundingClientRect();
      if (!r.width || (!r.height && el.tagName !== 'HR') || !inBox(r)) return;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none') return;
      const bg = rgba(cs.backgroundColor);
      const boxed = ['Top', 'Right', 'Bottom', 'Left'].every(k => parseFloat(cs[`border${k}Width`]) > 0 && (rgba(cs[`border${k}Color`]) || {a: 0}).a > 0.1);
      if ((bg && bg.a > 0.5) || boxed) { if (r.width < vw * 0.9) panels.push(r); }
      else {
        for (const k of ['Top', 'Bottom']) {
          const w = parseFloat(cs[`border${k}Width`]);
          if (w > 0 && r.width > 40 && (rgba(cs[`border${k}Color`]) || {a: 0}).a > 0.1) { const t = k === 'Top' ? r.top : r.bottom - w; rules.push({left: r.left, right: r.right, top: t, bottom: t + w}); }
        }
        for (const k of ['Left', 'Right']) {
          const w = parseFloat(cs[`border${k}Width`]);
          if (w > 0 && r.height > 40 && (rgba(cs[`border${k}Color`]) || {a: 0}).a > 0.1) { const l = k === 'Left' ? r.left : r.right - w; rules.push({left: l, right: l + w, top: r.top, bottom: r.bottom}); }
        }
        for (const pe of ['::before', '::after']) {
          const ps = getComputedStyle(el, pe);
          if (ps.content === 'none' || ps.display === 'none' || ps.visibility === 'hidden') continue;
          const ph = parseFloat(ps.height) || 0, pw = parseFloat(ps.width) || 0, fill = rgba(ps.backgroundColor);
          if (!fill || fill.a <= 0.1 || ph <= 0 || pw <= 0) continue;
          const abs = ps.position === 'absolute' || ps.position === 'fixed';
          const L = abs && ps.left !== 'auto' ? r.left + parseFloat(ps.left) : abs && ps.right !== 'auto' ? r.right - parseFloat(ps.right) - pw : r.left + (parseFloat(cs.paddingLeft) || 0);
          const Tp = abs && ps.top !== 'auto' ? r.top + parseFloat(ps.top) : abs && ps.bottom !== 'auto' ? r.bottom - parseFloat(ps.bottom) - ph :
            pe === '::before' ? r.top + (parseFloat(cs.borderTopWidth) || 0) + (parseFloat(cs.paddingTop) || 0) : r.bottom - (parseFloat(cs.paddingBottom) || 0) - ph;
          if ((ph <= 4 && pw > 40) || (pw <= 4 && ph > 40)) rules.push({left: L, right: L + pw, top: Tp, bottom: Tp + ph});
        }
      }
      if (MEDIA.test(el.tagName)) imgs.push(r);
      else if (CTRL.test(el.tagName) || el.getAttribute('role') === 'button' || el.hasAttribute('tabindex')) keep.push(r);
    });
    const tw = doc.createTreeWalker(root, NodeFilter.SHOW_TEXT), range = doc.createRange();
    while (tw.nextNode()) {
      const t = tw.currentNode, pe = t.parentElement;
      if (!t.data.trim() || !pe || pe.closest('canvas, script, style, template, noscript')) continue;
      if (getComputedStyle(pe).visibility === 'hidden') continue;
      range.selectNodeContents(t);
      for (const r of range.getClientRects()) if (r.width > 1 && r.height > 1 && inBox(r)) keep.push(r);
    }
    return {keep, imgs, panels, rules};
  }
  const rectDist = (r, x, y) => Math.hypot(Math.max(r.left - x, 0, x - r.right), Math.max(r.top - y, 0, y - r.bottom));
  const fieldPointers = new Set();
  let fieldPointerOn = false;
  function listenPointer() {
    if (fieldPointerOn) return;
    fieldPointerOn = true;
    doc.addEventListener('pointermove', e => {
      if (e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;
      const now = performance.now();
      fieldPointers.forEach(f => f.pointer(e.clientX, e.clientY, now));
    }, {passive: true});
    doc.documentElement.addEventListener('pointerleave', () => fieldPointers.forEach(f => f.leave()));
  }

  /* makeField(host, o): o.tone (TONES key); o.box(hostRect) → the canvas box {x, y, w, h} in host coordinates
     (default: the host itself); o.mask: 'column' (a header: flanks either side of the text column), 'box' (the
     footer band: distance from the content's bounding box) or 'keep' (distance from each keep box, given by
     o.measure, for the phone menu); o.gap / o.fall shape the fade; o.measure() → {keep, imgs, panels, rules}
     (default: scan the host); o.above() → words and controls just outside the host that the pointer rule must also
     respect; o.anchor() → the element whose left edge and top align the grid; o.rows [from, to] limits rows to a
     band (canvas coordinates); o.fixed for a fixed host; o.parked starts it switched off. Marks react to the
     pointer only on a device with a fine pointer; elsewhere the field is static. */
  function makeField(host, o) {
    const cv = make('canvas', {'aria-hidden': 'true', class: 'hm-field' + (o.box ? ' hm-field--box' : '')});
    const ctx = cv.getContext && cv.getContext('2d');
    if (!ctx) return null;
    host.classList.add('hm-field-host');
    if (getComputedStyle(host).position === 'static') host.classList.add('hm-field-pos');
    host.append(cv);
    const T = TONES[o.tone] || TONES.mist;
    const PUSH = 10, SIG = 24, SIG_A = 60, TURN = 20 * Math.PI / 180, REACH = 180;
    const OMEGA = 22;                                    // spring: settles in about 0.2s, critically damped
    const WAVE_V = 0.26, WAVE_W = 80, WAVE_GAP = 4200;
    const QUIET = 120;                                   // marks closer than this to words or controls never move
    const live = mqFine.matches;                         // touch screens: a static field
    const MASK = o.mask || 'column', GAP = o.gap != null ? o.gap : 24, FALL = o.fall || 200;
    let W = 0, H = 0, dpr = 1, N = 0, ARM = 4.5, ox = 0, oy = 0, topDoc = 0;
    let X, Y, BASE, KF, RF, Q, DX, DY, RT, VX, VY, VR, qMax = 0, half = 0;
    let parked = !!o.parked;

    function layout() {
      const hr = host.getBoundingClientRect();
      const box = o.box ? o.box(hr) : null;
      const bx = box ? box.x : 0, by = box ? box.y : 0;
      W = Math.max(0, Math.round(box ? box.w : hr.width)); H = Math.max(0, Math.round(box ? box.h : hr.height));
      if (box) {
        cv.style.setProperty('--hm-fx', `${bx}px`); cv.style.setProperty('--hm-fy', `${by}px`);
        cv.style.setProperty('--hm-fw', `${W}px`); cv.style.setProperty('--hm-fh', `${H}px`);
      }
      ox = hr.left + bx; oy = hr.top + by;
      topDoc = oy + (o.fixed ? 0 : scrollY);
      dpr = Math.min(2, devicePixelRatio || 1);
      cv.width = Math.max(1, Math.round(W * dpr)); cv.height = Math.max(1, Math.round(H * dpr));
      half = dpr === 1 ? 0.5 : 0;
      const phone = narrow();
      ARM = phone ? 4 : 4.5;
      const area = {left: ox - 1, right: ox + W + 1, top: o.rows ? -1e9 : oy - 1, bottom: o.rows ? 1e9 : oy + H + 1};
      const m = W && H ? (o.measure ? o.measure() : scanKeep(host, cv, area)) : {keep: [], imgs: [], panels: [], rules: []};
      const keep = m.keep || [], rules = m.rules || [];
      // Everything that is content, in canvas coordinates; its bounding box is the text column.
      const toC = r => ({left: r.left - ox, right: r.right - ox, top: r.top - oy, bottom: r.bottom - oy});
      const content = keep.concat(m.imgs || [], m.panels || []).filter(r => r.width < W * 0.98).map(toC);
      const words = keep.map(toC), lines = rules.map(toC), above = (o.above ? o.above() : []).map(toC);
      let cL = W / 2, cR = W / 2, cT = H / 2, cB = H / 2;
      if (content.length) {
        cL = Math.min(...content.map(r => r.left)); cR = Math.max(...content.map(r => r.right));
        cT = Math.min(...content.map(r => r.top)); cB = Math.max(...content.map(r => r.bottom));
      }
      const anchor = (o.anchor && o.anchor()) || host.querySelector('h1') || host.querySelector('h2, p');
      const ar = anchor ? anchor.getBoundingClientRect() : {left: ox + 24, top: oy + 120};
      const navB = navRest(), navGap = phone ? 12 : 22;
      // Grid: columns on the content edge (the headline's left), rows on the headline's top (or the band's rows).
      const s = phone ? 28 : 32;
      const x0 = ((ar.left - ox) % s + s) % s;
      const y0 = o.rows ? o.rows[0] % s : ((ar.top - oy) % s + s) % s;
      const yFrom = o.rows ? o.rows[0] : 6, yTo = o.rows ? o.rows[1] : H - 6;
      const EDGE = 12;   // no mark within 12px of the canvas edges (nor 14px of its lower edge)
      const pts = [];
      for (let j = 0, y = y0; y <= yTo + 0.5; y = y0 + (++j) * s) {
        if (y < yFrom - 0.5 || y < EDGE || y > H - 14 || topDoc + y < navB + navGap) continue;
        for (let i = 0, x = x0; x < W - EDGE + 0.5; x = x0 + (++i) * s) {
          if (x < EDGE - 0.5) continue;
          const dx = Math.max(cL - x, 0, x - cR), dy = Math.max(cT - y, 0, y - cB);
          let k, quiet;
          if (MASK === 'keep') {
            let d = 1e9;
            for (const w of words) { const dd = rectDist(w, x, y); if (dd < d) d = dd; }
            k = sstep(clamp((d - GAP) / FALL, 0, 1)); quiet = d;
          } else if (MASK === 'box') {
            const d = Math.hypot(dx, dy);
            k = sstep(clamp((d - GAP) / FALL, 0, 1)); quiet = d;
          } else {
            // A header: the flanks of the column only. Eased in under the nav and out toward the lower edge.
            k = sstep(clamp((dx - GAP) / FALL, 0, 1)) * sstep(clamp((topDoc + y - navB - 8) / 72, 0, 1)) * sstep(clamp((H - y - 8) / 96, 0, 1));
            quiet = dx;
          }
          if (k <= 0.02) continue;
          // Printed rules that reach into the field: marks fade out before them, never sit against them.
          for (const l of lines) { const dd = rectDist(l, x, y); if (dd < 48) k *= sstep(clamp((dd - 12) / 36, 0, 1)); }
          if (k <= 0.02) continue;
          // The pointer rule: at least QUIET px from every word and control, the nav's own included.
          for (const w of above) { const dd = rectDist(w, x, y); if (dd < quiet) quiet = dd; }
          if (navB) quiet = Math.min(quiet, topDoc + y - navB + 24);   // the nav's controls end about 24px above its edge
          pts.push(x, y, k, sstep(clamp((quiet - QUIET) / 48, 0, 1)));
        }
      }
      const same = N === pts.length / 4 && DX;
      N = pts.length / 4;
      X = new Float32Array(N); Y = new Float32Array(N); BASE = new Float32Array(N); KF = new Float32Array(N); RF = new Float32Array(N); Q = new Float32Array(N);
      if (!same) { DX = new Float32Array(N); DY = new Float32Array(N); RT = new Float32Array(N); VX = new Float32Array(N); VY = new Float32Array(N); VR = new Float32Array(N); }
      qMax = 0;
      for (let i = 0; i < N; i++) {
        const x = pts[i * 4], y = pts[i * 4 + 1], k = pts[i * 4 + 2];
        X[i] = Math.round(x) + half; Y[i] = Math.round(y) + half;
        KF[i] = k; RF[i] = pts[i * 4 + 3];
        BASE[i] = T.open * k * (calm ? 0.6 : 1);   // reduced motion: a static, fainter grid
        Q[i] = x * 0.8 + y * 0.6;                    // wave direction: top-left to bottom-right
        if (Q[i] > qMax) qMax = Q[i];
      }
    }

    /* Input state (canvas coordinates). Velocity is smoothed; the opening follows speed, so a resting pointer (or
       sensor jitter of a pixel or two) leaves the field closed. */
    let px = -1e4, py = -1e4, inside = false, lastMove = -1e9;
    let sx = 0, sy = 0, dirX = 1, dirY = 0, open = 0, lx = null, ly = null;
    let wave = -1, nextWave = 0, rafId = 0, last = 0, seen = true, wake = 0;

    function frame(t) {
      rafId = 0;
      if (parked) return;
      const dt = last ? Math.min(0.034, (t - last) / 1000) : 1 / 60;
      last = t;
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

      const e = Math.exp(-OMEGA * dt);
      let busy = false;
      // Marks either side of the pointer's path part (odd in the perpendicular offset, so the two sides move apart
      // and turn away from each other), within a short lens around the pointer only. The springs lag a moving
      // target by about 2v/omega; the lens is placed that far ahead, so the parting sits on the pointer.
      const nX = -dirY, nY = dirX, inv2s = 1 / (2 * SIG * SIG), inv2a = 1 / (2 * SIG_A * SIG_A);
      const lead = Math.min(60, speed * 2 / OMEGA), cx = px + dirX * lead, cy = py + dirY * lead;
      for (let i = 0; i < N; i++) {
        let tx = 0, ty = 0, tr = 0;
        if (open > 0 && RF[i] > 0) {
          const rx = X[i] - cx, ry = Y[i] - cy;
          if (rx < REACH && rx > -REACH && ry < REACH && ry > -REACH) {
            const p = nX * rx + nY * ry, a = dirX * rx + dirY * ry;
            const m = open * KF[i] * RF[i] * (p / SIG) * Math.exp(0.5 - p * p * inv2s) * Math.exp(-a * a * inv2a);
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
      if (busy || open > 0 || wave >= 0 || (inside && speed > 0.5)) { kick(); return; }
      last = 0;
      schedule();
    }

    function draw(front) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      if (parked) return;
      ctx.lineWidth = 1;
      const LV = 40, bk = [];
      for (let i = 0; i < N; i++) {
        let a = BASE[i], L = ARM;
        if (front > -1e8) {
          const q = (Q[i] - front) / WAVE_W, b = Math.exp(-q * q);
          if (b > 0.01) { a += b * T.wave * KF[i]; L += b * 0.75; }
        }
        const dx = DX[i], dy = DY[i], r = RT[i];
        // A parted mark brightens toward the tone's ceiling, and its arms lengthen a little.
        const op = Math.min(1, Math.hypot(dx, dy) / 6 + Math.abs(r) / TURN * 0.5);
        a = Math.min(T.max, a + op * (T.max - T.open) * KF[i]);
        L *= 1 + op * 0.25;
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
      bk.forEach((path, lv) => { if (path) { ctx.strokeStyle = `rgba(${T.rgb},${(lv / LV).toFixed(3)})`; ctx.stroke(path); } });
    }

    const still = () => calm || !live;
    const blocked = () => parked || !seen || doc.hidden;
    function kick() { if (!rafId && !blocked() && !still()) rafId = requestAnimationFrame(frame); }
    function schedule() {
      clearTimeout(wake);
      if (blocked() || still()) return;
      const now = performance.now();
      wake = setTimeout(kick, Math.max(60, Math.max(nextWave, lastMove + 2200) - now));
    }
    const relayout = () => { if (parked) return; layout(); draw(-1e9); kick(); };
    let rq = 0;
    const queueLayout = () => { if (!rq) rq = requestAnimationFrame(() => { rq = 0; relayout(); }); };
    const api = {
      cv, relayout, queueLayout,
      pointer(cx, cy, now) {
        if (parked || still()) return;
        const x = cx - ox, y = cy - (topDoc - (o.fixed ? 0 : scrollY));
        if (x < -40 || y < -40 || x > W + 40 || y > H + 40) { if (inside) { inside = false; kick(); } return; }
        px = x; py = y; inside = true; lastMove = now; kick();
      },
      leave() { if (inside) { inside = false; kick(); } },
      // Park (switched off, canvas cleared) or wake (measured afresh and drawn at once).
      park(on) {
        parked = on;
        if (on) { cancelAnimationFrame(rafId); rafId = 0; clearTimeout(wake); inside = false; open = 0; draw(-1e9); return; }
        layout(); draw(-1e9); schedule();
      }
    };
    if (!parked) { layout(); draw(-1e9); }
    if ('ResizeObserver' in window) new ResizeObserver(queueLayout).observe(host);
    else addEventListener('resize', queueLayout, {passive: true});
    // Text settles after the fonts load and after page-group entrances: measure again.
    (doc.fonts && doc.fonts.ready ? doc.fonts.ready : Promise.resolve()).then(queueLayout);
    setTimeout(queueLayout, 1100); setTimeout(queueLayout, 2400);
    fields.add(api);
    if (still()) return api;
    nextWave = performance.now() + 600;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(es => { seen = es[es.length - 1].isIntersecting; if (seen) { last = 0; kick(); } }).observe(cv);
    }
    doc.addEventListener('visibilitychange', () => { if (!doc.hidden) { last = 0; kick(); } });
    fieldPointers.add(api); listenPointer();
    kick();
    return api;
  }
  const fields = new Set();

  function headerField() {
    const found = findFieldHost();
    if (!found) return;
    const {host, tone} = found;
    // Body-hosted (the 404): <main> wears the same navy as the body; let the field show through it.
    if (found.body) { const m = doc.querySelector('main'); if (m && getComputedStyle(m).backgroundColor === getComputedStyle(host).backgroundColor) m.classList.add('hm-field-clear'); }
    // A header narrower than the screen (a centred column) still carries the field to both edges.
    const box = hr => {
      const vw = vwidth();
      return hr.width < vw - 2 ? {x: -hr.left, y: 0, w: vw, h: hr.height} : {x: 0, y: 0, w: hr.width, h: hr.height};
    };
    makeField(host, {tone, box, mask: 'column', gap: 24, fall: 200});
  }

  /* The footer band (desktop): two rows of marks along the footer's top edge, on the page's column grid, fullest at
     the outer edges and fading toward the footer's content. The words and controls at the foot of the section
     above count for the pointer rule too. */
  function footerField() {
    const foot = doc.querySelector('footer.footer');
    if (!foot || foot.closest(OFF)) return;
    const brand = () => foot.querySelector('.footer-brand img, .footer-brand, .container');
    const above = () => {
      let el = foot.previousElementSibling;
      while (el && !el.getClientRects().length) el = el.previousElementSibling;
      for (let i = 0; el && i < 3; i++) {
        const kids = [...el.children].filter(c => c.getClientRects().length && !/^(SCRIPT|STYLE|TEMPLATE|DIALOG)$/.test(c.tagName));
        if (!kids.length) break;
        el = kids[kids.length - 1];
        if (el.getBoundingClientRect().height < innerHeight * 2) break;
      }
      if (!el) return [];
      const top = foot.getBoundingClientRect().top;
      return scanKeep(el, null, {left: -1e9, right: 1e9, top: top - 200, bottom: top}).keep;
    };
    makeField(foot, {
      tone: 'foot', mask: 'box', gap: 24, fall: 160, rows: [32, 64], above,
      box: hr => ({x: 0, y: 0, w: vwidth() >= 1024 ? hr.width : 0, h: vwidth() >= 1024 ? 96 : 0}),   // desktop only
      anchor: brand
    });
  }

  /* ── 7. Smart nav. Scrolling down past 120px slides the nav away; any scroll up brings it back compact (18px
     shorter, 8px on phones; the bar stays solid navy and its contents re-centre). Near the top it is full height
     again. It never hides while focus is inside it, while the phone menu, a dropdown or the search is open, while a
     page is loading the next one, or under reduced motion. Sticky and fixed bars that sit under the nav (product
     section navs, tables of contents, toolbars, reading-progress lines) follow it up and down in step, so no gap
     ever opens above them; a tall full-width pinned panel keeps the nav where it is.
     Section navs: while one is pinned, the nav stays away unless the reader scrolls up more than 200px in one run
     (or back to the top), and an in-page jump to a place where it stays pinned keeps the nav away rather than
     bringing it back on the way. On these pages scroll-padding-top is the height of the bars actually on screen
     (the nav, if shown, plus a pinned section bar) and 16px, so a jump or a focused element never lands under them;
     under reduced motion (the nav always shown) the same holds. ── */
  const navCtl = {show() {}};
  function smartNav() {
    const nav = theNav();
    if (!nav || getComputedStyle(nav).position !== 'fixed') return;
    const menu = doc.querySelector('.mobile-menu'), menuEl = menu;
    const C = () => (vwidth() <= 760 ? 8 : 18);
    const REVEAL_PINNED = 200, PAD = 16;
    let state = 'rest', lastY = Math.max(0, scrollY), acc = 0, ticking = false;
    let followers = [], pins = [], sheet = null, jumping = false, jumpT = 0, padNow = '';

    // Sticky elements positioned against the nav: found from the stylesheets, re-declared to follow --hm-nav-lift.
    function findFollowers() {
      // Measured from the original offsets: the follow sheet and pin marks are cleared first.
      if (sheet) sheet.textContent = '';
      doc.querySelectorAll('[data-hm-pin]').forEach(el => el.removeAttribute('data-hm-pin'));
      const navH = nav.offsetHeight, rules = [];
      // Each rule with a top offset is kept with the @media conditions it sits in, so the follow rule applies exactly
      // where the original does (a top offset outside them would move an element that is not sticky or fixed).
      const walk = (list, conds) => { for (const r of list) {
        try {
          if (r.media && r.cssRules) { walk(r.cssRules, conds.concat(r.media.mediaText)); continue; }
          if (r.style && r.selectorText && r.style.top) rules.push([r, conds]);
          else if (r.cssRules && r.cssRules.length && !r.selectorText) continue;   // @supports, @layer, @container: left alone
        } catch (_) { /* unreadable rule */ }
      } };
      for (const s of doc.styleSheets) { if (s.ownerNode && s.ownerNode.id === 'hm-nav-follow') continue; try { walk(s.cssRules, []); } catch (_) { /* cross-origin sheet */ } }
      const els = new Set(), tall = new Set(), out = [];
      rules.forEach(([r, conds]) => {
        let list = [];
        try { list = [...doc.querySelectorAll(r.selectorText)]; } catch (_) { return; }
        const hits = list.filter(el => {
          if (nav.contains(el) || (menuEl && menuEl.contains(el))) return false;
          const cs = getComputedStyle(el), t = parseFloat(cs.top);
          if (!(t >= navH - 2 && t <= navH + 240)) return false;
          if (cs.position === 'sticky') return true;
          return cs.position === 'fixed' && el.getBoundingClientRect().height <= 160;   // a bar fixed under the nav
        });
        if (!hits.length) return;
        // A tall, wide pinned panel (a scroll story) is not moved: the nav simply stays while it is stuck.
        hits.forEach(el => { const b = el.getBoundingClientRect(); if (getComputedStyle(el).position === 'sticky' && b.height > innerHeight * 0.4 && b.width > vwidth() * 0.6) tall.add(el); else els.add(el); });
        const rule = `:is(${r.selectorText}):not([data-hm-pin]){top:max(0px, calc(${r.style.top} - var(--hm-nav-lift, 0px)))!important}`;
        out.push(conds.reduceRight((inner, c) => `@media ${c}{${inner}}`, rule));
      });
      tall.forEach(el => el.setAttribute('data-hm-pin', ''));
      followers = [...els]; pins = [...tall];
      if (!sheet) { sheet = make('style', {id: 'hm-nav-follow'}); doc.head.append(sheet); }
      sheet.textContent = out.join('\n');
    }
    // A pin held right under the nav is stuck while it sits exactly at its own sticky offset and is on screen; a pin
    // centred lower down (the home story) does not need the nav and does not hold it.
    const stuckPin = () => pins.some(el => {
      const b = el.getBoundingClientRect(), t = parseFloat(getComputedStyle(el).top);
      return t <= nav.offsetHeight + 40 && b.bottom > 0 && b.top < innerHeight && Math.abs(b.top - t) < 2;
    });
    // Section navs: the sticky followers. One is pinned while it sits at its own sticky offset (its follow animation,
    // a translate, set aside) and is on screen. A "bar" spans the content (a section nav across the page, or a phone
    // table of contents); a narrow sidebar table of contents pins too but covers nothing a jump lands on.
    const subnavs = () => followers.filter(el => getComputedStyle(el).position === 'sticky' && el.getClientRects().length);
    const isBar = el => el.getBoundingClientRect().width >= vwidth() * 0.5;
    const pinned = el => {
      const cs = getComputedStyle(el), b = el.getBoundingClientRect();
      const ty = parseFloat(String(cs.translate || '').split(' ')[1]) || 0;
      return b.bottom > 0 && b.top < innerHeight && Math.abs(b.top - ty - parseFloat(cs.top)) < 2;
    };
    const subPinned = () => subnavs().some(pinned);
    const navShown = s => (s === 'hidden' ? 0 : nav.offsetHeight - (s === 'compact' ? C() : 0));
    const setPad = (px) => {
      const list = subnavs();
      if (!list.length) return;
      const v = `${Math.round(px != null ? px : navShown(state) + list.filter(el => isBar(el) && pinned(el)).reduce((h, el) => h + el.offsetHeight, 0) + PAD)}px`;
      if (v !== padNow) { padNow = v; root.style.scrollPaddingTop = v; }   // written only when it changes
    };
    const lift = s => (s === 'hidden' ? nav.offsetHeight : s === 'compact' ? C() : 0);

    function apply(s) {
      if (s === state) return;
      const before = followers.map(el => el.getBoundingClientRect().top);
      state = s;
      root.style.setProperty('--hm-nav-c', `${C()}px`);
      nav.classList.toggle('hm-nav-compact', s !== 'rest');
      nav.classList.toggle('hm-nav-hidden', s === 'hidden');
      root.style.setProperty('--hm-nav-lift', `${lift(s)}px`);
      // Followers jump to their new place in layout at once and are carried there visually (translate only).
      followers.forEach((el, i) => {
        const d = before[i] - el.getBoundingClientRect().top;
        if (Math.abs(d) > 0.5 && el.animate) el.animate([{translate: `0 ${d}px`}, {translate: '0 0'}], {duration: s === 'hidden' ? 220 : 280, easing: s === 'hidden' ? 'cubic-bezier(.4,0,1,1)' : 'cubic-bezier(.2,.7,.2,1)'});
      });
      if (!jumping) setPad();
    }
    // Keyboard focus holds the nav (a button merely clicked with a mouse does not).
    const kbFocus = el => { try { return !!el && el.matches(':focus-visible'); } catch (_) { return !!el; } };
    const held = () => (nav.contains(doc.activeElement) && kbFocus(doc.activeElement)) || (menu && menu.classList.contains('is-open')) ||
      !!nav.querySelector('.nav-dropdown.is-open') || !!doc.querySelector('.cmdk:not([hidden])') ||
      root.classList.contains('hm-going') || stuckPin();
    function update() {
      ticking = false;
      const y = Math.max(0, scrollY), dy = y - lastY;
      lastY = y;
      if (calm) { apply('rest'); setPad(); return; }   // reduced motion: the nav simply stays
      if (jumping) { clearTimeout(jumpT); jumpT = setTimeout(endJump, 160); acc = 0; return; }
      if (y <= 64) { acc = 0; apply('rest'); return; }
      if (held()) { acc = 0; if (state === 'hidden') apply('compact'); if (stuckPin() && state !== 'rest') apply('rest'); return; }
      acc = (dy > 0) === (acc > 0) ? acc + dy : dy;
      const sub = subPinned();
      if (acc > 10 && y > 120) apply('hidden');
      else if (acc < (sub ? -REVEAL_PINNED : -10)) apply('compact');
      setPad();
    }
    // In-page jumps on a page with a section nav. If the section nav will be pinned where the jump lands, the nav goes
    // (and stays) away for the jump and the padding is the section bar alone; otherwise the padding allows for the
    // nav as well. The jump ends once the page has been still for 160ms.
    function endJump() { jumping = false; lastY = Math.max(0, scrollY); acc = 0; setPad(); }
    function plan(target) {
      const list = subnavs();
      if (!list.length) return;
      const tTop = target.getBoundingClientRect().top + scrollY;
      const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
      let barsAt = 0, pinAt = false;
      list.forEach(el => {
        const prev = el.previousElementSibling, par = el.parentElement;
        const natural = prev ? prev.getBoundingClientRect().bottom + scrollY : par.getBoundingClientRect().top + scrollY + (parseFloat(getComputedStyle(par).paddingTop) || 0);
        const end = par.getBoundingClientRect().bottom + scrollY;
        const dest = tTop - margin - (isBar(el) ? el.offsetHeight : 0) - PAD;
        if (natural <= dest + 2 && end >= dest + el.offsetHeight) { pinAt = true; if (isBar(el)) barsAt += el.offsetHeight; }
      });
      const hide = pinAt && !calm && !held();
      const navAt = hide ? 0 : nav.offsetHeight;
      setPad(navAt + barsAt + PAD);
      if (!hide) return;
      jumping = true; clearTimeout(jumpT); jumpT = setTimeout(endJump, 400);
      apply('hidden');
    }
    // Any other control in a pinned section nav (a view switcher, say) may scroll the page itself: its scroll is a
    // jump too, so the nav does not come back on the way.
    const inPinnedBar = t => !!t && subnavs().some(el => el.contains(t) && pinned(el));
    const holdJump = () => { if (calm) return; jumping = true; clearTimeout(jumpT); jumpT = setTimeout(endJump, 400); };
    doc.addEventListener('click', e => {
      const a = e.target && e.target.closest && e.target.closest('a[href*="#"]');
      if (a && e.button === 0 && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey &&
          a.origin === location.origin && a.pathname === location.pathname && a.search === location.search && a.hash.length > 1) {
        let t = null;
        try { t = doc.getElementById(decodeURIComponent(a.hash.slice(1))); } catch (_) { t = null; }
        if (t) { plan(t); return; }
      }
      if (inPinnedBar(e.target)) holdJump();
    }, true);
    doc.addEventListener('change', e => { if (inPinnedBar(e.target)) holdJump(); }, true);
    addEventListener('scroll', () => { if (!ticking) { ticking = true; raf(update); } }, {passive: true});
    nav.addEventListener('focusin', e => { if (state === 'hidden' && kbFocus(e.target)) apply('compact'); });
    navCtl.show = () => { if (state === 'hidden' || (state === 'compact' && scrollY <= 64)) apply(scrollY > 64 ? 'compact' : 'rest'); };
    navCtl.rest = () => apply('rest');
    idle(() => {
      try { findFollowers(); } catch (_) { followers = []; }
      setPad();
      // Arriving (or reloading) part-way down a page whose section nav is pinned: the nav starts away.
      if (!calm && scrollY > 120 && subPinned() && !held()) apply('hidden');
    });
    let rs = 0;
    addEventListener('resize', () => { clearTimeout(rs); rs = setTimeout(() => { try { findFollowers(); } catch (_) { /* keep the last set */ } root.style.setProperty('--hm-nav-c', `${C()}px`); setPad(); }, 200); }, {passive: true});
    new MutationObserver(() => { if (root.classList.contains('hm-going')) navCtl.show(); }).observe(root, {attributes: true, attributeFilter: ['class']});
    if (!calm && scrollY > 120) apply('compact');
  }

  /* ── 8. Phone menu. The menu (opened and closed by app.js, whose behaviour and ARIA stay as they are) becomes a
     full-screen navy sheet, uncovered from under the nav in 180ms while its lines settle into place 8ms apart
     (house-motion.css); the footer's email and telephone are cloned in under the call-to-action, and a faint "+"
     field fills the open space between the links and the call-to-action, drawn as the sheet opens. The current
     page's line carries aria-current="page" (and a gold bar, signature.css), not colour alone. While it is open:
     focus is trapped between the close button and the menu, Escape closes it (app.js), the page behind is inert,
     and the page cannot scroll. ── */
  function phoneMenu() {
    const menu = doc.querySelector('.mobile-menu'), toggle = doc.querySelector('.nav-toggle'), nav = theNav();
    if (!menu || !toggle) return;
    menu.classList.add('hm-sheet');
    // The footer's own email and telephone lines, cloned as they are (same words, same links).
    const foot = doc.querySelector('footer.footer');
    const lines = foot ? ['a[href^="mailto:"]', 'a[href^="tel:"]'].map(q => foot.querySelector(q)).filter(Boolean) : [];
    if (lines.length && !menu.querySelector('.hm-menu-contact')) {
      const box = make('div', {class: 'hm-menu-contact'});
      lines.forEach(a => { const c = a.cloneNode(true); c.removeAttribute('id'); box.append(c); });
      menu.append(box);
    }
    const kids = () => [...menu.children].filter(el => el.tagName !== 'CANVAS');
    kids().forEach((el, i) => el.style.setProperty('--hm-i', i));
    // The current page: app.js marks it .is-active; say so to assistive technology as well.
    const markCurrent = () => menu.querySelectorAll(':scope > a.is-active').forEach(a => { if (!a.hasAttribute('aria-current')) a.setAttribute('aria-current', 'page'); });
    markCurrent();
    if (doc.readyState !== 'complete') addEventListener('load', markCurrent, {once: true});
    // The field: only in the open space between the last link and the call-to-action (measured without the rise
    // transforms, so it is right from the first frame).
    const cta = menu.querySelector('.mobile-cta');
    const field = makeField(menu, {
      tone: 'menu', fixed: true, parked: true, mask: 'keep', gap: 22, fall: 44,
      anchor: () => menu.querySelector('a'),
      measure: () => {
        const mr = menu.getBoundingClientRect(), keep = [];
        kids().forEach(el => {
          const l = mr.left + el.offsetLeft, t = mr.top + el.offsetTop - menu.scrollTop;
          keep.push({left: l, top: t, right: l + el.offsetWidth, bottom: t + el.offsetHeight});
        });
        // Nothing above the last link's lower edge and nothing below the call-to-action's top: the gap between only.
        const links = kids().filter(el => el !== cta && !el.classList.contains('hm-menu-contact'));
        const lastL = links[links.length - 1];
        if (lastL) keep.push({left: mr.left, top: mr.top, right: mr.right, bottom: mr.top + lastL.offsetTop + lastL.offsetHeight - menu.scrollTop});
        if (cta) keep.push({left: mr.left, top: mr.top + cta.offsetTop - menu.scrollTop, right: mr.right, bottom: mr.bottom});
        return {keep, imgs: [], panels: []};
      }
    });

    let isOpen = false, inerted = [], fieldTimer = 0;
    const focusables = () => [toggle, ...menu.querySelectorAll('a[href], button:not([disabled])')].filter(el => el.offsetParent !== null || el === toggle);
    function trap(e) {
      if (e.key !== 'Tab' || !isOpen || e.defaultPrevented) return;
      const items = focusables(), first = items[0], lastI = items[items.length - 1];
      const a = doc.activeElement;
      if (a && a.closest && a.closest('.cmdk')) return;
      if (!items.includes(a)) { e.preventDefault(); (e.shiftKey ? lastI : first).focus(); return; }
      if (e.shiftKey && a === first) { e.preventDefault(); lastI.focus(); }
      else if (!e.shiftKey && a === lastI) { e.preventDefault(); first.focus(); }
    }
    doc.addEventListener('keydown', trap);
    doc.addEventListener('focusin', e => {
      if (!isOpen || menu.contains(e.target) || e.target === toggle || (e.target.closest && e.target.closest('.cmdk'))) return;
      if (nav && nav.contains(e.target)) return;   // the nav's own controls stay reachable by pointer
      toggle.focus();
    });
    function sync() {
      const open = menu.classList.contains('is-open');
      if (open === isOpen) return;
      isOpen = open;
      root.classList.toggle('hm-menu-open', open);
      clearTimeout(fieldTimer);
      if (open) {
        markCurrent();
        navCtl.rest && navCtl.rest();
        menu.scrollTop = 0;
        inerted = [...doc.body.children].filter(el => el !== menu && !el.contains(menu) && !(nav && el.contains(nav)) &&
          !/^(SCRIPT|STYLE|TEMPLATE|NOSCRIPT|LINK)$/.test(el.tagName) && !el.classList.contains('cmdk') && !el.inert);
        inerted.forEach(el => { el.inert = true; });
        if (field) raf(() => field.park(false));
      } else {
        inerted.forEach(el => { el.inert = false; });
        inerted = [];
        if (field) fieldTimer = setTimeout(() => field.park(true), 260);
      }
    }
    new MutationObserver(sync).observe(menu, {attributes: true, attributeFilter: ['class']});
    sync();
  }

  /* ── 9. The footer statement never ends on a single stranded word: its last two words share a nowrap span
     (.hm-nw, signature.css). The words themselves are unchanged. ── */
  function footerGlue() {
    doc.querySelectorAll('footer .footer-brand p').forEach(p => {
      if (p.querySelector('.hm-nw')) return;
      const tw = doc.createTreeWalker(p, NodeFilter.SHOW_TEXT);
      let t = null;
      while (tw.nextNode()) if (tw.currentNode.data.trim()) t = tw.currentNode;
      const m = t && t.data.match(/\S+\s+\S+\s*$/);
      if (!m) return;
      const tail = t.splitText(t.data.length - m[0].length), span = make('span', {class: 'hm-nw'});
      tail.parentNode.insertBefore(span, tail);
      span.append(tail);
    });
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
  safe(headerField);
  safe(footerField);
  safe(smartNav);
  safe(phoneMenu);
  safe(footerGlue);
  addEventListener('beforeprint', finishAll);
  addEventListener('hashchange', finishAll);
  mqCalm.addEventListener && mqCalm.addEventListener('change', () => {
    calm = mqCalm.matches;
    if (calm) { finishAll(); root.classList.remove('hm-on', 'hm-going', 'hm-arrive'); }
  });
})();
