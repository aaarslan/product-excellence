const fs = require('fs');
const vm = require('vm');
const assert = require('assert/strict');
const html = fs.readFileSync('index.html','utf8');
const script = html.match(/<script>([\s\S]*)<\/script>/)[1];
const fixture = JSON.parse(fs.readFileSync('sample-storage.json','utf8'));
class Element {
  constructor(id='') { this.id=id; this.textContent=''; this.value=''; this.hidden=false; this.attrs={}; this.style={}; this.dataset={}; this.listeners={}; this.children=[]; this.checked=false; }
  addEventListener(name,fn) { (this.listeners[name] ||= []).push(fn); }
  setAttribute(name,value) { this.attrs[name]=value; }
  append(...els) { this.children.push(...els); }
  replaceChildren(...els) { this.children=els; }
  focus() { this.focused=true; }
  setSelectionRange() {} scrollIntoView() {} remove() {}
  click() { this.fire('click'); }
  fire(name) { for (const fn of this.listeners[name]||[]) fn({target:this,preventDefault(){}}); }
}
function app(seed={},failWrites=false) {
 const elements={}; for (const m of html.matchAll(/id="([^"]+)"/g)) elements[m[1]]=new Element(m[1]);
 const swaps=['character','place','trouble'].map(key=>{const x=new Element();x.dataset.swap=key;return x;});
 const tabs=['finished','drafts','removed'].map(key=>{const x=new Element();x.dataset.shelf=key;return x;});
 const storage=Object.fromEntries(Object.entries(seed).map(([k,v])=>[k,JSON.stringify(v)]));
 const window={addEventListener(){},scrollTo(){}};
 const document={getElementById:id=>elements[id],querySelectorAll:q=>q==='[data-swap]'?swaps:q==='[data-shelf]'?tabs:[],createElement:tag=>new Element(tag),body:new Element('body')};
 const context={document,window,localStorage:{getItem:key=>storage[key]??null,setItem:(key,value)=>{if(failWrites)throw new Error('Quota exceeded');storage[key]=value;}},console,Date,Math,JSON,Object,Boolean,String,Number,Array,Set,Blob,URL:{createObjectURL:()=>'',revokeObjectURL(){}},setInterval:()=>1,clearInterval(){},setTimeout:()=>1};
 vm.runInNewContext(script,context);
 return {elements,swaps,tabs,storage,click:id=>elements[id].click(),input:(id,value)=>{elements[id].value=value;elements[id].fire('input');},value:key=>JSON.parse(storage[key]),setFail:value=>{failWrites=value;}};
}
const D='storybreak.draft.v1', S='storybreak.stories.v1', P='storybreak.paused.v1';
const check=(label,fn)=>{fn();console.log('PASS '+label);};
check('Fresh visit has three prompts, zero seeded stories and no automatic timer',()=>{const a=app();assert.equal(a.elements['shelf-count'].textContent,0);const p=a.value(D).prompt;assert.ok(p.character&&p.place&&p.trouble);assert.equal(a.elements.timer.textContent,'Start');assert.equal(a.elements.text.value,'');});
check('Legacy snapshot preserves text and unknown prompts verbatim',()=>{const a=app(fixture);assert.equal(a.elements.text.value,fixture[D].text);assert.deepEqual(a.value(D).prompt,fixture[D].prompt);assert.deepEqual(a.value(S),fixture[S]);a.click('nav-library');assert.equal(a.elements.library.children.length,2);a.elements.library.children[1].children.at(-1).click();assert.equal(a.elements['read-title'].textContent,'A Pocket of Moonlight');assert.equal(a.elements['read-text'].textContent,fixture[S][1].text);assert.ok(a.elements['read-prompts'].textContent.includes('an umbrella repairer'));assert.equal(a.value(D).text,fixture[D].text);});
check('Individual swap preserves other cards and draft; undo restores exact old prompt',()=>{const a=app(fixture);a.swaps[2].click();assert.equal(a.value(D).prompt.character,fixture[D].prompt.character);assert.equal(a.value(D).prompt.place,fixture[D].prompt.place);assert.notEqual(a.value(D).prompt.trouble,fixture[D].prompt.trouble);assert.equal(a.value(D).text,fixture[D].text);a.click('undo-swap');assert.deepEqual(a.value(D).prompt,fixture[D].prompt);});
check('Spoken opening enters the page without replacing existing writing',()=>{const a=app();const p=a.value(D).prompt;a.click('use-opening');assert.ok(a.value(D).text.endsWith('because '));assert.ok(a.value(D).text.includes(p.character.slice(1)));assert.equal(a.elements['spark-compact'].hidden,false);a.input('text','My own opening.');a.click('use-opening');assert.equal(a.value(D).text,'My own opening.');});
check('Blank finish asks for a sentence and does not create a story',()=>{const a=app();a.click('finish');assert.equal(a.elements['finish-error'].hidden,false);assert.equal(a.storage[S],undefined);});
check('Four-sentence finish opens read view, saves title, and updates without duplicates',()=>{const a=app();const text='The dragon arrived. The bread sang. She sang back. They opened a choir.';a.input('title','The tiny dragon choir');a.input('text',text);a.click('finish');assert.equal(a.elements['read-view'].hidden,false);assert.equal(a.elements['read-text'].textContent,text);assert.equal(a.value(S)[0].title,'The tiny dragon choir');assert.equal(a.value(S).length,1);a.click('edit-story');a.input('text',text+' The baker applauded.');a.click('finish');assert.equal(a.value(S).length,1);assert.ok(a.value(S)[0].text.endsWith('applauded.'));});
check('Starting fresh keeps unfinished ending and supports immediate recovery after reload',()=>{const a=app(fixture);a.input('text',fixture[D].text+' sang along.');const expected=a.value(D).text;a.click('new');assert.equal(a.value(D).text,'');assert.equal(a.value(P)[0].text,expected);const seed=Object.fromEntries(Object.entries(a.storage).map(([k,v])=>[k,JSON.parse(v)]));const b=app(seed);b.click('nav-library');b.tabs[1].click();assert.equal(b.elements.library.children.length,1);b.elements.library.children[0].children.at(-1).click();assert.equal(b.elements.text.value,expected);assert.equal(b.value(D).text,expected);});
check('Opening a story does not replace draft; making edited copy parks draft and keeps original',()=>{const a=app(fixture);a.click('nav-library');a.elements.library.children[0].children.at(-1).click();assert.equal(a.value(D).text,fixture[D].text);a.click('edit-story');assert.equal(a.value(P)[0].text,fixture[D].text);assert.equal(a.value(D).text,fixture[S][0].text);a.input('text','Edited copy.');a.click('finish');assert.equal(a.value(S).length,3);assert.equal(a.value(S).find(s=>s.id==='legacy-fox-001').text,fixture[S][0].text);});
check('Removed stories survive reload and can be restored with exact text',()=>{const a=app(fixture);a.click('nav-library');a.elements.library.children[0].children.at(-1).click();a.click('remove-story');assert.ok(a.value(S).find(s=>s.id==='legacy-fox-001').trashedAt);const seed=Object.fromEntries(Object.entries(a.storage).map(([k,v])=>[k,JSON.parse(v)]));const b=app(seed);b.click('nav-library');b.tabs[2].click();b.elements.library.children[0].children.at(-1).click();b.click('edit-story');assert.equal(b.value(S).find(s=>s.id==='legacy-fox-001').trashedAt,undefined);assert.equal(b.value(S).find(s=>s.id==='legacy-fox-001').text,fixture[S][0].text);});
check('Search finds prompt text and old story text, with useful no-results state',()=>{const a=app(fixture);a.click('nav-library');a.input('search','umbrella repairer');assert.equal(a.elements.library.children.length,1);assert.equal(a.elements.library.children[0].children[1].textContent,'A Pocket of Moonlight');a.input('search','zzzz-no-match');assert.equal(a.elements.library.children[0].children[0].textContent,'That story is hiding.');});
check('Storage failure shows failure and blocks new-story data loss / false finish success',()=>{const a=app(fixture);a.setFail(true);a.input('text','An ending that must survive.');assert.equal(a.elements['storage-warning'].hidden,false);assert.equal(a.elements['draft-status'].textContent,'Not saved — keep this page open');a.click('new');assert.equal(a.elements.text.value,'An ending that must survive.');a.click('finish');assert.equal(a.elements['write-view'].hidden,false);assert.equal(a.value(S).length,2);a.setFail(false);a.click('retry-save');assert.equal(a.value(D).text,'An ending that must survive.');assert.equal(a.elements['storage-warning'].hidden,false);a.click('finish');assert.equal(a.value(S).length,3);assert.equal(a.elements['storage-warning'].hidden,true);});
check('Malformed existing data remains untouched',()=>{const a=app({[D]:{text:'Old draft with missing prompt'},[S]:fixture[S]});const raw=a.storage[D];a.input('text','New words');assert.equal(a.storage[D],raw);assert.equal(a.elements['storage-warning'].hidden,false);});
console.log('All 12 focused state-flow checks passed. These are DOM-stub checks, not browser rendering or accessibility tests.');
