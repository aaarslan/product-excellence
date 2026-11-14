import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';
class Element {
  constructor(tag = '') { this.tag = tag; this.children = []; this.listeners = {}; this.value = ''; this.disabled = false; this.hidden = false; }
  replaceChildren() { this.children = []; }
  append(...children) { this.children.push(...children); }
  setAttribute(name, value) { this[name] = value; }
  addEventListener(name, listener) { this.listeners[name] = listener; }
  focus() { document.activeElement = this; }
  click() { if (!this.disabled) return this.listeners.click?.(); }
}
const elements = new Map(['queue', 'search', 'priority', 'notice', 'send', 'retry', 'select-visible', 'export', 'reload', 'count', 'clear'].map(id => { const element = new Element(); element.id = id; return [id, element]; }));
elements.get('priority').value = 'all';
const document = { activeElement: null, querySelector: selector => elements.get(selector.slice(1)), createElement: tag => new Element(tag), getElementById: id => elements.get('queue').children.flatMap(row => row.children).find(node => node.id === id) };
const requests = [];
let exported;
const context = vm.createContext({ document, Set, Map, AbortController, setTimeout, clearTimeout, Blob, URL: { createObjectURL: blob => { exported = blob; return 'blob:test'; }, revokeObjectURL() {} }, fetch: (path, options) => { requests.push([path, options?.method || 'GET']); return fetch(`http://127.0.0.1:4174${path}`, options); } });
vm.runInContext(await readFile(new URL('./app.js', import.meta.url), 'utf8'), context);
async function waitFor(predicate) { for (let i = 0; i < 100; i++) { if (predicate()) return; await new Promise(resolve => setTimeout(resolve, 30)); } throw new Error('Timed out waiting for UI state'); }
await waitFor(() => elements.get('queue').children.length === 4);
assert.equal(document.getElementById('select-h-104').disabled, true);
elements.get('select-visible').click();
assert.match(elements.get('count').textContent, /3 selected/);
elements.get('search').value = 'Harbor';
elements.get('search').listeners.input();
assert.match(elements.get('count').textContent, /2 hidden/);
elements.get('send').click();
assert.equal(elements.get('send').disabled, true);
await waitFor(() => elements.get('notice').textContent.startsWith('2 sent · 1 failed'));
assert.match(elements.get('count').textContent, /1 selected/);
assert.equal(document.getElementById('select-h-102').checked, true);
assert.equal(elements.get('retry').hidden, false);
assert.equal(requests.filter(([, method]) => method === 'POST').length, 3);
elements.get('retry').click();
await waitFor(() => elements.get('notice').textContent.startsWith('1 sent · 0 failed'));
assert.equal(elements.get('retry').hidden, true);
assert.equal(document.getElementById('select-h-102').disabled, true);
assert.deepEqual(requests.filter(([, method]) => method === 'POST').map(([path]) => path), ['/api/handoffs/h-101/send', '/api/handoffs/h-102/send', '/api/handoffs/h-103/send', '/api/handoffs/h-102/send']);
elements.get('export').click();
assert.equal(await exported.text(), '"Title","Account","Priority","Status"\r\n"Resolve duplicate invoice","Harbor Works","high","sent"');
elements.get('search').value = '';
elements.get('priority').value = 'normal';
elements.get('priority').listeners.change();
assert.equal(elements.get('queue').children.length, 2);
elements.get('search').value = 'does-not-match';
elements.get('search').listeners.input();
assert.match(elements.get('queue').children[0].textContent, /No handoffs match/);
console.log('PASS: actual service load, ready-only selection, hidden selection, sequential batch, partial failure, failure-only retry, filtered CSV, priority filtering, empty state. DOM simulated; no layout or keyboard validation.');
