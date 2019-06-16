if (process.argv.length < 3) {
  console.error("usage: node convert_questions_to_transition.js story.txt");
  process.exit(1);
}

const fs = require("fs");

const defaultParams = {
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
        : `inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Next"`
    }
  ) {
    return {
      state: "S${i + 2}",
      outputs: {
        RobotSpeechbubbleAction: ${JSON.stringify(line)},
        HumanSpeechbubbleAction: ["Next"],
        SpeechSynthesisAction: ${JSON.stringify(line)}
      }
    };
  } else if (stateStamped.state === "S${i + 2}" && inputD.type === "Features") {
    if (
      timeoutCm >= 0 &&
      minSpeakDurationCm >= 0 &&
      minTurnDurationCm >= 0 &&
      engagedMaxMaxNoseAngle1Sec >= 0 &&
      inputC.voice.vadState === "INACTIVE" &&
      inputC.history.stateStamped[0].state === "S${i + 2}" &&
      inputC.history.vadStateStamped[0].vadState === "INACTIVE" &&
      inputC.history.stateStamped[0].stamp < inputC.history.vadStateStamped[1].stamp &&
      inputC.history.vadStateStamped[0].stamp - inputC.history.vadStateStamped[1].stamp > minSpeakDurationCm * 10 &&
      inputC.face.stamp - inputC.history.stateStamped[0].stamp > minTurnDurationCm * 10 &&
      inputC.face.stamp - inputC.history.vadStateStamped[0].stamp > timeoutCm * 10 &&
      (inputC.face.isVisible &&
        (inputC.face.noseAngle < engagedMaxNoseAngle &&
          inputC.face.noseAngle > engagedMinNoseAngle) &&
        inputC.temporal.maxNoseAngle1Sec < disengagedMaxMaxNoseAngle1Sec)
    ) {
      return {${
        i !== lines.length - 1
          ? `
        state: "S${i + 3}",
        outputs: {
          RobotSpeechbubbleAction: ${JSON.stringify(lines[i + 1])},
          HumanSpeechbubbleAction: ["Next"],
          SpeechSynthesisAction: ${JSON.stringify(lines[i + 1])}
        }`
          : `
        state: "S${i + 3}",
        outputs: {
          RobotSpeechbubbleAction: "We are all done!",
          HumanSpeechbubbleAction: "",
          SpeechSynthesisAction: "We are all done!"
        }`
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
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Next"
  ) {
    return {
      state: "S${lines.length + 2}",
      outputs: {
        RobotSpeechbubbleAction: "We are all done!",
        HumanSpeechbubbleAction: "",
        SpeechSynthesisAction: "We are all done!"
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
