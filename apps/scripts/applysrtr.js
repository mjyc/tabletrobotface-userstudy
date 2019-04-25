#!/usr/bin/env node

var fs = require('fs');
var spawn = require('child_process').spawn;
var js2smt2 = require('js2smt2');
var srtr = require('srtr');

var transitionFilename = process.argv[2];
var parametersFilename = process.argv[3];
var dataFilename = process.argv[4];
var correctionsFilename = process.argv[5];

if (
  !transitionFilename
  || !dataFilename
  || !parametersFilename
  || !correctionsFilename
) {
  console.log('usage: ./prepannotating {studyID} {dataFilename}');
  process.exit(1);
}


var transitionStr = fs.readFileSync(transitionFilename)
  .toString().replace('export ', '');
var parametersJSON = JSON.parse(fs.readFileSync(parametersFilename));
var tracesJSON = JSON.parse(fs.readFileSync(dataFilename)).trace;
var correctionsJSON = JSON.parse(fs.readFileSync(correctionsFilename));
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
    });
    node.argument = node.argument.properties[0].value;
  }
  return node;
});

var paramMap = parametersJSON;

var traces = tracesJSON.map(function (t) {
  return {
    timestamp: t.value.stateStamped.stamp,
    trace: {
      state: t.value.stateStamped.state,
      inputD: t.value.input.discrete,
      inputC: t.value.input.continuous,
    },
  };
});
// console.log(traces);

var corrections = correctionsJSON.corrections.map(function(c) {
  return {
    // timestamp: c.stateStamped.stamp,
    timestamp: c.stamp,
    correction: c.correction,
  }
});

var options = settings.srtr.options;

// console.log('astToJS(transAst)', srtr.astToJS(transAst.body[0].body.body[0]));
// console.log(transAst.body[0].body.body[0])
var z3Input = srtr.createSRTRSMT2(transAst.body[0].body.body[0], paramMap, traces, corrections, options);
console.log(z3Input);

var p = spawn('z3', ['-T:5', '-smt2', '-in'], {stdio: ['pipe', 'pipe', 'ignore']});
p.stdout.on('data', function (data) {
  console.log(data.toString());
  if (!data.toString().startsWith("sat")) {
    var modelAst = srtr.sexpParser.parse(data.toString());
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

    // var newParams = Object.keys(prevParams).reduce(function(acc, v) {
    //   acc[v] = prevParams[v] + (!!deltas[v] ? deltas[v] : 0);
    //   return acc;
    // }, {});

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
