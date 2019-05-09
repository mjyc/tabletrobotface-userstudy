import * as demo from "./demo";
import * as storytelling_professor_archie_makes_a_bang from "./storytelling_professor_archie_makes_a_bang";
import * as storytelling_ranger_forester from "./storytelling_ranger_forester";
import * as neck_exercise from "./neck_exercise";
import * as test_transition from "./test_transition";

demo.params = require("../../../data/parameters/demo.json");
storytelling_professor_archie_makes_a_bang.params = require("../../../data/parameters/storytelling_professor_archie_makes_a_bang.json");
storytelling_ranger_forester.params = require("../../../data/parameters/storytelling_ranger_forester.json");
neck_exercise.params = require("../../../data/parameters/neck_exercise.json");
test_transition.params = require("../../../data/parameters/test_transition.json");

demo.params =
  Object.keys(demo.params).length === 0 ? demo.defaultParams : demo.params;
storytelling_professor_archie_makes_a_bang.params =
  Object.keys(storytelling_professor_archie_makes_a_bang.params).length === 0
    ? storytelling_professor_archie_makes_a_bang.defaultParams
    : storytelling_professor_archie_makes_a_bang.params;
storytelling_ranger_forester.params =
  Object.keys(storytelling_ranger_forester.params).length === 0
    ? storytelling_ranger_forester.defaultParams
    : storytelling_ranger_forester.params;
neck_exercise.params =
  Object.keys(neck_exercise.params).length === 0
    ? neck_exercise.defaultParams
    : neck_exercise.params;
test_transition.params =
  Object.keys(test_transition.params).length === 0
    ? test_transition.defaultParams
    : test_transition.params;

export default {
  demo,
  storytelling_professor_archie_makes_a_bang,
  storytelling_ranger_forester,
  neck_exercise,
  test_transition
};
