"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.makeDownloadDataDriver = makeDownloadDataDriver;
exports.DataDownloader = DataDownloader;

var _xstream = require("xstream");

var _xstream2 = _interopRequireDefault(_xstream);

var _delay = require("xstream/extra/delay");

var _delay2 = _interopRequireDefault(_delay);

var _sampleCombine = require("xstream/extra/sampleCombine");

var _sampleCombine2 = _interopRequireDefault(_sampleCombine);

var _dom = require("@cycle/dom");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function makeDownloadDataDriver() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$filenamePrefix = _ref.filenamePrefix,
      filenamePrefix = _ref$filenamePrefix === undefined ? "Data" : _ref$filenamePrefix,
      _ref$recordVideo = _ref.recordVideo,
      recordVideo = _ref$recordVideo === undefined ? true : _ref$recordVideo;

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
      return window.URL.createObjectURL(new Blob([JSON.stringify(v.value)], { type: "application/json" }));
    });
    var videoData$ = sink$.filter(function (v) {
      return v.type === "VIDEO";
    }).map(function (v) {
      return window.URL.createObjectURL(new Blob(v.value, { type: "video/mp4" }));
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

          var filename = filenamePrefix + " " + new Date().toLocaleString();
          var a1 = createDownloadLinkElement("dl-json", data[0], filename);
          var a2 = createDownloadLinkElement("dl-video", data[1], filename);
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

          var filename = filenamePrefix + " " + new Date().toLocaleString();
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