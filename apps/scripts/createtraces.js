#!/usr/bin/env node

const fs = require("fs");
const xs = require("xstream").default;
const { mockTimeSource } = require("@cycle/time");
const log = require("loglevel-debug")("createtraces");

//==============================================================================
export function input(
  {
    // command,
    // state,
    // FacialExpressionAction,
    // RobotSpeechbubbleAction,
    // HumanSpeechbubbleAction,
    // AudioPlayerAction,
    // SpeechSynthesisAction,
    // SpeechRecognitionAction,
    PoseDetection
    // VAD
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
  const faceFeatures$ = PoseDetection.events("poses")
    .map(poses => extractFaceFeatures(poses))
    .startWith(defaultFaceFeatures);
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
//==============================================================================

// load file
const filename = process.argv[2];
if (!filename) {
  log.error("usage: ./createtraces {filename}");
  process.exit(1);
}
const data = JSON.parse(fs.readFileSync(filename));

// restore streams
const Time = mockTimeSource();
const { schedule, currentTime } = Time.createOperator();
const sources = Object.keys(data).reduce(
  (prev, label) => ({
    ...prev,
    label: xs.create({
      start: listener => {
        data[label].map(event => {
          schedule.next(listener, currentTime() + event.time, event.value);
        });
      },
      stop: () => {}
    })
  }),
  {}
);

// test
Object.keys(sources).map(label =>
  sources[label].addListener({
    next: v => console.log(label, v)
  })
);
Time.run();
