const root = document.documentElement;
const tokenDefaults = {
  forest:'#0C3D32', gold:'#C99A47', warm:'#FFFAF0', paper:'#F7F3EA', ink:'#17241F', muted:'#607067', sage:'#84A393',
  radius:24, section:120, text:16, h1:76, h2:56, h3:36, shadow:10
};
const tokenMap = {
  forest:'--rs-forest', gold:'--rs-gold', warm:'--rs-warm', paper:'--rs-paper', ink:'--rs-ink', muted:'--rs-muted', sage:'--rs-sage',
  radius:'--rs-radius', section:'--rs-section', text:'--rs-text', h1:'--rs-h1', h2:'--rs-h2', h3:'--rs-h3'
};
const presets = {
  rally:{label:'Rally Core', forest:'#0C3D32', gold:'#C99A47', warm:'#FFFAF0', paper:'#F7F3EA', ink:'#17241F', muted:'#607067', sage:'#84A393', radius:24, section:120, text:16, h1:76, h2:56, h3:36, shadow:10},
  heritage:{label:'Heritage Green', forest:'#183C34', gold:'#C59A52', warm:'#F7F1E5', paper:'#FFFDF7', ink:'#17211D', muted:'#6F766F', sage:'#829D8F', radius:14, section:108, text:18, h1:60, h2:42, h3:26, shadow:10},
  slate:{label:'Slate & Sage', forest:'#233D3E', gold:'#9C8960', warm:'#F4F2EC', paper:'#FCFBF7', ink:'#182425', muted:'#687273', sage:'#7E9990', radius:18, section:92, text:18, h1:56, h2:38, h3:25, shadow:6},
  warm:{label:'Warm Earth', forest:'#2C3E35', gold:'#C48745', warm:'#FAF2E7', paper:'#F7F3EA', ink:'#241F18', muted:'#746D62', sage:'#9AA087', radius:20, section:100, text:18, h1:58, h2:40, h3:26, shadow:9}
};
function hexToRgb(hex){ const v=String(hex).replace('#',''); return [parseInt(v.slice(0,2),16),parseInt(v.slice(2,4),16),parseInt(v.slice(4,6),16)]; }
function shade(hex, amt){ const [r,g,b]=hexToRgb(hex); const clamp=n=>Math.max(0,Math.min(255,n)); const to=n=>clamp(n).toString(16).padStart(2,'0'); return '#'+to(r+amt)+to(g+amt)+to(b+amt); }
function getVal(name){ return localStorage.getItem('rally-studio-token-'+name) ?? tokenDefaults[name]; }
function unit(name, value){ return ['radius','section','text','h1','h2','h3'].includes(name) ? value+'px' : value; }
function applyToken(name, value, persist=true){
  if(name==='forest'){ root.style.setProperty('--rs-forest', value); root.style.setProperty('--rs-forest-2', shade(value,-20)); }
  else if(name==='radius'){ root.style.setProperty('--rs-radius', value+'px'); root.style.setProperty('--rs-radius-sm', Math.max(6,Math.round(value*.65))+'px'); root.style.setProperty('--rs-radius-lg', Math.round(value*1.5)+'px'); }
  else if(name==='shadow'){
    const v=Number(value); root.style.setProperty('--rs-shadow', `0 18px 50px rgba(24,35,31,${v/100})`); root.style.setProperty('--rs-shadow-soft', `0 12px 34px rgba(24,35,31,${Math.max(3,v-2)/100})`);
  }
  else if(tokenMap[name]) root.style.setProperty(tokenMap[name], unit(name,value));
  if(persist) localStorage.setItem('rally-studio-token-'+name,value);
  document.querySelectorAll(`[data-output="${name}"]`).forEach(o=>o.textContent = name==='shadow' ? value+'%' : unit(name,value));
  document.querySelectorAll(`[data-token="${name}"]`).forEach(input=>{ if(input.value != value) input.value = value; });
  updateReadout();
}
function initTokens(){
  Object.keys(tokenDefaults).forEach(name=>{
    const val = getVal(name);
    applyToken(name,val,false);
    document.querySelectorAll(`[data-token="${name}"]`).forEach(input=>{
      input.value = val;
      input.addEventListener('input',e=>applyToken(name,e.target.value));
    });
  });
}
function initNav(){
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(a=>{ if(a.getAttribute('href')===path) a.classList.add('active'); });
  const btn=document.querySelector('[data-menu]'); const side=document.querySelector('.sidebar');
  if(btn&&side) btn.addEventListener('click',()=>side.classList.toggle('open'));
}
function initSearch(){
  const input=document.querySelector('#studioSearch'); if(!input) return;
  const items=[...document.querySelectorAll('[data-search-item]')];
  input.addEventListener('input',()=>{
    const q=input.value.trim().toLowerCase();
    items.forEach(item=>{ item.style.display = !q || item.textContent.toLowerCase().includes(q) ? '' : 'none'; });
  });
}
function applyPreset(key){ const p=presets[key]; if(!p) return; Object.entries(p).forEach(([k,v])=>{ if(k!=='label') applyToken(k,v); }); localStorage.setItem('rally-studio-preset', key); }
function resetTokens(){ Object.entries(tokenDefaults).forEach(([k,v])=>applyToken(k,v)); localStorage.removeItem('rally-studio-preset'); }
function cssTokensText(){
  const keys=['forest','forest-2','gold','sage','warm','paper','ink','muted','radius-sm','radius','radius-lg','section','text','h1','h2','h3'];
  const styles=getComputedStyle(root);
  return ':root{\n' + keys.map(k=>`  --rs-${k}: ${styles.getPropertyValue('--rs-'+k).trim()};`).join('\n') + '\n}';
}
function updateReadout(){ const el=document.querySelector('[data-token-readout]'); if(el) el.textContent=cssTokensText(); }
function initPlayground(){
  document.querySelectorAll('[data-preset]').forEach(btn=>btn.addEventListener('click',()=>applyPreset(btn.dataset.preset)));
  document.querySelectorAll('[data-reset-tokens]').forEach(btn=>btn.addEventListener('click',resetTokens));
  document.querySelectorAll('[data-copy-tokens]').forEach(btn=>btn.addEventListener('click',async()=>{ try{ await navigator.clipboard.writeText(cssTokensText()); btn.textContent='Copied'; setTimeout(()=>btn.textContent='Copy CSS tokens',1400);}catch(e){ btn.textContent='Copy failed'; }}));
  document.querySelectorAll('[data-preview-mode]').forEach(btn=>btn.addEventListener('click',()=>{
    document.querySelectorAll('[data-preview-mode]').forEach(b=>b.classList.remove('active')); btn.classList.add('active');
    document.querySelector('.preview-stack')?.classList.toggle('mobile-preview', btn.dataset.previewMode==='mobile');
  }));
  updateReadout();
}
document.addEventListener('DOMContentLoaded',()=>{initTokens();initNav();initSearch();initPlayground();});

/* Phase 6 composer */
const sectionLabels = {
  nav:'Navigation', hero:'Homepage hero', capabilities:'Capability strip', software:'Software showcase', quote:'Editorial quote', story:'Organizer story', support:'Support promise', pricing:'Transparent pricing', pricingCards:'Pricing cards', cta:'CTA banner', footer:'Footer'
};
const composerTemplates = {
  home:['nav','hero','capabilities','software','quote','story','support','pricing','cta','footer'],
  pricing:['nav','hero','pricingCards','pricing','support','cta','footer'],
  features:['nav','hero','software','quote','support','cta','footer']
};
let currentSections = JSON.parse(localStorage.getItem('rally-studio-page-sections') || 'null') || composerTemplates.home.slice();
function sectionMarkup(type){
  switch(type){
    case 'nav': return `<div class="live-page-nav"><div class="live-logo"><span class="live-logo-mark">R</span>RALLY</div><div class="links"><span>Features</span><span>Pricing</span><span>Resources</span><span>Support</span><a class="btn gold" style="min-height:36px;padding:0 14px;font-size:12px">Book Demo</a></div></div>`;
    case 'hero': return `<section class="page-section page-hero"><span class="eyebrow">Built for organizers</span><h2>Communities don’t happen by accident.</h2><p>Behind every great season is someone who shows up early, carries the details, and creates the moments people remember. Rally was built for them.</p><a class="btn gold">Book a Demo</a> <a class="btn secondary" style="color:#fff;border-color:rgba(255,255,255,.4)">Explore Rally</a><div class="hero-photo-note">real community photography</div></section>`;
    case 'capabilities': return `<div class="page-section page-cap-strip"><div><strong>Built for organizers</strong><p>Created by people who run real leagues and events.</p><a>Our story →</a></div><div><strong>All-in-one platform</strong><p>Registration, scheduling, payments, and reporting in one place.</p><a>Features →</a></div><div><strong>Support included</strong><p>Documentation, resources, and real people when needed.</p><a>Support →</a></div><div><strong>No surprises</strong><p>Clear setup and monthly pricing before you commit.</p><a>Pricing →</a></div></div>`;
    case 'software': return `<section class="page-section page-light"><div class="software-layout"><div><span class="eyebrow">Everything you need</span><h2>Software that handles the busywork so you can build community.</h2><p>Rally gives organizers the tools to run leagues, tournaments, open play, and community events with confidence.</p><div class="feature-mini-grid"><div><strong>Registration</strong><p>Forms, waivers, rosters, and payments.</p></div><div><strong>Scheduling</strong><p>Courts, dates, standings, and playoffs.</p></div><div><strong>Communication</strong><p>Keep players and staff informed.</p></div><div><strong>Financial</strong><p>Track revenue and expenses.</p></div><div><strong>Reporting</strong><p>Understand what matters.</p></div><div><strong>Automation</strong><p>Reduce repeated work.</p></div></div></div><div class="mock-device"><div class="screen"><div class="metric"><span></span><span></span><span></span></div><div class="box"></div></div></div></div></section>`;
    case 'quote': return `<section class="page-section page-quote">“The work that builds community should never get buried beneath administrative tasks.”</section>`;
    case 'story': return `<section class="page-section page-light"><div class="story-layout"><div class="story-card"><span class="eyebrow">We've been there</span><h2>Built beside organizers.</h2><p>Rally was born from late nights, spreadsheets, registration questions, schedule changes, and the desire to create better experiences for players and communities.</p><p>Every feature exists because real organizers needed it first.</p><a class="btn secondary">Read our story</a></div><div class="story-photo">real event moment</div></div></section>`;
    case 'support': return `<section class="page-section page-dark"><span class="eyebrow">You're not alone</span><h2>Software is only half the relationship.</h2><p>Rally combines documentation, helpful resources, and real people when you need them.</p><div class="support-grid"><div><strong>Documentation</strong><p>Step-by-step guides and searchable answers.</p></div><div><strong>Videos</strong><p>Short walkthroughs for important workflows.</p></div><div><strong>Live support</strong><p>Email, phone, and guided help when needed.</p></div><div><strong>Roadmap</strong><p>Follow improvements and help shape what comes next.</p></div></div></section>`;
    case 'pricing': return `<section class="page-section page-light"><div class="transparent-pricing"><div class="price-panel"><span class="eyebrow">Guided onboarding</span><h2 style="color:#fff">One-time setup.</h2><strong>$1,500</strong><p style="color:rgba(255,255,255,.72)">Setup, configuration, migration, and launch support.</p></div><div><span class="eyebrow">Transparent pricing</span><h2>Plus a monthly platform plan.</h2><p>Show setup and subscription pricing together so visitors never mistake onboarding for the full product cost.</p><ul><li>One-time guided onboarding</li><li>Monthly platform access</li><li>Support, updates, and documentation included</li></ul><br><a class="btn">View pricing</a></div></div></section>`;
    case 'pricingCards': return `<section class="page-section page-light"><span class="eyebrow">Simple pricing</span><h2>No surprises. No hidden fees.</h2><div class="pricing-cards"><div class="pricing-card"><h3>Starter</h3><div class="price">$99</div><p>For small organizations getting started.</p><a class="btn secondary">Choose Starter</a></div><div class="pricing-card featured"><h3>Growth</h3><div class="price">$199</div><p>For growing leagues and tournaments.</p><a class="btn">Choose Growth</a></div><div class="pricing-card"><h3>Pro</h3><div class="price">$349</div><p>For larger organizations with advanced needs.</p><a class="btn secondary">Choose Pro</a></div></div></section>`;
    case 'cta': return `<section class="page-section page-cta"><div class="cta-box"><div><h2>Ready to build something people love?</h2><p>Let's build it together.</p></div><div><a class="btn">Book a Demo</a> <a class="btn secondary">View Pricing</a></div></div></section>`;
    case 'footer': return `<footer class="page-section page-footer"><div class="footer-grid"><div><div class="live-logo"><span class="live-logo-mark">R</span>RALLY</div><p>Helping organizers build stronger communities.</p></div><div><h4>Product</h4><a>Features</a><a>Pricing</a><a>Support</a></div><div><h4>Resources</h4><a>Guides</a><a>Downloads</a><a>Blog</a></div><div><h4>Company</h4><a>About</a><a>Book Demo</a></div><div><h4>Demo</h4><a>Schedule a Call</a><a>Log In</a></div></div></footer>`;
    default: return '';
  }
}
function renderComposer(){
  const preview=document.querySelector('[data-page-preview]'); if(preview) preview.innerHTML=currentSections.map(sectionMarkup).join('');
  const list=document.querySelector('[data-section-list]');
  if(list){
    list.innerHTML=currentSections.map((type,i)=>`<div class="section-row" data-index="${i}"><div><strong>${i+1}. ${sectionLabels[type]||type}</strong><small>${type}</small></div><button data-move-up="${i}">↑</button><button data-move-down="${i}">↓</button><button data-remove-section="${i}">×</button></div>`).join('');
  }
  localStorage.setItem('rally-studio-page-sections',JSON.stringify(currentSections));
  updatePageReadout();
}
function pageHtml(){
  return `<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n<meta name="viewport" content="width=device-width, initial-scale=1">\n<title>Rally Page Export</title>\n<link rel="stylesheet" href="assets/styles.css">\n</head>\n<body>\n${currentSections.map(sectionMarkup).join('\n')}\n</body>\n</html>`;
}
function updatePageReadout(){ const el=document.querySelector('[data-page-readout]'); if(el) el.textContent=currentSections.map((s,i)=>`${i+1}. ${sectionLabels[s]}`).join('\n'); }
function initComposer(){
  renderComposer();
  document.querySelectorAll('[data-collapse-sidebar]').forEach(btn=>btn.addEventListener('click',()=>{document.body.classList.toggle('nav-collapsed'); btn.textContent=document.body.classList.contains('nav-collapsed')?'Show nav':'Hide nav';}));
  document.querySelectorAll('[data-toggle-settings]').forEach(btn=>btn.addEventListener('click',()=>{document.body.classList.toggle('settings-collapsed'); btn.textContent=document.body.classList.contains('settings-collapsed')?'Show settings':'Hide settings';}));
  document.querySelectorAll('[data-preview-only]').forEach(btn=>btn.addEventListener('click',()=>document.body.classList.toggle('preview-only')));
  document.querySelectorAll('[data-load-template]').forEach(btn=>btn.addEventListener('click',()=>{const sel=document.querySelector('[data-template-select]'); currentSections=(composerTemplates[sel?.value||'home']||composerTemplates.home).slice(); renderComposer();}));
  document.querySelectorAll('[data-add-section]').forEach(btn=>btn.addEventListener('click',()=>{currentSections.push(btn.dataset.addSection); renderComposer();}));
  document.addEventListener('click',e=>{
    const up=e.target.closest('[data-move-up]'); const down=e.target.closest('[data-move-down]'); const rem=e.target.closest('[data-remove-section]');
    if(up){const i=+up.dataset.moveUp; if(i>0){[currentSections[i-1],currentSections[i]]=[currentSections[i],currentSections[i-1]]; renderComposer();}}
    if(down){const i=+down.dataset.moveDown; if(i<currentSections.length-1){[currentSections[i+1],currentSections[i]]=[currentSections[i],currentSections[i+1]]; renderComposer();}}
    if(rem){currentSections.splice(+rem.dataset.removeSection,1); renderComposer();}
  });
  document.querySelectorAll('[data-copy-page],[data-export-page]').forEach(btn=>btn.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(pageHtml()); btn.textContent='Copied HTML'; setTimeout(()=>btn.textContent=btn.hasAttribute('data-export-page')?'Export HTML':'Copy current page HTML',1400);}catch(err){btn.textContent='Copy failed';}}));
  document.querySelectorAll('[data-reset-composer]').forEach(btn=>btn.addEventListener('click',()=>{currentSections=composerTemplates.home.slice(); renderComposer();}));
}
const oldInitPlayground = initPlayground;
initPlayground = function(){ oldInitPlayground(); initComposer(); };
