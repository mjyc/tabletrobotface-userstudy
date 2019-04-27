#!/usr/bin/env node

var fs = require('fs');

var filename = process.argv[2];
if (!filename) {
  console.log('usage: ./saveparams {studyFilname}');
  process.exit(1);
}

var studyJSON = JSON.parse(fs.readFileSync(filename));
var paramsFilename = './apps/data/parameters/' + studyJSON.settings.robot.name + '.json'
var paramsJSON = JSON.parse(fs.readFileSync(paramsFilename));
fs.writeFileSync('./apps/data/parameters/' + studyJSON.settings.robot.name + '_' + Date.now() + '.json', JSON.stringify(paramsJSON, null, 2));

paramsJSON = studyJSON.outputs.params;
fs.writeFileSync(paramsFilename, JSON.stringify(paramsJSON, null, 2));
