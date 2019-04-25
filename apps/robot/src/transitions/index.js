import * as demo from './demo';
import * as storytelling_PROFESSOR_ARCHIE_MAKES_A_BANG from './storytelling_PROFESSOR_ARCHIE_MAKES_A_BANG';
import * as test_transition from './test_transition';

demo.params = require('../../../data/parameters/demo.json');
storytelling_PROFESSOR_ARCHIE_MAKES_A_BANG.params = require('../../../data/parameters/storytelling_PROFESSOR_ARCHIE_MAKES_A_BANG.json');
test_transition.params = require('../../../data/parameters/test_transition.json');

demo.params = Object.keys(demo.params).length === 0 ? demo.defaultParams : demo.params;
storytelling_PROFESSOR_ARCHIE_MAKES_A_BANG.params = Object.keys(storytelling_PROFESSOR_ARCHIE_MAKES_A_BANG.params).length === 0 ? storytelling_PROFESSOR_ARCHIE_MAKES_A_BANG.defaultParams : storytelling_PROFESSOR_ARCHIE_MAKES_A_BANG.params;
test_transition.params = Object.keys(test_transition.params).length === 0 ? test_transition.defaultParams : test_transition.params;

export default {
  demo,
  storytelling_PROFESSOR_ARCHIE_MAKES_A_BANG,
  test_transition,
};
