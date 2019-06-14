// NOTE: might be called twice if transition and emission fncs are called separately
function transition(stateStamped, inputD, inputC, params) {
  var rotateRightNoseAngle = params.rotateRightNoseAngle;
  var rotateLeftNoseAngle = params.rotateLeftNoseAngle;
  var touchRighFaceAngle = params.touchRighFaceAngle;
  var touchLeftFaceAngle = params.touchLeftFaceAngle;
  var nextMaxMaxNoseAngle1Sec = params.nextMaxMaxNoseAngle1Sec;

  if (stateStamped.state === "S0" && inputD.type === "START") {
    return {
      state: "S1",
      outputs: {
        RobotSpeechbubbleAction: 'Tap "Hello" when you are ready',
        HumanSpeechbubbleAction: ["Hello"]
      }
    };
  } else if (
    (stateStamped.state === "S1" &&
      inputD.type === "HumanSpeechbubbleAction" &&
      inputD.status === "SUCCEEDED" &&
      inputD.result === "Hello") ||
    (inputD.type === "HumanSpeechbubbleAction" &&
      inputD.status === "SUCCEEDED" &&
      inputD.result === "Repeat")
  ) {
    return {
      state: "S2",
      outputs: {
        RobotSpeechbubbleAction: "Let's start from looking forward",
        HumanSpeechbubbleAction: "",
        SpeechSynthesisAction: {
          goal_id: {
            id: "Let's start from looking forward",
            stamp: Date.now()
          },
          goal: "Let's start from looking forward"
        }
      }
    };

    // Rotete right and left
  } else if (
    stateStamped.state === "S2" &&
    inputD.type === "SpeechSynthesisAction" &&
    inputD.status === "SUCCEEDED"
  ) {
    return {
      state: "S3",
      outputs: {
        RobotSpeechbubbleAction: "and now slowly rotate to your right",
        HumanSpeechbubbleAction: ["Next"],
        SpeechSynthesisAction: {
          goal_id: {
            id: "and now slowly rotate to your right",
            stamp: Date.now()
          },
          goal: "and now slowly rotate to your right"
        }
      }
    };
  } else if (stateStamped.state === "S3" && inputD.type === "Features") {
    if (
      nextMaxMaxNoseAngle1Sec >= 0 &&
      inputC.temporal.maxNoseAngle1Sec < nextMaxMaxNoseAngle1Sec &&
      inputC.history.speechSynthesisActionResultStamped[0].goal_id.id ===
        "and now slowly rotate to your right" &&
      inputC.face.stamp -
        inputC.history.speechSynthesisActionResultStamped[0].stamp >
        3000 &&
      inputC.face.noseAngle < rotateRightNoseAngle
    ) {
      return {
        state: "S4",
        outputs: {
          RobotSpeechbubbleAction: "and now slowly rotate to your left",
          HumanSpeechbubbleAction: ["Next"],
          SpeechSynthesisAction: {
            goal_id: {
              id: "and now slowly rotate to your left",
              stamp: Date.now()
            },
            goal: "and now slowly rotate to your left"
          }
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
        SpeechSynthesisAction: {
          goal_id: {
            id: "and now slowly rotate to your left",
            stamp: Date.now()
          },
          goal: "and now slowly rotate to your left"
        }
      }
    };
  } else if (stateStamped.state === "S4" && inputD.type === "Features") {
    if (
      nextMaxMaxNoseAngle1Sec >= 0 &&
      inputC.temporal.maxNoseAngle1Sec < nextMaxMaxNoseAngle1Sec &&
      inputC.history.speechSynthesisActionResultStamped[0].goal_id.id ===
        "and now slowly rotate to your left" &&
      inputC.face.stamp -
        inputC.history.speechSynthesisActionResultStamped[0].stamp >
        3000 &&
      inputC.face.noseAngle > rotateLeftNoseAngle
    ) {
      return {
        state: "S5",
        outputs: {
          RobotSpeechbubbleAction: "and now slowly rotate to your right",
          HumanSpeechbubbleAction: ["Next"],
          SpeechSynthesisAction: {
            goal_id: {
              id: "and now slowly rotate to your right",
              stamp: Date.now()
            },
            goal: "and now slowly rotate to your right"
          }
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
        RobotSpeechbubbleAction: "and now slowly rotate to your right",
        HumanSpeechbubbleAction: ["Next"],
        SpeechSynthesisAction: {
          goal_id: {
            id: "and now slowly rotate to your right",
            stamp: Date.now()
          },
          goal: "and now slowly rotate to your right"
        }
      }
    };
  } else if (stateStamped.state === "S5" && inputD.type === "Features") {
    if (
      nextMaxMaxNoseAngle1Sec >= 0 &&
      inputC.temporal.maxNoseAngle1Sec < nextMaxMaxNoseAngle1Sec &&
      inputC.history.speechSynthesisActionResultStamped[0].goal_id.id ===
        "and now slowly rotate to your right" &&
      inputC.face.stamp -
        inputC.history.speechSynthesisActionResultStamped[0].stamp >
        3000 &&
      inputC.face.noseAngle < rotateRightNoseAngle
    ) {
      return {
        state: "S6",
        outputs: {
          RobotSpeechbubbleAction: "and now slowly rotate to your left",
          HumanSpeechbubbleAction: ["Next"],
          SpeechSynthesisAction: {
            goal_id: {
              id: "and now slowly rotate to your left",
              stamp: Date.now()
            },
            goal: "and now slowly rotate to your left"
          }
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
        SpeechSynthesisAction: {
          goal_id: {
            id: "and now slowly rotate to your left",
            stamp: Date.now()
          },
          goal: "and now slowly rotate to your left"
        }
      }
    };
  } else if (stateStamped.state === "S6" && inputD.type === "Features") {
    if (
      nextMaxMaxNoseAngle1Sec >= 0 &&
      inputC.temporal.maxNoseAngle1Sec < nextMaxMaxNoseAngle1Sec &&
      inputC.history.speechSynthesisActionResultStamped[0].goal_id.id ===
        "and now slowly rotate to your left" &&
      inputC.face.stamp -
        inputC.history.speechSynthesisActionResultStamped[0].stamp >
        3000 &&
      inputC.face.noseAngle > rotateLeftNoseAngle
    ) {
      return {
        state: "S7",
        outputs: {
          RobotSpeechbubbleAction:
            "and now take your ear and act like trying to touch right shoulder",
          HumanSpeechbubbleAction: ["Next"],
          SpeechSynthesisAction: {
            goal_id: {
              id:
                "and now take your ear and act like trying to touch right shoulder",
              stamp: Date.now()
            },
            goal:
              "and now take your ear and act like trying to touch right shoulder"
          }
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
        RobotSpeechbubbleAction:
          "and now take your ear and act like trying to touch right shoulder",
        HumanSpeechbubbleAction: ["Next"],
        SpeechSynthesisAction: {
          goal_id: {
            id:
              "and now take your ear and act like trying to touch right shoulder",
            stamp: Date.now()
          },
          goal:
            "and now take your ear and act like trying to touch right shoulder"
        }
      }
    };
  } else if (stateStamped.state === "S7" && inputD.type === "Features") {
    if (
      nextMaxMaxNoseAngle1Sec >= 0 &&
      inputC.temporal.maxNoseAngle1Sec < nextMaxMaxNoseAngle1Sec &&
      inputC.history.speechSynthesisActionResultStamped[0].goal_id.id ===
        "and now take your ear and act like trying to touch right shoulder" &&
      inputC.face.stamp -
        inputC.history.speechSynthesisActionResultStamped[0].stamp >
        3000 &&
      inputC.face.faceAngle > touchRighFaceAngle
    ) {
      return {
        state: "S8",
        outputs: {
          RobotSpeechbubbleAction:
            "and now take your ear and act like trying to touch left shoulder",
          HumanSpeechbubbleAction: ["Next"],
          SpeechSynthesisAction: {
            goal_id: {
              id:
                "and now take your ear and act like trying to touch left shoulder",
              stamp: Date.now()
            },
            goal:
              "and now take your ear and act like trying to touch left shoulder"
          }
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
        RobotSpeechbubbleAction:
          "and now take your ear and act like trying to touch left shoulder",
        HumanSpeechbubbleAction: ["Next"],
        SpeechSynthesisAction: {
          goal_id: {
            id:
              "and now take your ear and act like trying to touch left shoulder",
            stamp: Date.now()
          },
          goal:
            "and now take your ear and act like trying to touch left shoulder"
        }
      }
    };
  } else if (stateStamped.state === "S8" && inputD.type === "Features") {
    if (
      nextMaxMaxNoseAngle1Sec >= 0 &&
      inputC.temporal.maxNoseAngle1Sec < nextMaxMaxNoseAngle1Sec &&
      inputC.history.speechSynthesisActionResultStamped[0].goal_id.id ===
        "and now take your ear and act like trying to touch left shoulder" &&
      inputC.face.stamp -
        inputC.history.speechSynthesisActionResultStamped[0].stamp >
        3000 &&
      inputC.face.faceAngle < touchLeftFaceAngle
    ) {
      return {
        state: "S9",
        outputs: {
          RobotSpeechbubbleAction:
            "and now take your ear and act like trying to touch right shoulder",
          HumanSpeechbubbleAction: ["Next"],
          SpeechSynthesisAction: {
            goal_id: {
              id:
                "and now take your ear and act like trying to touch right shoulder",
              stamp: Date.now()
            },
            goal:
              "and now take your ear and act like trying to touch right shoulder"
          }
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
        RobotSpeechbubbleAction:
          "and now take your ear and act like trying to touch right shoulder",
        HumanSpeechbubbleAction: ["Next"],
        SpeechSynthesisAction: {
          goal_id: {
            id:
              "and now take your ear and act like trying to touch right shoulder",
            stamp: Date.now()
          },
          goal:
            "and now take your ear and act like trying to touch right shoulder"
        }
      }
    };
  } else if (stateStamped.state === "S9" && inputD.type === "Features") {
    if (
      nextMaxMaxNoseAngle1Sec >= 0 &&
      inputC.temporal.maxNoseAngle1Sec < nextMaxMaxNoseAngle1Sec &&
      inputC.history.speechSynthesisActionResultStamped[0].goal_id.id ===
        "and now take your ear and act like trying to touch right shoulder" &&
      inputC.face.stamp -
        inputC.history.speechSynthesisActionResultStamped[0].stamp >
        3000 &&
      inputC.face.faceAngle > touchRighFaceAngle
    ) {
      return {
        state: "S10",
        outputs: {
          RobotSpeechbubbleAction:
            "and now take your ear and act like trying to touch left shoulder",
          HumanSpeechbubbleAction: ["Next"],
          SpeechSynthesisAction: {
            goal_id: {
              id:
                "and now take your ear and act like trying to touch left shoulder",
              stamp: Date.now()
            },
            goal:
              "and now take your ear and act like trying to touch left shoulder"
          }
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
        RobotSpeechbubbleAction:
          "and now take your ear and act like trying to touch left shoulder",
        HumanSpeechbubbleAction: ["Next"],
        SpeechSynthesisAction: {
          goal_id: {
            id:
              "and now take your ear and act like trying to touch left shoulder",
            stamp: Date.now()
          },
          goal:
            "and now take your ear and act like trying to touch left shoulder"
        }
      }
    };
  } else if (stateStamped.state === "S10" && inputD.type === "Features") {
    if (
      nextMaxMaxNoseAngle1Sec >= 0 &&
      inputC.temporal.maxNoseAngle1Sec < nextMaxMaxNoseAngle1Sec &&
      inputC.history.speechSynthesisActionResultStamped[0].goal_id.id ===
        "and now take your ear and act like trying to touch left shoulder" &&
      inputC.face.stamp -
        inputC.history.speechSynthesisActionResultStamped[0].stamp >
        3000 &&
      inputC.face.faceAngle < touchLeftFaceAngle
    ) {
      return {
        state: "S11",
        outputs: {
          RobotSpeechbubbleAction: "Great job!",
          HumanSpeechbubbleAction: ["Repeat"],
          SpeechSynthesisAction: {
            goal_id: {
              id: "Great job!",
              stamp: Date.now()
            },
            goal: "Great job!"
          }
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
        HumanSpeechbubbleAction: ["Repeat"],
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
  rotateRightNoseAngle: -20,
  rotateLeftNoseAngle: 20,
  touchRighFaceAngle: 30,
  touchLeftFaceAngle: -30,
  nextMaxMaxNoseAngle1Sec: 20,
  sets: {
    passive: {
      rotateRightNoseAngle: -60,
      rotateLeftNoseAngle: 60,
      touchRighFaceAngle: 90,
      touchLeftFaceAngle: -90,
      nextMaxMaxNoseAngle1Sec: -1
    },
    proactive: {
      rotateRightNoseAngle: -20,
      rotateLeftNoseAngle: 20,
      touchRighFaceAngle: 30,
      touchLeftFaceAngle: -30,
      nextMaxMaxNoseAngle1Sec: 20
    }
  }
};

module.exports = {
  transition: transition,
  defaultParams: defaultParams
};
