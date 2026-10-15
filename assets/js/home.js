/* Home (Model v8, Oct 15 2026). Calm and content first: every heading, paragraph, button and photograph is drawn at
   first paint, in print, after a jump and at any scroll speed; motion only ever animates something already there.
   hero    a carousel of three rounded panels; the global carousel (house-motion.js) gives it previous / next buttons,
           dots and arrow-key scrolling; here they are gathered into one pager with the mono slide index, under the
           panel at its right edge (never on a photograph). Nothing plays by itself. Without JS the panels stack
           (home.css).
   reveal  below the hero, the words and pictures inside each block fade up 12px (600ms, the house easing, 60ms
           apart), once, started a quarter of a screen before the block arrives; cards, panels and bands never fade.
   rail    the category tabs filter a horizontal product rail (crossfade); drag, swipe, key or use the round arrows.
           On phones the tabs are a scrollable row of pills; the chosen tab is brought into view.
   ticker  keeps moving (owner's choice), can be stopped with its own button (WCAG 2.2.2) at the end of its strip,
           rests while off screen. Without JS, or with reduced motion, the names stand still and wrap so every one is
           visible (home.css).
   v9      (Futurist "precision instrument") the hero's corner marks and mono pager, its living photograph, the
           brand ident as slide 3's background (pause/play control), slide changes as an 850ms photograph wipe behind
           a 1px scan line with the words cross-faded and the captions and cards faded (never wiped); image scan-ins on
           the category cards and the rail; the tabs' sliding indicator; a scan pass on the precision panel's
           topography (assets/js/m9-topo.js) when it is pointed at or focused.
   No stylesheet hides content: entrances are Web Animations started off screen, so without JS, with reduced motion
   or in print the page is complete and static. */
(() => {
  const R = document.documentElement;
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const MO = !RM;
  const IO = 'IntersectionObserver' in window;
  const EASE = 'cubic-bezier(.22,.61,.36,1)'; // --m8-ease
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
  const safe = f => { try { f(); } catch (e) { console.warn('[home]', e); } };
  R.classList.add('sx-home-js');
  if (MO) R.classList.add('sx-mo');

  /* ── Below the hero: each block's words and pictures fade up 12px (600ms, the house easing, 60ms apart), once.
       Nothing is ever hidden by a stylesheet: every card, panel and band is drawn, words included, at first paint,
       in print, after an anchor jump and at any scroll speed. The entrance is an animation started while the block
       is still just below the screen (a quarter of a screen early); a block that is already on screen when it is
       first seen (a jump, a fast scroll, a reload part-way down) is simply there. Only the parts inside a card or
       panel move, never the card or panel itself. Keyboard focus, a jump and printing finish any entrance at once. */
  function reveals() {
    if (!MO || !IO || !document.body.animate) return;
    const blocks = $$('.sx-reveal').filter(b => !b.closest('.sx-heroes'));
    const runs = new Set();
    // the moving parts of a block: its children, or for a card or panel the words inside it; photographs that have
    // their own scan-in, the product rail and the topography stay put
    const partsOf = b => {
      const out = [];
      [...b.children].forEach(c => {
        if (c.matches('.sx-split-photo, .m8-carousel, .sx-tab-ink, [data-m9-topo]')) return;
        if (c.matches('.sx-cat')) { const body = $(':scope > .m8-card-body', c); if (body) out.push(body); return; }
        if (c.matches('.m8-card, .m8-panel')) {
          const inner = $(':scope > .m8-panel-body, :scope > .sx-precision-copy', c);
          [...(inner || c).children].forEach(k => { if (!k.matches('[data-m9-topo]')) out.push(k); });
          return;
        }
        out.push(c);
      });
      return out;
    };
    const enter = (b, d0) => partsOf(b).forEach((el, i) => {
      el.classList.add('sx-part');
      const a = el.animate([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }],
        { duration: 600, delay: d0 + Math.min(i, 3) * 60, easing: EASE, fill: 'backwards' });
      runs.add(a);
      const end = () => runs.delete(a);
      a.finished.then(end, end);
    });
    const io = new IntersectionObserver(es => {
      let n = 0;
      es.forEach(e => {
        if (!e.isIntersecting) return;
        io.unobserve(e.target);
        if (e.boundingClientRect.top < innerHeight) return; // already on screen: it stays as it is
        enter(e.target, Math.min(n++, 2) * 60);
      });
    }, { rootMargin: '0px 0px 25% 0px', threshold: 0 });
    blocks.forEach(b => io.observe(b));
    const finishAll = () => runs.forEach(a => { try { a.finish(); } catch (_) { /* already gone */ } });
    // a flick can carry a part well into the screen (or past it) before its fade has run: it lands at once
    let tick = false;
    addEventListener('scroll', () => {
      if (tick || !runs.size) return;
      tick = true;
      requestAnimationFrame(() => {
        tick = false;
        const line = innerHeight * .25;
        runs.forEach(a => { const el = a.effect && a.effect.target; if (el && el.getBoundingClientRect().top < line) a.finish(); });
      });
    }, { passive: true });
    document.addEventListener('focusin', e => {
      const t = e.target;
      runs.forEach(a => { const el = a.effect && a.effect.target; if (el && (el.contains(t) || t.contains(el))) a.finish(); });
    });
    addEventListener('hashchange', finishAll);
    addEventListener('beforeprint', finishAll);
  }

  /* ── Product rail: the category tabs filter the products (plus the closing "full portfolio" card) in a horizontal
       card rail. The rail is the global carousel (house-motion.js adds its round arrows and keeps them in step); here:
       the tabs (a tablist whose one panel is the rail), a crossfade on a tab change (what is on screen fades out in
       200ms, the new cards fade in over 500ms, 60ms apart), mouse drag with a little throw, and arrow keys that move
       focus card to card. The three category cards above are always shown. No JS: every product is listed. ── */
  function showcase() {
    const show = $('[data-show]');
    if (!show) return;
    const tablist = $('[role="tablist"]', show), tabs = $$('[role="tab"]', tablist);
    const rail = $('[data-rail]', show), tiles = $$('.sx-tile', rail), box = rail.closest('.m8-carousel') || rail.parentElement;
    let active = 0, items = [], aim = -1, aimT = 0, swapping = false;

    tablist.hidden = false;
    // the chosen tab's navy pill is one indicator that slides from tab to tab (home.css, under the words)
    const ink = $('.sx-tab-ink', tablist);
    const placeInk = () => {
      if (!ink) return;
      const t = tabs[active];
      ink.style.width = `${t.offsetWidth}px`;
      ink.style.height = `${t.offsetHeight}px`;
      ink.style.transform = `translate(${t.offsetLeft}px,${t.offsetTop}px)`;
    };
    if (ink) tablist.classList.add('has-ink');
    // Phones: where the row runs past the screen its edge fades (home.css), so a pill cut at the edge reads as more
    // to scroll; the fade leaves a side once the row has reached it
    const edges = () => {
      const room = tablist.scrollWidth - tablist.clientWidth, x = tablist.scrollLeft;
      tablist.classList.toggle('is-more-l', room > 2 && x > 2);
      tablist.classList.toggle('is-more-r', room > 2 && x < room - 2);
    };
    edges();
    tablist.addEventListener('scroll', () => requestAnimationFrame(edges), { passive: true });
    addEventListener('resize', () => requestAnimationFrame(edges), { passive: true });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(edges);
    box.setAttribute('role', 'tabpanel');
    box.removeAttribute('aria-label');

    const shown = () => tiles.filter(t => !t.hidden);
    const behavior = () => (RM ? 'auto' : 'smooth');
    const pad = () => parseFloat(getComputedStyle(rail).paddingLeft) || 0;
    const maxScroll = () => Math.max(0, rail.scrollWidth - rail.clientWidth);
    const measure = () => { items = shown().map(t => ({ el: t, left: t.offsetLeft })); };
    // the global carousel recounts its slides and resets its arrows on a scroll event
    const resync = () => rail.dispatchEvent(new Event('scroll'));

    // Phones: the tabs are a scrollable row; bring the chosen tab fully into view (the row only, never the page).
    function reveal() {
      const t = tabs[active], room = tablist.scrollWidth - tablist.clientWidth;
      if (room <= 2) return;
      const p = parseFloat(getComputedStyle(tablist).paddingLeft) || 0;
      const lo = t.offsetLeft - p, hi = t.offsetLeft + t.offsetWidth + p - tablist.clientWidth;
      const want = clamp(tablist.scrollLeft, hi, lo);
      if (Math.abs(want - tablist.scrollLeft) > 1) tablist.scrollTo({ left: clamp(want, 0, room), behavior: behavior() });
    }
    const inView = () => {
      const lo = rail.scrollLeft, hi = lo + rail.clientWidth;
      return shown().filter(t => t.offsetLeft + t.offsetWidth > lo && t.offsetLeft < hi);
    };
    // Show the chosen category; with animateIn, the cards on screen fade in.
    function apply(animateIn) {
      const cat = tabs[active].dataset.cat;
      box.setAttribute('aria-labelledby', tabs[active].id);
      tiles.forEach(t => { t.hidden = !(!t.dataset.cat || t.dataset.cat === cat); });
      rail.classList.remove('is-drag', 'is-free');
      rail.scrollTo({ left: 0, behavior: 'instant' });
      aim = -1;
      measure();
      resync();
      if (!animateIn) return;
      inView().forEach((t, k) => t.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, delay: Math.min(k, 3) * 60, easing: EASE, fill: 'backwards' }));
    }
    function select(i, { focus = false, animate = true } = {}) {
      active = (i + tabs.length) % tabs.length;
      tabs.forEach((t, k) => { const on = k === active; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; });
      placeInk();
      reveal();
      if (focus) tabs[active].focus({ preventScroll: true }); // the row brings it into view (reveal), the page stays put
      if (!animate || !MO || !rail.animate) { apply(false); return; }
      if (swapping) return; // the fade already under way lands on the latest choice
      swapping = true;
      const outs = inView().map(el => el.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 200, easing: EASE, fill: 'forwards' }));
      Promise.all(outs.map(a => a.finished.catch(() => {}))).then(() => {
        swapping = false;
        apply(true);
        outs.forEach(a => a.cancel());
      });
    }

    tabs.forEach((t, i) => t.addEventListener('click', () => { if (i !== active) select(i); }));
    tablist.addEventListener('keydown', e => {
      const map = { ArrowRight: active + 1, ArrowDown: active + 1, ArrowLeft: active - 1, ArrowUp: active - 1, Home: 0, End: tabs.length - 1 };
      if (!(e.key in map)) return;
      e.preventDefault();
      select(map[e.key], { focus: true });
    });

    // One card per step. Steps during a glide count on from where the glide is going.
    const lastIdx = () => { const max = maxScroll(), p = pad(), i = items.findIndex(it => it.left - p >= max - 1); return i < 0 ? items.length - 1 : i; };
    function stepTo(j) {
      const it = items[j];
      if (!it) return;
      aim = j;
      clearTimeout(aimT);
      aimT = setTimeout(() => { aim = -1; }, 900);
      rail.scrollTo({ left: clamp(it.left - pad(), 0, maxScroll()), behavior: behavior() });
    }
    if ('onscrollend' in rail) rail.addEventListener('scrollend', () => { aim = -1; });

    // Keyboard: arrow keys move between cards; the focused card comes to the left edge (as far as the rail goes).
    rail.addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      const links = items.map(it => it.el.querySelector('a'));
      const i = links.indexOf(document.activeElement);
      if (i < 0) return;
      const j = clamp(i + (e.key === 'ArrowRight' ? 1 : -1), 0, links.length - 1);
      if (j === i) return;
      e.preventDefault();
      links[j].focus({ preventScroll: true });
      stepTo(Math.min(j, lastIdx()));
    });

    // Mouse drag: the rail follows the pointer 1:1 (snap off), then is thrown to the nearest card's left edge.
    // Touch and trackpads keep native scrolling.
    let drag = null, dragged = false, free = 0;
    const release = () => { clearTimeout(free); rail.classList.remove('is-free'); };
    rail.addEventListener('pointerdown', e => {
      if (e.pointerType !== 'mouse' || e.button !== 0 || maxScroll() < 2) return;
      drag = { x: e.clientX, sl: rail.scrollLeft, moved: false, hist: [{ x: e.clientX, t: e.timeStamp }] };
    });
    addEventListener('pointermove', e => {
      if (!drag) return;
      const dx = e.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) > 6) { drag.moved = true; clearTimeout(free); rail.classList.add('is-drag', 'is-free'); const sel = getSelection(); if (sel) sel.removeAllRanges(); }
      if (!drag.moved) return;
      rail.scrollLeft = drag.sl - dx;
      drag.hist.push({ x: e.clientX, t: e.timeStamp });
      if (drag.hist.length > 6) drag.hist.shift();
    });
    const up = () => {
      if (!drag) return;
      const d = drag;
      drag = null;
      rail.classList.remove('is-drag');
      if (!d.moved) return;
      dragged = true;
      setTimeout(() => { dragged = false; }, 60);
      const a = d.hist[0], b = d.hist[d.hist.length - 1];
      const v = b.t > a.t ? clamp((b.x - a.x) / (b.t - a.t), -3, 3) : 0; // px per ms
      const want = rail.scrollLeft - v * 200, p = pad();
      let j = 0;
      items.forEach((it, k) => { if (Math.abs(it.left - p - want) < Math.abs(items[j].left - p - want)) j = k; });
      stepTo(Math.min(j, lastIdx()));
      // snapping comes back once the throw has landed
      if ('onscrollend' in rail) rail.addEventListener('scrollend', release, { once: true });
      free = setTimeout(release, 900);
    };
    addEventListener('pointerup', up);
    addEventListener('pointercancel', up);
    rail.addEventListener('click', e => { if (dragged) { e.preventDefault(); e.stopPropagation(); } }, true);

    let rt;
    addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { measure(); reveal(); placeInk(); }, 120); });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { measure(); placeInk(); });
    addEventListener('load', () => { measure(); placeInk(); });
    select(0, { animate: false });
    if (ink) requestAnimationFrame(() => requestAnimationFrame(() => tablist.classList.add('is-ink-ready')));
  }

  /* ── Ticker: keeps moving by default (owner's choice), can be stopped (WCAG 2.2.2), rests while off screen.
       The 44px control sits in its own slot at the right end of the band, outside the moving names and their faded
       edges (home.css). Its label says what it will do; its icon shows pause or play. .has-toggle turns the moving
       band on, so without JS or with reduced motion the names stand still and wrap. ── */
  function ticker() {
    const m = $('.sx-marquee');
    if (!m || RM) return;
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'sx-marquee-toggle';
    const sync = paused => {
      m.classList.toggle('is-paused', paused);
      b.setAttribute('aria-label', paused ? 'Play product names' : 'Pause product names');
    };
    b.addEventListener('click', () => sync(!m.classList.contains('is-paused')));
    sync(false);
    m.classList.add('has-toggle');
    m.append(b);
    if (IO) new IntersectionObserver(([e]) => m.classList.toggle('is-off', !e.isIntersecting)).observe(m);
  }

  /* ── v9 hero. Runs once house-motion.js has built the carousel's arrows and dots (both scripts are deferred, so
       they exist by DOMContentLoaded). ── */
  function hero() {
    const box = $('.sx-heroes.m8-ready');
    if (!box) return;
    const track = $('.m8-track', box), slides = [...track.children], n = slides.length;
    const posOf = el => el.getBoundingClientRect().left - track.getBoundingClientRect().left + track.scrollLeft;
    const near = () => {
      let best = 0, bd = Infinity;
      slides.forEach((el, i) => { const d = Math.abs(posOf(el) - track.scrollLeft); if (d < bd) { bd = d; best = i; } });
      return best;
    };
    const two = k => String(k).padStart(2, '0');
    let live = -1, inView = true, job = null, settle = [];
    // a slide change (house easing), as fractions of D: the photograph is wiped in D ms behind a 1px scan line; the
    // old words fade out over 0-.30 (the old picture's caption or card faster, over 0-.18, so it has gone before the
    // line reaches it, whichever way the line runs); the new words fade in over .22-.70 with a 6px rise (the house
    // easing front-loads a fade, so the old words are below 4% when the new ones start: the column is never empty
    // and two headlines never show together above a trace); the slide index and the dashes change at FLIP, when
    // half of the new photograph is showing; the new picture's caption or card fades in SETTLE ms after the
    // photograph has landed, so a wipe never cuts through words
    const D = 850, OUT = .30, OUT_OVER = .18, IN0 = .22, IN1 = .70, FLIP = .21, SETTLE = 200;
    // the pager: the mono slide index ("01 / 03"; the dots carry "Slide n of N"), the indicators and the previous /
    // next buttons in one row, under the panel at its right edge, never on the photograph (home.css). The buttons
    // are house-motion's own, moved, names unchanged.
    const dotRow = $('.m8-dots', box);
    const pager = document.createElement('div');
    pager.className = 'sx-pager';
    const idx = document.createElement('span');
    idx.className = 'sx-slide-idx';
    idx.setAttribute('aria-hidden', 'true');
    pager.append(idx);
    if (dotRow) pager.append(dotRow);
    pager.append(...$$(':scope > .m8-prev, :scope > .m8-next', box));
    box.append(pager);
    box.classList.add('has-pager');
    // what the pager shows is always the slide on screen: the index, and the dash that carries aria-current
    let shown = -1;
    const label = i => { shown = i; idx.innerHTML = `<b>${two(i + 1)}</b> / ${two(n)}`; };
    const paint = i => {
      label(i);
      $$('.m8-dot', box).forEach((d, k) => {
        const on = k === i;
        if (on === (d.getAttribute('aria-current') === 'true')) return;
        if (on) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current');
      });
    };
    // house-motion.js re-reads its dots from the scroll position on every scroll; during a change the old slide is
    // laid over the new one, so its reading is wrong until the change ends: while one runs, the dashes are held to
    // the slide on screen whatever else writes them
    if (dotRow && 'MutationObserver' in window) {
      new MutationObserver(() => { if (job && shown >= 0) paint(shown); })
        .observe(dotRow, { subtree: true, attributes: true, attributeFilter: ['aria-current'] });
    }

    // the brand ident behind slide 3's picture: muted, inline, plays while its slide is on screen, holds on the
    // mark for a moment and starts again; a 44px control pauses it; under reduced motion it rests on its last frame
    const vid = (() => {
      const fig = $('.sx-slide-sv .sx-slide-media', box);
      const v = document.createElement('video');
      if (!fig || !v.canPlayType || !window.fetch || !window.URL || !URL.createObjectURL) return null;
      const ext = v.canPlayType('video/webm; codecs="vp9"') ? 'webm' : v.canPlayType('video/mp4; codecs="avc1.42E01E"') ? 'mp4' : '';
      if (!ext) return null;
      const url = `/assets/video/albacete-ident-${matchMedia('(orientation: portrait)').matches ? 'portrait' : 'landscape'}.${ext}`;
      Object.assign(v, { muted: true, defaultMuted: true, playsInline: true, preload: 'auto', tabIndex: -1, disablePictureInPicture: true });
      v.className = 'sx-slide-video';
      ['muted', 'playsinline'].forEach(a => v.setAttribute(a, ''));
      v.setAttribute('aria-hidden', 'true');
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'sx-vid-btn';
      fig.append(v, b);
      fig.classList.add('has-video');
      let paused = RM, loaded = false, hold = 0;
      const PAUSE = '<svg viewBox="0 0 14 14" aria-hidden="true" focusable="false"><path d="M2.5 1.5h3v11h-3zM8.5 1.5h3v11h-3z"/></svg>';
      const PLAY = '<svg viewBox="0 0 14 14" aria-hidden="true" focusable="false"><path d="M3 1.2 12.6 7 3 12.8z"/></svg>';
      const draw = () => { b.innerHTML = paused ? PLAY : PAUSE; b.setAttribute('aria-label', paused ? 'Play video' : 'Pause video'); };
      // a broken file leaves the photograph
      const gone = () => { clearTimeout(hold); v.remove(); b.remove(); fig.classList.remove('has-video'); };
      v.addEventListener('error', gone);
      // fetched whole as a blob, so it can be sought on any server (each pass starts part-way in)
      const load = () => {
        if (loaded) return;
        loaded = true;
        fetch(url).then(r => { if (!r.ok) throw new Error(r.status); return r.blob(); })
          .then(bl => { v.src = URL.createObjectURL(bl); }, () => { v.src = url; })
          .then(() => sync(false));
      };
      const want = () => !paused && inView && !document.hidden && live === slides.indexOf(fig.closest('.sx-slide'));
      // the ident's opening is almost black: a pass starts at 1.8s, where its lines are already drawing, and while
      // its slide is away it waits on that frame, so the wipe always uncovers a drawn picture; under reduced motion
      // it rests on its last frame (the mark) until played
      const IN = 1.8;
      const at = t => { try { v.currentTime = t; } catch (e) { /* not seekable: it plays from 0 */ } };
      const from = () => at(IN);
      v.addEventListener('loadedmetadata', () => { if (paused && RM) at(Math.max(0, v.duration - .1)); else from(); }, { once: true });
      function sync(restart) {
        clearTimeout(hold);
        if (!v.src) { if (want()) load(); return; }
        if (want()) {
          if (restart) from();
          const p = v.play();
          if (p && p.catch) p.catch(() => {});
        } else {
          v.pause();
          if (restart && !RM) hold = setTimeout(from, D + 60); // once its picture has been wiped away
        }
      }
      // at the end it holds on the mark, dips to its own black for 250ms and runs again
      v.addEventListener('ended', () => {
        clearTimeout(hold);
        hold = setTimeout(() => {
          if (!want()) return;
          v.classList.add('is-dip');
          hold = setTimeout(() => { from(); sync(false); v.classList.remove('is-dip'); }, 260);
        }, 2600);
      });
      b.addEventListener('click', () => { paused = !paused; draw(); if (!paused && v.ended) from(); sync(false); });
      document.addEventListener('visibilitychange', () => sync(false));
      draw();
      // fetched once the page has settled, so it is ready when its slide comes round
      const soon = () => (window.requestIdleCallback ? requestIdleCallback(load, { timeout: 2500 }) : setTimeout(load, 1500));
      if (document.readyState === 'complete') soon(); else addEventListener('load', soon);
      return { sync };
    })();

    // the slide on screen: its photograph's slow settle restarts, the ident follows; the index and the dashes are
    // painted here only when asked (during a change they turn at FLIP)
    function setLive(i, quiet) {
      if (!quiet) label(i);
      if (i === live) return;
      slides.forEach((s, k) => { if (k !== i && !s.classList.contains('sx-wipe-out')) s.classList.remove('is-live'); });
      const s = slides[i];
      s.classList.remove('is-live');
      void s.offsetWidth; // restart the slow settle on this slide
      s.classList.add('is-live');
      live = i;
      if (vid) vid.sync(true);
    }

    // a swipe, a key or a scroll elsewhere: the index follows the nearest slide as it passes, the live state once
    // the scroll has settled (house-motion.js keeps the dashes)
    let st = 0, ticking = false;
    track.addEventListener('scroll', () => {
      if (job) return;
      if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; if (!job) label(near()); }); }
      clearTimeout(st);
      st = setTimeout(() => { if (!job) setLive(near()); }, 140);
    }, { passive: true });
    if (IO) new IntersectionObserver(([e]) => {
      inView = e.isIntersecting;
      box.classList.toggle('is-off', !inView);
      if (vid) vid.sync(false);
    }).observe(box);

    // the change: the track steps to the new slide at once (so the focus order and the live state follow it), and
    // the old slide is laid over it for D ms, its panel clear and out of reach of the pointer. Only the photograph
    // is wiped: it is cut away toward the far side behind one 1px scan line that crosses the photograph only,
    // uncovering the new one beneath. Everything that sits on a picture (the hero caption, the evidence card, the
    // ident's pause button) fades instead: the old one with the old words, the new one SETTLE ms after the wipe has
    // landed. Under reduced motion the change is instant (house-motion.js).
    const wipe = document.createElement('div');
    wipe.className = 'sx-wipe';
    wipe.setAttribute('aria-hidden', 'true');
    const line = document.createElement('span');
    line.className = 'sx-wipe-line';
    wipe.append(line);
    box.append(wipe);
    const shows = el => el.getClientRects().length > 0;
    const PHOTO = ':scope > .sx-slide-media > img, :scope > .sx-slide-media > .sx-hero-photo > img, :scope > .sx-slide-media > .sx-slide-video';
    const OVER = ':scope > .sx-slide-media > .sx-hero-cap, :scope > .sx-ev-map, :scope > .sx-slide-media > .sx-vid-btn';
    const photoOf = s => $$(PHOTO, s).filter(shows);
    const overOf = s => $$(OVER, s).filter(shows);
    // a new picture's caption or card still fading in shows at once when anything else happens
    const settled = () => { settle.forEach(a => a.cancel()); settle = []; };
    function finish() {
      if (!job) return;
      const j = job;
      job = null;
      j.anims.forEach(a => a.cancel());
      j.A.style.transform = '';
      j.A.classList.remove('sx-wipe-out');
      wipe.classList.remove('is-on');
      track.classList.remove('m8-sliding');
      if (live !== j.from) j.A.classList.remove('is-live');
      paint(live);
      track.dispatchEvent(new Event('scroll')); // the global carousel re-reads its dots, the old slide back in place
    }
    function go(from, to, dir) {
      settled();
      const A = slides[from], B = slides[to];
      const xA = posOf(A), xB = posOf(B);
      job = { A, from, anims: [] }; // before the step, so the scroll listener stands aside
      const anims = job.anims, mine = job;
      paint(from); // until FLIP the pager keeps showing the slide that is still on screen
      track.classList.add('m8-sliding');
      track.scrollLeft = xB;
      A.classList.add('sx-wipe-out');
      A.style.transform = `translate3d(${xB - xA}px,0,0)`;
      setLive(to, true);
      // what leaves: the words over 0-OUT, whatever sat on the old picture over 0-OUT_OVER (6px up); what arrives:
      // the words over IN0-IN1 (rising 6px)
      // (a photograph fades without moving: its slow settle owns its transform)
      const away = (el, f, still) => anims.push(el.animate(still ? [{ opacity: 1 }, { opacity: 0 }] : [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translate3d(0,-6px,0)' }],
        { duration: f * D, easing: EASE, fill: 'forwards' }));
      const come = (el, still) => anims.push(el.animate(still ? [{ opacity: 0 }, { opacity: 1 }] : [{ opacity: 0, transform: 'translate3d(0,6px,0)' }, { opacity: 1, transform: 'none' }],
        { duration: (IN1 - IN0) * D, delay: IN0 * D, easing: EASE, fill: 'backwards' }));
      const cA = $('.sx-slide-copy', A), cB = $('.sx-slide-copy', B);
      if (cA) away(cA, OUT);
      overOf(A).forEach(el => away(el, OUT_OVER));
      if (cB) come(cB);
      const pA = photoOf(A), pB = photoOf(B);
      if (pA.length && pB.length) {
        // both slides show a photograph (always, side by side): the old one is wiped away over the new one. The area
        // is the two photographs together (on a narrow screen one may be shorter, above its caption strip).
        const rs = [...pA, ...pB].map(el => el.getBoundingClientRect()).filter(r => r.width && r.height);
        const o = { duration: D, easing: EASE, fill: 'forwards' };
        const L = Math.min(...rs.map(r => r.left)), R = Math.max(...rs.map(r => r.right));
        const T = Math.min(...rs.map(r => r.top)), Bm = Math.max(...rs.map(r => r.bottom)), W = R - L;
        const bx = box.getBoundingClientRect(), sr = B.getBoundingClientRect();
        const rad = parseFloat(getComputedStyle(B).borderTopLeftRadius) || 0;
        const c = (y, x) => `${y && x ? rad : 0}px`;
        const top = T - sr.top < 1, bot = sr.bottom - Bm < 1, lft = L - sr.left < 1, rgt = sr.right - R < 1;
        Object.assign(wipe.style, { left: `${L - bx.left}px`, top: `${T - bx.top}px`, width: `${W}px`, height: `${Bm - T}px`,
          borderRadius: `${c(top, lft)} ${c(top, rgt)} ${c(bot, rgt)} ${c(bot, lft)}` });
        wipe.classList.add('is-on');
        // each old photograph keeps only what is still on its side of the line (the same easing, so the edge and
        // the line move as one)
        const f = x => Math.min(1, Math.max(0, x / W));
        pA.forEach(el => {
          const r = el.getBoundingClientRect();
          if (!r.width) return;
          const p0 = dir > 0 ? f(R - r.right) : f(r.left - L), p1 = dir > 0 ? f(R - r.left) : f(r.right - L);
          const k0 = 'inset(0px 0px 0px 0px)', k1 = dir > 0 ? `inset(0px ${r.width}px 0px 0px)` : `inset(0px 0px 0px ${r.width}px)`;
          anims.push(el.animate([{ offset: 0, clipPath: k0 }, { offset: p0, clipPath: k0 }, { offset: Math.max(p0, p1), clipPath: k1 }, { offset: 1, clipPath: k1 }], o));
        });
        anims.push(line.animate([{ transform: `translate3d(${dir > 0 ? W - 1 : 0}px,0,0)` }, { transform: `translate3d(${dir > 0 ? 0 : W - 1}px,0,0)` }], o));
        // the new picture's caption or card: hidden through the wipe, then in once the photograph has settled
        settle = overOf(B).map(el => el.animate([{ opacity: 0, transform: 'translate3d(0,6px,0)' }, { opacity: 1, transform: 'none' }],
          { duration: 300, delay: D + SETTLE, easing: EASE, fill: 'backwards' }));
        settle.forEach(a => a.finished.then(() => { settle = settle.filter(x => x !== a); }, () => {}));
      } else {
        // a phone, where the evidence slide's picture is its card and not a photograph: nothing to wipe, so the
        // pictures cross-fade on the words' timing, each picture whole, with its ground and corner marks (a wipe
        // there would uncover the new words a strip at a time)
        const fig = s => { const el = $(':scope > .sx-slide-media', s); return el && shows(el) ? el : null; };
        const fA = fig(A), fB = fig(B);
        if (fA) away(fA, OUT, true);
        if (fB) come(fB, true);
        overOf(B).filter(el => !(fB && fB.contains(el))).forEach(el => come(el));
      }
      // the index and the dashes turn at FLIP, on the animations' own clock (so a slowed or paused timeline keeps them
      // in step with the picture)
      const flip = new Animation(new KeyframeEffect(null, [], { duration: FLIP * D }), document.timeline);
      flip.play();
      anims.push(flip);
      flip.finished.then(() => { if (job === mine) paint(to); }, () => {});
      Promise.all(anims.map(a => a.finished)).then(() => { if (job === mine) finish(); }, () => {});
    }
    // focus never waits on a change
    track.addEventListener('focusin', () => { finish(); settled(); });
    if (MO && document.body.animate && window.Animation && window.KeyframeEffect) {
      box.addEventListener('click', e => {
        const b = e.target.closest && e.target.closest('.m8-arrow, .m8-dot');
        if (!b || !box.contains(b) || b.closest('.m8-carousel') !== box) return;
        e.stopPropagation(); // the global carousel would slide; here it wipes
        finish();
        const from = near();
        let to, dir;
        if (b.classList.contains('m8-dot')) { to = $$('.m8-dot', box).indexOf(b); dir = to > from ? 1 : -1; }
        else { dir = b.classList.contains('m8-next') ? 1 : -1; to = (from + dir + n) % n; }
        if (to < 0 || to === from) return;
        go(from, to, dir);
      }, true);
      // a change in width (not a phone's toolbar folding away) ends a change at once
      let vw = innerWidth;
      addEventListener('resize', () => { if (innerWidth === vw) return; vw = innerWidth; finish(); settled(); }, { passive: true });
    }
    setLive(near());
  }

  /* ── v9 image scan-ins: each category and rail photograph is unveiled once by a grey cover leaving to the right
       behind a 1px accent line (700ms, home.css). Like the fade-ups, a cover is never drawn in advance on a picture
       a visitor could see: the pass starts while the picture is still just below the screen, and a picture already
       on screen when first seen is simply shown. The one exception is a rail card scrolled out of the rail's own
       window (clipped, so unseen): it waits under its cover and is unveiled as it slides in. Keyboard focus and
       printing never wait; print never shows a cover (home.css). ── */
  function scans() {
    if (!MO || !IO) return;
    const els = $$('.sx-cat .sx-panel-img, .sx-tile .sx-tile-media');
    const seen = new WeakSet(), passing = new Set();
    const show = el => { seen.add(el); passing.delete(el); el.classList.remove('is-armed', 'is-scanning'); };
    const pass = (el, d) => {
      if (seen.has(el)) return;
      seen.add(el);
      el.style.setProperty('--sx-sd', `${d}ms`);
      el.classList.add('is-scanning');
      el.classList.remove('is-armed');
      passing.add(el);
      el.addEventListener('animationend', () => { passing.delete(el); el.classList.remove('is-scanning'); }, { once: true });
    };
    // a flick that carries a picture well into the screen before its pass has run uncovers it at once
    let tick = false;
    addEventListener('scroll', () => {
      if (tick || !passing.size) return;
      tick = true;
      requestAnimationFrame(() => {
        tick = false;
        const line = innerHeight * .5;
        passing.forEach(el => { if (el.getBoundingClientRect().bottom < line) show(el); });
      });
    }, { passive: true });
    els.forEach(el => el.classList.add('sx-scan'));
    // rail cards outside the rail's window (or in a category not shown yet) wait under their cover
    const rail = $('[data-rail]');
    if (rail) {
      const rr = rail.getBoundingClientRect();
      const hio = new IntersectionObserver(es => {
        let k = 0;
        es.forEach(e => {
          if (!e.isIntersecting) return;
          hio.unobserve(e.target);
          pass(e.target, Math.min(k++, 4) * 90);
        });
      }, { root: rail, threshold: .02 });
      $$('.sx-tile-media', rail).forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.width && r.right > rr.left + 1 && r.left < rr.right - 1) return;
        el.classList.add('is-armed');
        hio.observe(el);
      });
    }
    const vio = new IntersectionObserver(es => {
      let k = 0;
      es.forEach(e => {
        if (!e.isIntersecting) return;
        const el = e.target;
        vio.unobserve(el);
        if (seen.has(el) || el.classList.contains('is-armed')) return;
        if (e.boundingClientRect.top >= innerHeight) pass(el, 120 + Math.min(k++, 4) * 90);
        else show(el); // already on screen: shown as it is
      });
    }, { rootMargin: '0px 0px 25% 0px', threshold: 0 });
    els.forEach(el => vio.observe(el));
    document.addEventListener('focusin', e => {
      const m = e.target.closest && e.target.closest('.sx-tile, .sx-cat');
      if (m) $$('.sx-scan', m).forEach(show);
    });
    addEventListener('beforeprint', () => els.forEach(show));
  }

  /* ── v9 precision panel: pointing at it or focusing it runs a scan pass through the topography at once ── */
  function precision() {
    const p = $('.sx-precision'), viz = p && $('[data-m9-topo]', p);
    if (!viz) return;
    const scan = () => viz.dispatchEvent(new Event('m9-scan'));
    p.addEventListener('pointerenter', scan);
    p.addEventListener('focus', scan);
  }

  /* ── Printing: photographs still waiting to load lazily are fetched first, so the page prints whole ── */
  function printable() {
    addEventListener('beforeprint', () => $$('.sx-home img[loading="lazy"]').forEach(i => { i.loading = 'eager'; }));
  }

  [reveals, showcase, ticker, scans, precision, printable].forEach(safe);
  /* ── The product rail's round arrows (house-motion.js's control row): on a wide screen they sit at the end of the
       tabs' row, before the rail (home.css); below 1024px they follow the rail, under it at the right, like the
       hero's pager, so on a phone they never float in a row of their own between the pills and the cards. The row
       is moved in the page order too, so the focus order matches what is seen. ── */
  function railBar() {
    const rbox = $('.sx-rail-box.m8-ready'), bar = rbox && $(':scope > .m8-controls', rbox), track = rbox && $(':scope > .m8-track', rbox);
    if (!bar || !track) return;
    const mq = matchMedia('(max-width:1023px)');
    const place = () => { if (mq.matches) track.after(bar); else track.before(bar); };
    place();
    if (mq.addEventListener) mq.addEventListener('change', place); else if (mq.addListener) mq.addListener(place);
  }

  // house-motion.js (deferred, after this file) builds the carousel controls; the hero and the rail wait for them
  let heroDone = false;
  const late = () => { if (heroDone || !$('.sx-heroes.m8-ready')) return; heroDone = true; safe(hero); safe(railBar); };
  document.addEventListener('DOMContentLoaded', late, { once: true });
  addEventListener('load', late, { once: true });
  late();
})();
