#!/usr/bin/env node

var fs = require('fs');
var spawn = require('child_process').spawn;
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

var z3Input = srtr.createSRTRSMT2(transAst, paramMap, traces, corrections, options);

var p = spawn('z3', ['-T:5', '-smt2', '-in'], {stdio: ['pipe', 'pipe', 'ignore']});
p.stdout.on('data', function (data) {
  console.log(data.toString());
  if (!data.toString().startsWith("sat")) {
    var modelAst = sexpParser.parse(data.toString());
    var deltas = modelAst.value.splice(1).reduce(function (acc, v) {
      if (
        v.type === 'Expression'
        && v.value[1].type === 'Atom' && v.value[1].value.type === 'Identifier'
        && /^delta_./.test(v.value[1].value.name)
        && v.value[4].type === 'Atom' && v.value[4].value.type === 'Literal'
      ) {
        acc[v.value[1].value.name] = v.value[4].value.value;
      }
      return acc;
    }, {});
    var weights = modelAst.value.splice(1).reduce(function (acc, v) {
      if (
        v.type === 'Expression'
        && v.value[1].type === 'Atom' && v.value[1].value.type === 'Identifier'
        && (/w[0-9]+/.test(v.value[1].value.name) || /^delta_./.test(v.value[1].value.name))
        && v.value[4].type === 'Atom' && v.value[4].value.type === 'Literal'
      ) {
        acc[v.value[1].value.name] = v.value[4].value.value;
      }
      return acc;
    }, {});
    console.log('deltas', deltas);
    console.log('weights', weights);

    var newParams = Object.keys(prevParams).reduce(function(acc, v) {
      acc[v] = prevParams[v] + (!!deltas[v] ? deltas[v] : 0);
      return acc;
    }, {});

    // // backup prev params
    // const prevParams = fs.readFileSync(parametersFilename);
    // fs.writeFileSync(
    //   parametersFilename.replace('.json', `${Date.now()}.json`),
    //   JSON.stringify(prevParams, null, 2),
    // );

    // // write new param
    // fs.writeFileSync(
    //   parametersFilename,
    //   JSON.stringify(newParams, null, 2),
    // );
  }
});
p.stdin.write(z3Input);
p.stdin.end();
