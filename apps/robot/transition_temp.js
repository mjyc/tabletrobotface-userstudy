

  } else if (state === 'S2' && (
    inputC.elapsedTimeNoFace > params.engagedTimeout
    || inputC.faceCenterX > params.engagedMinX
    || inputC.faceCenterX < params.engagedMaxX
  )) {
    return {
      state: 'SP2',
      outputs: {
        RobotSpeechbubbleAction: 'Tap "Resume" when you are ready',
        HumanSpeechbubbleAction: ['Resume'],
        SpeechSynthesisAction: ' ',
      },
    };
  } else if (state === 'S3' && (
    inputC.elapsedTimeNoFace > params.engagedTimeout
    || inputC.faceCenterX > params.engagedMinX
    || inputC.faceCenterX < params.engagedMaxX
  )) {
    return {
      state: 'SP3',
      outputs: {
        RobotSpeechbubbleAction: 'Tap "Resume" when you are ready',
        HumanSpeechbubbleAction: ['Resume'],
        SpeechSynthesisAction: ' ',
      },
    };
  } else if (state === 'S4' && (
    inputC.elapsedTimeNoFace > params.engagedTimeout
    || inputC.faceCenterX > params.engagedMinX
    || inputC.faceCenterX < params.engagedMaxX
  )) {
    return {
      state: 'SP4',
      outputs: {
        RobotSpeechbubbleAction: 'Tap "Resume" when you are ready',
        HumanSpeechbubbleAction: ['Resume'],
      },
    };


  } else if (state === 'SP2' && (
    inputC.elapsedTimeNoFace < params.engagedTimeout
    && inputC.faceCenterX < params.engagedMinX
    && inputC.faceCenterX < params.engagedMaxX
  )) {
    return {
      state: 'S2',
      outputs: {
        RobotSpeechbubbleAction: 'PROFESSOR ARCHIE MAKES A BANG',
        HumanSpeechbubbleAction: ['Pause'],
        SpeechSynthesisAction: 'PROFESSOR ARCHIE MAKES A BANG',
      },
    };
  } else if (state === 'SP3' && (
    inputC.elapsedTimeNoFace < params.engagedTimeout
    && inputC.faceCenterX < params.engagedMinX
    && inputC.faceCenterX < params.engagedMaxX
  )) {
    return {
      state: 'S3',
      outputs: {
        RobotSpeechbubbleAction:
            'Professor Archie thinks a lot.\nHe thinks of things to make.',
        HumanSpeechbubbleAction: ['Pause'],
        SpeechSynthesisAction:
            'Professor Archie thinks a lot.\nHe thinks of things to make.',
      },
    };
  } else if (state === 'SP4' && (
    inputC.elapsedTimeNoFace < params.engagedTimeout
    && inputC.faceCenterX < params.engagedMinX
    && inputC.faceCenterX < params.engagedMaxX
  )) {
    return {
      state: 'S4',
      outputs: {
        RobotSpeechbubbleAction:
            'Professor Archie thinks a lot.\nHe thinks of things to make.',
        HumanSpeechbubbleAction: ['Pause'],
        SpeechSynthesisAction:
            'Professor Archie thinks a lot.\nHe thinks of things to make.',
      },
    };
