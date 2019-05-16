#!/usr/bin/env node

var fs = require('fs');
var spawn = require('child_process').spawn;
var log = require('loglevel-debug')('applysrtr');
var js2smt2 = require('z3js');
var srtr = require('srtr');


var studyID = process.argv[2];
if (!studyID) {
  log.log('usage: ./applysrtr {studyID}');
  process.exit(1);
}


var studyJSON = require('../data/studies/' + studyID + '.json')
var transitionFilename = './apps/robot/src/transitions/' + studyJSON.settings.robot.name + '.js';
var parametersFilename = './apps/data/parameters/' + studyJSON.settings.robot.name + '.json';
var dataFilename = './apps/data/' + studyJSON.settings.dataplayer.fileprefix + '.json';
var correctionsFilename = studyJSON.correctionsFilename;
log.debug('transitionFilename', transitionFilename);
log.debug('dataFilename', dataFilename);
log.debug('parametersFilename', parametersFilename);
log.debug('correctionsFilename', correctionsFilename);


// // Load data
var transitionStr = fs.readFileSync(transitionFilename)
  .toString().replace('export ', '');
var parametersJSON = JSON.parse(fs.readFileSync(parametersFilename));
var tracesJSON = JSON.parse(fs.readFileSync(dataFilename)).trace;
var correctionsJSON = JSON.parse(fs.readFileSync(correctionsFilename));
var settings = require('../settings_helper');


// Prepare inputs
var transAstRaw = js2smt2.jsParser.parse(transitionStr);
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
// transAst: Program
// transAst.body[0]: FunctionDeclaration
// transAst.body[0].body: BlockStatement
// transAst.body[0].body.body[n]: IfStatement <-
var transAstIfStatement = transAst.body[0].body.body.filter(function(b) {
  return b.type === 'IfStatement';
})[0];  // must contain at least one IfStatemenet
log.debug('transAstIfStatement', srtr.astToJS(transAstIfStatement));

var paramMap = parametersJSON;

var traces = tracesJSON.map(function (t) {
  return {
    stamp: t.value.stateStamped.stamp,
    trace: {
      state: t.value.prevStateStamped.state,
      inputD: t.value.input.discrete,
      inputC: t.value.input.continuous,
    },
  };
});
log.debug('traces', traces);

var corrections = correctionsJSON.corrections;
log.debug('corrections', JSON.stringify(corrections));
corrections.map(function (c) {
  var trace = traces.filter(function (t) {
    return t.stamp === c.stamp;
  })[0];
  !!trace && log.debug(
      'trace', JSON.stringify(trace), 'correction', JSON.stringify(c));
})

var options = settings.applysrtr.options;


// Run SRTR
var z3Input = srtr.createSRTRSMT2(
    transAstIfStatement, paramMap, traces, corrections, options);
log.debug('z3Input', z3Input);

var p = spawn('z3', ['-T:5', '-smt2', '-in'], {stdio: ['pipe', 'pipe', 'ignore']});
p.stdout.on('data', function (data) {
  log.debug('z3output', data.toString());
  // if (data.toString().startsWith("sat")) {
  //   return;
  // }
  // var modelAst = srtr.sexpParser.parse(data.toString());
  // var deltas = modelAst.value.slice(1).reduce(function (acc, v) {
  //   if (
  //     v.type === 'Expression'
  //     && v.value[1].type === 'Atom' && v.value[1].value.type === 'Identifier'
  //     && /^delta_./.test(v.value[1].value.name)
  //     // && v.value[4].type === 'Atom' && v.value[4].value.type === 'Literal'
  //   ) {
  //     if (v.value[4].type === 'Atom' && v.value[4].value.type === 'Literal')
  //       acc[v.value[1].value.name] = v.value[4].value.value;
  //     else {
  //       acc[v.value[1].value.name] = -1 * v.value[4].value[1].value.value;
  //     }
  //   }
  //   return acc;
  // }, {});
  // var weights = modelAst.value.slice(1).reduce(function (acc, v) {
  //   if (
  //     v.type === 'Expression'
  //     && v.value[1].type === 'Atom' && v.value[1].value.type === 'Identifier'
  //     && /w[0-9]+/.test(v.value[1].value.name)
  //     // && v.value[4].type === 'Atom' && v.value[4].value.type === 'Literal'
  //   ) {
  //     if (v.value[4].type === 'Atom' && v.value[4].value.type === 'Literal')
  //       acc[v.value[1].value.name] = v.value[4].value.value;
  //     else {
  //       acc[v.value[1].value.name] = -1 * v.value[4].value[1].value.value;
  //     }
  //   }
  //   return acc;
  // }, {});
  // log.debug('deltas', deltas);
  // log.debug('weights', weights);

  // var inputParams = paramMap;
  // var params = Object.keys(inputParams).reduce(function(acc, k) {
  //   var kd = 'delta_' + k;
  //   acc[k] = inputParams[k] + (!!deltas[kd] ? deltas[kd] : 0);
  //   return acc;
  // }, {});
  // log.debug('params', params);

  // var outputs = {
  //   inputParams: inputParams,
  //   deltas: deltas,
  //   weights: weights,
  //   params: params,
  // };
  // studyJSON.updatedAt = Date.now();
  // studyJSON.outputs = outputs;
  // fs.writeFileSync(
  //   './apps/data/studies/' + studyID + '.json',
  //   JSON.stringify(studyJSON, null, 2)
  // );

  // console.log(JSON.stringify(outputs));
});
p.stdin.write(z3Input);
p.stdin.end();
