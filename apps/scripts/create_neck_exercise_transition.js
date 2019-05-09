// if (process.argv.length < 2) {
//   console.error("usage: node story_to_transition.js [num_repeats]");
//   process.exit(1);
// }

var numRepeats = !process.argv[2] ? 2 : process.argv[2];

var output = `// NOTE: might be called twice if transition and emission fncs are called separately
function transition(state, inputD, inputC, params) {

  if (state === "S0" && inputD.type === "START") {
    return {
      state: "S1",
      outputs: {
        RobotSpeechbubbleAction: 'Tap "Hello" when you are ready',
        HumanSpeechbubbleAction: ["Hello"]
      }
    };
  } else if (
    state === "S1" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Hello"
  ) {
    return {
      state: "S2",
      outputs: {
        RobotSpeechbubbleAction: "Let's exercise your neck! Let's start from looking forward",
        HumanSpeechbubbleAction: ["Next"],
        SpeechSynthesisAction: "Let's exercise your neck! Let's start from looking forward"
      }
    };`;

var idx = 2;
for (var i = 0; i < numRepeats; i++) {
  output += `} else if (
    state === "S${idx}" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Next"
  ) {
    return {
      state: "S${idx+1}",
      outputs: {
        RobotSpeechbubbleAction: "and slowly rotate to your right",
        HumanSpeechbubbleAction: ["Next"],
        SpeechSynthesisAction: "and slowly rotate to your right"
      }
    };
  } else if (
    state === "S${idx+1}" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Next"
  ) {
    return {
      state: "S${idx+2}",
      outputs: {
        RobotSpeechbubbleAction: "and now slowly rotate to your left",
        HumanSpeechbubbleAction: ["Next"],
        SpeechSynthesisAction: "and now slowly rotate to your left"
      }
    };`
  idx += 2;
}

for (var i = 0; i < numRepeats; i++) {
  output += `} else if (
    state === "S${idx}" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Next"
  ) {
    return {
      state: "S${idx+1}",
      outputs: {
        RobotSpeechbubbleAction: "and now take your ear and act like trying to touch right shoulder",
        HumanSpeechbubbleAction: ["Next"],
        SpeechSynthesisAction: "and now take your ear and act like trying to touch right shoulder"
      }
    };
  } else if (
    state === "S${idx+1}" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Next"
  ) {
    return {
      state: "S${idx+2}",
      outputs: {
        RobotSpeechbubbleAction: "and now take your ear and act like trying to touch left shoulder",
        HumanSpeechbubbleAction: ["Next"],
        SpeechSynthesisAction: "and now take your ear and act like trying to touch left shoulder"
      }
    };`
  idx += 2;
}

for (var i = 0; i < numRepeats; i++) {
  output += `} else if (
    state === "S${idx}" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Next"
  ) {
    return {
      state: "S${idx+1}",
      outputs: {
        RobotSpeechbubbleAction: "and now tuck your chin into the chest",
        HumanSpeechbubbleAction: ["Next"],
        SpeechSynthesisAction: "and now tuck your chin into the chest"
      }
    };
  } else if (
    state === "S${idx+1}" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Next"
  ) {
    return {
      state: "S${idx+2}",
      outputs: {
        RobotSpeechbubbleAction: "and now elevate your chin to the ceiling",
        HumanSpeechbubbleAction: ["Next"],
        SpeechSynthesisAction: "and now elevate your chin to the ceiling"
      }
    };`
  idx += 2;
}

output += `
  } else if (
    state === "S${idx}" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Next"
  ) {
    return {
      state: "S${idx+1}",
      outputs: {
        RobotSpeechbubbleAction: "Great job!",
        HumanSpeechbubbleAction: "",
        SpeechSynthesisAction: "Great job!"
      }
    };`

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
