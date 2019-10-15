"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.makeMediaRecorderDriver = exports.mockMediaRecorderSource = exports.isMobile = exports.isiOS = exports.isAndroid = undefined;

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.mockDownloadDataSource = mockDownloadDataSource;
exports.makeDownloadDataDriver = makeDownloadDataDriver;
exports.DataDownloader = DataDownloader;

var _xstream = require("xstream");

var _xstream2 = _interopRequireDefault(_xstream);

var _delay = require("xstream/extra/delay");

var _delay2 = _interopRequireDefault(_delay);

var _sampleCombine = require("xstream/extra/sampleCombine");

var _sampleCombine2 = _interopRequireDefault(_sampleCombine);

var _adapt = require("@cycle/run/lib/adapt");

var _dom = require("@cycle/dom");

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

var mockMediaRecorderSource = exports.mockMediaRecorderSource = function mockMediaRecorderSource() {
  return _xstream2.default.never();
};

var makeMediaRecorderDriver = exports.makeMediaRecorderDriver = function makeMediaRecorderDriver(options) {
  if (!options) {
    options = {};
  }

  var videoRecorderDriver = function videoRecorderDriver(sink$) {
    var constraints = options.constraints ? options.constraints : {
      video: {
        facingMode: "user",
        width: isMobile() ? undefined : 640,
        height: isMobile() ? undefined : 480
      },
      audio: true
    };
    var mediaRecorder = null;
    var blobs = [];
    var source$ = _xstream2.default.create();
    navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
      source$.shamefullySendNext({ type: "READY" });
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = function (evt) {
        blobs.push(evt.data);
      };
      mediaRecorder.onstart = function () {
        source$.shamefullySendNext({ type: "START" });
      };
      mediaRecorder.onstop = function (_) {
        source$.shamefullySendNext({ type: "BLOBS", value: blobs });
        blobs = [];
      };
    }).catch(function (err) {
      console.error("Failed to get MediaStream");
      throw err;
    });

    var timeout = options.timeout || 60 * 10000; // 10mins
    var timeout$ = _xstream2.default.of("STOP").compose((0, _delay2.default)(timeout));
    _xstream2.default.merge(sink$, timeout$).addListener({
      next: function next(v) {
        if (v.type === "COMMAND" || typeof v === "string") {
          var cmd = typeof v === "string" ? v : v.value;
          if (cmd === "START") {
            if (mediaRecorder && mediaRecorder.state !== "recording") {
              mediaRecorder.start();
            } else {
              console.warn("mediaRecorder.start() not allowed");
            }
          } else if (cmd === "STOP") {
            if (mediaRecorder && mediaRecorder.state !== "inactive") {
              mediaRecorder.stop();
            } else {
              console.warn("mediaRecorder.stop() not allowed");
            }
          }
        }
      }
    });

    return (0, _adapt.adapt)(source$);
  };

  return videoRecorderDriver;
};

function mockDownloadDataSource() {
  return {
    DOM: _xstream2.default.never(),
    DownloadData: _xstream2.default.never(),
    VideoRecorder: _xstream2.default.never()
  };
}

function makeDownloadDataDriver() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$filenamePrefix = _ref.filenamePrefix,
      filenamePrefix = _ref$filenamePrefix === undefined ? "Data" : _ref$filenamePrefix,
      _ref$recordVideo = _ref.recordVideo,
      recordVideo = _ref$recordVideo === undefined ? true : _ref$recordVideo,
      _ref$jsonPostProcessF = _ref.jsonPostProcessFnc,
      jsonPostProcessFnc = _ref$jsonPostProcessF === undefined ? function (data) {
    return data;
  } : _ref$jsonPostProcessF;

  var downloadDataDriver = function downloadDataDriver(sink$) {
    var createDownloadLinkElement = function createDownloadLinkElement(id, href, filename) {
      var a = document.createElement("a");
      a.id = id;
      a.href = href;
      a.download = filename;
      return a;
    };
    var jsonData$ = sink$.filter(function (v) {
      return v.type === "JSON";
    }).map(function (v) {
      return v.value;
    });
    var videoData$ = sink$.filter(function (v) {
      return v.type === "VIDEO";
    }).map(function (v) {
      return v.value;
    });
    if (recordVideo) {
      var data$ = _xstream2.default.combine(jsonData$, videoData$);
      sink$.filter(function (v) {
        return v.type === "DOWNLOAD";
      }).compose((0, _sampleCombine2.default)(data$)).addListener({
        next: function next(_ref2) {
          var _ref3 = _slicedToArray(_ref2, 2),
              _ = _ref3[0],
              data = _ref3[1];

          var filename = filenamePrefix + "_" + new Date().toISOString().replace(/-/g, "_").replace(/:/g, "_").replace("T", "_").slice(0, -5);
          var a1 = createDownloadLinkElement("dl-json", window.URL.createObjectURL(new Blob([JSON.stringify(jsonPostProcessFnc(data[0]))], {
            type: "application/json"
          })), filename);
          var a2 = createDownloadLinkElement("dl-video", window.URL.createObjectURL(new Blob(data[1], { type: "video/mp4" })), filename);
          a1.click();
          a2.click();
        }
      });
    } else {
      sink$.filter(function (v) {
        return v.type === "DOWNLOAD";
      }).compose((0, _sampleCombine2.default)(jsonData$)).addListener({
        next: function next(_ref4) {
          var _ref5 = _slicedToArray(_ref4, 2),
              _ = _ref5[0],
              jsonData = _ref5[1];

          var filename = filenamePrefix + "_" + new Date().toISOString().replace(/-/g, "_").replace(/:/g, "_").replace("T", "_").slice(0, -5);
          var a1 = createDownloadLinkElement("dl-json", jsonData, filename);
          a1.click();
        }
      });
    }
  };
  return downloadDataDriver;
}

function DataDownloader(sources, data$) {
  var downloadClick$ = sources.DOM.select(".download").events("click");
  var vdom$ = !!sources.VideoRecorder ? downloadClick$.take(1).mapTo(true).startWith(false).map(function (disabled) {
    return (0, _dom.button)(".download", { props: { disabled: disabled } }, "Download");
  }) : _xstream2.default.of((0, _dom.button)(".download", "Download"));

  var downloadData$ = !!sources.VideoRecorder ? _xstream2.default.merge(data$.map(function (v) {
    return { type: "JSON", value: v };
  }), sources.VideoRecorder.filter(function (v) {
    return v.type === "BLOBS";
  })
  // it expects VideoRecorder to run on start
  .map(function (v) {
    return { type: "VIDEO", value: v.value };
  }), sources.VideoRecorder.filter(function (v) {
    return v.type === "BLOBS";
  })
  // HACK! similar to setTimeout(..., 0)
  .mapTo({ type: "DOWNLOAD" }).compose((0, _delay2.default)(0))) : _xstream2.default.merge(data$.map(function (v) {
    return { type: "JSON", value: v };
  }), downloadClick$.mapTo({ type: "DOWNLOAD" }));

  var videoRecorder$ = !!sources.VideoRecorder ? downloadClick$.mapTo("STOP") : _xstream2.default.never();

  return {
    DOM: vdom$,
    DownloadData: downloadData$,
    VideoRecorder: videoRecorder$
  };
}