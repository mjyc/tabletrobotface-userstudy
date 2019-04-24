#!/usr/bin/env node

var fs = require('fs');
var js2smt2 = require('js2smt2');
var srtr = require('srtr');

var transitionFilename = process.argv[2];
var parametersFilename = process.argv[3];
var correctionsFilename = process.argv[4];
// var settingsFilename = process.argv[5];

if (
  !transitionFilename
  || !parametersFilename
  || !correctionsFilename
  // || !settingsFilename
) {
  console.log('usage: ./prepannotating {studyID} {dataFilename}');
  process.exit(1);
}


var transitionStr = fs.readFileSync(transitionFilename)
  .toString().replace('export ', '');
var parametersJSON = JSON.parse(fs.readFileSync(parametersFilename));
var correctionsJSON = JSON.parse(fs.readFileSync(correctionsFilename));
// var settings = JSON.parse(fs.readFileSync(settingsFilename));
var settings = require('../settings_helper');


var transAstRaw = js2smt2.parser.parse(transitionStr);
// remove "outputs" field in ReturnStatements
var transAst = srtr.astMap(transAstRaw, function (leaf) {
  return leaf;
}, function (node) {
  if (
    node.type === 'ReturnStatement'
    && node.argument.type === 'ObjectExpression'
   ) {
    node.argument.properties = node.argument.properties.filter(function(p) {
      return !(p.key.type === 'Identifier' && p.key.name === 'outputs');
    })
  }
  return node;
});

var paramMap = parametersJSON;

var traces = [];

var corrections = [];
// correctionsJSON.corrections.map(function(c) {
//   return {
//     timestamp: c.stateStamped.stamp,
//     correction: c.correction,
//   }
// });

var options = settings.srtr.options;

const formula = srtr.srtr(transAst, paramMap, traces, corrections, options);

console.log(formula);
