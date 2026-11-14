const {test} = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const source = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');
const service = fs.readFileSync(path.join(__dirname, 'quote-service.js'), 'utf8');

function setup(requestQuote) {
  let now = 0;
  let nextTimer = 0;
  const timers = new Map();
  const elements = new Map();
  for (const id of ['quote-form', 'quantity', 'quote-result', 'quantity-error', 'quote-submit']) {
    elements.set(id, {
      value: id === 'quantity' ? '1' : '',
      textContent: '',
      attrs: {},
      listeners: {},
      addEventListener(name, fn) { this.listeners[name] = fn; },
      setAttribute(name, value) { this.attrs[name] = value; },
      focus() { this.focused = true; }
    });
  }
  const context = vm.createContext({
    document: {getElementById: id => elements.get(id)},
    AbortController,
    DOMException,
    setTimeout(fn, delay) {
      const id = ++nextTimer;
      timers.set(id, {fn, at: now + delay});
      return id;
    },
    clearTimeout(id) { timers.delete(id); }
  });
  if (requestQuote) context.requestQuote = requestQuote;
  else vm.runInContext(service, context);
  vm.runInContext(source, context);
  const flush = async () => { for (let i = 0; i < 12; i++) await Promise.resolve(); };
  return {
    elements,
    flush,
    result: elements.get('quote-result'),
    async edit(value) {
      elements.get('quantity').value = value;
      elements.get('quantity').listeners.input();
      await flush();
    },
    async submit() {
      elements.get('quote-form').listeners.submit({preventDefault() {}});
      await flush();
    },
    async tick(ms) {
      now += ms;
      for (const [id, timer] of [...timers]) {
        if (timer.at <= now && timers.has(id)) {
          timers.delete(id);
          timer.fn();
        }
      }
      await flush();
    },
    timers
  };
}

test('local service renders loading, unchanged arithmetic, error and retry', async () => {
  const app = setup();
  await app.submit();
  assert.equal(app.result.textContent, 'Calculating quote…');
  assert.equal(app.result.attrs['aria-busy'], 'true');
  await app.tick(800);
  assert.equal(app.result.textContent, '$25.00');
  await app.edit('13');
  assert.equal(app.result.textContent, '');
  await app.submit();
  await app.tick(100);
  assert.match(app.result.textContent, /couldn’t/);
  assert.equal(app.elements.get('quote-submit').textContent, 'Retry quote');
  await app.edit('2');
  await app.submit();
  await app.tick(100);
  assert.equal(app.result.textContent, '$50.00');
  assert.equal(app.timers.size, 0);
});

test('invalid quantities clear old output, announce feedback, focus input and do not request', async () => {
  let calls = 0;
  const app = setup(() => { calls++; return Promise.resolve({total: 25}); });
  await app.submit();
  assert.equal(app.result.textContent, '$25.00');
  for (const value of ['', '0', '-1', '1.5', 'NaN', 'Infinity', '9007199254740992']) {
    await app.edit(value);
    assert.equal(app.result.textContent, '');
    await app.submit();
    assert.equal(app.elements.get('quantity').attrs['aria-invalid'], 'true');
    assert.equal(app.elements.get('quantity').focused, true);
    assert.match(app.elements.get('quantity-error').textContent, /whole number/);
  }
  assert.equal(calls, 1);
});

test('ignored cancellation cannot restore an old success or failure after edit or newer result', async () => {
  const pending = [];
  const app = setup((units, options) => new Promise((resolve, reject) => pending.push({units, options, resolve, reject})));
  await app.submit();
  await app.edit('2');
  assert.equal(pending[0].options.signal.aborted, true);
  await app.submit();
  pending[1].resolve({total: 50});
  await app.flush();
  pending[0].resolve({total: 25});
  await app.flush();
  assert.equal(app.result.textContent, '$50.00');
  await app.submit();
  await app.edit('3');
  pending[2].reject(new Error('late failure'));
  await app.flush();
  assert.equal(app.result.textContent, '');
});

test('five-second timeout remains settled despite ignored abort, with working same-value retry', async () => {
  const pending = [];
  const app = setup((units, options) => new Promise(resolve => pending.push({resolve, options})));
  await app.submit();
  await app.tick(4999);
  assert.equal(app.result.textContent, 'Calculating quote…');
  await app.tick(1);
  assert.match(app.result.textContent, /too long/);
  assert.equal(app.result.attrs['aria-busy'], 'false');
  assert.equal(pending[0].options.signal.aborted, true);
  pending[0].resolve({total: 999});
  await app.flush();
  assert.match(app.result.textContent, /too long/);
  await app.submit();
  pending[1].resolve({total: 25});
  await app.flush();
  assert.equal(app.result.textContent, '$25.00');
  assert.equal(app.timers.size, 0);
});

test('repeat submit supersedes pending request and synchronous service throws are recoverable', async () => {
  const pending = [];
  const app = setup(() => new Promise(resolve => pending.push(resolve)));
  await app.submit();
  await app.submit();
  pending[0]({total: 999});
  await app.flush();
  assert.equal(app.result.textContent, 'Calculating quote…');
  pending[1]({total: 25});
  await app.flush();
  assert.equal(app.result.textContent, '$25.00');
  const broken = setup(() => { throw new Error('offline'); });
  await broken.submit();
  assert.match(broken.result.textContent, /couldn’t/);
  assert.equal(broken.timers.size, 0);
});
