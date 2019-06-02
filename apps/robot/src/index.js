document.body.style.backgroundColor = "white";
document.body.style.margin = "0px";

import xs from "xstream";
import delay from "xstream/extra/delay";
import dropRepeats from "xstream/extra/dropRepeats";
import throttle from "xstream/extra/throttle";
import { div } from "@cycle/dom";
import isolate from "@cycle/isolate";
import { run } from "@cycle/run";
import { withState } from "@cycle/state";
import { timeDriver } from "@cycle/time";
import { makeTime$, recordStreams } from "@mjyc/cycle-time-travel";
import { makeTabletFaceDriver } from "@cycle-robot-drivers/screen";
import { makePoseDetectionDriver } from "cycle-posenet-driver";
import {
  initializeTabletFaceRobotDrivers,
  withTabletFaceRobotActions
} from "@cycle-robot-drivers/run";
import {
  mockMediaRecorderSource,
  makeMediaRecorderDriver,
  mockDownloadDataSource,
  makeDownloadDataDriver,
  mockStreamingChartSource,
  makeStreamingChartDriver,
  DataDownloader,
  makeVoiceActivityDetectionDriver,
  vadAdapter,
  defaultFaceFeatures,
  extractFaceFeatures,
  defaultVoiceFeatures,
  extractVoiceFeatures,
  RobotApp
} from "tabletrobotface-userstudy";
import settings from "../../settings_helper";
import transitions from "./transitions";
import FeatureChart, { config } from "./FeatureChart";

function TabletRobotFaceApp(sources) {
  // sources.state.stream.addListener({next: s => console.debug('reducer state', s)});

  const appName =
    Object.keys(transitions).indexOf(settings.robot.name) !== -1
      ? settings.robot.name
      : "demo";
  const transition = transitions[appName].transition;
  const params = transitions[appName].params;
  const S0 = "S0";
  const T = (...args) => transition(...args, params).state;
  const G = (...args) => transition(...args, params).outputs;
  const command$ = xs.merge(
    sources.TabletFace.events("load").mapTo({
      type: "LOAD_FSM",
      value: { S0, T, G }
    }),
    sources.TabletFace.events("load")
      .compose(delay(0))
      .mapTo({
        type: "START_FSM"
      })
  );

  const actionResults$ = xs.merge(
    sources.FacialExpressionAction.result.map(r => ({
      type: "FacialExpressionAction",
      status: r.status.status,
      result: r.result
    })),
    sources.RobotSpeechbubbleAction.result.map(r => ({
      type: "RobotSpeechbubbleAction",
      status: r.status.status,
      result: r.result
    })),
    sources.HumanSpeechbubbleAction.result.map(r => ({
      type: "HumanSpeechbubbleAction",
      status: r.status.status,
      result: r.result
    })),
    sources.AudioPlayerAction.result.map(r => ({
      type: "AudioPlayerAction",
      status: r.status.status,
      result: r.result
    })),
    sources.SpeechSynthesisAction.result.map(r => ({
      type: "SpeechSynthesisAction",
      status: r.status.status,
      result: r.result
    })),
    sources.SpeechRecognitionAction.result.map(r => ({
      type: "SpeechRecognitionAction",
      status: r.status.status,
      result: r.result
    }))
  );
  const fsmUniqueStateStamped$ = sources.state.stream
    .filter(s => !!s.fsm && !!s.fsm.stateStamped)
    .map(s => s.fsm.stateStamped)
    .compose(dropRepeats((x, y) => x.state === y.state));
  // extract face features
  const poses$ = sources.PoseDetection.events("poses");
  const faceFeatures$ = poses$
    .map(poses => extractFaceFeatures(poses))
    .startWith(defaultFaceFeatures);
  // extract voice features
  const vadState$ = sources.VAD.events("state").compose(throttle(100)); // 10hz
  const voiceFeatures$ = vadState$
    .map(state => extractVoiceFeatures(state))
    .startWith(defaultVoiceFeatures);
  const robotSinks = isolate(RobotApp, "RobotApp")({
    state: sources.state,
    command: command$,
    fsmUniqueStateStamped: fsmUniqueStateStamped$,
    actionResults: actionResults$,
    faceFeatures: faceFeatures$,
    voiceFeatures: voiceFeatures$
  });
  return {
    ...robotSinks,
    faceFeatures: faceFeatures$,
    voiceFeatures: voiceFeatures$
  };
}

function main(sources) {
  const options = settings.robot.withTabletFaceRobotActionsOptions;
  const sinks = withState(
    withTabletFaceRobotActions(TabletRobotFaceApp, options)
  )(sources);
  // to save the first event; it gets fired before recording starts
  sinks.DOM = sinks.DOM.remember();

  const featureChart = settings.robot.charts.enabled
    ? isolate(FeatureChart)({DOM: sources.DOM, features: sinks.faceFeatures})
    : {
        DOM: xs.of(""),
        Chart: xs.never()
      };

  if (!settings.robot.recording.enabled) {
    return {
      ...sinks,
      DOM: xs.combine(sinks.DOM, featureChart.DOM).map(vdoms => div(vdoms)),
      Chart: featureChart.Chart
    };
  }

  const dataProxy$ = xs.create();
  const dataDownloader = DataDownloader(sources, dataProxy$);

  const vdom$ = xs
    .combine(sinks.DOM, featureChart.DOM, dataDownloader.DOM)
    .map(vdoms => div(vdoms));

  const videoRecorder$ = xs.merge(
    sources.VideoRecorder.filter(v => v.type === "READY").mapTo("START"),
    dataDownloader.VideoRecorder
  );

  const videoStart$ = sources.VideoRecorder.filter(v => v.type === "START");
  const time$ = makeTime$(sources.Time, xs.of(true), xs.of(0));
  const recordedStreams = recordStreams(
    [
      { stream: sinks.DOM || xs.never(), label: "DOM" },
      { stream: sinks.TabletFace || xs.never(), label: "TabletFace" },
      { stream: sinks.AudioPlayer || xs.never(), label: "AudioPlayer" },
      {
        stream: sinks.SpeechSynthesis || xs.never(),
        label: "SpeechSynthesis"
      },
      {
        stream: sinks.SpeechRecognition || xs.never(),
        label: "SpeechRecognition"
      },
      { stream: sinks.PoseDetection || xs.never(), label: "PoseDetection" },
      { stream: videoStart$, label: "videoStart" },
      { stream: poses$, label: "poses" },
      { stream: vadState$, label: "vadState" }
    ],
    time$
  );
  const data$ = xs.combine.apply(null, recordedStreams).map(recorded => {
    const labels = recorded.map(r => r.label);
    const combined = recorded.reduce((out, data, i) => {
      out[labels[i]] = data;
      return out;
    }, {});
    return combined;
  });
  dataProxy$.imitate(data$);

  return {
    ...sinks,
    DownloadData: dataDownloader.DownloadData,
    DOM: vdom$,
    VideoRecorder: videoRecorder$,
    Chart: featureChart.Chart
  };
}

const drivers = {
  TabletFace: makeTabletFaceDriver(),
  PoseDetection: makePoseDetectionDriver({ fps: 10 }),
  VAD: makeVoiceActivityDetectionDriver({
    useNoiseCapture: false,
    activityCounterThresh: 10,
    activityCounterMax: 30
  }),
  Time: timeDriver,
  VideoRecorder: settings.robot.recording.enabled
    ? makeMediaRecorderDriver()
    : mockMediaRecorderSource,
  DownloadData: settings.robot.recording.enabled
    ? makeDownloadDataDriver()
    : mockDownloadDataSource,
  Chart: settings.robot.charts.enabled
    ? makeStreamingChartDriver(config)
    : mockStreamingChartSource
};

function withAdapters(main, adapters) {
  return sources =>
    main(
      Object.keys(sources).reduce((prev, key) => {
        prev[key] = !!adapters[key]
          ? adapters[key](sources[key])
          : sources[key];
        return prev;
      }, {})
    );
}

run(withAdapters(main, { VAD: vadAdapter }), {
  ...initializeTabletFaceRobotDrivers(),
  ...drivers
});
