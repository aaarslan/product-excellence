const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const context = { $: () => ({}) };
vm.createContext(context);
for (const file of ['CSVParser.js', 'DataGridRenderer.js', 'converter.js']) {
  vm.runInContext(fs.readFileSync('js/' + file, 'utf8'), context);
}
const parser = context.CSVParser;
const parse = (input, delimiter = 'auto', decimal = 'dot') => parser.parse(input, true, delimiter, false, false, decimal, true);
let count = 0;
function test(name, check) {
  check();
  count++;
  console.log('PASS ' + name);
}
function field(initial = '') {
  return { value: initial, val(value) { if (arguments.length) { this.value = value; return this; } return this.value; }, text(value) { this.value = value; return this; }, attr() { return this; } };
}
function converter() {
  const d = new context.DataConverter('test');
  d.inputTextArea = field();
  d.outputTextArea = field();
  d.status = field();
  d.dataSelect = { find: () => ({text: () => d.outputDataType}) };
  d.downcaseHeaders = false;
  return d;
}
test('quoted and empty cells, escaped quotes, CRLF, trailing newline', () => {
  const result = parse('name,note,empty\r\nA,"hello ""friend""",\r\nB,"",x\r\n');
  assert.equal(result.dataGrid[0][1], 'hello "friend"');
  assert.equal(result.dataGrid[0][2], '');
  assert.equal(result.dataGrid[1][1], '');
  assert.equal(result.dataGrid.length, 2);
});
test('first empty cell preserved', () => assert.equal(parse('a,b\n,x').dataGrid[0][0], ''));
test('quoted newlines retained', () => assert.equal(parse('a,b\n"one\ntwo",x').dataGrid[0][0], 'one\ntwo'));
test('quoted delimiters do not override TSV auto detection', () => assert.equal(parse('name\tnote\nA\t"one,two,three,four"').headerNames.length, 2));
test('invalid structures have actionable errors', () => {
  for (const input of ['a,b\nA', 'a,b\nA,B,C', 'a,b\n"unfinished,B', 'a,b\n"A"x,B', 'a,b\nA"x,B']) {
    assert.throws(() => parse(input), /Row 2/);
  }
});
test('decimal selection is respected', () => {
  assert.equal(parse('v\n"1,25"', 'comma', 'dot').dataGrid[0][0], '1,25');
  assert.equal(parse('v\n"1,25"', 'comma', 'comma').dataGrid[0][0], '1.25');
});
test('editing interruption keeps input and last good output; recovery and clearing', () => {
  const d = converter();
  d.inputTextArea.val('name,count\nA,2'); d.convert();
  const good = d.outputTextArea.val();
  assert.equal(JSON.parse(good)[0].count, 2);
  d.inputTextArea.val('name,count\n"A'); d.convert();
  assert.equal(d.inputTextArea.val(), 'name,count\n"A');
  assert.equal(d.outputTextArea.val(), good);
  assert.match(d.status.value, /last successful json conversion/);
  d.outputDataType = 'html'; d.convert();
  assert.match(d.status.value, /not the current input\/settings/);
  d.inputTextArea.val('name,count\nB,3'); d.convert();
  assert.match(d.outputTextArea.val(), /<table>/);
  d.inputTextArea.val(''); d.convert();
  assert.equal(d.outputTextArea.val(), '');
  assert.match(d.status.value, /Paste/);
});
test('all JSON formats produce valid strings preserving literal slashes and control characters', () => {
  const d = converter();
  d.inputTextArea.val('name,note\nA,"a ""quote"" and \\n and\nnewline"');
  for (const type of ['json', 'jsonArrayCols', 'jsonArrayRows', 'jsonDict']) {
    d.outputDataType = type; d.convert();
    const result = JSON.parse(d.outputTextArea.val());
    const value = type === 'json' ? result[0].note : type === 'jsonArrayCols' ? result.note[0] : type === 'jsonArrayRows' ? result[0][1] : result.A;
    assert.equal(value, 'a "quote" and \\n and\nnewline');
  }
});
test('duplicate transformed headers and dictionary keys do not silently lose values', () => {
  const d = converter(); d.downcaseHeaders = true;
  d.inputTextArea.val('Name,NAME\nA,B'); d.convert();
  assert.match(d.status.value, /Duplicate header/);
  d.outputDataType = 'jsonArrayRows'; d.convert();
  assert.equal(JSON.parse(d.outputTextArea.val())[0].length, 2);
  d.outputDataType = 'jsonDict'; d.inputTextArea.val('name,note\nA,one\nA,two'); d.convert();
  assert.match(d.status.value, /Duplicate dictionary key/);
});
test('formats, header settings, whitespace, empty rows and numeric blanks', () => {
  const d = converter();
  d.inputTextArea.val('name,count\nA,2\nB,3');
  for (const format of d.outputDataTypes) {
    d.outputDataType = format.id; d.convert();
    assert.match(d.status.value, /Converted 2 rows/);
    assert.ok(d.outputTextArea.val().length);
  }
  d.outputDataType = 'json'; d.headersProvided = false; d.inputTextArea.val('A,2'); d.convert();
  assert.equal(JSON.parse(d.outputTextArea.val())[0].val1, 2);
  d.includeWhiteSpace = false; d.convert(); assert.ok(!d.outputTextArea.val().includes('\n'));
  d.includeWhiteSpace = true; d.indent = '\t'; d.convert(); assert.ok(d.outputTextArea.val().includes('\t'));
  d.headersProvided = true; d.upcaseHeaders = true; d.inputTextArea.val('name\nA'); d.convert();
  assert.equal(JSON.parse(d.outputTextArea.val())[0].NAME, 'A');
  d.inputTextArea.val('a,b'); d.convert(); assert.equal(d.outputTextArea.val(), '[]');
  d.inputTextArea.val('a,b\n,'); d.convert(); assert.equal(JSON.parse(d.outputTextArea.val())[0].A, null);
});
test('source event uses input for paste, undo, and delete', () => {
  assert.match(fs.readFileSync('js/converter.js', 'utf8'), /bind\("input", function\(\) \{self.convert\(\)\}\)/);
});
console.log(count + ' checks passed');
