const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const cases = [
  {name:'ordinary',input:'name,qty\nA,1',kind:'valid'},
  {name:'tab with quoted comma',input:'name\tqty\n"A,B"\t1',kind:'valid'},
  {name:'escaped quote',input:'name,qty\n"A""B",1',kind:'valid'},
  {name:'quoted newline',input:'name,qty\n"A\nB",1',kind:'valid'},
  {name:'empty quoted field',input:'name,qty\n"",1',kind:'valid'},
  {name:'lone quote',input:'"',kind:'invalid'},
  {name:'unfinished row quote',input:'name,qty\n"open,1',kind:'invalid'},
  {name:'trailing text after quote',input:'name,qty\n"A"junk,1',kind:'invalid'},
  {name:'bare quote in field',input:'name,qty\nA"B,1',kind:'invalid'},
  {name:'short row',input:'name,qty\nA',kind:'invalid'},
  {name:'long row',input:'name,qty\nA,1,extra',kind:'invalid'},
  {name:'CRLF',input:'name,qty\r\nA,1\r\n',kind:'valid'},
  {name:'all strings',input:'name,status\nA,ready\nB,done',kind:'valid'},
  {name:'numeric comma mode',input:'name\tqty\nA\t1,5',kind:'valid',delimiter:'tab',decimal:'comma'},
  {name:'comma text in dot mode',input:'name\tqty\nA\t1,5',kind:'valid',delimiter:'tab',decimal:'dot'},
  {name:'headers only',input:'name,qty',kind:'valid'},
  {name:'BOM paste',input:'\ufeffname,qty\nA,1',kind:'valid'},
  {name:'trailing empty field',input:'name,qty\nA,',kind:'valid'}
];
const results=[];
for(const arm of process.argv.slice(2)){
  for(const test of cases){
    const context=vm.createContext({});
    vm.runInContext(fs.readFileSync(path.join(arm,'js/CSVParser.js'),'utf8'),context);
    vm.runInContext(fs.readFileSync(path.join(arm,'js/DataGridRenderer.js'),'utf8'),context);
    try{
      const expr='CSVParser.parse('+JSON.stringify(test.input)+',true,'+JSON.stringify(test.delimiter||'comma')+',false,false,'+JSON.stringify(test.decimal||'dot')+')';
      const value=vm.runInContext(expr,context,{timeout:100});
      results.push({arm:path.basename(arm),case:test.name,kind:test.kind,result:JSON.parse(JSON.stringify(value))});
    }catch(error){results.push({arm:path.basename(arm),case:test.name,kind:test.kind,error:error.message});}
  }
}
process.stdout.write(JSON.stringify(results,null,2)+'\n');
