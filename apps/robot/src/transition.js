// NOTE: might be called twice if transition and emission fncs are called separately
export function transition(state, input) {
  if (state === 'S0' && input.type === 'START') {
    return {
      state: 'S1',
      outputs: {
        RobotSpeechbubbleAction: 'Tap "Hello" when you are ready',
        HumanSpeechbubbleAction: ['Hello'],
      },
    };
  } else if (state === 'S1' && input.type === 'HumanSpeechbubbleAction'
      && input.status === 'SUCCEEDED' && input.result === 'Hello') {
    return {
      state: 'S2',
      outputs: {
        RobotSpeechbubbleAction: 'How are you?',
        HumanSpeechbubbleAction: ['Great!', 'Meh'],
        SpeechSynthesisAction: 'How are you?',
      },
    };
  } else if (state === 'S2' && input.type === 'HumanSpeechbubbleAction'
      && input.status === 'SUCCEEDED' && input.result === 'Great!') {
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
  } else if (state === 'S2' && input.type === 'HumanSpeechbubbleAction'
      && input.status === 'SUCCEEDED' && input.result === 'Meh') {
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
    && input.type === 'SpeechSynthesisAction'
    && input.status === 'SUCCEEDED'
  ) {
    return {
      state: 'S1',
      outputs: {
        RobotSpeechbubbleAction: 'Tap "Hello" when you are ready',
        HumanSpeechbubbleAction: ['Hello'],
      },
    };
  } else {
    return {
      state: state,
      outputs: null,
    };
  }
};
