const CHALLENGES = [
  {
    id: 'uwc-na-grand-slam',
    shortName: 'UWC',
    name: 'Ultimate Waterfowlers Challenge',
    subtitle: 'North American Waterfowl Grand Slam',
    milestones: [
      { count: 15, name: 'Master' },
      { count: 30, name: 'Master Elite' },
      { count: 41, name: 'Grand Master' }
    ],
    categories: [
      { id: 'puddle', name: 'Puddle Ducks', icon: '🦆' },
      { id: 'diver', name: 'Divers & Mergansers', icon: '🌊' },
      { id: 'sea', name: 'Sea Ducks', icon: '⚓' },
      { id: 'goose', name: 'Geese, Swans & Cranes', icon: '🪶' }
    ],
    targets: [
      ['mallard','Mallard','puddle'],['northern-pintail','Northern Pintail','puddle'],['american-wigeon','American Wigeon','puddle'],['gadwall','Gadwall','puddle'],['northern-shoveler','Northern Shoveler','puddle'],['green-winged-teal','Green-winged Teal','puddle'],['blue-winged-teal','Blue-winged Teal','puddle'],['cinnamon-teal','Cinnamon Teal','puddle'],['wood-duck','Wood Duck','puddle'],['american-black-duck','American Black Duck','puddle',{eitherSex:true}],['mottled-duck','Mottled Duck','puddle',{eitherSex:true}],['black-bellied-whistling-duck','Black-bellied Whistling Duck','puddle',{eitherSex:true}],['fulvous-whistling-duck','Fulvous Whistling Duck','puddle',{eitherSex:true}],
      ['canvasback','Canvasback','diver'],['redhead','Redhead','diver'],['greater-scaup','Greater Scaup','diver',{extraPhoto:true}],['lesser-scaup','Lesser Scaup','diver',{extraPhoto:true}],['common-goldeneye','Common Goldeneye','diver'],['barrows-goldeneye',"Barrow's Goldeneye",'diver'],['ruddy-duck','Ruddy Duck','diver'],['bufflehead','Bufflehead','diver'],['ring-necked-duck','Ring-necked Duck','diver'],['hooded-merganser','Hooded Merganser','diver'],['common-merganser','Common Merganser','diver'],['red-breasted-merganser','Red-breasted Merganser','diver'],
      ['king-eider','King Eider','sea'],['common-eider','Common Eider','sea'],['long-tailed-duck','Long-tailed Duck','sea'],['harlequin-duck','Harlequin Duck','sea'],['black-scoter','Black Scoter','sea'],['surf-scoter','Surf Scoter','sea'],['white-winged-scoter','White-winged Scoter','sea'],
      ['tundra-swan','Tundra Swan','goose',{eitherSex:true}],['sandhill-crane','Sandhill Crane','goose',{eitherSex:true}],['canada-goose','Canada Goose','goose',{eitherSex:true,weightRule:'Official UWC distinguishes Canada Goose from Cackling Canada Goose using weight criteria.'}],['cackling-canada-goose','Cackling Canada Goose','goose',{eitherSex:true,weightRule:'Official UWC distinguishes Cackling Canada Goose from Canada Goose using weight criteria.'}],['snow-goose','Snow Goose','goose',{eitherSex:true}],['blue-goose','Blue Goose','goose',{eitherSex:true}],['rosss-goose',"Ross's Goose",'goose',{eitherSex:true}],['greater-white-fronted-goose','Greater White-fronted Goose','goose',{eitherSex:true}],['brant','Brant','goose',{eitherSex:true}]
    ].map(([id,name,category,rules={}]) => ({ id,name,category,rules }))
  }
];

const challenge = CHALLENGES[0];
const stateKey = 'trophy-tracker-state-v1';
const defaultState = { trophies: {}, hunts: [], profile: { name: 'Hunter' } };
let state = loadState();
let activeView = 'challenge';
let activeFilter = 'all';
let activeSpeciesId = null;
let pendingStatus = 'not-harvested';
let installPrompt = null;

const app = document.getElementById('app');
const trophyDialog = document.getElementById('trophyDialog');
const trophyForm = document.getElementById('trophyForm');
const huntDialog = document.getElementById('huntDialog');
const huntForm = document.getElementById('huntForm');

function loadState() {
  try {
    return { ...structuredClone(defaultState), ...JSON.parse(localStorage.getItem(stateKey) || '{}') };
  } catch {
    return structuredClone(defaultState);
  }
}
function saveState() { localStorage.setItem(stateKey, JSON.stringify(state)); }
function trophy(id) { return state.trophies[id] || { status: 'not-harvested', date:'', sex:'', location:'', notes:'' }; }
function isCompleteStatus(status) { return status === 'harvested' || status === 'certified'; }
function completedTargets() { return challenge.targets.filter(t => isCompleteStatus(trophy(t.id).status)); }
function categoryFor(id) { return challenge.categories.find(c => c.id === id); }
function targetFor(id) { return challenge.targets.find(t => t.id === id); }
function escapeHtml(value='') { return String(value).replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c])); }
function percent(done,total) { return Math.round((done / total) * 100); }

function render() {
  document.querySelectorAll('.nav-item').forEach(btn => btn.classList.toggle('active', btn.dataset.view === activeView));
  if (activeView === 'challenge') renderChallenge();
  if (activeView === 'trophies') renderTrophyRoom();
  if (activeView === 'hunts') renderHunts();
  if (activeView === 'profile') renderProfile();
}

function renderChallenge() {
  const done = completedTargets().length;
  const milestones = challenge.milestones.map(m => {
    const complete = done >= m.count;
    return `<div class="mini-milestone ${complete ? 'done':''}"><div class="icon">${complete?'✓':'○'}</div><b>${m.name}</b><small>${complete?'Achieved':`${Math.max(0,m.count-done)} to go`}</small></div>`;
  }).join('');
  const categories = challenge.categories.map(cat => {
    const total = challenge.targets.filter(t => t.category === cat.id).length;
    const catDone = challenge.targets.filter(t => t.category === cat.id && isCompleteStatus(trophy(t.id).status)).length;
    return `<button class="category-row" data-filter="${cat.id}">
      <span class="category-icon">${cat.icon}</span><span class="category-copy"><b>${cat.name}</b><small>${percent(catDone,total)}% complete</small></span><span class="count">${catDone} / ${total}</span>
      <span class="category-meter"><span style="width:${percent(catDone,total)}%"></span></span>
    </button>`;
  }).join('');
  const filters = [{id:'all',name:'All 41'}, ...challenge.categories].map(cat => `<button class="chip ${activeFilter===cat.id?'active':''}" data-filter="${cat.id}">${cat.name}</button>`).join('');
  const visible = challenge.targets.filter(t => activeFilter === 'all' || t.category === activeFilter);

  app.innerHTML = `
    <section class="hero-card">
      <div class="hero-art">
        <div class="hero-kicker">${challenge.subtitle}</div>
        <div class="progress-big"><strong>${done} / ${challenge.targets.length}</strong><span>${percent(done,challenge.targets.length)}%</span></div>
        <div class="progress-track"><span style="width:${percent(done,challenge.targets.length)}%"></span></div>
      </div>
      <div class="hero-bottom">${milestones}</div>
    </section>
    <div class="section-head"><div><h2>Divisions</h2><p>Tap a division to filter the tracker.</p></div></div>
    <div class="category-list">${categories}</div>
    <div class="section-head"><div><h2>Species tracker</h2><p>Tap a trophy for details, or use the quick button.</p></div></div>
    <div class="filter-scroll">${filters}</div>
    <div class="species-grid">${visible.map(renderSpeciesCard).join('')}</div>
    <p class="disclaimer">Unofficial tracking companion. Official certification decisions and current rules remain with the Ultimate Waterfowlers Challenge organization.</p>
  `;
  bindSpeciesInteractions();
}

function renderSpeciesCard(target) {
  const record = trophy(target.id);
  const complete = isCompleteStatus(record.status);
  const cls = record.status === 'certified' ? 'certified' : complete ? 'harvested' : '';
  return `<article class="species-card ${cls}" data-species="${target.id}">
    <span class="status-dot">${record.status === 'certified' ? '★' : complete ? '✓' : '○'}</span>
    <button class="species-open" data-open="${target.id}" aria-label="Open ${escapeHtml(target.name)}" style="all:unset;display:block;width:100%;cursor:pointer">
      <div class="species-thumb" data-thumb="${target.id}">🦆</div>
      <div class="species-name">${escapeHtml(target.name)}</div>
    </button>
    <button class="quick-mark" data-quick="${target.id}">${complete ? 'Marked ✓' : 'Mark harvested'}</button>
  </article>`;
}

async function bindSpeciesInteractions() {
  app.querySelectorAll('[data-filter]').forEach(btn => btn.addEventListener('click', () => { activeFilter = btn.dataset.filter; renderChallenge(); }));
  app.querySelectorAll('[data-open]').forEach(btn => btn.addEventListener('click', () => openTrophy(btn.dataset.open)));
  app.querySelectorAll('[data-quick]').forEach(btn => btn.addEventListener('click', e => {
    e.stopPropagation();
    const id = btn.dataset.quick;
    const record = trophy(id);
    state.trophies[id] = { ...record, status: isCompleteStatus(record.status) ? 'not-harvested' : 'harvested' };
    saveState();
    showToast(isCompleteStatus(state.trophies[id].status) ? `${targetFor(id).name} marked harvested` : `${targetFor(id).name} cleared`);
    renderChallenge();
  }));
  for (const target of challenge.targets) {
    const image = await getPrimaryPhoto(target.id);
    if (!image) continue;
    const holder = app.querySelector(`[data-thumb="${target.id}"]`);
    if (holder) holder.innerHTML = `<img src="${image}" alt="${escapeHtml(target.name)} trophy photo">`;
  }
}

async function openTrophy(id) {
  activeSpeciesId = id;
  const target = targetFor(id);
  const record = trophy(id);
  pendingStatus = record.status || 'not-harvested';
  document.getElementById('detailDivision').textContent = categoryFor(target.category).name;
  document.getElementById('detailSpecies').textContent = target.name;
  document.getElementById('trophyDate').value = record.date || '';
  document.getElementById('trophySex').value = record.sex || '';
  document.getElementById('trophyLocation').value = record.location || '';
  document.getElementById('trophyNotes').value = record.notes || '';
  renderStatusSegment();
  renderRuleCard(target);
  await renderDialogPhotos(id);
  trophyDialog.showModal();
}

function renderStatusSegment() {
  document.querySelectorAll('#statusSegment button').forEach(btn => btn.classList.toggle('active', btn.dataset.status === pendingStatus));
}
function renderRuleCard(target) {
  const rules = target.rules || {};
  const sexRule = rules.eitherSex ? 'Either sex can be eligible under the UWC rules.' : 'UWC certification generally requires a drake / male for this species.';
  const extra = [rules.extraPhoto ? 'Scaup identification has additional photographic requirements.' : '', rules.weightRule || ''].filter(Boolean).join(' ');
  document.getElementById('ruleCard').innerHTML = `<b>UWC note</b><br>${escapeHtml(sexRule)}${extra ? `<br>${escapeHtml(extra)}`:''}<br><span style="color:#858987">Use this as a field reminder only; verify current official rules before submission.</span>`;
}

async function renderDialogPhotos(id) {
  const photos = await getPhotos(id);
  const hero = document.getElementById('primaryPhoto');
  const placeholder = document.getElementById('photoPlaceholder');
  const strip = document.getElementById('photoStrip');
  if (photos.length) {
    hero.src = photos[0].data;
    hero.hidden = false;
    placeholder.hidden = true;
    strip.innerHTML = photos.map((p,i) => `<img src="${p.data}" alt="Trophy photo ${i+1}">`).join('');
  } else {
    hero.hidden = true;
    hero.removeAttribute('src');
    placeholder.hidden = false;
    strip.innerHTML = '';
  }
}

function renderTrophyRoom() {
  const trophies = completedTargets();
  app.innerHTML = `
    <div class="section-head"><div><h2>Trophy Room</h2><p>${trophies.length} completed UWC species</p></div></div>
    ${trophies.length ? `<div class="trophy-list">${trophies.map(t => {
      const r=trophy(t.id); return `<button class="trophy-tile" data-open="${t.id}"><div class="image" data-trophy-image="${t.id}">🦆</div><div class="copy"><b>${escapeHtml(t.name)}</b><small>${r.location ? escapeHtml(r.location) : (r.status==='certified'?'Certified':'Harvested')}</small></div></button>`;
    }).join('')}</div>` : `<div class="empty-state"><div class="big">🏆</div><b>Your trophy room is empty</b><p>Mark your first UWC species and it will appear here.</p></div>`}
  `;
  app.querySelectorAll('[data-open]').forEach(btn => btn.addEventListener('click', () => openTrophy(btn.dataset.open)));
  trophies.forEach(async t => {
    const image = await getPrimaryPhoto(t.id);
    const holder = app.querySelector(`[data-trophy-image="${t.id}"]`);
    if (image && holder) holder.innerHTML = `<img src="${image}" alt="${escapeHtml(t.name)} trophy photo">`;
  });
}

function renderHunts() {
  const hunts = [...state.hunts].sort((a,b) => String(b.date).localeCompare(String(a.date)));
  app.innerHTML = `
    <div class="section-head"><div><h2>Hunt Journal</h2><p>Trips and hunt-day memories.</p></div><button class="secondary-button" id="addHuntTop">+ Add</button></div>
    ${hunts.length ? hunts.map(h => `<article class="hunt-card"><h3>${escapeHtml(h.name)}</h3><div class="hunt-meta"><span>📅 ${escapeHtml(h.date || 'No date')}</span>${h.location?`<span>📍 ${escapeHtml(h.location)}</span>`:''}</div>${h.notes?`<p>${escapeHtml(h.notes)}</p>`:''}</article>`).join('') : `<div class="empty-state"><div class="big">📓</div><b>No hunts yet</b><p>Add a hunt to start a lightweight field journal.</p></div>`}
    <button class="fab" id="addHuntFab" aria-label="Add hunt">+</button>`;
  ['addHuntTop','addHuntFab'].forEach(id => document.getElementById(id)?.addEventListener('click', openHuntDialog));
}

function openHuntDialog() {
  huntForm.reset();
  document.getElementById('huntDate').value = new Date().toISOString().slice(0,10);
  huntDialog.showModal();
}

function renderProfile() {
  const done = completedTargets().length;
  const certified = challenge.targets.filter(t => trophy(t.id).status === 'certified').length;
  const milestones = challenge.milestones.map(m => `<div class="milestone-card ${done>=m.count?'done':''}"><div><b>${m.name}</b><small>${done>=m.count?'Achieved':`${Math.max(0,m.count-done)} species to go`}</small></div><span>${done>=m.count?'✓':'○'}</span></div>`).join('');
  app.innerHTML = `
    <div class="section-head"><div><h2>Hunter Profile</h2><p>Local prototype profile</p></div></div>
    <section class="panel">
      <div class="stats-grid">
        <div class="stat-card"><strong>${done}</strong><small>Harvested</small></div>
        <div class="stat-card"><strong>${certified}</strong><small>Certified</small></div>
        <div class="stat-card"><strong>${state.hunts.length}</strong><small>Hunts</small></div>
      </div>
      <div class="section-head"><div><h3>Milestones</h3></div></div>
      <div class="milestone-list">${milestones}</div>
      <div class="action-row"><button class="secondary-button" id="exportButton">Export data</button><button class="secondary-button" id="resetButton">Reset prototype</button></div>
      <p class="disclaimer">This first build stores trophy records on this device. Photos are stored in the browser's local database. A later synced build can move the same challenge/trophy model to Supabase and then SwiftUI.</p>
    </section>`;
  document.getElementById('exportButton').addEventListener('click', exportData);
  document.getElementById('resetButton').addEventListener('click', resetData);
}

function exportData() {
  const blob = new Blob([JSON.stringify({ challenge: challenge.id, ...state }, null, 2)], {type:'application/json'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download='trophy-tracker-export.json'; a.click(); URL.revokeObjectURL(a.href);
}
async function resetData() {
  if (!confirm('Reset all trophy records, hunts, and locally stored photos on this device?')) return;
  state = structuredClone(defaultState); saveState(); await clearAllPhotos(); showToast('Prototype reset'); render();
}

function showToast(message) {
  document.querySelector('.toast')?.remove();
  const toast=document.createElement('div'); toast.className='toast'; toast.textContent=message; document.body.appendChild(toast); setTimeout(() => toast.remove(), 1800);
}

document.querySelectorAll('.nav-item').forEach(btn => btn.addEventListener('click', () => { activeView = btn.dataset.view; render(); }));
document.querySelectorAll('#statusSegment button').forEach(btn => btn.addEventListener('click', () => { pendingStatus = btn.dataset.status; renderStatusSegment(); }));

trophyForm.addEventListener('submit', e => {
  e.preventDefault();
  const id=activeSpeciesId;
  if (!id) return trophyDialog.close();
  state.trophies[id] = {
    ...trophy(id),
    status: pendingStatus,
    date: document.getElementById('trophyDate').value,
    sex: document.getElementById('trophySex').value,
    location: document.getElementById('trophyLocation').value.trim(),
    notes: document.getElementById('trophyNotes').value.trim()
  };
  saveState(); trophyDialog.close(); showToast(`${targetFor(id).name} saved`); render();
});

huntForm.addEventListener('submit', e => {
  e.preventDefault();
  state.hunts.push({ id: crypto.randomUUID ? crypto.randomUUID() : String(Date.now()), name: document.getElementById('huntName').value.trim(), date: document.getElementById('huntDate').value, location: document.getElementById('huntLocation').value.trim(), notes: document.getElementById('huntNotes').value.trim() });
  saveState(); huntDialog.close(); showToast('Hunt added'); renderHunts();
});

document.getElementById('photoInput').addEventListener('change', async e => {
  if (!activeSpeciesId || !e.target.files?.length) return;
  const existing = await getPhotos(activeSpeciesId);
  const slots = Math.max(0, 6 - existing.length);
  const files = [...e.target.files].slice(0, slots);
  for (const file of files) {
    const data = await resizeImage(file, 1600, .82);
    await addPhoto(activeSpeciesId, data);
  }
  e.target.value=''; await renderDialogPhotos(activeSpeciesId); showToast(`${files.length} photo${files.length===1?'':'s'} added`);
});

document.getElementById('removePhotosButton').addEventListener('click', async () => {
  if (!activeSpeciesId) return;
  if (!confirm('Remove all locally stored photos for this trophy?')) return;
  await deletePhotos(activeSpeciesId); await renderDialogPhotos(activeSpeciesId); showToast('Photos removed');
});

function resizeImage(file, maxDimension=1600, quality=.82) {
  return new Promise((resolve,reject) => {
    const img=new Image(); const url=URL.createObjectURL(file);
    img.onload=() => {
      const scale=Math.min(1,maxDimension/Math.max(img.width,img.height)); const w=Math.round(img.width*scale); const h=Math.round(img.height*scale);
      const canvas=document.createElement('canvas'); canvas.width=w; canvas.height=h; canvas.getContext('2d').drawImage(img,0,0,w,h);
      URL.revokeObjectURL(url); resolve(canvas.toDataURL('image/jpeg',quality));
    };
    img.onerror=() => { URL.revokeObjectURL(url); reject(new Error('Image could not be read')); };
    img.src=url;
  });
}

const DB_NAME='trophy-tracker-photos'; const STORE='photos';
function openDB() { return new Promise((resolve,reject) => { const req=indexedDB.open(DB_NAME,1); req.onupgradeneeded=()=>{ if(!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE,{keyPath:'key'}); }; req.onsuccess=()=>resolve(req.result); req.onerror=()=>reject(req.error); }); }
async function getPhotos(speciesId) { const db=await openDB(); return new Promise((resolve,reject)=>{ const req=db.transaction(STORE).objectStore(STORE).getAll(); req.onsuccess=()=>resolve(req.result.filter(x=>x.speciesId===speciesId).sort((a,b)=>a.created-b.created)); req.onerror=()=>reject(req.error); }); }
async function getPrimaryPhoto(speciesId) { const photos=await getPhotos(speciesId); return photos[0]?.data || null; }
async function addPhoto(speciesId,data) { const db=await openDB(); return new Promise((resolve,reject)=>{ const tx=db.transaction(STORE,'readwrite'); tx.objectStore(STORE).put({key:`${speciesId}-${Date.now()}-${Math.random()}`,speciesId,data,created:Date.now()}); tx.oncomplete=resolve; tx.onerror=()=>reject(tx.error); }); }
async function deletePhotos(speciesId) { const db=await openDB(); const photos=await getPhotos(speciesId); return new Promise((resolve,reject)=>{ const tx=db.transaction(STORE,'readwrite'); photos.forEach(p=>tx.objectStore(STORE).delete(p.key)); tx.oncomplete=resolve; tx.onerror=()=>reject(tx.error); }); }
async function clearAllPhotos() { const db=await openDB(); return new Promise((resolve,reject)=>{ const tx=db.transaction(STORE,'readwrite'); tx.objectStore(STORE).clear(); tx.oncomplete=resolve; tx.onerror=()=>reject(tx.error); }); }

window.addEventListener('beforeinstallprompt', e => { e.preventDefault(); installPrompt=e; document.getElementById('installButton').hidden=false; });
document.getElementById('installButton').addEventListener('click', async () => { if(!installPrompt) return; installPrompt.prompt(); await installPrompt.userChoice; installPrompt=null; document.getElementById('installButton').hidden=true; });
if ('serviceWorker' in navigator) window.addEventListener('load', () => navigator.serviceWorker.register('./sw.js').catch(()=>{}));

render();
