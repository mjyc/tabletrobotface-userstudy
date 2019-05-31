document.body.style.backgroundColor = "white";
document.body.style.margin = "0px";

import xs from "xstream";
import delay from "xstream/extra/delay";
import dropRepeats from "xstream/extra/dropRepeats";
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
  RobotApp
} from "tabletrobotface-userstudy";
import settings from "../../settings_helper";
import transitions from "./transitions";
import FaceFeatureChart, { config } from "./FaceFeatureChart";
import makeVoiceActivityDetectionDriver from "./makeVoiceActivityDetectionDriver";

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

  const robotSinks = isolate(RobotApp, "RobotApp")({
    command: command$,
    ...sources
  });
  return robotSinks;
}

function main(sources) {
  const options = settings.robot.withTabletFaceRobotActionsOptions;
  const sinks = withState(
    withTabletFaceRobotActions(TabletRobotFaceApp, options)
  )(sources);
  // to save the first event; it gets fired before recording starts
  sinks.DOM = sinks.DOM.remember();

  const lens = {
    get: rs => {
      if (
        !!rs.RobotApp &&
        !!rs.RobotApp.trace &&
        rs.RobotApp.trace.input.type === "FSM_INPUT"
      ) {
        return { features: rs.RobotApp.trace.input.continuous.face };
      } else {
        return {};
      }
    }
  };
  const faceFeatureChart = settings.robot.charts.enabled
    ? isolate(FaceFeatureChart, { state: lens })(sources)
    : {
        DOM: xs.of(""),
        Chart: xs.never()
      };

  if (!settings.robot.recording.enabled) {
    return {
      ...sinks,
      DOM: xs.combine(sinks.DOM, faceFeatureChart.DOM).map(vdoms => div(vdoms)),
      Chart: faceFeatureChart.Chart
    };
  }

  const dataProxy$ = xs.create();
  const dataDownloader = DataDownloader(sources, dataProxy$);

  const vdom$ = xs
    .combine(sinks.DOM, faceFeatureChart.DOM, dataDownloader.DOM)
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
      { stream: sources.PoseDetection.events("poses"), label: "poses" }
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
    Chart: faceFeatureChart.Chart
  };
}

const drivers = {
  TabletFace: makeTabletFaceDriver(),
  PoseDetection: makePoseDetectionDriver({ fps: 10 }),
  VAD: makeVoiceActivityDetectionDriver(),
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

run(main, {
  ...initializeTabletFaceRobotDrivers(),
  ...drivers
});
