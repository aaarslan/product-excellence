const fs = require('fs');
const crypto = require('crypto');
const { JSDOM, VirtualConsole } = require('jsdom');
const ROOT = require('path').resolve(__dirname,'../..');
const OUTPUT = {A:'r13',B:'r15',C:'r14'};
const OUT = __dirname;
const facts = {
  'Printing Floor': { floor:0, open:1080, close:1260, min:20, max:20 },
  'Small Machines': { floor:0, starts:[1110,1155,1200], min:20, max:20 },
  'River Listening Room': { floor:0, open:1080, close:1245, min:15, max:25 },
  'Make a Postcard': { floor:0, open:1080, close:1230, min:25, max:25 },
  'Repair Stories': { floor:1, starts:[1125,1200], min:30, max:30 },
  'Archive Drawers': { floor:1, open:1080, close:1260, min:10, max:15 }
};
const allErrors=[];
const compact = s => s.replace(/\s+/g,' ').trim();
const tm = s => {const [h,m]=s.split(':').map(Number);return h*60+m};
function load(v) {
 const html=fs.readFileSync(`${ROOT}/outputs/${OUTPUT[v]}/index.html`,'utf8');
 const errors=[];const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(String(e.message)));
 const dom=new JSDOM(html,{url:`file://${ROOT}/outputs/${OUTPUT[v]}/index.html`,runScripts:'dangerously',virtualConsole:vc,beforeParse(w){w.HTMLElement.prototype.scrollIntoView=function(){};w.matchMedia=()=>({matches:false,addEventListener(){},removeEventListener(){}});}});
 const d=dom.window.document;
 const click=sel=>{const e=d.querySelector(sel);if(!e)throw new Error(`${v} missing ${sel}`);e.click()};
 const change=(sel,value)=>{const e=d.querySelector(sel);if(e.type==='checkbox')e.checked=value;else e.value=value;e.dispatchEvent(new dom.window.Event('change',{bubbles:true}))};
 const submit=sel=>d.querySelector(sel).dispatchEvent(new dom.window.Event('submit',{bubbles:true,cancelable:true}));
 const select=(minutes,a,b,ground)=>{
   if(v==='A'){click(`[data-minutes="${minutes}"]`);change('#interest-a',a);change('#interest-b',b);change('#ground-only',ground)}
   if(v==='B'){click(`[data-duration="${minutes}"]`);click(`#yourInterests [data-pref="${a}"]`);click(`#theirInterests [data-pref="${b}"]`);change('#groundOnly',ground)}
   if(v==='C'){click(`[data-minutes="${minutes}"]`);change('#you',a);change('#companion',b);change('#step-free',ground);submit('#planner-form')}
 };
 const route=()=>{
  const selectors=v==='A'?['#route-list .stop-card','.stop-top strong']:v==='B'?['#routeContent .stop','.time']:['#your-route .stop','.stop-time'];
  return [...d.querySelectorAll(selectors[0])].map(el=>{const span=el.querySelector(selectors[1]).textContent.match(/(\d\d:\d\d)–(\d\d:\d\d)/);return {name:compact(el.querySelector('h3').textContent),start:tm(span[1]),end:tm(span[2]),text:compact(el.textContent)}});
 };
 const text=()=>compact(d.querySelector(v==='A'?'#route':v==='B'?'#routeContent':'#your-route').textContent);
 const validate=(r,{start=1100,floor=0,deadline,ground=false}={})=>{
   const violations=[];const seen=new Set();let clock=start;
   for(const s of r){const f=facts[s.name];if(!f){violations.push('Unknown activity '+s.name);continue}
    if(seen.has(s.name))violations.push('Duplicate '+s.name);seen.add(s.name);
    const needed=floor!==f.floor?5:floor===0?3:0;
    if(s.start<clock+needed)violations.push(`${s.name} insufficient movement: ${s.start-clock} < ${needed}`);
    if(f.starts&&!f.starts.includes(s.start))violations.push(`${s.name} wrong fixed start`);
    if(f.open&&s.start<f.open)violations.push(`${s.name} before opening`);
    if(f.close&&s.end>f.close)violations.push(`${s.name} after closing`);
    if(s.end-s.start<f.min||s.end-s.start>f.max)violations.push(`${s.name} duration outside event range`);
    if(s.end>deadline)violations.push(`${s.name} after duration budget`);
    if(ground&&f.floor)violations.push(`${s.name} violates ground-floor filter`);
    floor=f.floor;clock=s.end;
   }
   if((v==='A'||v==='B')&&r.length&&clock+(floor?5:3)>deadline)violations.push('Promised exit allowance exceeds deadline');
   return violations;
 };
 return {v,html,dom,d,errors,click,change,submit,select,route,text,validate,close(){allErrors.push(...errors.map(error=>({variant:v,error})));dom.window.close()}};
}
const variants={A:['machines','press','river','postcard','archive','repair'],B:['watch','make','quiet','stories'],C:['motion','make','stories','quiet','curious']};
const results={method:'JSDOM only. No resources option, no browser. scrollIntoView is a no-op and matchMedia returns false. Native layout, keyboard, focus quality, modal behavior and clipboard unverified.',static:[],initial:[],enumeration:[],probes:[],recovery:[],errors:[]};
for(const v of ['A','B','C']){
 const e=load(v);
 results.static.push({variant:v,sha256:crypto.createHash('sha256').update(e.html).digest('hex'),externalResources:[...e.d.querySelectorAll('[src],link[href]')].map(x=>x.getAttribute('src')||x.getAttribute('href')),externalCSS:/@import|url\(\s*['"]?https?:/i.test(e.html),networkAPIs:/\bfetch\s*\(|XMLHttpRequest|WebSocket\s*\(/.test(e.html),programmeRooms:Object.keys(facts).filter(n=>e.d.body.textContent.includes(n))});
 results.initial.push({variant:v,route:e.route(),text:e.text()});
 let count=0;const failures=[];const choices=[];
 for(const minutes of [45,60,90])for(const a of variants[v])for(const b of variants[v])for(const ground of [false,true]){
  e.select(minutes,a,b,ground);const route=e.route(),problems=e.validate(route,{deadline:1100+minutes,ground});
  count++;if(problems.length)failures.push({minutes,a,b,ground,route,problems});
  choices.push({minutes,a,b,ground,stops:route.map(({name,start,end})=>({name,start,end})),text:e.text()});
 }
 results.enumeration.push({variant:v,count,failures,choiceFile:`choices-${v}-rerun.json`});
 fs.writeFileSync(`${OUT}/choices-${v}-rerun.json`,JSON.stringify(choices,null,2));
 e.close();
}
const matched=[
 {name:'45 minutes: both seek quiet, step-free',minutes:45,ground:true,A:['river','river'],B:['quiet','quiet'],C:['quiet','quiet']},
 {name:'60 minutes: demonstration/motion and making',minutes:60,ground:false,A:['machines','postcard'],B:['watch','make'],C:['motion','make']},
 {name:'90 minutes: demonstration/motion and making',minutes:90,ground:false,A:['machines','postcard'],B:['watch','make'],C:['motion','make']},
 {name:'45 minutes: repair/stories plus quiet',minutes:45,ground:false,A:['repair','river'],B:['stories','quiet'],C:['stories','quiet']},
 {name:'60 minutes: repair/stories plus quiet',minutes:60,ground:false,A:['repair','river'],B:['stories','quiet'],C:['stories','quiet']},
 {name:'60 minutes: repair/stories, step-free',minutes:60,ground:true,A:['repair','repair'],B:['stories','stories'],C:['stories','stories']},
 {name:'90 minutes: mill past and restoration stories',minutes:90,ground:false,A:['archive','repair'],B:['stories','stories'],C:['stories','stories']}
];
for(const probe of matched)for(const v of ['A','B','C']){
 const e=load(v);e.select(probe.minutes,...probe[v],probe.ground);results.probes.push({probe:probe.name,variant:v,route:e.route(),text:e.text(),violations:e.validate(e.route(),{deadline:1100+probe.minutes,ground:probe.ground})});e.close();
}
// A: full first demonstration, a longer wait, prefix preservation, undo and invalid input.
{
 const e=load('A');const initial=e.route();e.change('#swap-time-0','18:30');e.click('[data-swap="0"]');
 results.recovery.push({variant:'A',scenario:'Small Machines full at 18:30',route:e.route(),text:e.text(),state:e.dom.window.NightShiftDemo.getState(),violations:e.validate(e.route(),{start:1110,deadline:1160})});
 e.click('#undo-swap');results.recovery.push({variant:'A',scenario:'Undo first recovery',restored:JSON.stringify(initial)===JSON.stringify(e.route())});
 e.change('#swap-time-0','18:40');e.click('[data-swap="0"]');results.recovery.push({variant:'A',scenario:'Small Machines full, ready after wait at 18:40',route:e.route(),text:e.text(),violations:e.validate(e.route(),{start:1120,deadline:1160})});
 e.select(90,'machines','postcard',false);const before=e.route();const idx=before.findIndex(s=>s.name==='Make a Postcard');const queued=before[idx];e.change(`#swap-time-${idx}`,`${String(Math.floor((queued.start+10)/60)).padStart(2,'0')}:${String((queued.start+10)%60).padStart(2,'0')}`);e.click(`[data-swap="${idx}"]`);
 const after=e.route(),state=e.dom.window.NightShiftDemo.getState();const scheduleOnly=s=>({name:s.name,start:s.start,end:s.end});results.recovery.push({variant:'A',scenario:'Postcard queue after ten minutes; preserve earlier stops',before,after,text:e.text(),state,prefixPreserved:JSON.stringify(before.slice(0,idx).map(scheduleOnly))===JSON.stringify(after.slice(0,idx).map(scheduleOnly)),violations:e.validate(after.slice(idx),{start:queued.start+10,floor:0,deadline:1190})});
 e.select(60,'machines','river',false);e.change('#swap-time-0','18:00');e.click('[data-swap="0"]');results.recovery.push({variant:'A',scenario:'Reject recovery time before room arrival',error:e.d.querySelector('#swap-error-0').textContent,errorVisible:!e.d.querySelector('#swap-error-0').hidden,unchanged:e.dom.window.NightShiftDemo.getState().recovery===null});
 e.close();
}
// B: same full-room case, delayed time/current floor entry, exclusions, invalid time, visit view and offline copy fallback.
{
 const e=load('B');e.click('[data-replace="machines"]');results.recovery.push({variant:'B',scenario:'Replacement dialog default context',defaultTime:e.d.querySelector('#replanTime').value,defaultFloor:e.d.querySelector('#replanFloor').value,excluded:[...e.d.querySelectorAll('#omitList input:checked')].map(x=>x.value)});e.change('#replanTime','18:30');e.submit('#replanForm');
 results.recovery.push({variant:'B',scenario:'Small Machines full at 18:30',route:e.route(),text:e.text(),violations:e.validate(e.route(),{start:1110,deadline:1160})});
 e.click('[data-action="replan"]');e.change('#replanTime','18:40');e.submit('#replanForm');results.recovery.push({variant:'B',scenario:'After further waiting to 18:40',route:e.route(),text:e.text(),violations:e.validate(e.route(),{start:1120,deadline:1160})});
 e.click('[data-action="replan"]');e.change('#replanTime','19:20');e.submit('#replanForm');results.recovery.push({variant:'B',scenario:'Reject time at departure',error:e.d.querySelector('#replanError').textContent,errorVisible:!e.d.querySelector('#replanError').hidden});e.click('[data-close="replanDialog"]');
 e.click('[data-action="reset"]');e.select(90,'watch','make',false);const before=e.route();const idx=before.findIndex(s=>s.name==='Make a Postcard');const queued=before[idx];e.click('[data-replace="postcard"]');const at=queued.start+10;e.change('#replanTime',`${String(Math.floor(at/60)).padStart(2,'0')}:${String(at%60).padStart(2,'0')}`);for(const prior of before.slice(0,idx)){const id=prior.name==='Small Machines'?'machines':prior.name==='Printing Floor'?'press':prior.name==='Archive Drawers'?'archive':null;if(id)e.change(`#omitList input[value="${id}"]`,true)}e.submit('#replanForm');results.recovery.push({variant:'B',scenario:'Postcard queue after ten minutes; earlier rooms manually excluded',before,after:e.route(),text:e.text(),violations:e.validate(e.route(),{start:at,deadline:1190})});
 e.click('[data-action="reset"]');e.click('[data-action="visit"]');results.recovery.push({variant:'B',scenario:'Visit view DOM state',classApplied:e.d.body.classList.contains('visit-mode'),routeExists:e.route().length>0});e.click('#editVisit');e.click('[data-action="copy"]');results.recovery.push({variant:'B',scenario:'Copy text generated',text:e.d.querySelector('#copyText').value});
 e.close();
}
// C: explicit rebuild semantics, progress behavior, queue fallback and restore.
{
 const e=load('C');e.click('[data-visited="machines"]');results.recovery.push({variant:'C',scenario:'Mark first stop visited',progress:e.d.querySelector('#progress').textContent,pressed:e.d.querySelector('[data-visited="machines"]').getAttribute('aria-pressed')});e.click('[data-skip="machines"]');results.recovery.push({variant:'C',scenario:'Build without full Small Machines',route:e.route(),text:e.text(),announcement:e.d.querySelector('#announcement').textContent,progress:e.d.querySelector('#progress').textContent,violations:e.validate(e.route(),{deadline:1160})});
 e.click('#restore-stops');e.select(90,'motion','make',false);const route=e.route();results.recovery.push({variant:'C',scenario:'Postcard queue fallback',route,text:e.text(),postcardText:route.find(s=>s.name==='Make a Postcard').text});
 let removed=0;while(e.d.querySelector('[data-skip]')&&removed<10){e.click('[data-skip]');removed++}results.recovery.push({variant:'C',scenario:'All remaining choices removed',removed,text:e.text(),restoreExists:!!e.d.querySelector('#restore-stops')});e.click('#restore-stops');results.recovery.push({variant:'C',scenario:'Restore from empty state',route:e.route(),text:e.text()});
 e.close();
}
results.errors=allErrors;
fs.writeFileSync(`${OUT}/results-rerun.json`,JSON.stringify(results,null,2));
console.log(JSON.stringify({enumeration:results.enumeration,static:results.static,errors:results.errors,probes:results.probes.map(x=>({variant:x.variant,probe:x.probe,stops:x.route.map(({name,start,end})=>({name,start,end})),violations:x.violations})),recovery:results.recovery.map(x=>({variant:x.variant,scenario:x.scenario,violations:x.violations,restored:x.restored,prefixPreserved:x.prefixPreserved,errorVisible:x.errorVisible,unchanged:x.unchanged}))},null,2));

// Give recorded violations a failing process status for convenient local reruns.
if (results.errors.length || results.enumeration.some(x=>x.failures.length) || [...results.probes,...results.recovery].some(x=>x.violations?.length || x.restored===false || x.prefixPreserved===false || x.errorVisible===false || x.unchanged===false)) process.exitCode=1;
