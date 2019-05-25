#!/usr/bin/env node

const fs = require("fs");
const xs = require("xstream").default;
const { mockTimeSource } = require("@cycle/time");
const log = require("loglevel-debug")("createtraces");

// load file
const filename = process.argv[2];
if (!filename) {
  log.error("usage: ./createtraces {filename}");
  process.exit(1);
}
const data = JSON.parse(fs.readFileSync(filename));

// restore streams
const Time = mockTimeSource();
const { schedule, currentTime } = Time.createOperator();
const sources = Object.keys(data).reduce(
  (prev, label) => ({
    ...prev,
    label: xs.create({
      start: listener => {
        data[label].map(event => {
          schedule.next(listener, currentTime() + event.time, event.value);
        });
      },
      stop: () => {}
    })
  }),
  {}
);

// test
Object.keys(sources).map(label =>
  sources[label].addListener({
    next: v => console.log(label, v)
  })
);
Time.run();
