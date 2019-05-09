if (process.argv.length < 3) {
  console.error("usage: node story_to_transition.js story.txt");
  process.exit(1);
}

var fs = require("fs");

var defaultParams = {
  engagedMinNoseAngle: 90,
  engagedMaxNoseAngle: 90,
  disengagedMinNoseAngle: 0,
  disengagedMaxNoseAngle: 180,
  disengagedTimeoutIntervalMs: 1000
};


var output =
  `// NOTE: might be called twice if transition and emission fncs are called separately
function transition(state, inputD, inputC, params) {` +
  Object.keys(defaultParams).map(function(key) {
    return `
  var ${key} = params.${key};`;
  }).join('') +
`

  // Happy path
  if (state === "S0" && inputD.type === "START") {
    return {
      state: "S1",
      outputs: {
        RobotSpeechbubbleAction: 'Tap "Hello" when you are ready',
        HumanSpeechbubbleAction: ["Hello"]
      }
    };`;

var lines = fs
  .readFileSync(process.argv[2])
  .toString()
  .split("\n")
  .map(function(line) {
    return line.trim();
  });

lines.map(function(line, i) {
  output += `
  } else if (
    state === "S${i + 1}" &&
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
        RobotSpeechbubbleAction: ${JSON.stringify(line)},
        HumanSpeechbubbleAction: ["Pause"],
        SpeechSynthesisAction: ${JSON.stringify(line)}
      }
    };`;
});

output += `
  } else if (
    state === "S${lines.length + 1}" &&
    inputD.type === "SpeechSynthesisAction" &&
    inputD.status === "SUCCEEDED"
  ) {
    return {
      state: "S${lines.length + 2}",
      outputs: {
        RobotSpeechbubbleAction: "The END",
        HumanSpeechbubbleAction: "",
        SpeechSynthesisAction: "The END"
      }
    };`;


output += `


  // Handle Pause`;
lines.map(function(line, i) {
  output += `
  } else if (
    state === "S${i + 2}" &&
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
lines.map(function(line, i) {
  output += `
  } else if (
    state === "SP${i + 2}" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Resume"
  ) {
    return {
      state: "S${i + 2}",
      outputs: {
        RobotSpeechbubbleAction: ${JSON.stringify(line)},
        HumanSpeechbubbleAction: ["Pause"],
        SpeechSynthesisAction: ${JSON.stringify(line)}
      }
    };`;
});


output += `


  // Proactive Pause`;
lines.map(function(line, i) {
  output += `
  } else if (state === "S${i + 2}" && inputD.type === "Features") {
    if (
      (inputC.face.isVisible &&
        (inputC.face.noseAngle > disengagedMaxNoseAngle ||
          inputC.face.noseAngle < disengagedMinNoseAngle)) ||
      (!inputC.face.isVisible &&
        inputC.face.stamp - inputC.face.stampLastDetected >
          disengagedTimeoutIntervalMs)
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
        state: state,
        outputs: null
      };
    }`;
});


output += `


  // Proactive Resume`;
lines.map(function(line, i) {
  output += `
  } else if (state === "SP${i + 2}" && inputD.type === "Features") {
    if (
      inputC.face.isVisible &&
      (inputC.face.noseAngle < engagedMaxNoseAngle &&
        inputC.face.noseAngle > engagedMinNoseAngle)
    ) {
      return {
        state: "S${i + 2}",
        outputs: {
          RobotSpeechbubbleAction: ${JSON.stringify(line)},
          HumanSpeechbubbleAction: ["Pause"],
          SpeechSynthesisAction: ${JSON.stringify(line)}
        }
      };
    } else {
      return {
        state: state,
        outputs: null
      };
    }`;
});


output += `


  } else {
    return {
      state,
      outputs: null
    };
  }
}


// Params for reactive behavior
var defaultParams = ${JSON.stringify(defaultParams, null, 2)};

module.exports = {
  transition: transition,
  defaultParams: defaultParams
};
`;

console.log(output);
