if (process.argv.length < 3) {
  console.error("usage: node convert_story_to_transition.js story.txt");
  process.exit(1);
}

const fs = require("fs");
const path = require("path");

const defaultParams = {
  engagedMinNoseAngle: -10,
  engagedMaxNoseAngle: 10,
  disengagedMinNoseAngle: -15,
  disengagedMaxNoseAngle: 15,
  disengagedMaxMaxNoseAngle1Sec: 20,
  disengagedTimeoutIntervalCs: 200,
  sets: {
    passive: {
      engagedMinNoseAngle: 0,
      engagedMaxNoseAngle: 0,
      disengagedMinNoseAngle: -90,
      disengagedMaxNoseAngle: 90,
      disengagedMaxMaxNoseAngle1Sec: -1,
      disengagedTimeoutIntervalCs: -1
    },
    proactive: {
      engagedMinNoseAngle: -10,
      engagedMaxNoseAngle: 10,
      disengagedMinNoseAngle: -15,
      disengagedMaxNoseAngle: 15,
      disengagedMaxMaxNoseAngle1Sec: 20,
      disengagedTimeoutIntervalCs: 200
    }
  }
};

let output =
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

  // Happy path
  if (stateStamped.state === "S0" && inputD.type === "START") {
    return {
      state: "S1",
      outputs: {
        RobotSpeechbubbleAction: 'Tap "Hello" when you are ready',
        HumanSpeechbubbleAction: ["Hello"]
      }
    };`;

const name = path.parse(process.argv[2]).name;
const lines = fs
  .readFileSync(process.argv[2])
  .toString()
  .split("\n")
  .map(line => {
    return line.trim();
  });

output += `
  } else if (
    stateStamped.state === "S1" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Hello"
  ) {
    return {
      state: "S2",
      outputs: {
        RobotSpeechbubbleAction: {
          type: "IMAGE",
          value: "/public/img/${name}-1.png"
        },
        HumanSpeechbubbleAction: ["Pause", "Next"],
        SpeechSynthesisAction: {
          goal_id: {
            id: ${JSON.stringify(lines[0])},
            stamp: Date.now()
          },
          goal: {
            text: ${JSON.stringify(lines[0])},
            rate: 0.8,
            afterpauseduration: 3000
          }
        }
      }
    };`;

lines.map((line, i) => {
  if (i === 0) return;
  output += `
  } else if (
    stateStamped.state === "S${i + 1}" && inputD.type === "Features"
  ) {
    if (  // Proactive Next
      disengagedMaxMaxNoseAngle1Sec >= 0 && // use disengagedMaxMaxNoseAngle1Sec < 0 to disable proactive next
      inputC.history.speechSynthesisActionResultStamped[0].goal_id.id ===
        ${JSON.stringify(lines[i - 1])} &&
      inputC.face.isVisible &&
      inputC.face.noseAngle < disengagedMaxNoseAngle &&
      inputC.face.noseAngle > disengagedMinNoseAngle &&
      inputC.temporal.maxNoseAngle1Sec < disengagedMaxMaxNoseAngle1Sec
    ) {
      return {
        state: "S${i + 2}",
        outputs: {
          RobotSpeechbubbleAction: {
            type: "IMAGE",
            value: "/public/img/${name}-${i + 1}.png"
          },
          HumanSpeechbubbleAction: ["Pause", "Next"],
          SpeechSynthesisAction: {
            goal_id: {
              id: ${JSON.stringify(line)},
              stamp: Date.now()
            },
            goal: {
              text: ${JSON.stringify(line)},
              rate: 0.8,
              afterpauseduration: 3000
            }
          }
        }
      };
    } else if (  // Proactive Pause
      disengagedTimeoutIntervalCs >= 0 && // use disengagedTimeoutIntervalCs < 0 to disable proactive pause
      inputC.history.humanSpeechbubbleActionResultStamped[0].result !=
          "Resume" && // don't override human
      !inputC.history.isVisibleStamped[0].isVisible &&  // not visible
      inputC.face.stamp - inputC.history.isVisibleStamped[0].stamp > disengagedTimeoutIntervalCs * 10
    ) {
      return {
        state: "SP${i + 2}",
        outputs: {
          RobotSpeechbubbleAction: 'Tap "Resume" when you are ready',
          HumanSpeechbubbleAction: ["Resume"],
          SpeechSynthesisAction: " "
        }
      };
    } else {
      return {
        state: stateStamped.state,
        outputs: null
      };
    }`;
});

output += `
  } else if (
    stateStamped.state === "S${lines.length + 1}" &&
    inputD.type === "SpeechSynthesisAction" &&
    inputD.status === "SUCCEEDED"
  ) {
    return {
      state: "S${lines.length + 2}",
      outputs: {
        RobotSpeechbubbleAction: "The END",
        HumanSpeechbubbleAction: "",
        SpeechSynthesisAction: {
          goal_id: {
            id: "The END",
            stamp: Date.now()
          },
          goal: {
            text: "The END",
            rate: 0.8,
            afterpauseduration: 3000
          }
        }
      }
    };`;

output += `

    // Handle Next`;
lines.map((line, i) => {
  output += `
  } else if (
    stateStamped.state === "S${i + 1}" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Next"
  ) {
    return {
      state: "S${i + 2}",
      outputs: {
        RobotSpeechbubbleAction: {
          type: "IMAGE",
          value: "/public/img/${name}-${i + 1}.png"
        },
        HumanSpeechbubbleAction: ["Pause", "Next"],
        SpeechSynthesisAction: {
          goal_id: {
            id: ${JSON.stringify(line)},
            stamp: Date.now()
          },
          goal: {
            text: ${JSON.stringify(line)},
            rate: 0.8,
            afterpauseduration: 3000
          }
        }
      }
    };`;
});

output += `
  } else if (
    stateStamped.state === "S${lines.length + 1}" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Next"
  ) {
    return {
      state: "S${lines.length + 2}",
      outputs: {
        RobotSpeechbubbleAction: "The END",
        HumanSpeechbubbleAction: "",
        SpeechSynthesisAction: {
          goal_id: {
            id: "The END",
            stamp: Date.now()
          },
          goal: {
            text: "The END",
            rate: 0.8,
            afterpauseduration: 3000
          }
        }
      }
    };`;

output += `

    // Handle Pause`;
lines.map((line, i) => {
  output += `
  } else if (
    stateStamped.state === "S${i + 2}" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Pause"
  ) {
    return {
      state: "SP${i + 2}",
      outputs: {
        RobotSpeechbubbleAction: 'Tap "Resume" when you are ready',
        HumanSpeechbubbleAction: ["Resume"],
        SpeechSynthesisAction: " "
      }
    };`;
});

output += `

    // Handle Resume`;
lines.map((line, i) => {
  output += `
  } else if (
    stateStamped.state === "SP${i + 2}" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Resume"
  ) {
    return {
      state: "S${i + 2}",
      outputs: {
        RobotSpeechbubbleAction: {
          type: "IMAGE",
          value: "/public/img/${name}-${i + 1}.png"
        },
        HumanSpeechbubbleAction: ["Pause", "Next"],
        SpeechSynthesisAction: {
          goal_id: {
            id: ${JSON.stringify(line)},
            stamp: Date.now()
          },
          goal: {
            text: ${JSON.stringify(line)},
            rate: 0.8,
            afterpauseduration: 3000
          }
        }
      }
    };`;
});

output += `

    // Proactive Resume`;
lines.map((line, i) => {
  output += `
  } else if (stateStamped.state === "SP${i +
    2}" && inputD.type === "Features") {
    if (
      inputC.history.humanSpeechbubbleActionResultStamped[0].result !=
        "Pause" && // don't override human
      inputC.face.isVisible &&
      (inputC.face.noseAngle < engagedMaxNoseAngle &&
        inputC.face.noseAngle > engagedMinNoseAngle)
    ) {
      return {
        state: "S${i + 2}",
        outputs: {
          RobotSpeechbubbleAction: {
            type: "IMAGE",
            value: "/public/img/${name}-${i + 1}.png"
          },
          HumanSpeechbubbleAction: ["Pause", "Next"],
          SpeechSynthesisAction: {
            goal_id: {
              id: ${JSON.stringify(line)},
              stamp: Date.now()
            },
            goal: {
              text: ${JSON.stringify(`, , , , , , Let's see... ${line}`)},
              rate: 0.8,
              afterpauseduration: 3000
            }
          }
        }
      };
    } else {
      return {
        state: stateStamped.state,
        outputs: null
      };
    }`;
});

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
