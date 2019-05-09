// NOTE: might be called twice if transition and emission fncs are called separately
function transition(state, inputD, inputC, params) {
  var engagedMinNoseAngle = params.engagedMinNoseAngle;
  var engagedMaxNoseAngle = params.engagedMaxNoseAngle;
  var disengagedMinNoseAngle = params.disengagedMinNoseAngle;
  var disengagedMaxNoseAngle = params.disengagedMaxNoseAngle;
  var disengagedTimeoutIntervalMs = params.disengagedTimeoutIntervalMs;


  // Happy path
  if (state === "S0" && inputD.type === "START") {
    return {
      state: "S1",
      outputs: {
        RobotSpeechbubbleAction: 'Tap "Hello" when you are ready',
        HumanSpeechbubbleAction: ["Hello"]
      }
    };
  } else if (
    state === "S1" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Hello"
  ) {
    return {
      state: "S2",
      outputs: {
        RobotSpeechbubbleAction: "PROFESSOR ARCHIE MAKES A BANG",
        HumanSpeechbubbleAction: ["Pause"],
        SpeechSynthesisAction: "PROFESSOR ARCHIE MAKES A BANG"
      }
    };
  } else if (
    state === "S2" &&
    inputD.type === "SpeechSynthesisAction" &&
    inputD.status === "SUCCEEDED"
  ) {
    return {
      state: "S3",
      outputs: {
        RobotSpeechbubbleAction: "Professor Archie thinks a lot. He thinks of things to make.",
        HumanSpeechbubbleAction: ["Pause"],
        SpeechSynthesisAction: "Professor Archie thinks a lot. He thinks of things to make."
      }
    };
  } else if (
    state === "S3" &&
    inputD.type === "SpeechSynthesisAction" &&
    inputD.status === "SUCCEEDED"
  ) {
    return {
      state: "S4",
      outputs: {
        RobotSpeechbubbleAction: "He thinks as he brushes his teeth. He thinks at his desk. He even thinks in bed. Then, it clicks.",
        HumanSpeechbubbleAction: ["Pause"],
        SpeechSynthesisAction: "He thinks as he brushes his teeth. He thinks at his desk. He even thinks in bed. Then, it clicks."
      }
    };
  } else if (
    state === "S4" &&
    inputD.type === "SpeechSynthesisAction" &&
    inputD.status === "SUCCEEDED"
  ) {
    return {
      state: "S5",
      outputs: {
        RobotSpeechbubbleAction: "Archie makes bots that can help. The bots make toast for Archie.",
        HumanSpeechbubbleAction: ["Pause"],
        SpeechSynthesisAction: "Archie makes bots that can help. The bots make toast for Archie."
      }
    };
  } else if (
    state === "S5" &&
    inputD.type === "SpeechSynthesisAction" &&
    inputD.status === "SUCCEEDED"
  ) {
    return {
      state: "S6",
      outputs: {
        RobotSpeechbubbleAction: "Archie makes a pen that can do art by itself.",
        HumanSpeechbubbleAction: ["Pause"],
        SpeechSynthesisAction: "Archie makes a pen that can do art by itself."
      }
    };
  } else if (
    state === "S6" &&
    inputD.type === "SpeechSynthesisAction" &&
    inputD.status === "SUCCEEDED"
  ) {
    return {
      state: "S7",
      outputs: {
        RobotSpeechbubbleAction: "What do you think of it?",
        HumanSpeechbubbleAction: ["Pause"],
        SpeechSynthesisAction: "What do you think of it?"
      }
    };
  } else if (
    state === "S7" &&
    inputD.type === "SpeechSynthesisAction" &&
    inputD.status === "SUCCEEDED"
  ) {
    return {
      state: "S8",
      outputs: {
        RobotSpeechbubbleAction: "Archie makes it so that his bike can run his laptop.",
        HumanSpeechbubbleAction: ["Pause"],
        SpeechSynthesisAction: "Archie makes it so that his bike can run his laptop."
      }
    };
  } else if (
    state === "S8" &&
    inputD.type === "SpeechSynthesisAction" &&
    inputD.status === "SUCCEEDED"
  ) {
    return {
      state: "S9",
      outputs: {
        RobotSpeechbubbleAction: "Archie even makes it so that cars can sail.",
        HumanSpeechbubbleAction: ["Pause"],
        SpeechSynthesisAction: "Archie even makes it so that cars can sail."
      }
    };
  } else if (
    state === "S9" &&
    inputD.type === "SpeechSynthesisAction" &&
    inputD.status === "SUCCEEDED"
  ) {
    return {
      state: "S10",
      outputs: {
        RobotSpeechbubbleAction: "Archie has a lot of plans. He never stops inventing.",
        HumanSpeechbubbleAction: ["Pause"],
        SpeechSynthesisAction: "Archie has a lot of plans. He never stops inventing."
      }
    };
  } else if (
    state === "S10" &&
    inputD.type === "SpeechSynthesisAction" &&
    inputD.status === "SUCCEEDED"
  ) {
    return {
      state: "S11",
      outputs: {
        RobotSpeechbubbleAction: "What would you make if you were Archie?",
        HumanSpeechbubbleAction: ["Pause"],
        SpeechSynthesisAction: "What would you make if you were Archie?"
      }
    };
  } else if (
    state === "S11" &&
    inputD.type === "SpeechSynthesisAction" &&
    inputD.status === "SUCCEEDED"
  ) {
    return {
      state: "S12",
      outputs: {
        RobotSpeechbubbleAction: "The END",
        HumanSpeechbubbleAction: "",
        SpeechSynthesisAction: "The END"
      }
    };


  // Handle Pause
  } else if (
    state === "S2" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Pause"
  ) {
    return {
      state: "SP2",
      outputs: {
        RobotSpeechbubbleAction: 'Tap "Resume" when you are ready',
        HumanSpeechbubbleAction: ["Resume"],
        SpeechSynthesisAction: " "
      }
    };
  } else if (
    state === "S3" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Pause"
  ) {
    return {
      state: "SP3",
      outputs: {
        RobotSpeechbubbleAction: 'Tap "Resume" when you are ready',
        HumanSpeechbubbleAction: ["Resume"],
        SpeechSynthesisAction: " "
      }
    };
  } else if (
    state === "S4" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Pause"
  ) {
    return {
      state: "SP4",
      outputs: {
        RobotSpeechbubbleAction: 'Tap "Resume" when you are ready',
        HumanSpeechbubbleAction: ["Resume"],
        SpeechSynthesisAction: " "
      }
    };
  } else if (
    state === "S5" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Pause"
  ) {
    return {
      state: "SP5",
      outputs: {
        RobotSpeechbubbleAction: 'Tap "Resume" when you are ready',
        HumanSpeechbubbleAction: ["Resume"],
        SpeechSynthesisAction: " "
      }
    };
  } else if (
    state === "S6" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Pause"
  ) {
    return {
      state: "SP6",
      outputs: {
        RobotSpeechbubbleAction: 'Tap "Resume" when you are ready',
        HumanSpeechbubbleAction: ["Resume"],
        SpeechSynthesisAction: " "
      }
    };
  } else if (
    state === "S7" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Pause"
  ) {
    return {
      state: "SP7",
      outputs: {
        RobotSpeechbubbleAction: 'Tap "Resume" when you are ready',
        HumanSpeechbubbleAction: ["Resume"],
        SpeechSynthesisAction: " "
      }
    };
  } else if (
    state === "S8" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Pause"
  ) {
    return {
      state: "SP8",
      outputs: {
        RobotSpeechbubbleAction: 'Tap "Resume" when you are ready',
        HumanSpeechbubbleAction: ["Resume"],
        SpeechSynthesisAction: " "
      }
    };
  } else if (
    state === "S9" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Pause"
  ) {
    return {
      state: "SP9",
      outputs: {
        RobotSpeechbubbleAction: 'Tap "Resume" when you are ready',
        HumanSpeechbubbleAction: ["Resume"],
        SpeechSynthesisAction: " "
      }
    };
  } else if (
    state === "S10" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Pause"
  ) {
    return {
      state: "SP10",
      outputs: {
        RobotSpeechbubbleAction: 'Tap "Resume" when you are ready',
        HumanSpeechbubbleAction: ["Resume"],
        SpeechSynthesisAction: " "
      }
    };
  } else if (
    state === "S11" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Pause"
  ) {
    return {
      state: "SP11",
      outputs: {
        RobotSpeechbubbleAction: 'Tap "Resume" when you are ready',
        HumanSpeechbubbleAction: ["Resume"],
        SpeechSynthesisAction: " "
      }
    };


  // Handle Resume
  } else if (
    state === "SP2" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Resume"
  ) {
    return {
      state: "S2",
      outputs: {
        RobotSpeechbubbleAction: "PROFESSOR ARCHIE MAKES A BANG",
        HumanSpeechbubbleAction: ["Pause"],
        SpeechSynthesisAction: "PROFESSOR ARCHIE MAKES A BANG"
      }
    };
  } else if (
    state === "SP3" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Resume"
  ) {
    return {
      state: "S3",
      outputs: {
        RobotSpeechbubbleAction: "Professor Archie thinks a lot. He thinks of things to make.",
        HumanSpeechbubbleAction: ["Pause"],
        SpeechSynthesisAction: "Professor Archie thinks a lot. He thinks of things to make."
      }
    };
  } else if (
    state === "SP4" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Resume"
  ) {
    return {
      state: "S4",
      outputs: {
        RobotSpeechbubbleAction: "He thinks as he brushes his teeth. He thinks at his desk. He even thinks in bed. Then, it clicks.",
        HumanSpeechbubbleAction: ["Pause"],
        SpeechSynthesisAction: "He thinks as he brushes his teeth. He thinks at his desk. He even thinks in bed. Then, it clicks."
      }
    };
  } else if (
    state === "SP5" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Resume"
  ) {
    return {
      state: "S5",
      outputs: {
        RobotSpeechbubbleAction: "Archie makes bots that can help. The bots make toast for Archie.",
        HumanSpeechbubbleAction: ["Pause"],
        SpeechSynthesisAction: "Archie makes bots that can help. The bots make toast for Archie."
      }
    };
  } else if (
    state === "SP6" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Resume"
  ) {
    return {
      state: "S6",
      outputs: {
        RobotSpeechbubbleAction: "Archie makes a pen that can do art by itself.",
        HumanSpeechbubbleAction: ["Pause"],
        SpeechSynthesisAction: "Archie makes a pen that can do art by itself."
      }
    };
  } else if (
    state === "SP7" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Resume"
  ) {
    return {
      state: "S7",
      outputs: {
        RobotSpeechbubbleAction: "What do you think of it?",
        HumanSpeechbubbleAction: ["Pause"],
        SpeechSynthesisAction: "What do you think of it?"
      }
    };
  } else if (
    state === "SP8" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Resume"
  ) {
    return {
      state: "S8",
      outputs: {
        RobotSpeechbubbleAction: "Archie makes it so that his bike can run his laptop.",
        HumanSpeechbubbleAction: ["Pause"],
        SpeechSynthesisAction: "Archie makes it so that his bike can run his laptop."
      }
    };
  } else if (
    state === "SP9" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Resume"
  ) {
    return {
      state: "S9",
      outputs: {
        RobotSpeechbubbleAction: "Archie even makes it so that cars can sail.",
        HumanSpeechbubbleAction: ["Pause"],
        SpeechSynthesisAction: "Archie even makes it so that cars can sail."
      }
    };
  } else if (
    state === "SP10" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Resume"
  ) {
    return {
      state: "S10",
      outputs: {
        RobotSpeechbubbleAction: "Archie has a lot of plans. He never stops inventing.",
        HumanSpeechbubbleAction: ["Pause"],
        SpeechSynthesisAction: "Archie has a lot of plans. He never stops inventing."
      }
    };
  } else if (
    state === "SP11" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Resume"
  ) {
    return {
      state: "S11",
      outputs: {
        RobotSpeechbubbleAction: "What would you make if you were Archie?",
        HumanSpeechbubbleAction: ["Pause"],
        SpeechSynthesisAction: "What would you make if you were Archie?"
      }
    };


  // Proactive Pause
  } else if (state === "S2" && inputD.type === "Features") {
    if (
      (inputC.face.isVisible &&
        (inputC.face.noseAngle > disengagedMaxNoseAngle ||
          inputC.face.noseAngle < disengagedMinNoseAngle)) ||
      (!inputC.face.isVisible &&
        inputC.face.stamp - inputC.face.stampLastDetected >
          disengagedTimeoutIntervalMs)
    ) {
      return {
        state: "SP2",
        outputs: {
          RobotSpeechbubbleAction: 'Tap "Resume" when you are ready',
          HumanSpeechbubbleAction: ["Resume"],
          SpeechSynthesisAction: " "
        }
      };
    } else {
      return {
        state: state,
        outputs: null
      };
    }
  } else if (state === "S3" && inputD.type === "Features") {
    if (
      (inputC.face.isVisible &&
        (inputC.face.noseAngle > disengagedMaxNoseAngle ||
          inputC.face.noseAngle < disengagedMinNoseAngle)) ||
      (!inputC.face.isVisible &&
        inputC.face.stamp - inputC.face.stampLastDetected >
          disengagedTimeoutIntervalMs)
    ) {
      return {
        state: "SP3",
        outputs: {
          RobotSpeechbubbleAction: 'Tap "Resume" when you are ready',
          HumanSpeechbubbleAction: ["Resume"],
          SpeechSynthesisAction: " "
        }
      };
    } else {
      return {
        state: state,
        outputs: null
      };
    }
  } else if (state === "S4" && inputD.type === "Features") {
    if (
      (inputC.face.isVisible &&
        (inputC.face.noseAngle > disengagedMaxNoseAngle ||
          inputC.face.noseAngle < disengagedMinNoseAngle)) ||
      (!inputC.face.isVisible &&
        inputC.face.stamp - inputC.face.stampLastDetected >
          disengagedTimeoutIntervalMs)
    ) {
      return {
        state: "SP4",
        outputs: {
          RobotSpeechbubbleAction: 'Tap "Resume" when you are ready',
          HumanSpeechbubbleAction: ["Resume"],
          SpeechSynthesisAction: " "
        }
      };
    } else {
      return {
        state: state,
        outputs: null
      };
    }
  } else if (state === "S5" && inputD.type === "Features") {
    if (
      (inputC.face.isVisible &&
        (inputC.face.noseAngle > disengagedMaxNoseAngle ||
          inputC.face.noseAngle < disengagedMinNoseAngle)) ||
      (!inputC.face.isVisible &&
        inputC.face.stamp - inputC.face.stampLastDetected >
          disengagedTimeoutIntervalMs)
    ) {
      return {
        state: "SP5",
        outputs: {
          RobotSpeechbubbleAction: 'Tap "Resume" when you are ready',
          HumanSpeechbubbleAction: ["Resume"],
          SpeechSynthesisAction: " "
        }
      };
    } else {
      return {
        state: state,
        outputs: null
      };
    }
  } else if (state === "S6" && inputD.type === "Features") {
    if (
      (inputC.face.isVisible &&
        (inputC.face.noseAngle > disengagedMaxNoseAngle ||
          inputC.face.noseAngle < disengagedMinNoseAngle)) ||
      (!inputC.face.isVisible &&
        inputC.face.stamp - inputC.face.stampLastDetected >
          disengagedTimeoutIntervalMs)
    ) {
      return {
        state: "SP6",
        outputs: {
          RobotSpeechbubbleAction: 'Tap "Resume" when you are ready',
          HumanSpeechbubbleAction: ["Resume"],
          SpeechSynthesisAction: " "
        }
      };
    } else {
      return {
        state: state,
        outputs: null
      };
    }
  } else if (state === "S7" && inputD.type === "Features") {
    if (
      (inputC.face.isVisible &&
        (inputC.face.noseAngle > disengagedMaxNoseAngle ||
          inputC.face.noseAngle < disengagedMinNoseAngle)) ||
      (!inputC.face.isVisible &&
        inputC.face.stamp - inputC.face.stampLastDetected >
          disengagedTimeoutIntervalMs)
    ) {
      return {
        state: "SP7",
        outputs: {
          RobotSpeechbubbleAction: 'Tap "Resume" when you are ready',
          HumanSpeechbubbleAction: ["Resume"],
          SpeechSynthesisAction: " "
        }
      };
    } else {
      return {
        state: state,
        outputs: null
      };
    }
  } else if (state === "S8" && inputD.type === "Features") {
    if (
      (inputC.face.isVisible &&
        (inputC.face.noseAngle > disengagedMaxNoseAngle ||
          inputC.face.noseAngle < disengagedMinNoseAngle)) ||
      (!inputC.face.isVisible &&
        inputC.face.stamp - inputC.face.stampLastDetected >
          disengagedTimeoutIntervalMs)
    ) {
      return {
        state: "SP8",
        outputs: {
          RobotSpeechbubbleAction: 'Tap "Resume" when you are ready',
          HumanSpeechbubbleAction: ["Resume"],
          SpeechSynthesisAction: " "
        }
      };
    } else {
      return {
        state: state,
        outputs: null
      };
    }
  } else if (state === "S9" && inputD.type === "Features") {
    if (
      (inputC.face.isVisible &&
        (inputC.face.noseAngle > disengagedMaxNoseAngle ||
          inputC.face.noseAngle < disengagedMinNoseAngle)) ||
      (!inputC.face.isVisible &&
        inputC.face.stamp - inputC.face.stampLastDetected >
          disengagedTimeoutIntervalMs)
    ) {
      return {
        state: "SP9",
        outputs: {
          RobotSpeechbubbleAction: 'Tap "Resume" when you are ready',
          HumanSpeechbubbleAction: ["Resume"],
          SpeechSynthesisAction: " "
        }
      };
    } else {
      return {
        state: state,
        outputs: null
      };
    }
  } else if (state === "S10" && inputD.type === "Features") {
    if (
      (inputC.face.isVisible &&
        (inputC.face.noseAngle > disengagedMaxNoseAngle ||
          inputC.face.noseAngle < disengagedMinNoseAngle)) ||
      (!inputC.face.isVisible &&
        inputC.face.stamp - inputC.face.stampLastDetected >
          disengagedTimeoutIntervalMs)
    ) {
      return {
        state: "SP10",
        outputs: {
          RobotSpeechbubbleAction: 'Tap "Resume" when you are ready',
          HumanSpeechbubbleAction: ["Resume"],
          SpeechSynthesisAction: " "
        }
      };
    } else {
      return {
        state: state,
        outputs: null
      };
    }
  } else if (state === "S11" && inputD.type === "Features") {
    if (
      (inputC.face.isVisible &&
        (inputC.face.noseAngle > disengagedMaxNoseAngle ||
          inputC.face.noseAngle < disengagedMinNoseAngle)) ||
      (!inputC.face.isVisible &&
        inputC.face.stamp - inputC.face.stampLastDetected >
          disengagedTimeoutIntervalMs)
    ) {
      return {
        state: "SP11",
        outputs: {
          RobotSpeechbubbleAction: 'Tap "Resume" when you are ready',
          HumanSpeechbubbleAction: ["Resume"],
          SpeechSynthesisAction: " "
        }
      };
    } else {
      return {
        state: state,
        outputs: null
      };
    }


  // Proactive Resume
  } else if (state === "SP2" && inputD.type === "Features") {
    if (
      inputC.face.isVisible &&
      (inputC.face.noseAngle < engagedMaxNoseAngle &&
        inputC.face.noseAngle > engagedMinNoseAngle)
    ) {
      return {
        state: "S2",
        outputs: {
          RobotSpeechbubbleAction: "PROFESSOR ARCHIE MAKES A BANG",
          HumanSpeechbubbleAction: ["Pause"],
          SpeechSynthesisAction: "PROFESSOR ARCHIE MAKES A BANG"
        }
      };
    } else {
      return {
        state: state,
        outputs: null
      };
    }
  } else if (state === "SP3" && inputD.type === "Features") {
    if (
      inputC.face.isVisible &&
      (inputC.face.noseAngle < engagedMaxNoseAngle &&
        inputC.face.noseAngle > engagedMinNoseAngle)
    ) {
      return {
        state: "S3",
        outputs: {
          RobotSpeechbubbleAction: "Professor Archie thinks a lot. He thinks of things to make.",
          HumanSpeechbubbleAction: ["Pause"],
          SpeechSynthesisAction: "Professor Archie thinks a lot. He thinks of things to make."
        }
      };
    } else {
      return {
        state: state,
        outputs: null
      };
    }
  } else if (state === "SP4" && inputD.type === "Features") {
    if (
      inputC.face.isVisible &&
      (inputC.face.noseAngle < engagedMaxNoseAngle &&
        inputC.face.noseAngle > engagedMinNoseAngle)
    ) {
      return {
        state: "S4",
        outputs: {
          RobotSpeechbubbleAction: "He thinks as he brushes his teeth. He thinks at his desk. He even thinks in bed. Then, it clicks.",
          HumanSpeechbubbleAction: ["Pause"],
          SpeechSynthesisAction: "He thinks as he brushes his teeth. He thinks at his desk. He even thinks in bed. Then, it clicks."
        }
      };
    } else {
      return {
        state: state,
        outputs: null
      };
    }
  } else if (state === "SP5" && inputD.type === "Features") {
    if (
      inputC.face.isVisible &&
      (inputC.face.noseAngle < engagedMaxNoseAngle &&
        inputC.face.noseAngle > engagedMinNoseAngle)
    ) {
      return {
        state: "S5",
        outputs: {
          RobotSpeechbubbleAction: "Archie makes bots that can help. The bots make toast for Archie.",
          HumanSpeechbubbleAction: ["Pause"],
          SpeechSynthesisAction: "Archie makes bots that can help. The bots make toast for Archie."
        }
      };
    } else {
      return {
        state: state,
        outputs: null
      };
    }
  } else if (state === "SP6" && inputD.type === "Features") {
    if (
      inputC.face.isVisible &&
      (inputC.face.noseAngle < engagedMaxNoseAngle &&
        inputC.face.noseAngle > engagedMinNoseAngle)
    ) {
      return {
        state: "S6",
        outputs: {
          RobotSpeechbubbleAction: "Archie makes a pen that can do art by itself.",
          HumanSpeechbubbleAction: ["Pause"],
          SpeechSynthesisAction: "Archie makes a pen that can do art by itself."
        }
      };
    } else {
      return {
        state: state,
        outputs: null
      };
    }
  } else if (state === "SP7" && inputD.type === "Features") {
    if (
      inputC.face.isVisible &&
      (inputC.face.noseAngle < engagedMaxNoseAngle &&
        inputC.face.noseAngle > engagedMinNoseAngle)
    ) {
      return {
        state: "S7",
        outputs: {
          RobotSpeechbubbleAction: "What do you think of it?",
          HumanSpeechbubbleAction: ["Pause"],
          SpeechSynthesisAction: "What do you think of it?"
        }
      };
    } else {
      return {
        state: state,
        outputs: null
      };
    }
  } else if (state === "SP8" && inputD.type === "Features") {
    if (
      inputC.face.isVisible &&
      (inputC.face.noseAngle < engagedMaxNoseAngle &&
        inputC.face.noseAngle > engagedMinNoseAngle)
    ) {
      return {
        state: "S8",
        outputs: {
          RobotSpeechbubbleAction: "Archie makes it so that his bike can run his laptop.",
          HumanSpeechbubbleAction: ["Pause"],
          SpeechSynthesisAction: "Archie makes it so that his bike can run his laptop."
        }
      };
    } else {
      return {
        state: state,
        outputs: null
      };
    }
  } else if (state === "SP9" && inputD.type === "Features") {
    if (
      inputC.face.isVisible &&
      (inputC.face.noseAngle < engagedMaxNoseAngle &&
        inputC.face.noseAngle > engagedMinNoseAngle)
    ) {
      return {
        state: "S9",
        outputs: {
          RobotSpeechbubbleAction: "Archie even makes it so that cars can sail.",
          HumanSpeechbubbleAction: ["Pause"],
          SpeechSynthesisAction: "Archie even makes it so that cars can sail."
        }
      };
    } else {
      return {
        state: state,
        outputs: null
      };
    }
  } else if (state === "SP10" && inputD.type === "Features") {
    if (
      inputC.face.isVisible &&
      (inputC.face.noseAngle < engagedMaxNoseAngle &&
        inputC.face.noseAngle > engagedMinNoseAngle)
    ) {
      return {
        state: "S10",
        outputs: {
          RobotSpeechbubbleAction: "Archie has a lot of plans. He never stops inventing.",
          HumanSpeechbubbleAction: ["Pause"],
          SpeechSynthesisAction: "Archie has a lot of plans. He never stops inventing."
        }
      };
    } else {
      return {
        state: state,
        outputs: null
      };
    }
  } else if (state === "SP11" && inputD.type === "Features") {
    if (
      inputC.face.isVisible &&
      (inputC.face.noseAngle < engagedMaxNoseAngle &&
        inputC.face.noseAngle > engagedMinNoseAngle)
    ) {
      return {
        state: "S11",
        outputs: {
          RobotSpeechbubbleAction: "What would you make if you were Archie?",
          HumanSpeechbubbleAction: ["Pause"],
          SpeechSynthesisAction: "What would you make if you were Archie?"
        }
      };
    } else {
      return {
        state: state,
        outputs: null
      };
    }


  } else {
    return {
      state,
      outputs: null
    };
  }
}


// Params for reactive behavior
var defaultParams = {
  engagedMinNoseAngle: 90,
  engagedMaxNoseAngle: 90,
  disengagedMinNoseAngle: 0,
  disengagedMaxNoseAngle: 180,
  disengagedTimeoutIntervalMs: 1000
};

module.exports = {
  transition: transition,
  defaultParams: defaultParams
};

