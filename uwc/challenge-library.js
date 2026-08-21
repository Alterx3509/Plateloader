/* Trophy Tracker challenge library — shared trophy records across hunting slams. */
(() => {
  const WF = Object.fromEntries(SPECIES.map(s => [s.id, {...s, type:'waterfowl'}]));
  const M = {
    ...WF,
    'american-coot': {id:'american-coot', name:'American Coot', type:'waterfowl'},
    'turkey-eastern': {id:'turkey-eastern', name:'Eastern Wild Turkey', type:'turkey'},
    'turkey-merriams': {id:'turkey-merriams', name:"Merriam's Wild Turkey", type:'turkey'},
    'turkey-osceola': {id:'turkey-osceola', name:'Osceola Wild Turkey', type:'turkey'},
    'turkey-rio-grande': {id:'turkey-rio-grande', name:'Rio Grande Wild Turkey', type:'turkey'},
    'turkey-goulds': {id:'turkey-goulds', name:"Gould's Wild Turkey", type:'turkey'},
    'turkey-ocellated': {id:'turkey-ocellated', name:'Ocellated Turkey', type:'turkey'},
    'utah-california-quail': {id:'utah-california-quail', name:'California Quail', type:'upland'},
    'utah-gambels-quail': {id:'utah-gambels-quail', name:"Gambel's Quail", type:'upland'},
    'utah-chukar': {id:'utah-chukar', name:'Chukar', type:'upland'},
    'utah-cottontail': {id:'utah-cottontail', name:'Cottontail Rabbit', type:'smallgame'},
    'utah-dusky-grouse': {id:'utah-dusky-grouse', name:'Dusky Grouse', type:'upland'},
    'utah-gray-partridge': {id:'utah-gray-partridge', name:'Gray Partridge', type:'upland'},
    'utah-sage-grouse': {id:'utah-sage-grouse', name:'Greater Sage-Grouse', type:'upland'},
    'utah-jackrabbit': {id:'utah-jackrabbit', name:'Jackrabbit', type:'smallgame'},
    'utah-mourning-dove': {id:'utah-mourning-dove', name:'Mourning Dove', type:'upland'},
    'utah-pheasant': {id:'utah-pheasant', name:'Ring-necked Pheasant', type:'upland'},
    'utah-ruffed-grouse': {id:'utah-ruffed-grouse', name:'Ruffed Grouse', type:'upland'},
    'utah-sharp-tailed-grouse': {id:'utah-sharp-tailed-grouse', name:'Sharp-tailed Grouse', type:'upland'},
    'utah-snowshoe-hare': {id:'utah-snowshoe-hare', name:'Snowshoe Hare', type:'smallgame'},
    'utah-ptarmigan': {id:'utah-ptarmigan', name:'White-tailed Ptarmigan', type:'upland'},
    'utah-wild-turkey': {id:'utah-wild-turkey', name:'Wild Turkey', type:'turkey'},
    'ne-bobwhite': {id:'ne-bobwhite', name:'Northern Bobwhite Quail', type:'upland'},
    'ne-prairie-chicken': {id:'ne-prairie-chicken', name:'Greater Prairie-Chicken', type:'upland'},
    'ne-pheasant': {id:'ne-pheasant', name:'Ring-necked Pheasant', type:'upland'},
    'ne-sharp-tailed-grouse': {id:'ne-sharp-tailed-grouse', name:'Sharp-tailed Grouse', type:'upland'},
    'black-bear': {id:'black-bear', name:'Black Bear', type:'bear'},
    'grizzly-bear': {id:'grizzly-bear', name:'Grizzly Bear', type:'bear'},
    'alaska-brown-bear': {id:'alaska-brown-bear', name:'Alaska Brown Bear', type:'bear'},
    'polar-bear': {id:'polar-bear', name:'Polar Bear', type:'bear'},
    'cougar': {id:'cougar', name:'Cougar / Mountain Lion', type:'cat'},
    'jaguar': {id:'jaguar', name:'Jaguar', type:'cat'},
    'whitetail-deer': {id:'whitetail-deer', name:'White-tailed Deer', type:'deer'},
    'coues-whitetail': {id:'coues-whitetail', name:'Coues White-tailed Deer', type:'deer'},
    'columbia-blacktail': {id:'columbia-blacktail', name:'Columbia Black-tailed Deer', type:'deer'},
    'mule-deer': {id:'mule-deer', name:'Mule Deer', type:'deer'},
    'sitka-blacktail': {id:'sitka-blacktail', name:'Sitka Black-tailed Deer', type:'deer'},
    'rocky-mountain-elk': {id:'rocky-mountain-elk', name:'Rocky Mountain Elk', type:'elk'},
    'roosevelt-elk': {id:'roosevelt-elk', name:'Roosevelt Elk', type:'elk'},
    'tule-elk': {id:'tule-elk', name:'Tule Elk', type:'elk'},
    'mountain-caribou': {id:'mountain-caribou', name:'Mountain Caribou', type:'caribou'},
    'woodland-caribou': {id:'woodland-caribou', name:'Woodland Caribou', type:'caribou'},
    'quebec-labrador-caribou': {id:'quebec-labrador-caribou', name:'Quebec-Labrador Caribou', type:'caribou'},
    'barren-ground-caribou': {id:'barren-ground-caribou', name:'Barren-ground Caribou', type:'caribou'},
    'central-canada-barren-ground-caribou': {id:'central-canada-barren-ground-caribou', name:'Central Canada Barren-ground Caribou', type:'caribou'},
    'western-canada-moose': {id:'western-canada-moose', name:'Western Canada Moose', type:'moose'},
    'eastern-canada-moose': {id:'eastern-canada-moose', name:'Eastern Canada Moose', type:'moose'},
    'alaska-yukon-moose': {id:'alaska-yukon-moose', name:'Alaska-Yukon Moose', type:'moose'},
    'shiras-moose': {id:'shiras-moose', name:'Shiras Moose', type:'moose'},
    'american-bison': {id:'american-bison', name:'American Bison', type:'bison'},
    'muskox': {id:'muskox', name:'Muskox', type:'muskox'},
    'american-mountain-goat': {id:'american-mountain-goat', name:'American Mountain Goat', type:'goat'},
    'pronghorn': {id:'pronghorn', name:'Pronghorn Antelope', type:'pronghorn'},
    'dall-sheep': {id:'dall-sheep', name:'Dall Sheep', type:'sheep'},
    'stone-sheep': {id:'stone-sheep', name:'Stone Sheep', type:'sheep'},
    'fannin-sheep': {id:'fannin-sheep', name:'Fannin Sheep', type:'sheep'},
    'desert-bighorn': {id:'desert-bighorn', name:'Desert Bighorn Sheep', type:'sheep'},
    'rocky-mountain-bighorn': {id:'rocky-mountain-bighorn', name:'Rocky Mountain Bighorn Sheep', type:'sheep'},
    'california-bighorn': {id:'california-bighorn', name:'California Bighorn Sheep', type:'sheep'},
    'gray-wolf': {id:'gray-wolf', name:'Gray Wolf', type:'wolf'},
    'atlantic-walrus': {id:'atlantic-walrus', name:'Atlantic Walrus', type:'marine'},
    'pacific-walrus': {id:'pacific-walrus', name:'Pacific Walrus', type:'marine'},
    'american-alligator': {id:'american-alligator', name:'American Alligator', type:'reptile'},
    'javelina': {id:'javelina', name:'Peccary / Javelina', type:'smallgame'}
  };

  const t = (id, label, group) => ({id, label: label || M[id]?.name || id, group});
  const any = (id, label, ids, group) => ({id, label, anyOf:ids, group});

  const UWC_TARGETS = SPECIES.map(s => t(s.id, s.name, s.categoryName));
  const UTAH_WF = [
    t('mallard'),t('pintail'),t('american-wigeon'),t('gadwall'),t('cinnamon-teal'),t('green-winged-teal'),t('northern-shoveler'),
    t('redhead'),t('canvasback'),t('ring-necked-duck'),any('utah-scaup','Scaup (Lesser or Greater)',['lesser-scaup','greater-scaup']),t('ruddy-duck'),t('bufflehead'),
    any('utah-goldeneye','Goldeneye (Common or Barrow’s)',['common-goldeneye','barrows-goldeneye']),
    any('utah-merganser','Merganser (Common, Red-breasted or Hooded)',['common-merganser','red-breasted-merganser','hooded-merganser']),
    t('american-coot'),t('canada-goose'),any('utah-snow-ross','Snow or Ross’s Goose',['snow-goose','ross-goose']),t('tundra-swan')
  ];
  const TURKEY = [t('turkey-eastern'),t('turkey-merriams'),t('turkey-osceola'),t('turkey-rio-grande'),t('turkey-goulds'),t('turkey-ocellated')];
  const UTAH_UPLAND_IDS = ['utah-california-quail','utah-gambels-quail','utah-chukar','utah-cottontail','utah-dusky-grouse','utah-gray-partridge','utah-sage-grouse','utah-jackrabbit','utah-mourning-dove','utah-pheasant','utah-ruffed-grouse','utah-sharp-tailed-grouse','utah-snowshoe-hare','utah-ptarmigan','utah-wild-turkey'];
  const NE_UPLAND_IDS = ['ne-bobwhite','ne-prairie-chicken','ne-pheasant','ne-sharp-tailed-grouse'];
  const WA_TURKEY = [t('turkey-eastern'),t('turkey-merriams'),t('turkey-rio-grande')];

  const GSCO_SUPER_TEN = [
    any('gsco-bears','Bears',['black-bear','grizzly-bear','alaska-brown-bear','polar-bear'],'Bears'),
    any('gsco-cats','Cats',['cougar','jaguar'],'Cats'),
    any('gsco-deer','Deer',['whitetail-deer','coues-whitetail','columbia-blacktail','mule-deer','sitka-blacktail'],'Deer'),
    any('gsco-elk','Elk',['rocky-mountain-elk','roosevelt-elk','tule-elk'],'Elk'),
    any('gsco-caribou','Caribou',['mountain-caribou','woodland-caribou','quebec-labrador-caribou','barren-ground-caribou','central-canada-barren-ground-caribou'],'Caribou'),
    any('gsco-moose','Moose',['western-canada-moose','eastern-canada-moose','alaska-yukon-moose','shiras-moose'],'Moose'),
    any('gsco-bison-muskox','Bison / Muskox',['american-bison','muskox'],'Bison / Muskox'),
    t('american-mountain-goat','American Mountain Goat','Goat'),
    t('pronghorn','Pronghorn Antelope','Antelope'),
    any('gsco-sheep','North American Wild Sheep',['dall-sheep','stone-sheep','fannin-sheep','desert-bighorn','rocky-mountain-bighorn','california-bighorn'],'Sheep')
  ];

  const GSCO_SUPER_SLAM = [
    t('black-bear'),t('grizzly-bear'),t('alaska-brown-bear'),t('polar-bear'),t('cougar'),
    t('whitetail-deer'),t('coues-whitetail'),t('columbia-blacktail'),t('mule-deer'),t('sitka-blacktail'),
    t('rocky-mountain-elk'),t('roosevelt-elk'),t('tule-elk'),
    t('mountain-caribou'),t('woodland-caribou'),t('quebec-labrador-caribou'),t('barren-ground-caribou'),
    t('western-canada-moose'),t('eastern-canada-moose'),t('alaska-yukon-moose'),t('shiras-moose'),
    t('american-bison'),t('muskox'),t('american-mountain-goat'),t('pronghorn'),
    t('dall-sheep'),any('ss-stone-fannin','Stone or Fannin Sheep',['stone-sheep','fannin-sheep']),t('desert-bighorn'),
    any('ss-rocky-california','Rocky Mountain or California Bighorn',['rocky-mountain-bighorn','california-bighorn'])
  ];
  const GSCO_SHEEP = [
    t('dall-sheep'),any('sheep-stone-fannin','Stone or Fannin Sheep',['stone-sheep','fannin-sheep']),
    any('sheep-rocky-california','Rocky Mountain or California Bighorn',['rocky-mountain-bighorn','california-bighorn']),t('desert-bighorn')
  ];
  const SCI_NA_IDS = [...new Set(GSCO_SUPER_SLAM.flatMap(x => x.anyOf || [x.id]).concat(['gray-wolf','atlantic-walrus','pacific-walrus','american-alligator','javelina']))];

  const C = [
    {id:'uwc-na', name:'Ultimate Waterfowlers Challenge', short:'UWC Grand Slam', org:'Ultimate Waterfowlers Challenge', icon:'🦆', targets:UWC_TARGETS, total:41, source:'https://waterfowlerschallenge.com/uwc-official-rules/', note:'41 North American waterfowl targets. Personal progress is separate from official UWC certification.', milestones:[{name:'Master',count:15},{name:'Master Elite',count:30},{name:'Grand Master',count:41}]},
    {id:'utah-waterfowl-ultimate', name:'Utah Waterfowl Ultimate Slam', short:'Utah Waterfowl', org:'Utah DWR', icon:'🌊', targets:UTAH_WF, total:19, source:'https://wildlife.utah.gov/slams/waterfowl', qualificationRequired:true, note:'19 targets. Utah DWR allows the Ultimate to be completed in a single season or over a lifetime; official eligibility rules still apply.', milestones:[{name:'Ultimate Slam',count:19}]},
    {id:'nwtf-turkey', name:'NWTF Turkey Slams', short:'Turkey Slams', org:'National Wild Turkey Federation', icon:'🦃', targets:TURKEY, total:6, source:'https://www.nwtf.org/content-hub/chasing-the-grand-slam', note:'Grand = Eastern, Merriam’s, Osceola and Rio Grande; Royal adds Gould’s; World adds Ocellated.', milestones:[{name:'Grand Slam',ids:['turkey-eastern','turkey-merriams','turkey-osceola','turkey-rio-grande']},{name:'Royal Slam',ids:['turkey-eastern','turkey-merriams','turkey-osceola','turkey-rio-grande','turkey-goulds']},{name:'World Slam',ids:['turkey-eastern','turkey-merriams','turkey-osceola','turkey-rio-grande','turkey-goulds','turkey-ocellated']}]},
    {id:'utah-upland-ultimate', name:'Utah Upland Game Ultimate Slam', short:'Utah Upland', org:'Utah DWR', icon:'🪶', targets:UTAH_UPLAND_IDS.map(id=>t(id)), total:15, source:'https://wildlife.utah.gov/slams/upland', qualificationRequired:true, note:'15 Utah upland/small-game species; the Ultimate may be completed over multiple years.', milestones:[{name:'Ultimate Slam',count:15}]},
    {id:'nebraska-upland', name:'Nebraska Upland Slam', short:'Nebraska Upland', org:'Nebraska Game & Parks', icon:'🌾', targets:NE_UPLAND_IDS.map(id=>t(id)), total:4, source:'https://outdoornebraska.gov/about/press-events/events/slams-challenges/upland-slam/', qualificationRequired:true, note:'Four Nebraska upland birds during the program year.', milestones:[{name:'Upland Slam',count:4}]},
    {id:'washington-turkey', name:'Washington Turkey Slam', short:'Washington Turkey', org:'WDFW + NWTF', icon:'🌲', targets:WA_TURKEY, total:3, source:'https://wdfw.wa.gov/', qualificationRequired:true, note:'Eastern, Merriam’s and Rio Grande harvested in qualifying Washington counties.', milestones:[{name:'Washington Slam',count:3}]},
    {id:'gsco-super-ten', name:'GSCO Super Ten', short:'Super Ten', org:'Grand Slam Club/Ovis', icon:'🔟', targets:GSCO_SUPER_TEN, total:10, source:'https://grandslamclub.org/awards/super-ten/', note:'One qualifying animal from each of 10 North American big-game groupings.', milestones:[{name:'Super Ten',count:10}]},
    {id:'gsco-super-slam', name:'GSCO Super Slam of North American Big Game', short:'Super Slam 29', org:'Grand Slam Club/Ovis', icon:'🏔️', targets:GSCO_SUPER_SLAM, total:29, source:'https://grandslamclub.org/awards/superslam/', note:'The 29 traditionally recognized North American big-game trophy types.', milestones:[{name:'Super Slam',count:29}]},
    {id:'gsco-sheep-grand-slam', name:'Grand Slam of North American Wild Sheep', short:'Sheep Grand Slam', org:'Grand Slam Club/Ovis', icon:'🐏', targets:GSCO_SHEEP, total:4, source:'https://grandslamclub.org/awards/grand-slam/', note:'Dall; Stone or Fannin; Rocky Mountain or California bighorn; Desert bighorn.', milestones:[{name:'1/2 Slam',count:2},{name:'3/4 Slam',count:3},{name:'Grand Slam',count:4}]},
    {id:'sci-na12', name:'SCI North American 12', short:'North American 12', org:'Safari Club International', icon:'🧭', targets:SCI_NA_IDS.map(id=>t(id)), total:12, source:'https://safariclub.org/awards/world-hunting-awards-2/', sci:true, note:'Personal tracker for SCI’s Continental Award. Official requirements include 12 species with at least one bear, mule deer, white-tailed deer, caribou, moose and elk; free-range and current SCI eligibility rules apply.', milestones:[{name:'North American 12',count:12}]},
    {id:'gsco-ovis-world', name:'Ovis World Slam', short:'Ovis World Slam', org:'Grand Slam Club/Ovis', icon:'🐏', external:true, total:12, source:'https://grandslamclub.org/resources/forms/', note:'Advanced program: 12 recognized world sheep species/subspecies. Full eligible-species catalog will be added as a dedicated world-sheep module.'},
    {id:'gsco-capra-world', name:'Capra World Slam', short:'Capra World Slam', org:'Grand Slam Club/Ovis', icon:'🐐', external:true, total:12, source:'https://grandslamclub.org/resources/forms/', note:'Advanced program: 12 recognized Capra species/subspecies. Full eligible-species catalog will be added as a dedicated world-goat module.'}
  ];

  let libraryFilter = 'all';
  if (!state.activeChallengeId || !C.some(c => c.id === state.activeChallengeId && !c.external)) state.activeChallengeId = 'uwc-na';
  save();

  const oldSpeciesById = speciesById;
  speciesById = id => M[id] || oldSpeciesById(id) || {id, name:id.replaceAll('-',' '), type:'other'};

  function active(){ return C.find(c => c.id === state.activeChallengeId) || C[0]; }
  function targetIds(target){ return target.anyOf || [target.id]; }
  function trophyQualifies(ch, id){
    const rec = trophy(id);
    if (!rec.harvested) return false;
    if (!ch.qualificationRequired) return true;
    return !!rec.qualifies?.[ch.id];
  }
  function targetDone(ch, target){ return targetIds(target).some(id => trophyQualifies(ch,id)); }
  function progress(ch){
    if (ch.sci) {
      const harvested = SCI_NA_IDS.filter(id => trophy(id).harvested).length;
      return {done:Math.min(harvested,12), raw:harvested, total:12, complete:sciRequiredComplete() && harvested >= 12};
    }
    const done = ch.targets.filter(x => targetDone(ch,x)).length;
    return {done,total:ch.total || ch.targets.length,complete:done >= (ch.total || ch.targets.length)};
  }
  function sciRequiredComplete(){
    const anyHarvested = ids => ids.some(id=>trophy(id).harvested);
    return anyHarvested(['black-bear','grizzly-bear','alaska-brown-bear','polar-bear']) && trophy('mule-deer').harvested && trophy('whitetail-deer').harvested &&
      anyHarvested(['mountain-caribou','woodland-caribou','quebec-labrador-caribou','barren-ground-caribou']) &&
      anyHarvested(['western-canada-moose','eastern-canada-moose','alaska-yukon-moose','shiras-moose']) &&
      anyHarvested(['rocky-mountain-elk','roosevelt-elk','tule-elk']);
  }
  function milestoneEarned(ch,m){
    if (m.ids) return m.ids.every(id => trophy(id).harvested);
    if (ch.sci && m.count === 12) return progress(ch).complete;
    return progress(ch).done >= m.count;
  }
  function iconFor(id, size='normal'){
    if (window.WaterfowlIcons?.profiles?.[id]) return `<span class="lib-wf ${size}">${window.WaterfowlIcons.icon(id)}</span>`;
    const type = M[id]?.type;
    const emoji = ({turkey:'🦃',upland:'🪶',smallgame:'🐇',bear:'🐻',cat:'🐾',deer:'🦌',elk:'🦌',caribou:'🦌',moose:'🫎',bison:'🦬',muskox:'🐂',goat:'🐐',pronghorn:'🦌',sheep:'🐏',wolf:'🐺',marine:'🦭',reptile:'🐊',waterfowl:'🦆'})[type] || '🏆';
    return `<span class="lib-animal-emoji ${size}">${emoji}</span>`;
  }
  function chosenFor(ch,target){ return targetIds(target).find(id=>trophyQualifies(ch,id)) || targetIds(target).find(id=>trophy(id).harvested) || targetIds(target)[0]; }
  function challengeCard(ch){
    if(ch.external) return `<button class="lib-challenge-card advanced" data-lib-info="${ch.id}"><span>${ch.icon}</span><strong>${ch.short}</strong><small>${ch.org}</small><em>${ch.total} recognized trophies</em></button>`;
    const p=progress(ch); const pct=Math.min(100,Math.round(p.done/p.total*100));
    return `<button class="lib-challenge-card ${ch.id===state.activeChallengeId?'active':''}" data-lib-challenge="${ch.id}"><span>${ch.icon}</span><strong>${ch.short}</strong><small>${ch.org}</small><em>${p.done}/${p.total} · ${pct}%</em></button>`;
  }
  function targetCard(ch,target){
    const done=targetDone(ch,target); const picked=chosenFor(ch,target); const meta=M[picked];
    return `<article class="card lib-target-card ${done?'harvested':''}" data-lib-target-open="${target.id}">
      <div class="cover-thumb-holder" data-cover="${picked}"></div>
      <button class="quick-check ${done?'checked':''}" data-lib-quick="${target.id}" aria-label="${done?'Review':'Mark'} ${escapeHtml(target.label)}">✓</button>
      <div class="lib-target-icon">${iconFor(picked)}</div>
      <div class="lib-target-copy"><strong>${escapeHtml(target.label)}</strong><small>${target.anyOf ? `${target.anyOf.length} qualifying options` : (meta?.type || 'trophy')}</small></div>
    </article>`;
  }

  challengeScreen = function(){
    const ch=active(), p=progress(ch), pct=Math.min(100,Math.round(p.done/p.total*100));
    const groups=[...new Set(ch.targets.map(x=>x.group).filter(Boolean))];
    let shown=ch.targets;
    if(libraryFilter!=='all') shown=ch.targets.filter(x=>(x.group || M[targetIds(x)[0]]?.type)===libraryFilter);
    return `<div class="section-head lib-library-head"><h3>Challenge Library</h3><span class="subtle">${C.filter(x=>!x.external).length} trackable · 2 advanced</span></div>
      <div class="lib-challenge-scroll">${C.map(challengeCard).join('')}</div>
      <section class="card hero lib-hero">
        <div class="series">${escapeHtml(ch.org.toUpperCase())}</div><h2>${escapeHtml(ch.name)}</h2>
        <div class="progress-row"><div class="progress-big">${p.done} <span>/ ${p.total}</span></div><div class="percent">${pct}% COMPLETE</div></div>
        <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
        <div class="milestones lib-milestones">${(ch.milestones||[]).map(m=>`<div class="milestone ${milestoneEarned(ch,m)?'earned':''}"><div class="dot">${milestoneEarned(ch,m)?'✓':'○'}</div><strong>${escapeHtml(m.name)}</strong><small>${m.ids?m.ids.length+' required':m.count+'/'+p.total}</small></div>`).join('')}</div>
        <p class="lib-note">${escapeHtml(ch.note)}</p><a class="lib-source" href="${ch.source}" target="_blank" rel="noopener">Official program / rules ↗</a>
      </section>
      ${ch.sci?`<div class="card lib-requirements"><strong>Required within your 12</strong><div>${sciRequirementChips()}</div></div>`:''}
      <div class="section-head"><h3>${ch.sci?'Eligible Trophy List':'Targets'}</h3><span class="subtle">tap ✓ to add</span></div>
      ${groups.length?`<div class="filter-scroll"><button class="filter-chip ${libraryFilter==='all'?'active':''}" data-lib-filter="all">All</button>${groups.map(g=>`<button class="filter-chip ${libraryFilter===g?'active':''}" data-lib-filter="${escapeHtml(g)}">${escapeHtml(g)}</button>`).join('')}</div>`:''}
      <div class="species-grid lib-target-grid">${shown.map(x=>targetCard(ch,x)).join('')}</div>
      <p class="disclaimer">Trophy Tracker is an independent personal record. It does not certify awards for UWC, Utah DWR, NWTF, Nebraska Game & Parks, WDFW, GSCO or SCI. Always verify the organization’s current official rules before submission.</p>`;
  };

  function sciRequirementChips(){
    const ok=(ids)=>ids.some(id=>trophy(id).harvested);
    const req=[['Bear',['black-bear','grizzly-bear','alaska-brown-bear','polar-bear']],['Mule deer',['mule-deer']],['White-tail',['whitetail-deer']],['Caribou',['mountain-caribou','woodland-caribou','quebec-labrador-caribou','barren-ground-caribou']],['Moose',['western-canada-moose','eastern-canada-moose','alaska-yukon-moose','shiras-moose']],['Elk',['rocky-mountain-elk','roosevelt-elk','tule-elk']]];
    return req.map(([name,ids])=>`<span class="badge ${ok(ids)?'lib-ok':''}">${ok(ids)?'✓ ':'○ '}${name}</span>`).join('');
  }

  trophyScreen = function(){
    const list=Object.entries(state.trophies).filter(([,r])=>r?.harvested).map(([id])=>speciesById(id)).sort((a,b)=>(trophy(b.id).date||'').localeCompare(trophy(a.id).date||''));
    return `<div class="section-head"><h3>Trophy Room</h3><span class="subtle">${list.length} trophies</span></div>
      ${list.length?`<div class="list">${list.map(s=>{const r=trophy(s.id); const count=challengesForSpecies(s.id).length; return `<div class="card trophy-row" data-lib-species="${s.id}"><div class="thumb" data-thumb="${s.id}">${iconFor(s.id,'small')}</div><div><strong>${escapeHtml(s.name)}</strong><small>${formatDate(r.date)}${r.location?' · '+escapeHtml(r.location):''}</small></div><span class="badge">${count} challenge${count===1?'':'s'}</span></div>`}).join('')}</div>`:`<div class="card empty"><div class="emoji">🏆</div><strong>Your trophy room is empty.</strong><p>Mark a trophy in any challenge and it appears here once.</p></div>`}`;
  };

  huntCard = function(h){
    const linked=Object.entries(state.trophies).filter(([,r])=>r?.harvested && r.huntId===h.id).map(([id])=>speciesById(id));
    return `<article class="card hunt-card" data-hunt="${h.id}"><h3>${escapeHtml(h.name)}</h3><div class="hunt-meta">${h.location?escapeHtml(h.location)+' · ':''}${formatDate(h.start)}</div><div class="hunt-species">${linked.length?linked.map(s=>`<span class="badge">${escapeHtml(s.name)}</span>`).join(''):'<span class="hunt-meta">No trophies linked yet</span>'}</div></article>`;
  };

  profileScreen = function(){
    const harvested=Object.values(state.trophies).filter(r=>r?.harvested).length;
    const completedChallenges=C.filter(c=>!c.external && progress(c).complete).length;
    const verified=Object.values(state.trophies).filter(r=>r?.verifications && Object.values(r.verifications).some(Boolean)).length;
    return `<section class="card profile-card"><div class="profile-top"><div class="avatar">🏆</div><div><h2 style="margin:0 0 3px">${escapeHtml(state.profile.name||'Hunter')}</h2><div class="hunt-meta">Multi-challenge trophy record</div></div></div>
      <div class="stat-grid"><div class="stat"><strong>${harvested}</strong><small>Trophies</small></div><div class="stat"><strong>${completedChallenges}</strong><small>Challenges</small></div><div class="stat"><strong>${state.hunts.length}</strong><small>Hunts</small></div></div></section>
      <div class="section-head"><h3>Challenge Progress</h3><span class="subtle">${verified} documented</span></div>
      <div class="card cert-list">${C.filter(c=>!c.external).map(c=>{const p=progress(c);return `<div class="cert-row"><span>${escapeHtml(c.short)}</span><strong>${p.done}/${p.total}${p.complete?' ✓':''}</strong></div>`}).join('')}</div>
      <div class="section-head"><h3>Profile & Data</h3></div>
      <div class="settings-list"><button class="link-btn" id="editProfile">Edit name / UWC member ID</button><button class="link-btn" id="exportData">Export tracker backup</button><label class="link-btn" style="display:block">Import tracker backup<input id="importData" type="file" accept="application/json" hidden></label><button class="link-btn" id="installHelp">Install on Home Screen</button><button class="link-btn" id="resetData">Reset all tracker data</button></div>
      <p class="disclaimer">Challenge status shown here is personal tracking, not official certification. Photos remain on this device in the current prototype.</p>`;
  };

  function challengesForSpecies(id){ return C.filter(ch=>!ch.external && ch.targets.some(target=>targetIds(target).includes(id))); }
  function qualificationChallenges(id){ return challengesForSpecies(id).filter(ch=>ch.qualificationRequired); }

  openSpecies = function(id){
    const s=speciesById(id), r=trophy(id); if(!s)return;
    const huntOptions=state.hunts.map(h=>`<option value="${h.id}" ${r.huntId===h.id?'selected':''}>${escapeHtml(h.name)}</option>`).join('');
    const related=challengesForSpecies(id);
    const qual=qualificationChallenges(id);
    const verifications=r.verifications || {};
    modal(`<div class="modal-head"><div><div class="eyebrow">TROPHY RECORD</div><h2>${escapeHtml(s.name)}</h2></div><button class="close-btn" data-close>×</button></div>
      <section class="card detail-status"><div class="status-copy"><strong>${r.harvested?'Harvested':'Not yet harvested'}</strong><small>${related.length} tracked challenge${related.length===1?'':'s'}</small></div><button id="harvestSwitch" class="switch ${r.harvested?'on':''}" aria-label="Toggle harvested"></button></section>
      <div class="card lib-counts-toward"><strong>Counts toward</strong><div>${related.length?related.map(ch=>`<span class="badge">${escapeHtml(ch.short)}</span>`).join(''):'<span class="hunt-meta">No current challenge mappings</span>'}</div></div>
      <div class="form-grid"><div class="field"><label>HARVEST DATE</label><input id="tDate" type="date" value="${escapeHtml(r.date)}"></div><div class="field"><label>SEX</label><select id="tSex"><option value="">Not recorded</option><option ${r.sex==='Male/Drake'?'selected':''}>Male/Drake</option><option ${r.sex==='Female/Hen'?'selected':''}>Female/Hen</option><option ${r.sex==='Unknown'?'selected':''}>Unknown</option></select></div></div>
      <div class="field"><label>LOCATION / REGION</label><input id="tLocation" placeholder="State, province, county, unit or country" value="${escapeHtml(r.location)}"></div>
      <div class="field"><label>HUNT / TRIP</label><select id="tHunt"><option value="">No linked hunt</option>${huntOptions}</select></div>
      <div class="field"><label>NOTES</label><textarea id="tNotes" placeholder="Story, partners, conditions, outfitter, measurements…">${escapeHtml(r.notes)}</textarea></div>
      <div class="section-head"><h3>Photos</h3><span class="subtle">stored on device</span></div><div id="photoGrid" class="photo-grid"></div><label class="file-label">📷 Add photos<input id="photoInput" type="file" accept="image/*" capture="environment" multiple></label>
      ${qual.length?`<div class="section-head"><h3>State / Program Eligibility</h3></div><div class="card cert-list">${qual.map(ch=>`<label class="cert-row"><span>Qualifies for ${escapeHtml(ch.short)}</span><input data-qualify="${ch.id}" type="checkbox" ${r.qualifies?.[ch.id]?'checked':''}></label>`).join('')}</div>`:''}
      ${related.length?`<div class="section-head"><h3>Official Documentation</h3></div><div class="card cert-list">${related.map(ch=>`<label class="cert-row"><span>Documented / certified: ${escapeHtml(ch.short)}</span><input data-verify="${ch.id}" type="checkbox" ${(verifications[ch.id] || (ch.id==='uwc-na'&&r.certified))?'checked':''}></label>`).join('')}</div>`:''}
      ${WF[id]?`<div class="card cert-list"><label class="cert-row"><span>UWC submission photos ready</span><input id="cPhotos" type="checkbox" ${r.submissionPhotos?'checked':''}></label><label class="cert-row"><span>Submitted to UWC</span><input id="cSubmitted" type="checkbox" ${r.submitted?'checked':''}></label></div>`:''}
      <button class="action-btn" id="saveTrophy">Save Trophy</button>`, 'species');
    loadPhotoGrid(id);
    document.getElementById('harvestSwitch').onclick=()=>{ const sw=document.getElementById('harvestSwitch'); sw.classList.toggle('on'); if(sw.classList.contains('on')&&!document.getElementById('tDate').value) document.getElementById('tDate').value=new Date().toISOString().slice(0,10); };
    document.getElementById('photoInput').onchange=async e=>{for(const file of [...e.target.files].slice(0,8)) await addPhoto(id,file); await loadPhotoGrid(id); toast('Photo saved on device');};
    document.getElementById('saveTrophy').onclick=()=>{
      const harvested=document.getElementById('harvestSwitch').classList.contains('on');
      const qualifies={...(r.qualifies||{})}; document.querySelectorAll('[data-qualify]').forEach(x=>qualifies[x.dataset.qualify]=x.checked);
      const nextVer={...verifications}; document.querySelectorAll('[data-verify]').forEach(x=>nextVer[x.dataset.verify]=x.checked);
      state.trophies[id]={...r,harvested,date:document.getElementById('tDate').value,sex:document.getElementById('tSex').value,location:document.getElementById('tLocation').value.trim(),huntId:document.getElementById('tHunt').value,notes:document.getElementById('tNotes').value.trim(),qualifies,verifications:nextVer,submissionPhotos:document.getElementById('cPhotos')?.checked ?? r.submissionPhotos,submitted:document.getElementById('cSubmitted')?.checked ?? r.submitted,certified:nextVer['uwc-na'] ?? r.certified};
      save(); closeModal(); render(); toast('Trophy saved');
    };
  };

  function openTarget(targetId){
    const ch=active(), target=ch.targets.find(x=>x.id===targetId); if(!target)return;
    const ids=targetIds(target);
    if(ids.length===1){ openSpecies(ids[0]); return; }
    modal(`<div class="modal-head"><div><div class="eyebrow">CHOOSE QUALIFYING TROPHY</div><h2>${escapeHtml(target.label)}</h2></div><button class="close-btn" data-close>×</button></div><div class="lib-choice-list">${ids.map(id=>`<button class="card lib-choice" data-lib-pick="${id}">${iconFor(id,'small')}<span><strong>${escapeHtml(M[id]?.name||id)}</strong><small>${trophy(id).harvested?'Already in Trophy Room':'Add trophy record'}</small></span></button>`).join('')}</div>`);
    document.querySelectorAll('[data-lib-pick]').forEach(btn=>btn.onclick=()=>{closeModal();openSpecies(btn.dataset.libPick);});
  }
  function quickMark(targetId){
    const ch=active(), target=ch.targets.find(x=>x.id===targetId); if(!target)return;
    if(target.anyOf){openTarget(targetId);return;}
    const id=target.id, r=trophy(id);
    if(targetDone(ch,target)){openSpecies(id);return;}
    const qualifies={...(r.qualifies||{})}; if(ch.qualificationRequired) qualifies[ch.id]=true;
    state.trophies[id]={...r,harvested:true,date:r.date||new Date().toISOString().slice(0,10),qualifies}; save(); render(); toast(`${M[id]?.name||target.label} added`);
  }
  function infoProgram(id){ const ch=C.find(c=>c.id===id); if(!ch)return; modal(`<div class="modal-head"><div><div class="eyebrow">ADVANCED PROGRAM</div><h2>${escapeHtml(ch.name)}</h2></div><button class="close-btn" data-close>×</button></div><div class="card rules-note"><strong>${ch.total} recognized trophies</strong><br><br>${escapeHtml(ch.note)}<br><br><a class="lib-source" href="${ch.source}" target="_blank" rel="noopener">Official GSCO forms / rules ↗</a></div>`); }

  document.addEventListener('click',e=>{
    const ch=e.target.closest('[data-lib-challenge]'); if(ch){state.activeChallengeId=ch.dataset.libChallenge;libraryFilter='all';save();currentScreen='challenges';render();return;}
    const inf=e.target.closest('[data-lib-info]'); if(inf){infoProgram(inf.dataset.libInfo);return;}
    const filter=e.target.closest('[data-lib-filter]'); if(filter){libraryFilter=filter.dataset.libFilter;render();return;}
    const quick=e.target.closest('[data-lib-quick]'); if(quick){e.stopPropagation();quickMark(quick.dataset.libQuick);return;}
    const target=e.target.closest('[data-lib-target-open]'); if(target){openTarget(target.dataset.libTargetOpen);return;}
    const sp=e.target.closest('[data-lib-species]'); if(sp){openSpecies(sp.dataset.libSpecies);return;}
  });

  render();
})();
