// NOTE: might be called twice if transition and emission fncs are called separately
function transition(state, inputD, inputC, params) {
  var engagedMinNoseAngle = params.engagedMinNoseAngle;
  var engagedMaxNoseAngle = params.engagedMaxNoseAngle;
  var disengagedMinNoseAngle = params.disengagedMinNoseAngle;
  var disengagedMaxNoseAngle = params.disengagedMaxNoseAngle;
  var disengagedTimeoutIntervalMs = params.disengagedTimeoutIntervalMs;

  // Happy path
  if (state === "S0" && inputD.type === "START") {
    return {
      state: "S1",
      outputs: {
        RobotSpeechbubbleAction: 'Tap "Hello" when you are ready',
        HumanSpeechbubbleAction: ["Hello"]
      }
    };
  } else if (
    state === "S1" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Hello"
  ) {
    return {
      state: "S2",
      outputs: {
        RobotSpeechbubbleAction: "What sort of vacations do you like to take?",
        HumanSpeechbubbleAction: ["Next"],
        SpeechSynthesisAction: "What sort of vacations do you like to take?"
      }
    };
  } else if (
    state === "S2" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Next"
  ) {
    return {
      state: "S3",
      outputs: {
        RobotSpeechbubbleAction:
          "What are some movies you really enjoyed? and why?",
        HumanSpeechbubbleAction: ["Next"],
        SpeechSynthesisAction:
          "What are some movies you really enjoyed? and why?"
      }
    };
  } else if (
    state === "S3" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Next"
  ) {
    return {
      state: "S4",
      outputs: {
        RobotSpeechbubbleAction:
          "Who is the most fascinating person you've met?",
        HumanSpeechbubbleAction: ["Next"],
        SpeechSynthesisAction: "Who is the most fascinating person you've met?"
      }
    };
  } else if (
    state === "S4" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Next"
  ) {
    return {
      state: "S5",
      outputs: {
        RobotSpeechbubbleAction: "Anything surprising happen today?",
        HumanSpeechbubbleAction: ["Next"],
        SpeechSynthesisAction: "Anything surprising happen today?"
      }
    };
  } else if (
    state === "S5" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Next"
  ) {
    return {
      state: "S6",
      outputs: {
        RobotSpeechbubbleAction:
          "What's the most interesting thing you learned this week?",
        HumanSpeechbubbleAction: ["Next"],
        SpeechSynthesisAction:
          "What's the most interesting thing you learned this week?"
      }
    };
  } else if (
    state === "S6" &&
    inputD.type === "SpeechSynthesisAction" &&
    inputD.status === "SUCCEEDED"
  ) {
    return {
      state: "S7",
      outputs: {
        RobotSpeechbubbleAction: "We are all done!",
        HumanSpeechbubbleAction: "",
        SpeechSynthesisAction: "We are all done!"
      }
    };
  } else {
    return {
      state,
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
