import * as demo from "./demo";
import * as neck_exercise from "./neck_exercise";
import * as neck_exercise_test from "./neck_exercise_test";
import * as recipeinsts_breakfast from "./recipeinsts_breakfast";
import * as qa_set1 from "./qa_set1";
import * as storytelling_professor_archie_makes_a_bang from "./storytelling_professor_archie_makes_a_bang";
import * as storytelling_test from "./storytelling_test";
import * as storytelling_ranger_forester from "./storytelling_ranger_forester";

demo.params = require("../../../data/parameters/demo.json");
neck_exercise.params = require("../../../data/parameters/neck_exercise.json");
neck_exercise_test.params = require("../../../data/parameters/neck_exercise_test.json");
recipeinsts_breakfast.params = require("../../../data/parameters/recipeinsts_breakfast.json");
qa_set1.params = require("../../../data/parameters/qa_set1.json");
storytelling_professor_archie_makes_a_bang.params = require("../../../data/parameters/storytelling_professor_archie_makes_a_bang.json");
storytelling_ranger_forester.params = require("../../../data/parameters/storytelling_ranger_forester.json");
storytelling_test.params = require("../../../data/parameters/storytelling_test.json");

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
storytelling_professor_archie_makes_a_bang.params =
  Object.keys(storytelling_professor_archie_makes_a_bang.params).length === 0
    ? storytelling_professor_archie_makes_a_bang.defaultParams
    : storytelling_professor_archie_makes_a_bang.params;
storytelling_ranger_forester.params =
  Object.keys(storytelling_ranger_forester.params).length === 0
    ? storytelling_ranger_forester.defaultParams
    : storytelling_ranger_forester.params;
storytelling_test.params =
  Object.keys(storytelling_test.params).length === 0
    ? storytelling_test.defaultParams
    : storytelling_test.params;

export default {
  demo,
  neck_exercise,
  neck_exercise_test,
  recipeinsts_breakfast,
  qa_set1,
  storytelling_professor_archie_makes_a_bang,
  storytelling_ranger_forester,
  storytelling_test
};
