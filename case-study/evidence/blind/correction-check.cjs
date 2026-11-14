const fs=require('fs');
const vm=require('vm');
const assert=require('assert/strict');
const c=vm.createContext({});
for(const f of ['CSVParser','DataGridRenderer','converter'])vm.runInContext(fs.readFileSync('../../demonstrator/js/'+f+'.js','utf8'),c,{timeout:1000});
const cases=[
 {value:'9007199254740993',blocked:true},
 {value:'-9007199254740993',blocked:true},
 {value:'0.100000000000000005',blocked:true},
 {value:'123456789.123456789',blocked:true},
 {value:'0.000000000000000000000000000000001',expected:1e-33},
 {value:'1e-324',blocked:true},
 {value:'4e-324',blocked:true},
 {value:'5e-324',expected:5e-324},
 {value:'-0',blocked:true},
 {value:'00123',expected:123},
 {value:'000.12500',expected:0.125},
 {value:' 42 ',expected:42},
 {value:'9007199254740993',text:true,expected:'9007199254740993'},
 {value:'00123',text:true,expected:'00123'},
 {value:' 42 ',text:true,expected:' 42 '},
 {value:'',text:true,expected:''},
 {value:'1,234567890123456789',text:true,expected:'1,234567890123456789',decimal:'comma'},
 {value:'a\n\tb\\c"d',text:true,expected:'a\n\tb\\c"d'},
 {value:' 00123\r\n ',text:true,expected:' 00123\r\n '}
];
const results=[];
for(const item of cases){
 c.item=item;
 const result=vm.runInContext(`
 function field(v){return {value:v,val:function(v){if(arguments.length){this.value=v;return this;}return this.value;},text:function(v){this.value=v;return this;},attr:function(){return this;}};}
 var d=Object.create(DataConverter.prototype);
 Object.assign(d,{inputTextArea:field('key,value\\nA,2'),outputTextArea:field(''),status:field(''),dataSelect:{find:function(){return {text:function(){return 'json';}}}},outputDataType:'json',headersProvided:true,delimiter:'comma',decimal:item.decimal||'dot',downcaseHeaders:false,upcaseHeaders:false,includeWhiteSpace:false,indent:'  ',outputText:''});
 d.convert();var prior=d.outputText;
 d.jsonValuesAsText=!!item.text;
 d.inputTextArea.value='key,value\\nA,"'+item.value.replace(/"/g,'""')+'"';d.convert();
 ({output:d.outputText,status:d.status.value,prior:prior});`,c,{timeout:1000});
 if(item.blocked){assert.equal(result.output,result.prior);assert.match(result.status,/this value cannot be represented safely in numeric JSON mode/);}
 else {assert.match(result.status,/Converted/);assert.equal(JSON.parse(result.output)[0].value,item.expected);}
 results.push({case:item,...result});
}
fs.writeFileSync('correction-check-results.json',JSON.stringify(results,null,2));
console.log(cases.length+' independent precision/text cases passed');
