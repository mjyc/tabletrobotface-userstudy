// NOTE: might be called twice if transition and emission fncs are called separately
export function transition(state, input) {
  if (state === "S0" && input.type === "START") {
    return {
      state: "S1",
      outputs: {
        RobotSpeechbubbleAction: "Click 'Hello when you are ready'",
        HumanSpeechbubbleAction: ["Next"],
        AudioPlayerAction: "/public/snd/G12.ogg"
      }
    };
  } else if (
    state === "S1" &&
    input.type === "HumanSpeechbubbleAction" &&
    input.status === "SUCCEEDED" &&
    input.result === "Next"
  ) {
    return {
      state: "S2",
      outputs: {
        RobotSpeechbubbleAction: "Answer the robot",
        HumanSpeechbubbleAction: ["Next"],
        AudioPlayerAction: "/public/snd/G12.ogg"
      }
    };
  } else if (
    state === "S2" &&
    input.type === "HumanSpeechbubbleAction" &&
    input.status === "SUCCEEDED" &&
    input.result === "Next"
  ) {
    return {
      state: "S3",
      outputs: {
        RobotSpeechbubbleAction: "Repeat if you like. Otherwise, you are done!",
        HumanSpeechbubbleAction: "",
        AudioPlayerAction: "/public/snd/G12.ogg"
      }
    };
  } else {
    return {
      state,
      outputs: null
    };
  }
}
