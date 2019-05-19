'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeMediaRecorderDriver = exports.isMobile = exports.isiOS = exports.isAndroid = undefined;

var _xstream = require('xstream');

var _xstream2 = _interopRequireDefault(_xstream);

var _delay = require('xstream/extra/delay');

var _delay2 = _interopRequireDefault(_delay);

var _adapt = require('@cycle/run/lib/adapt');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isAndroid = exports.isAndroid = function isAndroid() {
  return (/Android/i.test(navigator.userAgent)
  );
};

var isiOS = exports.isiOS = function isiOS() {
  return (/iPhone|iPad|iPod/i.test(navigator.userAgent)
  );
};

var isMobile = exports.isMobile = function isMobile() {
  return isAndroid() || isiOS();
};

var makeMediaRecorderDriver = exports.makeMediaRecorderDriver = function makeMediaRecorderDriver(options) {
  if (!options) {
    options = {};
  }

  var videoRecorderDriver = function videoRecorderDriver(sink$) {
    var constraints = options.constraints ? options.constraints : {
      video: {
        facingMode: 'user',
        width: isMobile() ? undefined : 640,
        height: isMobile() ? undefined : 480
      },
      audio: true
    };
    var mediaRecorder = null;
    var blobs = [];
    var source$ = _xstream2.default.create();
    navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
      source$.shamefullySendNext({ type: 'READY' });
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = function (evt) {
        blobs.push(evt.data);
      };
      mediaRecorder.onstart = function () {
        source$.shamefullySendNext({ type: 'START' });
      };
      mediaRecorder.onstop = function (_) {
        source$.shamefullySendNext({ type: 'BLOBS', value: blobs });
        blobs = [];
      };
    }).catch(function (err) {
      console.error('Failed to get MediaStream');
      throw err;
    });

    var timeout = options.timeout || 60 * 10000; // 10mins
    var timeout$ = _xstream2.default.of('STOP').compose((0, _delay2.default)(timeout));
    _xstream2.default.merge(sink$, timeout$).addListener({
      next: function next(v) {
        if (v.type === 'COMMAND' || typeof v === 'string') {
          var cmd = typeof v === 'string' ? v : v.value;
          if (cmd === 'START') {
            if (mediaRecorder && mediaRecorder.state !== 'recording') {
              mediaRecorder.start();
            } else {
              console.warn('mediaRecorder.start() not allowed');
            }
          } else if (cmd === 'STOP') {
            if (mediaRecorder && mediaRecorder.state !== 'inactive') {
              mediaRecorder.stop();
            } else {
              console.warn('mediaRecorder.stop() not allowed');
            }
          }
        }
      }
    });

    return (0, _adapt.adapt)(source$);
  };

  return videoRecorderDriver;
};