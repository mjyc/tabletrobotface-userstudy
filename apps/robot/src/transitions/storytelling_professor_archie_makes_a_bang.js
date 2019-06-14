// NOTE: might be called twice if transition and emission fncs are called separately
function transition(stateStamped, inputD, inputC, params) {
  var engagedMinNoseAngle = params.engagedMinNoseAngle;
  var engagedMaxNoseAngle = params.engagedMaxNoseAngle;
  var disengagedMinNoseAngle = params.disengagedMinNoseAngle;
  var disengagedMaxNoseAngle = params.disengagedMaxNoseAngle;
  var disengagedMaxMaxNoseAngle1Sec = params.disengagedMaxMaxNoseAngle1Sec;
  var disengagedTimeoutIntervalCs = params.disengagedTimeoutIntervalCs;

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
        RobotSpeechbubbleAction: {
          type: "IMAGE",
          value: "/public/img/professor_archie_makes_a_bang-1.png"
        },
        HumanSpeechbubbleAction: ["Pause", "Next"],
        SpeechSynthesisAction: {
          goal_id: {
            id: "PROFESSOR ARCHIE MAKES A BANG by Bel Richardson",
            stamp: Date.now()
          },
          goal: {
            text: "PROFESSOR ARCHIE MAKES A BANG by Bel Richardson",
            rate: 0.8,
            afterpauseduration: 3000
          }
        }
      }
    };
  } else if (stateStamped.state === "S2" && inputD.type === "Features") {
    if (
      // Proactive Next
      disengagedMaxMaxNoseAngle1Sec >= 0 && // use disengagedMaxMaxNoseAngle1Sec < 0 to disable proactive next
      inputC.history.speechSynthesisActionResultStamped[0].goal_id.id ===
        "PROFESSOR ARCHIE MAKES A BANG by Bel Richardson" &&
      inputC.face.isVisible &&
      inputC.face.noseAngle < disengagedMaxNoseAngle &&
      inputC.face.noseAngle > disengagedMinNoseAngle &&
      inputC.temporal.maxNoseAngle1Sec < disengagedMaxMaxNoseAngle1Sec
    ) {
      return {
        state: "S3",
        outputs: {
          RobotSpeechbubbleAction: {
            type: "IMAGE",
            value: "/public/img/professor_archie_makes_a_bang-2.png"
          },
          HumanSpeechbubbleAction: ["Pause", "Next"],
          SpeechSynthesisAction: {
            goal_id: {
              id: "Professor Archie thinks a lot. He thinks of things to make.",
              stamp: Date.now()
            },
            goal: {
              text:
                "Professor Archie thinks a lot. He thinks of things to make.",
              rate: 0.8,
              afterpauseduration: 3000
            }
          }
        }
      };
    } else if (
      // Proactive Pause
      disengagedTimeoutIntervalCs >= 0 && // use disengagedTimeoutIntervalCs < 0 to disable proactive pause
      inputC.history.humanSpeechbubbleActionResultStamped[0].result !=
        "Resume" && // don't override human
      !inputC.history.isVisibleStamped[0].isVisible && // not visible
      inputC.face.stamp - inputC.history.isVisibleStamped[0].stamp >
        disengagedTimeoutIntervalCs * 10
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
  } else if (stateStamped.state === "S3" && inputD.type === "Features") {
    if (
      // Proactive Next
      disengagedMaxMaxNoseAngle1Sec >= 0 && // use disengagedMaxMaxNoseAngle1Sec < 0 to disable proactive next
      inputC.history.speechSynthesisActionResultStamped[0].goal_id.id ===
        "Professor Archie thinks a lot. He thinks of things to make." &&
      inputC.face.isVisible &&
      inputC.face.noseAngle < disengagedMaxNoseAngle &&
      inputC.face.noseAngle > disengagedMinNoseAngle &&
      inputC.temporal.maxNoseAngle1Sec < disengagedMaxMaxNoseAngle1Sec
    ) {
      return {
        state: "S4",
        outputs: {
          RobotSpeechbubbleAction: {
            type: "IMAGE",
            value: "/public/img/professor_archie_makes_a_bang-3.png"
          },
          HumanSpeechbubbleAction: ["Pause", "Next"],
          SpeechSynthesisAction: {
            goal_id: {
              id: "He thinks as he brushes his teeth. He thinks at his desk.",
              stamp: Date.now()
            },
            goal: {
              text: "He thinks as he brushes his teeth. He thinks at his desk.",
              rate: 0.8,
              afterpauseduration: 3000
            }
          }
        }
      };
    } else if (
      // Proactive Pause
      disengagedTimeoutIntervalCs >= 0 && // use disengagedTimeoutIntervalCs < 0 to disable proactive pause
      inputC.history.humanSpeechbubbleActionResultStamped[0].result !=
        "Resume" && // don't override human
      !inputC.history.isVisibleStamped[0].isVisible && // not visible
      inputC.face.stamp - inputC.history.isVisibleStamped[0].stamp >
        disengagedTimeoutIntervalCs * 10
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
  } else if (stateStamped.state === "S4" && inputD.type === "Features") {
    if (
      // Proactive Next
      disengagedMaxMaxNoseAngle1Sec >= 0 && // use disengagedMaxMaxNoseAngle1Sec < 0 to disable proactive next
      inputC.history.speechSynthesisActionResultStamped[0].goal_id.id ===
        "He thinks as he brushes his teeth. He thinks at his desk." &&
      inputC.face.isVisible &&
      inputC.face.noseAngle < disengagedMaxNoseAngle &&
      inputC.face.noseAngle > disengagedMinNoseAngle &&
      inputC.temporal.maxNoseAngle1Sec < disengagedMaxMaxNoseAngle1Sec
    ) {
      return {
        state: "S5",
        outputs: {
          RobotSpeechbubbleAction: {
            type: "IMAGE",
            value: "/public/img/professor_archie_makes_a_bang-4.png"
          },
          HumanSpeechbubbleAction: ["Pause", "Next"],
          SpeechSynthesisAction: {
            goal_id: {
              id: "He even thinks in bed. Then, it clicks.",
              stamp: Date.now()
            },
            goal: {
              text: "He even thinks in bed. Then, it clicks.",
              rate: 0.8,
              afterpauseduration: 3000
            }
          }
        }
      };
    } else if (
      // Proactive Pause
      disengagedTimeoutIntervalCs >= 0 && // use disengagedTimeoutIntervalCs < 0 to disable proactive pause
      inputC.history.humanSpeechbubbleActionResultStamped[0].result !=
        "Resume" && // don't override human
      !inputC.history.isVisibleStamped[0].isVisible && // not visible
      inputC.face.stamp - inputC.history.isVisibleStamped[0].stamp >
        disengagedTimeoutIntervalCs * 10
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
  } else if (stateStamped.state === "S5" && inputD.type === "Features") {
    if (
      // Proactive Next
      disengagedMaxMaxNoseAngle1Sec >= 0 && // use disengagedMaxMaxNoseAngle1Sec < 0 to disable proactive next
      inputC.history.speechSynthesisActionResultStamped[0].goal_id.id ===
        "He even thinks in bed. Then, it clicks." &&
      inputC.face.isVisible &&
      inputC.face.noseAngle < disengagedMaxNoseAngle &&
      inputC.face.noseAngle > disengagedMinNoseAngle &&
      inputC.temporal.maxNoseAngle1Sec < disengagedMaxMaxNoseAngle1Sec
    ) {
      return {
        state: "S6",
        outputs: {
          RobotSpeechbubbleAction: {
            type: "IMAGE",
            value: "/public/img/professor_archie_makes_a_bang-5.png"
          },
          HumanSpeechbubbleAction: ["Pause", "Next"],
          SpeechSynthesisAction: {
            goal_id: {
              id:
                "Archie makes bots that can help. The bots make toast for Archie.",
              stamp: Date.now()
            },
            goal: {
              text:
                "Archie makes bots that can help. The bots make toast for Archie.",
              rate: 0.8,
              afterpauseduration: 3000
            }
          }
        }
      };
    } else if (
      // Proactive Pause
      disengagedTimeoutIntervalCs >= 0 && // use disengagedTimeoutIntervalCs < 0 to disable proactive pause
      inputC.history.humanSpeechbubbleActionResultStamped[0].result !=
        "Resume" && // don't override human
      !inputC.history.isVisibleStamped[0].isVisible && // not visible
      inputC.face.stamp - inputC.history.isVisibleStamped[0].stamp >
        disengagedTimeoutIntervalCs * 10
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
  } else if (stateStamped.state === "S6" && inputD.type === "Features") {
    if (
      // Proactive Next
      disengagedMaxMaxNoseAngle1Sec >= 0 && // use disengagedMaxMaxNoseAngle1Sec < 0 to disable proactive next
      inputC.history.speechSynthesisActionResultStamped[0].goal_id.id ===
        "Archie makes bots that can help. The bots make toast for Archie." &&
      inputC.face.isVisible &&
      inputC.face.noseAngle < disengagedMaxNoseAngle &&
      inputC.face.noseAngle > disengagedMinNoseAngle &&
      inputC.temporal.maxNoseAngle1Sec < disengagedMaxMaxNoseAngle1Sec
    ) {
      return {
        state: "S7",
        outputs: {
          RobotSpeechbubbleAction: {
            type: "IMAGE",
            value: "/public/img/professor_archie_makes_a_bang-6.png"
          },
          HumanSpeechbubbleAction: ["Pause", "Next"],
          SpeechSynthesisAction: {
            goal_id: {
              id:
                "Archie makes a pen that can do art by itself. What do you think of it?",
              stamp: Date.now()
            },
            goal: {
              text:
                "Archie makes a pen that can do art by itself. What do you think of it?",
              rate: 0.8,
              afterpauseduration: 3000
            }
          }
        }
      };
    } else if (
      // Proactive Pause
      disengagedTimeoutIntervalCs >= 0 && // use disengagedTimeoutIntervalCs < 0 to disable proactive pause
      inputC.history.humanSpeechbubbleActionResultStamped[0].result !=
        "Resume" && // don't override human
      !inputC.history.isVisibleStamped[0].isVisible && // not visible
      inputC.face.stamp - inputC.history.isVisibleStamped[0].stamp >
        disengagedTimeoutIntervalCs * 10
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
  } else if (stateStamped.state === "S7" && inputD.type === "Features") {
    if (
      // Proactive Next
      disengagedMaxMaxNoseAngle1Sec >= 0 && // use disengagedMaxMaxNoseAngle1Sec < 0 to disable proactive next
      inputC.history.speechSynthesisActionResultStamped[0].goal_id.id ===
        "Archie makes a pen that can do art by itself. What do you think of it?" &&
      inputC.face.isVisible &&
      inputC.face.noseAngle < disengagedMaxNoseAngle &&
      inputC.face.noseAngle > disengagedMinNoseAngle &&
      inputC.temporal.maxNoseAngle1Sec < disengagedMaxMaxNoseAngle1Sec
    ) {
      return {
        state: "S8",
        outputs: {
          RobotSpeechbubbleAction: {
            type: "IMAGE",
            value: "/public/img/professor_archie_makes_a_bang-7.png"
          },
          HumanSpeechbubbleAction: ["Pause", "Next"],
          SpeechSynthesisAction: {
            goal_id: {
              id: "Archie makes it so that his bike can run his laptop.",
              stamp: Date.now()
            },
            goal: {
              text: "Archie makes it so that his bike can run his laptop.",
              rate: 0.8,
              afterpauseduration: 3000
            }
          }
        }
      };
    } else if (
      // Proactive Pause
      disengagedTimeoutIntervalCs >= 0 && // use disengagedTimeoutIntervalCs < 0 to disable proactive pause
      inputC.history.humanSpeechbubbleActionResultStamped[0].result !=
        "Resume" && // don't override human
      !inputC.history.isVisibleStamped[0].isVisible && // not visible
      inputC.face.stamp - inputC.history.isVisibleStamped[0].stamp >
        disengagedTimeoutIntervalCs * 10
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
  } else if (stateStamped.state === "S8" && inputD.type === "Features") {
    if (
      // Proactive Next
      disengagedMaxMaxNoseAngle1Sec >= 0 && // use disengagedMaxMaxNoseAngle1Sec < 0 to disable proactive next
      inputC.history.speechSynthesisActionResultStamped[0].goal_id.id ===
        "Archie makes it so that his bike can run his laptop." &&
      inputC.face.isVisible &&
      inputC.face.noseAngle < disengagedMaxNoseAngle &&
      inputC.face.noseAngle > disengagedMinNoseAngle &&
      inputC.temporal.maxNoseAngle1Sec < disengagedMaxMaxNoseAngle1Sec
    ) {
      return {
        state: "S9",
        outputs: {
          RobotSpeechbubbleAction: {
            type: "IMAGE",
            value: "/public/img/professor_archie_makes_a_bang-8.png"
          },
          HumanSpeechbubbleAction: ["Pause", "Next"],
          SpeechSynthesisAction: {
            goal_id: {
              id: "Archie even makes it so that cars can sail.",
              stamp: Date.now()
            },
            goal: {
              text: "Archie even makes it so that cars can sail.",
              rate: 0.8,
              afterpauseduration: 3000
            }
          }
        }
      };
    } else if (
      // Proactive Pause
      disengagedTimeoutIntervalCs >= 0 && // use disengagedTimeoutIntervalCs < 0 to disable proactive pause
      inputC.history.humanSpeechbubbleActionResultStamped[0].result !=
        "Resume" && // don't override human
      !inputC.history.isVisibleStamped[0].isVisible && // not visible
      inputC.face.stamp - inputC.history.isVisibleStamped[0].stamp >
        disengagedTimeoutIntervalCs * 10
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
  } else if (stateStamped.state === "S9" && inputD.type === "Features") {
    if (
      // Proactive Next
      disengagedMaxMaxNoseAngle1Sec >= 0 && // use disengagedMaxMaxNoseAngle1Sec < 0 to disable proactive next
      inputC.history.speechSynthesisActionResultStamped[0].goal_id.id ===
        "Archie even makes it so that cars can sail." &&
      inputC.face.isVisible &&
      inputC.face.noseAngle < disengagedMaxNoseAngle &&
      inputC.face.noseAngle > disengagedMinNoseAngle &&
      inputC.temporal.maxNoseAngle1Sec < disengagedMaxMaxNoseAngle1Sec
    ) {
      return {
        state: "S10",
        outputs: {
          RobotSpeechbubbleAction: {
            type: "IMAGE",
            value: "/public/img/professor_archie_makes_a_bang-9.png"
          },
          HumanSpeechbubbleAction: ["Pause", "Next"],
          SpeechSynthesisAction: {
            goal_id: {
              id: "Archie has a lot of plans. He never stops inventing.",
              stamp: Date.now()
            },
            goal: {
              text: "Archie has a lot of plans. He never stops inventing.",
              rate: 0.8,
              afterpauseduration: 3000
            }
          }
        }
      };
    } else if (
      // Proactive Pause
      disengagedTimeoutIntervalCs >= 0 && // use disengagedTimeoutIntervalCs < 0 to disable proactive pause
      inputC.history.humanSpeechbubbleActionResultStamped[0].result !=
        "Resume" && // don't override human
      !inputC.history.isVisibleStamped[0].isVisible && // not visible
      inputC.face.stamp - inputC.history.isVisibleStamped[0].stamp >
        disengagedTimeoutIntervalCs * 10
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
  } else if (stateStamped.state === "S10" && inputD.type === "Features") {
    if (
      // Proactive Next
      disengagedMaxMaxNoseAngle1Sec >= 0 && // use disengagedMaxMaxNoseAngle1Sec < 0 to disable proactive next
      inputC.history.speechSynthesisActionResultStamped[0].goal_id.id ===
        "Archie has a lot of plans. He never stops inventing." &&
      inputC.face.isVisible &&
      inputC.face.noseAngle < disengagedMaxNoseAngle &&
      inputC.face.noseAngle > disengagedMinNoseAngle &&
      inputC.temporal.maxNoseAngle1Sec < disengagedMaxMaxNoseAngle1Sec
    ) {
      return {
        state: "S11",
        outputs: {
          RobotSpeechbubbleAction: {
            type: "IMAGE",
            value: "/public/img/professor_archie_makes_a_bang-10.png"
          },
          HumanSpeechbubbleAction: ["Pause", "Next"],
          SpeechSynthesisAction: {
            goal_id: {
              id: "What would you make if you were Archie?",
              stamp: Date.now()
            },
            goal: {
              text: "What would you make if you were Archie?",
              rate: 0.8,
              afterpauseduration: 3000
            }
          }
        }
      };
    } else if (
      // Proactive Pause
      disengagedTimeoutIntervalCs >= 0 && // use disengagedTimeoutIntervalCs < 0 to disable proactive pause
      inputC.history.humanSpeechbubbleActionResultStamped[0].result !=
        "Resume" && // don't override human
      !inputC.history.isVisibleStamped[0].isVisible && // not visible
      inputC.face.stamp - inputC.history.isVisibleStamped[0].stamp >
        disengagedTimeoutIntervalCs * 10
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
        SpeechSynthesisAction: {
          goal_id: {
            id: "The END",
            stamp: Date.now()
          },
          goal: {
            text: "The END",
            rate: 0.8,
            afterpauseduration: 3000
          }
        }
      }
    };

    // Handle Next
  } else if (
    stateStamped.state === "S1" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Next"
  ) {
    return {
      state: "S2",
      outputs: {
        RobotSpeechbubbleAction: {
          type: "IMAGE",
          value: "/public/img/professor_archie_makes_a_bang-1.png"
        },
        HumanSpeechbubbleAction: ["Pause", "Next"],
        SpeechSynthesisAction: {
          goal_id: {
            id: "PROFESSOR ARCHIE MAKES A BANG by Bel Richardson",
            stamp: Date.now()
          },
          goal: {
            text: "PROFESSOR ARCHIE MAKES A BANG by Bel Richardson",
            rate: 0.8,
            afterpauseduration: 3000
          }
        }
      }
    };
  } else if (
    stateStamped.state === "S2" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Next"
  ) {
    return {
      state: "S3",
      outputs: {
        RobotSpeechbubbleAction: {
          type: "IMAGE",
          value: "/public/img/professor_archie_makes_a_bang-2.png"
        },
        HumanSpeechbubbleAction: ["Pause", "Next"],
        SpeechSynthesisAction: {
          goal_id: {
            id: "Professor Archie thinks a lot. He thinks of things to make.",
            stamp: Date.now()
          },
          goal: {
            text: "Professor Archie thinks a lot. He thinks of things to make.",
            rate: 0.8,
            afterpauseduration: 3000
          }
        }
      }
    };
  } else if (
    stateStamped.state === "S3" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Next"
  ) {
    return {
      state: "S4",
      outputs: {
        RobotSpeechbubbleAction: {
          type: "IMAGE",
          value: "/public/img/professor_archie_makes_a_bang-3.png"
        },
        HumanSpeechbubbleAction: ["Pause", "Next"],
        SpeechSynthesisAction: {
          goal_id: {
            id: "He thinks as he brushes his teeth. He thinks at his desk.",
            stamp: Date.now()
          },
          goal: {
            text: "He thinks as he brushes his teeth. He thinks at his desk.",
            rate: 0.8,
            afterpauseduration: 3000
          }
        }
      }
    };
  } else if (
    stateStamped.state === "S4" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Next"
  ) {
    return {
      state: "S5",
      outputs: {
        RobotSpeechbubbleAction: {
          type: "IMAGE",
          value: "/public/img/professor_archie_makes_a_bang-4.png"
        },
        HumanSpeechbubbleAction: ["Pause", "Next"],
        SpeechSynthesisAction: {
          goal_id: {
            id: "He even thinks in bed. Then, it clicks.",
            stamp: Date.now()
          },
          goal: {
            text: "He even thinks in bed. Then, it clicks.",
            rate: 0.8,
            afterpauseduration: 3000
          }
        }
      }
    };
  } else if (
    stateStamped.state === "S5" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Next"
  ) {
    return {
      state: "S6",
      outputs: {
        RobotSpeechbubbleAction: {
          type: "IMAGE",
          value: "/public/img/professor_archie_makes_a_bang-5.png"
        },
        HumanSpeechbubbleAction: ["Pause", "Next"],
        SpeechSynthesisAction: {
          goal_id: {
            id:
              "Archie makes bots that can help. The bots make toast for Archie.",
            stamp: Date.now()
          },
          goal: {
            text:
              "Archie makes bots that can help. The bots make toast for Archie.",
            rate: 0.8,
            afterpauseduration: 3000
          }
        }
      }
    };
  } else if (
    stateStamped.state === "S6" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Next"
  ) {
    return {
      state: "S7",
      outputs: {
        RobotSpeechbubbleAction: {
          type: "IMAGE",
          value: "/public/img/professor_archie_makes_a_bang-6.png"
        },
        HumanSpeechbubbleAction: ["Pause", "Next"],
        SpeechSynthesisAction: {
          goal_id: {
            id:
              "Archie makes a pen that can do art by itself. What do you think of it?",
            stamp: Date.now()
          },
          goal: {
            text:
              "Archie makes a pen that can do art by itself. What do you think of it?",
            rate: 0.8,
            afterpauseduration: 3000
          }
        }
      }
    };
  } else if (
    stateStamped.state === "S7" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Next"
  ) {
    return {
      state: "S8",
      outputs: {
        RobotSpeechbubbleAction: {
          type: "IMAGE",
          value: "/public/img/professor_archie_makes_a_bang-7.png"
        },
        HumanSpeechbubbleAction: ["Pause", "Next"],
        SpeechSynthesisAction: {
          goal_id: {
            id: "Archie makes it so that his bike can run his laptop.",
            stamp: Date.now()
          },
          goal: {
            text: "Archie makes it so that his bike can run his laptop.",
            rate: 0.8,
            afterpauseduration: 3000
          }
        }
      }
    };
  } else if (
    stateStamped.state === "S8" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Next"
  ) {
    return {
      state: "S9",
      outputs: {
        RobotSpeechbubbleAction: {
          type: "IMAGE",
          value: "/public/img/professor_archie_makes_a_bang-8.png"
        },
        HumanSpeechbubbleAction: ["Pause", "Next"],
        SpeechSynthesisAction: {
          goal_id: {
            id: "Archie even makes it so that cars can sail.",
            stamp: Date.now()
          },
          goal: {
            text: "Archie even makes it so that cars can sail.",
            rate: 0.8,
            afterpauseduration: 3000
          }
        }
      }
    };
  } else if (
    stateStamped.state === "S9" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Next"
  ) {
    return {
      state: "S10",
      outputs: {
        RobotSpeechbubbleAction: {
          type: "IMAGE",
          value: "/public/img/professor_archie_makes_a_bang-9.png"
        },
        HumanSpeechbubbleAction: ["Pause", "Next"],
        SpeechSynthesisAction: {
          goal_id: {
            id: "Archie has a lot of plans. He never stops inventing.",
            stamp: Date.now()
          },
          goal: {
            text: "Archie has a lot of plans. He never stops inventing.",
            rate: 0.8,
            afterpauseduration: 3000
          }
        }
      }
    };
  } else if (
    stateStamped.state === "S10" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Next"
  ) {
    return {
      state: "S11",
      outputs: {
        RobotSpeechbubbleAction: {
          type: "IMAGE",
          value: "/public/img/professor_archie_makes_a_bang-10.png"
        },
        HumanSpeechbubbleAction: ["Pause", "Next"],
        SpeechSynthesisAction: {
          goal_id: {
            id: "What would you make if you were Archie?",
            stamp: Date.now()
          },
          goal: {
            text: "What would you make if you were Archie?",
            rate: 0.8,
            afterpauseduration: 3000
          }
        }
      }
    };
  } else if (
    stateStamped.state === "S11" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Next"
  ) {
    return {
      state: "S12",
      outputs: {
        RobotSpeechbubbleAction: "The END",
        HumanSpeechbubbleAction: "",
        SpeechSynthesisAction: {
          goal_id: {
            id: "The END",
            stamp: Date.now()
          },
          goal: {
            text: "The END",
            rate: 0.8,
            afterpauseduration: 3000
          }
        }
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
        RobotSpeechbubbleAction: {
          type: "IMAGE",
          value: "/public/img/professor_archie_makes_a_bang-1.png"
        },
        HumanSpeechbubbleAction: ["Pause", "Next"],
        SpeechSynthesisAction: {
          goal_id: {
            id: "PROFESSOR ARCHIE MAKES A BANG by Bel Richardson",
            stamp: Date.now()
          },
          goal: {
            text: "PROFESSOR ARCHIE MAKES A BANG by Bel Richardson",
            rate: 0.8,
            afterpauseduration: 3000
          }
        }
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
        RobotSpeechbubbleAction: {
          type: "IMAGE",
          value: "/public/img/professor_archie_makes_a_bang-2.png"
        },
        HumanSpeechbubbleAction: ["Pause", "Next"],
        SpeechSynthesisAction: {
          goal_id: {
            id: "Professor Archie thinks a lot. He thinks of things to make.",
            stamp: Date.now()
          },
          goal: {
            text: "Professor Archie thinks a lot. He thinks of things to make.",
            rate: 0.8,
            afterpauseduration: 3000
          }
        }
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
        RobotSpeechbubbleAction: {
          type: "IMAGE",
          value: "/public/img/professor_archie_makes_a_bang-3.png"
        },
        HumanSpeechbubbleAction: ["Pause", "Next"],
        SpeechSynthesisAction: {
          goal_id: {
            id: "He thinks as he brushes his teeth. He thinks at his desk.",
            stamp: Date.now()
          },
          goal: {
            text: "He thinks as he brushes his teeth. He thinks at his desk.",
            rate: 0.8,
            afterpauseduration: 3000
          }
        }
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
        RobotSpeechbubbleAction: {
          type: "IMAGE",
          value: "/public/img/professor_archie_makes_a_bang-4.png"
        },
        HumanSpeechbubbleAction: ["Pause", "Next"],
        SpeechSynthesisAction: {
          goal_id: {
            id: "He even thinks in bed. Then, it clicks.",
            stamp: Date.now()
          },
          goal: {
            text: "He even thinks in bed. Then, it clicks.",
            rate: 0.8,
            afterpauseduration: 3000
          }
        }
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
        RobotSpeechbubbleAction: {
          type: "IMAGE",
          value: "/public/img/professor_archie_makes_a_bang-5.png"
        },
        HumanSpeechbubbleAction: ["Pause", "Next"],
        SpeechSynthesisAction: {
          goal_id: {
            id:
              "Archie makes bots that can help. The bots make toast for Archie.",
            stamp: Date.now()
          },
          goal: {
            text:
              "Archie makes bots that can help. The bots make toast for Archie.",
            rate: 0.8,
            afterpauseduration: 3000
          }
        }
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
        RobotSpeechbubbleAction: {
          type: "IMAGE",
          value: "/public/img/professor_archie_makes_a_bang-6.png"
        },
        HumanSpeechbubbleAction: ["Pause", "Next"],
        SpeechSynthesisAction: {
          goal_id: {
            id:
              "Archie makes a pen that can do art by itself. What do you think of it?",
            stamp: Date.now()
          },
          goal: {
            text:
              "Archie makes a pen that can do art by itself. What do you think of it?",
            rate: 0.8,
            afterpauseduration: 3000
          }
        }
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
        RobotSpeechbubbleAction: {
          type: "IMAGE",
          value: "/public/img/professor_archie_makes_a_bang-7.png"
        },
        HumanSpeechbubbleAction: ["Pause", "Next"],
        SpeechSynthesisAction: {
          goal_id: {
            id: "Archie makes it so that his bike can run his laptop.",
            stamp: Date.now()
          },
          goal: {
            text: "Archie makes it so that his bike can run his laptop.",
            rate: 0.8,
            afterpauseduration: 3000
          }
        }
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
        RobotSpeechbubbleAction: {
          type: "IMAGE",
          value: "/public/img/professor_archie_makes_a_bang-8.png"
        },
        HumanSpeechbubbleAction: ["Pause", "Next"],
        SpeechSynthesisAction: {
          goal_id: {
            id: "Archie even makes it so that cars can sail.",
            stamp: Date.now()
          },
          goal: {
            text: "Archie even makes it so that cars can sail.",
            rate: 0.8,
            afterpauseduration: 3000
          }
        }
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
        RobotSpeechbubbleAction: {
          type: "IMAGE",
          value: "/public/img/professor_archie_makes_a_bang-9.png"
        },
        HumanSpeechbubbleAction: ["Pause", "Next"],
        SpeechSynthesisAction: {
          goal_id: {
            id: "Archie has a lot of plans. He never stops inventing.",
            stamp: Date.now()
          },
          goal: {
            text: "Archie has a lot of plans. He never stops inventing.",
            rate: 0.8,
            afterpauseduration: 3000
          }
        }
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
        RobotSpeechbubbleAction: {
          type: "IMAGE",
          value: "/public/img/professor_archie_makes_a_bang-10.png"
        },
        HumanSpeechbubbleAction: ["Pause", "Next"],
        SpeechSynthesisAction: {
          goal_id: {
            id: "What would you make if you were Archie?",
            stamp: Date.now()
          },
          goal: {
            text: "What would you make if you were Archie?",
            rate: 0.8,
            afterpauseduration: 3000
          }
        }
      }
    };

    // Proactive Resume
  } else if (stateStamped.state === "SP2" && inputD.type === "Features") {
    if (
      inputC.history.humanSpeechbubbleActionResultStamped[0].result !=
        "Pause" && // don't override human
      inputC.face.isVisible &&
      (inputC.face.noseAngle < engagedMaxNoseAngle &&
        inputC.face.noseAngle > engagedMinNoseAngle)
    ) {
      return {
        state: "S2",
        outputs: {
          RobotSpeechbubbleAction: {
            type: "IMAGE",
            value: "/public/img/professor_archie_makes_a_bang-1.png"
          },
          HumanSpeechbubbleAction: ["Pause", "Next"],
          SpeechSynthesisAction: {
            goal_id: {
              id: "PROFESSOR ARCHIE MAKES A BANG by Bel Richardson",
              stamp: Date.now()
            },
            goal: {
              text:
                ", , , , , , Let's see... PROFESSOR ARCHIE MAKES A BANG by Bel Richardson",
              rate: 0.8,
              afterpauseduration: 3000
            }
          }
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
      inputC.history.humanSpeechbubbleActionResultStamped[0].result !=
        "Pause" && // don't override human
      inputC.face.isVisible &&
      (inputC.face.noseAngle < engagedMaxNoseAngle &&
        inputC.face.noseAngle > engagedMinNoseAngle)
    ) {
      return {
        state: "S3",
        outputs: {
          RobotSpeechbubbleAction: {
            type: "IMAGE",
            value: "/public/img/professor_archie_makes_a_bang-2.png"
          },
          HumanSpeechbubbleAction: ["Pause", "Next"],
          SpeechSynthesisAction: {
            goal_id: {
              id: "Professor Archie thinks a lot. He thinks of things to make.",
              stamp: Date.now()
            },
            goal: {
              text:
                ", , , , , , Let's see... Professor Archie thinks a lot. He thinks of things to make.",
              rate: 0.8,
              afterpauseduration: 3000
            }
          }
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
      inputC.history.humanSpeechbubbleActionResultStamped[0].result !=
        "Pause" && // don't override human
      inputC.face.isVisible &&
      (inputC.face.noseAngle < engagedMaxNoseAngle &&
        inputC.face.noseAngle > engagedMinNoseAngle)
    ) {
      return {
        state: "S4",
        outputs: {
          RobotSpeechbubbleAction: {
            type: "IMAGE",
            value: "/public/img/professor_archie_makes_a_bang-3.png"
          },
          HumanSpeechbubbleAction: ["Pause", "Next"],
          SpeechSynthesisAction: {
            goal_id: {
              id: "He thinks as he brushes his teeth. He thinks at his desk.",
              stamp: Date.now()
            },
            goal: {
              text:
                ", , , , , , Let's see... He thinks as he brushes his teeth. He thinks at his desk.",
              rate: 0.8,
              afterpauseduration: 3000
            }
          }
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
      inputC.history.humanSpeechbubbleActionResultStamped[0].result !=
        "Pause" && // don't override human
      inputC.face.isVisible &&
      (inputC.face.noseAngle < engagedMaxNoseAngle &&
        inputC.face.noseAngle > engagedMinNoseAngle)
    ) {
      return {
        state: "S5",
        outputs: {
          RobotSpeechbubbleAction: {
            type: "IMAGE",
            value: "/public/img/professor_archie_makes_a_bang-4.png"
          },
          HumanSpeechbubbleAction: ["Pause", "Next"],
          SpeechSynthesisAction: {
            goal_id: {
              id: "He even thinks in bed. Then, it clicks.",
              stamp: Date.now()
            },
            goal: {
              text:
                ", , , , , , Let's see... He even thinks in bed. Then, it clicks.",
              rate: 0.8,
              afterpauseduration: 3000
            }
          }
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
      inputC.history.humanSpeechbubbleActionResultStamped[0].result !=
        "Pause" && // don't override human
      inputC.face.isVisible &&
      (inputC.face.noseAngle < engagedMaxNoseAngle &&
        inputC.face.noseAngle > engagedMinNoseAngle)
    ) {
      return {
        state: "S6",
        outputs: {
          RobotSpeechbubbleAction: {
            type: "IMAGE",
            value: "/public/img/professor_archie_makes_a_bang-5.png"
          },
          HumanSpeechbubbleAction: ["Pause", "Next"],
          SpeechSynthesisAction: {
            goal_id: {
              id:
                "Archie makes bots that can help. The bots make toast for Archie.",
              stamp: Date.now()
            },
            goal: {
              text:
                ", , , , , , Let's see... Archie makes bots that can help. The bots make toast for Archie.",
              rate: 0.8,
              afterpauseduration: 3000
            }
          }
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
      inputC.history.humanSpeechbubbleActionResultStamped[0].result !=
        "Pause" && // don't override human
      inputC.face.isVisible &&
      (inputC.face.noseAngle < engagedMaxNoseAngle &&
        inputC.face.noseAngle > engagedMinNoseAngle)
    ) {
      return {
        state: "S7",
        outputs: {
          RobotSpeechbubbleAction: {
            type: "IMAGE",
            value: "/public/img/professor_archie_makes_a_bang-6.png"
          },
          HumanSpeechbubbleAction: ["Pause", "Next"],
          SpeechSynthesisAction: {
            goal_id: {
              id:
                "Archie makes a pen that can do art by itself. What do you think of it?",
              stamp: Date.now()
            },
            goal: {
              text:
                ", , , , , , Let's see... Archie makes a pen that can do art by itself. What do you think of it?",
              rate: 0.8,
              afterpauseduration: 3000
            }
          }
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
      inputC.history.humanSpeechbubbleActionResultStamped[0].result !=
        "Pause" && // don't override human
      inputC.face.isVisible &&
      (inputC.face.noseAngle < engagedMaxNoseAngle &&
        inputC.face.noseAngle > engagedMinNoseAngle)
    ) {
      return {
        state: "S8",
        outputs: {
          RobotSpeechbubbleAction: {
            type: "IMAGE",
            value: "/public/img/professor_archie_makes_a_bang-7.png"
          },
          HumanSpeechbubbleAction: ["Pause", "Next"],
          SpeechSynthesisAction: {
            goal_id: {
              id: "Archie makes it so that his bike can run his laptop.",
              stamp: Date.now()
            },
            goal: {
              text:
                ", , , , , , Let's see... Archie makes it so that his bike can run his laptop.",
              rate: 0.8,
              afterpauseduration: 3000
            }
          }
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
      inputC.history.humanSpeechbubbleActionResultStamped[0].result !=
        "Pause" && // don't override human
      inputC.face.isVisible &&
      (inputC.face.noseAngle < engagedMaxNoseAngle &&
        inputC.face.noseAngle > engagedMinNoseAngle)
    ) {
      return {
        state: "S9",
        outputs: {
          RobotSpeechbubbleAction: {
            type: "IMAGE",
            value: "/public/img/professor_archie_makes_a_bang-8.png"
          },
          HumanSpeechbubbleAction: ["Pause", "Next"],
          SpeechSynthesisAction: {
            goal_id: {
              id: "Archie even makes it so that cars can sail.",
              stamp: Date.now()
            },
            goal: {
              text:
                ", , , , , , Let's see... Archie even makes it so that cars can sail.",
              rate: 0.8,
              afterpauseduration: 3000
            }
          }
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
      inputC.history.humanSpeechbubbleActionResultStamped[0].result !=
        "Pause" && // don't override human
      inputC.face.isVisible &&
      (inputC.face.noseAngle < engagedMaxNoseAngle &&
        inputC.face.noseAngle > engagedMinNoseAngle)
    ) {
      return {
        state: "S10",
        outputs: {
          RobotSpeechbubbleAction: {
            type: "IMAGE",
            value: "/public/img/professor_archie_makes_a_bang-9.png"
          },
          HumanSpeechbubbleAction: ["Pause", "Next"],
          SpeechSynthesisAction: {
            goal_id: {
              id: "Archie has a lot of plans. He never stops inventing.",
              stamp: Date.now()
            },
            goal: {
              text:
                ", , , , , , Let's see... Archie has a lot of plans. He never stops inventing.",
              rate: 0.8,
              afterpauseduration: 3000
            }
          }
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
      inputC.history.humanSpeechbubbleActionResultStamped[0].result !=
        "Pause" && // don't override human
      inputC.face.isVisible &&
      (inputC.face.noseAngle < engagedMaxNoseAngle &&
        inputC.face.noseAngle > engagedMinNoseAngle)
    ) {
      return {
        state: "S11",
        outputs: {
          RobotSpeechbubbleAction: {
            type: "IMAGE",
            value: "/public/img/professor_archie_makes_a_bang-10.png"
          },
          HumanSpeechbubbleAction: ["Pause", "Next"],
          SpeechSynthesisAction: {
            goal_id: {
              id: "What would you make if you were Archie?",
              stamp: Date.now()
            },
            goal: {
              text:
                ", , , , , , Let's see... What would you make if you were Archie?",
              rate: 0.8,
              afterpauseduration: 3000
            }
          }
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
  engagedMinNoseAngle: -10,
  engagedMaxNoseAngle: 10,
  disengagedMinNoseAngle: -15,
  disengagedMaxNoseAngle: 15,
  disengagedMaxMaxNoseAngle1Sec: 20,
  disengagedTimeoutIntervalCs: 200,
  sets: {
    passive: {
      engagedMinNoseAngle: 0,
      engagedMaxNoseAngle: 0,
      disengagedMinNoseAngle: -90,
      disengagedMaxNoseAngle: 90,
      disengagedMaxMaxNoseAngle1Sec: -1,
      disengagedTimeoutIntervalCs: -1
    },
    proactive: {
      engagedMinNoseAngle: -10,
      engagedMaxNoseAngle: 10,
      disengagedMinNoseAngle: -15,
      disengagedMaxNoseAngle: 15,
      disengagedMaxMaxNoseAngle1Sec: 20,
      disengagedTimeoutIntervalCs: 200
    }
  }
};

module.exports = {
  transition: transition,
  defaultParams: defaultParams
};
