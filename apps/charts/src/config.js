import Chart from 'chart.js';

const color = Chart.helpers.color;
const chartColors = {
  red: 'rgb(255, 99, 132)',
  orange: 'rgb(255, 159, 64)',
  yellow: 'rgb(255, 205, 86)',
  green: 'rgb(75, 192, 192)',
  blue: 'rgb(54, 162, 235)',
  purple: 'rgb(153, 102, 255)',
  grey: 'rgb(201, 203, 207)'
};
const config = {
  type: 'line',
  data: {
    datasets: [
      {
        label: 'faceSize',
        yAxisID: 'y-axis-area',
        backgroundColor: color(chartColors.green).alpha(0.5).rgbString(),
        borderColor: chartColors.green,
        borderWidth: 1,
        fill: false,
        lineTension: 0,
        showLine: true,
        data: [],
      }
    ]
  },
  options: {
    maintainAspectRatio: false,
    scales: {
      xAxes: [{
        type: 'time',
        time: {
          parser: 'x',
          stepSize: 5000,
          tooltipFormat: 'x',
          unit: 'millisecond',
          displayFormats: {millisecond: 'x'},
        },
        scaleLabel: {
          display: true,
          labelString: 'time (msec)'
        }
      }],
      yAxes: [{
        id: 'y-axis-area',
        type: 'linear',
        position: 'left',
        scaleLabel: {
          display: true,
          labelString: 'px^2',
        },
      }],
    },
    legend: {
      labels: {
        usePointStyle: true,
      },
    },
  }
};

export {config};