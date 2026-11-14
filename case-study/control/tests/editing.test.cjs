const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const context = vm.createContext({$: () => ({})});
for (const filename of ['CSVParser.js', 'DataGridRenderer.js', 'converter.js']) {
  vm.runInContext(fs.readFileSync('js/' + filename, 'utf8'), context, {filename});
}
const parser = context.CSVParser;
const parse = (input, headers = true, delimiter = 'comma', decimal = 'dot') => parser.parse(input, headers, delimiter, false, false, decimal);
let checks = 0;
function check(name, run) {
  run();
  checks++;
  console.log('PASS ' + name);
}
check('quoted fields, escaped quotes, embedded lines and empty quoted cells', () => {
  const result = parse('name,note\r\nA,"one\nline"\r\nB,"say ""hello"""\r\nC,""\r\n');
  assert.equal(result.errors, '');
  assert.equal(result.dataGrid.length, 3);
  assert.equal(result.dataGrid[0][1], 'one\\nline');
  assert.equal(result.dataGrid[1][1], 'say "hello"');
  assert.equal(result.dataGrid[2][1], '');
});
check('unfinished quotes and invalid quote boundaries are actionable', () => {
  assert.match(parse('name,note\nA,"unfinished').errors, /Row 2: missing closing quote/);
  assert.match(parse('name,note\nA,"done"oops').errors, /unexpected text/);
  assert.match(parse('name,note\nA,un"quoted').errors, /unquoted field/);
});
check('too few and too many columns identify source rows', () => {
  assert.match(parse('a,b\n1').errors, /Row 2: expected 2 columns, found 1/);
  assert.match(parse('a,b\n1,2,3').errors, /Row 2: expected 2 columns, found 3/);
  assert.match(parse('a,b\n1', false).errors, /Row 2:/);
});
check('errors do not persist after repair', () => {
  parse('a,b\n1');
  assert.equal(parse('a,b\n1,2').errors, '');
});
check('tab delimiter, no headers and header transforms remain available', () => {
  const result = parse('North\t4\nSouth\t8', false, 'tab');
  assert.equal(result.errors, '');
  assert.equal(result.headerNames[0], 'val0');
  assert.equal(parser.parse('Name\tValue\nA\t2', true, 'tab', true, false, 'dot').headerNames[0], 'name');
  assert.equal(parser.parse('Name\tValue\nA\t2', true, 'tab', false, true, 'dot').headerNames[0], 'NAME');
});
check('decimal setting is respected', () => {
  assert.equal(parse('name\tvalue\nA\t1,25', true, 'tab', 'dot').dataGrid[0][1], '1,25');
  assert.equal(parse('name\tvalue\nA\t1,25', true, 'tab', 'comma').dataGrid[0][1], '1.25');
});
check('empty and blank input parsing terminates', () => {
  for (const input of ['', '\n', '\r\n', '""', 'a,b\n']) assert.equal(typeof parse(input).errors, 'string');
});
function element(initial = '') {
  return {
    value: initial,
    attributes: {},
    val(value) { if (arguments.length) {this.value = value; return this;} return this.value; },
    text(value) {this.value = value; return this;},
    attr(name, value) {this.attributes[name] = value; return this;}
  };
}
const converter = new context.DataConverter('converter');
converter.inputTextArea = element();
converter.outputTextArea = element();
converter.status = element();
converter.delimiter = 'comma';
converter.decimal = 'dot';
converter.downcaseHeaders = false;
function convert(input) {
  converter.inputTextArea.val(input);
  converter.convert();
}
check('valid → incomplete → repaired retains output and source while explaining stale state', () => {
  convert('name,value\nA,2');
  const valid = converter.outputTextArea.val();
  assert.deepEqual(JSON.parse(valid), [{name: 'A', value: 2}]);
  convert('name,value\nA,"');
  assert.equal(converter.outputTextArea.val(), valid);
  assert.equal(converter.inputTextArea.val(), 'name,value\nA,"');
  assert.match(converter.status.value, /previous output, not the current input or settings/);
  assert.equal(converter.inputTextArea.attributes['aria-invalid'], 'true');
  convert('name,value\nA,3');
  assert.deepEqual(JSON.parse(converter.outputTextArea.val()), [{name: 'A', value: 3}]);
  assert.equal(converter.inputTextArea.attributes['aria-invalid'], 'false');
});
check('ragged rows never mix diagnostics into output', () => {
  const before = converter.outputTextArea.val();
  convert('name,value\nA');
  assert.equal(converter.outputTextArea.val(), before);
  assert.match(converter.status.value, /expected 2 columns/);
});
check('all fourteen existing formats still convert a rectangular fixture', () => {
  for (const format of converter.outputDataTypes) {
    converter.outputDataType = format.id;
    convert('name,value\nA,2\nB,3');
    assert.equal(converter.status.attributes['data-state'], 'ready', format.id);
    assert.ok(converter.outputTextArea.val().length, format.id);
  }
  assert.equal(converter.outputDataTypes.length, 14);
});
check('format and settings changes do not replace output while input is invalid', () => {
  const before = converter.outputTextArea.val();
  converter.outputDataType = 'json';
  converter.decimal = 'comma';
  convert('name,value\nA');
  assert.equal(converter.outputTextArea.val(), before);
  converter.delimiter = 'tab';
  convert('name\tvalue\nA\t1,25');
  assert.deepEqual(JSON.parse(converter.outputTextArea.val()), [{name: 'A', value: 1.25}]);
});
check('renderer failure preserves input and previous result', () => {
  const before = converter.outputTextArea.val();
  converter.outputDataType = 'missing';
  convert('name\tvalue\nA\t2');
  assert.equal(converter.outputTextArea.val(), before);
  assert.match(converter.status.value, /could not finish/);
  converter.outputDataType = 'json';
});
check('clearing input clears stale output', () => {
  convert('');
  assert.equal(converter.outputTextArea.val(), '');
  assert.equal(converter.status.attributes['data-state'], 'empty');
});
console.log(checks + ' checks passed; controller checks use simulated textarea/status objects, not a browser.');
