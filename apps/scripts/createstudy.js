#!/usr/bin/env node

var fs = require('fs');

var now = Date.now();
var id = `${Math.random().toString(36).substring(2)}-${now}`;
var filename = `./apps/data/studies/${id}.json`;

fs.writeFileSync(`${filename}`, JSON.stringify({
  _id: id,
  createdAt: `${now}`,
  updatedAt: `${now}`,
  settings: require('../settings_helper'),
}, null, 2));
console.log(id);
