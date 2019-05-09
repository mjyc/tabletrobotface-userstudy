// NOTE: might be called twice if transition and emission fncs are called separately
function transition(state, inputD, inputC, params) {

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
        RobotSpeechbubbleAction: "Please prepare 1 yogurt",
        HumanSpeechbubbleAction: ["Next"]
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
        RobotSpeechbubbleAction: "Please prepare 1 orange juice",
        HumanSpeechbubbleAction: ["Go back", "Next"]
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
        RobotSpeechbubbleAction: "Please prepare 1 tomato",
        HumanSpeechbubbleAction: ["Go back", "Next"]
      }
    };
  } else if (
    state === "S4" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Next"
  ) {
    return {
      state: "S5",
      outputs: {
        RobotSpeechbubbleAction: "You are done!",
        HumanSpeechbubbleAction: "",
        SpeechSynthesisAction: "You are done!"
      }
    };


  // Handle Go back
  } else if (
    state === "S3" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Go back"
  ) {
    return {
      state: "S2",
      outputs: {
        RobotSpeechbubbleAction: "Please prepare 1 yogurt",
        HumanSpeechbubbleAction: ["Go back", "Next"]
      }
    };
  } else if (
    state === "S4" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Go back"
  ) {
    return {
      state: "S3",
      outputs: {
        RobotSpeechbubbleAction: "Please prepare 1 orange juice",
        HumanSpeechbubbleAction: ["Next"]
      }
    };
  } else if (
    state === "S5" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Go back"
  ) {
    return {
      state: "S4",
      outputs: {
        RobotSpeechbubbleAction: "Please prepare 1 tomato",
        HumanSpeechbubbleAction: ["Go back", "Next"]
      }
    };


  } else {
    return {
      state,
      outputs: null
    };
  }
}


// Params for reactive behavior
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

