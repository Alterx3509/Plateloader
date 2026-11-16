const {readFileSync}=require('node:fs');
const {join}=require('node:path');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const {test}=require('node:test');
const html=readFileSync(join(__dirname,'../plate-loader.html'),'utf8');
const ctx={}; vm.createContext(ctx);
vm.runInContext(html.match(/const PLATE_DEFS = \[[\s\S]*?\];/)[0]+'\n'+html.slice(html.indexOf('function solveLoad('),html.indexOf('// ---------- Rendering')),ctx);
const solve=ctx.solveLoad;
const inv=(entries)=>Object.fromEntries(entries.map(([w,count,enabled=true])=>[w,{count,enabled,type:'bumper'}]));
test('105 lb regression: two 15s instead of one 25 per side',()=>{const r=solve(105,45,inv([[25,2],[15,4]]));assert.equal(r.exact,true);assert.equal(r.loaded,30);assert.equal(r.plates.map(p=>p.w).join(','),'15,15');});
test('closest load never exceeds target',()=>{const r=solve(108,45,inv([[25,2],[15,4]]));assert.equal(r.loaded,30);assert.equal(r.remaining,1.5);});
test('odd quantities, disabled plates, and empty inventory',()=>{assert.equal(solve(105,45,inv([[15,3],[25,2,false]])).loaded,15);assert.equal(solve(105,45,{}).loaded,0);});
test('bar alone and under-bar targets',()=>{assert.equal(solve(45,45,{}).exact,true);assert.equal(solve(40,45,{}).underBar,true);});
test('fractional plates and minimum plate count',()=>{assert.equal(solve(50,45,inv([[2.5,2]])).exact,true);assert.equal(solve(95,45,inv([[25,2],[15,2],[10,2]])).plates.length,1);});
test('large target bounded by available inventory and plate type preserved',()=>{const r=solve(1000000,45,{45:{count:8,enabled:true,type:'metal'}});assert.equal(r.loaded,180);assert.ok(r.plates.every(p=>p.type==='metal'));});
test('500 deterministic inventories match exhaustive optimum and minimum count',()=>{
 let seed=42;const random=n=>{seed=(seed*1664525+1013904223)>>>0;return seed%n;};
 for(let t=0;t<500;t++){
  const weights=[25,15,10,5,2.5],counts=weights.map(()=>random(7)),inventory=inv(weights.map((w,i)=>[w,counts[i]]));const target=45+random(221);const cap=(target-45)/2;let best=0,min=0;
  function visit(i,sum,count){if(i===weights.length){if(sum<=cap&&(sum>best||(sum===best&&count<min))){best=sum;min=count;}return;}for(let n=0;n<=Math.floor(counts[i]/2);n++)visit(i+1,sum+n*weights[i],count+n);}
  visit(0,0,0);const result=solve(target,45,inventory);assert.equal(result.loaded,best);assert.equal(result.plates.length,min);
 }
});
