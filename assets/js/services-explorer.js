/* A service index and a visitor-controlled consultation brief. */
(() => {
  function selectedTopics(topics, ids) {
    const requested = new Set(ids);
    return topics.filter(topic => requested.has(topic.id));
  }
  function idsFromQuery(topics, query) {
    const raw = new URLSearchParams(query).get('topics') || '';
    return selectedTopics(topics, raw.split(',')).map(topic => topic.id);
  }
  function briefText(topics, ids) {
    const selected = selectedTopics(topics, ids);
    if (!selected.length) return '';
    const areas = selected.map((topic, index) =>
      `${index + 1}. ${topic.title}\nService: ${topic.track}\n` +
      topic.reviewAreas.map(area => `- ${area}`).join('\n')
    ).join('\n\n');
    return `ALBACETE MEDDEV — CONSULTATION BRIEF\n\nAreas I would like to discuss:\n\n${areas}\n\nScope and next steps to be discussed with Albacete MedDev.\n551-497-3428 | gabe@albacetemeddev.com`;
  }
  function consultationURL(topics, ids) {
    const selected = selectedTopics(topics, ids);
    if (!selected.length) return '/contact/';
    return '/contact/?' + new URLSearchParams({ topics: selected.map(topic => topic.id).join(',') }) + '#message';
  }
  function trackForTarget(topics, target) {
    if (target === 'revenue-cycle' || target === 'practice-consulting') return target;
    const topic = topics.find(item => item.id === target);
    if (!topic) return null;
    return topic.track === 'Revenue cycle' ? 'revenue-cycle' : 'practice-consulting';
  }
  // Export the state and document logic for source-level tests without a browser.
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { selectedTopics, idsFromQuery, briefText, consultationURL, trackForTarget };
  }
  if (typeof document === 'undefined') return;
  const data = document.getElementById('service-topics');
  if (!data) return;
  let topics;
  try { topics = JSON.parse(data.textContent); } catch { return; }
  const initialSelection = idsFromQuery(topics, window.location.search);
  const message = document.querySelector('#message');
  if (message && initialSelection.length && !message.value) {
    message.value = briefText(topics, initialSelection);
  }
  const main = document.querySelector('.services-experience');
  if (!main) return;

  const options = [...main.querySelectorAll('[data-topic]')];
  const scopes = [...main.querySelectorAll('[data-dossier]')];
  const trackOptions = [...main.querySelectorAll('[data-track]')];
  const trackPanels = [...main.querySelectorAll('[data-track-panel]')];
  const addButtons = [...main.querySelectorAll('[data-add]')];
  const selected = new Set(initialSelection);
  const rail = main.querySelector('.service-tracks');
  const brief = main.querySelector('.consultation-brief');
  const reviewButton = main.querySelector('.review-brief');
  const status = main.querySelector('.brief-status');
  const dialog = document.querySelector('.service-brief-dialog');
  const dialogItems = dialog.querySelector('.brief-items');
  const exportStatus = dialog.querySelector('.brief-export-status');
  const fallback = dialog.querySelector('.brief-copy-fallback');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let activeTrack = trackOptions[0].dataset.track;
  let activeId = activeTrack;
  let previousBodyOverflow = '';
  let panelAnimation;

  main.classList.add('is-enhanced');
  rail.setAttribute('role', 'tablist');
  rail.setAttribute('aria-orientation', 'horizontal');
  addButtons.forEach(button => { button.hidden = false; });

  function updateURL() {
    const url = new URL(window.location.href);
    const ids = selectedTopics(topics, selected).map(topic => topic.id);
    if (ids.length) url.searchParams.set('topics', ids.join(','));
    else url.searchParams.delete('topics');
    url.hash = activeId;
    window.history.replaceState(null, '', url);
  }
  function selectTrack(id, { animate = false, update = false } = {}) {
    if (!trackPanels.some(panel => panel.dataset.trackPanel === id)) return;
    const changed = activeTrack !== id;
    activeTrack = id;
    activeId = id;
    trackOptions.forEach(option => {
      const active = option.dataset.track === id;
      option.classList.toggle('is-active', active);
      option.setAttribute('aria-selected', String(active));
      option.tabIndex = active ? 0 : -1;
    });
    trackPanels.forEach(panel => { panel.hidden = panel.dataset.trackPanel !== id; });
    const panel = trackPanels.find(item => !item.hidden);
    if (changed && animate && !reducedMotion.matches && panel.animate) {
      panelAnimation?.cancel();
      panelAnimation = panel.animate([{ opacity: .3 }, { opacity: 1 }], { duration: 180, easing: 'ease-out' });
    }
    if (update) updateURL();
  }
  function revealTarget(id, animate = false) {
    const track = trackForTarget(topics, id);
    if (!track) return;
    selectTrack(track, { animate });
    const scope = scopes.find(item => item.dataset.dossier === id);
    if (scope) { scope.open = true; activeId = id; }
  }
  trackOptions.forEach((option, i) => {
    option.setAttribute('role', 'tab');
    option.setAttribute('aria-controls', option.dataset.track);
    option.addEventListener('click', event => {
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      selectTrack(option.dataset.track, { animate: true, update: true });
    });
    option.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = trackOptions[(i + 1) % trackOptions.length];
      if (event.key === 'ArrowLeft') next = trackOptions[(i - 1 + trackOptions.length) % trackOptions.length];
      if (event.key === 'Home') next = trackOptions[0];
      if (event.key === 'End') next = trackOptions.at(-1);
      if (event.key === ' ') { event.preventDefault(); selectTrack(option.dataset.track, { animate: true, update: true }); }
      if (next) { event.preventDefault(); next.focus(); selectTrack(next.dataset.track, { animate: true, update: true }); }
    });
  });
  trackPanels.forEach(panel => {
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', 'track-' + panel.dataset.trackPanel);
    panel.tabIndex = 0;
  });
  options.forEach(option => {
    option.setAttribute('aria-describedby', 'caption-' + option.dataset.topic);
    option.addEventListener('click', () => {
      requestAnimationFrame(() => {
        if (option.closest('details').open) { activeId = option.dataset.topic; updateURL(); }
      });
    });
  });

  function renderBrief() {
    const items = selectedTopics(topics, selected);
    main.querySelector('.brief-count').textContent = String(items.length);
    main.querySelector('.brief-description').textContent = items.length
      ? items.map(topic => topic.title).join(' · ')
      : 'Add an area you’d like to discuss.';
    reviewButton.disabled = !items.length;
    brief.hidden = !items.length;
    main.querySelectorAll('.consultation-action').forEach(link => { link.href = consultationURL(topics, selected); });
    options.forEach(option => {
      const added = selected.has(option.dataset.topic);
      option.classList.toggle('is-added', added);
      option.setAttribute('aria-label', option.querySelector('.option-name').textContent + (added ? ', added to consultation brief' : ''));
    });
    addButtons.forEach(button => {
      const added = selected.has(button.dataset.add);
      button.setAttribute('aria-pressed', String(added));
      button.querySelector('.add-label').textContent = added ? 'Topic saved · remove' : 'Save topic for consultation';
      button.querySelector('.add-symbol').textContent = added ? '−' : '+';
    });
    dialogItems.replaceChildren();
    items.forEach((topic, i) => {
      const row = document.createElement('div'); row.className = 'brief-item';
      const count = document.createElement('span'); count.className = 'brief-item-number'; count.textContent = String(i + 1).padStart(2, '0');
      const text = document.createElement('div');
      const heading = document.createElement('h3'); heading.textContent = topic.title;
      const detail = document.createElement('p'); detail.textContent = topic.track + ' · ' + topic.reviewAreas.join('; ');
      text.append(heading, detail);
      const remove = document.createElement('button'); remove.type = 'button'; remove.dataset.remove = topic.id; remove.className = 'remove-brief-item'; remove.textContent = '×'; remove.setAttribute('aria-label', 'Remove ' + topic.title);
      row.append(count, text, remove); dialogItems.append(row);
    });
    dialog.querySelector('.brief-empty').hidden = !!items.length;
    dialog.querySelectorAll('.copy-brief, .download-brief, .clear-brief').forEach(button => { button.disabled = !items.length; });
    dialog.querySelector('.brief-contact').href = consultationURL(topics, selected);
    fallback.hidden = true;
    exportStatus.textContent = '';
  }
  function toggle(id) {
    if (!topics.some(topic => topic.id === id)) return;
    const removing = selected.has(id);
    if (removing) selected.delete(id); else selected.add(id);
    renderBrief(); updateURL();
    const topic = topics.find(topic => topic.id === id);
    status.textContent = `${topic.title} ${removing ? 'removed from' : 'added to'} your consultation brief. ${selected.size} ${selected.size === 1 ? 'area' : 'areas'} selected.`;
  }
  addButtons.forEach(button => button.addEventListener('click', () => toggle(button.dataset.add)));

  reviewButton.addEventListener('click', () => {
    if (!selected.size) return;
    previousBodyOverflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = 'hidden';
  });
  dialog.querySelector('.close-brief').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.style.overflow = previousBodyOverflow;
    if (reviewButton.disabled) trackOptions.find(option => option.dataset.track === activeTrack)?.focus();
  });
  dialogItems.addEventListener('click', event => {
    const button = event.target.closest('[data-remove]');
    if (!button) return;
    const index = [...dialogItems.querySelectorAll('[data-remove]')].indexOf(button);
    toggle(button.dataset.remove);
    const remaining = [...dialogItems.querySelectorAll('[data-remove]')];
    (remaining[Math.min(index, remaining.length - 1)] || dialog.querySelector('.close-brief')).focus();
  });
  dialog.querySelector('.clear-brief').addEventListener('click', () => {
    selected.clear(); renderBrief(); updateURL();
    status.textContent = 'Consultation brief cleared.';
    dialog.querySelector('.close-brief').focus();
  });
  dialog.querySelector('.copy-brief').addEventListener('click', async () => {
    const text = briefText(topics, selected);
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      exportStatus.textContent = 'Brief copied.';
    } catch {
      fallback.value = text; fallback.hidden = false; fallback.focus(); fallback.select();
      exportStatus.textContent = 'Select and copy the brief below, or download a text file.';
    }
  });
  dialog.querySelector('.download-brief').addEventListener('click', () => {
    const text = briefText(topics, selected);
    if (!text) return;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a'); link.href = url; link.download = 'albacete-consultation-brief.txt';
    document.body.append(link); link.click(); link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    exportStatus.textContent = 'Text file download started.';
  });
  window.addEventListener('hashchange', () => revealTarget(window.location.hash.slice(1), true));
  window.addEventListener('popstate', () => {
    selected.clear(); idsFromQuery(topics, window.location.search).forEach(id => selected.add(id));
    revealTarget(window.location.hash.slice(1)); renderBrief();
  });
  const initialTarget = window.location.hash.slice(1);
  revealTarget(trackForTarget(topics, initialTarget) ? initialTarget : activeTrack);
  renderBrief();
})();
