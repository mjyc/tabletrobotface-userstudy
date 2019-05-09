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
        RobotSpeechbubbleAction: "RANGER FORESTER",
        HumanSpeechbubbleAction: ["Pause"],
        SpeechSynthesisAction: "RANGER FORESTER"
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
        RobotSpeechbubbleAction: "Ranger Forester will check on the animals.",
        HumanSpeechbubbleAction: ["Pause"],
        SpeechSynthesisAction: "Ranger Forester will check on the animals."
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
        RobotSpeechbubbleAction:
          "Forester sees insects. This sort of bee cannot sting.",
        HumanSpeechbubbleAction: ["Pause"],
        SpeechSynthesisAction:
          "Forester sees insects. This sort of bee cannot sting."
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
        RobotSpeechbubbleAction: "Tweet! Forester can see soft fluff.",
        HumanSpeechbubbleAction: ["Pause"],
        SpeechSynthesisAction: "Tweet! Forester can see soft fluff."
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
        RobotSpeechbubbleAction:
          "Hiss! A snake is looking for a rock to sit on in the sun.",
        HumanSpeechbubbleAction: ["Pause"],
        SpeechSynthesisAction:
          "Hiss! A snake is looking for a rock to sit on in the sun."
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
        RobotSpeechbubbleAction:
          "The spiders need to fix the web to get insects.",
        HumanSpeechbubbleAction: ["Pause"],
        SpeechSynthesisAction: "The spiders need to fix the web to get insects."
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
        RobotSpeechbubbleAction:
          "Here is the kangaroo family. Forester cannot see the little kangaroo.",
        HumanSpeechbubbleAction: ["Pause"],
        SpeechSynthesisAction:
          "Here is the kangaroo family. Forester cannot see the little kangaroo."
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
        RobotSpeechbubbleAction:
          "The little kangaroo got stuck in a trap. Forester helps. The little roo is happy. Back to its family. Thanks Forester.",
        HumanSpeechbubbleAction: ["Pause"],
        SpeechSynthesisAction:
          "The little kangaroo got stuck in a trap. Forester helps. The little roo is happy. Back to its family. Thanks Forester."
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
        RobotSpeechbubbleAction:
          "Forester keeps the trap. He is very upset. He will tell the cops.",
        HumanSpeechbubbleAction: ["Pause"],
        SpeechSynthesisAction:
          "Forester keeps the trap. He is very upset. He will tell the cops."
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
        RobotSpeechbubbleAction:
          "The cops get the man that set the trap. The animals are safe.",
        HumanSpeechbubbleAction: ["Pause"],
        SpeechSynthesisAction:
          "The cops get the man that set the trap. The animals are safe."
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
        RobotSpeechbubbleAction: "RANGER FORESTER",
        HumanSpeechbubbleAction: ["Pause"],
        SpeechSynthesisAction: "RANGER FORESTER"
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
        RobotSpeechbubbleAction: "Ranger Forester will check on the animals.",
        HumanSpeechbubbleAction: ["Pause"],
        SpeechSynthesisAction: "Ranger Forester will check on the animals."
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
        RobotSpeechbubbleAction:
          "Forester sees insects. This sort of bee cannot sting.",
        HumanSpeechbubbleAction: ["Pause"],
        SpeechSynthesisAction:
          "Forester sees insects. This sort of bee cannot sting."
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
        RobotSpeechbubbleAction: "Tweet! Forester can see soft fluff.",
        HumanSpeechbubbleAction: ["Pause"],
        SpeechSynthesisAction: "Tweet! Forester can see soft fluff."
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
        RobotSpeechbubbleAction:
          "Hiss! A snake is looking for a rock to sit on in the sun.",
        HumanSpeechbubbleAction: ["Pause"],
        SpeechSynthesisAction:
          "Hiss! A snake is looking for a rock to sit on in the sun."
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
        RobotSpeechbubbleAction:
          "The spiders need to fix the web to get insects.",
        HumanSpeechbubbleAction: ["Pause"],
        SpeechSynthesisAction: "The spiders need to fix the web to get insects."
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
        RobotSpeechbubbleAction:
          "Here is the kangaroo family. Forester cannot see the little kangaroo.",
        HumanSpeechbubbleAction: ["Pause"],
        SpeechSynthesisAction:
          "Here is the kangaroo family. Forester cannot see the little kangaroo."
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
        RobotSpeechbubbleAction:
          "The little kangaroo got stuck in a trap. Forester helps. The little roo is happy. Back to its family. Thanks Forester.",
        HumanSpeechbubbleAction: ["Pause"],
        SpeechSynthesisAction:
          "The little kangaroo got stuck in a trap. Forester helps. The little roo is happy. Back to its family. Thanks Forester."
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
        RobotSpeechbubbleAction:
          "Forester keeps the trap. He is very upset. He will tell the cops.",
        HumanSpeechbubbleAction: ["Pause"],
        SpeechSynthesisAction:
          "Forester keeps the trap. He is very upset. He will tell the cops."
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
        RobotSpeechbubbleAction:
          "The cops get the man that set the trap. The animals are safe.",
        HumanSpeechbubbleAction: ["Pause"],
        SpeechSynthesisAction:
          "The cops get the man that set the trap. The animals are safe."
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
          RobotSpeechbubbleAction: "RANGER FORESTER",
          HumanSpeechbubbleAction: ["Pause"],
          SpeechSynthesisAction: "RANGER FORESTER"
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
          RobotSpeechbubbleAction: "Ranger Forester will check on the animals.",
          HumanSpeechbubbleAction: ["Pause"],
          SpeechSynthesisAction: "Ranger Forester will check on the animals."
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
          RobotSpeechbubbleAction:
            "Forester sees insects. This sort of bee cannot sting.",
          HumanSpeechbubbleAction: ["Pause"],
          SpeechSynthesisAction:
            "Forester sees insects. This sort of bee cannot sting."
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
          RobotSpeechbubbleAction: "Tweet! Forester can see soft fluff.",
          HumanSpeechbubbleAction: ["Pause"],
          SpeechSynthesisAction: "Tweet! Forester can see soft fluff."
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
          RobotSpeechbubbleAction:
            "Hiss! A snake is looking for a rock to sit on in the sun.",
          HumanSpeechbubbleAction: ["Pause"],
          SpeechSynthesisAction:
            "Hiss! A snake is looking for a rock to sit on in the sun."
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
          RobotSpeechbubbleAction:
            "The spiders need to fix the web to get insects.",
          HumanSpeechbubbleAction: ["Pause"],
          SpeechSynthesisAction:
            "The spiders need to fix the web to get insects."
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
          RobotSpeechbubbleAction:
            "Here is the kangaroo family. Forester cannot see the little kangaroo.",
          HumanSpeechbubbleAction: ["Pause"],
          SpeechSynthesisAction:
            "Here is the kangaroo family. Forester cannot see the little kangaroo."
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
          RobotSpeechbubbleAction:
            "The little kangaroo got stuck in a trap. Forester helps. The little roo is happy. Back to its family. Thanks Forester.",
          HumanSpeechbubbleAction: ["Pause"],
          SpeechSynthesisAction:
            "The little kangaroo got stuck in a trap. Forester helps. The little roo is happy. Back to its family. Thanks Forester."
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
          RobotSpeechbubbleAction:
            "Forester keeps the trap. He is very upset. He will tell the cops.",
          HumanSpeechbubbleAction: ["Pause"],
          SpeechSynthesisAction:
            "Forester keeps the trap. He is very upset. He will tell the cops."
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
          RobotSpeechbubbleAction:
            "The cops get the man that set the trap. The animals are safe.",
          HumanSpeechbubbleAction: ["Pause"],
          SpeechSynthesisAction:
            "The cops get the man that set the trap. The animals are safe."
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
