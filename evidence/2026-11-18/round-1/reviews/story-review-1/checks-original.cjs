const fs = require('fs');
const assert = require('assert/strict');
const { JSDOM, VirtualConsole } = require('/workspace/scratch/6ecb29bfb4b0/dom-runtime/node_modules/jsdom');
const ROOT = '/workspace/scratch/6ecb29bfb4b0/review-pack';
const D='storybreak.draft.v1', S='storybreak.stories.v1';
const fixture=JSON.parse(fs.readFileSync(ROOT+'/inputs/inputs/story-break/sample-storage.json','utf8'));
const adapters={
 A:{write:'write-nav',shelf:'shelf-nav',reader:'reader',readerText:'reader-text',readerPrompts:'reader-prompt-text',remove:'remove-story',edit:'edit-copy',timer:'timer',timerToggle:null},
 B:{write:'nav-write',shelf:'nav-library',reader:'read-view',readerText:'read-text',readerPrompts:'read-prompts',remove:'remove-story',edit:'edit-story',timer:'timer',timerToggle:'timed-round'},
 C:{write:'write-tab',shelf:'shelf-tab',reader:'reader-view',readerText:'reader-text',readerPrompts:'reader-ingredients',remove:'remove',edit:'reader-edit',timer:'timer-toggle',timerToggle:'timed'}
};
const results={};
function boot(variant,seed={},width=1100){
 const errors=[]; const vc=new VirtualConsole(); vc.on('jsdomError',e=>errors.push(e.message));
 let clock=1700000000000, counter=0, randomSeed=142;
 const intervals=new Map();
 const dom=new JSDOM(fs.readFileSync(ROOT+'/variants/story-break/'+variant+'/index.html','utf8'),{
  url:'https://offline-dom-probe.invalid/',runScripts:'dangerously',pretendToBeVisual:true,virtualConsole:vc,
  beforeParse(w){
   Object.defineProperty(w,'innerWidth',{value:width,writable:true});
   w.scrollTo=()=>{};w.HTMLElement.prototype.scrollIntoView=()=>{};
   w.Math.random=()=>{randomSeed=(randomSeed*48271)%2147483647;return randomSeed/2147483647;};
   w.Date.now=()=>clock;
   w.setInterval=(fn)=>{intervals.set(++counter,fn);return counter;};
   w.clearInterval=id=>intervals.delete(id);
   for(const [k,v] of Object.entries(seed))w.localStorage.setItem(k,typeof v==='string'?v:JSON.stringify(v));
  }
 });
 const w=dom.window,d=w.document;
 const $=id=>{const el=d.getElementById(id);assert.ok(el,'missing #'+id);return el;};
 return {w,d,$,errors,click:id=>$(id).click(),type(id,text){$(id).value=text;$(id).dispatchEvent(new w.Event('input',{bubbles:true}));},
  json:key=>JSON.parse(w.localStorage.getItem(key)),
  snapshot:()=>Object.fromEntries(Array.from({length:w.localStorage.length},(_,i)=>{const key=w.localStorage.key(i);return [key,w.localStorage.getItem(key)];})),
  prompts:()=>Object.fromEntries(['character','place','trouble'].map(k=>[k,$(k).textContent])),
  advance(ms){clock+=ms;for(const fn of [...intervals.values()])fn();}, intervals,
  close:()=>w.close()
 };
}
function buttonMatching(s,pattern){const b=[...s.$('library').querySelectorAll('button')].find(b=>pattern.test(b.getAttribute('aria-label')||b.textContent));assert.ok(b,'no matching library button '+pattern);return b;}
function openSaved(s,v,title){s.click(adapters[v].shelf);if(v==='B')s.d.querySelector('[data-shelf="finished"]').click();buttonMatching(s,new RegExp(title.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'))).click();}
function check(v,name,fn){try{const detail=fn();results[v].push({name,status:'pass',detail});}catch(e){results[v].push({name,status:'fail',detail:e.stack});}}
for(const v of ['A','B','C']){
 results[v]=[];const a=adapters[v];
 check(v,'initial entry and place-only change',()=>{const s=boot(v);const p=s.prompts();assert.ok(Object.values(p).every(Boolean));if(v==='B'){s.click('use-opening');assert.equal(s.d.activeElement.id,'text');assert.ok(s.$('text').value.includes(' because '));assert.equal(s.$('spark-full').hidden,true);s.click('revisit-prompts');}s.type('text','The dragon wanted bread.');s.d.querySelector('[data-swap="place"]').click();const q=s.prompts();assert.equal(q.character,p.character);assert.equal(q.trouble,p.trouble);assert.notEqual(q.place,p.place);assert.equal(s.$('text').value,'The dragon wanted bread.');assert.equal(s.json(D).text,'The dragon wanted bread.');assert.equal(s.intervals.size,0);assert.deepEqual(s.errors,[]);const detail={prompt:q,focus:s.d.activeElement.id,initialTimerCount:0};s.close();return detail;});
 check(v,'four sentences finish, read, search, reload',()=>{let s=boot(v);const text='A dragon wanted toast. Its shadow stole the butter. They traded a joke for breakfast. Everyone ate together.';s.type('text',text);s.type('title','The tiny dragon toast story');s.click('finish');assert.equal(s.$(a.reader).hidden,false);assert.equal(s.$(a.readerText).textContent,text);assert.equal(s.json(S).length,1);s.click(a.shelf);s.type('search','butter');assert.equal(s.$('library').querySelectorAll('button').length,1);buttonMatching(s,/dragon/).click();assert.equal(s.$(a.readerText).textContent,text);const state=s.snapshot();s.close();s=boot(v,state);assert.equal(s.$('text').value,text);openSaved(s,v,'The tiny dragon toast story');assert.equal(s.$(a.readerText).textContent,text);assert.deepEqual(s.errors,[]);s.close();return 'Exact text persisted in draft and story; search found body word; full reading copy reopened after fresh DOM load.';});
 check(v,'new story preserves unfinished draft and opening another does not replace it',()=>{let s=boot(v,fixture);s.type('text','A meaningful unsaved ending.');openSaved(s,v,"The Fox's Last Ticket");assert.equal(s.json(D).text,'A meaningful unsaved ending.');s.click(a.write);assert.equal(s.$('text').value,'A meaningful unsaved ending.');s.click('new');assert.equal(s.$('text').value,'');s.click(a.shelf);if(v==='B')s.d.querySelector('[data-shelf="drafts"]').click();buttonMatching(s,/dragon/i).click();assert.equal(s.$('text').value,'A meaningful unsaved ending.');s.type('text','Additional ending retained.');openSaved(s,v,'A Pocket of Moonlight');s.click(a.edit);assert.equal(s.$('text').value,fixture[S][1].text);s.click(a.shelf);if(v==='B')s.d.querySelector('[data-shelf="drafts"]').click();buttonMatching(s,/dragon/i).click();assert.equal(s.$('text').value,'Additional ending retained.');assert.deepEqual(s.errors,[]);s.close();return 'New and editing another story both archive current work; archived text can be resumed.';});
 check(v,'legacy fixture intact and unknown prompt strings retained',()=>{let s=boot(v,fixture);assert.equal(s.$('text').value,fixture[D].text);assert.deepEqual(s.prompts(),fixture[D].prompt);for(const story of fixture[S]){openSaved(s,v,story.title);assert.equal(s.$(a.readerText).textContent,story.text);for(const p of Object.values(story.prompt))assert.ok(s.$(a.readerPrompts).textContent.includes(p));}s.click(a.write);s.type('text',fixture[D].text+' she made a friend.');s.click('finish');const saved=s.json(S);for(const story of fixture[S])assert.deepEqual(saved.find(x=>x.id===story.id),story);assert.deepEqual(saved[0].prompt,fixture[D].prompt);assert.deepEqual(s.errors,[]);s.close();return 'Dragon draft, both full stories, Unicode, paragraphs, and out-of-deck prompts preserved, including after subsequent saving.';});
 check(v,'removal persists and can be restored after reload',()=>{let s=boot(v,fixture);openSaved(s,v,"The Fox's Last Ticket");s.click(a.remove);const state=s.snapshot();s.close();s=boot(v,state);s.click(a.shelf);if(v==='A'){s.$('removed').open=true;s.$('removed-list').querySelector('button').click();}else if(v==='B'){s.d.querySelector('[data-shelf="removed"]').click();buttonMatching(s,/Fox/).click();s.click(a.edit);}else{s.click('bin-toggle');buttonMatching(s,/Fox/).click();s.click('bin-toggle');}openSaved(s,v,"The Fox's Last Ticket");assert.equal(s.$(a.readerText).textContent,fixture[S][0].text);assert.equal(s.$('text').value,fixture[D].text);assert.deepEqual(s.errors,[]);s.close();return 'Removed saved story stayed in storage and was fully restored after reload; draft unchanged.';});
 check(v,'timer optional and expiry preserves editing',()=>{const s=boot(v);s.type('text','Still thinking.');assert.equal(s.intervals.size,0);if(a.timerToggle){s.$(a.timerToggle).checked=true;s.$(a.timerToggle).dispatchEvent(new s.w.Event('change',{bubbles:true}));}s.click(a.timer);assert.equal(s.intervals.size,1);s.advance(1000*60*20);assert.equal(s.intervals.size,0);assert.equal(s.$('text').value,'Still thinking.');assert.equal(s.$('text').disabled,false);assert.equal(s.$('text').readOnly,false);s.type('text','Still thinking. Now finished.');assert.equal(s.json(D).text,'Still thinking. Now finished.');assert.deepEqual(s.errors,[]);s.close();return 'Advancing mocked clock beyond selected duration stops timer only; text input still saves.';});
 check(v,'DOM flow with 390px innerWidth, labels and focused reader title',()=>{const s=boot(v,{},390);assert.ok(s.$('text').labels.length);assert.ok(s.$('title').labels.length);assert.ok(s.$('search').labels.length);s.$('text').focus();assert.equal(s.d.activeElement.id,'text');s.type('text','Four. Short. Sentences. End.');s.click('finish');assert.equal(s.d.activeElement.id,v==='B'?'read-title':'reader-title');assert.equal(s.$(a.readerText).textContent,'Four. Short. Sentences. End.');assert.deepEqual(s.errors,[]);s.close();return 'DOM event and explicit focus assertions only. CSS media layout, Tab order, browser keyboard activation, overflow, and visual focus not tested.';});
 check(v,'prompt reversal mechanism',()=>{const s=boot(v);const old=s.prompts();s.type('text','The character must stay.');s.d.querySelector('[data-swap="character"]').click();assert.notEqual(s.prompts().character,old.character);const undo=v==='A'?'undo-prompt':v==='B'?'undo-swap':null;if(undo){assert.equal(s.$(undo).hidden,false);s.click(undo);assert.deepEqual(s.prompts(),old);assert.equal(s.$('text').value,'The character must stay.');}else assert.equal([...s.d.querySelectorAll('button')].some(b=>/undo|previous prompt|restore.*card/i.test(b.textContent)),false);s.close();return undo?'Single action restores the prior trio exactly while keeping the writing.':'No prompt-undo control. Individual swap replaces a card immediately; the all-card confirmation does not cover this action.';});
}
fs.writeFileSync(ROOT+'/review1/results.json',JSON.stringify(results,null,2));
for(const [v,checks]of Object.entries(results)){console.log(v);for(const c of checks)console.log(c.status+' '+c.name+(c.status==='fail'?'\n'+c.detail:''));}
