/* House motion layer, Model v8: one calm, smooth motion vocabulary shared by every page. See HOUSE-STYLE.md
   ("Model v8"). One easing everywhere (cubic-bezier(.22,.61,.36,1)); entrances are 600ms fade-ups of at most 12px,
   staggered at most 60ms; hovers are 150ms colour changes (cards: a 3% image settle, house-motion.css); carousels
   slide 450ms and never play by themselves; page changes fade out, then in, 250ms each. Model v8 also builds the
   desktop utility bar above the nav (11) and the carousel controls (12).
   Progressive only. Nothing is hidden without this file: every hidden state is gated on html.hm-on, which is set
   here and never under prefers-reduced-motion. Elements inside [data-motion-off] are left alone. Content inside a
   page-group reveal block (.sx-reveal / .scroll-reveal) starts when that block reveals, so the two read as one
   entrance instead of two. Adding .is-in to an armed element reveals it at once (print, hash jumps and tools).
   Nothing in the first viewport is ever armed: what is on screen at load is on screen at first paint.
   Futurist v9 ("precision instrument") adds, on the same rules: scan reveals on content photos (5), panel depth
   tags (13), mono index tags (14), band hairline tags (15), the nav's sliding hover rail (16) and 3px arrow
   nudges on the house buttons and links (2). */
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
  // Scan reveals start a little later than other entrances (the image's top 15% into the screen), so the pass is
  // seen rather than finished below the fold.
  const scanIO = io ? new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) trigger(e.target); }),
    {rootMargin: '0px 0px -15% 0px'}) : null;
  function unwatch(el) { if (io) io.unobserve(el); if (scanIO) scanIO.unobserve(el); }
  function arm(el, job, obs) {
    armed.set(el, job);
    el.classList.add('reveal'); // shared hook: tooling that adds .is-in to .reveal shows it at once
    classWatch.observe(el, {attributes: true, attributeFilter: ['class']});
    const block = el.parentElement && el.parentElement.closest(GROUP);
    if (block && !isShown(block)) {
      if (!waiting.has(block)) { waiting.set(block, []); classWatch.observe(block, {attributes: true, attributeFilter: ['class']}); }
      waiting.get(block).push(el);
      chained.add(el);
    } else if (io) (obs || io).observe(el);
    else job.finish();
  }
  function finishAll() {
    armed.forEach((job, el) => { unwatch(el); job.finish(); });
    armed.clear(); waiting.clear(); queue = [];
  }
  // Anchor jumps (B5, Oct 15): nothing above a jump target, or within a screen below its top, is ever left armed.
  // The line is measured in page coordinates, so it holds whether the browser scrolls to the target before or after
  // this file runs.
  const hashTarget = (hash = location.hash) => {
    const h = String(hash || '').slice(1);
    if (!h) return null;
    let id = h; try { id = decodeURIComponent(h); } catch (_) { /* keep it raw */ }
    return doc.getElementById(id) || doc.getElementsByName(id)[0] || null;
  };
  const pageTop = el => el.getBoundingClientRect().top + scrollY;
  const lineFor = t => (t ? pageTop(t) + innerHeight : -Infinity);
  let loadLine = null;
  const hashLine = () => (loadLine === null ? (loadLine = lineFor(hashTarget())) : loadLine);
  function finishAbove(line) {
    if (!(line > -Infinity)) return;
    armed.forEach((job, el) => { if (pageTop(el) < line) { armed.delete(el); unwatch(el); job.finish(); } });
  }
  // Any part of it inside the viewport (or above it) at start, or above the line of the page's #target: never armed.
  const inFirstView = el => el.getBoundingClientRect().top < innerHeight || pageTop(el) < hashLine();
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

  /* ── 5. Images, below the fold only (Futurist v9). A content photo 240px wide or more is unmasked left to right
     in 700ms on the house easing, a 1px scan line in the surface's focus colour travelling with the edge, once; a
     smaller image only fades (500ms). No curtain over text, no scale. Nothing is ever held behind a block: an image
     still loading when it comes into view is revealed when it arrives. Hero carousel slides are never armed (the
     home page owns them). ── */
  const SCAN_MS = 700, SCAN_MIN = 240, FADE_MS = 500;
  const IMG_SKIP = '[class*="logo"], [class*="identity"], .nav, footer, dialog, [aria-hidden="true"], [hidden], .mobile-menu, [data-m8-carousel="hero"]';
  const loaded = img => img.complete && img.naturalWidth > 0;
  // The scan line: a temporary 1px sibling laid over the image's box (same containing block, so it moves with it),
  // inset by the image's corner radius, gone when the pass ends.
  function scanLine(img, opts) {
    const anchor = img.parentElement && img.parentElement.tagName === 'PICTURE' ? img.parentElement : img;
    const host = anchor.parentElement;
    const w = img.offsetWidth, h = img.offsetHeight;
    const op = img.offsetParent;
    // a static table cell can be an offsetParent without being the containing block: no line there
    if (!host || w < 2 || h < 2 || !op || (op !== doc.body && getComputedStyle(op).position === 'static')) return null;
    const cs = getComputedStyle(img);
    const ln = make('hm-scan', {'aria-hidden': 'true'});
    const c = getComputedStyle(host).getPropertyValue('--v7-focus').trim();
    if (c) ln.style.setProperty('--hm-scan-c', c);
    if (cs.position !== 'static' && cs.zIndex !== 'auto') ln.style.setProperty('--hm-scan-z', cs.zIndex);
    ln.style.cssText += ';left:0;top:0;height:0';
    anchor.after(ln);
    if (ln.offsetParent !== op) { ln.remove(); return null; }
    const r = Math.min(parseFloat(cs.borderTopRightRadius) || 0, h / 3);
    ln.style.left = `${img.offsetLeft}px`;
    ln.style.top = `${img.offsetTop + r}px`;
    ln.style.height = `${Math.max(0, h - 2 * r)}px`;
    // Positions are linear in the eased progress, so the line stays on the clip edge for the whole pass.
    const x = p => `translate3d(${(p * (w - 1)).toFixed(1)}px,0,0)`;
    const a = ln.animate([
      {transform: x(0), opacity: 0, offset: 0}, {transform: x(.06), opacity: 1, offset: .06},
      {transform: x(.72), opacity: 1, offset: .72}, {transform: x(1), opacity: 0, offset: 1}], {...opts, fill: 'both'});
    a.onfinish = a.oncancel = () => ln.remove();
    return a;
  }
  // A fully clipped image never starts its own lazy load (the browser sees nothing of it), so armed lazy images are
  // switched to eager loading once they come within the browser's usual lazy-load distance.
  const nearIO = 'IntersectionObserver' in window
    ? new IntersectionObserver(entries => entries.forEach(e => { if (e.isIntersecting) { e.target.loading = 'eager'; nearIO.unobserve(e.target); } }),
      {rootMargin: '1250px'}) : null;
  function images() {
    const plan = [];
    doc.querySelectorAll('main img').forEach(img => {
      if (img.closest(OFF) || img.closest(IMG_SKIP) || /\.svg(\?|$)/i.test(img.currentSrc || img.src)) return;
      const r = img.getBoundingClientRect();
      if (r.width < 48 || r.height < 48 || inFirstView(img)) return;
      plan.push([img, r.width >= SCAN_MIN]);
    });
    plan.forEach(([img, wide]) => {
      img.classList.add(wide ? 'hm-scan' : 'hm-fade0');
      if (img.loading === 'lazy' && !loaded(img) && nearIO) nearIO.observe(img);
      let anims = [];
      const finish = () => {
        anims.forEach(a => a && a.cancel());
        anims = [];
        img.classList.add('hm-shown');
        img.classList.remove('reveal');
      };
      const show = delay => {
        img.classList.add('hm-shown');
        if (!img.animate) return;
        if (!wide) {
          anims = [img.animate([{opacity: 0}, {opacity: 1}], {duration: FADE_MS, delay, easing: EASE, fill: 'backwards'})];
          return;
        }
        const opts = {duration: SCAN_MS, delay, easing: EASE, fill: 'backwards'};
        anims = [img.animate([{clipPath: 'inset(0 100% 0 0)'}, {clipPath: 'inset(0 0% 0 0)'}], opts), scanLine(img, opts)];
      };
      arm(img, {
        play(delay) {
          if (!loaded(img)) {
            // Still loading: no block, no wait. It is revealed when it arrives.
            if (img.loading === 'lazy') img.loading = 'eager';
            img.addEventListener('load', () => show(0), {once: true});
            img.addEventListener('error', finish, {once: true});
            return;
          }
          show(delay);
        },
        finish
      }, wide ? scanIO : null);
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
    // Compact lifts the bar 12px (6px on phones) plus the utility bar's reserved height (desktop), so only the
    // main row shows on the way back up.
    const U = () => parseFloat(getComputedStyle(root).getPropertyValue('--m8-util-h')) || 0;
    const C = () => (vwidth() <= 760 ? 6 : 12) + U();
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
      !!nav.querySelector('.nav-dropdown.is-open, .nav-dd.is-open') || !!doc.querySelector('.cmdk:not([hidden])') ||
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
     paragraph ends the same way. Where the pair is wider than the heading (a narrow phone column), or where keeping
     it would leave the heading's first line holding one word alone, the heading's boxes let go (.hm-g-off) and
     balance decides; this is checked again once the fonts arrive and on resize. Not motion: it runs under reduced motion too, and before the
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
  // True when el's first line holds a single word and more words follow on later lines.
  function loneFirst(el) {
    const tw = doc.createTreeWalker(el, NodeFilter.SHOW_TEXT), r = doc.createRange(), tops = [];
    while (tw.nextNode()) {
      const t = tw.currentNode, re = /\S+/g;
      for (let m; (m = re.exec(t.data));) {
        r.setStart(t, m.index); r.setEnd(t, m.index + m[0].length);
        const b = r.getClientRects()[0];
        if (b) tops.push([b.top, b.height]);
        if (tops.length > 2) break;
      }
      if (tops.length > 2) break;
    }
    if (tops.length < 2) return false;
    const [t0, h0] = tops[0];
    return Math.abs(tops[1][0] - t0) > h0 / 2;
  }
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
      // A heading (or its lead) never opens with one word alone on its first line: where a glued pair would push
      // every word but the first down a line (a phone column), the heading's pairs let go and balance decides.
      new Set(list.filter(g => !g.classList.contains('hm-g-off')).map(g => g.closest('h1, h2, p'))).forEach(h => {
        if (h && [h, ...h.querySelectorAll('hm-s')].some(loneFirst)) h.querySelectorAll('hm-g').forEach(g => g.classList.add('hm-g-off'));
      });
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

  /* ── 11. Utility bar (Model v8). A thin bar above the nav on desktop, built from links already on the page, with
     their own words and destinations: Provider portal and Ovena Health (from the phone menu), Contact (from the
     footer's Company column) and the telephone (from the footer). signature.css reserves its 36px on html.sx-js (set
     in every page's head), so nothing moves when it arrives; at 1100px and under it is hidden (the phone menu
     carries the same links). The current page is marked with aria-current, not colour alone. ── */
  function utilityBar() {
    const nav = theNav();
    if (!nav || nav.querySelector('.m8-util')) return;
    const menu = doc.querySelector('.mobile-menu'), foot = doc.querySelector('footer.footer');
    const byText = (scope, sel, text) => (scope ? [...scope.querySelectorAll(sel)].find(a => a.textContent.trim() === text) : null) || null;
    const picks = [
      byText(menu, ':scope > a[href]', 'Provider portal'),
      byText(menu, ':scope > a[href]', 'Ovena Health'),
      byText(foot, '.footer-col > a[href]', 'Contact'),
      foot && foot.querySelector('.footer-col > a[href^="tel:"]'),
    ].filter(Boolean);
    if (!picks.length) return;
    const norm = p => p.replace(/\/index\.html$/, '/').replace(/\/?$/, '/');
    const here = norm(location.pathname);
    const bar = make('div', {class: 'm8-util'}), list = make('ul', {'aria-label': 'Utility'});
    picks.forEach(a => {
      const c = make('a', {href: a.getAttribute('href')});
      c.textContent = a.textContent.trim();
      try { const u = new URL(c.href, location.href); if (u.origin === location.origin && norm(u.pathname) === here) c.setAttribute('aria-current', 'page'); } catch (_) { /* not a page link */ }
      const li = make('li');
      li.append(c);
      list.append(li);
    });
    bar.append(list);
    nav.prepend(bar);
  }

  /* ── 12. Carousels (Model v8). Markup: .m8-carousel > .m8-track > slides (data-m8-carousel="hero" for a one-up
     hero with dots). Without this script the track is a native horizontal scroll, so every slide is reachable. Here:
     round previous / next buttons and, for a hero, one dot per slide (real buttons with aria-labels; the current dot
     carries aria-current); the track takes focus, so the arrow keys scroll it. A step slides 450ms on the house
     easing; under reduced motion it jumps. Nothing plays by itself (no autoplay, no timers). A hero's arrows sit on
     its panel edges and it wraps at its ends; a card rail's arrows sit in a control row (.m8-controls) above the
     rail, never over its cards, and stop at its ends (the button reports aria-disabled and looks inactive). The
     controls hide when everything already fits. ── */
  const CHEV = d => `<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="${d}"/></svg>`;
  function carousels() {
    doc.querySelectorAll('.m8-carousel').forEach(box => {
      const track = box.querySelector('.m8-track');
      if (!track || box.classList.contains('m8-ready')) return;
      const hero = box.getAttribute('data-m8-carousel') === 'hero';
      const slides = () => [...track.children].filter(el => el.getClientRects().length);
      const posOf = el => el.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft;
      const maxX = () => Math.max(0, track.scrollWidth - track.clientWidth);
      const prev = make('button', {type: 'button', class: 'm8-arrow m8-prev', 'aria-label': 'Previous'});
      const next = make('button', {type: 'button', class: 'm8-arrow m8-next', 'aria-label': 'Next'});
      prev.innerHTML = CHEV('M15 5l-7 7 7 7');
      next.innerHTML = CHEV('M9 5l7 7-7 7');
      if (!track.hasAttribute('tabindex')) track.tabIndex = 0;
      // a hero's arrows sit on its panel edges; a card rail's sit in a control row above it, never over its cards
      const bar = hero ? null : make('div', {class: 'm8-controls'});
      if (bar) { bar.append(prev, next); track.before(bar); } else track.after(prev, next);
      let dots = [];
      if (hero) {
        const row = make('div', {class: 'm8-dots'});
        dots = slides().map((el, i, all) => {
          const d = make('button', {type: 'button', class: 'm8-dot', 'aria-label': `Slide ${i + 1} of ${all.length}`});
          d.addEventListener('click', () => go(posOf(el)));
          row.append(d);
          return d;
        });
        next.after(row);
      }
      let anim = 0;
      function go(x) {
        x = Math.max(0, Math.min(maxX(), x));
        cancelAnimationFrame(anim);
        const from = track.scrollLeft, dist = x - from;
        if (Math.abs(dist) < 1) return;
        if (calm) { track.scrollLeft = x; return; }
        const t0 = performance.now(), D = 450;
        track.classList.add('m8-sliding');
        const step = now => {
          const t = Math.min(1, (now - t0) / D), e = 1 - Math.pow(1 - t, 3);
          track.scrollLeft = from + dist * e;
          if (t < 1) anim = requestAnimationFrame(step);
          else { track.classList.remove('m8-sliding'); track.scrollLeft = x; }
        };
        anim = requestAnimationFrame(step);
      }
      const near = () => {
        const x = track.scrollLeft, list = slides();
        let best = 0, bd = Infinity;
        list.forEach((el, i) => { const d = Math.abs(posOf(el) - x); if (d < bd) { bd = d; best = i; } });
        return best;
      };
      const stepBy = dir => {
        const x = track.scrollLeft, list = slides(), m = maxX();
        if (hero && dir > 0 && x >= m - 2) return go(0);
        if (hero && dir < 0 && x <= 2) return go(m);
        const at = list.map(posOf);
        const target = dir > 0 ? at.find(p => p > x + 2) : [...at].reverse().find(p => p < x - 2);
        go(target === undefined ? (dir > 0 ? m : 0) : target);
      };
      prev.addEventListener('click', () => { if (prev.getAttribute('aria-disabled') !== 'true') stepBy(-1); });
      next.addEventListener('click', () => { if (next.getAttribute('aria-disabled') !== 'true') stepBy(1); });
      let ticking = false;
      function sync() {
        ticking = false;
        const m = maxX(), fits = m < 2;
        [prev, next, ...dots].forEach(b => { b.hidden = fits; });
        if (bar) bar.hidden = fits;
        if (dots.length && dots[0].parentElement) dots[0].parentElement.hidden = fits;
        if (!hero) {
          prev.setAttribute('aria-disabled', String(track.scrollLeft <= 2));
          next.setAttribute('aria-disabled', String(track.scrollLeft >= m - 2));
        }
        const i = near();
        dots.forEach((d, k) => { if (k === i) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current'); });
        box.style.setProperty('--m8-arrow-top', `${track.offsetTop + track.offsetHeight / 2}px`);
      }
      track.addEventListener('scroll', () => { if (!ticking) { ticking = true; raf(sync); } }, {passive: true});
      addEventListener('resize', () => raf(sync), {passive: true});
      box.classList.add('m8-ready');
      sync();
      if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(() => raf(sync));
    });
  }

  /* ── 13. Panel depth tags (Futurist v9). The page groups' own large rounded panels (hero and closing panels, 24px
     radius, clipped, at least 85% of the page width or 1100px) join .m8-panel in the scroll-driven depth of
     house-motion.css: their frame opens from 97% of its height (never narrower) as they arrive and settles back as they leave. Never a card (20px),
     never a carousel slide, never a panel that runs its own animation or clip, never one inside another. A tagged
     panel's own cover photo drifts as well (.m9-drift). ── */
  function depthTags() {
    if (!(window.CSS && CSS.supports('animation-timeline: view()'))) return;
    const vw = root.clientWidth, min = Math.min(vw * 0.85, 1100);
    const picks = [];
    doc.querySelectorAll('main :is(section, header, div, aside), body > :is(section, header)').forEach(el => {
      if (el.closest(OFF) || el.closest('.m8-track, .m8-panel, .nav, footer, dialog') || el.classList.contains('m8-panel')) return;
      const r = el.getBoundingClientRect();
      if (r.width < min || r.height < 200) return;
      const cs = getComputedStyle(el);
      const rad = parseFloat(cs.borderTopLeftRadius) || 0;
      if (rad < 23.5 || !/hidden|clip/.test(cs.overflowX) || !/hidden|clip/.test(cs.overflowY)) return;
      if (cs.animationName !== 'none' || cs.clipPath !== 'none' || cs.position === 'sticky' || cs.position === 'fixed') return;
      picks.push([el, cs.borderTopLeftRadius]);
    });
    picks.forEach(([el, rad]) => {
      if (picks.some(([o]) => o !== el && o.contains(el))) return;
      el.style.setProperty('--hm-r', rad);
      el.classList.add('m9-depth');
      // Its photo (a cover image filling a clipped frame, 300px tall or more) drifts 12px inside that frame; the
      // image is scaled just enough (at most 6%) that the drift never shows an edge.
      el.querySelectorAll('img').forEach(img => {
        if (img.closest(OFF) || img.closest(IMG_SKIP)) return;
        const frame = img.parentElement && img.parentElement.tagName === 'PICTURE' ? img.parentElement.parentElement : img.parentElement;
        if (!frame) return;
        const ir = img.getBoundingClientRect(), fr = frame.getBoundingClientRect(), fs = getComputedStyle(frame);
        if (ir.width < 240 || ir.height < 300 || getComputedStyle(img).objectFit !== 'cover') return;
        if (!/hidden|clip/.test(fs.overflowY) || Math.abs(ir.top - fr.top) > 2 || Math.abs(ir.bottom - fr.bottom) > 2 ||
          Math.abs(ir.left - fr.left) > 2 || Math.abs(ir.right - fr.right) > 2) return;
        const k = (ir.height + 14) / ir.height;   // 6px each way plus a pixel of margin
        if (k > 1.06) return;
        img.style.setProperty('--hm-ds', k.toFixed(4));
        img.classList.add('m9-drift');
      });
    });
  }

  /* ── 14. Mono index tags (Futurist v9). Unnamed micro-labels whose whole text is an index or a technical count
     take the mono face (signature.css F1): "01"-"09" (and the two-digit numbers of the same list), "01 / …" row tags,
     "01 Capture" step labels, "n of N … shown" counts, "0–10 min" timings. Only small text (16px or less) outside headings and running
     sentences; the words themselves never change. ── */
  function monoTags() {
    const IDX = /^0\d$/, TWO = /^\d{2}$/, ROW = /^\d{2} \/ \S/, LEAD = /^0\d\s+\S/, COUNT = /^\d[\d,]*\s.*\bshown$/i, SPAN = /^\d+\s*[–-]\s*\d+\s*min$/i;
    const SKIP = '.nav, footer, .mobile-menu, dialog, h1, h2, h3, h4, h5, h6, .m9-mono, ' + OFF;
    const groups = new Map(), take = [];
    doc.querySelectorAll('main :is(span, small, b, strong, p, div, li, dt, dd, em)').forEach(el => {
      if (el.children.length) return;
      const t = el.textContent.trim();
      if (!t || t.length > 48) return;
      const two = TWO.test(t);
      if (!(two || ROW.test(t) || LEAD.test(t) || COUNT.test(t) || SPAN.test(t))) return;
      if (el.closest(SKIP) || parseFloat(getComputedStyle(el).fontSize) > 16) return;
      // a number inside a sentence is copy, not a label: the parent must not read as running text around it
      // (a label leading its item, like "0–10 min" before the agenda line, is still a label)
      const p = el.parentElement, around = p ? p.textContent.replace(t, '').trim() : '';
      const leads = p && p.firstElementChild === el && !(p.firstChild && p.firstChild.nodeType === 3 && p.firstChild.data.trim());
      if (p && !leads && el.tagName !== 'P' && el.tagName !== 'DIV' && /^(P|LI|DD|TD)$/.test(p.tagName) && around.split(/\s+/).length > 6) return;
      if (two) {
        const key = `${el.tagName}.${el.className}<${p ? p.tagName + '.' + p.className : ''}`;
        if (!groups.has(key)) groups.set(key, {idx: false, list: []});
        const g = groups.get(key);
        g.list.push(el);
        if (IDX.test(t)) g.idx = true;
        return;
      }
      take.push(el);
    });
    groups.forEach(g => { if (g.idx) take.push(...g.list); });
    take.forEach(el => el.classList.add('m9-mono'));
  }

  /* ── 15. Band hairline tags (Futurist v9). A page group's full-width light grey band section (the band colour,
     square, at least 24px of top padding) takes the hairline grid and ticks of .m8-band (signature.css F4), but only
     when nothing readable in it reaches the outer margins the grid occupies. The important-information block keeps
     its plain band. ── */
  function bandTags() {
    const vw = root.clientWidth;
    const lo = (vw - 1200) / 2 - 8, hi = vw - lo;
    doc.querySelectorAll('main section, main > div, body > section').forEach(el => {
      if (el.matches('.m8-band, .m9-band, .m8-info, .sx-info') || el.closest(OFF) || el.closest('.m8-band, .m9-band')) return;
      const cs = getComputedStyle(el);
      if (cs.backgroundColor !== 'rgb(242, 243, 245)' || cs.backgroundImage !== 'none') return;
      if ((parseFloat(cs.borderTopLeftRadius) || 0) > 0 || parseFloat(cs.paddingTop) < 24) return;
      const r = el.getBoundingClientRect();
      if (r.width < vw - 2 || r.height < 160) return;
      // under 1280px only the ticks show (no grid in the margins), so there is nothing to keep clear
      if (vw >= 1280) for (const t of el.querySelectorAll('*')) {
        if (![...t.childNodes].some(n => n.nodeType === 3 && n.data.trim())) continue;
        const q = t.getBoundingClientRect();
        if (q.width && (q.left < lo || q.right > hi)) return;
      }
      el.classList.add('m9-band');
      if (vw < 1280) el.classList.add('m9-band--ticks');   // unchecked margins: never the grid, even after a resize
    });
  }

  /* ── 16. The nav's hover rail (Futurist v9, desktop; B4 Oct 15). The current page keeps its own static 2px navy
     underline (signature.css), so the you-are-here mark never moves. This one 1px hairline marks only the item under
     the pointer or keyboard focus: it fades in under it, slides between top-level items (a dropdown keeps it on its
     trigger), fades as it reaches the current item (that item already carries its underline) and fades out when the
     pointer or focus leaves the links. Under reduced motion it moves without sliding. ── */
  function navBar() {
    const nav = theNav();
    const inner = nav && nav.querySelector('.nav-inner'), list = nav && nav.querySelector('.nav-links');
    if (!inner || !list || inner.querySelector('hm-navbar')) return;
    const top = li => li && li.querySelector(':scope > a:not(.nav-cta)');
    const items = [...list.children].map(top).filter(Boolean);
    if (!items.length) return;
    // read each time: the page's own script may mark the current link after this one has run
    const current = () => items.find(a => a.matches('.is-active, [aria-current="page"]')) || null;
    if (getComputedStyle(inner).position === 'static') inner.style.position = 'relative';
    const bar = make('hm-navbar', {'aria-hidden': 'true'});
    inner.append(bar);
    root.classList.add('hm-navbar-on');
    let at = null, shown = false;
    const geom = a => {
      const ar = a.getBoundingClientRect(), ir = inner.getBoundingClientRect();
      const tr = a.querySelector(':scope > :is(hm-t, .hm-t)') || a;   // under the words
      const wr = tr.getBoundingClientRect();
      return {x: wr.left - ir.left, y: Math.round(ar.top + ar.height / 2 + 16 - ir.top), w: wr.width};   // on the current underline's rail
    };
    function go(a, jump) {
      if (!a || !a.getClientRects().length) {
        bar.style.opacity = '0'; shown = false; at = null; return;
      }
      if (a === at && shown && !jump) return;
      const g = geom(a);
      const tf = `translate3d(${g.x.toFixed(1)}px,${g.y}px,0) scaleX(${(g.w / 100).toFixed(4)})`;
      if (!shown || jump) {
        bar.style.transition = 'none';
        bar.style.transform = tf;
        void bar.offsetWidth;
        bar.style.transition = '';
      } else bar.style.transform = tf;
      bar.style.opacity = a === current() ? '0' : '1';
      shown = true; at = a;
    }
    const home = () => go(null);
    const pick = e => { const li = e.target.closest && e.target.closest('.nav-links > li'); return li && list.contains(li) ? top(li) : null; };
    list.addEventListener('pointerover', e => { const a = pick(e); if (a) go(a); else home(); });
    list.addEventListener('pointerleave', home);
    list.addEventListener('focusin', e => { const a = pick(e); if (a) go(a); else home(); });
    list.addEventListener('focusout', e => { if (!e.relatedTarget || !list.contains(e.relatedTarget)) home(); });
    const replace = () => { if (!at) return; const a = at; shown = false; go(a, true); };
    addEventListener('resize', () => raf(replace), {passive: true});
    if (doc.fonts && doc.fonts.ready) doc.fonts.ready.then(() => raf(replace));
  }

  /* Arrow nudges on the house buttons and links the hover pass does not read (2): the glyph is wrapped once
     (hm-arw), so it can slide 3px on hover and focus (house-motion.css 10). */
  function arrows() {
    doc.querySelectorAll('.m8-btn, .m8-btn-outline, .m8-link, .v7-btn, .btn-primary').forEach(el => {
      if (el.closest(OFF) || el.closest('.mobile-menu, dialog') || el.querySelector(':scope > .hm-arw')) return;
      markArrow(el);
    });
  }

  /* ── 17. Eyebrow segments (fix-v9c). An eyebrow or kicker whose words are set in parts with a separator
     ("Albacete MedDev / Revenue cycle", "STORE · ALSO ON AMAZON") breaks only between its parts: each part and the
     separator after it travel together in an hm-seg (house-motion.css: an inline block, never wider than the line,
     so a part longer than the line still wraps inside itself and nothing overflows). The words, their order and
     every character stay exactly as written; where no breakable space follows a separator a <wbr> marks the break.
     Idempotent, and an eyebrow a page has already set (hm-seg, .sx-u, .nw, hm-s, hm-g, or any nowrap span inside)
     is left alone, as is anything holding a link, a control, an image or an id. ── */
  const LABELS = '.clinical-eyebrow, .eyebrow, .sx-eyebrow, .cx-eyebrow, .hero-chip, .services-kicker, .service-eyebrow, ' +
    '.science-kicker, .cat-eyebrow, .identity-eyebrow, .sx-guide-eyebrow, .section-label, .sx-label, .v7-label, .m8-label, ' +
    '.m8-card-label, [class*="eyebrow"], [class*="kicker"]';
  const SEP = /(?:[ \t\n\u00a0]+[\/|][ \t\n\u00a0]+|[ \t\n\u00a0]*[\u00b7\u2022][ \t\n\u00a0]*)/g;
  function eyebrows() {
    doc.querySelectorAll(LABELS).forEach(el => {
      if (el.hasAttribute('data-hm-seg') || el.closest(OFF) || el.closest('nav, footer, .mobile-menu, dialog, [contenteditable], .sr-only')) return;
      const text = el.textContent;
      if (text.length > 140 || !/[\/|\u00b7\u2022]/.test(text)) return;
      if (el.querySelector('hm-seg, hm-s, hm-g, .sx-u, .nw, a, button, input, select, textarea, img, svg, [id]')) return;
      if ([el, ...el.querySelectorAll('*')].some(n => /^(nowrap|pre)$/.test(getComputedStyle(n).whiteSpace))) return;
      // work inside a lone wrapper (<div class="hero-chip"><span>…</span></div>), so it is never split in copies
      let host = el;
      while (host.children.length === 1 && ![...host.childNodes].some(n => n.nodeType === 3 && n.data.trim()) &&
        host.firstElementChild.textContent === host.textContent) host = host.firstElementChild;
      const cuts = [];
      SEP.lastIndex = 0;
      for (let m; (m = SEP.exec(text));) {
        // the part runs to the end of its separator mark (and any no-break space glued after it)
        cuts.push(m.index + m[0].replace(/[ \t\n]+$/, '').length);
      }
      if (!cuts.length) return;
      const ranges = [];
      let from = 0;
      cuts.forEach(c => { if (text.slice(from, c).replace(/[\s\/|\u00b7\u2022]/g, '')) ranges.push([from, c]); from = c; });
      if (text.slice(from).trim()) ranges.push([from, text.length]);
      if (ranges.length < 2) return;
      const segs = [];
      for (let i = ranges.length - 1; i >= 0; i--) { const s = wrapText(host, ranges[i][0], ranges[i][1], 'hm-seg'); if (s) segs.unshift(s); }
      // a break opportunity after each part that is not followed by a breakable space
      segs.slice(0, -1).forEach(s => {
        const next = s.nextSibling;
        if (!(next && /^\u00a0*[ \t\n]/.test(next.textContent))) s.after(make('wbr'));
      });
      // in a flex or grid eyebrow the parts stay one item, so the spaces between them are kept
      const box = segs[0] && segs[0].parentNode;
      if (box && segs.every(s => s.parentNode === box) && /flex|grid/.test(getComputedStyle(box).display)) {
        const r = doc.createRange(), all = make('hm-segs');
        r.setStartBefore(segs[0]); r.setEndAfter(segs[segs.length - 1]);
        all.append(r.extractContents()); r.insertNode(all);
      }
      el.setAttribute('data-hm-seg', '');
    });
  }

  /* ── 18. Nav menus (v10, Oct 15). Products, Clinical resources and Practice services each open a panel of the
     destinations under them (signature.css "NAV MENUS v10"; the markup is in every page's nav, so without this file
     a panel opens on hover and keyboard focus). The label stays a link to its hub page; the chevron beside it is a
     disclosure button (aria-expanded, aria-controls). Desktop: a panel opens on hover after a 120ms intent delay
     (straight away while another is open, which it replaces) and closes 240ms after the pointer leaves, unless it
     was opened by a click; a click, Enter or Space on the chevron toggles it (a click on a panel the pointer opened
     keeps it open); ArrowDown on the label or chevron opens it on its first link; the arrow keys, Home and End move
     through its links; Escape closes it and returns focus to the chevron; a click outside or focus leaving the item
     closes it. One is open at a time, and the smart nav stays while one is (7). Phone: the same three groups are
     disclosure sections of the sheet; the current page's group starts open.
     Current page: a panel link to this page carries aria-current="page"; a top-level item is current at or under
     its hub, or on a page one of its links goes to unless that page has a top-level line of its own (Ovena Health
     does), so Clinical resources stays current on the scientific portfolio.
     A category link to the page already open (the catalog's #sections) waits for the page's own hash handling (the
     catalog clears its filters there; re-sent when the hash is unchanged, which fires no hashchange) and then lands
     on the category. ── */
  function navMenus() {
    const nav = theNav();
    const items = nav ? [...nav.querySelectorAll('.nav-links > li.nav-dd')] : [];
    const groups = [...doc.querySelectorAll('.mobile-menu > .m-dd')];
    if (!items.length && !groups.length) return;
    const norm = p => (p || '/').replace(/\/index\.html$/, '/').replace(/\/+$/, '') || '/';
    const here = norm(location.pathname);
    const pathOf = a => { try { const u = new URL(a.getAttribute('href'), location.href); return u.origin === location.origin ? norm(u.pathname) : null; } catch (_) { return null; } };
    const isHere = a => !a.hash && pathOf(a) === here;
    const own = new Set([...doc.querySelectorAll('.nav-links > li > a:not(.nav-cta), .mobile-menu > a:not(.mobile-cta)')].map(pathOf).filter(Boolean));
    // A section link (#…) is never "this page", whichever script marked the nav's links by path alone.
    const unmarkSections = () => doc.querySelectorAll('.nav-dd-panel a[href*="#"][aria-current], .m-dd-panel a[href*="#"][aria-current]')
      .forEach(a => { if (a.hash) a.removeAttribute('aria-current'); });
    unmarkSections();   // and again once every deferred script has run (they mark during their own start)
    if (doc.readyState !== 'complete') { doc.addEventListener('DOMContentLoaded', unmarkSections, {once: true}); addEventListener('load', unmarkSections, {once: true}); }
    function mark(label, panel) {
      const links = [...panel.querySelectorAll('a[href]')];
      links.forEach(a => { if (isHere(a)) a.setAttribute('aria-current', 'page'); });
      const hub = pathOf(label);
      let cur = '';
      if (hub && hub !== '/' && (here === hub || here.startsWith(hub + '/'))) cur = here === hub ? 'page' : 'true';
      else if (!own.has(here) && links.some(isHere)) cur = 'true';
      if (cur) { label.classList.add('is-active'); label.setAttribute('aria-current', cur); }
      return !!cur;
    }

    // Desktop
    const desk = matchMedia('(min-width: 1101px)');
    const ctl = new Map();
    let openLi = null;
    items.forEach(li => {
      const label = li.querySelector(':scope > a'), btn = li.querySelector(':scope > .nav-dd-btn'), panel = li.querySelector(':scope > .nav-dd-panel');
      if (!label || !btn || !panel) return;
      mark(label, panel);
      let tOpen = 0, tClose = 0, how = '';
      const links = () => [...panel.querySelectorAll('a[href]')];
      const focusAt = i => { const l = links(); if (l.length) l[(i + l.length) % l.length].focus(); };
      function set(open, mode) {
        clearTimeout(tOpen); clearTimeout(tClose);
        if (open) {
          if (openLi && openLi !== li) ctl.get(openLi)(false, 'switch');
          openLi = li; how = mode || how || 'click';
        } else {
          if (openLi === li) openLi = null;
          how = '';
          if (mode === 'switch') {   // replaced by its neighbour: gone at once, so the two never cross-fade
            panel.style.transition = 'none';
            raf(() => raf(() => { panel.style.transition = ''; }));
          }
        }
        li.classList.toggle('is-open', open);
        btn.setAttribute('aria-expanded', String(open));
        panel.inert = !open;   // out of the tab order at once, while its fade-out plays
      }
      panel.inert = true;
      ctl.set(li, set);
      li.addEventListener('pointerenter', e => {
        if (e.pointerType === 'touch' || !desk.matches) return;
        clearTimeout(tClose);
        if (li.classList.contains('is-open')) return;
        clearTimeout(tOpen);
        tOpen = setTimeout(() => set(true, 'hover'), openLi ? 0 : 120);
      });
      li.addEventListener('pointerleave', e => {
        if (e.pointerType === 'touch') return;
        clearTimeout(tOpen);
        if (how === 'hover') tClose = setTimeout(() => set(false), 240);
      });
      btn.addEventListener('click', e => {
        const isOpen = li.classList.contains('is-open');
        if (isOpen && how === 'hover' && e.detail > 0) { clearTimeout(tClose); how = 'click'; return; }
        set(!isOpen, 'click');
      });
      [label, btn].forEach(el => el.addEventListener('keydown', e => {
        if (e.key !== 'ArrowDown' || e.altKey || e.ctrlKey || e.metaKey) return;
        e.preventDefault();
        set(true, 'key');
        focusAt(0);
      }));
      panel.addEventListener('keydown', e => {
        const l = links(), i = l.indexOf(doc.activeElement);
        if (i < 0) return;
        const to = {ArrowDown: i + 1, ArrowUp: i - 1, Home: 0, End: l.length - 1}[e.key];
        if (to === undefined || e.altKey || e.ctrlKey || e.metaKey) return;
        e.preventDefault();
        focusAt(to);
      });
      li.addEventListener('keydown', e => {
        if (e.key !== 'Escape' || !li.classList.contains('is-open')) return;
        e.preventDefault();
        set(false);
        btn.focus();
      });
      li.addEventListener('focusout', e => {
        if (e.relatedTarget && li.contains(e.relatedTarget)) return;
        if (li.classList.contains('is-open') && !(how === 'hover' && li.matches(':hover'))) set(false);
      });
      panel.addEventListener('click', e => { if (e.target.closest && e.target.closest('a[href]')) set(false); });
    });
    if (ctl.size) {
      root.classList.add('hm-dd-on');
      doc.addEventListener('click', e => { if (openLi && !openLi.contains(e.target)) ctl.get(openLi)(false); });
      doc.addEventListener('keydown', e => { if (e.key === 'Escape' && openLi && !openLi.contains(doc.activeElement)) ctl.get(openLi)(false); });
      const off = () => { if (!desk.matches && openLi) ctl.get(openLi)(false); };
      desk.addEventListener ? desk.addEventListener('change', off) : desk.addListener(off);
    }

    // Phone
    groups.forEach(g => {
      const label = g.querySelector(':scope > .m-dd-row > a'), btn = g.querySelector(':scope > .m-dd-row > .m-dd-btn'), panel = g.querySelector(':scope > .m-dd-panel');
      if (!label || !btn || !panel) return;
      const show = open => { btn.setAttribute('aria-expanded', String(open)); panel.hidden = !open; g.classList.toggle('is-open', open); };
      show(mark(label, panel));
      btn.addEventListener('click', () => show(btn.getAttribute('aria-expanded') !== 'true'));
    });

    // A category link to this same page lands on its category once the page has had its say.
    const settle = t => raf(() => raf(() => { if (t.getClientRects().length) t.scrollIntoView({block: 'start'}); }));
    doc.addEventListener('click', e => {
      const a = e.target.closest && e.target.closest('.nav-dd-panel a[href*="#"], .m-dd-panel a[href*="#"]');
      if (!a || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (a.origin !== location.origin || norm(a.pathname) !== here || a.hash.length < 2) return;
      let t = null;
      try { t = doc.getElementById(decodeURIComponent(a.hash.slice(1))); } catch (_) { t = null; }
      if (!t) return;
      if (a.hash === location.hash) {
        e.preventDefault();
        dispatchEvent(new HashChangeEvent('hashchange', {oldURL: location.href, newURL: location.href}));
        settle(t);
      } else {
        const go = () => settle(t);
        addEventListener('hashchange', go, {once: true});
        setTimeout(() => removeEventListener('hashchange', go), 1500);   // never left waiting for a later jump
      }
    });
  }

  /* ── Start ─────────────────────────────────────────────────────────── */
  const safe = fn => { try { fn(); } catch (err) { if (window.console) console.warn('house-motion:', err); } };
  safe(utilityBar);
  safe(navMenus);
  safe(sentences);
  safe(eyebrows);
  safe(surfaces);
  safe(transitions);
  safe(hovers);
  safe(arrows);
  safe(textLinks);
  safe(monoTags);
  safe(bandTags);
  safe(navBar);
  idle(() => safe(underlines));
  if (!calm && io) {
    root.classList.add('hm-on');
    safe(headings);
    safe(images);
    safe(depthTags);
  }
  safe(smartNav);
  safe(phoneMenu);
  safe(footerGlue);
  safe(carousels);
  // Print shows everything (house-motion.css hides nothing in print either); anchor jumps show everything above the
  // target and a screen below it at once: on a hash change, on a same-page anchor click (which fires no hash change
  // when the hash is already set) and once more at load, after late layout, for a page opened at a #target.
  addEventListener('beforeprint', finishAll);
  const printMQ = matchMedia('print');
  printMQ.addEventListener && printMQ.addEventListener('change', e => { if (e.matches) finishAll(); });
  addEventListener('hashchange', () => finishAbove(lineFor(hashTarget())));
  doc.addEventListener('click', e => {
    const a = e.target.closest && e.target.closest('a[href*="#"]');
    if (!a || a.origin !== location.origin || a.pathname !== location.pathname) return;
    finishAbove(lineFor(hashTarget(a.hash)));
  }, true);
  if (location.hash) {
    const late = () => finishAbove(lineFor(hashTarget()));
    if (doc.readyState === 'complete') late(); else addEventListener('load', late, {once: true});
  }
  mqCalm.addEventListener && mqCalm.addEventListener('change', () => {
    calm = mqCalm.matches;
    if (calm) { finishAll(); root.classList.remove('hm-on', 'hm-going'); }
  });
})();
