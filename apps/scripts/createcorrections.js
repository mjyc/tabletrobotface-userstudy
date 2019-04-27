#!/usr/bin/env node

var fs = require('fs');

var studyID = process.argv[2];

if (!studyID) {
  console.log('usage: ./createcorrections {studyID}');
  process.exit(1);
}


// create a corrections doc
var now = Date.now();
var id = Math.random().toString(36).substring(2) + '_' + now;
var fileprefix = require('../settings_helper').dataplayer.fileprefix;
var corrections = {
  _id: id,
  createdAt: now,
  studyID: studyID,
  dataFilename: './apps/fromrobot/' + fileprefix,
  corrections: [{stamp: null, state: null}],  // a template
};
fs.writeFileSync(
  './apps/data/corrections/' + id + '.json',
  JSON.stringify(corrections, null, 2)
);


// insert correctionsFilename field
var studyFilename = './apps/data/studies/' + studyID + '.json';
var study = JSON.parse(fs.readFileSync(studyFilename));
study.updatedAt = now;
study.correctionsFilename = './apps/data/corrections/' + id + '.json';
fs.writeFileSync(studyFilename, JSON.stringify(study, null, 2));


console.log(id);
