import xs from 'xstream';
import {run} from '@cycle/run';
import {div, canvas, makeDOMDriver} from '@cycle/dom';
import {config} from './config';
import settings from '../../settings_helper';

const filename = settings.charts.filename || 'testdata.json';

function main(sources) {
  const vdom$ = xs.of(
    div(
      {style: {position: 'relative', height: '50vh', width: '100vw'}},
      canvas('#chart'),
    ),
  );

  sources.DOM.select('#chart').element().take(1).addListener({
    next: (el) => {
      const ctx = el.getContext('2d');
      const instance = new Chart(ctx, config);
      console.log(instance);
    }
  });

  return {
    DOM: vdom$,
  };
}

fetch(`/${filename}`).then((r) => r.json())
  .then((data) => {

  config.data.datasets[0].data = data.features
    .map(ss => ({
      x: ss.timestamp,
      y: ss.value.faceSize,
    }));

  run(main, {
    DOM: makeDOMDriver('#app'),
  });
});
