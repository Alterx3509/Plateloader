/* Ensure editing a state-specific challenge target saves back into the shared canonical trophy record. */
(() => {
  const alias={
    'utah-california-quail':'california-quail','utah-gambels-quail':'gambels-quail','utah-chukar':'chukar','utah-cottontail':'cottontail-rabbit','utah-dusky-grouse':'dusky-grouse','utah-gray-partridge':'gray-partridge','utah-sage-grouse':'greater-sage-grouse','utah-jackrabbit':'jackrabbit','utah-mourning-dove':'mourning-dove','utah-pheasant':'ring-necked-pheasant','utah-ruffed-grouse':'ruffed-grouse','utah-sharp-tailed-grouse':'sharp-tailed-grouse','utah-snowshoe-hare':'snowshoe-hare','utah-ptarmigan':'white-tailed-ptarmigan','utah-wild-turkey':'wild-turkey',
    'ne-bobwhite':'northern-bobwhite','ne-prairie-chicken':'greater-prairie-chicken','ne-pheasant':'ring-necked-pheasant','ne-sharp-tailed-grouse':'sharp-tailed-grouse'
  };
  const reverse={};Object.entries(alias).forEach(([a,c])=>{(reverse[c] ||= []).push(a)});
  const prior=openSpecies;
  openSpecies=function(id){
    const canonical=alias[id]||id;
    const source=alias[id]?id:(reverse[canonical]?.[0]||null);
    prior(id);
    if(!source||source===canonical)return;
    const btn=document.getElementById('saveTrophy');
    if(!btn)return;
    btn.addEventListener('click',()=>setTimeout(()=>{
      const old=state.trophies[source],cur=state.trophies[canonical]; if(!old)return;
      state.trophies[canonical]={...(old||{}),...(cur||{}),harvested:!!(old?.harvested||cur?.harvested),qualifies:{...(old?.qualifies||{}),...(cur?.qualifies||{})},verifications:{...(old?.verifications||{}),...(cur?.verifications||{})}};
      delete state.trophies[source]; save(); render();
    },0),{once:true});
  };
})();
