// NOTE: might be called twice if transition and emission fncs are called separately
function transition(stateStamped, inputD, inputC, params) {
  var timeout = params.timeout;

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
      stateStamped.stampLastChanged < inputC.voice.stampLastChanged &&
      inputC.voice.vadState === "INACTIVE" &&
      stateStamped.stamp - inputC.voice.stampLastChanged > timeout
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
      stateStamped.stampLastChanged < inputC.voice.stampLastChanged &&
      inputC.voice.vadState === "INACTIVE" &&
      stateStamped.stamp - inputC.voice.stampLastChanged > timeout
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
      stateStamped.stampLastChanged < inputC.voice.stampLastChanged &&
      inputC.voice.vadState === "INACTIVE" &&
      stateStamped.stamp - inputC.voice.stampLastChanged > timeout
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
      stateStamped.stampLastChanged < inputC.voice.stampLastChanged &&
      inputC.voice.vadState === "INACTIVE" &&
      stateStamped.stamp - inputC.voice.stampLastChanged > timeout
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
      stateStamped.stampLastChanged < inputC.voice.stampLastChanged &&
      inputC.voice.vadState === "INACTIVE" &&
      stateStamped.stamp - inputC.voice.stampLastChanged > timeout
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
  timeout: 2000
};

module.exports = {
  transition: transition,
  defaultParams: defaultParams
};
