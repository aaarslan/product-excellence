const fs = require('fs');
const vm = require('vm');
const cases = [
 ['ordinary','name,amount\nAda,12'],
 ['quoted comma','name,note\nAda,"a,b"'],
 ['escaped quote','name,note\nAda,"a ""quote"""'],
 ['literal backslash','name,path\nAda,C:\\temp\\new'],
 ['multiline','name,note\nAda,"one\ntwo\nthree"'],
 ['auto TSV commas','name\tnote\nAda\ta,b,c,d'],
 ['missing quote','name,note\nAda,"unfinished'],
 ['uneven row','name,note\nAda,ok,extra'],
 ['duplicate headers','name,name\nAda,Lovelace'],
 ['large integer','id\n9007199254740993'],
 ['leading zero','id\n00123'],
 ['empty',''],
 ['decimal comma','name\tamount\nAda\t1,5',{delimiter:'tab',decimal:'comma'}],
 ['duplicate dictionary key','id,value\na,1\na,2',{outputDataType:'jsonDict'}]
];
let results = {};
for (const arm of ['x','y']) {
 const context = vm.createContext({});
 for(const file of ['CSVParser.js','DataGridRenderer.js','converter.js']) vm.runInContext(fs.readFileSync(`${arm}/${file}`,'utf8'),context,{timeout:1000});
 results[arm] = [];
 for(const [label,input,settings={}] of cases){
 context.input = input; context.settings = settings;
 const result = vm.runInContext(`
 function field(value) { return {value:value, attrs:{}, val:function(v){if(arguments.length){this.value=v;return this;}return this.value;},text:function(v){this.value=v;return this;},attr:function(k,v){this.attrs[k]=v;return this;}}; }
 var instance = Object.create(DataConverter.prototype);
 Object.assign(instance,{inputTextArea:field('name,amount\\nAda,12'),outputTextArea:field(''),status:field(''),dataSelect:{find:function(){return {text:function(){return 'Selected format';}}}},outputDataType:'json',headersProvided:true,delimiter:'auto',decimal:'dot',downcaseHeaders:false,upcaseHeaders:false,includeWhiteSpace:true,indent:'  ',outputText:''});
 instance.convert();
 Object.assign(instance,settings);
 instance.inputTextArea.value=input;
 instance.convert();
 ({output:instance.outputTextArea.value,status:instance.status.value,inputPreserved:instance.inputTextArea.value===input});`,context,{timeout:1000});
 try { result.decoded = JSON.parse(result.output); result.validJSON=true; }catch { result.validJSON=false; }
 results[arm].push({label,...result});
 }
}
fs.writeFileSync('independent-results.json',JSON.stringify(results,null,2));
console.log(JSON.stringify(results,null,2));
