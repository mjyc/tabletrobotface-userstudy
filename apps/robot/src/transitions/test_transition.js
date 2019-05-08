// NOTE: might be called twice if transition and emission fncs are called separately
function transition(state, inputD, inputC, params) {
  var engagedMinNoseAngle = params.engagedMinNoseAngle;
  var engagedMaxNoseAngle = params.engagedMaxNoseAngle;
  var disengagedMinNoseAngle = params.disengagedMinNoseAngle;
  var disengagedMaxNoseAngle = params.disengagedMaxNoseAngle;
  var disengagedTimeoutIntervalMs = params.disengagedTimeoutIntervalMs;

  if (state === "S0" && inputD.type === "START") {
    return {
      state: "S1",
      outputs: {
        RobotSpeechbubbleAction: 'Tap "Pause" to pause',
        HumanSpeechbubbleAction: ["Pause"]
      }
    };
  } else if (
    state === "S1" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Pause"
  ) {
    return {
      state: "S2",
      outputs: {
        RobotSpeechbubbleAction: 'Tap "Resume" to resume',
        HumanSpeechbubbleAction: ["Resume"]
      }
    };
  } else if (
    state === "S2" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Resume"
  ) {
    return {
      state: "S1",
      outputs: {
        RobotSpeechbubbleAction: 'Tap "Pause" to pause',
        HumanSpeechbubbleAction: ["Pause"]
      }
    };
  } else if (state === "S1" && inputD.type === "Features") {
    if (
      // disengaged
      (inputC.face.isVisible &&
        (inputC.face.noseAngle > disengagedMaxNoseAngle ||
          inputC.face.noseAngle < disengagedMinNoseAngle)) ||
      (!inputC.face.isVisible &&
        inputC.face.stamp - inputC.face.stampLastDetected >
          disengagedTimeoutIntervalMs)
    ) {
      return {
        state: "S2",
        outputs: {
          RobotSpeechbubbleAction: 'Tap "Resume" to resume',
          HumanSpeechbubbleAction: ["Resume"]
        }
      };
    } else {
      return {
        state: state,
        outputs: null
      };
    }
  } else if (state === "S2" && inputD.type === "Features") {
    if (
      // engaged
      inputC.face.isVisible &&
      (inputC.face.noseAngle < engagedMaxNoseAngle &&
        inputC.face.noseAngle > engagedMinNoseAngle)
    ) {
      return {
        state: "S1",
        outputs: {
          RobotSpeechbubbleAction: 'Tap "Pause" to pause',
          HumanSpeechbubbleAction: ["Pause"]
        }
      };
    } else {
      return {
        state: state,
        outputs: null
      };
    }
  } else {
    return {
      state: state,
      outputs: null
    };
  }
}

var defaultParams = {
  engagedMinNoseAngle: 90,
  engagedMaxNoseAngle: 90,
  disengagedMinNoseAngle: 0,
  disengagedMaxNoseAngle: 180,
  disengagedTimeoutIntervalMs: 1000
};

module.exports = {
  transition: transition,
  defaultParams: defaultParams
};
