const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

function setup(useService = false) {
  const timers = new Map();
  let nextTimer = 0;
  const setTimeout = (callback, delay) => {
    timers.set(++nextTimer, {callback, delay});
    return nextTimer;
  };
  const clearTimeout = id => timers.delete(id);
  const element = () => ({
    textContent: '', attrs: {}, listeners: {},
    setAttribute(key, value) { this.attrs[key] = value; },
    addEventListener(type, callback) { this.listeners[type] = callback; },
    focus() { this.focused = true; }
  });
  const ids = Object.fromEntries(['quote-form', 'quantity', 'quote-result', 'quantity-error'].map(id => [id, element()]));
  const button = element();
  ids['quote-form'].querySelector = () => button;
  ids.quantity.value = '1';
  const requests = [];
  const context = vm.createContext({
    document: {getElementById: id => ids[id]}, AbortController, DOMException, setTimeout, clearTimeout,
    requestQuote: (quantity, options) => new Promise((resolve, reject) => requests.push({quantity, options, resolve, reject}))
  });
  if (useService) vm.runInContext(fs.readFileSync('quote-service.js', 'utf8'), context);
  vm.runInContext(fs.readFileSync('app.js', 'utf8'), context);
  return {
    ids, button, timers, requests,
    submit: () => ids['quote-form'].listeners.submit({preventDefault() {}}),
    edit(value) { ids.quantity.value = value; ids.quantity.listeners.input(); },
    fire(delay) {
      for (const [id, timer] of [...timers]) if (timer.delay === delay) {
        timers.delete(id);
        timer.callback();
      }
    }
  };
}

(async () => {
  const test = setup();
  for (const value of ['', '0', '-1', '1.5']) {
    test.edit(value);
    await test.submit();
    assert.equal(test.ids.quantity.attrs['aria-invalid'], 'true');
    assert.match(test.ids['quantity-error'].textContent, /whole number/);
    assert.equal(test.ids.quantity.focused, true);
  }
  assert.equal(test.requests.length, 0);
  test.edit('1');
  const older = test.submit();
  assert.equal(test.ids['quote-result'].textContent, 'Loading quote…');
  assert.equal(test.ids['quote-result'].attrs['aria-busy'], 'true');
  test.edit('2');
  assert.equal(test.ids['quote-result'].textContent, '');
  assert.equal(test.requests[0].options.signal.aborted, true);
  const newer = test.submit();
  test.requests[1].resolve({total: 50});
  await newer;
  test.requests[0].resolve({total: 25});
  await older;
  assert.equal(test.ids['quote-result'].textContent, '$50.00');
  test.edit('3');
  assert.equal(test.ids['quote-result'].textContent, '');
  const failed = test.submit();
  test.requests[2].reject(new Error('Service unavailable'));
  await failed;
  assert.match(test.ids['quote-result'].textContent, /Could not load/);
  assert.equal(test.button.textContent, 'Retry quote');
  const retried = test.submit();
  test.requests[3].resolve({total: 75});
  await retried;
  assert.equal(test.ids['quote-result'].textContent, '$75.00');
  const stalled = test.submit();
  assert.ok([...test.timers.values()].some(timer => timer.delay === 5000));
  test.fire(5000);
  await stalled;
  assert.match(test.ids['quote-result'].textContent, /took too long/);
  assert.equal(test.ids['quote-result'].attrs['aria-busy'], 'false');
  test.requests[4].resolve({total: 999});
  await Promise.resolve();
  assert.match(test.ids['quote-result'].textContent, /took too long/);
  const repeated = test.submit();
  const replacement = test.submit();
  test.requests[6].resolve({total: 75});
  await replacement;
  await repeated;
  assert.equal(test.ids['quote-result'].textContent, '$75.00');
  assert.equal(test.timers.size, 0);
  const service = setup(true);
  const success = service.submit();
  service.fire(800);
  await success;
  assert.equal(service.ids['quote-result'].textContent, '$25.00');
  service.edit('13');
  const unavailable = service.submit();
  service.fire(100);
  await unavailable;
  assert.match(service.ids['quote-result'].textContent, /Could not load/);
  service.edit('2');
  const recovery = service.submit();
  service.fire(100);
  await recovery;
  assert.equal(service.ids['quote-result'].textContent, '$50.00');
  console.log('PASS: validation, loading, edit invalidation, ignored cancellation, stale responses, retry, five-second deadline, repeated submission, cleanup, and actual local-service arithmetic/failure. Simulated DOM and timers.');
})().catch(error => { console.error(error); process.exitCode = 1; });
