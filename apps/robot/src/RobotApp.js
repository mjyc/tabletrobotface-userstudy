import xs from "xstream";
import sampleCombine from "xstream/extra/sampleCombine";
import { initGoal } from "@cycle-robot-drivers/action";
import {
  defaultFaceFeatures,
  extractFaceFeatures
} from "../../scripts/features.js";

function input({
  command,
  FacialExpressionAction,
  RobotSpeechbubbleAction,
  HumanSpeechbubbleAction,
  AudioPlayerAction,
  SpeechSynthesisAction,
  SpeechRecognitionAction,
  PoseDetection
}) {
  const command$ = command.filter(cmd => cmd.type === "LOAD_FSM");
  const inputD$ = xs.merge(
    command
      .filter(cmd => cmd.type === "START_FSM")
      .mapTo({
        type: "START"
      }),
    FacialExpressionAction.result.map(r => ({
      type: "FacialExpressionAction",
      status: r.status.status,
      result: r.result
    })),
    RobotSpeechbubbleAction.result.map(r => ({
      type: "RobotSpeechbubbleAction",
      status: r.status.status,
      result: r.result
    })),
    HumanSpeechbubbleAction.result.map(r => ({
      type: "HumanSpeechbubbleAction",
      status: r.status.status,
      result: r.result
    })),
    AudioPlayerAction.result.map(r => ({
      type: "AudioPlayerAction",
      status: r.status.status,
      result: r.result
    })),
    SpeechSynthesisAction.result.map(r => ({
      type: "SpeechSynthesisAction",
      status: r.status.status,
      result: r.result
    })),
    SpeechRecognitionAction.result.map(r => ({
      type: "SpeechRecognitionAction",
      status: r.status.status,
      result: r.result
    }))
  );
  const inputC$ = PoseDetection.events("poses").fold(
    (prev, poses) => {
      const features = extractFaceFeatures(poses);
      const stampLastDetected = !!features.isVisible
        ? Date.now()
        : prev.face.stampLastDetected;
      return {
        face: {
          stampLastDetected: stampLastDetected,
          faceAngle: !!features.isVisible
            ? (features.faceOrientation / Math.PI) * 180
            : 0,
          noseAngle: !!features.isVisible
            ? (features.noseOrientation / Math.PI) * 180
            : 0,
          ...features
        },
        poses
      };
    },
    { face: { stampLastDetected: 0, ...defaultFaceFeatures }, poses: [] }
  );
  return xs.merge(
    command$,
    inputD$.compose(sampleCombine(inputC$)).map(([inputD, inputC]) => ({
      type: "FSM_INPUT",
      discrete: inputD,
      continuous: inputC
    })),
    inputC$.map(inputC => ({
      type: "FSM_INPUT",
      discrete: { type: "Features" },
      continuous: inputC
    }))
  );
}

function transitionReducer(input$) {
  const initReducer$ = xs.of(prev => {
    return {
      fsm: null,
      outputs: null
    };
  });

  const wrapOutputs = (outputs = {}) => {
    return outputs !== null
      ? Object.keys(outputs).reduce(
          (prev, name) => ({
            ...prev,
            [name]:
              outputs[name].hasOwnProperty("goal") &&
              outputs[name].hasOwnProperty("cancel")
                ? {
                    ...outputs[name],
                    goal: initGoal(outputs[name].goal)
                  }
                : {
                    goal: initGoal(outputs[name])
                    // no cancel
                  }
          }),
          {}
        )
      : outputs;
  };

  const inputReducer$ = input$.map(input => prev => {
    if (input.type === "LOAD_FSM") {
      return {
        ...prev,
        fsm: {
          stateStamped: {
            stamp: Date.now(),
            state: input.value.S0
          },
          transition: input.value.T,
          emission: input.value.G
        },
        trace: null,
        outputs: null
      };
    } else if (input.type === "FSM_INPUT") {
      if (prev.fsm === null) {
        console.warn(`FSM not loaded; skipping`);
        return {
          ...prev,
          outputs: null
        };
      }
      const prevState = prev.fsm.stateStamped.state;
      const inputD = input.discrete;
      const inputC = input.continuous;
      const stateStamped = {
        // new state
        state: prev.fsm.transition(prevState, inputD, inputC),
        stamp: Date.now()
      };
      const outputs = wrapOutputs(prev.fsm.emission(prevState, inputD, inputC));
      return {
        ...prev,
        fsm: {
          ...prev.fsm,
          stateStamped
        },
        outputs,
        trace: {
          prevStateStamped: prev.fsm.stateStamped,
          input,
          stateStamped,
          outputs
        }
      };
    } else {
      console.warn(`Unknown input.type=${input.type}; skipping`);
      return {
        ...prev,
        outputs: null
      };
    }
  });

  return xs.merge(initReducer$, inputReducer$);
}

function output(reducerState$) {
  const outputs$ = reducerState$
    .filter(rs => !!rs.outputs)
    .map(rs => rs.outputs);
  return {
    FacialExpressionAction: {
      goal: outputs$
        .filter(
          o => !!o.FacialExpressionAction && !!o.FacialExpressionAction.goal
        )
        .map(o => o.FacialExpressionAction.goal),
      cancel: outputs$
        .filter(
          o => !!o.FacialExpressionAction && !!o.FacialExpressionAction.cancel
        )
        .map(o => o.FacialExpressionAction.cancel)
    },
    RobotSpeechbubbleAction: {
      goal: outputs$
        .filter(
          o => !!o.RobotSpeechbubbleAction && !!o.RobotSpeechbubbleAction.goal
        )
        .map(o => o.RobotSpeechbubbleAction.goal),
      cancel: outputs$
        .filter(
          o => !!o.RobotSpeechbubbleAction && !!o.RobotSpeechbubbleAction.cancel
        )
        .map(o => o.RobotSpeechbubbleAction.cancel)
    },
    HumanSpeechbubbleAction: {
      goal: outputs$
        .filter(
          o => !!o.HumanSpeechbubbleAction && !!o.HumanSpeechbubbleAction.goal
        )
        .map(o => o.HumanSpeechbubbleAction.goal),
      cancel: outputs$
        .filter(
          o => !!o.HumanSpeechbubbleAction && !!o.HumanSpeechbubbleAction.cancel
        )
        .map(o => o.HumanSpeechbubbleAction.cancel)
    },
    AudioPlayerAction: {
      goal: outputs$
        .filter(o => !!o.AudioPlayerAction && !!o.AudioPlayerAction.goal)
        .map(o => o.AudioPlayerAction.goal),
      cancel: outputs$
        .filter(o => !!o.AudioPlayerAction && !!o.AudioPlayerAction.canel)
        .map(o => o.AudioPlayerAction.cancel)
    },
    SpeechSynthesisAction: {
      goal: outputs$
        .filter(
          o => !!o.SpeechSynthesisAction && !!o.SpeechSynthesisAction.goal
        )
        .map(o => o.SpeechSynthesisAction.goal),
      cancel: outputs$
        .filter(
          o => !!o.SpeechSynthesisAction && !!o.SpeechSynthesisAction.cancel
        )
        .map(o => o.SpeechSynthesisAction.cancel)
    },
    SpeechRecognitionAction: {
      goal: outputs$
        .filter(
          o => !!o.SpeechRecognitionAction && !!o.SpeechRecognitionAction.goal
        )
        .map(o => o.SpeechRecognitionAction.goal),
      cancel: outputs$
        .filter(
          o => !!o.SpeechRecognitionAction && !!o.SpeechRecognitionAction.cancel
        )
        .map(o => o.SpeechRecognitionAction.cancel)
    }
  };
}

export function RobotApp(sources) {
  // sources.state.stream.addListener({next: s => console.debug('RobotApp state', s)});

  const input$ = input(sources);
  const reducer = transitionReducer(input$);
  const outputs = output(sources.state.stream);

  return {
    state: reducer,
    ...outputs
  };
}
