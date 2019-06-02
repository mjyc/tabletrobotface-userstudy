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
        label: "isVisible",
        backgroundColor: color(chartColors.red)
          .alpha(0.5)
          .rgbString(),
        borderColor: chartColors.red,
        fill: false,
        lineTension: 0,
        steppedLine: true,
        data: [],
        hidden: false
      },
      {
        label: "vadState",
        backgroundColor: color(chartColors.orange)
          .alpha(0.5)
          .rgbString(),
        borderColor: chartColors.orange,
        fill: false,
        lineTension: 0,
        steppedLine: true,
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

export default function StateChart(sources) {
  const vdom$ = xs.of(
    div(".stateChart", { style: { margin: "auto", width: "75%" } }, [
      canvas(".myStateChart"),
      div({ style: { textAlign: "center" } }, [
        span([
          input(".isVisible", { attrs: { type: "checkbox", checked: "" } }),
          "isVisible"
        ]),
        span([
          input(".vadState", { attrs: { type: "checkbox", checked: "" } }),
          "vadState"
        ])
      ])
    ])
  );

  const chartElem$ = sources.DOM.select(".myStateChart")
    .element()
    .take(1);
  const chartData$ = xs
    .combine(sources.isVisible, sources.vadState)
    .map(([iv, vs]) => [iv, vs]);
  const chart$ = xs.merge(
    chartElem$.map(elem => ({ type: "CREATE", value: elem })),
    chartData$.map(data => ({ type: "ADD", value: data })),
    sources.DOM.select(".isVisible")
      .events("change")
      .map(ev => ev.target.checked)
      .map(v => ({ type: "UPDATE", value: [{ hidden: !v }] })),
    sources.DOM.select(".vadState")
      .events("change")
      .map(ev => ev.target.checked)
      .map(v => ({ type: "UPDATE", value: [{}, { hidden: !v }] }))
  );

  return {
    DOM: vdom$,
    Chart: chart$
  };
}
