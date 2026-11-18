const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const {JSDOM, VirtualConsole} = require('jsdom');
const root = path.resolve(__dirname,'../outputs');
const results = [];
function boot(run) {
  const errors=[]; const vc=new VirtualConsole();vc.on('jsdomError', e=>errors.push(e.message));
  const dom=new JSDOM(fs.readFileSync(path.join(root,run,'index.html'),'utf8'),{url:'https://check.invalid',runScripts:'dangerously',virtualConsole:vc,beforeParse(w){
    w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};
    w.matchMedia=()=>({matches:false});
    w.HTMLDialogElement.prototype.showModal=function(){this.open=true};
    w.HTMLDialogElement.prototype.close=function(){this.open=false};
  }});
  return {dom,d:dom.window.document,errors};
}
{
 const s=boot('r13'); const snapshot=()=>[...s.d.querySelectorAll('.stop-card')].map(e=>({name:e.querySelector('h3').textContent,time:e.querySelector('.stop-top strong').textContent}));
 const initial=snapshot();assert.equal(initial.length,2);
 const field=s.d.getElementById('swap-time-1');assert.equal(field.value,'18:53');field.value='18:58';
 s.d.querySelector('[data-swap="1"]').click();const changed=snapshot();assert.deepEqual(changed[0],initial[0]);
 assert.match(s.d.getElementById('finish-card').textContent,/19:20/);
 assert.ok(s.d.getElementById('undo-swap'));s.d.getElementById('undo-swap').click();assert.deepEqual(snapshot(),initial);assert.deepEqual(s.errors,[]);
 results.push({run:'r13',result:'pass',observed:'Second-stop replacement at 18:58 retains the exact first stop/time and the 19:20 target; one Undo restores the complete original route.'});s.dom.window.close();
}
{
 const s=boot('r15');s.d.querySelector('[data-replace="listen"]').click();
 assert.equal(s.d.getElementById('replanTime').value,'18:20');assert.equal(s.d.getElementById('replanFloor').value,'0');
 const omitted=[...s.d.querySelectorAll('#omitList input:checked')].map(e=>e.value);assert.deepEqual(omitted,['listen']);assert.deepEqual(s.errors,[]);
 results.push({run:'r15',result:'observed',observed:'Second-stop replacement opens a form at original time 18:20 and ground floor with only that stop omitted. Visitor must enter current time/floor and omit any completed rooms.'});s.dom.window.close();
}
{
 const s=boot('r14');const visited=s.d.querySelector('[data-visited]');visited.click();assert.match(s.d.getElementById('progress').textContent,/^1 of/);
 s.d.querySelectorAll('[data-skip]')[1].click();assert.match(s.d.getElementById('progress').textContent,/^0 of/);assert.match(s.d.querySelector('.route-footnote').textContent,/starts again at the demo time, 18:20/);assert.deepEqual(s.errors,[]);
 results.push({run:'r14',result:'observed',observed:'Removing the second stop clears prior visited marks and explicitly rebuilds from 18:20.'});s.dom.window.close();
}
const report={method:'Coordinator’s focused check of the main recovery distinction, using unchanged actual application scripts in jsdom. Different mechanisms are observed rather than required to implement the same behavior.',limits:'No browser rendering, real keyboard, actual visitor behavior, native dialog, offline file URL, or comparative visual judgment.',results};
fs.writeFileSync(path.join(__dirname,'recovery-results-rerun.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
