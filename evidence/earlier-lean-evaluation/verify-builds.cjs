const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const root = __dirname;
function create(arm) {
  const elements = Object.fromEntries(['quote-form','quantity','quote-result','quantity-error','quote-submit'].map(id => [id,{value:id==='quantity'?'1':'',textContent:'',attrs:{},handlers:{},focused:false,addEventListener(k,v){this.handlers[k]=v},setAttribute(k,v){this.attrs[k]=v},focus(){this.focused=true}}]));
  elements['quote-form'].querySelector = () => elements['quote-submit'];
  let clock=0,id=0;
  const timers=new Map(),requests=[];
  const ctx=vm.createContext({document:{getElementById:k=>elements[k]},AbortController,Error,Promise,Number,setTimeout:(fn,ms)=>{timers.set(++id,{fn,at:clock+ms});return id},clearTimeout:id=>timers.delete(id),requestQuote:(units,options)=>new Promise((resolve,reject)=>requests.push({units,options,resolve,reject}))});
  vm.runInContext(fs.readFileSync(path.join(root,'fixtures',arm,'app.js'),'utf8'),ctx);
  const flush=async()=>{for(let i=0;i<12;i++)await Promise.resolve()};
  return {elements,requests,timers,ctx,flush,submit:async()=>{elements['quote-form'].handlers.submit({preventDefault(){}});await flush()},edit:async v=>{elements.quantity.value=v;elements.quantity.handlers.input();await flush()},advance:async ms=>{clock+=ms;for(const [id,t]of [...timers])if(t.at<=clock){timers.delete(id);t.fn()}await flush()},text:()=>elements['quote-result'].textContent};
}
const tests={
  async loading_and_success(a){const x=create(a);await x.submit();assert.match(x.text(),/loading|calculating/i);x.requests[0].resolve({total:25,currency:'USD'});await x.flush();assert.equal(x.text(),'$25.00');assert.equal(x.timers.size,0)},
  async invalid_input(a){for(const v of['','0','-1','1.5','Infinity','9007199254740992']){const x=create(a);await x.edit(v);await x.submit();assert.equal(x.requests.length,0);assert.equal(x.elements.quantity.attrs['aria-invalid'],'true');assert.ok(x.elements['quantity-error'].textContent);assert.ok(x.elements.quantity.focused)}},
  async edit_clears_quote(a){const x=create(a);await x.submit();x.requests[0].resolve({total:25});await x.flush();await x.edit('2');assert.equal(x.text(),'')},
  async ignores_old_success(a){const x=create(a);await x.submit();await x.edit('2');await x.submit();x.requests[1].resolve({total:50});await x.flush();x.requests[0].resolve({total:25});await x.flush();assert.equal(x.text(),'$50.00')},
  async ignores_old_failure(a){const x=create(a);await x.submit();await x.edit('2');await x.submit();x.requests[1].resolve({total:50});await x.flush();x.requests[0].reject(new Error('obsolete failure'));await x.flush();assert.equal(x.text(),'$50.00')},
  async edit_invalidates_pending(a){const x=create(a);await x.submit();await x.edit('');x.requests[0].resolve({total:25});await x.flush();assert.equal(x.text(),'');assert.equal(x.timers.size,0)},
  async error_then_retry(a){const x=create(a);await x.submit();x.requests[0].reject(new Error('down'));await x.flush();assert.match(x.text(),/retry/i);await x.submit();x.requests[1].resolve({total:25});await x.flush();assert.equal(x.text(),'$25.00')},
  async timeout_and_late_result(a){const x=create(a);await x.submit();await x.advance(4999);assert.match(x.text(),/loading|calculating/i);await x.advance(1);assert.match(x.text(),/retry/i);const timed=x.text();x.requests[0].resolve({total:25});await x.flush();assert.equal(x.text(),timed);assert.equal(x.timers.size,0)},
  async timeout_then_retry(a){const x=create(a);await x.submit();await x.advance(5000);await x.submit();x.requests[1].resolve({total:25});await x.flush();x.requests[0].resolve({total:999});await x.flush();assert.equal(x.text(),'$25.00')},
  async repeated_submission(a){const x=create(a);await x.submit();await x.submit();assert.equal(x.timers.size,1);x.requests[1].resolve({total:50});await x.flush();x.requests[0].resolve({total:25});await x.flush();assert.equal(x.text(),'$50.00')},
  async synchronous_service_error(a){const x=create(a);x.ctx.requestQuote=()=>{throw new Error('sync')};await x.submit();assert.match(x.text(),/retry/i);assert.equal(x.timers.size,0)},
  async markup_relationships(a){const h=fs.readFileSync(path.join(root,'fixtures',a,'index.html'),'utf8');assert.match(h,/<form[^>]*id="quote-form"[^>]*novalidate/);assert.match(h,/<label[^>]*for="quantity"/);assert.match(h,/<input[^>]*id="quantity"[^>]*aria-describedby="[^"]*quantity-error/);assert.match(h,/<button[^>]*type="submit"/);assert.match(h,/<output[^>]*aria-live="polite"/)}
};
(async()=>{const results=[];for(const arm of ['build-a','build-b'])for(const [name,run]of Object.entries(tests)){try{await run(arm);results.push({arm,test:name,passed:true})}catch(e){results.push({arm,test:name,passed:false,error:String(e)})}}const out={method:'Independent application execution with simulated DOM and timers; markup assertions are not accessibility runtime checks',results};fs.writeFileSync(path.join(root,'outputs','independent-build-checks.json'),JSON.stringify(out,null,2));console.log(JSON.stringify(out,null,2));process.exitCode=results.some(x=>!x.passed)?1:0})()
