const fs=require('fs');
const {JSDOM,VirtualConsole}=require('/workspace/scratch/6ecb29bfb4b0/dom-runtime/node_modules/jsdom');
const base='/workspace/scratch/6ecb29bfb4b0/review-pack-v2';
const clean=s=>s.replace(/\s+/g,' ').trim();
function load(v){const vc=new VirtualConsole();const errors=[];vc.on('jsdomError',e=>errors.push(e.message));const dom=new JSDOM(fs.readFileSync(`${base}/variants/case-1/${v}/index.html`,'utf8'),{runScripts:'dangerously',virtualConsole:vc,beforeParse(w){w.HTMLElement.prototype.scrollIntoView=function(){};w.matchMedia=()=>({matches:false})}});return{dom,w:dom.window,d:dom.window.document,errors};}
function change(x,sel,val){const el=x.d.querySelector(sel);el.value=val;el.dispatchEvent(new x.w.Event('change',{bubbles:true}));}
function click(x,sel){x.d.querySelector(sel).click()}
function submit(x,sel){x.d.querySelector(sel).dispatchEvent(new x.w.Event('submit',{bubbles:true,cancelable:true}))}
const result={};
{
 const x=load('A');change(x,'#interest-a','repair');change(x,'#interest-b','river');
 const index=x.w.NightShiftDemo.getState().route.findIndex(s=>s.id==='repair');change(x,`#swap-time-${index}`,'19:19');click(x,`[data-swap="${index}"]`);
 result.A_late_upstairs={state:x.w.NightShiftDemo.getState(),text:clean(x.d.querySelector('#route').textContent),errors:x.errors};x.dom.window.close();
}
{
 const x=load('B');click(x,'[data-action="replan"]');change(x,'#replanTime','19:19');change(x,'#replanFloor','1');submit(x,'#replanForm');
 result.B_late_upstairs={state:JSON.parse(x.w.eval('JSON.stringify(state)')),text:clean(x.d.querySelector('#routeContent').textContent),errors:x.errors};x.dom.window.close();
}
{
 const x=load('C');click(x,'[data-minutes="45"]');change(x,'#you','motion');change(x,'#companion','stories');submit(x,'#planner-form');
 result.C_zero_spare_upstairs={text:clean(x.d.querySelector('#your-route').textContent),errors:x.errors};x.dom.window.close();
}
fs.writeFileSync(`${base}/review2/EDGE_EVIDENCE.json`,JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
