if (process.argv.length < 3) {
  console.error("usage: node convert_story_to_transition.js story.txt");
  process.exit(1);
}

const fs = require("fs");
const path = require("path");

const defaultParams = {
  engagedMinNoseAngle: -10,
  engagedMaxNoseAngle: 10,
  disengagedMinNoseAngle: -30,
  disengagedMaxNoseAngle: 30,
  // disengagedMaxNoseAngleStability: 20,
  disengagedTimeoutIntervalCs: 200,
  sets: {
    passive: {
      engagedMinNoseAngle: 0,
      engagedMaxNoseAngle: 0,
      disengagedMinNoseAngle: -90,
      disengagedMaxNoseAngle: 90,
      // disengagedMaxNoseAngleStability: 20,
      disengagedTimeoutIntervalCs: -1
    },
    proactive: {
      engagedMinNoseAngle: -10,
      engagedMaxNoseAngle: 10,
      disengagedMinNoseAngle: -30,
      disengagedMaxNoseAngle: 30,
      // disengagedMaxNoseAngleStability: 20,
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

lines.map((line, i) => {
  output += `
  } else if (
    stateStamped.state === "S${i + 1}" &&
    ${
      i === 0
        ? `inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Hello"`
        : `inputD.type === "SpeechSynthesisAction" &&
    inputD.status === "SUCCEEDED"`
    }
  ) {
    return {
      state: "S${i + 2}",
      outputs: {
        RobotSpeechbubbleAction: {
          type: "IMAGE",
          value: "/public/img/${name}-${i + 1}.png"
        },
        HumanSpeechbubbleAction: ["Pause"],
        SpeechSynthesisAction: {
          text: ${JSON.stringify(line)},
          rate: 0.8,
          afterpauseduration: 3000
        }
      }
    };`;
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
          text: "The END",
          rate: 0.8,
          afterpauseduration: 3000
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
        HumanSpeechbubbleAction: ["Pause"],
        SpeechSynthesisAction: {
          text: ${JSON.stringify(line)},
          rate: 0.8,
          afterpauseduration: 3000
        }
      }
    };`;
});

output += `

    // Proactive Pause`;
lines.map((line, i) => {
  output += `
  } else if (
    stateStamped.state === "S${i + 2}" && inputD.type === "Features"
  ) {
    if (
      inputC.history.humanSpeechbubbleActionResultStamped[0].result !=
          "Resume" && // don't override human
      ((inputC.history.isVisibleStamped[0].isVisible &&
        (inputC.face.noseAngle > disengagedMaxNoseAngle ||
          inputC.face.noseAngle < disengagedMinNoseAngle) &&
        inputC.temporal.maxNoseAngle2Sec < 20) ||  // TODO: use var not 20
        (!inputC.history.isVisibleStamped[0].isVisible &&
          disengagedTimeoutIntervalCs >= 0 && // use disengagedTimeoutIntervalCs < 0 to disable timeout-based proactive pause
          inputC.face.stamp - inputC.history.isVisibleStamped[0].stamp >disengagedTimeoutIntervalCs))
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

    // Proactive Resume`;
lines.map((line, i) => {
  output += `
  } else if (stateStamped.state === "SP${i +
    2}" && inputD.type === "Features") {
    if (
      inputC.face.isVisible &&
      (inputC.face.noseAngle < engagedMaxNoseAngle &&
        inputC.face.noseAngle > engagedMinNoseAngle) &&
      inputC.history.humanSpeechbubbleActionResultStamped[0].result !=
        "Pause" // don't override human
    ) {
      return {
        state: "S${i + 2}",
        outputs: {
          RobotSpeechbubbleAction: {
            type: "IMAGE",
            value: "/public/img/${name}-${i + 1}.png"
          },
          HumanSpeechbubbleAction: ["Pause"],
          SpeechSynthesisAction: {
            text: ${JSON.stringify(`, , , ${line}`)},
            rate: 0.8,
            afterpauseduration: 3000
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
