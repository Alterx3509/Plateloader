/* Corrections layered over challenge-library.js: canonical shared trophies + GSCO 29. */
(() => {
  const alias = {
    'utah-california-quail':'california-quail','utah-gambels-quail':'gambels-quail','utah-chukar':'chukar','utah-cottontail':'cottontail-rabbit','utah-dusky-grouse':'dusky-grouse','utah-gray-partridge':'gray-partridge','utah-sage-grouse':'greater-sage-grouse','utah-jackrabbit':'jackrabbit','utah-mourning-dove':'mourning-dove','utah-pheasant':'ring-necked-pheasant','utah-ruffed-grouse':'ruffed-grouse','utah-sharp-tailed-grouse':'sharp-tailed-grouse','utah-snowshoe-hare':'snowshoe-hare','utah-ptarmigan':'white-tailed-ptarmigan','utah-wild-turkey':'wild-turkey',
    'ne-bobwhite':'northern-bobwhite','ne-prairie-chicken':'greater-prairie-chicken','ne-pheasant':'ring-necked-pheasant','ne-sharp-tailed-grouse':'sharp-tailed-grouse',
    'coues-whitetail':'coues-whitetail-deer','columbia-blacktail':'columbia-blacktail-deer','sitka-blacktail':'sitka-blacktail-deer','central-canada-barren-ground-caribou':'central-canadian-barren-ground-caribou','american-bison':'bison','pronghorn':'pronghorn-antelope','stone-sheep':'stone-fannin-sheep','fannin-sheep':'stone-fannin-sheep'
  };
  const canonicalNames={
    'california-quail':'California Quail','gambels-quail':"Gambel's Quail",'chukar':'Chukar','cottontail-rabbit':'Cottontail Rabbit','dusky-grouse':'Dusky Grouse','gray-partridge':'Gray Partridge','greater-sage-grouse':'Greater Sage-grouse','jackrabbit':'Jackrabbit','mourning-dove':'Mourning Dove','ring-necked-pheasant':'Ring-necked Pheasant','ruffed-grouse':'Ruffed Grouse','sharp-tailed-grouse':'Sharp-tailed Grouse','snowshoe-hare':'Snowshoe Hare','white-tailed-ptarmigan':'White-tailed Ptarmigan','wild-turkey':'Wild Turkey','northern-bobwhite':'Northern Bobwhite Quail','greater-prairie-chicken':'Greater Prairie-chicken',
    'coues-whitetail-deer':'Coues Whitetail Deer','columbia-blacktail-deer':'Columbia Blacktail Deer','sitka-blacktail-deer':'Sitka Blacktail Deer','central-canadian-barren-ground-caribou':'Central Canadian Barren Ground Caribou','bison':'Bison','pronghorn-antelope':'Pronghorn Antelope','stone-fannin-sheep':'Stone / Fannin Sheep'
  };
  const reverse={};Object.entries(alias).forEach(([a,c])=>{(reverse[c] ||= []).push(a)});
  function mergeRecord(a,c){
    const old=state.trophies[a],cur=state.trophies[c]; if(!old)return;
    state.trophies[c]={...(old||{}),...(cur||{}),harvested:!!(old?.harvested||cur?.harvested),qualifies:{...(old?.qualifies||{}),...(cur?.qualifies||{})},verifications:{...(old?.verifications||{}),...(cur?.verifications||{})}};
    delete state.trophies[a];
  }
  Object.entries(alias).forEach(([a,c])=>mergeRecord(a,c)); save();

  const baseTrophy=trophy;
  trophy=function(id){return baseTrophy(alias[id]||id)};
  const baseSpeciesById=speciesById;
  speciesById=function(id){
    const c=alias[id]||id;
    if(canonicalNames[c]) return {id:c,name:canonicalNames[c],type:(c.includes('rabbit')||c.includes('hare'))?'smallgame':(c.includes('turkey')?'turkey':(c.includes('deer')?'deer':'upland'))};
    return baseSpeciesById(c);
  };

  const baseOpenSpecies=openSpecies;
  openSpecies=function(id){
    const c=alias[id]||id;
    if(id!==c){
      baseOpenSpecies(id);
      const saveBtn=document.getElementById('saveTrophy');
      if(saveBtn) saveBtn.addEventListener('click',()=>setTimeout(()=>{mergeRecord(id,c);save();},0),{once:true});
      return;
    }
    baseOpenSpecies(c);
  };

  // Prevent quick-add from creating duplicate state keys for shared upland trophies.
  document.addEventListener('click',e=>{
    const q=e.target.closest('[data-lib-quick]'); if(!q)return;
    const c=alias[q.dataset.libQuick]; if(!c)return;
    e.preventDefault();e.stopImmediatePropagation();
    const r=trophy(c); const activeId=state.activeChallengeId;
    if(r.harvested){openSpecies(c);return;}
    const qualifies={...(r.qualifies||{})}; if(activeId==='utah-upland-ultimate'||activeId==='nebraska-upland')qualifies[activeId]=true;
    state.trophies[c]={...r,harvested:true,date:r.date||new Date().toISOString().slice(0,10),qualifies};save();render();toast(`${canonicalNames[c]||c} added`);
  },true);

  // Correct current GSCO Super Slam 29 layout: includes Central Canadian Barren Ground Caribou and one Canada Moose target (Western or Eastern).
  const corrected=[
    ['black-bear','Black Bear'],['grizzly-bear','Grizzly Bear'],['alaska-brown-bear','Alaska Brown Bear'],['polar-bear','Polar Bear'],['cougar','Cougar'],
    ['whitetail-deer','Whitetail Deer'],['coues-whitetail-deer','Coues Whitetail Deer'],['mule-deer','Mule Deer'],['sitka-blacktail-deer','Sitka Blacktail Deer'],['columbia-blacktail-deer','Columbia Blacktail Deer'],
    ['rocky-mountain-elk','Rocky Mountain Elk'],['roosevelt-elk','Roosevelt Elk'],['tule-elk','Tule Elk'],
    ['mountain-caribou','Mountain Caribou'],['woodland-caribou','Woodland Caribou'],['quebec-labrador-caribou','Quebec Labrador Caribou'],['barren-ground-caribou','Barren Ground Caribou'],['central-canadian-barren-ground-caribou','Central Canadian Barren Ground Caribou'],
    [{anyOf:['western-canada-moose','eastern-canada-moose']},'Canada Moose — Western or Eastern'],['alaska-yukon-moose','Alaska Yukon Moose'],['shiras-moose','Shiras Moose'],['bison','Bison'],['muskox','Muskox'],['american-mountain-goat','American Mountain Goat'],['pronghorn-antelope','Pronghorn Antelope'],['dall-sheep','Dall Sheep'],['stone-fannin-sheep','Stone / Fannin Sheep'],[{anyOf:['rocky-mountain-bighorn','california-bighorn']},'Rocky Mountain or California Bighorn'],['desert-bighorn','Desert Bighorn']
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
    const x=corrected[i];if(!x)return; if(typeof x[0]==='string'){openSpecies(x[0]);return;}
    modal(`<div class="modal-head"><div><div class="eyebrow">CHOOSE QUALIFYING TROPHY</div><h2>${escapeHtml(x[1])}</h2></div><button class="close-btn" data-close>×</button></div><div class="lib-choice-list">${x[0].anyOf.map(id=>`<button class="card lib-choice" data-fix-pick="${id}"><span class="lib-animal-emoji small">${glyph(id)}</span><span><strong>${escapeHtml(speciesById(id).name)}</strong><small>${trophy(id).harvested?'Already in Trophy Room':'Add trophy record'}</small></span></button>`).join('')}</div>`);
    document.querySelectorAll('[data-fix-pick]').forEach(b=>b.onclick=()=>{closeModal();openSpecies(b.dataset.fixPick)});
  }
  document.addEventListener('click',e=>{
    const q=e.target.closest('[data-fix-quick]');if(q){e.preventDefault();e.stopImmediatePropagation();const x=corrected[Number(q.dataset.fixQuick)];if(isDone(x)){openCorrect(Number(q.dataset.fixQuick));return;}if(typeof x[0]==='string'){const id=x[0],r=trophy(id);state.trophies[id]={...r,harvested:true,date:r.date||new Date().toISOString().slice(0,10)};save();render();return;}openCorrect(Number(q.dataset.fixQuick));return;}
    const o=e.target.closest('[data-fix-open]');if(o){e.preventDefault();e.stopImmediatePropagation();openCorrect(Number(o.dataset.fixOpen));}
  },true);

  // Correct trophy-room challenge-count badges for canonical shared upland records.
  function knownCount(id){const c=alias[id]||id;let n=0;if(['ring-necked-pheasant','sharp-tailed-grouse'].includes(c))n+=2;else if(['california-quail','gambels-quail','chukar','cottontail-rabbit','dusky-grouse','gray-partridge','greater-sage-grouse','jackrabbit','mourning-dove','ruffed-grouse','snowshoe-hare','white-tailed-ptarmigan','wild-turkey'].includes(c))n+=1;else if(['northern-bobwhite','greater-prairie-chicken'].includes(c))n+=1;return n;}
  const obs=new MutationObserver(()=>document.querySelectorAll('[data-lib-species]').forEach(row=>{const id=row.dataset.libSpecies,c=knownCount(id);if(!c)return;const b=row.querySelector('.badge');if(b)b.textContent=`${c} challenge${c===1?'':'s'}`}));
  obs.observe(document.getElementById('screen'),{childList:true,subtree:true});

  render();
})();
