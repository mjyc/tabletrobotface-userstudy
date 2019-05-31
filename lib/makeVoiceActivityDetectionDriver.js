"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = makeVoiceActivityDetectionDriver;

var _xstream = require("xstream");

var _xstream2 = _interopRequireDefault(_xstream);

var _voiceActivityDetection = require("voice-activity-detection");

var _voiceActivityDetection2 = _interopRequireDefault(_voiceActivityDetection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// adapted from https://github.com/Jam3/voice-activity-detection/blob/master/test/test.js

function makeVoiceActivityDetectionDriver() {
  var audioContext;

  return function voiceActivityDetectionDriver() {
    return _xstream2.default.create({
      start: function start(listener) {
        function handleUserMediaError() {
          listener.error("Mic input is not supported by the browser.");
        }

        function handleMicConnectError() {
          listener.error("Could not connect microphone. Possible rejected by the user or is blocked by the browser.");
        }
        function requestMic() {
          try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            audioContext = new AudioContext();
            // https://developers.google.com/web/updates/2017/09/autoplay-policy-changes#audiovideo_elements
            if (audioContext.state === "suspended") {
              console.warn("audioContext.state is \"suspended\"; will attempt to resume every 1s");
              var handle = setInterval(function () {
                if (!!audioContext && audioContext.state === "suspended") {
                  audioContext.resume();
                } else if (audioContext.state === "running") {
                  console.debug("audioContext.state is \"running\"; stopping resuming attempts");
                  clearInterval(handle);
                }
              }, 1000);
            }

            navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
            navigator.getUserMedia({ audio: true }, startUserMedia, handleMicConnectError);
          } catch (e) {
            handleUserMediaError();
          }
        }
        function startUserMedia(stream) {
          var options = {
            onVoiceStart: function onVoiceStart() {
              listener.next({
                type: "START"
              });
            },
            onVoiceStop: function onVoiceStop() {
              listener.next({
                type: "STOP"
              });
            },
            onUpdate: function onUpdate(val) {
              listener.next({
                type: "UPDATE",
                value: val
              });
            }
          };
          (0, _voiceActivityDetection2.default)(audioContext, stream, options);
        }
        requestMic();
      },
      stop: function stop() {}
    });
  };
}