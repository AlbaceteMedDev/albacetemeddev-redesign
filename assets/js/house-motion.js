/* House motion layer, Minimal v7: one calm, smooth motion vocabulary shared by every page. See HOUSE-STYLE.md
   ("Minimal v7"). One easing everywhere (cubic-bezier(.22,.61,.36,1)); entrances are 600ms fade-ups of at most 12px,
   staggered at most 60ms; hovers are 200ms colour changes; page changes fade out, then in, 250ms each.
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
  let calm = mqCalm.matches;
  const OFF = '[data-motion-off]';
  const GROUP = '.sx-reveal, .scroll-reveal';
  const isShown = el => el.classList.contains('is-in') || el.classList.contains('is-visible');
  const raf = fn => requestAnimationFrame(fn);
  const EASE = 'cubic-bezier(.22,.61,.36,1)';   // the one v7 easing (house-motion.css: --hm-ease)
  const idle = fn => ('requestIdleCallback' in window ? requestIdleCallback(fn, {timeout: 600}) : setTimeout(fn, 60));
  const make = (tag, attrs) => { const el = doc.createElement(tag); if (attrs) for (const k in attrs) el.setAttribute(k, attrs[k]); return el; };
  const rgba = s => {
    const m = String(s).match(/[\d.]+/g);
    if (!m) return null;
    const k = /^color\(srgb/.test(String(s)) ? 255 : 1;   // color-mix() and relative colours compute to color(srgb 0-1 …)
    return {r: m[0] * k, g: m[1] * k, b: m[2] * k, a: m[3] === undefined ? 1 : +m[3]};
  };
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

  /* ── 0. Surfaces (Minimal v7). Labels, primary buttons and focus rings take their colours from surface tokens
     (signature.css, "Surface tokens"): light by default, navy on the blocks listed there. This pass finds the block
     each label, button and link actually sits on (its nearest opaque background) and, where that block's background
     disagrees with the tokens it inherits, tags it: .v7-dark on navy, .v7-lightsurf on light. Outer blocks are
     settled before the blocks inside them. Not motion: it runs under reduced motion too. ── */
  const SURF_TARGETS = 'a[href], button, [class*="eyebrow"], [class*="kicker"], .hero-chip, .section-label, .sx-label, .v7-label';
  function surfaces() {
    const blocks = new Set();
    doc.querySelectorAll(SURF_TARGETS).forEach(t => {
      for (let n = t.parentElement; n && n !== root; n = n.parentElement) {
        const c = rgba(getComputedStyle(n).backgroundColor);
        if (c && c.a >= 0.9) { blocks.add(n); return; }
      }
    });
    const depth = el => { let d = 0; for (let n = el; n; n = n.parentElement) d++; return d; };
    [...blocks].sort((a, b) => depth(a) - depth(b)).forEach(n => {
      const cs = getComputedStyle(n);
      const want = lum(rgba(cs.backgroundColor)) < 0.35 ? 'dark' : 'light';
      if (cs.getPropertyValue('--v7-surface').trim() !== want) n.classList.add(want === 'dark' ? 'v7-dark' : 'v7-lightsurf');
    });
  }

  /* ── 1. Page transitions. The sequence itself is CSS (out 250ms, then in 250ms; the nav cuts once). Here, the
     thin line under the nav while a slow next page loads. It shows only after 400ms, so a quick change never
     flashes it, and the incoming page simply fades in: nothing flashes on arrival. ── */
  function transitions() {
    const nav = doc.querySelector('.nav');
    const bar = nav ? make('hm-bar', {'aria-hidden': 'true'}) : null;
    if (bar) nav.append(bar);
    let timer = 0;
    const reset = () => { clearTimeout(timer); root.classList.remove('hm-going'); };
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
    addEventListener('pageshow', e => { if (e.persisted) reset(); });
  }

  /* ── 2. Hover vocabulary. Each button is read once at rest and given its hover colours; the change itself is
     CSS (whole button, 200ms, colour only). Arrow glyphs are wrapped (hm-arw, inline-block) so a text link's
     underline runs under its words, not its arrow; they no longer move. The v7 primary and secondary buttons take
     their colours from signature.css ("Minimal v7"), which outranks these. Nav and footer links are plain CSS. ── */
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
  // fill: #1b3a5c. No fill (a v7 text link or an outline): stays clear, colour only. Any other fill: 12% of the label.
  // The edge follows the fill when the border was the fill's own colour; otherwise it keeps its resting colour.
  function hoverColours(el) {
    const cs = getComputedStyle(el);
    const bg = rgba(cs.backgroundColor), ink = rgba(cs.color) || {r: 22, g: 33, b: 46, a: 1};
    const edge = rgba(cs.borderTopColor);
    const hasBorder = parseFloat(cs.borderTopWidth) > 0 && edge && edge.a > 0.05;
    let hover, label = css(ink);
    if (!bg || bg.a < 0.2) hover = 'transparent';
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
     inline box, the words of one visual line fade in together while they rise 12px, 600ms, lines 60ms apart (at
     most two steps), so a headline is complete in about 720ms. Lines are measured after the fonts load and again
     on resize. A heading whose layout the split would change, or that sits against a clipping edge, is left alone.
     After the reveal the original markup returns. ── */
  const HEAD_SKIP = '.sx-rise, .sx-hero, dialog, [hidden], [aria-hidden="true"], .mobile-menu, nav, footer';
  const HL_MS = 600, HL_STEP = 60;
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

  /* ── 5. Images, below the fold only. Every image fades up 12px over 600ms on the v7 easing: no clip, no scale,
     no curtain. Nothing is ever held behind a block: an image that is still loading when it comes into view fades
     in when it arrives. ── */
  const IMG_MS = 600, IMG_RISE = 12;
  const IMG_SKIP = '[class*="logo"], [class*="identity"], .nav, footer, dialog, [aria-hidden="true"], [hidden], .mobile-menu';
  const loaded = img => img.complete && img.naturalWidth > 0;
  function images() {
    const plan = [];
    doc.querySelectorAll('main img').forEach(img => {
      if (img.closest(OFF) || img.closest(IMG_SKIP) || /\.svg(\?|$)/i.test(img.currentSrc || img.src)) return;
      const r = img.getBoundingClientRect();
      if (r.width < 48 || r.height < 48 || inFirstView(img)) return;
      plan.push(img);
    });
    plan.forEach(img => {
      img.classList.add('hm-fade');
      let anim = null;
      const finish = () => {
        if (anim) anim.cancel();
        img.classList.add('hm-shown');
        img.classList.remove('reveal');
      };
      const fade = delay => {
        img.classList.add('hm-shown');
        if (!img.animate) return;
        anim = img.animate([{opacity: 0, translate: `0 ${IMG_RISE}px`}, {opacity: 1, translate: '0 0'}],
          {duration: IMG_MS, delay, easing: EASE, fill: 'backwards'});
      };
      arm(img, {
        play(delay) {
          if (!loaded(img)) {
            // Still loading: no block, no wait. It fades in when it arrives.
            img.addEventListener('load', () => fade(0), {once: true});
            img.addEventListener('error', finish, {once: true});
            return;
          }
          fade(delay);
        },
        finish
      });
    });
  }

  /* ── 6. The "+" field is retired everywhere (Minimal v7.1): no page header, footer, phone menu or home hero draws
     marks. ── */
  const vwidth = () => doc.documentElement.clientWidth || innerWidth;
  const theNav = () => doc.querySelector('.nav');

  /* ── 7. Smart nav. Scrolling down past 120px slides the nav away; any scroll up brings it back compact (12px
     shorter, 6px on phones; the bar stays solid navy and its contents re-centre). Near the top it is full height
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
    const C = () => (vwidth() <= 760 ? 6 : 12);
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
        if (Math.abs(d) > 0.5 && el.animate) el.animate([{translate: `0 ${d}px`}, {translate: '0 0'}], {duration: 320, easing: EASE});   // in step with the nav (house-motion.css)
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
     full-screen navy sheet uncovered from under the nav over 320ms while its lines rise 12px into place 20ms apart
     (house-motion.css); the footer's email and telephone are cloned in under the call-to-action. The current
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
    [...menu.children].forEach((el, i) => el.style.setProperty('--hm-i', i));
    // The current page: app.js marks it .is-active; say so to assistive technology as well.
    const markCurrent = () => menu.querySelectorAll(':scope > a.is-active').forEach(a => { if (!a.hasAttribute('aria-current')) a.setAttribute('aria-current', 'page'); });
    markCurrent();
    if (doc.readyState !== 'complete') addEventListener('load', markCurrent, {once: true});
    let isOpen = false, inerted = [];
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
      if (open) {
        markCurrent();
        navCtl.rest && navCtl.rest();
        menu.scrollTop = 0;
        inerted = [...doc.body.children].filter(el => el !== menu && !el.contains(menu) && !(nav && el.contains(nav)) &&
          !/^(SCRIPT|STYLE|TEMPLATE|NOSCRIPT|LINK)$/.test(el.tagName) && !el.classList.contains('cmdk') && !el.inert);
        inerted.forEach(el => { el.inert = true; });
      } else {
        inerted.forEach(el => { el.inert = false; });
        inerted = [];
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

  /* ── 10. Sentences in headings (Minimal v7.1). An h1 or h2 of two or more sentences breaks between them rather
     than inside one: each sentence goes into an hm-s box (signature.css: inline-block, balanced), which keeps it
     whole on its line where it fits and balances it where it cannot (phones). An element that spans a sentence
     boundary is split with it, so its styling carries over; the words and their order are unchanged. A heading whose
     sentences are already block-level lines, or that a page script splits into words, is left alone.
     No stranded word: in every h1 and h2 of the page body, the last two words of each sentence (of three words or
     more) share an hm-g box that does not break, so a line never holds a sentence's last word alone; the hero's lead
     paragraph ends the same way. Where the pair
     is wider than the heading (a narrow phone column) the box lets go (.hm-g-off) and balance decides; this is
     checked again once the fonts arrive and on resize. Not motion: it runs under reduced motion too, and before the
     headline reveal measures anything. ── */
  const SENT = /[.!?…]["”’')\]]*(\s+)(?=["“‘(]?[A-Z0-9])/g;
  const nodeLen = n => (n.nodeType === 3 ? n.data.length : n.childNodes.length);
  // Wrap the characters [a, b) of el's text (trimmed) in a new element; a range that starts or ends at an element's
  // edge takes the whole element. el's text is unchanged, so other offsets into it stay true.
  function wrapText(el, a, b, tag) {
    const text = el.textContent;
    while (a < b && /\s/.test(text[a])) a++;
    while (b > a && /\s/.test(text[b - 1])) b--;
    if (a >= b) return null;
    const point = (off, isEnd) => {
      const tw = doc.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      let n = 0;
      while (tw.nextNode()) {
        const t = tw.currentNode, len = t.data.length;
        if (isEnd ? off <= n + len : off < n + len) return [t, off - n];
        n += len;
      }
      return null;
    };
    const s = point(a, false), e = point(b, true);
    if (!s || !e) return null;
    const r = doc.createRange();
    r.setStart(s[0], s[1]);
    r.setEnd(e[0], e[1]);
    while (r.startOffset === 0 && r.startContainer !== el) r.setStartBefore(r.startContainer);
    while (r.endOffset === nodeLen(r.endContainer) && r.endContainer !== el) r.setEndAfter(r.endContainer);
    const box = make(tag);
    box.append(r.extractContents());
    r.insertNode(box);
    return box;
  }
  const glued = new Set();
  function sentences() {
    doc.querySelectorAll('main h1, main h2').forEach(h => {
      if (h.closest('nav, footer, .mobile-menu, dialog, [contenteditable]')) return;
      // never split a link, a control or an element with an id (a split element is cloned)
      if (h.querySelector('hm-s, hm-g, a, input, button, select, textarea, img, svg, [id], [class*="word"], [class*="char"]')) return;
      const kids = [...h.children];
      const lined = kids.length && kids.every(k => getComputedStyle(k).display === 'block') &&
        ![...h.childNodes].some(n => n.nodeType === 3 && n.data.trim());
      if (lined) return; // already set line by line (the home hero)
      const text = h.textContent;
      const cuts = [];
      SENT.lastIndex = 0;
      for (let m; (m = SENT.exec(text));) cuts.push([m.index + m[0].length - m[1].length, m.index + m[0].length]);
      if (cuts.length) {
        const segs = [];
        let from = 0;
        cuts.forEach(([a, b]) => { segs.push([from, a]); from = b; });
        segs.push([from, text.length]);
        for (let i = segs.length - 1; i >= 0; i--) wrapText(h, segs[i][0], segs[i][1], 'hm-s');
      }
      // the last two words of each sentence travel together
      const units = cuts.length ? [...h.querySelectorAll('hm-s')] : [h];
      units.forEach(u => {
        const t = u.textContent, m = t.match(/\S+\s+\S+\s*$/);
        if (!m || t.trim().split(/\s+/).length < 3) return;
        const g = wrapText(u, m.index, t.length, 'hm-g');
        if (g) glued.add(g);
      });
      h.normalize();
    });
    // The hero's lead paragraph (the first paragraph after the page headline) ends the same way.
    const h1 = doc.querySelector('main h1');
    const lead = h1 && h1.parentElement && [...h1.parentElement.children].find(el => el.tagName === 'P' &&
      (h1.compareDocumentPosition(el) & Node.DOCUMENT_POSITION_FOLLOWING));
    if (lead && !lead.querySelector('hm-g, a, button, input, img, svg, [id]')) {
      const t = lead.textContent, m = t.match(/\S+\s+\S+\s*$/);
      if (m && t.trim().split(/\s+/).length >= 4) { const g = wrapText(lead, m.index, t.length, 'hm-g'); if (g) glued.add(g); }
    }
    if (!glued.size) return;
    // Let a pair go where it is wider than its heading; take it back where it fits again.
    const fit = () => {
      const list = [...glued].filter(g => g.isConnected);
      list.forEach(g => g.classList.remove('hm-g-off'));
      const plan = list.map(g => {
        const h = g.closest('h1, h2, p'), cs = getComputedStyle(h);
        const room = h.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
        return [g, g.getBoundingClientRect().width > room + 0.5];
      });
      plan.forEach(([g, off]) => { if (off) g.classList.add('hm-g-off'); });
    };
    fit();
    // Web fonts change the widths: measure again when they arrive (ready can settle before they start loading).
    (doc.fonts && doc.fonts.ready ? doc.fonts.ready : Promise.resolve()).then(() => raf(fit));
    if (doc.fonts && doc.fonts.addEventListener) doc.fonts.addEventListener('loadingdone', () => raf(fit));
    addEventListener('load', () => raf(fit), {once: true});
    let ft = 0, fw = innerWidth;
    addEventListener('resize', () => {
      if (innerWidth === fw) return;
      fw = innerWidth; clearTimeout(ft); ft = setTimeout(fit, 120);
    }, {passive: true});
  }

  /* ── 11. Text links (Minimal v7.1). A secondary action's underline runs under its words only: the words beside an
     arrow go into an hm-t box (or, already in their own element, are tagged .hm-t), which signature.css V4
     underlines while the link itself carries none; the arrow, an hm-arw box, stands 8px off. The glyph follows the
     destination where one is already there: → inside the site, ↗ to another site. ── */
  const SECONDARY = '.btn-secondary, .btn-ghost, .cx-btn-ghost, .sx-btn-ghost, .v7-link';
  const offSite = a => { try { const u = new URL(a.href, location.href); return /^https?:$/.test(u.protocol) && u.host !== location.host; } catch (e) { return false; } };
  function textLinks() {
    doc.querySelectorAll(SECONDARY).forEach(el => {
      if (el.querySelector(':scope > :is(hm-t, .hm-t)')) return;
      markArrow(el);
      const arw = [...el.children].find(c => c.classList.contains('hm-arw'));
      if (!arw) return;
      const g = arw.textContent.trim();
      if (el.matches('a[href]') && (g === '→' || g === '↗')) {
        const want = offSite(el) ? '↗' : '→';
        if (g !== want) arw.textContent = want;
      }
      const rest = [...el.childNodes].filter(n => n !== arw);
      const solid = n => !(n.nodeType === 3 && !n.data.trim()) && n.nodeType !== 8;
      const first = rest.findIndex(solid);
      if (first < 0) return;
      let last = rest.length - 1;
      while (!solid(rest[last])) last--;
      const words = rest.slice(first, last + 1);
      if (words.length === 1 && words[0].nodeType === 1) { words[0].classList.add('hm-t'); return; }
      const t = make('hm-t');
      words[0].before(t);
      t.append(...words);
    });
  }

  /* ── Start ─────────────────────────────────────────────────────────── */
  const safe = fn => { try { fn(); } catch (err) { if (window.console) console.warn('house-motion:', err); } };
  safe(sentences);
  safe(surfaces);
  safe(transitions);
  safe(hovers);
  safe(textLinks);
  idle(() => safe(underlines));
  if (!calm && io) {
    root.classList.add('hm-on');
    safe(headings);
    safe(images);
  }
  safe(smartNav);
  safe(phoneMenu);
  safe(footerGlue);
  addEventListener('beforeprint', finishAll);
  addEventListener('hashchange', finishAll);
  mqCalm.addEventListener && mqCalm.addEventListener('change', () => {
    calm = mqCalm.matches;
    if (calm) { finishAll(); root.classList.remove('hm-on', 'hm-going'); }
  });
})();
