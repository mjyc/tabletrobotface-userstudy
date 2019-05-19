import xs from 'xstream';
import delay from 'xstream/extra/delay';
import {adapt} from '@cycle/run/lib/adapt';

export const isAndroid = () => {
  return /Android/i.test(navigator.userAgent);
}

export const isiOS = () => {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export const isMobile = () => {
  return isAndroid() || isiOS();
}

export const makeMediaRecorderDriver = (options) => {
  if (!options) {
    options = {}
  }

  const videoRecorderDriver = (sink$) => {
    const constraints = options.constraints ? options.constraints : {
      video: {
        facingMode: 'user',
        width: isMobile() ? undefined : 640,
        height: isMobile() ? undefined: 480,
      },
      audio: true
    };
    let mediaRecorder = null;
    let blobs = [];
    const source$ = xs.create();
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      source$.shamefullySendNext({type: 'READY'});
      mediaRecorder = new MediaRecorder(stream);
      mediaRecorder.ondataavailable = (evt) => {
        blobs.push(evt.data);
      };
      mediaRecorder.onstart = () => {
        source$.shamefullySendNext({type: 'START'});
      };
      mediaRecorder.onstop = (_) => {
        source$.shamefullySendNext({type: 'BLOBS', value: blobs});
        blobs = [];
      };
    }).catch((err) => {
      console.error('Failed to get MediaStream');
      throw err;
    });

    const timeout = options.timeout || 60 * 10000; // 10mins
    const timeout$ = xs.of('STOP').compose(delay(timeout));
    xs.merge(sink$, timeout$).addListener({
      next: v => {
        if (v.type === 'COMMAND' || typeof v === 'string') {
          const cmd = typeof v === 'string' ? v : v.value;
          if (cmd === 'START') {
            if (mediaRecorder && mediaRecorder.state !== 'recording') {
              mediaRecorder.start();
            } else {
              console.warn(`mediaRecorder.start() not allowed`);
            }
          } else if (cmd === 'STOP') {
            if (mediaRecorder && mediaRecorder.state !== 'inactive') {
              mediaRecorder.stop();
            } else {
              console.warn(`mediaRecorder.stop() not allowed`);
            }
          }
        }
      }
    });

    return adapt(source$);
  }

  return videoRecorderDriver;
}
