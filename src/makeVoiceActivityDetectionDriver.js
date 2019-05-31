// adapted from https://github.com/Jam3/voice-activity-detection/blob/master/test/test.js

import xs from "xstream";
var vad = require("voice-activity-detection");

export default function makeVoiceActivityDetectionDriver() {
  var audioContext;

  return function voiceActivityDetectionDriver() {
    return xs.create({
      start: listener => {
        function handleUserMediaError() {
          listener.error("Mic input is not supported by the browser.");
        }

        function handleMicConnectError() {
          listener.error(
            "Could not connect microphone. Possible rejected by the user or is blocked by the browser."
          );
        }
        function requestMic() {
          try {
            window.AudioContext =
              window.AudioContext || window.webkitAudioContext;
            audioContext = new AudioContext();
            // https://developers.google.com/web/updates/2017/09/autoplay-policy-changes#audiovideo_elements
            if (audioContext.state === "suspended") {
              console.warn(
                `audioContext.state is "suspended"; will attempt to resume every 1s`
              );
              const handle = setInterval(() => {
                if (!!audioContext && audioContext.state === "suspended") {
                  audioContext.resume();
                } else if (audioContext.state === "running") {
                  console.debug(
                    `audioContext.state is "running"; stopping resuming attempts`
                  );
                  clearInterval(handle);
                }
              }, 1000);
            }

            navigator.getUserMedia =
              navigator.getUserMedia ||
              navigator.webkitGetUserMedia ||
              navigator.mozGetUserMedia ||
              navigator.msGetUserMedia;
            navigator.getUserMedia(
              { audio: true },
              startUserMedia,
              handleMicConnectError
            );
          } catch (e) {
            handleUserMediaError();
          }
        }
        function startUserMedia(stream) {
          var options = {
            onVoiceStart: function() {
              listener.next({
                type: "START"
              });
            },
            onVoiceStop: function() {
              listener.next({
                type: "STOP"
              });
            },
            onUpdate: function(val) {
              listener.next({
                type: "UPDATE",
                value: val
              });
            }
          };
          vad(audioContext, stream, options);
        }
        requestMic();
      },
      stop: () => {}
    });
  };
}
