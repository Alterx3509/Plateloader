/* Trophy Tracker v0.1 — offline-first UWC prototype */
const UWC = {
  id: 'uwc-na',
  name: 'Ultimate Waterfowlers Challenge',
  shortName: 'UWC North American Grand Slam',
  targetCount: 41,
  sourceUrl: 'https://waterfowlerschallenge.com/uwc-official-rules/',
  milestones: [
    {name:'Journeyman', count:0},
    {name:'Master', count:15},
    {name:'Master Elite', count:30},
    {name:'Grand Master', count:41}
  ],
  categories: [
    {id:'puddle', name:'Puddle Ducks', icon:'◒', species:[
      ['mallard','Mallard'], ['pintail','Pintail'], ['american-wigeon','American Wigeon'], ['gadwall','Gadwall'],
      ['northern-shoveler','Northern Shoveler'], ['green-winged-teal','Green-winged Teal'], ['blue-winged-teal','Blue-winged Teal'],
      ['cinnamon-teal','Cinnamon Teal'], ['wood-duck','Wood Duck'], ['black-duck','Black Duck','either'], ['mottled-duck','Mottled Duck','either'],
      ['black-bellied-whistling-duck','Black-bellied Whistling Duck','either'], ['fulvous-whistling-tree-duck','Fulvous Whistling Tree Duck','either']
    ]},
    {id:'diver', name:'Divers & Mergansers', icon:'◓', species:[
      ['canvasback','Canvasback'], ['redhead','Redhead'], ['greater-scaup','Greater Scaup','drake','Third certification photo: extended wing showing the white speculum.'],
      ['lesser-scaup','Lesser Scaup','drake','Third certification photo: extended wing showing the white speculum.'], ['common-goldeneye','Common Goldeneye'],
      ['barrows-goldeneye',"Barrow's Goldeneye"], ['ruddy-duck','Ruddy Duck'], ['bufflehead','Bufflehead'], ['ring-necked-duck','Ring-necked Duck'],
      ['hooded-merganser','Hooded Merganser'], ['common-merganser','Common Merganser'], ['red-breasted-merganser','Red-breasted Merganser']
    ]},
    {id:'sea', name:'Sea Ducks', icon:'≈', species:[
      ['king-eider','King Eider'], ['common-eider','Common Eider'], ['long-tailed-duck','Long-tailed Duck (Old Squaw)'], ['harlequin-duck','Harlequin Duck'],
      ['black-scoter','Common (Black) Scoter'], ['surf-scoter','Surf Scoter'], ['white-winged-scoter','White-winged Scoter']
    ]},
    {id:'goose', name:'Geese, Swans & Cranes', icon:'⌁', species:[
      ['tundra-swan','Tundra Swan','either'], ['sandhill-crane','Sandhill Crane','either'],
      ['canada-goose','Canada Goose','either','UWC separates Canada and Cackling Canada Goose by weight/bill criteria.'],
      ['cackling-canada-goose','Cackling Canada Goose','either','UWC separates Canada and Cackling Canada Goose by weight/bill criteria.'],
      ['snow-goose','Snow Goose','either'], ['blue-goose','Blue Goose','either'], ["ross-goose","Ross's Goose",'either'],
      ['white-fronted-goose','White-fronted Goose (Speckle Belly)','either'], ['brant-goose','Brant Goose','either']
    ]}
  ]
};

const SPECIES = UWC.categories.flatMap(cat => cat.species.map(row => ({
  id: row[0], name: row[1], sexRequirement: row[2] || 'drake', special: row[3] || '', categoryId:cat.id, categoryName:cat.name
})));

const KEY = 'trophyTracker.v1';
const state = loadState();
let currentScreen = 'challenges';
let currentFilter = 'all';
let installPrompt = null;

function loadState(){
  try {
    const raw = JSON.parse(localStorage.getItem(KEY));
    return raw && raw.version === 1 ? raw : freshState();
  } catch { return freshState(); }
}
function freshState(){ return { version:1, trophies:{}, hunts:[], profile:{name:'Hunter', uwcMemberId:''} }; }
function save(){ localStorage.setItem(KEY, JSON.stringify(state)); }
function trophy(id){ return state.trophies[id] || { harvested:false, date:'', location:'', sex:'', notes:'', certified:false, submitted:false, submissionPhotos:false, huntId:'' }; }
function speciesById(id){ return SPECIES.find(s=>s.id===id); }
function completed(){ return SPECIES.filter(s=>trophy(s.id).harvested).length; }
function certifiedCount(){ return SPECIES.filter(s=>trophy(s.id).certified).length; }
function categoryProgress(cat){ const done=cat.species.filter(r=>trophy(r[0]).harvested).length; return {done,total:cat.species.length}; }
function escapeHtml(v=''){ return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
function formatDate(v){ if(!v) return 'Date not added'; const d=new Date(v+'T12:00:00'); return d.toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'}); }
function toast(msg){ const el=document.getElementById('toast'); el.textContent=msg; el.classList.add('show'); clearTimeout(toast.t); toast.t=setTimeout(()=>el.classList.remove('show'),1600); }

function render(){
  document.querySelectorAll('.nav-btn').forEach(b=>b.classList.toggle('active', b.dataset.screen===currentScreen));
  const root=document.getElementById('screen');
  if(currentScreen==='challenges') root.innerHTML=challengeScreen();
  if(currentScreen==='trophies') root.innerHTML=trophyScreen();
  if(currentScreen==='hunts') root.innerHTML=huntsScreen();
  if(currentScreen==='profile') root.innerHTML=profileScreen();
  hydrateImages(root);
}

function challengeScreen(){
  const done=completed(); const pct=Math.round(done/UWC.targetCount*100);
  return `
    <section class="card hero">
      <div class="series">ACTIVE CHALLENGE</div>
      <h2>${UWC.name}</h2>
      <div class="progress-row"><div class="progress-big">${done} <span>/ ${UWC.targetCount}</span></div><div class="percent">${pct}% COMPLETE</div></div>
      <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
      <div class="milestones">${UWC.milestones.map(m=>milestoneHtml(m,done)).join('')}</div>
    </section>

    <div class="section-head"><h3>Divisions</h3><span class="subtle">${done} harvested</span></div>
    <div class="category-list">${UWC.categories.map(cat=>{
      const p=categoryProgress(cat); return `<div class="card category-row" data-filter="${cat.id}">
        <div class="category-icon">${cat.icon}</div><div><strong>${cat.name}</strong><small>${p.done} of ${p.total}</small><div class="mini-track"><i style="width:${p.done/p.total*100}%"></i></div></div><div class="count">${p.done}/${p.total}</div>
      </div>`}).join('')}</div>

    <div class="section-head"><h3>Species Tracker</h3><span class="subtle">tap ✓ for quick mark</span></div>
    <div class="filter-scroll">
      <button class="filter-chip ${currentFilter==='all'?'active':''}" data-filter="all">All 41</button>
      ${UWC.categories.map(c=>`<button class="filter-chip ${currentFilter===c.id?'active':''}" data-filter="${c.id}">${c.name}</button>`).join('')}
    </div>
    <div class="species-grid">${speciesCards()}</div>
    <p class="disclaimer">Unofficial personal tracker. Official UWC certification remains solely with the Ultimate Waterfowlers Challenge. Species/rule references are based on the current UWC rules. <a href="${UWC.sourceUrl}" target="_blank" rel="noopener">View official rules ↗</a></p>`;
}
function milestoneHtml(m,done){ const earned=done>=m.count; return `<div class="milestone ${earned?'earned':''}"><div class="dot">${earned?'✓':'○'}</div><strong>${m.name}</strong><small>${m.count?m.count+' species':'start'}</small></div>`; }
function speciesCards(){
  const list=currentFilter==='all'?SPECIES:SPECIES.filter(s=>s.categoryId===currentFilter);
  return list.map(s=>{
    const t=trophy(s.id); return `<article class="card species-card ${t.harvested?'harvested':''}" data-species="${s.id}">
      <div class="cover-thumb-holder" data-cover="${s.id}"></div>
      <button class="quick-check ${t.harvested?'checked':''}" data-quick="${s.id}" aria-label="${t.harvested?'Unmark':'Mark'} ${escapeHtml(s.name)} harvested">✓</button>
      <div class="content"><div class="bird-mark">🦆</div></div>
      <div class="content"><strong>${escapeHtml(s.name)}</strong><small>${s.categoryName}</small></div>
    </article>`;
  }).join('');
}

function trophyScreen(){
  const list=SPECIES.filter(s=>trophy(s.id).harvested).sort((a,b)=>(trophy(b.id).date||'').localeCompare(trophy(a.id).date||''));
  return `<div class="section-head"><h3>Trophy Room</h3><span class="subtle">${list.length} species</span></div>
    ${list.length?`<div class="list">${list.map(s=>{const t=trophy(s.id); return `<div class="card trophy-row" data-species="${s.id}"><div class="thumb" data-thumb="${s.id}">🦆</div><div><strong>${escapeHtml(s.name)}</strong><small>${formatDate(t.date)}${t.location?' · '+escapeHtml(t.location):''}</small></div><span class="badge">${t.certified?'UWC ✓':'Harvested'}</span></div>`}).join('')}</div>`:
      `<div class="card empty"><div class="emoji">🏆</div><strong>Your trophy room is empty.</strong><p>Mark a species harvested from the challenge screen and it will appear here.</p></div>`}`;
}

function huntsScreen(){
  return `<div class="section-head"><h3>Hunt Journal</h3><span class="subtle">${state.hunts.length} hunts</span></div>
  ${state.hunts.length?`<div class="list">${[...state.hunts].sort((a,b)=>(b.start||'').localeCompare(a.start||'')).map(h=>huntCard(h)).join('')}</div>`:
  `<div class="card empty"><div class="emoji">🗺️</div><strong>No hunts yet.</strong><p>Create a hunt once, then link several trophies to the same trip.</p></div>`}
  <button class="fab" id="addHunt" aria-label="Add hunt">＋</button>`;
}
function huntCard(h){
  const linked=SPECIES.filter(s=>trophy(s.id).huntId===h.id);
  return `<article class="card hunt-card" data-hunt="${h.id}"><h3>${escapeHtml(h.name)}</h3><div class="hunt-meta">${h.location?escapeHtml(h.location)+' · ':''}${formatDate(h.start)}</div><div class="hunt-species">${linked.length?linked.map(s=>`<span class="badge">${escapeHtml(s.name)}</span>`).join(''):'<span class="hunt-meta">No trophies linked yet</span>'}</div></article>`;
}

function profileScreen(){
  const done=completed(), cert=certifiedCount();
  return `<section class="card profile-card"><div class="profile-top"><div class="avatar">🦆</div><div><h2 style="margin:0 0 3px">${escapeHtml(state.profile.name||'Hunter')}</h2><div class="hunt-meta">${state.profile.uwcMemberId?'UWC #'+escapeHtml(state.profile.uwcMemberId):'Personal tracker'}</div></div></div>
  <div class="stat-grid"><div class="stat"><strong>${done}</strong><small>Species</small></div><div class="stat"><strong>${cert}</strong><small>Certified</small></div><div class="stat"><strong>${state.hunts.length}</strong><small>Hunts</small></div></div></section>
  <div class="section-head"><h3>Milestones</h3></div>
  <div class="card cert-list">${UWC.milestones.map(m=>`<div class="cert-row"><span>${m.name}${m.count?' · '+m.count:' · Registered'}</span><strong>${done>=m.count?'✓':'○'}</strong></div>`).join('')}</div>
  <div class="section-head"><h3>Profile & Data</h3></div>
  <div class="settings-list"><button class="link-btn" id="editProfile">Edit name / UWC member ID</button><button class="link-btn" id="exportData">Export tracker backup</button><label class="link-btn" style="display:block">Import tracker backup<input id="importData" type="file" accept="application/json" hidden></label><button class="link-btn" id="installHelp">Install on Home Screen</button><button class="link-btn" id="resetData">Reset all tracker data</button></div>
  <p class="disclaimer">Photos stay on this device in browser storage in this prototype. The JSON backup exports tracker data but not photo files. A cloud account/sync layer is the next major backend step.</p>`;
}

function openSpecies(id){
  const s=speciesById(id), t=trophy(id); if(!s)return;
  const huntOptions=state.hunts.map(h=>`<option value="${h.id}" ${t.huntId===h.id?'selected':''}>${escapeHtml(h.name)}</option>`).join('');
  modal(`<div class="modal-head"><div><div class="eyebrow">${s.categoryName}</div><h2>${escapeHtml(s.name)}</h2></div><button class="close-btn" data-close>×</button></div>
    <section class="card detail-status"><div class="status-copy"><strong>${t.harvested?'Harvested':'Not yet harvested'}</strong><small>${s.sexRequirement==='drake'?'UWC certification: drake required':'UWC certification: either sex eligible'}</small></div><button id="harvestSwitch" class="switch ${t.harvested?'on':''}" aria-label="Toggle harvested"></button></section>
    <div class="rules-note card"><strong>UWC note:</strong> ${s.sexRequirement==='drake'?'Official rules specify drake-only certification for this species.':'Official rules allow either sex for this species.'}${s.special?' '+escapeHtml(s.special):''}</div>
    <div class="form-grid"><div class="field"><label>HARVEST DATE</label><input id="tDate" type="date" value="${escapeHtml(t.date)}"></div><div class="field"><label>SEX</label><select id="tSex"><option value="">Not recorded</option><option ${t.sex==='Drake'?'selected':''}>Drake</option><option ${t.sex==='Hen'?'selected':''}>Hen</option><option ${t.sex==='Unknown'?'selected':''}>Unknown</option></select></div></div>
    <div class="field"><label>LOCATION / REGION</label><input id="tLocation" placeholder="e.g. Accomack County, Virginia" value="${escapeHtml(t.location)}"></div>
    <div class="field"><label>HUNT / TRIP</label><select id="tHunt"><option value="">No linked hunt</option>${huntOptions}</select></div>
    <div class="field"><label>NOTES</label><textarea id="tNotes" placeholder="Story, hunting partners, conditions, outfitter…">${escapeHtml(t.notes)}</textarea></div>
    <div class="section-head"><h3>Photos</h3><span class="subtle">stored on device</span></div><div id="photoGrid" class="photo-grid"></div>
    <label class="file-label">📷 Add photos<input id="photoInput" type="file" accept="image/*" capture="environment" multiple></label>
    <div class="section-head"><h3>UWC Certification</h3></div>
    <div class="card cert-list"><label class="cert-row"><span>Harvested</span><input id="cHarvested" type="checkbox" ${t.harvested?'checked':''}></label><label class="cert-row"><span>Submission photos ready</span><input id="cPhotos" type="checkbox" ${t.submissionPhotos?'checked':''}></label><label class="cert-row"><span>Submitted to UWC</span><input id="cSubmitted" type="checkbox" ${t.submitted?'checked':''}></label><label class="cert-row"><span>UWC Certified</span><input id="cCertified" type="checkbox" ${t.certified?'checked':''}></label></div>
    <button class="action-btn" id="saveTrophy">Save Trophy</button>`, 'species');
  loadPhotoGrid(id);
  document.getElementById('harvestSwitch').onclick=()=>{ const sw=document.getElementById('harvestSwitch'); sw.classList.toggle('on'); document.getElementById('cHarvested').checked=sw.classList.contains('on'); if(sw.classList.contains('on') && !document.getElementById('tDate').value) document.getElementById('tDate').value=new Date().toISOString().slice(0,10); };
  document.getElementById('cHarvested').onchange=e=>document.getElementById('harvestSwitch').classList.toggle('on',e.target.checked);
  document.getElementById('photoInput').onchange=async e=>{ for(const file of [...e.target.files].slice(0,8)){ await addPhoto(id,file); } await loadPhotoGrid(id); toast('Photo saved on device'); };
  document.getElementById('saveTrophy').onclick=()=>{
    state.trophies[id]={...t, harvested:document.getElementById('cHarvested').checked, date:document.getElementById('tDate').value, sex:document.getElementById('tSex').value, location:document.getElementById('tLocation').value.trim(), huntId:document.getElementById('tHunt').value, notes:document.getElementById('tNotes').value.trim(), submissionPhotos:document.getElementById('cPhotos').checked, submitted:document.getElementById('cSubmitted').checked, certified:document.getElementById('cCertified').checked};
    save(); closeModal(); render(); toast('Trophy saved');
  };
}

function openHunt(id){
  const h=state.hunts.find(x=>x.id===id) || {id:crypto.randomUUID(),name:'',location:'',start:'',end:'',notes:''};
  const isNew=!state.hunts.some(x=>x.id===id);
  modal(`<div class="modal-head"><h2>${isNew?'New Hunt':'Edit Hunt'}</h2><button class="close-btn" data-close>×</button></div>
    <div class="field"><label>HUNT / TRIP NAME</label><input id="hName" value="${escapeHtml(h.name)}" placeholder="e.g. Alaska Sea Duck Hunt"></div>
    <div class="field"><label>LOCATION</label><input id="hLoc" value="${escapeHtml(h.location)}" placeholder="City, region, state"></div>
    <div class="form-grid"><div class="field"><label>START</label><input id="hStart" type="date" value="${escapeHtml(h.start)}"></div><div class="field"><label>END</label><input id="hEnd" type="date" value="${escapeHtml(h.end)}"></div></div>
    <div class="field"><label>NOTES</label><textarea id="hNotes" placeholder="Conditions, partners, outfitter, memories…">${escapeHtml(h.notes)}</textarea></div>
    <button class="action-btn" id="saveHunt">${isNew?'Create Hunt':'Save Hunt'}</button>${isNew?'':`<div style="height:8px"></div><button class="action-btn danger" id="deleteHunt">Delete Hunt</button>`}`);
  document.getElementById('saveHunt').onclick=()=>{ const next={...h,name:document.getElementById('hName').value.trim()||'Untitled Hunt',location:document.getElementById('hLoc').value.trim(),start:document.getElementById('hStart').value,end:document.getElementById('hEnd').value,notes:document.getElementById('hNotes').value.trim()}; if(isNew) state.hunts.push(next); else Object.assign(state.hunts.find(x=>x.id===h.id),next); save(); closeModal(); render(); toast('Hunt saved'); };
  if(!isNew) document.getElementById('deleteHunt').onclick=()=>{ if(confirm('Delete this hunt? Trophies will remain but become unlinked.')){ state.hunts=state.hunts.filter(x=>x.id!==h.id); Object.values(state.trophies).forEach(t=>{if(t.huntId===h.id)t.huntId=''}); save(); closeModal(); render(); } };
}

function editProfile(){
  modal(`<div class="modal-head"><h2>Edit Profile</h2><button class="close-btn" data-close>×</button></div><div class="field"><label>DISPLAY NAME</label><input id="pName" value="${escapeHtml(state.profile.name)}"></div><div class="field"><label>UWC MEMBER ID (OPTIONAL)</label><input id="pId" value="${escapeHtml(state.profile.uwcMemberId)}"></div><button class="action-btn" id="saveProfile">Save Profile</button>`);
  document.getElementById('saveProfile').onclick=()=>{ state.profile.name=document.getElementById('pName').value.trim()||'Hunter'; state.profile.uwcMemberId=document.getElementById('pId').value.trim(); save(); closeModal(); render(); };
}
function installHelp(){ modal(`<div class="modal-head"><h2>Install on iPhone / iPad</h2><button class="close-btn" data-close>×</button></div><div class="card rules-note"><strong>Safari:</strong><br>1. Tap the Share button.<br>2. Choose <b>Add to Home Screen</b>.<br>3. Tap <b>Add</b>.<br><br>The tracker then launches like an app and keeps working offline after the first successful load.</div>`); }
function modal(content){ document.getElementById('modalRoot').innerHTML=`<div class="modal-backdrop"><div class="modal">${content}</div></div>`; document.querySelectorAll('[data-close]').forEach(b=>b.onclick=closeModal); document.querySelector('.modal-backdrop').addEventListener('click',e=>{if(e.target.classList.contains('modal-backdrop'))closeModal();}); }
function closeModal(){ document.getElementById('modalRoot').innerHTML=''; }

function quickToggle(id){
  const current=trophy(id); const on=!current.harvested;
  state.trophies[id]={...current,harvested:on,date:on?(current.date||new Date().toISOString().slice(0,10)):current.date}; save(); render(); toast(on?`${speciesById(id).name} marked harvested`:`${speciesById(id).name} unmarked`);
}

const DB_NAME='trophyTrackerPhotos';
function db(){ return new Promise((resolve,reject)=>{ const r=indexedDB.open(DB_NAME,1); r.onupgradeneeded=()=>{const d=r.result;if(!d.objectStoreNames.contains('photos')){const s=d.createObjectStore('photos',{keyPath:'id'});s.createIndex('trophyId','trophyId');}}; r.onsuccess=()=>resolve(r.result); r.onerror=()=>reject(r.error); }); }
async function compress(file){ return new Promise((resolve,reject)=>{ const img=new Image(); const url=URL.createObjectURL(file); img.onload=()=>{ const max=1400, scale=Math.min(1,max/Math.max(img.width,img.height)); const c=document.createElement('canvas'); c.width=Math.round(img.width*scale); c.height=Math.round(img.height*scale); c.getContext('2d').drawImage(img,0,0,c.width,c.height); c.toBlob(blob=>{URL.revokeObjectURL(url); blob?resolve(blob):reject(new Error('compress'));},'image/jpeg',.8); }; img.onerror=reject; img.src=url; }); }
async function addPhoto(trophyId,file){ const blob=await compress(file); const d=await db(); return new Promise((resolve,reject)=>{ const tx=d.transaction('photos','readwrite'); tx.objectStore('photos').put({id:crypto.randomUUID(),trophyId,blob,created:Date.now()}); tx.oncomplete=resolve; tx.onerror=()=>reject(tx.error); }); }
async function photosFor(trophyId){ const d=await db(); return new Promise((resolve,reject)=>{ const r=d.transaction('photos').objectStore('photos').index('trophyId').getAll(trophyId); r.onsuccess=()=>resolve(r.result.sort((a,b)=>a.created-b.created)); r.onerror=()=>reject(r.error); }); }
async function deletePhoto(id){ const d=await db(); return new Promise((resolve,reject)=>{ const tx=d.transaction('photos','readwrite'); tx.objectStore('photos').delete(id); tx.oncomplete=resolve; tx.onerror=()=>reject(tx.error); }); }
async function firstPhotoUrl(trophyId){ const p=await photosFor(trophyId); return p[0]?URL.createObjectURL(p[0].blob):''; }
async function loadPhotoGrid(id){ const grid=document.getElementById('photoGrid'); if(!grid)return; const items=await photosFor(id); grid.innerHTML=''; items.forEach(p=>{const url=URL.createObjectURL(p.blob); const el=document.createElement('div');el.className='photo';el.innerHTML=`<img alt="Trophy photo"><button aria-label="Delete photo">×</button>`;el.querySelector('img').src=url;el.querySelector('button').onclick=async()=>{await deletePhoto(p.id);URL.revokeObjectURL(url);loadPhotoGrid(id)};grid.appendChild(el);}); }
async function hydrateImages(root){
  root.querySelectorAll('[data-cover]').forEach(async holder=>{const url=await firstPhotoUrl(holder.dataset.cover);if(url){const img=document.createElement('img');img.className='cover-thumb';img.src=url;holder.replaceWith(img);}});
  root.querySelectorAll('[data-thumb]').forEach(async holder=>{const url=await firstPhotoUrl(holder.dataset.thumb);if(url){holder.innerHTML='';const img=document.createElement('img');img.src=url;holder.appendChild(img);}});
}

function exportData(){ const blob=new Blob([JSON.stringify(state,null,2)],{type:'application/json'}); const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`trophy-tracker-backup-${new Date().toISOString().slice(0,10)}.json`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000); }
async function importData(file){ try{const next=JSON.parse(await file.text());if(next.version!==1)throw new Error(); if(!confirm('Replace current tracker data with this backup?'))return; localStorage.setItem(KEY,JSON.stringify(next)); location.reload();}catch{alert('That backup file could not be read.');} }

document.addEventListener('click',e=>{
  const quick=e.target.closest('[data-quick]'); if(quick){e.stopPropagation();quickToggle(quick.dataset.quick);return;}
  const sp=e.target.closest('[data-species]'); if(sp){openSpecies(sp.dataset.species);return;}
  const filter=e.target.closest('[data-filter]'); if(filter){currentFilter=filter.dataset.filter; currentScreen='challenges';render();return;}
  const hunt=e.target.closest('[data-hunt]'); if(hunt){openHunt(hunt.dataset.hunt);return;}
  const nav=e.target.closest('.nav-btn'); if(nav){currentScreen=nav.dataset.screen;render();return;}
  if(e.target.id==='addHunt') openHunt('new');
  if(e.target.id==='editProfile') editProfile();
  if(e.target.id==='exportData') exportData();
  if(e.target.id==='installHelp') installHelp();
  if(e.target.id==='resetData' && confirm('Erase all trophy and hunt data on this device?')){localStorage.removeItem(KEY);indexedDB.deleteDatabase(DB_NAME);location.reload();}
});
document.addEventListener('change',e=>{if(e.target.id==='importData'&&e.target.files[0])importData(e.target.files[0]);});

window.addEventListener('beforeinstallprompt',e=>{e.preventDefault();installPrompt=e;document.getElementById('installBtn').classList.remove('hidden');});
document.getElementById('installBtn').onclick=async()=>{if(installPrompt){installPrompt.prompt();await installPrompt.userChoice;installPrompt=null;document.getElementById('installBtn').classList.add('hidden');}else installHelp();};
if('serviceWorker' in navigator) window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
render();
