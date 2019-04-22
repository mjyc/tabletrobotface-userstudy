#!/usr/bin/env node

const tracesFile = process.argv[2];  // apps/data/fromrobot/Data*.json
const correctionsFile = process.argv[3];  // apps/data/fromrobot/Data*.json

const optionsFile = process.argv[3];  // apps/data/params/transitionName/param

if (!packagePath || packagePath === '') {
  console.log("Please provide a relative package.json path as the first argument");
  process.exit(1);
}

const traces = ;
const corrections = ;


const formula = srtr(
  transAst, parameterMap, traces, corrections, options);
expect(formula);



// OUTPUT:
// * filenames
// * output getmodel



// 1. read traces from data/bags/
// 2. apply srtr
// 3. output into data/params (write the script in ../package.json)

// const packagePath = process.argv[2];
// const bumpType = process.argv[3];

// if (!packagePath || packagePath === '') {
//   console.log("Please provide a relative package.json path as the first argument");
//   process.exit(1);
// }
