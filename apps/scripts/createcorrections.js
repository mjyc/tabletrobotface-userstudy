#!/usr/bin/env node

var fs = require('fs');

var studyID = process.argv[2];
var dataFilename = process.argv[3];

if (!studyID || !dataFilename) {
  console.log("usage: ./prepannotating {studyID} {dataFilename}");
  process.exit(1);
}

console.log(studyID, dataFilename);


// create a corrections doc
var now = Date.now();
var id = `${Math.random().toString(36).substring(2)}_${now}`;
var data = JSON.parse(fs.readFileSync(dataFilename));
var corrections = {
  _id: id,
  createdAt: now,
  studyID: studyID,
  dataFilename: dataFilename,
  corrections: data.trace.map(function(t) {
    return {
      stamp: t.value.stateStamped.stamp,
      state: t.value.stateStamped.state,
      correction: null,
    };
  }),
};
fs.writeFileSync(
  `./apps/data/corrections/${id}.json`,
  JSON.stringify(corrections, null, 2)
);


// insert correctionsFilename field
var studyFilename = `./apps/data/studies/${studyID}.json`;
var study = JSON.parse(fs.readFileSync(studyFilename));
study.updatedAt = now;
study.correctionsFilename = `./apps/data/fromrobot/${id}.json`;
fs.writeFileSync(studyFilename, study);