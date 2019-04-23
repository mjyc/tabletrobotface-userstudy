document.body.style.backgroundColor = "white";
document.body.style.margin = "0px";

import xs from 'xstream';
import throttle from 'xstream/extra/throttle';
import dropRepeats from 'xstream/extra/dropRepeats';
import {div, video} from '@cycle/dom';
import {run} from '@cycle/run';
import {timeDriver} from '@cycle/time';
import {makeTabletFaceDriver} from '@cycle-robot-drivers/screen';
import {
  initializeTabletFaceRobotDrivers,
} from '@cycle-robot-drivers/run';
import Replayer from './Replayer';
import settings from '../../settings_helper';

const fileprefix = settings.fileprefix || 'test';

const makeMain = (loadedStreams, videoStartTime) => (sources) => {
  const replayer = Replayer(sources.DOM, sources.Time, loadedStreams);
  xs.combine(replayer.time)
    .compose(throttle(200))
    .addListener({
      next: (time) => {
        if (!!document.querySelector('video.replayer')) {
          document.querySelector('video.replayer').currentTime = (time - videoStartTime) / 1000;
        }
      }
    });

  const video$ = xs.of(`/${fileprefix}.mp4`)
    .map(url => video('.replayer', {
      props: {src: url},
      style: {
        width: '400px',
        height: '300px',
      }
    }));
  const trace$ = replayer.timeTravel.trace.startWith({});
  const vdom$ = xs.combine(
    xs.combine(
      replayer.timeTravel.DOM.startWith(''),
      video$,
    ).map(vdoms => div({style: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
    }}, vdoms)),
    replayer.time.compose(dropRepeats()).map(t => div(`elapsed time: ${t}`)),
    trace$.map(t => div(`stateStamped: ${JSON.stringify(t.stateStamped)}`)),
    replayer.DOM.remember(),
  ).map(vdoms => div(vdoms));

  return {
    DOM: vdom$,
    TabletFace: replayer.timeTravel.TabletFace.remember(),
    // AudioPlayer: replayer.timeTravel.AudioPlayer.remember(),
    // SpeechSynthesis: replayer.timeTravel.SpeechSynthesis.remember(),
  };
}

const drivers = {
  ...initializeTabletFaceRobotDrivers(),
  TabletFace: makeTabletFaceDriver(),
  Time: timeDriver,
};

function adjustFaceSize(rawJSON) {
  var width = '480px';
  var height = '300px';
  return rawJSON
    .replace(/(\d*\.?\d+)(vw)/g, `calc(${width} * $1 * 0.01)`)
    .replace(/(\d*\.?\d+)(vh|vmin)/g, `calc(${height} * $1 * 0.01)`)
    .replace(/{"sel":"div.posenet","data":{"style":{"position":"relative","display":\"block\"/g, `{"sel":"div.posenet","data":{"style":{"position":"relative","display":\"none\"`);
}

fetch(`/${fileprefix}.json`).then(r => r.text()).then((rawJSON) => {
  let data = JSON.parse(adjustFaceSize(rawJSON));

  // serve streams on memory for Replayer component
  const labels2exclude = [
    'SpeechRecognition',
    'PoseDetection'
  ];
  const loadedStreams = Object.keys(data).map(label => {
    data[label].label = label;
    const recordedStream = xs.of(data[label]).remember();
    recordedStream.label = label;
    return recordedStream;
  }).filter(s => labels2exclude.indexOf(s.label) === -1);
  const videoStartTime = data['videoStart'][0].timestamp;

  const main = makeMain(loadedStreams, videoStartTime);

  run(main, drivers);
});
