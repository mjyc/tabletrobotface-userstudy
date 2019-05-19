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
// import settings from './settings_helpers';

// const filename = settings.filename;
const filename = 'test/bag'

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

  const video$ = xs.of(`/${filename}.mp4`)
    .map(url => video('.replayer', {
      props: {src: url},
      style: {
        width: '400px',
        height: '300px',
      }
    }));
  const features$ = replayer.timeTravel.features.startWith({});
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
    features$.map(f => div(`faceSize: ${f.faceSize}`)),
    features$.map(f => div(`faceOrientation: ${f.faceOrientation}`)),
    features$.map(f => div(`noseOrientation: ${f.noseOrientation}`)),
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
  TabletFace: makeTabletFaceDriver({styles: {eyeSize: '100px'}}),
  Time: timeDriver,
};


fetch(`/${filename}_merged.json`).then((r) => r.json()).then((bag) => {
  // serve streams on memory for Replayer component
  const labels2exclude = [
    'SpeechRecognition', 'PoseDetection', 'poses'
  ];
  const loadedStreams = Object.keys(bag).map(label => {
    bag[label].label = label;
    const recordedStream = xs.of(bag[label]).remember();
    recordedStream.label = label;
    return recordedStream;
  }).filter(s => labels2exclude.indexOf(s.label) === -1);
  const videoStartTime = bag['videoStart'][0].timestamp;

  const main = makeMain(loadedStreams, videoStartTime);

  run(main, drivers);
});
