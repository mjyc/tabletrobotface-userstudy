document.body.style.backgroundColor = "white";
document.body.style.margin = "0px";

import xs from 'xstream';
import delay from 'xstream/extra/delay';
import dropRepeats from 'xstream/extra/dropRepeats';
import {div} from '@cycle/dom';
import isolate from '@cycle/isolate';
import {run} from '@cycle/run';
import {withState} from '@cycle/state';
import {timeDriver} from '@cycle/time';
import {makeTime$, recordStreams} from '@mjyc/cycle-time-travel';
import {makeTabletFaceDriver} from '@cycle-robot-drivers/screen';
import {
  initializeTabletFaceRobotDrivers,
  withTabletFaceRobotActions,
} from '@cycle-robot-drivers/run';
import {
  makeMediaRecorderDriver,
  makeDownloadDataDriver,
  DataDownloader,
} from 'tabletrobotface-userstudy';
import settings from '../../settings_helper';
import {RobotApp} from './RobotApp';
import * as transitions from './transitions';

function TabletRobotFaceApp(sources) {
  // sources.state.stream.addListener({next: s => console.debug('reducer state', s)});

  const appName = Object.keys(name).indexOf(settings.robot.name) !== -1
      ? settings.robot.transition : 'demo';
  const transition = transitions[appName];
  const params = transitions._params[appName];
  const S0 = 'S0';
  const T = (...args) => transition(...args, params).state;
  const G = (...args) => transition(...args, params).outputs;
  const command$ = xs.merge(
    sources.TabletFace.events('load').mapTo({
      type: 'LOAD_FSM',
      value: {S0, T, G},
    }),
    sources.TabletFace.events('load').compose(delay(0)).mapTo({
      type: 'START_FSM',
    }),
  );

  const robotSinks = isolate(RobotApp, 'RobotApp')({
    command: command$,
    ...sources,
  });
  return robotSinks;
}


function main(sources) {
  const options = settings.robot.withTabletFaceRobotActionsOptions;
  const sinks = withState(
    withTabletFaceRobotActions(TabletRobotFaceApp, options)
  )(sources);
  // to save the first DOM event; it gets fired before recording starts
  sinks.DOM = sinks.DOM.remember();

  if (!settings.robot.recording.enabled) {
    return {
      ...sinks,
      DOM: sinks.DOM,
    };
  }


  const dataProxy$ = xs.create();
  const dataDownloader = DataDownloader(sources, dataProxy$);

  const vdom$ = xs.combine(
    sinks.DOM,
    dataDownloader.DOM,
  ).map(vdoms => div(vdoms));

  const videoRecorder$ = xs.merge(
    sources.VideoRecorder.filter(v => v.type === 'READY').mapTo('START'),
    dataDownloader.VideoRecorder,
  );


  const videoStart$ = sources.VideoRecorder.filter(v => v.type === 'START');
  const trace$ = sources.state.stream
    .filter(s => !!s.RobotApp && !!s.RobotApp.fsm && !!s.RobotApp.fsm.stateStamped)
    .compose(dropRepeats((rs1, rs2) =>
        rs1.RobotApp.fsm.stateStamped.stamp === rs2.RobotApp.fsm.stateStamped.stamp))
    .filter(s => !!s.RobotApp.trace)  // trace value on LOAD_FSM is null; skip that
    .map(s => s.RobotApp.trace)
    .remember()
  const time$ = makeTime$(sources.Time, xs.of(true), xs.of(0));
  const recordedStreams = recordStreams([
    {stream: sinks.DOM || xs.never(), label: 'DOM'},
    {stream: sinks.TabletFace || xs.never(), label: 'TabletFace'},
    {stream: sinks.AudioPlayer || xs.never(), label: 'AudioPlayer'},
    {stream: sinks.SpeechSynthesis || xs.never(), label: 'SpeechSynthesis'},
    {stream: sinks.SpeechRecognition || xs.never(), label: 'SpeechRecognition'},
    {stream: sinks.PoseDetection || xs.never(), label: 'PoseDetection'},
    {stream: videoStart$, label: 'videoStart'},
    {stream: trace$, label: 'trace'},
  ], time$);
  const data$ = xs.combine.apply(null, recordedStreams)
    .map(recorded => {
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
  };
}


const drivers = {
  TabletFace: makeTabletFaceDriver(),
  Time: timeDriver,
  VideoRecorder: makeMediaRecorderDriver(),
  DownloadData: makeDownloadDataDriver(),
};

run(main, {
  ...initializeTabletFaceRobotDrivers(),
  ...drivers,
});
