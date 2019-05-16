// NOTE: might be called twice if transition and emission fncs are called separately
function transition(stateStamped, inputD, inputC, params) {
  var engagedMinNoseAngle = params.engagedMinNoseAngle;
  var engagedMaxNoseAngle = params.engagedMaxNoseAngle;
  var disengagedMinNoseAngle = params.disengagedMinNoseAngle;
  var disengagedMaxNoseAngle = params.disengagedMaxNoseAngle;
  var disengagedTimeoutIntervalMs = params.disengagedTimeoutIntervalMs;

  // Happy path
  if (stateStamped.state === "S0" && inputD.type === "START") {
    return {
      state: "S1",
      outputs: {
        RobotSpeechbubbleAction: 'Tap "Hello" when you are ready',
        HumanSpeechbubbleAction: ["Hello"]
      }
    };
  } else if (
    stateStamped.state === "S1" &&
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
    stateStamped.state === "S2" &&
    inputD.type === "SpeechSynthesisAction" &&
    inputD.status === "SUCCEEDED"
  ) {
    return {
      state: "S3",
      outputs: {
        RobotSpeechbubbleAction:
          "Professor Archie thinks a lot. He thinks of things to make.",
        HumanSpeechbubbleAction: ["Pause"],
        SpeechSynthesisAction:
          "Professor Archie thinks a lot. He thinks of things to make."
      }
    };
  } else if (
    stateStamped.state === "S3" &&
    inputD.type === "SpeechSynthesisAction" &&
    inputD.status === "SUCCEEDED"
  ) {
    return {
      state: "S4",
      outputs: {
        RobotSpeechbubbleAction:
          "He thinks as he brushes his teeth. He thinks at his desk. He even thinks in bed. Then, it clicks.",
        HumanSpeechbubbleAction: ["Pause"],
        SpeechSynthesisAction:
          "He thinks as he brushes his teeth. He thinks at his desk. He even thinks in bed. Then, it clicks."
      }
    };
  } else if (
    stateStamped.state === "S4" &&
    inputD.type === "SpeechSynthesisAction" &&
    inputD.status === "SUCCEEDED"
  ) {
    return {
      state: "S5",
      outputs: {
        RobotSpeechbubbleAction:
          "Archie makes bots that can help. The bots make toast for Archie.",
        HumanSpeechbubbleAction: ["Pause"],
        SpeechSynthesisAction:
          "Archie makes bots that can help. The bots make toast for Archie."
      }
    };
  } else if (
    stateStamped.state === "S5" &&
    inputD.type === "SpeechSynthesisAction" &&
    inputD.status === "SUCCEEDED"
  ) {
    return {
      state: "S6",
      outputs: {
        RobotSpeechbubbleAction:
          "Archie makes a pen that can do art by itself.",
        HumanSpeechbubbleAction: ["Pause"],
        SpeechSynthesisAction: "Archie makes a pen that can do art by itself."
      }
    };
  } else if (
    stateStamped.state === "S6" &&
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
    stateStamped.state === "S7" &&
    inputD.type === "SpeechSynthesisAction" &&
    inputD.status === "SUCCEEDED"
  ) {
    return {
      state: "S8",
      outputs: {
        RobotSpeechbubbleAction:
          "Archie makes it so that his bike can run his laptop.",
        HumanSpeechbubbleAction: ["Pause"],
        SpeechSynthesisAction:
          "Archie makes it so that his bike can run his laptop."
      }
    };
  } else if (
    stateStamped.state === "S8" &&
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
    stateStamped.state === "S9" &&
    inputD.type === "SpeechSynthesisAction" &&
    inputD.status === "SUCCEEDED"
  ) {
    return {
      state: "S10",
      outputs: {
        RobotSpeechbubbleAction:
          "Archie has a lot of plans. He never stops inventing.",
        HumanSpeechbubbleAction: ["Pause"],
        SpeechSynthesisAction:
          "Archie has a lot of plans. He never stops inventing."
      }
    };
  } else if (
    stateStamped.state === "S10" &&
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
    stateStamped.state === "S11" &&
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
    stateStamped.state === "S2" &&
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
    stateStamped.state === "S3" &&
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
    stateStamped.state === "S4" &&
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
    stateStamped.state === "S5" &&
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
    stateStamped.state === "S6" &&
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
    stateStamped.state === "S7" &&
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
    stateStamped.state === "S8" &&
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
    stateStamped.state === "S9" &&
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
    stateStamped.state === "S10" &&
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
    stateStamped.state === "S11" &&
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
    stateStamped.state === "SP2" &&
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
    stateStamped.state === "SP3" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Resume"
  ) {
    return {
      state: "S3",
      outputs: {
        RobotSpeechbubbleAction:
          "Professor Archie thinks a lot. He thinks of things to make.",
        HumanSpeechbubbleAction: ["Pause"],
        SpeechSynthesisAction:
          "Professor Archie thinks a lot. He thinks of things to make."
      }
    };
  } else if (
    stateStamped.state === "SP4" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Resume"
  ) {
    return {
      state: "S4",
      outputs: {
        RobotSpeechbubbleAction:
          "He thinks as he brushes his teeth. He thinks at his desk. He even thinks in bed. Then, it clicks.",
        HumanSpeechbubbleAction: ["Pause"],
        SpeechSynthesisAction:
          "He thinks as he brushes his teeth. He thinks at his desk. He even thinks in bed. Then, it clicks."
      }
    };
  } else if (
    stateStamped.state === "SP5" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Resume"
  ) {
    return {
      state: "S5",
      outputs: {
        RobotSpeechbubbleAction:
          "Archie makes bots that can help. The bots make toast for Archie.",
        HumanSpeechbubbleAction: ["Pause"],
        SpeechSynthesisAction:
          "Archie makes bots that can help. The bots make toast for Archie."
      }
    };
  } else if (
    stateStamped.state === "SP6" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Resume"
  ) {
    return {
      state: "S6",
      outputs: {
        RobotSpeechbubbleAction:
          "Archie makes a pen that can do art by itself.",
        HumanSpeechbubbleAction: ["Pause"],
        SpeechSynthesisAction: "Archie makes a pen that can do art by itself."
      }
    };
  } else if (
    stateStamped.state === "SP7" &&
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
    stateStamped.state === "SP8" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Resume"
  ) {
    return {
      state: "S8",
      outputs: {
        RobotSpeechbubbleAction:
          "Archie makes it so that his bike can run his laptop.",
        HumanSpeechbubbleAction: ["Pause"],
        SpeechSynthesisAction:
          "Archie makes it so that his bike can run his laptop."
      }
    };
  } else if (
    stateStamped.state === "SP9" &&
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
    stateStamped.state === "SP10" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Resume"
  ) {
    return {
      state: "S10",
      outputs: {
        RobotSpeechbubbleAction:
          "Archie has a lot of plans. He never stops inventing.",
        HumanSpeechbubbleAction: ["Pause"],
        SpeechSynthesisAction:
          "Archie has a lot of plans. He never stops inventing."
      }
    };
  } else if (
    stateStamped.state === "SP11" &&
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
  } else if (stateStamped.state === "S2" && inputD.type === "Features") {
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
        state: stateStamped.state,
        outputs: null
      };
    }
  } else if (stateStamped.state === "S3" && inputD.type === "Features") {
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
        state: stateStamped.state,
        outputs: null
      };
    }
  } else if (stateStamped.state === "S4" && inputD.type === "Features") {
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
        state: stateStamped.state,
        outputs: null
      };
    }
  } else if (stateStamped.state === "S5" && inputD.type === "Features") {
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
        state: stateStamped.state,
        outputs: null
      };
    }
  } else if (stateStamped.state === "S6" && inputD.type === "Features") {
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
        state: stateStamped.state,
        outputs: null
      };
    }
  } else if (stateStamped.state === "S7" && inputD.type === "Features") {
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
        state: stateStamped.state,
        outputs: null
      };
    }
  } else if (stateStamped.state === "S8" && inputD.type === "Features") {
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
        state: stateStamped.state,
        outputs: null
      };
    }
  } else if (stateStamped.state === "S9" && inputD.type === "Features") {
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
        state: stateStamped.state,
        outputs: null
      };
    }
  } else if (stateStamped.state === "S10" && inputD.type === "Features") {
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
        state: stateStamped.state,
        outputs: null
      };
    }
  } else if (stateStamped.state === "S11" && inputD.type === "Features") {
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
        state: stateStamped.state,
        outputs: null
      };
    }

    // Proactive Resume
  } else if (stateStamped.state === "SP2" && inputD.type === "Features") {
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
        state: stateStamped.state,
        outputs: null
      };
    }
  } else if (stateStamped.state === "SP3" && inputD.type === "Features") {
    if (
      inputC.face.isVisible &&
      (inputC.face.noseAngle < engagedMaxNoseAngle &&
        inputC.face.noseAngle > engagedMinNoseAngle)
    ) {
      return {
        state: "S3",
        outputs: {
          RobotSpeechbubbleAction:
            "Professor Archie thinks a lot. He thinks of things to make.",
          HumanSpeechbubbleAction: ["Pause"],
          SpeechSynthesisAction:
            "Professor Archie thinks a lot. He thinks of things to make."
        }
      };
    } else {
      return {
        state: stateStamped.state,
        outputs: null
      };
    }
  } else if (stateStamped.state === "SP4" && inputD.type === "Features") {
    if (
      inputC.face.isVisible &&
      (inputC.face.noseAngle < engagedMaxNoseAngle &&
        inputC.face.noseAngle > engagedMinNoseAngle)
    ) {
      return {
        state: "S4",
        outputs: {
          RobotSpeechbubbleAction:
            "He thinks as he brushes his teeth. He thinks at his desk. He even thinks in bed. Then, it clicks.",
          HumanSpeechbubbleAction: ["Pause"],
          SpeechSynthesisAction:
            "He thinks as he brushes his teeth. He thinks at his desk. He even thinks in bed. Then, it clicks."
        }
      };
    } else {
      return {
        state: stateStamped.state,
        outputs: null
      };
    }
  } else if (stateStamped.state === "SP5" && inputD.type === "Features") {
    if (
      inputC.face.isVisible &&
      (inputC.face.noseAngle < engagedMaxNoseAngle &&
        inputC.face.noseAngle > engagedMinNoseAngle)
    ) {
      return {
        state: "S5",
        outputs: {
          RobotSpeechbubbleAction:
            "Archie makes bots that can help. The bots make toast for Archie.",
          HumanSpeechbubbleAction: ["Pause"],
          SpeechSynthesisAction:
            "Archie makes bots that can help. The bots make toast for Archie."
        }
      };
    } else {
      return {
        state: stateStamped.state,
        outputs: null
      };
    }
  } else if (stateStamped.state === "SP6" && inputD.type === "Features") {
    if (
      inputC.face.isVisible &&
      (inputC.face.noseAngle < engagedMaxNoseAngle &&
        inputC.face.noseAngle > engagedMinNoseAngle)
    ) {
      return {
        state: "S6",
        outputs: {
          RobotSpeechbubbleAction:
            "Archie makes a pen that can do art by itself.",
          HumanSpeechbubbleAction: ["Pause"],
          SpeechSynthesisAction: "Archie makes a pen that can do art by itself."
        }
      };
    } else {
      return {
        state: stateStamped.state,
        outputs: null
      };
    }
  } else if (stateStamped.state === "SP7" && inputD.type === "Features") {
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
        state: stateStamped.state,
        outputs: null
      };
    }
  } else if (stateStamped.state === "SP8" && inputD.type === "Features") {
    if (
      inputC.face.isVisible &&
      (inputC.face.noseAngle < engagedMaxNoseAngle &&
        inputC.face.noseAngle > engagedMinNoseAngle)
    ) {
      return {
        state: "S8",
        outputs: {
          RobotSpeechbubbleAction:
            "Archie makes it so that his bike can run his laptop.",
          HumanSpeechbubbleAction: ["Pause"],
          SpeechSynthesisAction:
            "Archie makes it so that his bike can run his laptop."
        }
      };
    } else {
      return {
        state: stateStamped.state,
        outputs: null
      };
    }
  } else if (stateStamped.state === "SP9" && inputD.type === "Features") {
    if (
      inputC.face.isVisible &&
      (inputC.face.noseAngle < engagedMaxNoseAngle &&
        inputC.face.noseAngle > engagedMinNoseAngle)
    ) {
      return {
        state: "S9",
        outputs: {
          RobotSpeechbubbleAction:
            "Archie even makes it so that cars can sail.",
          HumanSpeechbubbleAction: ["Pause"],
          SpeechSynthesisAction: "Archie even makes it so that cars can sail."
        }
      };
    } else {
      return {
        state: stateStamped.state,
        outputs: null
      };
    }
  } else if (stateStamped.state === "SP10" && inputD.type === "Features") {
    if (
      inputC.face.isVisible &&
      (inputC.face.noseAngle < engagedMaxNoseAngle &&
        inputC.face.noseAngle > engagedMinNoseAngle)
    ) {
      return {
        state: "S10",
        outputs: {
          RobotSpeechbubbleAction:
            "Archie has a lot of plans. He never stops inventing.",
          HumanSpeechbubbleAction: ["Pause"],
          SpeechSynthesisAction:
            "Archie has a lot of plans. He never stops inventing."
        }
      };
    } else {
      return {
        state: stateStamped.state,
        outputs: null
      };
    }
  } else if (stateStamped.state === "SP11" && inputD.type === "Features") {
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
        state: stateStamped.state,
        outputs: null
      };
    }
  } else {
    return {
      state: stateStamped.state,
      outputs: null
    };
  }
}

var defaultParams = {
  engagedMinNoseAngle: -0.001,
  engagedMaxNoseAngle: 0.001,
  disengagedMinNoseAngle: -90,
  disengagedMaxNoseAngle: 90,
  disengagedTimeoutIntervalMs: 10000
};

module.exports = {
  transition: transition,
  defaultParams: defaultParams
};
