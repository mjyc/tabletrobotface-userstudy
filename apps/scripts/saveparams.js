#!/usr/bin/env node

var fs = require('fs');

var filename = process.argv[2];
if (!filename) {
  console.log('usage: ./saveparams {studyFilname}');
  process.exit(1);
}

var settings = require('../settings_helper');
var paramsFilename = './apps/data/parameters/' + settings.robot.name + '.json'
var paramsJSON = JSON.parse(fs.readFileSync(paramsFilename));
fs.writeFileSync('./apps/data/parameters/' + settings.robot.name + '_' + Date.now() + '.json', JSON.stringify(paramsJSON, null, 2));

var study = JSON.parse(fs.readFileSync(filename));
paramsJSON = study.outputs.params;
fs.writeFileSync(paramsFilename, JSON.stringify(paramsJSON, null, 2));
