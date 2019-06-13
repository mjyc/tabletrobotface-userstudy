import * as demo from "./demo";
import * as neck_exercise from "./neck_exercise";
import * as neck_exercise_test from "./neck_exercise_test";
import * as recipeinsts_breakfast from "./recipeinsts_breakfast";
import * as qa_set1 from "./qa_set1";

demo.params = require("../../../data/parameters/demo.json");
neck_exercise.params = require("../../../data/parameters/neck_exercise.json");
neck_exercise_test.params = require("../../../data/parameters/neck_exercise_test.json");
recipeinsts_breakfast.params = require("../../../data/parameters/recipeinsts_breakfast.json");
qa_set1.params = require("../../../data/parameters/qa_set1.json");

demo.params =
  Object.keys(demo.params).length === 0 ? demo.defaultParams : demo.params;
neck_exercise.params =
  Object.keys(neck_exercise.params).length === 0
    ? neck_exercise.defaultParams
    : neck_exercise.params;
neck_exercise_test.params =
  Object.keys(neck_exercise_test.params).length === 0
    ? neck_exercise_test.defaultParams
    : neck_exercise_test.params;
recipeinsts_breakfast.params =
  Object.keys(recipeinsts_breakfast.params).length === 0
    ? recipeinsts_breakfast.defaultParams
    : recipeinsts_breakfast.params;
qa_set1.params =
  Object.keys(qa_set1.params).length === 0
    ? qa_set1.defaultParams
    : qa_set1.params;

export default {
  demo,
  neck_exercise,
  neck_exercise_test,
  recipeinsts_breakfast,
  qa_set1
};
