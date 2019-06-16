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
  VADState,
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
import FeatureChart, { config as featureChartConfig } from "./FeatureChart";
import StateChart, { config as stateChartConfig } from "./StateChart";

const postDetectionFPS = 10;

function TabletRobotFaceApp(sources) {
  // sources.state.stream.addListener({next: s => console.debug('reducer state', s)});

  const appName =
    Object.keys(transitions).indexOf(settings.robot.name) !== -1
      ? settings.robot.name
      : "demo";
  const transition = transitions[appName].transition;
  const params =
    settings.robot.parameters.setName !== "" &&
    typeof transitions[appName].params.sets === "object" &&
    typeof transitions[appName].params.sets[
      settings.robot.parameters.setName
    ] === "object"
      ? transitions[appName].params.sets[settings.robot.parameters.setName]
      : transitions[appName].params;
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
      goal_id: r.status.goal_id,
      status: r.status.status,
      result: r.result
    })),
    sources.RobotSpeechbubbleAction.result.map(r => ({
      type: "RobotSpeechbubbleAction",
      goal_id: r.status.goal_id,
      status: r.status.status,
      result: r.result
    })),
    sources.HumanSpeechbubbleAction.result.map(r => ({
      type: "HumanSpeechbubbleAction",
      goal_id: r.status.goal_id,
      status: r.status.status,
      result: r.result
    })),
    sources.AudioPlayerAction.result.map(r => ({
      type: "AudioPlayerAction",
      goal_id: r.status.goal_id,
      status: r.status.status,
      result: r.result
    })),
    sources.SpeechSynthesisAction.result.map(r => ({
      type: "SpeechSynthesisAction",
      goal_id: r.status.goal_id,
      status: r.status.status,
      result: r.result
    })),
    sources.SpeechRecognitionAction.result.map(r => ({
      type: "SpeechRecognitionAction",
      goal_id: r.status.goal_id,
      status: r.status.status,
      result: r.result
    }))
  );
  const fsmUniqueStateStamped$ = sources.state.stream
    .filter(
      s => !!s.RobotApp && !!s.RobotApp.fsm && !!s.RobotApp.fsm.stateStamped
    )
    .map(s => s.RobotApp.fsm.stateStamped)
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
  const maxNoseAngle1Sec$ = faceFeatures$
    .fold((prev, val) => {
      prev.unshift(!val.isVisible ? null : val.noseAngle);
      if (prev.length > postDetectionFPS * 1) prev.pop();
      return prev;
    }, [])
    .map(val => {
      val.filter(v => v !== null);
      if (val.length < 2) return 0;
      const sorted = val.slice(0).sort((x, y) => x - y);
      return sorted[sorted.length - 1] - sorted[0];
    });
  const maxNoseAngle2Sec$ = faceFeatures$
    .fold((prev, val) => {
      prev.unshift(!val.isVisible ? null : val.noseAngle);
      if (prev.length > postDetectionFPS * 2) prev.pop();
      return prev;
    }, [])
    .map(val => {
      val.filter(v => v !== null);
      if (val.length < 2) return 0;
      const sorted = val.slice(0).sort((x, y) => x - y);
      return sorted[sorted.length - 1] - sorted[0];
    });
  const robotSinks = isolate(RobotApp, "RobotApp")({
    state: sources.state,
    command: command$,
    fsmUniqueStateStamped: fsmUniqueStateStamped$,
    actionResults: actionResults$,
    faceFeatures: faceFeatures$,
    voiceFeatures: voiceFeatures$,
    temporalFeatures: xs
      .combine(maxNoseAngle1Sec$, maxNoseAngle2Sec$)
      .map(([maxNoseAngle1Sec, maxNoseAngle2Sec]) => ({
        maxNoseAngle1Sec,
        maxNoseAngle2Sec
      }))
  });
  return {
    ...robotSinks,
    command: command$,
    actionResults: actionResults$,
    fsmUniqueStateStamped: fsmUniqueStateStamped$,
    poses: poses$,
    faceFeatures: faceFeatures$,
    vadState: vadState$,
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
    ? isolate(FeatureChart)({
        DOM: sources.DOM,
        features: sinks.faceFeatures
      })
    : {
        DOM: xs.of(""),
        Chart: xs.never()
      };
  const stateChart = settings.robot.charts.enabled
    ? isolate(StateChart)({
        DOM: sources.DOM,
        isVisible: sinks.faceFeatures
          .map(faceFeatures => faceFeatures.isVisible)
          .compose(throttle(100)),
        vadState: sinks.vadState.compose(throttle(100)).map(s => VADState[s])
      })
    : {
        DOM: xs.of(""),
        Chart: xs.never()
      };

  if (!settings.robot.recording.enabled) {
    return {
      ...sinks,
      DOM: xs
        .combine(sinks.DOM, featureChart.DOM, stateChart.DOM)
        .map(vdoms => div(vdoms)),
      Chart: featureChart.Chart,
      Chart2: stateChart.Chart
    };
  }

  const dataProxy$ = xs.create();
  const dataDownloader = DataDownloader(sources, dataProxy$);

  const vdom$ = xs
    .combine(sinks.DOM, featureChart.DOM, stateChart.DOM, dataDownloader.DOM)
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
      { stream: sinks.command, label: "command" },
      { stream: sinks.actionResults, label: "actionResults" },
      { stream: sinks.fsmUniqueStateStamped, label: "fsmUniqueStateStamped" },
      { stream: sinks.poses, label: "poses" },
      { stream: sinks.vadState, label: "vadState" }
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
    Chart: featureChart.Chart,
    Chart2: stateChart.Chart
  };
}

const drivers = {
  TabletFace: makeTabletFaceDriver(),
  PoseDetection: makePoseDetectionDriver({ fps: postDetectionFPS }),
  VAD: makeVoiceActivityDetectionDriver({
    useNoiseCapture: false,
    activityCounterThresh: 10,
    activityCounterMax: 30,
    useDefaultActivityCounting: false
  }),
  Time: timeDriver,
  VideoRecorder: settings.robot.recording.enabled
    ? makeMediaRecorderDriver()
    : mockMediaRecorderSource,
  DownloadData: settings.robot.recording.enabled
    ? makeDownloadDataDriver()
    : mockDownloadDataSource,
  Chart: settings.robot.charts.enabled
    ? makeStreamingChartDriver(featureChartConfig)
    : mockStreamingChartSource,
  Chart2: settings.robot.charts.enabled
    ? makeStreamingChartDriver(stateChartConfig)
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
