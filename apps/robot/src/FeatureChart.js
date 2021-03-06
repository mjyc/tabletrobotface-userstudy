import xs from "xstream";
import { div, canvas, span, input } from "@cycle/dom";

const chartColors = {
  red: "rgb(255, 99, 132)",
  orange: "rgb(255, 159, 64)",
  yellow: "rgb(255, 205, 86)",
  green: "rgb(75, 192, 192)",
  blue: "rgb(54, 162, 235)",
  purple: "rgb(153, 102, 255)",
  grey: "rgb(201, 203, 207)"
};

const color = Chart.helpers.color;
export const config = {
  type: "line",
  data: {
    datasets: [
      {
        label: "faceSize",
        backgroundColor: color(chartColors.red)
          .alpha(0.5)
          .rgbString(),
        borderColor: chartColors.red,
        fill: false,
        lineTension: 0,
        data: [],
        hidden: true
      },
      {
        label: "faceHeight",
        backgroundColor: color(chartColors.orange)
          .alpha(0.5)
          .rgbString(),
        borderColor: chartColors.orange,
        fill: false,
        lineTension: 0,
        data: [],
        hidden: true
      },
      {
        label: "faceCenterX",
        backgroundColor: color(chartColors.blue)
          .alpha(0.5)
          .rgbString(),
        borderColor: chartColors.blue,
        fill: false,
        lineTension: 0,
        data: [],
        hidden: true
      },
      {
        label: "faceCenterY",
        backgroundColor: color(chartColors.green)
          .alpha(0.5)
          .rgbString(),
        borderColor: chartColors.green,
        fill: false,
        lineTension: 0,
        data: [],
        hidden: true
      },
      {
        label: "faceAngle",
        backgroundColor: color(chartColors.purple)
          .alpha(0.5)
          .rgbString(),
        borderColor: chartColors.purple,
        fill: false,
        lineTension: 0,
        data: [],
        hidden: false
      },
      {
        label: "noseAngle",
        backgroundColor: color(chartColors.yellow)
          .alpha(0.5)
          .rgbString(),
        borderColor: chartColors.yellow,
        fill: false,
        lineTension: 0,
        data: [],
        hidden: false
      }
    ]
  },
  options: {
    title: {
      display: true,
      text: "Line chart (hotizontal scroll) sample"
    },
    scales: {
      xAxes: [
        {
          type: "realtime",
          realtime: {
            duration: 20000,
            ttl: undefined
          }
        }
      ],
      yAxes: [
        {
          scaleLabel: {
            display: true,
            labelString: "value"
          }
        }
      ]
    },
    tooltips: {
      mode: "nearest",
      intersect: false
    },
    hover: {
      mode: "nearest",
      intersect: false
    },
    plugins: {
      streaming: {
        frameRate: 15
      }
    }
  }
};

export default function FeatureChart(sources) {
  const vdom$ = xs.of(
    div(".chart", { style: { margin: "auto", width: "75%" } }, [
      canvas(".myChart"),
      div({ style: { textAlign: "center" } }, [
        span([input(".faceSize", { attrs: { type: "checkbox" } }), "faceSize"]),
        span([
          input(".faceHeight", { attrs: { type: "checkbox" } }),
          "faceHeight"
        ]),
        span([
          input(".faceCenterX", { attrs: { type: "checkbox" } }),
          "faceCenterX"
        ]),
        span([
          input(".faceCenterY", { attrs: { type: "checkbox" } }),
          "faceCenterY"
        ]),
        span([
          input(".faceAngle", { attrs: { type: "checkbox", checked: "" } }),
          "faceAngle"
        ]),
        span([
          input(".noseAngle", { attrs: { type: "checkbox", checked: "" } }),
          "noseAngle"
        ])
      ])
    ])
  );

  const chartElem$ = sources.DOM.select(".myChart")
    .element()
    .take(1);
  const chartData$ = sources.features.map(features => [
    features.faceSize,
    features.faceHeight,
    features.faceCenterX,
    features.faceCenterY,
    features.faceAngle,
    features.noseAngle
  ]);
  const chart$ = xs.merge(
    chartElem$.map(elem => ({ type: "CREATE", value: elem })),
    chartData$.map(data => ({ type: "ADD", value: data })),
    sources.DOM.select(".faceSize")
      .events("change")
      .map(ev => ev.target.checked)
      .map(v => ({ type: "UPDATE", value: [{ hidden: !v }] })),
    sources.DOM.select(".faceHeight")
      .events("change")
      .map(ev => ev.target.checked)
      .map(v => ({ type: "UPDATE", value: [{}, { hidden: !v }] })),
    sources.DOM.select(".faceCenterX")
      .events("change")
      .map(ev => ev.target.checked)
      .map(v => ({ type: "UPDATE", value: [{}, {}, { hidden: !v }] })),
    sources.DOM.select(".faceCenterY")
      .events("change")
      .map(ev => ev.target.checked)
      .map(v => ({ type: "UPDATE", value: [{}, {}, {}, { hidden: !v }] })),
    sources.DOM.select(".faceAngle")
      .events("change")
      .map(ev => ev.target.checked)
      .map(v => ({ type: "UPDATE", value: [{}, {}, {}, {}, { hidden: !v }] })),
    sources.DOM.select(".noseAngle")
      .events("change")
      .map(ev => ev.target.checked)
      .map(v => ({
        type: "UPDATE",
        value: [{}, {}, {}, {}, {}, { hidden: !v }]
      }))
  );

  return {
    DOM: vdom$,
    Chart: chart$
  };
}
