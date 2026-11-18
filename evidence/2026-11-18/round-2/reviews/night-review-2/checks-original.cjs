const fs = require('fs');
const path = require('path');
const {JSDOM, VirtualConsole} = require('/workspace/scratch/6ecb29bfb4b0/dom-runtime/node_modules/jsdom');
const base = '/workspace/scratch/6ecb29bfb4b0/review-pack-v2';
const output = path.join(base, 'review2');
const evidence = {method: 'Source inspection and jsdom with inline scripts. scrollIntoView and matchMedia are stubs. No browser, layout, keyboard, or user-comprehension verification.', variants: {}};
const clean = s => s.replace(/\s+/g, ' ').trim();
const clock = n => `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`;
const known = {
  press: {floor:0, durations:[20], close:1260}, printing:{floor:0,durations:[20],close:1260},
  machines:{floor:0,durations:[20],starts:[1110,1155,1200],close:1260},
  river:{floor:0,min:15,max:25,close:1245},listen:{floor:0,min:15,max:25,close:1245},
  postcard:{floor:0,durations:[25],close:1230},repair:{floor:1,durations:[30],starts:[1125,1200],close:1260},
  archive:{floor:1,min:10,max:15,close:1260}
};
function load(v){
  const errors=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
  const html=fs.readFileSync(path.join(base,'variants/case-1',v,'index.html'),'utf8');
  const dom=new JSDOM(html,{runScripts:'dangerously',url:'file://'+path.join(base,'variants/case-1',v,'index.html'),virtualConsole:vc,beforeParse(w){w.HTMLElement.prototype.scrollIntoView=function(){};w.matchMedia=()=>({matches:false});}});
  return {v,dom,w:dom.window,d:dom.window.document,errors,html};
}
function change(x,sel,value){const el=x.d.querySelector(sel);if(el.type==='checkbox')el.checked=value;else el.value=value;el.dispatchEvent(new x.w.Event('change',{bubbles:true}));}
function click(x,sel){const el=x.d.querySelector(sel);if(!el)throw new Error(`Missing ${x.v} ${sel}`);el.click();}
function submit(x,sel){x.d.querySelector(sel).dispatchEvent(new x.w.Event('submit',{bubbles:true,cancelable:true}));}
function setPrefs(x,mins,a,b,ground){
  if(x.v==='A'){click(x,`[data-minutes="${mins}"]`);change(x,'#interest-a',a);change(x,'#interest-b',b);change(x,'#ground-only',ground);}
  else if(x.v==='B'){click(x,`[data-duration="${mins}"]`);click(x,`#yourInterests [data-pref="${a}"]`);click(x,`#theirInterests [data-pref="${b}"]`);change(x,'#groundOnly',ground);}
  else {click(x,`[data-minutes="${mins}"]`);change(x,'#you',a);change(x,'#companion',b);change(x,'#step-free',ground);submit(x,'#planner-form');}
}
function snap(x){
  let state,stops,finish,plan;
  if(x.v==='A'){
    state=x.w.NightShiftDemo.getState();stops=state.route.map(s=>({...s,floor:known[s.id].floor}));
    finish=stops.length?stops.at(-1).end+(stops.at(-1).floor?5:3):null;
  }else if(x.v==='B'){
    ({state,plan}=JSON.parse(x.w.eval('JSON.stringify({state,plan:currentPlan})')));
    stops=plan?plan.stops.map(s=>({id:s.room.id,floor:s.room.floor,start:s.start,end:s.end,duration:s.duration,travel:s.move,arrival:s.arrive,wait:s.wait})):[];
    finish=plan?.finish;
  }else{
    ({state,plan}=JSON.parse(x.w.eval('JSON.stringify({state:{minutes,activePrefs,excluded:[...excluded],visited:[...visited]},plan:currentPlan})')));
    stops=plan.map(s=>({id:s.a.id,floor:s.a.floor,start:s.start,end:s.end,duration:s.duration,travel:s.travel,arrival:s.arrive,wait:s.wait}));finish=stops.at(-1)?.end;
  }
  const root=x.d.querySelector(x.v==='A'?'#route':x.v==='B'?'#routeContent':'#your-route');
  return {state,stops,finish,timeSummary:stops.map(s=>`${s.id} ${clock(s.start)}–${clock(s.end)}`),text:clean(root.textContent)};
}
function invariants(snapshot,mins,ground,v){
  const errors=[];let floor=0,at=1100;
  for(const s of snapshot.stops){const k=known[s.id];
    if(ground&&s.floor)errors.push('Upstairs in ground-only route');
    if(s.end!==s.start+s.duration)errors.push('End/duration mismatch');
    if(k.starts&&!k.starts.includes(s.start))errors.push('Incorrect fixed start');
    if(k.durations&&!k.durations.includes(s.duration))errors.push('Incorrect activity duration');
    if(k.min&&(s.duration<k.min||s.duration>k.max))errors.push('Activity duration outside given range');
    if(s.end>k.close)errors.push('Past close');
    if(s.start<at+s.travel)errors.push('Insufficient scheduled transfer');
    if(s.travel!==(floor===0&&s.floor===0?3:5))errors.push('Unexpected transfer estimate');
    if(s.end>1100+mins)errors.push('Activity beyond requested duration');
    floor=s.floor;at=s.end;
  }
  if(v!=='C'&&snapshot.finish>1100+mins)errors.push('Return exceeds requested duration');
  return errors;
}
for(const v of ['A','B','C']){
  const x=load(v);const r=evidence.variants[v]={initial:snap(x),scenarios:{},errors:x.errors};
  r.externalRefs=Array.from(x.d.querySelectorAll('[src],link[href],iframe,object')).map(el=>({tag:el.tagName,src:el.getAttribute('src'),href:el.getAttribute('href')}));
  r.duplicateIDs=Array.from(new Set(Array.from(x.d.querySelectorAll('[id]')).map(e=>e.id).filter((id,i,a)=>a.indexOf(id)!==i)));
  const choices=v==='A'?['machines','press','river','postcard','archive','repair']:v==='B'?['watch','make','quiet','stories']:['motion','make','stories','quiet','curious'];
  const faults=[];const tightExit=[];let count=0;
  for(const mins of [45,60,90])for(const a of choices)for(const b of choices)for(const ground of [false,true]){
    setPrefs(x,mins,a,b,ground);const s=snap(x);count++;const issues=invariants(s,mins,ground,v);if(issues.length)faults.push({mins,a,b,ground,issues});
    const last=s.stops.at(-1);if(v==='C'&&last&&last.end+(last.floor?5:3)>1100+mins)tightExit.push({mins,a,b,ground,times:s.timeSummary,spare:1100+mins-last.end,exitAllowanceUsedByOthers:last.floor?5:3});
  }
  r.initialCombinationAudit={count,faults,tightExit};
  const quiet=v==='A'?'river':'quiet',live=v==='A'?'machines':v==='B'?'watch':'motion',make=v==='A'?'postcard':'make',stories=v==='A'?'repair':'stories';
  const probes=[['45 quiet, step-free',45,quiet,quiet,true],['60 live + make, step-free',60,live,make,true],['90 live + make, step-free',90,live,make,true],['45 repair/stories pair',45,stories,stories,false],['60 repair/stories + quiet',60,stories,quiet,false],['90 repair/stories pair',90,stories,stories,false]];
  for(const [name,mins,a,b,ground] of probes){setPrefs(x,mins,a,b,ground);r.scenarios[name]=snap(x);}
  x.dom.window.close();
}
// A: revise a crowded second stop after waiting, retain earlier stop, validate time, undo.
{
  const x=load('A');setPrefs(x,90,'machines','postcard',true);const before=snap(x);const index=before.stops.findIndex(s=>s.id==='postcard');
  change(x,`#swap-time-${index}`,'19:08');click(x,`[data-swap="${index}"]`);const after=snap(x);
  click(x,'#undo-swap');const undone=snap(x);
  change(x,`#swap-time-${index}`,'18:21');click(x,`[data-swap="${index}"]`);
  evidence.variants.A.recovery={before,after,undone,invalidTimeError:clean(x.d.querySelector(`#swap-error-${index}`).textContent),errors:x.errors};x.dom.window.close();
}
// B: inspect defaults from a second-stop action and then provide actual current context.
{
  const x=load('B');setPrefs(x,90,'watch','make',true);const before=snap(x);
  click(x,'[data-replace="postcard"]');const dialogDefault={time:x.d.querySelector('#replanTime').value,floor:x.d.querySelector('#replanFloor').value,omitted:Array.from(x.d.querySelectorAll('#omitList input:checked')).map(e=>e.value)};
  change(x,'#replanTime','19:08');change(x,'#replanFloor','0');
  const visited=before.stops.filter(s=>s.id!=='postcard'&&s.end<=1148).map(s=>s.id);
  for(const id of visited)change(x,`#omitList input[value="${id}"]`,true);
  submit(x,'#replanForm');const after=snap(x);click(x,'[data-action="copy"]');const copy=x.d.querySelector('#copyText').value;
  evidence.variants.B.recovery={before,dialogDefault,manualInputs:{time:'19:08',floor:0,visitedOmitted:visited},after,copy,errors:x.errors};x.dom.window.close();
}
// C: capture pending state, visited state, and what removal actually does during a visit.
{
  const x=load('C');setPrefs(x,90,'motion','make',true);const before=snap(x);const first=before.stops[0].id;
  click(x,`[data-visited="${first}"]`);const marked=snap(x);
  click(x,'[data-skip="postcard"]');const removed=snap(x);
  click(x,'#restore-stops');const restored=snap(x);
  change(x,'#you','quiet');const pending={hint:clean(x.d.querySelector('#update-hint').textContent),route:snap(x)};
  evidence.variants.C.adaptation={before,marked,removed,restored,pending,errors:x.errors};x.dom.window.close();
}
fs.writeFileSync(path.join(output,'DOM_EVIDENCE.json'),JSON.stringify(evidence,null,2));
const summary = {};
for(const [v,r] of Object.entries(evidence.variants)) {
  summary[v] = {initial:r.initial.timeSummary,initialFinish:r.initial.finish&&clock(r.initial.finish),combinations:r.initialCombinationAudit.count,scheduleFaults:r.initialCombinationAudit.faults,exitTightRoutes:r.initialCombinationAudit.tightExit,scenarios:Object.fromEntries(Object.entries(r.scenarios).map(([name,s])=>[name,{times:s.timeSummary,finish:s.finish&&clock(s.finish),text:s.text}])),errors:r.errors};
}
console.log(JSON.stringify(summary,null,2));
