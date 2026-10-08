/* Small, progressive enhancements: product comparison and contact context. */
(() => {
  const store = {
    get(key) { try { return sessionStorage.getItem(key); } catch { return null; } },
    set(key, value) { try { sessionStorage.setItem(key, value); } catch { /* Session storage is optional. */ } }
  };
  const esc = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let dataPromise;
  function products() {
    return dataPromise ||= fetch('/assets/data/portfolio.json?v=20261008-hydro-box').then(r => {
      if (!r.ok) throw new Error('Portfolio unavailable');
      return r.json();
    });
  }
  let toastTimer;
  function announce(message) {
    let el = document.querySelector('.toast-status');
    if (!el) { el = document.createElement('p'); el.className = 'toast-status'; el.setAttribute('role','status'); document.body.append(el); }
    el.hidden = false; el.textContent = message;
    clearTimeout(toastTimer); toastTimer = setTimeout(() => { el.hidden = true; }, 4200);
  }
  async function initComparison() {
    let data;
    try { data = await products(); } catch {
      document.querySelectorAll('[data-compare]').forEach(b => { b.hidden = true; });
      return;
    }
    const byId = new Map(data.map(d => [d.slug,d]));
    document.documentElement.classList.add('comparison-ready');
    let saved = [];
    try { const value = JSON.parse(store.get('amd-compare') || '[]'); if (Array.isArray(value)) saved = [...new Set(value)].filter(x=>byId.has(x)).slice(0,3); } catch { /* Ignore malformed optional state. */ }
    const tray = document.createElement('aside'); tray.className = 'compare-tray'; tray.setAttribute('aria-label','Product comparison'); tray.hidden = true;
    tray.innerHTML = '<div><strong data-compare-count></strong><p data-compare-names></p></div><button type="button" data-clear-compare>Clear</button><button type="button" data-open-compare>Compare products ↗</button>';
    document.body.append(tray);
    const modal = document.createElement('dialog'); modal.className='compare-dialog'; modal.setAttribute('aria-labelledby','compare-title');
    modal.innerHTML='<header><h2 id="compare-title">A clearer view of your options.</h2><button class="close-compare" type="button" aria-label="Close comparison">×</button></header><p class="compare-hint">Swipe across the table to see each product.</p><div class="compare-scroll" role="region" aria-label="Scrollable product comparison" tabindex="0"></div><footer><p>Compare product characteristics, then review current manufacturer instructions. This view does not establish equivalence, clinical suitability, or coverage.</p><a class="clinical-button" data-discuss-comparison href="/contact/">Discuss these products ↗</a></footer>';
    document.body.append(modal);
    function render() {
      store.set('amd-compare',JSON.stringify(saved)); tray.hidden = !saved.length;
      tray.querySelector('[data-compare-count]').textContent=`${saved.length} of 3 products selected`;
      tray.querySelector('[data-compare-names]').textContent=saved.map(id=>byId.get(id).name).join(' · ');
      document.querySelectorAll('[data-compare]').forEach(button => {
        const active=saved.includes(button.dataset.compare); button.setAttribute('aria-pressed',String(active));
        button.textContent = button.classList.contains('save-product') ? (active?'✓ Added to comparison':'+ Add to comparison') : (active?'✓ Selected':'+ Compare');
        button.setAttribute('aria-label',`${active?'Remove':'Add'} ${byId.get(button.dataset.compare)?.name || 'product'} ${active?'from':'to'} comparison`);
      });
    }
    document.addEventListener('click',event=>{
      const button=event.target.closest('[data-compare]'); if(!button)return;
      const id=button.dataset.compare;if(!byId.has(id))return;
      if(saved.includes(id)){saved=saved.filter(x=>x!==id);announce(`${byId.get(id).name} removed.`);}
      else if(saved.length>=3){announce('Compare up to three products. Remove one selection to add another.');return;}
      else {saved.push(id);announce(`${byId.get(id).name} added to your comparison.`);}
      render();
    });
    tray.querySelector('[data-clear-compare]').addEventListener('click',()=>{saved=[];render();document.querySelector('[data-compare],#visual-search')?.focus();announce('Comparison cleared.');});
    tray.querySelector('[data-open-compare]').addEventListener('click',()=>{
      const items=saved.map(id=>byId.get(id));if(!items.length)return;
      const fields=[['Material / technology','material'],['Format','form'],['Product source','maker'],['Overview','brief']];
      const visual = p => p.photo
        ? `<img src="/assets/images/editorial/${esc(p.photo)}-640.webp" width="640" height="427" alt="">`
        : `<div class="compare-identity">${p.identity ? `<img src="/assets/images/editorial/${esc(p.identity)}" alt="">` : `<span>${esc(p.form)}</span>`}</div>`;
      let html='<table class="compare-table"><caption class="sr-only">Selected product characteristics</caption><thead><tr><th scope="col">Product</th>'+items.map(p=>`<th scope="col">${visual(p)}${esc(p.name)}</th>`).join('')+'</tr></thead><tbody>';
      fields.forEach(([label,key])=>{html+=`<tr><th scope="row">${label}</th>${items.map(p=>`<td>${esc(p[key])}</td>`).join('')}</tr>`;});
      html+='<tr><th scope="row">Explore</th>'+items.map(p=>`<td><a href="${esc(p.url)}">Product details →</a>${p.source?`<br><a href="${esc(p.source)}" target="_blank" rel="noopener">Source information ↗</a>`:''}</td>`).join('')+'</tr></tbody></table>';
      modal.querySelector('.compare-scroll').innerHTML=html;
      modal.querySelector('[data-discuss-comparison]').href='/contact/?products='+saved.map(encodeURIComponent).join(',');
      modal.showModal(); modal.querySelector('.close-compare').focus();
    });
    modal.querySelector('.close-compare').addEventListener('click',()=>modal.close());
    modal.addEventListener('click',event=>{if(event.target===modal){const r=modal.getBoundingClientRect();if(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom)modal.close();}});
    render();
  }
  const catalog=document.querySelector('.visual-catalog-tools');
  if(catalog){
    const query=document.getElementById('visual-search'),select=document.getElementById('visual-category');
    const cards=[...document.querySelectorAll('.catalog-item')].map(card=>({card,text:card.textContent.toLowerCase()}));
    const groups=[...document.querySelectorAll('.catalog-group')];
    function filter(){
      const words=query.value.toLowerCase().trim().split(/\s+/).filter(Boolean);let count=0;
      cards.forEach(({card,text})=>{card.hidden=!(words.every(word=>text.includes(word))&&(!select.value||select.value===card.dataset.category));if(!card.hidden)count++;});
      groups.forEach(group=>{group.hidden=![...group.querySelectorAll('.catalog-item')].some(card=>!card.hidden);});
      document.querySelector('[data-visual-status]').textContent=`${count} of ${cards.length} products shown`;
      document.querySelector('.catalog-no-results').hidden=!!count;
    }
    query.addEventListener('input',filter);select.addEventListener('change',filter);
    catalog.querySelector('[data-reset-visual]').addEventListener('click',()=>{query.value='';select.value='';filter();query.focus();});
    window.addEventListener('hashchange',()=>{query.value='';select.value='';filter();});
    catalog.hidden=false;filter();
  }
  if(document.querySelector('[data-compare]')||store.get('amd-compare'))initComparison();
  const ids=new URLSearchParams(location.search).get('products');
  if(location.pathname.replace(/\/$/,'')==='/contact'&&ids){
    products().then(data=>{
      const chosen=ids.split(',').slice(0,3).map(id=>data.find(d=>d.slug===id)).filter(Boolean);
      const message=document.querySelector('textarea[name="message"]');
      if(chosen.length&&message&&!message.value)message.value='I would like to discuss '+chosen.map(p=>p.name).join(', ')+'.\n\nPlease send current product information and help me review availability, training, and practice requirements.';
    }).catch(()=>{});
  }
  if(document.querySelector('.editorial-product,.physician-home')){
    const bar=document.createElement('div');bar.className='page-progress';bar.setAttribute('aria-hidden','true');document.body.append(bar);let queued=false;
    function progress(){queued=false;const length=document.documentElement.scrollHeight-innerHeight;bar.style.transform=`scaleX(${length>0?Math.min(1,Math.max(0,scrollY/length)):0})`;}
    window.addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(progress);}},{passive:true});window.addEventListener('resize',progress);progress();
  }
})();
