//
//  converter.js
//  Mr-Data-Converter
//
//  Created by Shan Carter on 2010-09-01.
//



function DataConverter(nodeId) {

  //---------------------------------------
  // PUBLIC PROPERTIES
  //---------------------------------------

  this.nodeId                 = nodeId;
  this.node                   = $("#"+nodeId);

  this.outputDataTypes        = [
                                {"text":"Actionscript",           "id":"as",               "notes":""},
                                {"text":"ASP/VBScript",           "id":"asp",              "notes":""},
                                {"text":"HTML",                   "id":"html",             "notes":""},
                                {"text":"JSON - Properties",      "id":"json",             "notes":""},
                                {"text":"JSON - Column Arrays",   "id":"jsonArrayCols",    "notes":""},
                                {"text":"JSON - Row Arrays",      "id":"jsonArrayRows",    "notes":""},
                                {"text":"JSON - Dictionary",      "id":"jsonDict",         "notes":""},
                                {"text":"MySQL",                  "id":"mysql",            "notes":""},
                                {"text":"PHP",                    "id":"php",              "notes":""},
                                {"text":"Python - Dict",          "id":"python",           "notes":""},
                                {"text":"Ruby",                   "id":"ruby",             "notes":""},
                                {"text":"XML - Properties",       "id":"xmlProperties",    "notes":""},
                                {"text":"XML - Nodes",            "id":"xml",              "notes":""},
                                {"text":"XML - Illustrator",      "id":"xmlIllustrator",   "notes":""}];
  this.outputDataType         = "json";

  this.columnDelimiter        = "\t";
  this.rowDelimiter           = "\n";

  this.inputTextArea          = {};
  this.outputTextArea         = {};

  this.inputHeader            = {};
  this.outputHeader           = {};
  this.dataSelect             = {};

  this.inputText              = "";
  this.outputText             = "";

  this.newLine                = "\n";
  this.indent                 = "  ";

  this.commentLine            = "//";
  this.commentLineEnd         = "";
  this.tableName              = "MrDataConverter"

  this.useUnderscores         = true;
  this.headersProvided        = true;
  this.downcaseHeaders        = true;
  this.upcaseHeaders          = false;
  this.includeWhiteSpace      = true;
  this.useTabsForIndent       = false;

}

//---------------------------------------
// PUBLIC METHODS
//---------------------------------------

DataConverter.prototype.create = function(w,h) {
  var self = this;

  //build HTML for converter
  this.inputHeader = $('<div class="groupHeader" id="inputHeader"><p class="groupHeadline">Input CSV or tab-delimited data. <span class="subhead"> Using Excel? Simply copy and paste. No data on hand? <a href="#" id="insertSample">Use sample</a></span></p></div>');
  this.inputTextArea = $('<textarea class="textInputs" id="dataInput" aria-label="Spreadsheet input" aria-describedby="conversionStatus"></textarea>');
  var outputHeaderText = '<div class="groupHeader" id="outputHeader"><p class="groupHeadline"><label for="dataSelector">Output as</label> <select name="Data Types" id="dataSelector" >';
    for (var i=0; i < this.outputDataTypes.length; i++) {

      outputHeaderText += '<option value="'+this.outputDataTypes[i]["id"]+'" '
              + (this.outputDataTypes[i]["id"] == this.outputDataType ? 'selected="selected"' : '')
              + '>'
              + this.outputDataTypes[i]["text"]+'</option>';
    };
    outputHeaderText += '</select><span class="subhead" id="outputNotes"></span></p></div>';
  this.outputHeader = $(outputHeaderText);
  this.outputTextArea = $('<textarea class="textInputs" id="dataOutput" aria-label="Converted output" aria-describedby="conversionStatus" readonly></textarea>');

  this.node.append(this.inputHeader);
  this.node.append(this.inputTextArea);
  this.node.append(this.outputHeader);
  this.node.append(this.outputTextArea);
  this.status = $('<p id="conversionStatus" role="status" aria-live="polite"></p>');
  this.node.append(this.status);

  this.dataSelect = this.outputHeader.find("#dataSelector");


  //add event listeners

  // $("#convertButton").bind('click',function(evt){
  //   evt.preventDefault();
  //   self.convert();
  // });

  this.outputTextArea.click(function(evt){this.select();});


  $("#insertSample").bind('click',function(evt){
    evt.preventDefault();
    self.insertSampleData();
    self.convert();
    _gaq.push(['_trackEvent', 'SampleData','InsertGeneric']);
  });

  $("#dataInput").bind("input", function() {self.convert()});
  $("#dataInput").change(function() {
    self.convert();
    _gaq.push(['_trackEvent', 'DataType',self.outputDataType]);
  });

  $("#dataSelector").bind('change',function(evt){
       self.outputDataType = $(this).val();
       self.convert();
     });

  this.resize(w,h);
}

DataConverter.prototype.resize = function(w,h) {

  var paneWidth = w;
  var paneHeight = Math.max(120, (h-160)/2-20);

  this.node.css({width:paneWidth});
  this.inputTextArea.css({width:paneWidth-20,height:paneHeight});
  this.outputTextArea.css({width: paneWidth-20, height:paneHeight});

}

DataConverter.prototype.convert = function() {

  this.inputText = this.inputTextArea.val();
  //make sure there is input data before converting...
  if (!this.inputText.length) {
    this.outputText = "";
    this.lastFormat = "";
    this.outputTextArea.val("");
    this.status.text("Paste CSV or spreadsheet cells to begin.").attr("class", "");
    return;
  }; //end test for existence of input text
  try {
    var jsonOutput = this.outputDataType.indexOf("json") === 0;
    CSVParser.resetLog();
    var parsed = CSVParser.parse(this.inputText, this.headersProvided, this.delimiter, this.downcaseHeaders, this.upcaseHeaders, this.decimal, jsonOutput);
    var indent = this.includeWhiteSpace ? this.indent : "";
    var newLine;
    if (this.includeWhiteSpace) {
      newLine = "\n";
      // console.log("yes")
    } else {
      newLine = "";
      // console.log("no")
    }
    var result = jsonOutput ? this.renderJSON(parsed, indent) : DataGridRenderer[this.outputDataType](parsed.dataGrid, parsed.headerNames, parsed.headerTypes, indent, newLine);
    this.outputText = result;
    this.lastFormat = this.dataSelect.find("option:selected").text();
    this.outputTextArea.val(result);
    this.status.text("Converted " + parsed.dataGrid.length + " rows, " + parsed.headerNames.length + " columns. Select the output to copy.").attr("class", "");
  } catch (error) {
    this.status.text(error.message + (this.outputText ? " Output is unchanged: last successful " + this.lastFormat + " conversion, not the current input/settings." : " No output yet. Your input is kept; correct it to continue.")).attr("class", "conversionError");
  }

}


DataConverter.prototype.renderJSON = function(parsed, indent) {
  var rows = parsed.dataGrid, headers = parsed.headerNames, types = parsed.headerTypes;
  var result = [], keys = Object.create(null);
  var type = this.outputDataType;
  if (type !== "jsonArrayRows") {
    for (var h = 0; h < headers.length; h++) {
      if (keys[headers[h]]) { throw new Error("Duplicate header: " + headers[h] + ". Give each column a unique name or choose JSON - Row Arrays."); }
      keys[headers[h]] = true;
    }
  }
  if (type === "jsonArrayCols" || type === "jsonDict") { result = Object.create(null); }
  for (var c = 0; c < headers.length; c++) {
    if (type === "jsonArrayCols") { result[headers[c]] = []; }
  }
  for (var r = 0; r < rows.length; r++) {
    var row = type === "jsonArrayRows" ? [] : Object.create(null);
    for (var c = 0; c < headers.length; c++) {
      var value = rows[r][c];
      if (types[c] === "int" || types[c] === "float") {
        value = value.trim() === "" ? null : (isFinite(Number(value)) ? Number(value) : value);
      }
      if (type === "jsonArrayRows") { row.push(value); }
      else { row[headers[c]] = value; }
      if (type === "jsonArrayCols") { result[headers[c]].push(value); }
    }
    if (type === "jsonDict") {
      var key = rows[r][0];
      if (Object.prototype.hasOwnProperty.call(result, key)) { throw new Error("Duplicate dictionary key in row " + (r + (this.headersProvided ? 2 : 1)) + ". Make first-column values unique or choose another JSON format."); }
      delete row[headers[0]];
      result[key] = headers.length === 2 ? row[headers[1]] : row;
    } else if (type !== "jsonArrayCols") { result.push(row); }
  }
  return JSON.stringify(result, null, indent);
}

DataConverter.prototype.insertSampleData = function() {
  this.inputTextArea.val("NAME\tVALUE\tCOLOR\tDATE\nAlan\t12\tblue\tSep. 25, 2009\nShan\t13\t\"green\tblue\"\tSep. 27, 2009\nJohn\t45\torange\tSep. 29, 2009\nMinna\t27\tteal\tSep. 30, 2009");
}



