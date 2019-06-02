"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VAD_STATE = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; // adapted from https://github.com/Jam3/voice-activity-detection/blob/master/test/test.js

exports.default = makeVoiceActivityDetectionDriver;
exports.adapter = adapter;

var _xstream = require("xstream");

var _xstream2 = _interopRequireDefault(_xstream);

var _voiceActivityDetection = require("@mjyc/voice-activity-detection");

var _voiceActivityDetection2 = _interopRequireDefault(_voiceActivityDetection);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function makeVoiceActivityDetectionDriver(options) {
  var audioContext;

  return function voiceActivityDetectionDriver() {
    var output$ = _xstream2.default.create({
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
          var opts = _extends({}, options, {
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
          });
          (0, _voiceActivityDetection2.default)(audioContext, stream, opts);
        }
        requestMic();
      },
      stop: function stop() {}
    });

    return output$;
  };
}

var VAD_STATE = exports.VAD_STATE = {
  INACTIVE: 0,
  ACTIVE: 1
};

function adapter(output$) {
  var state$ = output$.filter(function (_ref) {
    var type = _ref.type;
    return type === "START" || type === "STOP";
  }).fold(function (prev, _ref2) {
    var type = _ref2.type;
    return type === "START" ? VAD_STATE["ACTIVE"] : type === "STOP" ? VAD_STATE["INACTIVE"] : prev;
  }, "INACTIVE");
  var level$ = output$.filter(function (_ref3) {
    var type = _ref3.type;
    return type === "UPDATE";
  }).map(function (_ref4) {
    var value = _ref4.value;
    return value;
  });
  return {
    events: function events(name) {
      return name === "state" ? state$ : name === "level" ? level$ : _xstream2.default.never();
    }
  };
}