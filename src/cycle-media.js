import xs from "xstream";
import delay from "xstream/extra/delay";
import sampleCombine from "xstream/extra/sampleCombine";
import { adapt } from "@cycle/run/lib/adapt";
import { button } from "@cycle/dom";

export const isAndroid = () => {
  return /Android/i.test(navigator.userAgent);
};

export const isiOS = () => {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
};

export const isMobile = () => {
  return isAndroid() || isiOS();
};

export const mockMediaRecorderSource = () => {
  return xs.never();
};

export const makeMediaRecorderDriver = options => {
  if (!options) {
    options = {};
  }

  const videoRecorderDriver = sink$ => {
    const constraints = options.constraints
      ? options.constraints
      : {
          video: {
            facingMode: "user",
            width: isMobile() ? undefined : 640,
            height: isMobile() ? undefined : 480
          },
          audio: true
        };
    let mediaRecorder = null;
    let blobs = [];
    const source$ = xs.create();
    navigator.mediaDevices
      .getUserMedia(constraints)
      .then(stream => {
        source$.shamefullySendNext({ type: "READY" });
        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = evt => {
          blobs.push(evt.data);
        };
        mediaRecorder.onstart = () => {
          source$.shamefullySendNext({ type: "START" });
        };
        mediaRecorder.onstop = _ => {
          source$.shamefullySendNext({ type: "BLOBS", value: blobs });
          blobs = [];
        };
      })
      .catch(err => {
        console.error("Failed to get MediaStream");
        throw err;
      });

    const timeout = options.timeout || 60 * 10000; // 10mins
    const timeout$ = xs.of("STOP").compose(delay(timeout));
    xs.merge(sink$, timeout$).addListener({
      next: v => {
        if (v.type === "COMMAND" || typeof v === "string") {
          const cmd = typeof v === "string" ? v : v.value;
          if (cmd === "START") {
            if (mediaRecorder && mediaRecorder.state !== "recording") {
              mediaRecorder.start();
            } else {
              console.warn(`mediaRecorder.start() not allowed`);
            }
          } else if (cmd === "STOP") {
            if (mediaRecorder && mediaRecorder.state !== "inactive") {
              mediaRecorder.stop();
            } else {
              console.warn(`mediaRecorder.stop() not allowed`);
            }
          }
        }
      }
    });

    return adapt(source$);
  };

  return videoRecorderDriver;
};

export function mockDownloadDataSource() {
  return {
    DOM: xs.never(),
    DownloadData: xs.never(),
    VideoRecorder: xs.never()
  };
}

export function makeDownloadDataDriver({
  filenamePrefix = "Data",
  recordVideo = true
} = {}) {
  const downloadDataDriver = sink$ => {
    const createDownloadLinkElement = (id, href, filename) => {
      const a = document.createElement("a");
      a.id = id;
      a.href = href;
      a.download = filename;
      return a;
    };
    const jsonData$ = sink$
      .filter(v => v.type === "JSON")
      .map(v =>
        window.URL.createObjectURL(
          new Blob([JSON.stringify(v.value)], { type: "application/json" })
        )
      );
    const videoData$ = sink$
      .filter(v => v.type === "VIDEO")
      .map(v =>
        window.URL.createObjectURL(new Blob(v.value, { type: "video/mp4" }))
      );
    if (recordVideo) {
      const data$ = xs.combine(jsonData$, videoData$);
      sink$
        .filter(v => v.type === "DOWNLOAD")
        .compose(sampleCombine(data$))
        .addListener({
          next: ([_, data]) => {
            const filename = `${filenamePrefix} ${new Date().toLocaleString()}`;
            const a1 = createDownloadLinkElement("dl-json", data[0], filename);
            const a2 = createDownloadLinkElement("dl-video", data[1], filename);
            a1.click();
            a2.click();
          }
        });
    } else {
      sink$
        .filter(v => v.type === "DOWNLOAD")
        .compose(sampleCombine(jsonData$))
        .addListener({
          next: ([_, jsonData]) => {
            const filename = `${filenamePrefix} ` + new Date().toLocaleString();
            const a1 = createDownloadLinkElement("dl-json", jsonData, filename);
            a1.click();
          }
        });
    }
  };
  return downloadDataDriver;
}

export function DataDownloader(sources, data$) {
  const downloadClick$ = sources.DOM.select(".download").events("click");
  const vdom$ = !!sources.VideoRecorder
    ? downloadClick$
        .take(1)
        .mapTo(true)
        .startWith(false)
        .map(disabled =>
          button(".download", { props: { disabled } }, "Download")
        )
    : xs.of(button(".download", "Download"));

  const downloadData$ = !!sources.VideoRecorder
    ? xs.merge(
        data$.map(v => ({ type: "JSON", value: v })),
        sources.VideoRecorder.filter(v => v.type === "BLOBS")
          // it expects VideoRecorder to run on start
          .map(v => ({ type: "VIDEO", value: v.value })),
        sources.VideoRecorder.filter(v => v.type === "BLOBS")
          // HACK! similar to setTimeout(..., 0)
          .mapTo({ type: "DOWNLOAD" })
          .compose(delay(0))
      )
    : xs.merge(
        data$.map(v => ({ type: "JSON", value: v })),
        downloadClick$.mapTo({ type: "DOWNLOAD" })
      );

  const videoRecorder$ = !!sources.VideoRecorder
    ? downloadClick$.mapTo("STOP")
    : xs.never();

  return {
    DOM: vdom$,
    DownloadData: downloadData$,
    VideoRecorder: videoRecorder$
  };
}
