import {
  intent,
  makeTime$,
  timeTravelStreams,
  timeTravelBarView,
  scopedDOM,
} from '@mjyc/cycle-time-travel';

export default function Replayer (DOM, Time, recordedStreams) {
  const name = '.time-travel';

  const {timeTravelPosition$, playing$} = intent(scopedDOM(DOM, name));

  const time$ = makeTime$(Time, playing$, timeTravelPosition$);

  const timeTravel = timeTravelStreams(recordedStreams, time$);

  return {
    DOM: timeTravelBarView(name, time$, playing$, recordedStreams.filter(s => !s.hidden)),
    timeTravel,
    time: time$,
  };
}
