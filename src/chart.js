import Chart from 'chart.js'
import _ from 'chartjs-plugin-streaming';
import fromEvent from 'xstream/extra/fromEvent'

export function makeStreamingChartDriver(config) {
  let instance = null;  // lazy initialize chart on first stream event

  const createChart = (el) => {
    const ctx = el.getContext('2d');
    instance = new Chart(ctx, config);
  };

  const updateChart = (datasets) => {
    if (!instance) {
      console.warn('Chart is not initialized yet; skipping updating chart');
      return;
    }

    datasets.map((dataset, i) => {
      Object.keys(dataset).map(k => {
        instance.data.datasets[i][k] = dataset[k];
      });
    });

    instance.update({
      preservation: true
    });
  }

  const addDataset = (dataset) => {
    if (!instance) {
      console.warn('Chart is not initialized yet; skipping adding dataset');
      return;
    }
    dataset.map((data, i) => {
      instance.data.datasets[i].data.push((typeof data !== 'object') ? {
        x: new Date().getTime(),
        y: data,
      } : data);
    });

    instance.update({
      preservation: true
    });
  };

  const createEvent = (evName) => {
    if (!instance) {
      console.error('Chart is not initialized yet; returning null');
      return null;
    }
    return fromEvent(el, evName)
      .filter(() => instance)
      .map((ev) => instance.getElementsAtEvent(ev));
  };

  const streamingChartDriver = (sink$) => {
    sink$.filter(s => s.type === 'CREATE').addListener({
      next: s => createChart(s.value),
    });
    sink$.filter(s => s.type === 'UPDATE').addListener({
      next: s => updateChart(s.value),
    });
    sink$.filter(s => s.type === 'ADD').addListener({
      next: s => addDataset(s.value),
    });

    return {
      events: createEvent,
    };
  };
  return streamingChartDriver;
}
