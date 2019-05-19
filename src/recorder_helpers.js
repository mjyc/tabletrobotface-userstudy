import xs from 'xstream';
import delay from 'xstream/extra/delay';
import sampleCombine from 'xstream/extra/sampleCombine';
import {button} from '@cycle/dom';

export function makeDownloadDataDriver({
  recordVideo
} = {recordVideo: true}) {
  const downloadDataDriver = (sink$) => {
    const createDownloadLinkElement = (id, href, filename) => {
      const a = document.createElement('a');
      a.id = id;
      a.href = href;
      a.download = filename;
      return a;
    };
    const jsonData$ = sink$
      .filter(v => v.type === 'JSON')
      .map(v => window.URL.createObjectURL(
        new Blob([JSON.stringify(v.value)], {type : 'application/json'})
      ));
    const videoData$ = sink$
      .filter(v => v.type === 'VIDEO')
      .map(v => window.URL.createObjectURL(
        new Blob(v.value, {'type': 'video/mp4'})
      ));
    if (recordVideo) {
      const data$ = xs.combine(jsonData$, videoData$);
      sink$.filter(v => v.type === 'DOWNLOAD')
        .compose(sampleCombine(data$))
        .addListener({
          next: ([_, data]) => {
            const filename = 'Bag ' + new Date().toLocaleString();
            const a1 = createDownloadLinkElement('dl-json', data[0], filename);
            const a2 = createDownloadLinkElement('dl-video', data[1], filename);
            a1.click();
            a2.click();
          },
        });
    } else {
      sink$.filter(v => v.type === 'DOWNLOAD')
        .compose(sampleCombine(jsonData$))
        .addListener({
          next: ([_, jsonData]) => {
            const filename = 'Bag ' + new Date().toLocaleString();
            const a1 = createDownloadLinkElement('dl-json', jsonData, filename);
            a1.click();
          },
        });
      }
  };
  return downloadDataDriver;
}

export function DataDownloader(sources, data$) {
  const downloadClick$ = sources.DOM.select('.download').events('click');
  const vdom$ = !!sources.VideoRecorder ? downloadClick$.take(1).mapTo(true)
    .startWith(false)
    .map(disabled => button('.download', {props: {disabled}}, 'Download'))
  : xs.of(button('.download', 'Download'));

  const downloadData$ = !!sources.VideoRecorder ? xs.merge(
    data$.map(v => ({type: 'JSON', value: v})),
    sources.VideoRecorder.filter(v => v.type === 'BLOBS')
      // it expects VideoRecorder to run on start
      .map(v => ({type: 'VIDEO', value: v.value})),
    sources.VideoRecorder.filter(v => v.type === 'BLOBS')
      // HACK! similar to setTimeout(..., 0)
      .mapTo({type: 'DOWNLOAD'}).compose(delay(0)),
  ) : xs.merge(
    data$.map(v => ({type: 'JSON', value: v})),
    downloadClick$.mapTo({type: 'DOWNLOAD'}),
  );

  const videoRecorder$ = !!sources.VideoRecorder
    ? downloadClick$.mapTo('STOP')
    : xs.never();

  return {
    DOM: vdom$,
    DownloadDataDriver: downloadData$,
    VideoRecorder: videoRecorder$,
  };
}
