// NOTE: might be called twice if transition and emission fncs are called separately
export function transition(state, inputD, inputC) {
  if (state === 'S0' && inputD.type === 'START') {
    return {
      state: 'S1',
      outputs: {
        RobotSpeechbubbleAction: 'Tap "Hello" when you are ready',
        HumanSpeechbubbleAction: ['Hello'],
      },
    };
  } else if (
      (state === 'S1' && inputD.type === 'HumanSpeechbubbleAction'
          && inputD.status === 'SUCCEEDED' && inputD.result === 'Hello')
      || (state === 'S5' && inputD.type === 'HumanSpeechbubbleAction'
          && inputD.status === 'SUCCEEDED' && inputD.result === 'Again')
    ) {
    return {
      state: 'S2',
      outputs: {
        RobotSpeechbubbleAction: 'How are you?',
        HumanSpeechbubbleAction: ['Great!', 'Meh'],
        SpeechSynthesisAction: 'How are you?',
      },
    };
  } else if (state === 'S2' && inputD.type === 'HumanSpeechbubbleAction'
      && inputD.status === 'SUCCEEDED' && inputD.result === 'Great!') {
    return {
      state: 'S3',
      outputs: {
        RobotSpeechbubbleAction:
            'I\'m happy to hear that!',
        HumanSpeechbubbleAction: '',
        SpeechSynthesisAction:
            'I\'m happy to hear that!',
      },
    };
  } else if (state === 'S2' && inputD.type === 'HumanSpeechbubbleAction'
      && inputD.status === 'SUCCEEDED' && inputD.result === 'Meh') {
    return {
      state: 'S4',
      outputs: {
        RobotSpeechbubbleAction: 'I\'m sorry to hear that...',
        HumanSpeechbubbleAction: '',
        SpeechSynthesisAction: 'I\'m sorry to hear that...',
      },
    };
  } else if (
    (state === 'S3' || state === 'S4')
    && inputD.type === 'SpeechSynthesisAction'
    && inputD.status === 'SUCCEEDED'
  ) {
    return {
      state: 'S5',
      outputs: {
        RobotSpeechbubbleAction: 'Tap "Again" to repeat',
        HumanSpeechbubbleAction: ['Again'],
      },
    };
  } else {
    return {
      state: state,
      outputs: null,
    };
  }
};
