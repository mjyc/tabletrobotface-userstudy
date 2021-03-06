// NOTE: might be called twice if transition and emission fncs are called separately
function transition(stateStamped, inputD, inputC, params) {
  var nextTimeoutIntervalCs = params.nextTimeoutIntervalCs;

  // Happy path
  if (stateStamped.state === "S0" && inputD.type === "START") {
    return {
      state: "S1",
      outputs: {
        RobotSpeechbubbleAction: 'Tap "Hello" when you are ready',
        HumanSpeechbubbleAction: ["Hello"]
      }
    };
  } else if (
    stateStamped.state === "S1" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Hello"
  ) {
    return {
      state: "S2",
      outputs: {
        RobotSpeechbubbleAction: "Please prepare 1 yogurt",
        HumanSpeechbubbleAction: ["Next"],
        SpeechSynthesisAction: "Please prepare 1 yogurt"
      }
    };
  } else if (stateStamped.state === "S2" && inputD.type === "Features") {
    if (
      inputC.face.isVisible &&
      nextTimeoutIntervalCs >= 0 && // use disengagedTimeoutIntervalCs < 0 to disable proactive pause
      inputC.face.stamp - inputC.history.stateStamped[0].stamp >
        inputC.face.stamp - inputC.history.isVisibleStamped[1].stamp &&
      inputC.history.isVisibleStamped[1].isVisible === false &&
      inputC.face.stamp - inputC.history.isVisibleStamped[1].stamp >
        nextTimeoutIntervalCs * 10
    ) {
      return {
        state: "S3",
        outputs: {
          RobotSpeechbubbleAction: "Please prepare 1 orange juice",
          HumanSpeechbubbleAction: ["Go back", "Next"],
          SpeechSynthesisAction: "Please prepare 1 orange juice"
        }
      };
    } else {
      return {
        state: stateStamped.state,
        outputs: null
      };
    }
  } else if (
    stateStamped.state === "S2" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Next"
  ) {
    return {
      state: "S3",
      outputs: {
        RobotSpeechbubbleAction: "Please prepare 1 orange juice",
        HumanSpeechbubbleAction: ["Go back", "Next"],
        SpeechSynthesisAction: "Please prepare 1 orange juice"
      }
    };
  } else if (stateStamped.state === "S3" && inputD.type === "Features") {
    if (
      inputC.face.isVisible &&
      nextTimeoutIntervalCs >= 0 && // use disengagedTimeoutIntervalCs < 0 to disable proactive pause
      inputC.face.stamp - inputC.history.stateStamped[0].stamp >
        inputC.face.stamp - inputC.history.isVisibleStamped[1].stamp &&
      inputC.history.isVisibleStamped[1].isVisible === false &&
      inputC.face.stamp - inputC.history.isVisibleStamped[1].stamp >
        nextTimeoutIntervalCs * 10
    ) {
      return {
        state: "S4",
        outputs: {
          RobotSpeechbubbleAction: "Please prepare 1 tomato",
          HumanSpeechbubbleAction: ["Go back", "Next"],
          SpeechSynthesisAction: "Please prepare 1 tomato"
        }
      };
    } else {
      return {
        state: stateStamped.state,
        outputs: null
      };
    }
  } else if (
    stateStamped.state === "S3" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Next"
  ) {
    return {
      state: "S4",
      outputs: {
        RobotSpeechbubbleAction: "Please prepare 1 tomato",
        HumanSpeechbubbleAction: ["Go back", "Next"],
        SpeechSynthesisAction: "Please prepare 1 tomato"
      }
    };
  } else if (stateStamped.state === "S4" && inputD.type === "Features") {
    if (
      inputC.face.isVisible &&
      nextTimeoutIntervalCs >= 0 && // use disengagedTimeoutIntervalCs < 0 to disable proactive pause
      inputC.face.stamp - inputC.history.stateStamped[0].stamp >
        inputC.face.stamp - inputC.history.isVisibleStamped[1].stamp &&
      inputC.history.isVisibleStamped[1].isVisible === false &&
      inputC.face.stamp - inputC.history.isVisibleStamped[1].stamp >
        nextTimeoutIntervalCs * 10
    ) {
      return {
        state: "S5",
        outputs: {
          RobotSpeechbubbleAction: "You are done!",
          HumanSpeechbubbleAction: "",
          SpeechSynthesisAction: "You are done!"
        }
      };
    } else {
      return {
        state: stateStamped.state,
        outputs: null
      };
    }
  } else if (
    stateStamped.state === "S4" &&
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
    stateStamped.state === "S3" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Go back"
  ) {
    return {
      state: "S2",
      outputs: {
        RobotSpeechbubbleAction: "Please prepare 1 yogurt",
        HumanSpeechbubbleAction: ["Go back", "Next"],
        SpeechSynthesisAction: "Please prepare 1 yogurt"
      }
    };
  } else if (
    stateStamped.state === "S4" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Go back"
  ) {
    return {
      state: "S3",
      outputs: {
        RobotSpeechbubbleAction: "Please prepare 1 orange juice",
        HumanSpeechbubbleAction: ["Next"],
        SpeechSynthesisAction: "Please prepare 1 orange juice"
      }
    };
  } else if (
    stateStamped.state === "S5" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Go back"
  ) {
    return {
      state: "S4",
      outputs: {
        RobotSpeechbubbleAction: "Please prepare 1 tomato",
        HumanSpeechbubbleAction: ["Go back", "Next"],
        SpeechSynthesisAction: "Please prepare 1 tomato"
      }
    };
  } else {
    return {
      state: stateStamped.state,
      outputs: null
    };
  }
}

var defaultParams = {
  nextTimeoutIntervalCs: 100,
  sets: {
    passive: {
      nextTimeoutIntervalCs: 0
    },
    proactive: {
      nextTimeoutIntervalCs: 100
    }
  }
};

module.exports = {
  transition: transition,
  defaultParams: defaultParams
};
