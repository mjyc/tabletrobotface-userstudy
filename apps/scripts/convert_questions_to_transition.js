if (process.argv.length < 3) {
  console.error("usage: node convert_questions_to_transition.js story.txt");
  process.exit(1);
}

var fs = require("fs");

var defaultParams = {
  timeout: 2000
};

var output =
  `// NOTE: might be called twice if transition and emission fncs are called separately
function transition(stateStamped, inputD, inputC, params) {` +
  Object.keys(defaultParams)
    .map(function(key) {
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
  } else if (
    stateStamped.state === "S${i + 2}" && inputD.type === "Features"
  ) {
    if (
      stateStamped.stampLastChanged < inputC.voice.stampLastChanged &&
      inputC.voice.vadState === 'INACTIVE' &&
      stateStamped.stamp - inputC.voice.stampLastChanged > timeout
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
};
`;

console.log(output);
