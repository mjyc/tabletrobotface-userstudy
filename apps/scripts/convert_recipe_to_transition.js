if (process.argv.length < 3) {
  console.error("usage: node convert_recipe_to_transition.js recipe.json");
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


// Header
var output = `// NOTE: might be called twice if transition and emission fncs are called separately
function transition(state, inputD, inputC, params) {

  if (state === "S0" && inputD.type === "START") {
    return {
      state: "S1",
      outputs: {
        RobotSpeechbubbleAction: 'Tap "Hello" when you are ready',
        HumanSpeechbubbleAction: ["Hello"]
      }
    };`;

var lines = JSON.parse(fs.readFileSync(process.argv[2])).ingredients.map(
  function(line) {
    return line.trim();
  }
);

// Happy path
lines.map(function(line, i) {
  output += `
  } else if (
    state === "S${i + 1}" &&
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
        HumanSpeechbubbleAction: ${i === 0 ? `["Next"]` : `["Go back", "Next"]`}
      }
    };`;
});

output += `
  } else if (
    state === "S${lines.length + 1}" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Next"
  ) {
    return {
      state: "S${lines.length + 2}",
      outputs: {
        RobotSpeechbubbleAction: "You are done!",
        HumanSpeechbubbleAction: "",
        SpeechSynthesisAction: "You are done!"
      }
    };`;


// Handle Go back
output += `


  // Handle Go back`;
lines.map(function(_, i) {
  output += `
  } else if (
    state === "S${i + 3}" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Go back"
  ) {
    return {
      state: "S${i + 2}",
      outputs: {
        RobotSpeechbubbleAction: ${JSON.stringify(lines[i])},
        HumanSpeechbubbleAction: ${i === 1 ? `["Next"]` : `["Go back", "Next"]`}
      }
    };`;
});


// Footer
output += `


  } else {
    return {
      state,
      outputs: null
    };
  }
}


// Params for reactive behavior
var defaultParams = {
  engagedMinNoseAngle: 90,
  engagedMaxNoseAngle: 90,
  disengagedMinNoseAngle: 0,
  disengagedMaxNoseAngle: 180,
  disengagedTimeoutIntervalMs: 1000
};

module.exports = {
  transition: transition,
  defaultParams: defaultParams
};
`;

console.log(output);
