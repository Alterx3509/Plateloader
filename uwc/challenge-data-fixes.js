/* Challenge-library corrections: shared upland records + current GSCO Super Slam 29. */
(() => {
  // Only state-program duplicates are canonicalized. Big-game IDs stay native to the base library.
  const alias = {
    'utah-california-quail':'california-quail','utah-gambels-quail':'gambels-quail','utah-chukar':'chukar','utah-cottontail':'cottontail-rabbit','utah-dusky-grouse':'dusky-grouse','utah-gray-partridge':'gray-partridge','utah-sage-grouse':'greater-sage-grouse','utah-jackrabbit':'jackrabbit','utah-mourning-dove':'mourning-dove','utah-pheasant':'ring-necked-pheasant','utah-ruffed-grouse':'ruffed-grouse','utah-sharp-tailed-grouse':'sharp-tailed-grouse','utah-snowshoe-hare':'snowshoe-hare','utah-ptarmigan':'white-tailed-ptarmigan','utah-wild-turkey':'wild-turkey',
    'ne-bobwhite':'northern-bobwhite','ne-prairie-chicken':'greater-prairie-chicken','ne-pheasant':'ring-necked-pheasant','ne-sharp-tailed-grouse':'sharp-tailed-grouse'
  };
  const canonicalNames={
    'california-quail':'California Quail','gambels-quail':"Gambel's Quail",'chukar':'Chukar','cottontail-rabbit':'Cottontail Rabbit','dusky-grouse':'Dusky Grouse','gray-partridge':'Gray Partridge','greater-sage-grouse':'Greater Sage-grouse','jackrabbit':'Jackrabbit','mourning-dove':'Mourning Dove','ring-necked-pheasant':'Ring-necked Pheasant','ruffed-grouse':'Ruffed Grouse','sharp-tailed-grouse':'Sharp-tailed Grouse','snowshoe-hare':'Snowshoe Hare','white-tailed-ptarmigan':'White-tailed Ptarmigan','wild-turkey':'Wild Turkey','northern-bobwhite':'Northern Bobwhite Quail','greater-prairie-chicken':'Greater Prairie-chicken'
  };
  const reverse={}; Object.entries(alias).forEach(([a,c])=>{(reverse[c] ||= []).push(a)});

  function mergeRecord(from,to){
    const old=state.trophies[from],cur=state.trophies[to]; if(!old)return;
    state.trophies[to]={...(old||{}),...(cur||{}),harvested:!!(old?.harvested||cur?.harvested),qualifies:{...(old?.qualifies||{}),...(cur?.qualifies||{})},verifications:{...(old?.verifications||{}),...(cur?.verifications||{})}};
    delete state.trophies[from];
  }

  // Undo the short-lived v1 big-game normalization if a device loaded it before this correction.
  const restoreBigGame={
    'coues-whitetail-deer':'coues-whitetail','columbia-blacktail-deer':'columbia-blacktail','sitka-blacktail-deer':'sitka-blacktail','central-canadian-barren-ground-caribou':'central-canada-barren-ground-caribou','bison':'american-bison','pronghorn-antelope':'pronghorn','stone-fannin-sheep':'stone-sheep'
  };
  Object.entries(restoreBigGame).forEach(([from,to])=>mergeRecord(from,to));
  Object.entries(alias).forEach(([from,to])=>mergeRecord(from,to));
  save();

  const baseTrophy=trophy;
  trophy=function(id){return baseTrophy(alias[id]||id)};
  const baseSpeciesById=speciesById;
  speciesById=function(id){
    const c=alias[id]||id;
    if(canonicalNames[c]){
      const type=(c.includes('rabbit')||c.includes('hare'))?'smallgame':(c.includes('turkey')?'turkey':'upland');
      return {id:c,name:canonicalNames[c],type};
    }
    return baseSpeciesById(c);
  };

  function programsForCanonical(c){
    const aliases=reverse[c]||[]; const out=[];
    if(aliases.some(x=>x.startsWith('utah-')))out.push(['utah-upland-ultimate','Utah Upland']);
    if(aliases.some(x=>x.startsWith('ne-')))out.push(['nebraska-upland','Nebraska Upland']);
    return out;
  }
  function injectSharedProgramRows(c){
    const programs=programsForCanonical(c); if(!programs.length)return;
    const rec=trophy(c);
    const modalEl=document.querySelector('.modal'); if(!modalEl)return;
    const counts=modalEl.querySelector('.lib-counts-toward>div');
    if(counts){counts.innerHTML=programs.map(([,name])=>`<span class="badge">${name}</span>`).join('')}
    let cert=modalEl.querySelector('.cert-list [data-qualify]')?.closest('.cert-list');
    if(!cert){
      const notes=modalEl.querySelector('#tNotes')?.closest('.field');
      if(notes){
        const head=document.createElement('div');head.className='section-head';head.innerHTML='<h3>State / Program Eligibility</h3>';
        cert=document.createElement('div');cert.className='card cert-list';
        notes.after(head,cert);
      }
    }
    if(cert){
      cert.innerHTML=programs.map(([id,name])=>`<label class="cert-row"><span>Qualifies for ${name}</span><input data-qualify="${id}" type="checkbox" ${rec.qualifies?.[id]?'checked':''}></label>`).join('');
    }
  }

  const baseOpenSpecies=openSpecies;
  openSpecies=function(id){
    const c=alias[id]||id;
    const preferred=alias[id]?id:(reverse[c]?.[0]||c);
    baseOpenSpecies(preferred);
    if(reverse[c]) injectSharedProgramRows(c);
    // Central Canadian Barren Ground Caribou is part of the corrected Super Slam even though the original draft omitted it.
    if(c==='central-canada-barren-ground-caribou'){
      const counts=document.querySelector('.lib-counts-toward>div');
      if(counts && !counts.textContent.includes('Super Slam 29')) counts.insertAdjacentHTML('beforeend','<span class="badge">Super Slam 29</span>');
    }
  };

  // Quick-add writes the canonical upland record and marks only the active state program eligible.
  document.addEventListener('click',e=>{
    const q=e.target.closest('[data-lib-quick]'); if(!q)return;
    const c=alias[q.dataset.libQuick]; if(!c)return;
    e.preventDefault(); e.stopImmediatePropagation();
    const r=trophy(c); const activeId=state.activeChallengeId;
    if(r.harvested){openSpecies(q.dataset.libQuick);return;}
    const qualifies={...(r.qualifies||{})};
    if(activeId==='utah-upland-ultimate'||activeId==='nebraska-upland')qualifies[activeId]=true;
    state.trophies[c]={...r,harvested:true,date:r.date||new Date().toISOString().slice(0,10),qualifies};
    save(); render(); toast(`${canonicalNames[c]||c} added`);
  },true);

  // Current GSCO Super Slam application: 29 targets, including Central Canadian Barren Ground Caribou and one Canada Moose target.
  const corrected=[
    ['black-bear','Black Bear'],['grizzly-bear','Grizzly Bear'],['alaska-brown-bear','Alaska Brown Bear'],['polar-bear','Polar Bear'],['cougar','Cougar'],
    ['whitetail-deer','Whitetail Deer'],['coues-whitetail','Coues Whitetail Deer'],['mule-deer','Mule Deer'],['sitka-blacktail','Sitka Blacktail Deer'],['columbia-blacktail','Columbia Blacktail Deer'],
    ['rocky-mountain-elk','Rocky Mountain Elk'],['roosevelt-elk','Roosevelt Elk'],['tule-elk','Tule Elk'],
    ['mountain-caribou','Mountain Caribou'],['woodland-caribou','Woodland Caribou'],['quebec-labrador-caribou','Quebec Labrador Caribou'],['barren-ground-caribou','Barren Ground Caribou'],['central-canada-barren-ground-caribou','Central Canadian Barren Ground Caribou'],
    [{anyOf:['western-canada-moose','eastern-canada-moose']},'Canada Moose — Western or Eastern'],['alaska-yukon-moose','Alaska Yukon Moose'],['shiras-moose','Shiras Moose'],['american-bison','Bison'],['muskox','Muskox'],['american-mountain-goat','American Mountain Goat'],['pronghorn','Pronghorn Antelope'],['dall-sheep','Dall Sheep'],[{anyOf:['stone-sheep','fannin-sheep']},'Stone / Fannin Sheep'],[{anyOf:['rocky-mountain-bighorn','california-bighorn']},'Rocky Mountain or California Bighorn'],['desert-bighorn','Desert Bighorn']
  ];
  const baseChallengeScreen=challengeScreen;
  const isDone=x=>(typeof x[0]==='string'?trophy(x[0]).harvested:x[0].anyOf.some(id=>trophy(id).harvested));
  const chosen=x=>typeof x[0]==='string'?x[0]:(x[0].anyOf.find(id=>trophy(id).harvested)||x[0].anyOf[0]);
  function glyph(id){if(id.includes('bear'))return'🐻';if(id.includes('cougar'))return'🐾';if(id.includes('sheep')||id.includes('bighorn'))return'🐏';if(id.includes('moose'))return'🫎';if(id.includes('bison'))return'🦬';if(id.includes('muskox'))return'🐂';if(id.includes('goat'))return'🐐';return'🦌'}
  function card(x,i){const d=isDone(x),id=chosen(x);return `<article class="card lib-target-card ${d?'harvested':''}" data-fix-open="${i}"><button class="quick-check ${d?'checked':''}" data-fix-quick="${i}">✓</button><div class="lib-target-icon"><span class="lib-animal-emoji">${glyph(id)}</span></div><div class="lib-target-copy"><strong>${escapeHtml(x[1])}</strong><small>${typeof x[0]==='string'?'trophy':x[0].anyOf.length+' qualifying options'}</small></div></article>`}
  challengeScreen=function(){
    let html=baseChallengeScreen(); if(state.activeChallengeId!=='gsco-super-slam')return html;
    const done=corrected.filter(isDone).length,pct=Math.round(done/29*100);
    html=html.replace(/<div class="progress-big">[\s\S]*?<\/div><div class="percent">[\s\S]*?<\/div>/,`<div class="progress-big">${done} <span>/ 29</span></div><div class="percent">${pct}% COMPLETE</div>`);
    html=html.replace(/<div class="progress-fill" style="width:[^"]*"><\/div>/,`<div class="progress-fill" style="width:${pct}%"></div>`);
    html=html.replace(/<div class="species-grid lib-target-grid">[\s\S]*?<\/div>\s*<p class="disclaimer">/,`<div class="species-grid lib-target-grid">${corrected.map(card).join('')}</div><p class="disclaimer">`);
    return html;
  };
  function openCorrect(i){
    const x=corrected[i]; if(!x)return;
    if(typeof x[0]==='string'){openSpecies(x[0]);return;}
    modal(`<div class="modal-head"><div><div class="eyebrow">CHOOSE QUALIFYING TROPHY</div><h2>${escapeHtml(x[1])}</h2></div><button class="close-btn" data-close>×</button></div><div class="lib-choice-list">${x[0].anyOf.map(id=>`<button class="card lib-choice" data-fix-pick="${id}"><span class="lib-animal-emoji small">${glyph(id)}</span><span><strong>${escapeHtml(speciesById(id).name)}</strong><small>${trophy(id).harvested?'Already in Trophy Room':'Add trophy record'}</small></span></button>`).join('')}</div>`);
    document.querySelectorAll('[data-fix-pick]').forEach(b=>b.onclick=()=>{closeModal();openSpecies(b.dataset.fixPick)});
  }
  document.addEventListener('click',e=>{
    const q=e.target.closest('[data-fix-quick]'); if(q){e.preventDefault();e.stopImmediatePropagation();const i=Number(q.dataset.fixQuick),x=corrected[i];if(isDone(x)){openCorrect(i);return;}if(typeof x[0]==='string'){const id=x[0],r=trophy(id);state.trophies[id]={...r,harvested:true,date:r.date||new Date().toISOString().slice(0,10)};save();render();return;}openCorrect(i);return;}
    const o=e.target.closest('[data-fix-open]'); if(o){e.preventDefault();e.stopImmediatePropagation();openCorrect(Number(o.dataset.fixOpen));}
  },true);

  // The base library can't see canonical state-species IDs when calculating Trophy Room badges, so patch those counts in the rendered rows.
  function knownCount(id){const c=alias[id]||id;const programs=programsForCanonical(c);return programs.length;}
  const obs=new MutationObserver(()=>document.querySelectorAll('[data-lib-species]').forEach(row=>{const c=knownCount(row.dataset.libSpecies);if(!c)return;const b=row.querySelector('.badge');if(b)b.textContent=`${c} challenge${c===1?'':'s'}`}));
  obs.observe(document.getElementById('screen'),{childList:true,subtree:true});
  render();
})();
