document.body.style.backgroundColor = "white";
document.body.style.margin = "0px";

import xs from "xstream";
import throttle from "xstream/extra/throttle";
import dropRepeats from "xstream/extra/dropRepeats";
import { div, video } from "@cycle/dom";
import { run } from "@cycle/run";
import { timeDriver } from "@cycle/time";
import { makeTabletFaceDriver } from "@cycle-robot-drivers/screen";
import { initializeTabletFaceRobotDrivers } from "@cycle-robot-drivers/run";
import Replayer from "./Replayer";
import settings from "../../settings_helper";

const fileprefix = settings.dataplayer.fileprefix || "test";

const makeMain = (loadedStreams, videoStartTime) => sources => {
  const replayer = Replayer(sources.DOM, sources.Time, loadedStreams);
  xs.combine(replayer.time)
    .compose(throttle(200))
    .addListener({
      next: time => {
        if (!!document.querySelector("video.replayer")) {
          document.querySelector("video.replayer").currentTime =
            (time - videoStartTime) / 1000;
        }
      }
    });

  const video$ = xs.of(`/${fileprefix}.mp4`).map(url =>
    video(".replayer", {
      props: { src: url },
      style: {
        width: "400px",
        height: "300px",
        transform: "rotateY(180deg)",
        "-webkit-transform": "rotateY(180deg)" /* Safari and Chrome */,
        "-moz-transform": "rotateY(180deg)" /* Firefox */
      }
    })
  );
  const stateStamped$ = replayer.timeTravel["stateStamped"].startWith({});

  const vdom$ = xs
    .combine(
      xs.combine(replayer.timeTravel.DOM.startWith(""), video$).map(vdoms =>
        div(
          {
            style: {
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
              alignItems: "flex-start"
            }
          },
          vdoms
        )
      ),
      stateStamped$
        .compose(dropRepeats((s1, s2) => s1.state === s2.state))
        .map(ss => div(`${JSON.stringify(ss)}`)),
      stateStamped$.map(ss => div(`${JSON.stringify(ss)}`)),
      replayer.DOM.remember()
    )
    .map(vdoms => div(vdoms));

  return {
    DOM: vdom$,
    TabletFace: replayer.timeTravel.TabletFace.remember()
    // AudioPlayer: replayer.timeTravel.AudioPlayer.remember(),
    // SpeechSynthesis: replayer.timeTravel.SpeechSynthesis.remember(),
  };
};

const drivers = {
  ...initializeTabletFaceRobotDrivers(),
  TabletFace: makeTabletFaceDriver(),
  Time: timeDriver
};

function adjustFaceSize(rawJSON) {
  var width = "480px";
  var height = "300px";
  return rawJSON
    .replace(/(\d*\.?\d+)(vw)/g, `calc(${width} * $1 * 0.01)`)
    .replace(/(\d*\.?\d+)(vh|vmin)/g, `calc(${height} * $1 * 0.01)`)
    .replace(
      /{"sel":"div.posenet","data":{"style":{"position":"relative","display":\"block\"/g,
      `{"sel":"div.posenet","data":{"style":{"position":"relative","display":\"none\"`
    );
}

fetch(`/${fileprefix}.json`)
  .then(r => r.text())
  .then(rawJSON => {
    let data = JSON.parse(adjustFaceSize(rawJSON));
    {
      // derive stateStamped from trace
      const srcLabel = "trace";
      const newData = data[srcLabel].map(x => ({
        ...x,
        value: x.value.stateStamped
      }));
      const label = `stateStamped`;
      newData.label = label;
      data[label] = newData;
    }
    {
      // derive state from stateStamped
      const srcLabel = "stateStamped";
      const isEqualStateStamped = (s1, s2) => {
        return s1.state === s2.state;
      };
      const newData = data[srcLabel]
        .reduce(
          (acc, x, i, arr) => {
            if (i > 0 && !isEqualStateStamped(arr[i - 1].value, arr[i].value)) {
              acc.push(arr[i]);
              return acc;
            } else {
              return acc;
            }
          },
          [data[srcLabel][0]]
        )
        .map(x => ({
          ...x,
          value: x.value.state
        }));
      const label = `state`;
      newData.label = label;
      data[label] = newData;
    }
    // serve streams on memory for Replayer component
    const labels2exclude = ["SpeechRecognition", "PoseDetection"];
    const labels2hide = ["trace", "stateStamped"];
    const loadedStreams = Object.keys(data)
      .map(label => {
        data[label].label = label;
        const recordedStream = xs.of(data[label]).remember();
        recordedStream.label = label;
        recordedStream.hidden = labels2hide.indexOf(label) !== -1;
        return recordedStream;
      })
      .filter(s => labels2exclude.indexOf(s.label) === -1);

    const videoStartTime = data["videoStart"][0].timestamp;

    const main = makeMain(loadedStreams, videoStartTime);

    run(main, drivers);
  });
