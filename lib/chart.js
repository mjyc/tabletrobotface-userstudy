"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

exports.makeStreamingChartDriver = makeStreamingChartDriver;

var _chart = require("chart.js");

var _chart2 = _interopRequireDefault(_chart);

require("chartjs-plugin-streaming");

var _fromEvent = require("xstream/extra/fromEvent");

var _fromEvent2 = _interopRequireDefault(_fromEvent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function makeStreamingChartDriver(config) {
  var instance = null; // lazy initialize chart on first stream event

  var createChart = function createChart(el) {
    var ctx = el.getContext("2d");
    instance = new _chart2.default(ctx, config);
  };

  var updateChart = function updateChart(datasets) {
    if (!instance) {
      console.warn("Chart is not initialized yet; skipping updating chart");
      return;
    }

    datasets.map(function (dataset, i) {
      Object.keys(dataset).map(function (k) {
        instance.data.datasets[i][k] = dataset[k];
      });
    });

    instance.update({
      preservation: true
    });
  };

  var addDataset = function addDataset(dataset) {
    if (!instance) {
      console.warn("Chart is not initialized yet; skipping adding dataset");
      return;
    }
    dataset.map(function (data, i) {
      instance.data.datasets[i].data.push((typeof data === "undefined" ? "undefined" : _typeof(data)) !== "object" ? {
        x: new Date().getTime(),
        y: data
      } : data);
    });

    instance.update({
      preservation: true
    });
  };

  var createEvent = function createEvent(evName) {
    if (!instance) {
      console.error("Chart is not initialized yet; returning null");
      return null;
    }
    return (0, _fromEvent2.default)(el, evName).filter(function () {
      return instance;
    }).map(function (ev) {
      return instance.getElementsAtEvent(ev);
    });
  };

  var streamingChartDriver = function streamingChartDriver(sink$) {
    sink$.filter(function (s) {
      return s.type === "CREATE";
    }).addListener({
      next: function next(s) {
        return createChart(s.value);
      }
    });
    sink$.filter(function (s) {
      return s.type === "UPDATE";
    }).addListener({
      next: function next(s) {
        return updateChart(s.value);
      }
    });
    sink$.filter(function (s) {
      return s.type === "ADD";
    }).addListener({
      next: function next(s) {
        return addDataset(s.value);
      }
    });

    return {
      events: createEvent
    };
  };
  return streamingChartDriver;
}