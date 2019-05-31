"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.input = input;
exports.transitionReducer = transitionReducer;
exports.output = output;
exports.RobotApp = RobotApp;

var _xstream = require("xstream");

var _xstream2 = _interopRequireDefault(_xstream);

var _sampleCombine = require("xstream/extra/sampleCombine");

var _sampleCombine2 = _interopRequireDefault(_sampleCombine);

var _pairwise = require("xstream/extra/pairwise");

var _pairwise2 = _interopRequireDefault(_pairwise);

var _throttle = require("xstream/extra/throttle");

var _throttle2 = _interopRequireDefault(_throttle);

var _dropRepeats = require("xstream/extra/dropRepeats");

var _dropRepeats2 = _interopRequireDefault(_dropRepeats);

var _action = require("@cycle-robot-drivers/action");

var _features = require("./features");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function input(_ref) {
  var command = _ref.command,
      state = _ref.state,
      FacialExpressionAction = _ref.FacialExpressionAction,
      RobotSpeechbubbleAction = _ref.RobotSpeechbubbleAction,
      HumanSpeechbubbleAction = _ref.HumanSpeechbubbleAction,
      AudioPlayerAction = _ref.AudioPlayerAction,
      SpeechSynthesisAction = _ref.SpeechSynthesisAction,
      SpeechRecognitionAction = _ref.SpeechRecognitionAction,
      PoseDetection = _ref.PoseDetection,
      VAD = _ref.VAD;
  var bufferSize = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 10;

  var command$ = command.filter(function (cmd) {
    return cmd.type === "LOAD_FSM";
  });

  var inputD$ = _xstream2.default.merge(command.filter(function (cmd) {
    return cmd.type === "START_FSM";
  }).mapTo({
    type: "START"
  }), FacialExpressionAction.result.map(function (r) {
    return {
      type: "FacialExpressionAction",
      status: r.status.status,
      result: r.result
    };
  }), RobotSpeechbubbleAction.result.map(function (r) {
    return {
      type: "RobotSpeechbubbleAction",
      status: r.status.status,
      result: r.result
    };
  }), HumanSpeechbubbleAction.result.map(function (r) {
    return {
      type: "HumanSpeechbubbleAction",
      status: r.status.status,
      result: r.result
    };
  }), AudioPlayerAction.result.map(function (r) {
    return {
      type: "AudioPlayerAction",
      status: r.status.status,
      result: r.result
    };
  }), SpeechSynthesisAction.result.map(function (r) {
    return {
      type: "SpeechSynthesisAction",
      status: r.status.status,
      result: r.result
    };
  }), SpeechRecognitionAction.result.map(function (r) {
    return {
      type: "SpeechRecognitionAction",
      status: r.status.status,
      result: r.result
    };
  }));

  // extract face features
  var faceFeatures$ = PoseDetection.events("poses").map(function (poses) {
    return (0, _features.extractFaceFeatures)(poses);
  }).startWith(_features.defaultFaceFeatures);
  // extract voice features
  var voiceFeatures$ = VAD.fold(function (prev, _ref2) {
    var type = _ref2.type,
        value = _ref2.value;

    var stamp = Date.now();
    var vadState = type === "START" ? "ACTIVE" : type === "STOP" ? "INACTIVE" : prev.vadState;
    return {
      stamp: stamp,
      vadState: vadState,
      vadLevel: type === "UPDATE" ? value : prev.vadLevel
    };
  }, {
    stamp: 0,
    vadState: "INACTIVE",
    vadLevel: 0
  }).compose((0, _throttle2.default)(100)); // 10hz
  // extract history features
  var stateStampedHistory$ = state.stream.filter(function (s) {
    return !!s.fsm && !!s.fsm.stateStamped;
  }).map(function (s) {
    return s.fsm.stateStamped;
  }).compose((0, _dropRepeats2.default)(function (x, y) {
    return x.state === y.state;
  })).compose(_pairwise2.default).compose(_pairwise2.default).map(function (_ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        _ref4$ = _slicedToArray(_ref4[0], 2),
        x = _ref4$[0],
        y = _ref4$[1],
        _ref4$2 = _slicedToArray(_ref4[1], 2),
        _ = _ref4$2[0],
        z = _ref4$2[1];

    return [z, y, x];
  }).startWith([].concat(_toConsumableArray(Array(3))).map(function (_) {
    return { state: "", stamp: 0 };
  }));
  var isVisibleStampedHistory$ = faceFeatures$.map(function (ff) {
    return { isVisible: ff.isVisible, stamp: ff.stamp };
  }).compose((0, _dropRepeats2.default)(function (x, y) {
    return x.isVisible === y.isVisible;
  })).compose(_pairwise2.default).compose(_pairwise2.default).map(function (_ref5) {
    var _ref6 = _slicedToArray(_ref5, 2),
        _ref6$ = _slicedToArray(_ref6[0], 2),
        x = _ref6$[0],
        y = _ref6$[1],
        _ref6$2 = _slicedToArray(_ref6[1], 2),
        _ = _ref6$2[0],
        z = _ref6$2[1];

    return [z, y, x];
  }).startWith([].concat(_toConsumableArray(Array(3))).map(function (_) {
    return { isVisible: "", stamp: 0 };
  }));
  var vadStateStampedHistory$ = voiceFeatures$.map(function (vf) {
    return { vadState: vf.vadState, stamp: vf.stamp };
  }).compose((0, _dropRepeats2.default)(function (x, y) {
    return x.vadState === y.vadState;
  })).compose(_pairwise2.default).compose(_pairwise2.default).map(function (_ref7) {
    var _ref8 = _slicedToArray(_ref7, 2),
        _ref8$ = _slicedToArray(_ref8[0], 2),
        x = _ref8$[0],
        y = _ref8$[1],
        _ref8$2 = _slicedToArray(_ref8[1], 2),
        _ = _ref8$2[0],
        z = _ref8$2[1];

    return [z, y, x];
  }).startWith([].concat(_toConsumableArray(Array(3))).map(function (_) {
    return { vadState: "", stamp: 0 };
  }));

  var inputC$ = _xstream2.default.combine(faceFeatures$, voiceFeatures$, stateStampedHistory$, isVisibleStampedHistory$, vadStateStampedHistory$).map(function (_ref9) {
    var _ref10 = _slicedToArray(_ref9, 5),
        faceFeatures = _ref10[0],
        voiceFeatures = _ref10[1],
        stateStampedHistory = _ref10[2],
        isVisibleStampedHistory = _ref10[3],
        vadStateStampedHistory = _ref10[4];

    return {
      face: faceFeatures,
      voice: voiceFeatures,
      history: {
        stateStamped: stateStampedHistory,
        isVisibleStamped: isVisibleStampedHistory,
        vadStateStamped: vadStateStampedHistory
      }
    };
  });
  return _xstream2.default.merge(command$, inputD$.compose((0, _sampleCombine2.default)(inputC$)).map(function (_ref11) {
    var _ref12 = _slicedToArray(_ref11, 2),
        inputD = _ref12[0],
        inputC = _ref12[1];

    return {
      type: "FSM_INPUT",
      discrete: inputD,
      continuous: inputC
    };
  }), inputC$.map(function (inputC) {
    return {
      type: "FSM_INPUT",
      discrete: { type: "Features" },
      continuous: inputC
    };
  }).compose((0, _throttle2.default)(100)) // 10hz
  );
}

function transitionReducer(input$) {
  var initReducer$ = _xstream2.default.of(function (prev) {
    return {
      fsm: null,
      outputs: null
    };
  });

  var wrapOutputs = function wrapOutputs() {
    var outputs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    return outputs !== null ? Object.keys(outputs).reduce(function (prev, name) {
      return _extends({}, prev, _defineProperty({}, name, outputs[name].hasOwnProperty("goal") && outputs[name].hasOwnProperty("cancel") ? _extends({}, outputs[name], {
        goal: (0, _action.initGoal)(outputs[name].goal)
      }) : {
        goal: (0, _action.initGoal)(outputs[name])
        // no cancel
      }));
    }, {}) : outputs;
  };

  var inputReducer$ = input$.map(function (input) {
    return function (prev) {
      if (input.type === "LOAD_FSM") {
        var stamp = Date.now();
        return _extends({}, prev, {
          fsm: {
            stateStamped: {
              stamp: stamp,
              state: input.value.S0
            },
            transition: input.value.T,
            emission: input.value.G
          },
          trace: null,
          outputs: null
        });
      } else if (input.type === "FSM_INPUT") {
        if (prev.fsm === null) {
          console.warn("FSM not loaded; skipping");
          return _extends({}, prev, {
            outputs: null
          });
        }
        var prevStateStamped = prev.fsm.stateStamped;
        var inputD = input.discrete;
        var inputC = input.continuous;
        var state = prev.fsm.transition(prevStateStamped, inputD, inputC);
        var _stamp = Date.now();
        var stateStamped = {
          // new state
          state: state,
          stamp: _stamp
        };
        var outputs = wrapOutputs(prev.fsm.emission(prevStateStamped, inputD, inputC));
        return _extends({}, prev, {
          fsm: _extends({}, prev.fsm, {
            stateStamped: stateStamped
          }),
          outputs: outputs,
          trace: {
            prevStateStamped: prevStateStamped,
            input: input,
            stateStamped: stateStamped,
            outputs: outputs
          }
        });
      } else {
        console.warn("Unknown input.type=" + input.type + "; skipping");
        return _extends({}, prev, {
          outputs: null
        });
      }
    };
  });

  return _xstream2.default.merge(initReducer$, inputReducer$);
}

function output(reducerState$) {
  var outputs$ = reducerState$.filter(function (rs) {
    return !!rs.outputs;
  }).map(function (rs) {
    return rs.outputs;
  });
  return {
    FacialExpressionAction: {
      goal: outputs$.filter(function (o) {
        return !!o.FacialExpressionAction && !!o.FacialExpressionAction.goal;
      }).map(function (o) {
        return o.FacialExpressionAction.goal;
      }),
      cancel: outputs$.filter(function (o) {
        return !!o.FacialExpressionAction && !!o.FacialExpressionAction.cancel;
      }).map(function (o) {
        return o.FacialExpressionAction.cancel;
      })
    },
    RobotSpeechbubbleAction: {
      goal: outputs$.filter(function (o) {
        return !!o.RobotSpeechbubbleAction && !!o.RobotSpeechbubbleAction.goal;
      }).map(function (o) {
        return o.RobotSpeechbubbleAction.goal;
      }),
      cancel: outputs$.filter(function (o) {
        return !!o.RobotSpeechbubbleAction && !!o.RobotSpeechbubbleAction.cancel;
      }).map(function (o) {
        return o.RobotSpeechbubbleAction.cancel;
      })
    },
    HumanSpeechbubbleAction: {
      goal: outputs$.filter(function (o) {
        return !!o.HumanSpeechbubbleAction && !!o.HumanSpeechbubbleAction.goal;
      }).map(function (o) {
        return o.HumanSpeechbubbleAction.goal;
      }),
      cancel: outputs$.filter(function (o) {
        return !!o.HumanSpeechbubbleAction && !!o.HumanSpeechbubbleAction.cancel;
      }).map(function (o) {
        return o.HumanSpeechbubbleAction.cancel;
      })
    },
    AudioPlayerAction: {
      goal: outputs$.filter(function (o) {
        return !!o.AudioPlayerAction && !!o.AudioPlayerAction.goal;
      }).map(function (o) {
        return o.AudioPlayerAction.goal;
      }),
      cancel: outputs$.filter(function (o) {
        return !!o.AudioPlayerAction && !!o.AudioPlayerAction.canel;
      }).map(function (o) {
        return o.AudioPlayerAction.cancel;
      })
    },
    SpeechSynthesisAction: {
      goal: outputs$.filter(function (o) {
        return !!o.SpeechSynthesisAction && !!o.SpeechSynthesisAction.goal;
      }).map(function (o) {
        return o.SpeechSynthesisAction.goal;
      }),
      cancel: outputs$.filter(function (o) {
        return !!o.SpeechSynthesisAction && !!o.SpeechSynthesisAction.cancel;
      }).map(function (o) {
        return o.SpeechSynthesisAction.cancel;
      })
    },
    SpeechRecognitionAction: {
      goal: outputs$.filter(function (o) {
        return !!o.SpeechRecognitionAction && !!o.SpeechRecognitionAction.goal;
      }).map(function (o) {
        return o.SpeechRecognitionAction.goal;
      }),
      cancel: outputs$.filter(function (o) {
        return !!o.SpeechRecognitionAction && !!o.SpeechRecognitionAction.cancel;
      }).map(function (o) {
        return o.SpeechRecognitionAction.cancel;
      })
    }
  };
}

function RobotApp(sources) {
  // sources.state.stream.addListener({next: s => console.debug('RobotApp state', s)});

  var input$ = input(sources);
  var reducer = transitionReducer(input$);
  var outputs = output(sources.state.stream);

  return _extends({
    state: reducer
  }, outputs);
}