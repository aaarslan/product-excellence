const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { JSDOM, VirtualConsole } = require('../dom-runtime/node_modules/jsdom');

const root = path.resolve(__dirname, '..');
const legacy = JSON.parse(fs.readFileSync(path.join(root, 'eval-design/inputs/story-break/sample-storage.json'), 'utf8'));
const contract = {
  r01: { reader: 'reader-view', text: 'reader-text', shelf: 'shelf-tab', remove: 'remove', archived: '#bin-toggle', write: 'write-tab' },
  r02: { reader: 'reader', text: 'reader-text', shelf: 'shelf-nav', remove: 'remove-story', write: 'write-nav' },
  r03: { reader: 'read-view', text: 'read-text', shelf: 'nav-library', remove: 'remove-story', archived: '[data-shelf="removed"]', write: 'nav-write' }
};
const draftKey = 'storybreak.draft.v1';
const storiesKey = 'storybreak.stories.v1';
const records = [];

function boot(run, stored = {}) {
  const errors = [];
  const console = new VirtualConsole();
  console.on('jsdomError', error => errors.push(error.message));
  const dom = new JSDOM(fs.readFileSync(path.join(root, 'local-work', run, 'index.html'), 'utf8'), {
    url: 'https://synthetic.invalid/', runScripts: 'dangerously', pretendToBeVisual: true,
    virtualConsole: console,
    beforeParse(window) {
      for (const [key, value] of Object.entries(stored)) window.localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
      window.scrollTo = () => {};
      window.HTMLElement.prototype.scrollIntoView = () => {};
      window.HTMLDialogElement.prototype.showModal = function () { this.open = true; };
      window.HTMLDialogElement.prototype.close = function () { this.open = false; this.dispatchEvent(new window.Event('close')); };
      window.URL.createObjectURL = () => 'blob:synthetic';
      window.URL.revokeObjectURL = () => {};
    }
  });
  return { dom, window: dom.window, document: dom.window.document, errors };
}

function snapshot(session) {
  const storage = session.window.localStorage;
  return Object.fromEntries(Array.from({ length: storage.length }, (_, i) => storage.key(i)).map(key => [key, storage.getItem(key)]));
}

function input(session, id, value) {
  const control = session.document.getElementById(id);
  assert(control, `Missing ${id}`);
  control.value = value;
  control.dispatchEvent(new session.window.Event('input', { bubbles: true }));
}

function click(session, selector) {
  const control = session.document.querySelector(selector);
  assert(control, `Missing ${selector}`);
  control.click();
}

function data(session, key) { return JSON.parse(session.window.localStorage.getItem(key)); }
function allStored(session) { return Object.values(snapshot(session)).join('\n'); }

for (const [run, selectors] of Object.entries(contract)) {
  const checks = [];
  const test = (name, execute) => {
    try { execute(); checks.push({ name, status: 'pass' }); }
    catch (error) { checks.push({ name, status: 'fail', error: error.message }); }
  };
  let s = boot(run);
  test('Fresh startup executes without runtime errors and has an editable story', () => {
    assert.deepEqual(s.errors, []); assert(s.document.querySelector('#text'));
    assert.equal((data(s, storiesKey) || []).length, 0);
  });
  const story = 'A fox found a silver key.\nIt opened a cloud. “Come in,” said the rain.\nThe fox kept the key & went home.';
  test('Typed draft and title persist exactly', () => {
    input(s, 'text', story); input(s, 'title', 'The cloud & the key');
    assert.equal(data(s, draftKey).text, story); assert.equal(data(s, draftKey).title, 'The cloud & the key');
  });
  test('Changing only the place preserves the other prompts and writing', () => {
    const before = data(s, draftKey); click(s, '[data-swap="place"]'); const after = data(s, draftKey);
    assert.notEqual(after.prompt.place, before.prompt.place);
    assert.equal(after.prompt.character, before.prompt.character);
    assert.equal(after.prompt.trouble, before.prompt.trouble); assert.equal(after.text, story);
  });
  test('Finish saves exact content and opens its reading state', () => {
    click(s, '#finish'); assert(data(s, storiesKey).some(item => item.text === story));
    assert.equal(s.document.getElementById(selectors.reader).hidden, false);
    assert.equal(s.document.getElementById(selectors.text).textContent, story);
  });
  test('Starting another story preserves an unfinished ending through a reload', () => {
    click(s, '#' + selectors.write); input(s, 'text', story + '\nAn unfinished ending'); click(s, '#new');
    const saved = snapshot(s); assert(Object.values(saved).some(value => value.includes('An unfinished ending')));
    s.dom.window.close(); s = boot(run, saved); assert(allStored(s).includes('An unfinished ending'));
  });
  test('Storage failure does not clear the working draft on New story', () => {
    const original = s.window.Storage.prototype.setItem;
    s.window.Storage.prototype.setItem = () => { throw new s.window.DOMException('Storage full', 'QuotaExceededError'); };
    input(s, 'text', 'Keep this unfinished story safe.'); click(s, '#new');
    assert.equal(s.document.getElementById('text').value, 'Keep this unfinished story safe.');
    s.window.Storage.prototype.setItem = original;
  });
  s.dom.window.close(); s = boot(run, legacy);
  test('Legacy draft and out-of-deck prompts remain exact', () => {
    assert.equal(s.document.getElementById('text').value, legacy[draftKey].text);
    for (const [key, value] of Object.entries(legacy[draftKey].prompt)) assert.equal(s.document.getElementById(key).textContent, value);
  });
  test('Both legacy stories remain readable without replacing the current draft', () => {
    for (const old of legacy[storiesKey]) {
      click(s, '#' + selectors.shelf);
      const article = [...s.document.querySelectorAll('#library article, #library > button')].find(element => element.textContent.includes(old.title));
      assert(article, `Missing story ${old.title}`);
      const open = article.matches('button') ? article : [...article.querySelectorAll('button')].find(button => /read|open/i.test(button.textContent));
      assert(open, 'Missing open/read control'); open.click();
      assert.equal(s.document.getElementById(selectors.text).textContent, old.text);
      assert.equal(s.document.getElementById('text').value, legacy[draftKey].text);
    }
  });
  test('Removal retains the complete story and persists through reload', () => {
    click(s, '#' + selectors.remove);
    const saved = snapshot(s); const record = data(s, storiesKey).find(item => item.id === 'legacy-moon-002');
    assert(record); assert.equal(record.text, legacy[storiesKey][1].text);
    assert(record.trashedAt || record.removedAt || record.deletedAt, 'No recoverable-removal marker');
    s.dom.window.close(); s = boot(run, saved);
    assert.equal(data(s, storiesKey).find(item => item.id === record.id).text, record.text);
  });
  test('No unexpected script errors occurred during the matched flow', () => assert.deepEqual(s.errors, []));
  s.dom.window.close();
  records.push({ run, checks });
}

const report = {
  runtime: process.version, dom: require('../dom-runtime/node_modules/jsdom/package.json').version,
  method: 'Actual DOM parsing and application-script execution in jsdom, using the same user actions and data across arms. No external resource loading. Scroll and dialog rendering are stubbed. Storage is snapshotted between DOM instances.',
  limits: 'Not a browser, layout, file:// storage, native keyboard traversal, download, or real-user test. The suite checks selected behaviors, not all possible states.',
  records
};
fs.writeFileSync(path.join(__dirname, 'common-dom-results.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
if (records.some(record => record.checks.some(check => check.status === 'fail'))) process.exitCode = 1;
