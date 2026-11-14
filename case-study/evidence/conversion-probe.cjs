const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
function field(value=''){return {value,attributes:{},val(next){if(arguments.length){this.value=next;return this;}return this.value;},text(next){if(arguments.length){this.value=next;return this;}return this.value;},attr(name,next){if(arguments.length===2){this.attributes[name]=next;return this;}return this.attributes[name];}};}
const cases=[
{name:'plain JSON',input:'name,qty\nA,1',expected:[{name:'A',qty:1}]},
{name:'quoted text is valid JSON',input:'name,note\nA,"say ""hello"""',expected:[{name:'A',note:'say "hello"'}]},
{name:'backslash survives JSON',input:'name,path\nA,C:\\temp\\notes',expected:[{name:'A',path:'C:\\temp\\notes'}]},
{name:'multiline cell survives JSON',input:'name,note\nA,"one\ntwo"',expected:[{name:'A',note:'one\ntwo'}]},
{name:'incomplete quote after valid output',input:'name,qty\n"open,1',invalid:true},
{name:'empty clears output',input:'',empty:true},
{name:'ragged row',input:'name,qty\nA',invalid:true},
{name:'duplicate header does not silently lose cell',input:'name,name\nA,B',invalid:true},
{name:'repair',input:'name,qty\nB,2',expected:[{name:'B',qty:2}]}
];
const result=[];
for(const dir of process.argv.slice(2)){
 const context=vm.createContext({$:()=>({})});
 for(const f of ['CSVParser.js','DataGridRenderer.js','converter.js'])vm.runInContext(fs.readFileSync(path.join(dir,'js',f),'utf8'),context);
 const d=new context.DataConverter('test');d.inputTextArea=field();d.outputTextArea=field();d.status=field();d.dataSelect={find:()=>({text:()=>d.outputDataType})};d.downcaseHeaders=false;d.delimiter='comma';d.decimal='dot';context.d=d;
 for(const t of cases){d.inputTextArea.val(t.input);let exception;try{vm.runInContext('d.convert()',context,{timeout:100});}catch(e){exception=e.message;}
 let parsed,parseError;try{parsed=JSON.parse(d.outputTextArea.val());}catch(e){parseError=e.message;}
 const exact=t.expected?JSON.stringify(parsed)===JSON.stringify(t.expected):undefined;
 result.push({arm:path.basename(dir),case:t.name,input:t.input,output:d.outputTextArea.val(),status:d.status.value,inputPreserved:d.inputTextArea.val()===t.input,exception,parseError,exact,invalidExpected:t.invalid,emptyExpected:t.empty});
 }
}
process.stdout.write(JSON.stringify(result,null,2)+'\n');
