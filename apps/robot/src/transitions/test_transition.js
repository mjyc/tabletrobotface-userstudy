// NOTE: might be called twice if transition and emission fncs are called separately
function transition(state, inputD, inputC, params) {
  var engagedMinNoseAngle = params.engagedMinNoseAngle;
  var engagedMaxNoseAngle = params.engagedMaxNoseAngle;
  var disengagedTimeoutIntervalMs = params.disengagedTimeoutIntervalMs;


  if (state === 'S0' && inputD.type === 'START') {
    return {
      state: 'S1',
      outputs: {
        RobotSpeechbubbleAction: 'Tap "Pause" to pause',
        HumanSpeechbubbleAction: ['Pause'],
      },
    };
  } else if (
      state === 'S1' && inputD.type === 'HumanSpeechbubbleAction'
      && inputD.status === 'SUCCEEDED' && inputD.result === 'Pause'
  ) {
    return {
      state: 'S2',
      outputs: {
        RobotSpeechbubbleAction: 'Tap "Resume" to resume',
        HumanSpeechbubbleAction: ['Resume'],
      },
    };
  } else if (
      state === 'S2' && inputD.type === 'HumanSpeechbubbleAction'
      && inputD.status === 'SUCCEEDED' && inputD.result === 'Resume'
  ) {
    return {
      state: 'S1',
      outputs: {
        RobotSpeechbubbleAction: 'Tap "Pause" to pause',
        HumanSpeechbubbleAction: ['Pause'],
      },
    };


  } else if (  // disengaged
      state === 'S1' && inputD.type === 'Features'
      && (
        inputC.face.isVisible && (inputC.face.noseAngle > engagedMaxNoseAngle || inputC.face.noseAngle < engagedMinNoseAngle)
        || !inputC.face.isVisible && (inputC.face.stamp - inputC.face.stampLastDetected) > disengagedTimeoutIntervalMs
      )
  ) {
    return {
      state: 'S2',
      outputs: {
        RobotSpeechbubbleAction: 'Tap "Resume" to resume',
        HumanSpeechbubbleAction: ['Resume'],
      },
    };
  } else if (  // engaged
      state === 'S2' && inputD.type === 'Features'
      && (inputC.face.noseAngle < engagedMaxNoseAngle && inputC.face.noseAngle > engagedMinNoseAngle)
  ) {
    return {
      state: 'S1',
      outputs: {
        RobotSpeechbubbleAction: 'Tap "Pause" to pause',
        HumanSpeechbubbleAction: ['Pause'],
      },
    };


  } else {
    return {
      state: state,
      outputs: null,
    };
  }
};

var defaultParams = {
  "engagedMinNoseAngle": 80,
  "engagedMaxNoseAngle": 110,
  "disengagedTimeoutIntervalMs": 1000
};

module.exports = {
  transition: transition,
  defaultParams: defaultParams
};
