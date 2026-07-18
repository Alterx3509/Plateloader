"use strict";

const API_BASE = "https://fitnessvolt.com/wp-json/rpe-training/v1/public/standards";
const CACHE_MS = 24 * 60 * 60 * 1000;
const PCT_KEYS = [10,20,25,40,50,60,75,80,90,95,99];
const GRADE_COLORS = {below:"#7c8291",average:"#3b82f6",good:"#22c55e",great:"#a855f7",elite:"#f59e0b"};
const EVENT_COLORS = {squat:"#e4572e",bench:"#2f80ed",deadlift:"#8e5de7",mile:"#18a875",waist:"#00a6a6"};
const MALE_CLASSES = [{max:59,label:"59kg"},{max:66,label:"66kg"},{max:74,label:"74kg"},{max:83,label:"83kg"},{max:93,label:"93kg"},{max:105,label:"105kg"},{max:120,label:"120kg"},{max:Infinity,label:"120+kg"}];
const FEMALE_CLASSES = [{max:47,label:"47kg"},{max:52,label:"52kg"},{max:57,label:"57kg"},{max:63,label:"63kg"},{max:69,label:"69kg"},{max:76,label:"76kg"},{max:84,label:"84kg"},{max:Infinity,label:"84+kg"}];

// WMA/USATF 2020 age-grade factors sampled at key ages; the app interpolates between points.
// Mile open standards are linearly interpolated from the source 1500 m and 3000 m standards.
const RUN_FACTORS = {
  male:{18:.9670,19:.9790,20:.9893,25:1,30:.9952,35:.9729,40:.9380,45:.9099,50:.8747,55:.8395,60:.8043,65:.7691,70:.7319,75:.6808,80:.6138,85:.5309,90:.4321,95:.3174,100:.1868},
  female:{18:.9893,19:.9961,20:.9996,25:1,30:.9989,35:.9822,40:.9459,45:.8937,50:.8403,55:.7869,60:.7335,65:.6801,70:.6267,75:.5733,80:.5199,85:.4515,90:.3531,95:.2247,100:.0663}
};
const MILE_OPEN = {male:222.92108352,female:252.0753792};

// CDC/NCHS adult waist circumference percentiles (cm), 2007–2010 reference table.
// Columns: p5,p10,p15,p25,p50,p75,p85,p90,p95.
const WAIST_PCTS = [5,10,15,25,50,75,85,90,95];
const WAIST_DATA = {
 male:[
  {min:18,max:19,v:[68.4,70.4,71.9,75.5,81.9,97.3,103.5,107.3,115.3]},
  {min:20,max:29,v:[71.3,75.7,77.9,82.6,93.4,106.1,112.6,117.8,124.4]},
  {min:30,max:39,v:[80.3,82.6,85.9,90.0,98.6,109.9,118.9,123.1,130.5]},
  {min:40,max:49,v:[83.7,86.6,88.3,92.2,101.5,114.0,120.7,127.7,139.6]},
  {min:50,max:59,v:[83.2,88.2,90.5,94.2,104.3,114.8,123.4,128.4,137.0]},
  {min:60,max:69,v:[84.2,87.4,90.2,95.5,104.5,113.1,119.5,123.4,132.2]},
  {min:70,max:79,v:[84.6,88.6,92.8,97.3,106.6,117.1,122.6,126.5,131.3]},
  {min:80,max:100,v:[84.5,89.6,92.8,95.3,102.6,111.4,117.0,120.5,126.0]}
 ],
 female:[
  {min:18,max:19,v:[64.5,67.0,68.0,71.4,80.7,92.4,100.5,108.0,119.4]},
  {min:20,max:29,v:[68.5,72.3,74.5,77.2,85.3,98.5,112.3,118.6,127.3]},
  {min:30,max:39,v:[72.6,75.6,78.2,83.9,93.1,108.8,121.6,126.6,133.6]},
  {min:40,max:49,v:[75.3,77.0,81.3,85.2,95.7,109.2,115.9,121.6,130.8]},
  {min:50,max:59,v:[77.7,81.5,84.0,88.4,100.8,112.6,119.3,122.0,130.8]},
  {min:60,max:69,v:[77.1,81.7,83.6,88.8,99.6,110.4,117.1,120.7,125.5]},
  {min:70,max:79,v:[76.7,81.2,84.6,89.1,98.9,108.4,115.3,119.3,123.7]},
  {min:80,max:100,v:[76.4,79.3,84.1,88.8,94.4,107.2,110.5,111.9,119.1]}
 ]
};

const ids = ["sex","age","weight","waist","squat","bench","deadlift","mileMin","mileSec"];
const $ = id => document.getElementById(id);
let units = "imperial";

function clamp(n,min,max){return Math.min(max,Math.max(min,n))}
function round(n,d=0){const p=10**d;return Math.round(n*p)/p}
function toKg(v){return units==="imperial"?v/2.2046226218:v}
function waistCm(v){return units==="imperial"?v*2.54:v}
function displayWeight(v){return `${round(v,units==="imperial"?0:1)} ${units==="imperial"?"lb":"kg"}`}
function formatTime(sec){sec=Math.max(0,Math.round(sec));return `${Math.floor(sec/60)}:${String(sec%60).padStart(2,"0")}`}
function gradeByScore(score){
  if(score>=95)return {key:"elite",label:"Elite"};
  if(score>=90)return {key:"great",label:"Great"};
  if(score>=75)return {key:"good",label:"Good"};
  if(score>=50)return {key:"average",label:"Average"};
  return {key:"below",label:"Below average"};
}
function cardioGrade(ageGrade){
  if(ageGrade>=80)return {key:"elite",label:"Elite"};
  if(ageGrade>=70)return {key:"great",label:"Great"};
  if(ageGrade>=60)return {key:"good",label:"Good"};
  if(ageGrade>=50)return {key:"average",label:"Average"};
  return {key:"below",label:"Below average"};
}
function gradePill(grade){
  const c=GRADE_COLORS[grade.key];
  return `<span class="grade-pill" style="background:${c}22;color:${c}">${grade.label}</span>`;
}
function piecewise(x,points){
  const pairs=Object.entries(points).map(([k,v])=>[Number(k),Number(v)]).sort((a,b)=>a[0]-b[0]);
  if(x<=pairs[0][0])return pairs[0][1];
  if(x>=pairs.at(-1)[0])return pairs.at(-1)[1];
  for(let i=1;i<pairs.length;i++){
    const [x2,y2]=pairs[i],[x1,y1]=pairs[i-1];
    if(x<=x2)return y1+(x-x1)/(x2-x1)*(y2-y1);
  }
}
function ageFactor(sex,age){return piecewise(age,RUN_FACTORS[sex])}
function percentileFromBenchmarks(value,p){
  const pts=PCT_KEYS.map(k=>({pct:k,val:Number(p[`p${k}`])})).filter(x=>Number.isFinite(x.val)).sort((a,b)=>a.val-b.val);
  if(!pts.length)return 0;
  if(value<=pts[0].val)return clamp((value/pts[0].val)*pts[0].pct,0,pts[0].pct);
  if(value>=pts.at(-1).val)return clamp(pts.at(-1).pct+(value/pts.at(-1).val-1)*5,pts.at(-1).pct,100);
  for(let i=1;i<pts.length;i++){
    if(value<=pts[i].val){
      const a=pts[i-1],b=pts[i];
      if(b.val===a.val)return b.pct;
      return a.pct+(value-a.val)/(b.val-a.val)*(b.pct-a.pct);
    }
  }
  return 0;
}
function waistPercentile(sex,age,cm){
  const row=WAIST_DATA[sex].find(r=>age>=r.min&&age<=r.max)||WAIST_DATA[sex].at(-1);
  const vals=row.v;
  if(cm<=vals[0])return clamp((cm/vals[0])*5,0,5);
  if(cm>=vals.at(-1))return clamp(95+(cm/vals.at(-1)-1)*20,95,100);
  for(let i=1;i<vals.length;i++){
    if(cm<=vals[i])return WAIST_PCTS[i-1]+(cm-vals[i-1])/(vals[i]-vals[i-1])*(WAIST_PCTS[i]-WAIST_PCTS[i-1]);
  }
  return 100;
}
function cardioNormalized(ageGrade){
  const pts={0:0,50:50,60:75,70:90,80:95,100:100};
  return clamp(piecewise(ageGrade,pts),0,100);
}
function classFor(sex,bwKg){return (sex==="male"?MALE_CLASSES:FEMALE_CLASSES).find(c=>bwKg<=c.max).label}
function cacheKey(lift,sex){return `performanceProfile:${lift}:${sex}:${units}`}
async function getStandards(lift,sex){
  const key=cacheKey(lift,sex);
  try{
    const cached=JSON.parse(localStorage.getItem(key)||"null");
    if(cached&&Date.now()-cached.time<CACHE_MS)return cached.data;
  }catch{}
  const response=await fetch(`${API_BASE}/${lift}?sex=${sex}&unit=${units==="imperial"?"lb":"kg"}`);
  if(!response.ok)throw new Error(`Strength data request failed (${response.status})`);
  const data=await response.json();
  if(!data.success||!data.verified)throw new Error("Verified strength standards unavailable");
  try{localStorage.setItem(key,JSON.stringify({time:Date.now(),data}))}catch{}
  return data;
}
function saveInputs(){
  const data={units};
  ids.forEach(id=>data[id]=$(id).value);
  try{localStorage.setItem("performanceProfile:inputs",JSON.stringify(data))}catch{}
}
function restoreInputs(){
  try{
    const data=JSON.parse(localStorage.getItem("performanceProfile:inputs")||"null");
    if(!data)return;
    setUnits(data.units||"imperial",false);
    ids.forEach(id=>{if(data[id]!==undefined)$(id).value=data[id]});
  }catch{}
}
function setUnits(next,convert=true){
  if(next===units)return;
  if(convert){
    const weightIds=["weight","squat","bench","deadlift"];
    weightIds.forEach(id=>{
      const n=Number($(id).value);
      if(Number.isFinite(n))$(id).value=round(next==="metric"?n/2.2046226218:n*2.2046226218,1);
    });
    const w=Number($("waist").value);
    if(Number.isFinite(w))$("waist").value=round(next==="metric"?w*2.54:w/2.54,1);
  }
  units=next;
  $("imperialBtn").classList.toggle("active",units==="imperial");
  $("metricBtn").classList.toggle("active",units==="metric");
  document.querySelectorAll(".weightUnit").forEach(e=>e.textContent=units==="imperial"?"lb":"kg");
  document.querySelectorAll(".waistUnit").forEach(e=>e.textContent=units==="imperial"?"in":"cm");
  saveInputs();
}
function strengthEvent(name,id,value,data,weightClass,color){
  const row=data.verified.weight_classes.find(x=>x.weight_class===weightClass);
  if(!row)throw new Error(`No ${name} data for ${weightClass}`);
  const percentile=percentileFromBenchmarks(value,row.percentiles);
  const grade=gradeByScore(percentile);
  const marks=[
    ["Average",row.percentiles.p50],["Good",row.percentiles.p75],
    ["Great",row.percentiles.p90],["Elite",row.percentiles.p95]
  ];
  return {
    id,name,color,score:percentile,grade,
    html:eventCard({
      name,color,grade,value:displayWeight(value),
      metric:`${round(percentile)}th`,metricNote:`competition percentile · ${weightClass}`,
      progress:percentile,
      marks:marks.map(([label,v])=>[label,displayWeight(v)]),
      foot:`Raw, verified competition results · ${row.sample_size.toLocaleString()} results in this class · OpenPowerlifting via FitnessVolt`
    })
  };
}
function eventCard({name,color,grade,value,metric,metricNote,progress,marks,foot}){
  return `<article class="event" style="--accent:${color}">
    <div class="event-head"><div><h3>${name}</h3><div class="event-value">${value}</div></div>${gradePill(grade)}</div>
    <div class="metric">${metric}</div><div class="metric-note">${metricNote}</div>
    <div class="bar"><span style="width:${clamp(progress,0,100)}%"></span></div>
    <div class="scale">${marks.map(([a,b])=>`<div class="mark"><b>${a}</b><small>${b}</small></div>`).join("")}</div>
    <div class="event-foot">${foot}</div>
  </article>`;
}
async function calculate(){
  saveInputs();
  const sex=$("sex").value;
  const age=clamp(Number($("age").value),18,100);
  const bw=Number($("weight").value),waist=Number($("waist").value);
  const lifts={squat:Number($("squat").value),bench:Number($("bench").value),deadlift:Number($("deadlift").value)};
  const mileSec=Number($("mileMin").value)*60+Number($("mileSec").value);
  if(![age,bw,waist,lifts.squat,lifts.bench,lifts.deadlift,mileSec].every(n=>Number.isFinite(n)&&n>0)){
    $("status").textContent="Please enter a positive value in every field.";
    return;
  }
  $("calculateBtn").disabled=true;
  $("status").textContent="Loading verified strength standards…";
  try{
    const [squatData,benchData,deadliftData]=await Promise.all([
      getStandards("squat",sex),getStandards("bench-press",sex),getStandards("deadlift",sex)
    ]);
    const wc=classFor(sex,toKg(bw));
    const strengthEvents=[
      strengthEvent("Squat","squat",lifts.squat,squatData,wc,EVENT_COLORS.squat),
      strengthEvent("Bench press","bench",lifts.bench,benchData,wc,EVENT_COLORS.bench),
      strengthEvent("Deadlift","deadlift",lifts.deadlift,deadliftData,wc,EVENT_COLORS.deadlift)
    ];
    const strengthScore=strengthEvents.reduce((s,e)=>s+e.score,0)/strengthEvents.length;

    const factor=ageFactor(sex,age);
    const ageStandard=MILE_OPEN[sex]/factor;
    const ageGrade=clamp(ageStandard/mileSec*100,0,110);
    const cGrade=cardioGrade(ageGrade);
    const cardioScore=cardioNormalized(ageGrade);
    const cardioMarks=[["Average",ageStandard/.50],["Good",ageStandard/.60],["Great",ageStandard/.70],["Elite",ageStandard/.80]];
    const mileHtml=eventCard({
      name:"One-mile run",color:EVENT_COLORS.mile,grade:cGrade,value:formatTime(mileSec),
      metric:`${round(ageGrade,1)}%`,metricNote:"age-graded performance",
      progress:ageGrade,
      marks:cardioMarks.map(([label,v])=>[label,formatTime(v)]),
      foot:"WMA/USATF age grading · 2020 tables · mile standard interpolated from 1500 m and 3000 m"
    });

    const cm=waistCm(waist);
    const waistPct=waistPercentile(sex,age,cm);
    const bodyScore=clamp(100-waistPct,0,100);
    const bGrade=gradeByScore(bodyScore);
    const row=WAIST_DATA[sex].find(r=>age>=r.min&&age<=r.max)||WAIST_DATA[sex].at(-1);
    const bodyMarks=[["Average",row.v[4]],["Good",row.v[3]],["Great",row.v[1]],["Elite",row.v[0]]];
    const bodyHtml=eventCard({
      name:"Waist circumference",color:EVENT_COLORS.waist,grade:bGrade,
      value:`${round(waist,1)} ${units==="imperial"?"in":"cm"}`,
      metric:`${round(waistPct)}th`,metricNote:"same-sex/age waist percentile · lower is better",
      progress:bodyScore,
      marks:bodyMarks.map(([label,v])=>[label,`${round(units==="imperial"?v/2.54:v,1)} ${units==="imperial"?"in":"cm"}`]),
      foot:"CDC/NCHS NHANES reference percentiles · body-composition proxy, not a body-fat measurement"
    });

    const overall=(strengthScore+cardioScore+bodyScore)/3;
    $("eventGrid").innerHTML=strengthEvents.map(e=>e.html).join("")+mileHtml+bodyHtml;
    renderSummary("overall",overall);
    renderSummary("strength",strengthScore);
    renderSummary("cardio",cardioScore,cGrade);
    renderSummary("body",bodyScore);
    const riskCm=sex==="male"?101.6:88.9;
    const notice=$("healthNotice");
    if(cm>=riskCm){
      notice.innerHTML=`<b>Health-risk flag:</b> This waist measurement is at or above the NIH screening threshold of ${sex==="male"?"40":"35"} inches. Population grade and health risk are separate concepts; consider discussing this measurement with a clinician.`;
      notice.classList.remove("hidden");
    }else notice.classList.add("hidden");
    $("results").classList.remove("hidden");
    $("status").textContent="Profile calculated. Strength data cached locally for 24 hours.";
    $("results").scrollIntoView({behavior:"smooth",block:"start"});
  }catch(err){
    console.error(err);
    $("status").textContent=`Could not load strength standards: ${err.message}. Check your connection and try again.`;
  }finally{$("calculateBtn").disabled=false}
}
function renderSummary(prefix,score,forcedGrade){
  const grade=forcedGrade||gradeByScore(score);
  $(`${prefix}Score`).textContent=round(score);
  $(`${prefix}Grade`).innerHTML=gradePill(grade);
}
$("calculateBtn").addEventListener("click",calculate);
$("clearBtn").addEventListener("click",()=>{
  Object.keys(localStorage).filter(k=>k.startsWith("performanceProfile:")).forEach(k=>localStorage.removeItem(k));
  location.reload();
});
$("imperialBtn").addEventListener("click",()=>setUnits("imperial"));
$("metricBtn").addEventListener("click",()=>setUnits("metric"));
ids.forEach(id=>$(id).addEventListener("change",saveInputs));
restoreInputs();
