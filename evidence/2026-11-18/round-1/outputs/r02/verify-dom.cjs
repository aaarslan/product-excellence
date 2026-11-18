const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const source=fs.readFileSync('index.html','utf8');
const code=source.match(/<script>([\s\S]*?)<\/script>/)[1];
class Element {
 constructor(id=''){this.id=id;this.children=[];this.listeners={};this.attributes={};this.value='';this.textContent='';this.hidden=false;this.dataset={};}
 addEventListener(name,fn){(this.listeners[name]??=[]).push(fn);}
 setAttribute(k,v){this.attributes[k]=v;}
 append(...items){this.children.push(...items);}
 replaceChildren(...items){this.children=items;}
 focus(){this.owner.activeElement=this;}
 click(){for(const fn of this.listeners.click||[])fn({target:this});}
 input(value){this.value=value;for(const fn of this.listeners.input||[])fn({target:this});}
 remove(){}
}
function boot(snapshot={}){
 const nodes=Object.fromEntries([...source.matchAll(/id="([^"]+)"/g)].map(m=>[m[1],new Element(m[1])]));
 nodes.duration.value='600';
 const document={activeElement:null,getElementById:id=>{assert(nodes[id],id);return nodes[id]},createElement:tag=>{const e=new Element;e.owner=document;e.tagName=tag;return e},body:new Element};document.body.owner=document;
 for(const e of Object.values(nodes))e.owner=document;
 const swaps=['character','place','trouble'].map(key=>{const e=new Element;e.dataset.swap=key;e.owner=document;return e;});document.querySelectorAll=()=>swaps;
 const storage=new Map(Object.entries(snapshot).map(([k,v])=>[k,typeof v==='string'?v:JSON.stringify(v)]));let fail=false;
 const localStorage={getItem:k=>storage.get(k)??null,setItem:(k,v)=>{if(fail)throw Error('quota');storage.set(k,v);}};
 let interval=null;
 const context={document,localStorage,Date,Math,console,Blob,URL:{createObjectURL:()=>'',revokeObjectURL(){}},setTimeout:()=>0,clearTimeout(){},setInterval:fn=>{interval=fn;return 1},clearInterval(){interval=null}};
 vm.runInNewContext(code,context);
 return {nodes,swaps,storage,click:id=>nodes[id].click(),input:(id,v)=>nodes[id].input(v),read:k=>JSON.parse(storage.get(k)),fail:()=>{fail=true},allow:()=>{fail=false},reload:()=>boot(Object.fromEntries(storage)),book:text=>nodes.library.children.find(e=>e.children.some(c=>c.textContent===text)),interval:()=>interval};
}
const legacy=JSON.parse(fs.readFileSync('sample-storage.json','utf8'));
let app=boot(legacy);
assert.equal(app.nodes.text.value,legacy['storybreak.draft.v1'].text);
for(const [k,v]of Object.entries(legacy['storybreak.draft.v1'].prompt))assert.equal(app.nodes[k].textContent,v);
app.click('shelf-nav');app.book('A Pocket of Moonlight').click();assert.equal(app.nodes['reader-text'].textContent,legacy['storybreak.stories.v1'][1].text);assert.match(app.nodes['reader-prompt-text'].textContent,/an umbrella repairer/);app.click('write-nav');assert.equal(app.nodes.text.value,legacy['storybreak.draft.v1'].text);
app.input('text','Four sentences. One funny twist. An odd solution. The end.');app.input('title','Dragon at the Bakery');
const prompts=['character','place','trouble'].map(k=>app.nodes[k].textContent);app.swaps[2].click();assert.equal(app.nodes.character.textContent,prompts[0]);assert.equal(app.nodes.place.textContent,prompts[1]);assert.notEqual(app.nodes.trouble.textContent,prompts[2]);assert.match(app.nodes.text.value,/Four sentences/);app.click('undo-prompt');assert.equal(app.nodes.trouble.textContent,prompts[2]);
app=app.reload();assert.match(app.nodes.text.value,/Four sentences/);app.click('new');assert.equal(app.nodes.text.value,'');app.click('shelf-nav');app.book('Dragon at the Bakery').click();assert.match(app.nodes.text.value,/Four sentences/);app.click('finish');assert.equal(app.nodes['reader-title'].textContent,'Dragon at the Bakery');assert.equal(app.nodes.reader.hidden,false);assert.equal(app.read('storybreak.stories.v1').length,3);
app.click('write-nav');app.click('finish');assert.equal(app.read('storybreak.stories.v1').length,3);
app.click('edit-copy');app.input('text','A different ending.');app.click('new');app.input('text','Another draft stays intact.');app.click('shelf-nav');app.nodes.library.children.find(e=>e.children[0].textContent==='Ready to read'&&e.children[1].textContent==='Dragon at the Bakery').click();app.click('write-nav');assert.equal(app.nodes.text.value,'Another draft stays intact.');app.click('shelf-nav');app.nodes.library.children.find(e=>e.children[0].textContent==='Ready to read'&&e.children[1].textContent==='Dragon at the Bakery').click();app.click('remove-story');assert.ok(app.read('storybreak.stories.v1').find(s=>s.title==='Dragon at the Bakery').deletedAt);
app=app.reload();app.click('shelf-nav');assert.equal(app.nodes['removed-list'].children.length,1);app.nodes['removed-list'].children[0].children[1].click();assert.equal(app.read('storybreak.stories.v1').find(s=>s.title==='Dragon at the Bakery').deletedAt,null);
app.input('search','umbrella repairer');assert.equal(app.nodes.library.children.length,1);assert.equal(app.nodes.library.children[0].children[1].textContent,'A Pocket of Moonlight');app.input('search','zzzznomatch');assert.equal(app.nodes['no-results'].hidden,false);
app.click('write-nav');assert.equal(app.interval(),null);app.click('timer');assert.equal(app.nodes.timer.textContent,'Pause');app.click('timer');assert.equal(app.interval(),null);app.click('timer-reset');assert.equal(app.nodes.time.hidden,true);
app.fail();const old=app.storage.get('storybreak.draft.v1');app.input('text','Unsaved ending must survive.');assert.equal(app.nodes['storage-warning'].hidden,false);app.click('new');assert.equal(app.nodes.text.value,'Unsaved ending must survive.');assert.equal(app.storage.get('storybreak.draft.v1'),old);app.click('finish');assert.equal(app.nodes.writer.hidden,false);
app.allow();app.click('retry-save');assert.equal(app.nodes['storage-warning'].hidden,true);assert.equal(app.read('storybreak.draft.v1').text,'Unsaved ending must survive.');
const broken=boot({'storybreak.stories.v1':'{broken'});broken.input('text','Safe text.');broken.click('finish');assert.equal(broken.storage.get('storybreak.stories.v1'),'{broken');assert.equal(broken.nodes['storage-warning'].hidden,false);
assert(!/<script[^>]+src=|<link[^>]+href=|\bfetch\(|https?:\/\//i.test(source));
console.log('PASS (simulated DOM): syntax/startup; exact legacy draft/story/prompt preservation; out-of-deck prompt; isolated prompt swap/undo; autosave/reload; safe new/resume; finish/reader and repeat finish; new-version preservation; reading leaves draft intact; remove/reload/restore; search by prompts; timer opt-in/start/pause/reset; quota failure keeps work, blocks destructive switching and false finish; retry persistence; malformed storage left intact; no external assets or fetch.');
