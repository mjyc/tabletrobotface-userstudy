// NOTE: might be called twice if transition and emission fncs are called separately
export function transition(state, inputD, inputC, params) {
  if (state === 'S0' && inputD.type === 'START') {
    return {
      state: 'S1',
      outputs: {
        RobotSpeechbubbleAction: 'Tap "Pause" to pause',
        HumanSpeechbubbleAction: ['Pause'],
      },
    };
  } else if (
      state === 'S1' && inputD.type === 'HumanSpeechbubbleAction'
      && inputD.status === 'SUCCEEDED' && inputD.result === 'Pause'
  ) {
    return {
      state: 'S2',
      outputs: {
        RobotSpeechbubbleAction: 'Tap "Resume" to resume',
        HumanSpeechbubbleAction: ['Resume'],
      },
    };
  } else if (
      state === 'S2' && inputD.type === 'HumanSpeechbubbleAction'
      && inputD.status === 'SUCCEEDED' && inputD.result === 'Resume'
  ) {
    return {
      state: 'S1',
      outputs: {
        RobotSpeechbubbleAction: 'Tap "Pause" to pause',
        HumanSpeechbubbleAction: ['Pause'],
      },
    };


  } else if (
      state === 'S1' && inputD.type === 'Features'
      && inputC.face.faceCenterX > params.engagedMinX
  ) {
    return {
      state: 'S2',
      outputs: {
        RobotSpeechbubbleAction: 'Tap "Resume" to resume',
        HumanSpeechbubbleAction: ['Resume'],
      },
    };
  } else if (
      state === 'S2' && inputD.type === 'Features'
      && inputC.face.faceCenterX < params.engagedMinX
  ) {
    return {
      state: 'S1',
      outputs: {
        RobotSpeechbubbleAction: 'Tap "Pause" to pause',
        HumanSpeechbubbleAction: ['Pause'],
      },
    };

  } else {
    return {
      state: state,
      outputs: null,
    };
  }
};

export let defaultParams = {
  engagedMinX: 340,
};
