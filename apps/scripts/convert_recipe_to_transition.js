if (process.argv.length < 3) {
  console.error("usage: node convert_recipe_to_transition.js recipe.json");
  process.exit(1);
}

const fs = require("fs");

const defaultParams = {
  nextTimeoutIntervalMs: 1000
};

let output =
  `// NOTE: might be called twice if transition and emission fncs are called separately
function transition(stateStamped, inputD, inputC, params) {` +
  Object.keys(defaultParams)
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

const lines = JSON.parse(fs.readFileSync(process.argv[2])).ingredients.map(
  line => {
    return line.trim();
  }
);

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
        HumanSpeechbubbleAction: ${
          i === 0 ? `["Next"]` : `["Go back", "Next"]`
        },
        SpeechSynthesisAction: ${JSON.stringify(line)}
      }
    };
  } else if (stateStamped.state === "S${i + 2}" && inputD.type === "Features") {
    if (
      inputC.face.isVisible &&
      inputC.face.stamp - inputC.history.stateStamped[0].stamp >
        inputC.face.stamp - inputC.history.isVisibleStamped[1].stamp &&
      inputC.face.stamp - inputC.history.isVisibleStamped[1].stamp >
        nextTimeoutIntervalMs
    ) {
      return {
        state: "S${i + 3}",
        outputs: {
          RobotSpeechbubbleAction: ${
            i !== lines.length - 1
              ? JSON.stringify(lines[i + 1])
              : `"You are done!"`
          },
          HumanSpeechbubbleAction: ${
            i !== lines.length - 1 ? `["Go back", "Next"]` : `""`
          },
          SpeechSynthesisAction: ${
            i !== lines.length - 1
              ? JSON.stringify(lines[i + 1])
              : `"You are done!"`
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
  } else if (
    stateStamped.state === "S${lines.length + 1}" &&
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

output += `

    // Handle Go back`;
lines.map((_, i) => {
  output += `
  } else if (
    stateStamped.state === "S${i + 3}" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Go back"
  ) {
    return {
      state: "S${i + 2}",
      outputs: {
        RobotSpeechbubbleAction: ${JSON.stringify(lines[i])},
        HumanSpeechbubbleAction: ${
          i === 1 ? `["Next"]` : `["Go back", "Next"]`
        },
        SpeechSynthesisAction: ${JSON.stringify(lines[i])}
      }
    };`;
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
