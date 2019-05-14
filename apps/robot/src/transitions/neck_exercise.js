// NOTE: might be called twice if transition and emission fncs are called separately
function transition(stateStamped, inputD, inputC, params) {
  var rotateRightMaxMaxNosePose = params.rotateRightMaxMaxNosePose;
  var rotateLeftMinMaxNosePose = params.rotateLeftMinMaxNosePose;
  var tuckChinMaxMaxNosePoseY = params.tuckChinMaxMaxNosePoseY;
  var elevateChinMinMaxNosePoseY = params.elevateChinMinMaxNosePoseY;

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
        RobotSpeechbubbleAction:
          "Let's exercise your neck! Let's start from looking forward",
        HumanSpeechbubbleAction: ["Next"],
        SpeechSynthesisAction:
          "Let's exercise your neck! Let's start from looking forward"
      }
    };

    // Rotete right and left
  } else if (
    stateStamped.state === "S2" &&
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
  } else if (stateStamped.state === "S3" && inputD.type === "Features") {
    if (inputC.face.maxNosePosXQuarter > rotateRightMaxMaxNosePose) {
      return {
        state: "S4",
        outputs: {
          RobotSpeechbubbleAction: "and now slowly rotate to your left",
          HumanSpeechbubbleAction: ["Next"],
          SpeechSynthesisAction: "and now slowly rotate to your left"
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
        RobotSpeechbubbleAction: "and now slowly rotate to your left",
        HumanSpeechbubbleAction: ["Next"],
        SpeechSynthesisAction: "and now slowly rotate to your left"
      }
    };
  } else if (stateStamped.state === "S4" && inputD.type === "Features") {
    if (inputC.face.maxNosePosXQuarter < rotateLeftMinMaxNosePose) {
      return {
        state: "S5",
        outputs: {
          RobotSpeechbubbleAction: "and now slowly rotate to your right",
          HumanSpeechbubbleAction: ["Next"],
          SpeechSynthesisAction: "and now slowly rotate to your right"
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
  } else if (stateStamped.state === "S5" && inputD.type === "Features") {
    if (inputC.face.maxNosePosXQuarter > rotateRightMaxMaxNosePose) {
      return {
        state: "S6",
        outputs: {
          RobotSpeechbubbleAction: "and now slowly rotate to your left",
          HumanSpeechbubbleAction: ["Next"],
          SpeechSynthesisAction: "and now slowly rotate to your left"
        }
      };
    } else {
      return {
        state: stateStamped.state,
        outputs: null
      };
    }
  } else if (
    stateStamped.state === "S5" &&
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
  } else if (stateStamped.state === "S6" && inputD.type === "Features") {
    if (inputC.face.maxNosePosXQuarter < rotateLeftMinMaxNosePose) {
      return {
        state: "S7",
        outputs: {
          // RobotSpeechbubbleAction: "and now take your ear and act like trying to touch right shoulder",
          RobotSpeechbubbleAction: "and now tuck your chin into the chest",
          HumanSpeechbubbleAction: ["Next"],
          // SpeechSynthesisAction: "and now take your ear and act like trying to touch right shoulder"
          SpeechSynthesisAction: "and now tuck your chin into the chest"
        }
      };
    } else {
      return {
        state: stateStamped.state,
        outputs: null
      };
    }

    // Look down and up
  } else if (
    stateStamped.state === "S6" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Next"
  ) {
    return {
      state: "S7",
      outputs: {
        RobotSpeechbubbleAction: "and now tuck your chin into the chest",
        HumanSpeechbubbleAction: ["Next"],
        SpeechSynthesisAction: "and now tuck your chin into the chest"
      }
    };
  } else if (stateStamped.state === "S7" && inputD.type === "Features") {
    if (inputC.face.maxNosePosYQuarter > tuckChinMaxMaxNosePoseY) {
      return {
        state: "S8",
        outputs: {
          RobotSpeechbubbleAction: "and now elevate your chin to the ceiling",
          HumanSpeechbubbleAction: ["Next"],
          SpeechSynthesisAction: "and now elevate your chin to the ceiling"
        }
      };
    } else {
      return {
        state: stateStamped.state,
        outputs: null
      };
    }
  } else if (
    stateStamped.state === "S7" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Next"
  ) {
    return {
      state: "S8",
      outputs: {
        RobotSpeechbubbleAction: "and now elevate your chin to the ceiling",
        HumanSpeechbubbleAction: ["Next"],
        SpeechSynthesisAction: "and now elevate your chin to the ceiling"
      }
    };
  } else if (stateStamped.state === "S8" && inputD.type === "Features") {
    console.log(inputC.face.maxNosePosYQuarter);
    if (inputC.face.maxNosePosYQuarter < elevateChinMinMaxNosePoseY) {
      return {
        state: "S9",
        outputs: {
          RobotSpeechbubbleAction: "and now tuck your chin to the chest",
          HumanSpeechbubbleAction: ["Next"],
          SpeechSynthesisAction: "and now tuck your chin to the chest"
        }
      };
    } else {
      return {
        state: stateStamped.state,
        outputs: null
      };
    }
  } else if (
    stateStamped.state === "S8" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Next"
  ) {
    return {
      state: "S9",
      outputs: {
        RobotSpeechbubbleAction: "and now tuck your chin into the chest",
        HumanSpeechbubbleAction: ["Next"],
        SpeechSynthesisAction: "and now tuck your chin into the chest"
      }
    };
  } else if (stateStamped.state === "S9" && inputD.type === "Features") {
    if (inputC.face.maxNosePosYQuarter > tuckChinMaxMaxNosePoseY) {
      return {
        state: "S10",
        outputs: {
          RobotSpeechbubbleAction: "and now elevate your chin to the ceiling",
          HumanSpeechbubbleAction: ["Next"],
          SpeechSynthesisAction: "and now elevate your chin to the ceiling"
        }
      };
    } else {
      return {
        state: stateStamped.state,
        outputs: null
      };
    }
  } else if (
    stateStamped.state === "S9" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Next"
  ) {
    return {
      state: "S10",
      outputs: {
        RobotSpeechbubbleAction: "and now elevate your chin to the ceiling",
        HumanSpeechbubbleAction: ["Next"],
        SpeechSynthesisAction: "and now elevate your chin to the ceiling"
      }
    };
  } else if (stateStamped.state === "S10" && inputD.type === "Features") {
    console.log(inputC.face.maxNosePosYQuarter);
    if (inputC.face.maxNosePosYQuarter < elevateChinMinMaxNosePoseY) {
      return {
        state: "S11",
        outputs: {
          RobotSpeechbubbleAction: "Great job!",
          HumanSpeechbubbleAction: "",
          SpeechSynthesisAction: "Great job!"
        }
      };
    } else {
      return {
        state: stateStamped.state,
        outputs: null
      };
    }
  } else if (
    stateStamped.state === "S10" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Next"
  ) {
    return {
      state: "S11",
      outputs: {
        RobotSpeechbubbleAction: "Great job!",
        HumanSpeechbubbleAction: "",
        SpeechSynthesisAction: "Great job!"
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
  rotateRightMaxMaxNosePose: 100,
  rotateLeftMinMaxNosePose: -100,
  tuckChinMaxMaxNosePoseY: 70,
  elevateChinMinMaxNosePoseY: -70
};

module.exports = {
  transition: transition,
  defaultParams: defaultParams
};
