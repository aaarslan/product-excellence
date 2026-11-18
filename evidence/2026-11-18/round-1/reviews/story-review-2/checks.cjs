const fs = require('fs');
const assert = require('assert').strict;
const {JSDOM, VirtualConsole} = require('jsdom');

const ROOT=require('path').resolve(__dirname,'../..');
const OUTPUT={A:'r02',B:'r03',C:'r01'};
const D='storybreak.draft.v1', S='storybreak.stories.v1';
const sample=JSON.parse(fs.readFileSync(ROOT+'/inputs/inputs/story-break/sample-storage.json','utf8'));
const seed=Object.fromEntries(Object.entries(sample).map(([key,value])=>[key,JSON.stringify(value)]));
const variants={
 A:{write:'write-nav',shelf:'shelf-nav',reader:'reader',body:'reader-text',readerTitle:'reader-title',edit:'edit-copy',remove:'remove-story',timer:'timer',timerEnable:null,archive:'storybreak.drafts.v2',undo:'undo-prompt'},
 B:{write:'nav-write',shelf:'nav-library',reader:'read-view',body:'read-text',readerTitle:'read-title',edit:'edit-story',remove:'remove-story',timer:'timer',timerEnable:'timed-round',archive:'storybreak.paused.v1',undo:'undo-swap'},
 C:{write:'write-tab',shelf:'shelf-tab',reader:'reader-view',body:'reader-text',readerTitle:'reader-title',edit:'reader-edit',remove:'remove',timer:'timer-toggle',timerEnable:'timed',archive:S,undo:null}
};
function boot(v,initial={}){
 const html=fs.readFileSync(ROOT+'/outputs/'+OUTPUT[v]+'/index.html','utf8');
 const errors=[],intervals=new Map();let nextTimer=1,clock=1700000000000;
 const control={failKeys:new Set(),errors,intervals};
 const vc=new VirtualConsole();vc.on('jsdomError',e=>errors.push(e.message));
 const dom=new JSDOM(html,{url:'https://storybreak.test/',runScripts:'dangerously',virtualConsole:vc,beforeParse(w){
  Object.entries(initial).forEach(([key,value])=>w.localStorage.setItem(key,value));
  const setter=w.Storage.prototype.setItem;
  w.Storage.prototype.setItem=function(key,value){if(control.failKeys.has(key))throw new w.DOMException('Simulated quota failure','QuotaExceededError');return setter.call(this,key,value);};
  w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};
  w.Date.now=()=>clock;
  w.setInterval=fn=>{const id=nextTimer++;intervals.set(id,fn);return id;};w.clearInterval=id=>intervals.delete(id);
  w.setTimeout=()=>nextTimer++;w.clearTimeout=()=>{};
  w.URL.createObjectURL=()=> 'blob:dom-check';w.URL.revokeObjectURL=()=>{};
  if(w.HTMLDialogElement){w.HTMLDialogElement.prototype.showModal=function(){this.open=true;};w.HTMLDialogElement.prototype.close=function(){this.open=false;};}
 }});
 const w=dom.window,d=w.document;
 return {v,html,w,d,control,close:()=>w.close(),el:id=>d.getElementById(id),click:id=>{const el=d.getElementById(id);assert(el,'Missing '+id);el.click();},input:(id,value)=>{const el=d.getElementById(id);el.value=value;el.dispatchEvent(new w.Event('input',{bubbles:true}));},json:key=>JSON.parse(w.localStorage.getItem(key)),snapshot:()=>Object.fromEntries(Array.from({length:w.localStorage.length},(_,i)=>{const key=w.localStorage.key(i);return [key,w.localStorage.getItem(key)];})),advance:ms=>{clock+=ms;Array.from(intervals.values()).forEach(fn=>fn());}};
}
function prompt(env){return Object.fromEntries(['character','place','trouble'].map(k=>[k,env.el(k).textContent]));}
function buttonFor(env,word){const b=[...env.el('library').querySelectorAll('button')].find(b=>((b.getAttribute('aria-label')||'')+' '+b.textContent).toLowerCase().includes(word.toLowerCase()));assert(b,'No library button containing '+word);return b;}
function openShelf(env){env.click(variants[env.v].shelf);}
function openOld(env,title){openShelf(env);buttonFor(env,title).click();}
function allRecords(env){return Object.values(env.snapshot()).flatMap(raw=>{try{const x=JSON.parse(raw);return Array.isArray(x)?x:[x];}catch{return [];}});}
function intact(env,old){const story=env.json(S).find(s=>s.id===old.id);assert(story,'Missing '+old.id);assert.equal(story.text,old.text);assert.deepEqual(story.prompt,old.prompt);assert.equal(story.title,old.title);}
function noErrors(env){assert.deepEqual(env.control.errors,[]);}
const report={method:'jsdom with a synthetic HTTPS origin and mocked timers, scroll methods, object URLs, and dialog open/close. No rendered browser, real keyboard, accessibility tree, downloads, or file-origin/offline execution was exercised.',variants:{}};

for(const v of Object.keys(variants)){
 const cfg=variants[v],results=[];
 function test(name,run){let env;try{env=run();if(env)noErrors(env);results.push({name,status:'pass'});}catch(e){results.push({name,status:'fail',detail:e.stack});}finally{if(env)env.close();}}
 test('Empty storage has three nonempty prompts, no sample library, no running countdown',()=>{const e=boot(v);assert(Object.values(prompt(e)).every(x=>x.length));assert.equal(e.control.intervals.size,0);assert(!(e.json(S)||[]).length);return e;});
 test('Begin with supplied assistance without mandatory setup',()=>{const e=boot(v);if(v==='B'){e.click('use-opening');assert(e.el('text').value.includes(' because '));assert.equal(e.d.activeElement.id,'text');assert(e.el('spark-full').hidden);assert(!e.el('spark-compact').hidden);}else if(v==='C'){e.el('borrow').closest('details').open=true;e.click('borrow');assert(e.el('text').value.includes('for one thing.'));assert.equal(e.d.activeElement.id,'text');}else{assert(e.el('opening-cue').textContent.includes(e.el('character').textContent));e.input('text','The fox wanted a ticket.');assert.equal(e.json(D).text,'The fox wanted a ticket.');}return e;});
 test('Change only place with a written sentence; preserve other two prompts and exact text',()=>{const e=boot(v);e.input('text','The fox wanted a ticket.');const before=prompt(e);e.d.querySelector('[data-swap="place"]').click();const after=prompt(e);assert.notEqual(after.place,before.place);assert.equal(after.character,before.character);assert.equal(after.trouble,before.trouble);assert.equal(e.json(D).text,'The fox wanted a ticket.');assert.equal(e.el('text').value,'The fox wanted a ticket.');if(cfg.undo){e.click(cfg.undo);assert.deepEqual(prompt(e),before);assert.equal(e.el('text').value,'The fox wanted a ticket.');}return e;});
 test('Finish four sentences, search, reopen full reading text, and reload draft plus story',()=>{let e=boot(v);const text='The fox wanted a ticket.\nThe train asked for a joke.\nThe fox told one.\nThey laughed all the way home.';e.input('text',text);e.input('title','The Kitchen Ticket');e.click('finish');assert(!e.el(cfg.reader).hidden);assert.equal(e.el(cfg.body).textContent,text);assert.equal(e.el(cfg.readerTitle).textContent,'The Kitchen Ticket');assert.equal(e.json(S)[0].text,text);openShelf(e);e.input('search','ticket');buttonFor(e,'The Kitchen Ticket').click();assert.equal(e.el(cfg.body).textContent,text);const stored=e.snapshot();noErrors(e);e.close();e=boot(v,stored);assert.equal(e.el('text').value,text);assert.equal(e.json(S)[0].text,text);openShelf(e);buttonFor(e,'The Kitchen Ticket').click();assert.equal(e.el(cfg.body).textContent,text);return e;});
 test('Legacy dragon draft and both complete saved stories keep exact text and all original prompt strings',()=>{const e=boot(v,seed);assert.equal(e.el('text').value,sample[D].text);assert.deepEqual(prompt(e),sample[D].prompt);for(const old of sample[S]){openOld(e,old.title);assert.equal(e.el(cfg.body).textContent,old.text);intact(e,old);assert.equal(e.el('text').value,sample[D].text);}e.click(cfg.write);assert.equal(e.el('text').value,sample[D].text);return e;});
 test('New story preserves meaningful old draft and can resume it from the shelf after reload',()=>{let e=boot(v,seed);e.click('new');assert.equal(e.el('text').value,'');assert(allRecords(e).some(s=>s&&s.text===sample[D].text));sample[S].forEach(s=>intact(e,s));const stored=e.snapshot();noErrors(e);e.close();e=boot(v,stored);openShelf(e);if(v==='B')e.d.querySelector('[data-shelf="drafts"]').click();buttonFor(e,'nervous dragon').click();assert.equal(e.el('text').value,sample[D].text);assert.deepEqual(prompt(e),sample[D].prompt);return e;});
 test('Opening and editing a saved story preserves the meaningful current draft and original finished version',()=>{const e=boot(v,seed),old=sample[S][0];openOld(e,old.title);assert.equal(e.el('text').value,sample[D].text);e.click(cfg.edit);assert.equal(e.el('text').value,old.text);assert(allRecords(e).some(s=>s&&s.text===sample[D].text));e.input('text',old.text+'\nAn extra ending.');e.click('finish');intact(e,old);assert(e.json(S).some(s=>s.text===old.text+'\nAn extra ending.'));return e;});
 test('Removal preserves complete story; restore works after reload and does not replace the draft',()=>{let e=boot(v,seed),old=sample[S][0];openOld(e,old.title);if(v==='B')e.el('remove-details').open=true;e.click(cfg.remove);intact(e,old);assert.equal(e.el('text').value,sample[D].text);const stored=e.snapshot();noErrors(e);e.close();e=boot(v,stored);openShelf(e);if(v==='A'){assert(!e.el('removed').hidden);e.el('removed').open=true;const row=[...e.el('removed-list').children].find(x=>x.textContent.includes(old.title));assert(row);row.querySelector('button').click();}if(v==='B'){e.d.querySelector('[data-shelf="removed"]').click();buttonFor(e,old.title).click();assert.equal(e.el(cfg.body).textContent,old.text);e.click('edit-story');}if(v==='C'){e.click('bin-toggle');buttonFor(e,old.title).click();e.click('bin-toggle');}intact(e,old);assert.equal(e.el('text').value,sample[D].text);buttonFor(e,old.title).click();assert.equal(e.el(cfg.body).textContent,old.text);return e;});
 test('Optional timer expiry neither blocks editing nor destroys or automatically finishes words',()=>{const e=boot(v);e.input('text','Thinking is part of writing.');if(cfg.timerEnable){e.el(cfg.timerEnable).checked=true;e.el(cfg.timerEnable).dispatchEvent(new e.w.Event('change',{bubbles:true}));}else e.el('timer-details').open=true;e.click(cfg.timer);assert(e.control.intervals.size>0);e.advance(20*60*1000);assert.equal(e.control.intervals.size,0);assert.equal(e.el('text').value,'Thinking is part of writing.');assert(!e.el('text').disabled);assert(!e.el('text').readOnly);e.input('text','Thinking is part of writing. Now there is an ending.');assert.equal(e.json(D).text,'Thinking is part of writing. Now there is an ending.');assert(!(e.json(S)||[]).length);return e;});
 test('Failure while archiving for New story leaves the meaningful editor and original stored draft intact',()=>{const e=boot(v,seed);e.control.failKeys.add(cfg.archive);e.click('new');assert.equal(e.el('text').value,sample[D].text);assert.equal(e.json(D).text,sample[D].text);assert(!e.el('storage-warning').hidden);sample[S].forEach(s=>intact(e,s));return e;});
 test('Failure replacing draft after archive succeeds still preserves old editor and retrievable words',()=>{const e=boot(v,seed);e.control.failKeys.add(D);e.click('new');assert.equal(e.el('text').value,sample[D].text);assert.equal(e.json(D).text,sample[D].text);assert(allRecords(e).some(s=>s&&s.text===sample[D].text));sample[S].forEach(s=>intact(e,s));return e;});
 test('Failed finished-story save keeps editor text, does not claim a persisted new story, and leaves legacy stories intact',()=>{const e=boot(v,seed);e.input('text','A short finished test story.');e.control.failKeys.add(S);e.click('finish');assert.equal(e.el('text').value,'A short finished test story.');assert.equal(e.json(S).length,2);sample[S].forEach(s=>intact(e,s));assert(!e.el('storage-warning').hidden);if(v==='C'){assert(!e.el(cfg.reader).hidden);assert(e.el('reader-meta').textContent.includes('Not saved'));}else assert(e.el(cfg.reader).hidden);return e;});
 test('Malformed existing JSON is not overwritten after writing and attempting Finish/New',()=>{const bad={...seed,[S]:'{broken-json'};const e=boot(v,bad);e.input('text','Some new words.');e.click('finish');e.click(cfg.write);e.click('new');assert.equal(e.w.localStorage.getItem(S),'{broken-json');assert(!e.el('storage-warning').hidden);return e;});
 const staticEnv=boot(v);
 const external=[...staticEnv.d.querySelectorAll('script[src],link[rel="stylesheet"],img[src],iframe[src],audio[src],video[src],source[src]')].map(el=>el.outerHTML);
 const cssRequests=/@import\b|url\s*\(/i.test(staticEnv.html.match(/<style>([\s\S]*?)<\/style>/)[1]);
 const scriptRequests=/\b(fetch|XMLHttpRequest|WebSocket|EventSource)\s*\(/.test(staticEnv.html.match(/<script>([\s\S]*?)<\/script>/)[1]);
 const labelAudit=[...staticEnv.d.querySelectorAll('input,textarea,select')].map(el=>({id:el.id,name:el.getAttribute('aria-label')||[...staticEnv.d.querySelectorAll('label')].filter(l=>l.htmlFor===el.id||l.contains(el)).map(l=>l.textContent.trim()).join(' ')}));
 const current=boot(v,seed);openShelf(current);if(v==='B')current.d.querySelector('[data-shelf="drafts"]').click();current.input('search','nervous dragon');
 const activeDraftOnShelf=[...current.el('library').querySelectorAll('button')].some(b=>((b.getAttribute('aria-label')||'')+' '+b.textContent).toLowerCase().includes('nervous dragon'));
 report.variants[v]={results,static:{externalResources:external,cssRequests,scriptRequests,formLabels:labelAudit,containsResponsiveRules:staticEnv.html.includes('@media'),containsFocusVisibleRule:staticEnv.html.includes(':focus-visible'),activeDraftOnShelf,promptUndo:!!cfg.undo,initialErrors:staticEnv.control.errors}};
 current.close();staticEnv.close();
}
fs.writeFileSync(require('path').join(__dirname,'results-rerun.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
process.exit(Object.values(report.variants).some(v=>v.results.some(t=>t.status==='fail'))?1:0);
