import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
class Element {
  constructor(tag = 'div') { this.tag = tag; this.children = []; this.handlers = {}; this.value = ''; this.disabled = false; }
  addEventListener(type, callback) { this.handlers[type] = callback; }
  replaceChildren(...children) { this.children = children; }
  append(...children) { this.children.push(...children); }
  setAttribute(name, value) { this[name] = value; }
  focus() { document.activeElement = this; }
  click() { if (!this.disabled) return this.handlers.click?.(); }
}
const ids = ['queue', 'search', 'priority', 'notice', 'send', 'select-all', 'export', 'reload', 'count'];
const elements = Object.fromEntries(ids.map(id => [id, Object.assign(new Element(), { id })]));
elements.priority.value = 'all';
const document = {
  activeElement: null,
  querySelector: selector => elements[selector.slice(1)],
  createElement: tag => new Element(tag),
  getElementById: id => elements[id] || elements.queue.children.flatMap(row => row.children).find(child => child.id === id)
};
const calls = [];
let downloaded;
let mode = 'real';
const context = vm.createContext({ document, console, AbortController, setTimeout, clearTimeout, Blob, TypeError, URL: { createObjectURL: blob => { downloaded = blob; return 'blob:test'; }, revokeObjectURL() {} }, fetch: async (path, options) => {
  calls.push({ path, method: options?.method || 'GET' });
  if (mode === 'offline') throw new TypeError('Offline');
  return fetch(`http://127.0.0.1:4175${path}`, options);
}});
const source = await readFile(new URL('./app.js', import.meta.url), 'utf8');
const waitFor = async predicate => {
  const until = Date.now() + 12000;
  while (!predicate()) {
    if (Date.now() > until) throw new Error('Timed out waiting for UI state');
    await new Promise(resolve => setTimeout(resolve, 10));
  }
};
vm.runInContext(source, context);
await waitFor(() => elements.queue.children.length === 4);
assert.equal(document.getElementById('select-h-104').disabled, true);
elements.priority.value = 'high';
elements.priority.handlers.change();
assert.equal(elements.queue.children.length, 2);
elements['select-all'].checked = true;
elements['select-all'].handlers.change();
assert.equal(elements.send.textContent, 'Send selected (2)');
const sending = elements.send.click();
assert.equal(elements.send.disabled, true);
assert.equal(elements.search.disabled, true);
assert.equal(elements.send.textContent, 'Sending…');
await elements.send.handlers.click();
await sending;
assert.match(elements.notice.textContent, /1 sent · 1 failed/);
assert.equal(elements.send.textContent, 'Retry selected (1)');
assert.equal(document.getElementById('select-h-101').checked, false);
assert.equal(document.getElementById('select-h-102').checked, true);
await elements.send.click();
assert.match(elements.notice.textContent, /1 sent · 0 failed/);
assert.deepEqual(calls.filter(call => call.method === 'POST').map(call => call.path), ['/api/handoffs/h-101/send', '/api/handoffs/h-102/send', '/api/handoffs/h-102/send']);
await elements.export.click();
assert.equal(await downloaded.text(), '"Title","Account","Priority","Status"\r\n"Confirm replacement delivery","Aster Supply","high","sent"\r\n"Resolve duplicate invoice","Harbor Works","high","sent"');
elements.priority.value = 'all';
elements.priority.handlers.change();
const normal = document.getElementById('select-h-103');
normal.checked = true;
normal.focus();
normal.handlers.change();
assert.equal(document.activeElement.id, 'select-h-103');
elements.search.value = 'missing';
elements.search.handlers.input();
assert.match(elements.queue.children[0].textContent, /No handoffs match/);
assert.equal(elements.send.disabled, true);
assert.match(elements.notice.textContent, /Selection cleared/);
elements.search.value = 'Juniper';
elements.search.handlers.input();
assert.equal(elements.queue.children.length, 1);
elements['select-all'].checked = true;
elements['select-all'].handlers.change();
mode = 'offline';
await elements.send.click();
assert.match(elements.queue.children[0].children[1].children[2].textContent, /Delivery not confirmed/);
assert.equal(elements.send.textContent, 'Retry selected (1)');
mode = 'real';
await elements.send.click();
assert.match(elements.notice.textContent, /1 sent · 0 failed/);
mode = 'offline';
await elements.reload.handlers.click();
assert.equal(elements.reload.hidden, false);
mode = 'real';
await elements.reload.click();
assert.equal(elements.reload.hidden, true);
assert.equal(elements.export.disabled, false);
console.log('PASS: real-service batch, partial failure, explicit retry, no repeat successes, duplicate guard, filters, filtered CSV, empty state, simulated network recovery, load recovery, focus restoration.');
