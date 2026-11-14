const fs = require('fs');
const vm = require('vm');
const results = {};
for (const arm of ['x','y']) {
 const context = vm.createContext({});
 for (const file of ['CSVParser.js','DataGridRenderer.js','converter.js']) vm.runInContext(fs.readFileSync(`${arm}/${file}`,'utf8'),context,{timeout:1000});
 results[arm] = vm.runInContext(`
 function field(value){return {value:value,val:function(v){if(arguments.length){this.value=v;return this;}return this.value;},text:function(v){this.value=v;return this;},attr:function(){return this;}};}
 var d=Object.create(DataConverter.prototype);
 Object.assign(d,{inputTextArea:field('NAME,AMOUNT\\nAda,12'),outputTextArea:field(''),status:field(''),dataSelect:{find:function(){return {text:function(){return 'JSON';}}}},outputDataType:'json',headersProvided:true,delimiter:'comma',decimal:'dot',downcaseHeaders:true,upcaseHeaders:false,includeWhiteSpace:true,indent:'  ',outputText:''});
 var states=[];
 d.convert(); states.push({step:'valid',output:d.outputText,status:d.status.value});
 d.inputTextArea.value='NAME,AMOUNT\\nAda,"12';d.convert();states.push({step:'incomplete',output:d.outputText,status:d.status.value});
 d.inputTextArea.value='NAME,AMOUNT\\nAda,"13"';d.convert();states.push({step:'recovered',output:d.outputText,status:d.status.value});
 var formats={};
 ['as','asp','html','json','jsonArrayCols','jsonArrayRows','jsonDict','mysql','php','python','ruby','xmlProperties','xml','xmlIllustrator'].forEach(function(format){d.outputDataType=format;d.convert();formats[format]={output:d.outputText,status:d.status.value};});
 ({states:states,formats:formats});`,context,{timeout:1000});
}
fs.writeFileSync('independent-sequence-results.json',JSON.stringify(results,null,2));
console.log(JSON.stringify(Object.fromEntries(Object.entries(results).map(([arm,result])=>[arm,{states:result.states,formats:Object.fromEntries(Object.entries(result.formats).map(([key,value])=>[key,value.status]))}])),null,2));
