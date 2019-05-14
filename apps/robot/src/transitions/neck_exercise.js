// NOTE: might be called twice if transition and emission fncs are called separately
function transition(state, inputD, inputC, params) {
  var rotateRightMaxMaxNosePose = params.rotateRightMaxMaxNosePose;
  var rotateLeftMinMaxNosePose = params.rotateLeftMinMaxNosePose;

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
        RobotSpeechbubbleAction: "Let's exercise your neck! Let's start from looking forward",
        HumanSpeechbubbleAction: ["Next"],
        SpeechSynthesisAction: "Let's exercise your neck! Let's start from looking forward"
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
        RobotSpeechbubbleAction: "and slowly rotate to your right",
        HumanSpeechbubbleAction: ["Next"],
        SpeechSynthesisAction: "and slowly rotate to your right"
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
        RobotSpeechbubbleAction: "and now slowly rotate to your left",
        HumanSpeechbubbleAction: ["Next"],
        SpeechSynthesisAction: "and now slowly rotate to your left"
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
        RobotSpeechbubbleAction: "and slowly rotate to your right",
        HumanSpeechbubbleAction: ["Next"],
        SpeechSynthesisAction: "and slowly rotate to your right"
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
        RobotSpeechbubbleAction: "and now slowly rotate to your left",
        HumanSpeechbubbleAction: ["Next"],
        SpeechSynthesisAction: "and now slowly rotate to your left"
      }
    };
  } else if (
    state === "S6" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Next"
  ) {
    return {
      state: "S7",
      outputs: {
        RobotSpeechbubbleAction: "and now take your ear and act like trying to touch right shoulder",
        HumanSpeechbubbleAction: ["Next"],
        SpeechSynthesisAction: "and now take your ear and act like trying to touch right shoulder"
      }
    };
  } else if (
    state === "S7" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Next"
  ) {
    return {
      state: "S8",
      outputs: {
        RobotSpeechbubbleAction: "and now take your ear and act like trying to touch left shoulder",
        HumanSpeechbubbleAction: ["Next"],
        SpeechSynthesisAction: "and now take your ear and act like trying to touch left shoulder"
      }
    };
  } else if (
    state === "S8" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Next"
  ) {
    return {
      state: "S9",
      outputs: {
        RobotSpeechbubbleAction: "and now take your ear and act like trying to touch right shoulder",
        HumanSpeechbubbleAction: ["Next"],
        SpeechSynthesisAction: "and now take your ear and act like trying to touch right shoulder"
      }
    };
  } else if (
    state === "S9" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Next"
  ) {
    return {
      state: "S10",
      outputs: {
        RobotSpeechbubbleAction: "and now take your ear and act like trying to touch left shoulder",
        HumanSpeechbubbleAction: ["Next"],
        SpeechSynthesisAction: "and now take your ear and act like trying to touch left shoulder"
      }
    };
  } else if (
    state === "S10" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Next"
  ) {
    return {
      state: "S11",
      outputs: {
        RobotSpeechbubbleAction: "and now tuck your chin into the chest",
        HumanSpeechbubbleAction: ["Next"],
        SpeechSynthesisAction: "and now tuck your chin into the chest"
      }
    };
  } else if (
    state === "S11" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Next"
  ) {
    return {
      state: "S12",
      outputs: {
        RobotSpeechbubbleAction: "and now elevate your chin to the ceiling",
        HumanSpeechbubbleAction: ["Next"],
        SpeechSynthesisAction: "and now elevate your chin to the ceiling"
      }
    };
  } else if (
    state === "S12" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Next"
  ) {
    return {
      state: "S13",
      outputs: {
        RobotSpeechbubbleAction: "and now tuck your chin into the chest",
        HumanSpeechbubbleAction: ["Next"],
        SpeechSynthesisAction: "and now tuck your chin into the chest"
      }
    };
  } else if (
    state === "S13" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Next"
  ) {
    return {
      state: "S14",
      outputs: {
        RobotSpeechbubbleAction: "and now elevate your chin to the ceiling",
        HumanSpeechbubbleAction: ["Next"],
        SpeechSynthesisAction: "and now elevate your chin to the ceiling"
      }
    };
  } else if (
    state === "S14" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Next"
  ) {
    return {
      state: "S15",
      outputs: {
        RobotSpeechbubbleAction: "Great job!",
        HumanSpeechbubbleAction: "",
        SpeechSynthesisAction: "Great job!"
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
  "rotateRightMaxMaxNosePose": 10,
  "rotateLeftMinMaxNosePose": -10,
};

module.exports = {
  transition: transition,
  defaultParams: defaultParams
};

