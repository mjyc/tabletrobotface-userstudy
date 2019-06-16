// NOTE: might be called twice if transition and emission fncs are called separately
function transition(stateStamped, inputD, inputC, params) {
  var timeoutCm = params.timeoutCm;
  var minSpeakDurationCm = params.minSpeakDurationCm;
  var minTurnDurationCm = params.minTurnDurationCm;
  var engagedMinNoseAngle = params.engagedMinNoseAngle;
  var engagedMaxNoseAngle = params.engagedMaxNoseAngle;
  var engagedMaxMaxNoseAngle1Sec = params.engagedMaxMaxNoseAngle1Sec;

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
        RobotSpeechbubbleAction: "Are you a morning person or a night owl?",
        HumanSpeechbubbleAction: ["Next"],
        SpeechSynthesisAction: "Are you a morning person or a night owl?"
      }
    };
  } else if (stateStamped.state === "S2" && inputD.type === "Features") {
    if (
      timeoutCm >= 0 &&
      minSpeakDurationCm >= 0 &&
      minTurnDurationCm >= 0 &&
      engagedMaxMaxNoseAngle1Sec >= 0 &&
      inputC.voice.vadState === "INACTIVE" &&
      inputC.history.stateStamped[0].state === "S2" &&
      inputC.history.vadStateStamped[0].vadState === "INACTIVE" &&
      inputC.history.stateStamped[0].stamp <
        inputC.history.vadStateStamped[1].stamp &&
      inputC.history.vadStateStamped[0].stamp -
        inputC.history.vadStateStamped[1].stamp >
        minSpeakDurationCm * 10 &&
      inputC.face.stamp - inputC.history.stateStamped[0].stamp >
        minTurnDurationCm * 10 &&
      inputC.face.stamp - inputC.history.vadStateStamped[0].stamp >
        timeoutCm * 10 &&
      (inputC.face.isVisible &&
        (inputC.face.noseAngle < engagedMaxNoseAngle &&
          inputC.face.noseAngle > engagedMinNoseAngle) &&
        inputC.temporal.maxNoseAngle1Sec < disengagedMaxMaxNoseAngle1Sec)
    ) {
      return {
        state: "S3",
        outputs: {
          RobotSpeechbubbleAction: "Is there anything you don't eat? and why?",
          HumanSpeechbubbleAction: ["Next"],
          SpeechSynthesisAction: "Is there anything you don't eat? and why?"
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
        RobotSpeechbubbleAction: "Is there anything you don't eat? and why?",
        HumanSpeechbubbleAction: ["Next"],
        SpeechSynthesisAction: "Is there anything you don't eat? and why?"
      }
    };
  } else if (stateStamped.state === "S3" && inputD.type === "Features") {
    if (
      timeoutCm >= 0 &&
      minSpeakDurationCm >= 0 &&
      minTurnDurationCm >= 0 &&
      engagedMaxMaxNoseAngle1Sec >= 0 &&
      inputC.voice.vadState === "INACTIVE" &&
      inputC.history.stateStamped[0].state === "S3" &&
      inputC.history.vadStateStamped[0].vadState === "INACTIVE" &&
      inputC.history.stateStamped[0].stamp <
        inputC.history.vadStateStamped[1].stamp &&
      inputC.history.vadStateStamped[0].stamp -
        inputC.history.vadStateStamped[1].stamp >
        minSpeakDurationCm * 10 &&
      inputC.face.stamp - inputC.history.stateStamped[0].stamp >
        minTurnDurationCm * 10 &&
      inputC.face.stamp - inputC.history.vadStateStamped[0].stamp >
        timeoutCm * 10 &&
      (inputC.face.isVisible &&
        (inputC.face.noseAngle < engagedMaxNoseAngle &&
          inputC.face.noseAngle > engagedMinNoseAngle) &&
        inputC.temporal.maxNoseAngle1Sec < disengagedMaxMaxNoseAngle1Sec)
    ) {
      return {
        state: "S4",
        outputs: {
          RobotSpeechbubbleAction: "What does a typical day look like for you?",
          HumanSpeechbubbleAction: ["Next"],
          SpeechSynthesisAction: "What does a typical day look like for you?"
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
        RobotSpeechbubbleAction: "What does a typical day look like for you?",
        HumanSpeechbubbleAction: ["Next"],
        SpeechSynthesisAction: "What does a typical day look like for you?"
      }
    };
  } else if (stateStamped.state === "S4" && inputD.type === "Features") {
    if (
      timeoutCm >= 0 &&
      minSpeakDurationCm >= 0 &&
      minTurnDurationCm >= 0 &&
      engagedMaxMaxNoseAngle1Sec >= 0 &&
      inputC.voice.vadState === "INACTIVE" &&
      inputC.history.stateStamped[0].state === "S4" &&
      inputC.history.vadStateStamped[0].vadState === "INACTIVE" &&
      inputC.history.stateStamped[0].stamp <
        inputC.history.vadStateStamped[1].stamp &&
      inputC.history.vadStateStamped[0].stamp -
        inputC.history.vadStateStamped[1].stamp >
        minSpeakDurationCm * 10 &&
      inputC.face.stamp - inputC.history.stateStamped[0].stamp >
        minTurnDurationCm * 10 &&
      inputC.face.stamp - inputC.history.vadStateStamped[0].stamp >
        timeoutCm * 10 &&
      (inputC.face.isVisible &&
        (inputC.face.noseAngle < engagedMaxNoseAngle &&
          inputC.face.noseAngle > engagedMinNoseAngle) &&
        inputC.temporal.maxNoseAngle1Sec < disengagedMaxMaxNoseAngle1Sec)
    ) {
      return {
        state: "S5",
        outputs: {
          RobotSpeechbubbleAction: "What odd talent do you have?",
          HumanSpeechbubbleAction: ["Next"],
          SpeechSynthesisAction: "What odd talent do you have?"
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
        RobotSpeechbubbleAction: "What odd talent do you have?",
        HumanSpeechbubbleAction: ["Next"],
        SpeechSynthesisAction: "What odd talent do you have?"
      }
    };
  } else if (stateStamped.state === "S5" && inputD.type === "Features") {
    if (
      timeoutCm >= 0 &&
      minSpeakDurationCm >= 0 &&
      minTurnDurationCm >= 0 &&
      engagedMaxMaxNoseAngle1Sec >= 0 &&
      inputC.voice.vadState === "INACTIVE" &&
      inputC.history.stateStamped[0].state === "S5" &&
      inputC.history.vadStateStamped[0].vadState === "INACTIVE" &&
      inputC.history.stateStamped[0].stamp <
        inputC.history.vadStateStamped[1].stamp &&
      inputC.history.vadStateStamped[0].stamp -
        inputC.history.vadStateStamped[1].stamp >
        minSpeakDurationCm * 10 &&
      inputC.face.stamp - inputC.history.stateStamped[0].stamp >
        minTurnDurationCm * 10 &&
      inputC.face.stamp - inputC.history.vadStateStamped[0].stamp >
        timeoutCm * 10 &&
      (inputC.face.isVisible &&
        (inputC.face.noseAngle < engagedMaxNoseAngle &&
          inputC.face.noseAngle > engagedMinNoseAngle) &&
        inputC.temporal.maxNoseAngle1Sec < disengagedMaxMaxNoseAngle1Sec)
    ) {
      return {
        state: "S6",
        outputs: {
          RobotSpeechbubbleAction:
            "What's the most spontaneous thing you've done?",
          HumanSpeechbubbleAction: ["Next"],
          SpeechSynthesisAction:
            "What's the most spontaneous thing you've done?"
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
        RobotSpeechbubbleAction:
          "What's the most spontaneous thing you've done?",
        HumanSpeechbubbleAction: ["Next"],
        SpeechSynthesisAction: "What's the most spontaneous thing you've done?"
      }
    };
  } else if (stateStamped.state === "S6" && inputD.type === "Features") {
    if (
      timeoutCm >= 0 &&
      minSpeakDurationCm >= 0 &&
      minTurnDurationCm >= 0 &&
      engagedMaxMaxNoseAngle1Sec >= 0 &&
      inputC.voice.vadState === "INACTIVE" &&
      inputC.history.stateStamped[0].state === "S6" &&
      inputC.history.vadStateStamped[0].vadState === "INACTIVE" &&
      inputC.history.stateStamped[0].stamp <
        inputC.history.vadStateStamped[1].stamp &&
      inputC.history.vadStateStamped[0].stamp -
        inputC.history.vadStateStamped[1].stamp >
        minSpeakDurationCm * 10 &&
      inputC.face.stamp - inputC.history.stateStamped[0].stamp >
        minTurnDurationCm * 10 &&
      inputC.face.stamp - inputC.history.vadStateStamped[0].stamp >
        timeoutCm * 10 &&
      (inputC.face.isVisible &&
        (inputC.face.noseAngle < engagedMaxNoseAngle &&
          inputC.face.noseAngle > engagedMinNoseAngle) &&
        inputC.temporal.maxNoseAngle1Sec < disengagedMaxMaxNoseAngle1Sec)
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
        state: stateStamped.state,
        outputs: null
      };
    }
  } else if (
    stateStamped.state === "S6" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Next"
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
      state: stateStamped.state,
      outputs: null
    };
  }
}

var defaultParams = {
  timeoutCm: 300,
  minSpeakDurationCm: 100,
  minTurnDurationCm: 500,
  engagedMinNoseAngle: -10,
  engagedMaxNoseAngle: 10,
  engagedMaxMaxNoseAngle1Sec: 20,
  sets: {
    passive: {
      timeoutCm: -1,
      minSpeakDurationCm: -1,
      minTurnDurationCm: -1,
      engagedMaxMaxNoseAngle1Sec: -1,
      engagedMinNoseAngle: -90,
      engagedMaxNoseAngle: 90
    },
    proactive: {
      timeoutCm: 300,
      minSpeakDurationCm: 100,
      minTurnDurationCm: 500,
      engagedMinNoseAngle: -10,
      engagedMaxNoseAngle: 10
    }
  }
};

module.exports = {
  transition: transition,
  defaultParams: defaultParams
};
