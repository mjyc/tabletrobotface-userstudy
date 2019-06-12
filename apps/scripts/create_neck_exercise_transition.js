var numRepeats = !process.argv[2] ? 2 : process.argv[2];
var rotateOnly =
  process.argv[3] === "undefined" || process.argv[3] == "true" ? true : false;

var defaultParams = {
  rotateRightNoseAngle: -20,
  rotateLeftNoseAngle: 20,
  touchRighFaceAngle: 30,
  touchLeftFaceAngle: -30,
  tuckChinFaceHeight: 60,
  elevateChinFaceHeight: 30,
  sets: {
    passive: {
      rotateRightNoseAngle: -60,
      rotateLeftNoseAngle: 60,
      touchRighFaceAngle: 90,
      touchLeftFaceAngle: -90,
      tuckChinFaceHeight: 480,
      elevateChinFaceHeight: 0
    },
    proactive: {
      rotateRightNoseAngle: -20,
      rotateLeftNoseAngle: 20,
      touchRighFaceAngle: 30,
      touchLeftFaceAngle: -30,
      tuckChinFaceHeight: 60,
      elevateChinFaceHeight: 30
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
    stateStamped.state === "S1" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Hello"
  ) {
    return {
      state: "S2",
      outputs: {
        RobotSpeechbubbleAction: "Let's exercise your neck! Let's start from looking forward",
        HumanSpeechbubbleAction: "",
        SpeechSynthesisAction: "Let's exercise your neck! Let's start from looking forward"
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
        RobotSpeechbubbleAction: "and slowly rotate to your right",
        HumanSpeechbubbleAction: ["Next"],
        SpeechSynthesisAction: "and slowly rotate to your right"
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
        RobotSpeechbubbleAction: "and slowly rotate to your right",
        HumanSpeechbubbleAction: ["Next"],
        SpeechSynthesisAction: "and slowly rotate to your right"
      }
    };`
  }
  } else if (stateStamped.state === "S${idx +
    1}" && inputD.type === "Features") {
    if (inputC.face.noseAngle < rotateRightNoseAngle) {
      return {
        state: "S${idx + 2}",
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
        SpeechSynthesisAction: "and now slowly rotate to your left"
      }
    };
  } else if (stateStamped.state === "S${idx +
    2}" && inputD.type === "Features") {
    if (inputC.face.noseAngle > rotateLeftNoseAngle) {
      return {
        state: "S${idx + 3}",
        outputs: {
          RobotSpeechbubbleAction: "${
            i !== numRepeats - 1
              ? `and now slowly rotate to your right`
              : `and now take your ear and act like trying to touch right shoulder`
          }",
          HumanSpeechbubbleAction: ["Next"],
          SpeechSynthesisAction: "${
            i !== numRepeats - 1
              ? `and now slowly rotate to your right`
              : `and now take your ear and act like trying to touch right shoulder`
          }"
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
        SpeechSynthesisAction: "and now take your ear and act like trying to touch right shoulder"
      }
    };
  } else if (stateStamped.state === "S${idx +
    1}" && inputD.type === "Features") {
    if (inputC.face.faceAngle > touchRighFaceAngle) {
      return {
        state: "S${idx + 2}",
        outputs: {
          RobotSpeechbubbleAction: "and now take your ear and act like trying to touch left shoulder",
          HumanSpeechbubbleAction: ["Next"],
          SpeechSynthesisAction: "and now take your ear and act like trying to touch left shoulder"
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
        SpeechSynthesisAction: "and now take your ear and act like trying to touch left shoulder"
      }
    };
  } else if (stateStamped.state === "S${idx +
    2}" && inputD.type === "Features") {
    if (inputC.face.faceAngle < touchLeftFaceAngle) {
      return {
        state: "S${idx + 3}",
        outputs: {
          RobotSpeechbubbleAction: "${
            i !== numRepeats - 1
              ? `and now take your ear and act like trying to touch right shoulder`
              : `and now elevate your chin to the ceiling`
          }",
          HumanSpeechbubbleAction: ["Next"],
          SpeechSynthesisAction: "${
            i !== numRepeats - 1
              ? `and now take your ear and act like trying to touch right shoulder`
              : `and now elevate your chin to the ceiling`
          }"
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

    // Look down and up`;
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
        RobotSpeechbubbleAction: "and now elevate your chin to the ceiling",
        HumanSpeechbubbleAction: ["Next"],
        SpeechSynthesisAction: "and now elevate your chin to the ceiling"
      }
    };
  } else if (stateStamped.state === "S${idx +
    1}" && inputD.type === "Features") {
    if (inputC.face.faceHeight < elevateChinFaceHeight) {
      return {
        state: "S${idx + 2}",
        outputs: {
          RobotSpeechbubbleAction: "and now bring your chin back to the normal position",
          HumanSpeechbubbleAction: ["Next"],
          SpeechSynthesisAction: "and now bring your chin back to the normal position"
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
        RobotSpeechbubbleAction: "and now bring your chin back to the normal position",
        HumanSpeechbubbleAction: ["Next"],
        SpeechSynthesisAction: "and now bring your chin back to the normal position"
      }
    };
  } else if (stateStamped.state === "S${idx +
    2}" && inputD.type === "Features") {
    if (inputC.face.faceHeight > tuckChinFaceHeight) {
      return {
        state: "S${idx + 3}",
        outputs: {
          RobotSpeechbubbleAction: "${
            i !== numRepeats - 1
              ? `and now elevate your chin to the ceiling`
              : `Great job!`
          }",
          HumanSpeechbubbleAction: ["Next"],
          SpeechSynthesisAction: "${
            i !== numRepeats - 1
              ? `and now elevate your chin to the ceiling`
              : `Great job!`
          }"
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
        HumanSpeechbubbleAction: "",
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
