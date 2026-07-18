"use strict";
const GRADE_COLORS = {below:"#7c8291",average:"#3b82f6",good:"#22c55e",great:"#a855f7",elite:"#f59e0b"};
const EVENT_COLORS = {squat:"#e4572e",bench:"#2f80ed",deadlift:"#8e5de7",mile:"#18a875",waist:"#00a6a6"};
const MALE_CLASSES = [{max:59,label:"59kg"},{max:66,label:"66kg"},{max:74,label:"74kg"},{max:83,label:"83kg"},{max:93,label:"93kg"},{max:105,label:"105kg"},{max:120,label:"120kg"},{max:Infinity,label:"120+kg"}];
const FEMALE_CLASSES = [{max:47,label:"47kg"},{max:52,label:"52kg"},{max:57,label:"57kg"},{max:63,label:"63kg"},{max:69,label:"69kg"},{max:76,label:"76kg"},{max:84,label:"84kg"},{max:Infinity,label:"84+kg"}];
const STRENGTH_DECILES = [10,30,50,70,90];
const WEIGHT_CLASS_STRENGTH = {
male:{
"59kg": {squat:{10:1.46,30:1.86,50:2.18,70:2.50,90:2.95},bench:{10:1.03,30:1.31,50:1.54,70:1.79,90:2.29},deadlift:{10:1.90,30:2.38,50:2.71,70:3.06,90:3.49}},
"66kg": {squat:{10:1.59,30:2.02,50:2.30,70:2.58,90:2.95},bench:{10:1.09,30:1.37,50:1.56,70:1.76,90:2.06},deadlift:{10:2.03,30:2.50,50:2.80,70:3.08,90:3.47}},
"74kg": {squat:{10:1.69,30:2.08,50:2.33,70:2.57,90:2.91},bench:{10:1.15,30:1.41,50:1.58,70:1.75,90:2.01},deadlift:{10:2.10,30:2.51,50:2.77,70:3.02,90:3.38}},
"83kg": {squat:{10:1.71,30:2.06,50:2.29,70:2.51,90:2.83},bench:{10:1.16,30:1.40,50:1.56,70:1.72,90:1.96},deadlift:{10:2.08,30:2.44,50:2.68,70:2.91,90:3.24}},
"93kg": {squat:{10:1.66,30:2.00,50:2.20,70:2.41,90:2.72},bench:{10:1.14,30:1.36,50:1.52,70:1.67,90:1.89},deadlift:{10:1.99,30:2.32,50:2.54,70:2.75,90:3.06}},
"105kg":{squat:{10:1.58,30:1.90,50:2.10,70:2.30,90:2.59},bench:{10:1.09,30:1.31,50:1.46,70:1.61,90:1.83},deadlift:{10:1.86,30:2.18,50:2.38,70:2.58,90:2.87}},
"120kg":{squat:{10:1.47,30:1.78,50:1.98,70:2.17,90:2.45},bench:{10:1.02,30:1.26,50:1.40,70:1.54,90:1.75},deadlift:{10:1.69,30:2.00,50:2.18,70:2.37,90:2.64}},
"120+kg":{squat:{10:1.25,30:1.58,50:1.78,70:1.97,90:2.24},bench:{10:.87,30:1.11,50:1.26,70:1.40,90:1.59},deadlift:{10:1.38,30:1.70,50:1.89,70:2.08,90:2.33}}
},
female:{
"47kg": {squat:{10:1.22,30:1.55,50:1.79,70:2.05,90:2.40},bench:{10:.74,30:.91,50:1.07,70:1.24,90:1.58},deadlift:{10:1.64,30:2.03,50:2.29,70:2.57,90:2.96}},
"52kg": {squat:{10:1.27,30:1.59,50:1.80,70:2.03,90:2.39},bench:{10:.74,30:.91,50:1.04,70:1.19,90:1.45},deadlift:{10:1.66,30:2.00,50:2.25,70:2.50,90:2.88}},
"57kg": {squat:{10:1.26,30:1.57,50:1.78,70:1.99,90:2.32},bench:{10:.72,30:.89,50:1.02,70:1.16,90:1.40},deadlift:{10:1.64,30:1.97,50:2.20,70:2.44,90:2.77}},
"63kg": {squat:{10:1.22,30:1.52,50:1.73,70:1.93,90:2.24},bench:{10:.70,30:.86,50:.98,70:1.12,90:1.33},deadlift:{10:1.59,30:1.89,50:2.10,70:2.33,90:2.65}},
"69kg": {squat:{10:1.18,30:1.47,50:1.67,70:1.86,90:2.16},bench:{10:.67,30:.82,50:.93,70:1.06,90:1.27},deadlift:{10:1.52,30:1.80,50:2.01,70:2.21,90:2.52}},
"76kg": {squat:{10:1.15,30:1.43,50:1.62,70:1.82,90:2.10},bench:{10:.64,30:.79,50:.90,70:1.03,90:1.24},deadlift:{10:1.46,30:1.73,50:1.93,70:2.13,90:2.42}},
"84kg": {squat:{10:1.06,30:1.32,50:1.51,70:1.69,90:1.97},bench:{10:.60,30:.73,50:.84,70:.96,90:1.15},deadlift:{10:1.36,30:1.61,50:1.78,70:1.96,90:2.23}},
"84+kg":{squat:{10:.85,30:1.11,50:1.29,70:1.47,90:1.73},bench:{10:.50,30:.61,50:.70,70:.80,90:.98},deadlift:{10:1.07,30:1.31,50:1.47,70:1.65,90:1.90}}
}
};
const AGE_STRENGTH = {
male:{
squat:{"18-35":{10:1.75,30:2.06,50:2.28,70:2.50,90:2.83},"36-59":{10:1.48,30:1.81,50:2.03,70:2.24,90:2.58},"60-79":{10:1.04,30:1.38,50:1.62,70:1.85,90:2.16},"80+":{10:.52,30:.89,50:1.11,70:1.37,90:1.72}},
bench:{"18-35":{10:1.19,30:1.40,50:1.56,70:1.71,90:1.96},"36-59":{10:1.13,30:1.36,50:1.51,70:1.67,90:1.92},"60-79":{10:.88,30:1.09,50:1.23,70:1.38,90:1.60},"80+":{10:.61,30:.80,50:.93,70:1.10,90:1.31}},
deadlift:{"18-35":{10:2.03,30:2.40,50:2.63,70:2.87,90:3.25},"36-59":{10:1.75,30:2.09,50:2.34,70:2.59,90:2.98},"60-79":{10:1.42,30:1.75,50:2.02,70:2.27,90:2.64},"80+":{10:.96,30:1.24,50:1.50,70:1.81,90:2.30}}
},
female:{
squat:{"18-35":{10:1.23,30:1.52,50:1.72,70:1.93,90:2.26},"36-59":{10:1.01,30:1.30,50:1.51,70:1.73,90:2.05},"60-79":{10:.72,30:.99,50:1.17,70:1.36,90:1.65},"80+":{10:.29,30:.49,50:.67,70:.90,90:1.01}},
bench:{"18-35":{10:.67,30:.84,50:.96,70:1.10,90:1.35},"36-59":{10:.62,30:.77,50:.90,70:1.04,90:1.28},"60-79":{10:.49,30:.62,50:.72,70:.85,90:1.04},"80+":{10:.41,30:.46,50:.55,70:.67,90:.92}},
deadlift:{"18-35":{10:1.49,30:1.82,50:2.06,70:2.30,90:2.66},"36-59":{10:1.32,30:1.64,50:1.88,70:2.13,90:2.51},"60-79":{10:1.11,30:1.39,50:1.60,70:1.85,90:2.19},"80+":{10:.61,30:.84,50:1.16,70:1.47,90:1.68}}
}
};
const RUN_FACTORS = {
male:{18:.9670,19:.9790,20:.9893,25:1,30:.9952,35:.9729,40:.9380,45:.9099,50:.8747,55:.8395,60:.8043,65:.7691,70:.7319,75:.6808,80:.6138,85:.5309,90:.4321,95:.3174,100:.1868},
female:{18:.9893,19:.9961,20:.9996,25:1,30:.9989,35:.9822,40:.9459,45:.8937,50:.8403,55:.7869,60:.7335,65:.6801,70:.6267,75:.5733,80:.5199,85:.4515,90:.3531,95:.2247,100:.0663}
};
const MILE_OPEN = {male:222.92108352,female:252.0753792};
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
const TEST_CATALOG = [
{id:"squat",name:"Squat",category:"Strength",color:EVENT_COLORS.squat},
{id:"bench",name:"Bench press",category:"Strength",color:EVENT_COLORS.bench},
{id:"deadlift",name:"Deadlift",category:"Strength",color:EVENT_COLORS.deadlift},
{id:"mile",name:"One-mile run",category:"Cardio",color:EVENT_COLORS.mile},
{id:"waist",name:"Body composition",category:"Body",color:EVENT_COLORS.waist}
];
const ids = ["sex","age","height","weight","waist","squat","bench","deadlift","mileMin","mileSec"];
const $ = id => document.getElementById(id);
let units = "imperial";
let pinnedTests = new Set(TEST_CATALOG.map(t=>t.id));
function clamp(n,min,max){return Math.min(max,Math.max(min,n))}
function round(n,d=0){const p=10**d;return Math.round(n*p)/p}
function toKg(v){return units==="imperial"?v/2.2046226218:v}
function lengthCm(v){return units==="imperial"?v*2.54:v}
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
return pairs.at(-1)[1];
}
function ageFactor(sex,age){return piecewise(age,RUN_FACTORS[sex])}
function strengthAgeBand(age){return age<=35?"18-35":age<=59?"36-59":age<=79?"60-79":"80+"}
function classFor(sex,bwKg){return (sex==="male"?MALE_CLASSES:FEMALE_CLASSES).find(c=>bwKg<=c.max).label}
function ageAdjustedRatios(sex,lift,weightClass,age){
const base=WEIGHT_CLASS_STRENGTH[sex][weightClass][lift];
const band=strengthAgeBand(age);
const selected=AGE_STRENGTH[sex][lift][band];
const young=AGE_STRENGTH[sex][lift]["18-35"];
return Object.fromEntries(STRENGTH_DECILES.map(p=>[p,base[p]*(selected[p]/young[p])]));
}
function percentileFromThresholds(value,thresholds){
const points=STRENGTH_DECILES.map(p=>({pct:p,val:thresholds[p]}));
if(value<=points[0].val)return clamp(value/points[0].val*points[0].pct,0,points[0].pct);
if(value>=points.at(-1).val)return clamp(90+(value/points.at(-1).val-1)*10,90,100);
for(let i=1;i<points.length;i++){
const a=points[i-1],b=points[i];
if(value<=b.val)return a.pct+(value-a.val)/(b.val-a.val)*(b.pct-a.pct);
}
return 100;
}
function recreationalStrengthScore(competitionPercentile){
return clamp(piecewise(competitionPercentile,{0:0,10:50,30:75,50:90,70:95,90:100,100:100}),0,100);
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
function cardioNormalized(ageGrade){return clamp(piecewise(ageGrade,{0:0,50:50,60:75,70:90,80:95,100:100}),0,100)}
function whtrClass(ratio){
if(ratio<.4)return {label:"below NICE healthy range",level:"low"};
if(ratio<.5)return {label:"healthy central adiposity",level:"healthy"};
if(ratio<.6)return {label:"increased central adiposity",level:"increased"};
return {label:"high central adiposity",level:"high"};
}
function saveInputs(){
const data={units};
ids.forEach(id=>data[id]=$(id).value);
try{localStorage.setItem("performanceProfile:inputs",JSON.stringify(data))}catch{}
}
function savePinned(){
try{localStorage.setItem("performanceProfile:pinned",JSON.stringify([...pinnedTests]))}catch{}
}
function restoreInputs(){
try{
const data=JSON.parse(localStorage.getItem("performanceProfile:inputs")||"null");
if(data){
setUnits(data.units||"imperial",false);
ids.forEach(id=>{if(data[id]!==undefined)$(id).value=data[id]});
}
const saved=JSON.parse(localStorage.getItem("performanceProfile:pinned")||"null");
if(Array.isArray(saved))pinnedTests=new Set(saved.filter(id=>TEST_CATALOG.some(t=>t.id===id)));
}catch{}
}
function setUnits(next,convert=true){
if(next===units)return;
if(convert){
["weight","squat","bench","deadlift"].forEach(id=>{
const n=Number($(id).value);
if(Number.isFinite(n))$(id).value=round(next==="metric"?n/2.2046226218:n*2.2046226218,1);
});
["height","waist"].forEach(id=>{
const n=Number($(id).value);
if(Number.isFinite(n))$(id).value=round(next==="metric"?n*2.54:n/2.54,1);
});
}
units=next;
$("imperialBtn").classList.toggle("active",units==="imperial");
$("metricBtn").classList.toggle("active",units==="metric");
document.querySelectorAll(".weightUnit").forEach(e=>e.textContent=units==="imperial"?"lb":"kg");
document.querySelectorAll(".lengthUnit").forEach(e=>e.textContent=units==="imperial"?"in":"cm");
saveInputs();
}
function strengthEvent(name,id,liftValue,bw,sex,age,weightClass,color){
const bwKg=toKg(bw),liftKg=toKg(liftValue);
const ratios=ageAdjustedRatios(sex,id,weightClass,age);
const ratio=liftKg/bwKg;
const competitionPercentile=percentileFromThresholds(ratio,ratios);
const score=recreationalStrengthScore(competitionPercentile);
const grade=gradeByScore(score);
const marks=[["Average",10],["Good",30],["Great",50],["Elite",70]].map(([label,p])=>[
label,displayWeight(bw*ratios[p])
]);
return {
id,name,color,score,grade,
html:eventCard({
name,color,grade,value:displayWeight(liftValue),
metric:`${round(ratio,2)}×`,metricNote:`bodyweight · ≈${round(competitionPercentile)}th trained-competitor percentile`,
progress:score,marks,
foot:`Fit-recreational grade calibrated from the 10th/30th/50th/70th percentiles of raw, drug-tested powerlifters · age ${strengthAgeBand(age)} · ${weightClass}`
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
function renderTestPicker(){
$("testPicker").innerHTML=TEST_CATALOG.map(test=>`<label class="test-choice" style="--choice:${test.color}">
<input type="checkbox" value="${test.id}" ${pinnedTests.has(test.id)?"checked":""}>
<span><b>${test.name}</b><small>${test.category}</small></span>
</label>`).join("");
$("testPicker").querySelectorAll("input").forEach(input=>input.addEventListener("change",()=>{
if(input.checked)pinnedTests.add(input.value);else pinnedTests.delete(input.value);
savePinned();
if(!$("results").classList.contains("hidden"))calculate(false);
}));
}
function renderSummary(prefix,score,forcedGrade,sub=""){
const grade=forcedGrade||gradeByScore(score);
$(`${prefix}Score`).textContent=round(score);
$(`${prefix}Grade`).innerHTML=gradePill(grade);
const subEl=$(`${prefix}Sub`);
if(subEl)subEl.textContent=sub;
}
function calculate(shouldScroll=true){
saveInputs();
const sex=$("sex").value;
const age=clamp(Number($("age").value),18,100);
const height=Number($("height").value),bw=Number($("weight").value),waist=Number($("waist").value);
const lifts={squat:Number($("squat").value),bench:Number($("bench").value),deadlift:Number($("deadlift").value)};
const mileSec=Number($("mileMin").value)*60+Number($("mileSec").value);
if(![age,height,bw,waist,lifts.squat,lifts.bench,lifts.deadlift,mileSec].every(n=>Number.isFinite(n)&&n>0)){
$("status").textContent="Please enter a positive value in every field.";
return;
}
const wc=classFor(sex,toKg(bw));
const strengthEvents=[
strengthEvent("Squat","squat",lifts.squat,bw,sex,age,wc,EVENT_COLORS.squat),
strengthEvent("Bench press","bench",lifts.bench,bw,sex,age,wc,EVENT_COLORS.bench),
strengthEvent("Deadlift","deadlift",lifts.deadlift,bw,sex,age,wc,EVENT_COLORS.deadlift)
];
const strengthScore=strengthEvents.reduce((sum,event)=>sum+event.score,0)/strengthEvents.length;
const factor=ageFactor(sex,age);
const ageStandard=MILE_OPEN[sex]/factor;
const ageGrade=clamp(ageStandard/mileSec*100,0,110);
const cGrade=cardioGrade(ageGrade);
const cardioScore=cardioNormalized(ageGrade);
const cardioMarks=[["Average",ageStandard/.50],["Good",ageStandard/.60],["Great",ageStandard/.70],["Elite",ageStandard/.80]];
const mileEvent={id:"mile",score:cardioScore,grade:cGrade,html:eventCard({
name:"One-mile run",color:EVENT_COLORS.mile,grade:cGrade,value:formatTime(mileSec),
metric:`${round(ageGrade,1)}%`,metricNote:"age-graded performance",
progress:ageGrade,marks:cardioMarks.map(([label,value])=>[label,formatTime(value)]),
foot:"WMA/USATF age grading · 2020 tables · mile standard interpolated from 1500 m and 3000 m"
})};
const cm=lengthCm(waist),heightInCm=lengthCm(height),bwKg=toKg(bw);
const waistPct=waistPercentile(sex,age,cm);
const bodyScore=clamp(100-waistPct,0,100);
const bGrade=gradeByScore(bodyScore);
const row=WAIST_DATA[sex].find(r=>age>=r.min&&age<=r.max)||WAIST_DATA[sex].at(-1);
const bodyMarks=[["Average",row.v[4]],["Good",row.v[3]],["Great",row.v[1]],["Elite",row.v[0]]];
const whtr=cm/heightInCm;
const bmi=bwKg/((heightInCm/100)**2);
const whtrInfo=whtrClass(whtr);
const bodyEvent={id:"waist",score:bodyScore,grade:bGrade,html:eventCard({
name:"Body composition",color:EVENT_COLORS.waist,grade:bGrade,
value:`Waist ${round(waist,1)} ${units==="imperial"?"in":"cm"}`,
metric:`${round(waistPct)}th`,metricNote:"same-sex/age waist percentile · lower is better",
progress:bodyScore,
marks:bodyMarks.map(([label,value])=>[label,`${round(units==="imperial"?value/2.54:value,1)} ${units==="imperial"?"in":"cm"}`]),
foot:`Waist-to-height ${round(whtr,2)} (${whtrInfo.label}) · BMI ${round(bmi,1)} shown as context, not used to score muscularity`
})};
const allEvents=[...strengthEvents,mileEvent,bodyEvent];
const visible=allEvents.filter(event=>pinnedTests.has(event.id));
$("eventGrid").innerHTML=visible.length?visible.map(event=>event.html).join(""):`<div class="empty-state">No event cards are pinned. Open <b>Dashboard events</b> and select the tests you want to see.</div>`;
const overall=(strengthScore+cardioScore+bodyScore)/3;
renderSummary("overall",overall,null,"Equal weight: strength, cardio, body");
renderSummary("strength",strengthScore,null,`Age ${strengthAgeBand(age)} · ${wc} class`);
renderSummary("cardio",cardioScore,cGrade,`${round(ageGrade,1)}% age grade`);
renderSummary("body",bodyScore,null,`WHtR ${round(whtr,2)} · BMI ${round(bmi,1)}`);
const notice=$("healthNotice");
const fixedRisk=sex==="male"?101.6:88.9;
const notes=[];
if(whtrInfo.level==="increased")notes.push(`<b>Waist-to-height:</b> ${round(whtr,2)} is in NICE's increased central-adiposity range (0.50–0.59).`);
if(whtrInfo.level==="high")notes.push(`<b>Waist-to-height:</b> ${round(whtr,2)} is in NICE's high central-adiposity range (0.60+).`);
if(whtrInfo.level==="low")notes.push(`<b>Waist-to-height:</b> ${round(whtr,2)} is below NICE's 0.40–0.49 healthy central-adiposity band; lower is not automatically better.`);
if(cm>=fixedRisk)notes.push(`<b>Waist screen:</b> This is at or above the NIH threshold of ${sex==="male"?"40":"35"} inches.`);
if(bmi>=35)notes.push(`<b>Interpretation note:</b> NICE recommends additional clinical judgement when BMI is 35 or higher.`);
if(notes.length){notice.innerHTML=notes.join(" ");notice.classList.remove("hidden")}else notice.classList.add("hidden");
$("results").classList.remove("hidden");
$("status").textContent="Profile calculated from embedded source tables. No network request was needed.";
if(shouldScroll)$("results").scrollIntoView({behavior:"smooth",block:"start"});
}
$("calculateBtn").addEventListener("click",()=>calculate(true));
$("clearBtn").addEventListener("click",()=>{
Object.keys(localStorage).filter(key=>key.startsWith("performanceProfile:")).forEach(key=>localStorage.removeItem(key));
location.reload();
});
$("imperialBtn").addEventListener("click",()=>setUnits("imperial"));
$("metricBtn").addEventListener("click",()=>setUnits("metric"));
ids.forEach(id=>$(id).addEventListener("change",saveInputs));
restoreInputs();
renderTestPicker();
