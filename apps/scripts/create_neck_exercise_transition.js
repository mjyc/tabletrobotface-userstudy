var numRepeats = !process.argv[2] ? 2 : process.argv[2];
var rotateOnly =
  process.argv[3] === "undefined" || process.argv[3] == "true" ? true : false;

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

var output =
  `// NOTE: might be called twice if transition and emission fncs are called separately
function transition(stateStamped, inputD, inputC, params) {` +
  Object.keys(defaultParams)
    .filter(key => key !== "sets")
    .map(key => {
      return `
  var ${key} = params.${key};`;
    })
    .join("") +
  `
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
    };`;

output += `

    // Rotete right and left`;
var idx = 2;
for (var i = 0; i < numRepeats; i++) {
  output += `${
    i === 0
      ? `
  } else if (
    stateStamped.state === "S${idx}" &&
    inputD.type === "SpeechSynthesisAction" &&
    inputD.status === "SUCCEEDED"
  ) {
    return {
      state: "S${idx + 1}",
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
    };`
      : `
  } else if (
    stateStamped.state === "S${idx}" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Next"
  ) {
    return {
      state: "S${idx + 1}",
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
    };`
  }
  } else if (stateStamped.state === "S${idx +
    1}" && inputD.type === "Features") {
    if (
      nextMaxMaxNoseAngle1Sec >= 0 &&
      inputC.temporal.maxNoseAngle1Sec < nextMaxMaxNoseAngle1Sec &&
      inputC.history.speechSynthesisActionResultStamped[0].goal_id.id ===
        "and now slowly rotate to your right" &&
      inputC.face.stamp -
        inputC.history.speechSynthesisActionResultStamped[0].stamp >
        3000 &&
      (inputC.face.isVisible && (inputC.face.noseAngle < rotateRightNoseAngle)
        || !inputC.face.isVisible && inputC.history.lastVisibleFaceFeatures.noseAngle < rotateRightNoseAngle)
    ) {
      return {
        state: "S${idx + 2}",
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
    stateStamped.state === "S${idx + 1}" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Next"
  ) {
    return {
      state: "S${idx + 2}",
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
  } else if (stateStamped.state === "S${idx +
    2}" && inputD.type === "Features") {
    if (
      nextMaxMaxNoseAngle1Sec >= 0 &&
      inputC.temporal.maxNoseAngle1Sec < nextMaxMaxNoseAngle1Sec &&
      inputC.history.speechSynthesisActionResultStamped[0].goal_id.id ===
        "and now slowly rotate to your left" &&
      inputC.face.stamp -
        inputC.history.speechSynthesisActionResultStamped[0].stamp >
        3000 &&
      (inputC.face.isVisible && (inputC.face.noseAngle > rotateLeftNoseAngle)
        || !inputC.face.isVisible && inputC.history.lastVisibleFaceFeatures.noseAngle > rotateLeftNoseAngle)
    ) {
      return {
        state: "S${idx + 3}",
        outputs: {
          RobotSpeechbubbleAction: "${
            i !== numRepeats - 1
              ? !rotateOnly
                ? `and now slowly rotate to your right`
                : `Great job!`
              : `and now take your ear and act like trying to touch right shoulder`
          }",
          HumanSpeechbubbleAction: ${!rotateOnly ? `["Next"]` : `["Repeat"]`},
          SpeechSynthesisAction: {
            goal_id: {
              id: "${
                i !== numRepeats - 1
                  ? !rotateOnly
                    ? `and now slowly rotate to your right`
                    : `Great job!`
                  : `and now take your ear and act like trying to touch right shoulder`
              }",
              stamp: Date.now()
            },
            goal: "${
              i !== numRepeats - 1
                ? !rotateOnly
                  ? `and now slowly rotate to your right`
                  : `Great job!`
                : `and now take your ear and act like trying to touch right shoulder`
            }"
          }
        }
      };
    } else {
      return {
        state: stateStamped.state,
        outputs: null
      };
    }`;
  idx += 2;
}

if (!!rotateOnly)
  output += `

    // Touch right and left shoulders`;
for (var i = 0; i < numRepeats; i++) {
  output += `
  } else if (
    stateStamped.state === "S${idx}" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Next"
  ) {
    return {
      state: "S${idx + 1}",
      outputs: {
        RobotSpeechbubbleAction: "and now take your ear and act like trying to touch right shoulder",
        HumanSpeechbubbleAction: ["Next"],
        SpeechSynthesisAction: {
          goal_id: {
            id: "and now take your ear and act like trying to touch right shoulder",
            stamp: Date.now()
          },
          goal: "and now take your ear and act like trying to touch right shoulder"
        }
      }
    };
  } else if (stateStamped.state === "S${idx +
    1}" && inputD.type === "Features") {
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
        state: "S${idx + 2}",
        outputs: {
          RobotSpeechbubbleAction: "and now take your ear and act like trying to touch left shoulder",
          HumanSpeechbubbleAction: ["Next"],
          SpeechSynthesisAction: {
            goal_id: {
              id: "and now take your ear and act like trying to touch left shoulder",
              stamp: Date.now()
            },
            goal: "and now take your ear and act like trying to touch left shoulder"
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
    stateStamped.state === "S${idx + 1}" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Next"
  ) {
    return {
      state: "S${idx + 2}",
      outputs: {
        RobotSpeechbubbleAction: "and now take your ear and act like trying to touch left shoulder",
        HumanSpeechbubbleAction: ["Next"],
        SpeechSynthesisAction: {
          goal_id: {
            id: "and now take your ear and act like trying to touch left shoulder",
            stamp: Date.now()
          },
          goal: "and now take your ear and act like trying to touch left shoulder"
        }
      }
    };
  } else if (stateStamped.state === "S${idx +
    2}" && inputD.type === "Features") {
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
        state: "S${idx + 3}",
        outputs: {
          RobotSpeechbubbleAction: "${
            i !== numRepeats - 1
              ? `and now take your ear and act like trying to touch right shoulder`
              : `Great job!`
          }",
          HumanSpeechbubbleAction: ${
            i !== numRepeats - 1 ? `["Next"]` : `["Repeat"]`
          },
          SpeechSynthesisAction: {
            goal_id: {
              id: "${
                i !== numRepeats - 1
                  ? `and now take your ear and act like trying to touch right shoulder`
                  : `Great job!`
              }",
              stamp: Date.now(),
            },
            goal: "${
              i !== numRepeats - 1
                ? `and now take your ear and act like trying to touch right shoulder`
                : `Great job!`
            }"
          }
        }
      };
    } else {
      return {
        state: stateStamped.state,
        outputs: null
      };
    }`;
  idx += 2;
}

output += `
  } else if (
    stateStamped.state === "S${idx}" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Next"
  ) {
    return {
      state: "S${idx + 1}",
      outputs: {
        RobotSpeechbubbleAction: "Great job!",
        HumanSpeechbubbleAction: ["Repeat"],
        SpeechSynthesisAction: "Great job!"
      }
    };`;

output += `

  } else {
    return {
      state: stateStamped.state,
      outputs: null
    };
  }
}

var defaultParams = ${JSON.stringify(defaultParams, null, 2)};

module.exports = {
  transition: transition,
  defaultParams: defaultParams
};`;

console.log(output);
