/* Responsive Healing Matrix ident: one short session opening, always skippable. */
(() => {
  const root = document.documentElement;
  const replay = document.querySelector('[data-replay-intro]');
  const auto = root.classList.contains('amd-intro-pending');
  const clearPending = () => root.classList.remove('amd-intro-pending');
  if (!replay || !window.HTMLDialogElement) { clearPending(); return; }

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const duration = 4400;
  const modal = document.createElement('dialog');
  modal.className = 'amd-intro';
  modal.setAttribute('aria-label', 'Albacete MedDev introduction');
  modal.innerHTML = `
    <div class="amd-intro__surface">
      <canvas class="amd-intro__canvas" aria-hidden="true"></canvas>
      <div class="amd-intro__identity">
        <img class="amd-intro__logo" src="/assets/img/logo-white.png" width="720" height="247" alt="Albacete MedDev">
        <p class="amd-intro__descriptor">CLINICAL OPERATING PARTNER</p>
      </div>
    </div>
    <div class="amd-intro__top" aria-hidden="true"><span>Wound care &amp; practice support</span><span class="amd-intro__edition">Care, connected.</span></div>
    <div class="amd-intro__footer">
      <div class="amd-intro__progress" aria-hidden="true"></div>
      <p class="amd-intro__caption">Every connection supports care.<span>The Albacete introduction</span></p>
      <div class="amd-intro__controls">
        <button class="amd-intro__pause" type="button" aria-label="Pause introduction" aria-pressed="false">
          <svg viewBox="0 0 16 16" aria-hidden="true"><path class="intro-pause" d="M3 2h3v12H3zM10 2h3v12h-3z"/><path class="intro-play" d="m4 2 10 6-10 6z"/></svg>
        </button>
        <button class="amd-intro__enter" type="button">Enter the site <span aria-hidden="true">→</span></button>
      </div>
    </div>`;
  document.body.append(modal);
  if (!getComputedStyle(modal).getPropertyValue('--intro-ink').trim()) {
    clearPending(); modal.remove(); replay.hidden = true; return;
  }
  replay.hidden = false;
  const canvas = modal.querySelector('canvas');
  const ctx = canvas.getContext('2d');
  const logo = modal.querySelector('.amd-intro__logo');
  const identity = modal.querySelector('.amd-intro__identity');
  const descriptor = modal.querySelector('.amd-intro__descriptor');
  const progress = modal.querySelector('.amd-intro__progress');
  const pause = modal.querySelector('.amd-intro__pause');
  const enter = modal.querySelector('.amd-intro__enter');
  let width = 0, height = 0, elapsed = 0, previous = 0, raf = 0, watchdog = 0;
  let paused = false, leaving = false, returnFocus, flight;
  let strands = [], signal = [], animations = [];
  const clamp = value => Math.max(0, Math.min(1, value));
  const ease = value => { const t = clamp(value); return t * t * (3 - 2 * t); };
  const point = (a, b, c, d, t) => {
    const s = 1 - t;
    return { x: s*s*s*a.x + 3*s*s*t*b.x + 3*s*t*t*c.x + t*t*t*d.x,
      y: s*s*s*a.y + 3*s*s*t*b.y + 3*s*t*t*c.y + t*t*t*d.y };
  };

  function resize() {
    if (!modal.open || !ctx) return;
    width = modal.clientWidth; height = modal.clientHeight;
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio); canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    const rect = logo.getBoundingClientRect();
    const anchor = { x: rect.left + rect.width * .951, y: rect.top + rect.height * .15 };
    strands = Array.from({length: 11}, (_, i) => {
      const lane = i - 5;
      const a = { x: -width * .12, y: height * .58 + lane * height * .09 };
      const b = { x: width * .32, y: height * 1.08 + lane * height * .036 };
      const c = { x: width * .59, y: -height * .24 + lane * height * .064 };
      const d = { x: width * 1.12, y: height * .42 + lane * height * .108 };
      return Array.from({length: 101}, (_, n) => point(a, b, c, d, n / 100));
    });
    signal = Array.from({length: 121}, (_, n) => point(
      {x: -20, y: height * .77}, {x: width * .44, y: height * 1.02},
      {x: anchor.x - width * .13, y: anchor.y}, anchor, n / 120));
    render(elapsed);
  }

  function stroke(points, start, end, color, lineWidth = 1) {
    const from = Math.max(0, Math.floor(start * (points.length - 1)));
    const to = Math.min(points.length - 1, Math.ceil(end * (points.length - 1)));
    if (to <= from) return;
    ctx.beginPath(); ctx.moveTo(points[from].x, points[from].y);
    for (let i = from + 1; i <= to; i++) ctx.lineTo(points[i].x, points[i].y);
    ctx.strokeStyle = color; ctx.lineWidth = lineWidth; ctx.stroke();
  }

  function render(time) {
    logo.style.opacity = .12 + .88 * ease(time / 1150);
    descriptor.style.opacity = ease((time - 750) / 950);
    descriptor.style.transform = `translateY(${(1 - ease((time - 750) / 950)) * 9}px)`;
    progress.style.transform = `scaleX(${clamp(time / duration)})`;
    if (!ctx || !width) return;
    ctx.clearRect(0, 0, width, height);
    const join = ease((time - 200) / 1750);
    const settle = 1 - .24 * ease((time - 3100) / 1300);
    const wash = ctx.createLinearGradient(0, 0, width, 0);
    wash.addColorStop(0, `rgba(130,164,160,${.21 * settle})`);
    wash.addColorStop(.25, `rgba(130,164,160,${.39 * settle})`);
    wash.addColorStop(.42, 'rgba(130,164,160,.035)');
    wash.addColorStop(.69, 'rgba(130,164,160,.07)');
    wash.addColorStop(.87, `rgba(130,164,160,${.43 * settle})`);
    wash.addColorStop(1, `rgba(130,164,160,${.21 * settle})`);
    strands.forEach((line, i) => {
      const gap = (1 - join) * (.075 + i * .004);
      stroke(line, 0, .5 - gap, wash, i % 3 === 0 ? 1 : .6);
      stroke(line, .5 + gap, 1, wash, i % 3 === 0 ? 1 : .6);
    });
    // Sparse cross-links establish a connected scaffold without a particle field.
    [14, 25, 76, 87].forEach((step, j) => {
      for (let i = j % 2; i < strands.length - 1; i += 3) {
        const a = strands[i][step], b = strands[i + 1][step + 2];
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = `rgba(162,183,170,${.23 * join * settle})`; ctx.lineWidth = .6; ctx.stroke();
      }
    });
    const travel = ease((time - 1000) / 1900);
    const fade = 1 - ease((time - 2900) / 1000);
    if (travel > 0 && fade > 0) {
      stroke(signal, 0, travel, `rgba(213,181,117,${.16 * fade})`, .8);
      stroke(signal, Math.max(0, travel - .065), travel, `rgba(230,201,145,${.78 * fade})`, 1.3);
      const head = signal[Math.round(travel * 120)];
      ctx.beginPath(); ctx.arc(head.x, head.y, 1.65, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(244,222,172,${fade})`; ctx.fill();
    }
  }

  function finish() { if (modal.open) modal.close(); }
  function leave(animate = false) {
    if (!modal.open || leaving) return;
    leaving = true; cancelAnimationFrame(raf); clearTimeout(watchdog);
    const target = document.querySelector('.nav-logo img');
    if (!animate || reduced.matches || !target || !logo.complete || !logo.animate) { finish(); return; }
    const from = logo.getBoundingClientRect(), to = target.getBoundingClientRect();
    if (to.top < 0 || to.bottom > innerHeight) { finish(); return; }
    flight = logo.cloneNode(); flight.className = 'amd-intro__flight'; flight.alt = '';
    Object.assign(flight.style, {left: `${from.left}px`, top: `${from.top}px`, width: `${from.width}px`, height: `${from.height}px`, opacity: '1'});
    modal.append(flight); identity.style.visibility = 'hidden'; modal.classList.add('is-leaving');
    const animation = flight.animate([
      {transform: 'translate(0, 0) scale(1)'},
      {transform: `translate(${to.left - from.left}px, ${to.top - from.top}px) scale(${to.width / from.width})`}
    ], {duration: 650, easing: 'cubic-bezier(.76,0,.24,1)', fill: 'forwards'});
    animations.push(animation);
    animation.finished.then(finish).catch(finish);
    watchdog = setTimeout(finish, 850);
  }
  function tick(now) {
    if (!modal.open || paused || leaving) return;
    elapsed += Math.min(now - previous, 100); previous = now;
    try { render(elapsed); } catch { leave(); return; }
    if (elapsed >= duration) leave(true);
    else raf = requestAnimationFrame(tick);
  }
  function guard() { clearTimeout(watchdog); watchdog = setTimeout(() => leave(), duration - elapsed + 1600); }
  function play(automatic = false) {
    if (modal.open) return;
    returnFocus = automatic ? null : replay;
    elapsed = reduced.matches ? duration : 0;
    previous = performance.now(); paused = false; leaving = false;
    pause.setAttribute('aria-pressed', 'false'); pause.setAttribute('aria-label', 'Pause introduction');
    pause.hidden = reduced.matches;
    identity.style.visibility = ''; modal.classList.remove('is-leaving');
    try { modal.showModal(); } catch { clearPending(); return; }
    clearPending();
    try { sessionStorage.setItem('amd-intro-v3', '1'); } catch { /* Storage is optional. */ }
    enter.focus({preventScroll: true});
    resize();
    if (reduced.matches) { render(duration); return; }
    guard(); raf = requestAnimationFrame(tick);
  }
  pause.addEventListener('click', () => {
    if (leaving) return;
    paused = !paused; pause.setAttribute('aria-pressed', String(paused));
    pause.setAttribute('aria-label', paused ? 'Resume introduction' : 'Pause introduction');
    if (paused) { cancelAnimationFrame(raf); clearTimeout(watchdog); }
    else { previous = performance.now(); guard(); raf = requestAnimationFrame(tick); }
  });
  enter.addEventListener('click', () => leave());
  modal.addEventListener('keydown', event => {
    if (event.key !== 'Tab') return;
    const first = pause.hidden ? enter : pause;
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); enter.focus();
    } else if (!event.shiftKey && document.activeElement === enter) {
      event.preventDefault(); first.focus();
    }
  });
  modal.addEventListener('cancel', event => { event.preventDefault(); leave(); });
  modal.addEventListener('close', () => {
    cancelAnimationFrame(raf); clearTimeout(watchdog);
    animations.forEach(animation => animation.cancel()); animations = [];
    flight?.remove(); flight = null;
    // Only a user-initiated replay returns focus to its trigger.
    if (returnFocus) returnFocus.focus({preventScroll: true});
  });
  replay.addEventListener('click', () => play());
  window.addEventListener('resize', () => { if (leaving) finish(); else resize(); }, {passive: true});
  document.addEventListener('visibilitychange', () => { if (document.hidden && modal.open) leave(); });
  reduced.addEventListener('change', () => { if (modal.open) leave(); });
  if (auto && !reduced.matches && !navigator.connection?.saveData && !location.hash) play(true);
  else clearPending();
})();
