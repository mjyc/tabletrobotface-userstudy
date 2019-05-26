import xs from "xstream";
import sampleCombine from "xstream/extra/sampleCombine";
import pairwise from "xstream/extra/pairwise";
import throttle from "xstream/extra/throttle";
import dropRepeats from "xstream/extra/dropRepeats";
import { initGoal } from "@cycle-robot-drivers/action";
import {
  maxDiff,
  maxDiffReverse,
  defaultFaceFeatures,
  extractFaceFeatures
} from "tabletrobotface-userstudy";

function input(
  {
    command,
    state,
    FacialExpressionAction,
    RobotSpeechbubbleAction,
    HumanSpeechbubbleAction,
    AudioPlayerAction,
    SpeechSynthesisAction,
    SpeechRecognitionAction,
    PoseDetection,
    VAD
  },
  bufferSize = 10
) {
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

  // extract face features
  const faceFeatures$ = PoseDetection.events("poses").map(poses =>
    extractFaceFeatures(poses)
  );
  // extract voice features
  const voiceFeatures$ = VAD.fold(
    (prev, { type, value }) => {
      const stamp = Date.now();
      const vadState =
        type === "START"
          ? "ACTIVE"
          : type === "STOP"
          ? "INACTIVE"
          : prev.vadState;
      return {
        stamp,
        vadState,
        vadLevel: type === "UPDATE" ? value : prev.vadLevel
      };
    },
    {
      stamp: 0,
      vadState: "INACTIVE",
      vadLevel: 0
    }
  ).compose(throttle(100)); // 10hz
  // extract history features
  const stateStampedHistory$ = state.stream
    .filter(s => !!s.fsm && !!s.fsm.stateStamped)
    .map(s => s.fsm.stateStamped)
    .compose(dropRepeats((x, y) => x.state === y.state))
    .compose(pairwise)
    .compose(pairwise)
    .map(([[x, y], [_, z]]) => [z, y, x])
    .startWith([...Array(3)].map(_ => ({ state: "", stamp: 0 })));
  const isVisibleStampedHistory$ = faceFeatures$
    .map(ff => ({ isVisible: ff.isVisible, stamp: ff.stamp }))
    .compose(dropRepeats((x, y) => x.isVisible === y.isVisible))
    .compose(pairwise)
    .compose(pairwise)
    .map(([[x, y], [_, z]]) => [z, y, x])
    .startWith([...Array(3)].map(_ => ({ isVisible: "", stamp: 0 })));
  const vadStateStampedHistory$ = voiceFeatures$
    .map(vf => ({ vadState: vf.vadState, stamp: vf.stamp }))
    .compose(dropRepeats((x, y) => x.vadState === y.vadState))
    .compose(pairwise)
    .compose(pairwise)
    .map(([[x, y], [_, z]]) => [z, y, x])
    .startWith([...Array(3)].map(_ => ({ vadState: "", stamp: 0 })));

  const inputC$ = xs
    .combine(
      faceFeatures$,
      voiceFeatures$,
      stateStampedHistory$,
      isVisibleStampedHistory$,
      vadStateStampedHistory$
    )
    .map(
      ([
        faceFeatures,
        voiceFeatures,
        stateStampedHistory,
        isVisibleStampedHistory,
        vadStateStampedHistory
      ]) => {
        return {
          face: faceFeatures,
          voice: voiceFeatures,
          history: {
            stateStamped: stateStampedHistory,
            isVisibleStamped: isVisibleStampedHistory,
            vadStateStamped: vadStateStampedHistory
          }
        };
      }
    );
  return xs.merge(
    command$,
    inputD$.compose(sampleCombine(inputC$)).map(([inputD, inputC]) => ({
      type: "FSM_INPUT",
      discrete: inputD,
      continuous: inputC
    })),
    inputC$
      .map(inputC => ({
        type: "FSM_INPUT",
        discrete: { type: "Features" },
        continuous: inputC
      }))
      .compose(throttle(100)) // 10hz
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
      const stamp = Date.now();
      return {
        ...prev,
        fsm: {
          stateStamped: {
            stamp,
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
      const prevStateStamped = prev.fsm.stateStamped;
      const inputD = input.discrete;
      const inputC = input.continuous;
      // console.log(
      //   "inputC.face.maxNosePosXQuarter",
      //   inputC.face.maxNosePosXQuarter,
      //   "inputC.face.maxNosePosYQuarter",
      //   inputC.face.maxNosePosYQuarter,
      //   "inputC.face.maxFaceAngleQuarter",
      //   inputC.face.maxFaceAngleQuarter
      // );
      // console.log(
      //   "inputC.voice.vadLevel",
      //   inputC.voice.vadLevel,
      //   "inputC.voice.vadState",
      //   inputC.voice.vadState
      // );
      const state = prev.fsm.transition(prevStateStamped, inputD, inputC);
      const stamp = Date.now();
      const stateStamped = {
        // new state
        state,
        stamp
      };
      const outputs = wrapOutputs(
        prev.fsm.emission(prevStateStamped, inputD, inputC)
      );
      return {
        ...prev,
        fsm: {
          ...prev.fsm,
          stateStamped
        },
        outputs,
        trace: {
          prevStateStamped,
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
