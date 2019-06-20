#!/usr/bin/env node

var fs = require("fs");

var filename = process.argv[2];
if (!filename) {
  console.log("usage: ./savesettings {studyFilname}");
}

var study = JSON.parse(fs.readFileSync(filename));
study.settings = require("../settings_helper");
study.updatedAt = Date.now();
fs.writeFileSync(filename, JSON.stringify(study, null, 2));
