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
          value: "/public/img/ranger_forester-1.png"
        },
        HumanSpeechbubbleAction: ["Pause", "Next"],
        SpeechSynthesisAction: {
          goal_id: {
            id: "RANGER FORESTER by Bel Richardson",
            stamp: Date.now()
          },
          goal: {
            text: "RANGER FORESTER by Bel Richardson",
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
        "RANGER FORESTER by Bel Richardson" &&
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
            value: "/public/img/ranger_forester-2.png"
          },
          HumanSpeechbubbleAction: ["Pause", "Next"],
          SpeechSynthesisAction: {
            goal_id: {
              id: "Ranger Forester will check on the animals.",
              stamp: Date.now()
            },
            goal: {
              text: "Ranger Forester will check on the animals.",
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
        "Ranger Forester will check on the animals." &&
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
            value: "/public/img/ranger_forester-3.png"
          },
          HumanSpeechbubbleAction: ["Pause", "Next"],
          SpeechSynthesisAction: {
            goal_id: {
              id: "Forester sees insects. This sort of bee cannot sting.",
              stamp: Date.now()
            },
            goal: {
              text: "Forester sees insects. This sort of bee cannot sting.",
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
        "Forester sees insects. This sort of bee cannot sting." &&
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
            value: "/public/img/ranger_forester-4.png"
          },
          HumanSpeechbubbleAction: ["Pause", "Next"],
          SpeechSynthesisAction: {
            goal_id: {
              id: "Tweet! Forester can see soft fluff.",
              stamp: Date.now()
            },
            goal: {
              text: "Tweet! Forester can see soft fluff.",
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
        "Tweet! Forester can see soft fluff." &&
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
            value: "/public/img/ranger_forester-5.png"
          },
          HumanSpeechbubbleAction: ["Pause", "Next"],
          SpeechSynthesisAction: {
            goal_id: {
              id: "Hiss! A snake is looking for a rock to sit on in the sun.",
              stamp: Date.now()
            },
            goal: {
              text: "Hiss! A snake is looking for a rock to sit on in the sun.",
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
        "Hiss! A snake is looking for a rock to sit on in the sun." &&
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
            value: "/public/img/ranger_forester-6.png"
          },
          HumanSpeechbubbleAction: ["Pause", "Next"],
          SpeechSynthesisAction: {
            goal_id: {
              id: "The spiders need to fix the web to get insects.",
              stamp: Date.now()
            },
            goal: {
              text: "The spiders need to fix the web to get insects.",
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
        "The spiders need to fix the web to get insects." &&
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
            value: "/public/img/ranger_forester-7.png"
          },
          HumanSpeechbubbleAction: ["Pause", "Next"],
          SpeechSynthesisAction: {
            goal_id: {
              id:
                "Here is the kangaroo family. Forester cannot see the little kangaroo.",
              stamp: Date.now()
            },
            goal: {
              text:
                "Here is the kangaroo family. Forester cannot see the little kangaroo.",
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
        "Here is the kangaroo family. Forester cannot see the little kangaroo." &&
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
            value: "/public/img/ranger_forester-8.png"
          },
          HumanSpeechbubbleAction: ["Pause", "Next"],
          SpeechSynthesisAction: {
            goal_id: {
              id: "The little kangaroo got stuck in a trap. Forester helps.",
              stamp: Date.now()
            },
            goal: {
              text: "The little kangaroo got stuck in a trap. Forester helps.",
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
        "The little kangaroo got stuck in a trap. Forester helps." &&
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
            value: "/public/img/ranger_forester-9.png"
          },
          HumanSpeechbubbleAction: ["Pause", "Next"],
          SpeechSynthesisAction: {
            goal_id: {
              id:
                "The little roo is happy. Back to its family. Thanks Forester.",
              stamp: Date.now()
            },
            goal: {
              text:
                "The little roo is happy. Back to its family. Thanks Forester.",
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
        "The little roo is happy. Back to its family. Thanks Forester." &&
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
            value: "/public/img/ranger_forester-10.png"
          },
          HumanSpeechbubbleAction: ["Pause", "Next"],
          SpeechSynthesisAction: {
            goal_id: {
              id:
                "Forester keeps the trap. He is very upset. He will tell the cops.",
              stamp: Date.now()
            },
            goal: {
              text:
                "Forester keeps the trap. He is very upset. He will tell the cops.",
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
  } else if (stateStamped.state === "S11" && inputD.type === "Features") {
    if (
      // Proactive Next
      disengagedMaxMaxNoseAngle1Sec >= 0 && // use disengagedMaxMaxNoseAngle1Sec < 0 to disable proactive next
      inputC.history.speechSynthesisActionResultStamped[0].goal_id.id ===
        "Forester keeps the trap. He is very upset. He will tell the cops." &&
      inputC.face.isVisible &&
      inputC.face.noseAngle < disengagedMaxNoseAngle &&
      inputC.face.noseAngle > disengagedMinNoseAngle &&
      inputC.temporal.maxNoseAngle1Sec < disengagedMaxMaxNoseAngle1Sec
    ) {
      return {
        state: "S12",
        outputs: {
          RobotSpeechbubbleAction: {
            type: "IMAGE",
            value: "/public/img/ranger_forester-11.png"
          },
          HumanSpeechbubbleAction: ["Pause", "Next"],
          SpeechSynthesisAction: {
            goal_id: {
              id:
                "The cops get the man that set the trap. The animals are safe.",
              stamp: Date.now()
            },
            goal: {
              text:
                "The cops get the man that set the trap. The animals are safe.",
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
        state: "SP12",
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
    stateStamped.state === "S12" &&
    inputD.type === "SpeechSynthesisAction" &&
    inputD.status === "SUCCEEDED"
  ) {
    return {
      state: "S13",
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
          value: "/public/img/ranger_forester-1.png"
        },
        HumanSpeechbubbleAction: ["Pause", "Next"],
        SpeechSynthesisAction: {
          goal_id: {
            id: "RANGER FORESTER by Bel Richardson",
            stamp: Date.now()
          },
          goal: {
            text: "RANGER FORESTER by Bel Richardson",
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
          value: "/public/img/ranger_forester-2.png"
        },
        HumanSpeechbubbleAction: ["Pause", "Next"],
        SpeechSynthesisAction: {
          goal_id: {
            id: "Ranger Forester will check on the animals.",
            stamp: Date.now()
          },
          goal: {
            text: "Ranger Forester will check on the animals.",
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
          value: "/public/img/ranger_forester-3.png"
        },
        HumanSpeechbubbleAction: ["Pause", "Next"],
        SpeechSynthesisAction: {
          goal_id: {
            id: "Forester sees insects. This sort of bee cannot sting.",
            stamp: Date.now()
          },
          goal: {
            text: "Forester sees insects. This sort of bee cannot sting.",
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
          value: "/public/img/ranger_forester-4.png"
        },
        HumanSpeechbubbleAction: ["Pause", "Next"],
        SpeechSynthesisAction: {
          goal_id: {
            id: "Tweet! Forester can see soft fluff.",
            stamp: Date.now()
          },
          goal: {
            text: "Tweet! Forester can see soft fluff.",
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
          value: "/public/img/ranger_forester-5.png"
        },
        HumanSpeechbubbleAction: ["Pause", "Next"],
        SpeechSynthesisAction: {
          goal_id: {
            id: "Hiss! A snake is looking for a rock to sit on in the sun.",
            stamp: Date.now()
          },
          goal: {
            text: "Hiss! A snake is looking for a rock to sit on in the sun.",
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
          value: "/public/img/ranger_forester-6.png"
        },
        HumanSpeechbubbleAction: ["Pause", "Next"],
        SpeechSynthesisAction: {
          goal_id: {
            id: "The spiders need to fix the web to get insects.",
            stamp: Date.now()
          },
          goal: {
            text: "The spiders need to fix the web to get insects.",
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
          value: "/public/img/ranger_forester-7.png"
        },
        HumanSpeechbubbleAction: ["Pause", "Next"],
        SpeechSynthesisAction: {
          goal_id: {
            id:
              "Here is the kangaroo family. Forester cannot see the little kangaroo.",
            stamp: Date.now()
          },
          goal: {
            text:
              "Here is the kangaroo family. Forester cannot see the little kangaroo.",
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
          value: "/public/img/ranger_forester-8.png"
        },
        HumanSpeechbubbleAction: ["Pause", "Next"],
        SpeechSynthesisAction: {
          goal_id: {
            id: "The little kangaroo got stuck in a trap. Forester helps.",
            stamp: Date.now()
          },
          goal: {
            text: "The little kangaroo got stuck in a trap. Forester helps.",
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
          value: "/public/img/ranger_forester-9.png"
        },
        HumanSpeechbubbleAction: ["Pause", "Next"],
        SpeechSynthesisAction: {
          goal_id: {
            id: "The little roo is happy. Back to its family. Thanks Forester.",
            stamp: Date.now()
          },
          goal: {
            text:
              "The little roo is happy. Back to its family. Thanks Forester.",
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
          value: "/public/img/ranger_forester-10.png"
        },
        HumanSpeechbubbleAction: ["Pause", "Next"],
        SpeechSynthesisAction: {
          goal_id: {
            id:
              "Forester keeps the trap. He is very upset. He will tell the cops.",
            stamp: Date.now()
          },
          goal: {
            text:
              "Forester keeps the trap. He is very upset. He will tell the cops.",
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
        RobotSpeechbubbleAction: {
          type: "IMAGE",
          value: "/public/img/ranger_forester-11.png"
        },
        HumanSpeechbubbleAction: ["Pause", "Next"],
        SpeechSynthesisAction: {
          goal_id: {
            id: "The cops get the man that set the trap. The animals are safe.",
            stamp: Date.now()
          },
          goal: {
            text:
              "The cops get the man that set the trap. The animals are safe.",
            rate: 0.8,
            afterpauseduration: 3000
          }
        }
      }
    };
  } else if (
    stateStamped.state === "S12" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Next"
  ) {
    return {
      state: "S13",
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
  } else if (
    stateStamped.state === "S12" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Pause"
  ) {
    return {
      state: "SP12",
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
          value: "/public/img/ranger_forester-1.png"
        },
        HumanSpeechbubbleAction: ["Pause", "Next"],
        SpeechSynthesisAction: {
          goal_id: {
            id: "RANGER FORESTER by Bel Richardson",
            stamp: Date.now()
          },
          goal: {
            text: "RANGER FORESTER by Bel Richardson",
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
          value: "/public/img/ranger_forester-2.png"
        },
        HumanSpeechbubbleAction: ["Pause", "Next"],
        SpeechSynthesisAction: {
          goal_id: {
            id: "Ranger Forester will check on the animals.",
            stamp: Date.now()
          },
          goal: {
            text: "Ranger Forester will check on the animals.",
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
          value: "/public/img/ranger_forester-3.png"
        },
        HumanSpeechbubbleAction: ["Pause", "Next"],
        SpeechSynthesisAction: {
          goal_id: {
            id: "Forester sees insects. This sort of bee cannot sting.",
            stamp: Date.now()
          },
          goal: {
            text: "Forester sees insects. This sort of bee cannot sting.",
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
          value: "/public/img/ranger_forester-4.png"
        },
        HumanSpeechbubbleAction: ["Pause", "Next"],
        SpeechSynthesisAction: {
          goal_id: {
            id: "Tweet! Forester can see soft fluff.",
            stamp: Date.now()
          },
          goal: {
            text: "Tweet! Forester can see soft fluff.",
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
          value: "/public/img/ranger_forester-5.png"
        },
        HumanSpeechbubbleAction: ["Pause", "Next"],
        SpeechSynthesisAction: {
          goal_id: {
            id: "Hiss! A snake is looking for a rock to sit on in the sun.",
            stamp: Date.now()
          },
          goal: {
            text: "Hiss! A snake is looking for a rock to sit on in the sun.",
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
          value: "/public/img/ranger_forester-6.png"
        },
        HumanSpeechbubbleAction: ["Pause", "Next"],
        SpeechSynthesisAction: {
          goal_id: {
            id: "The spiders need to fix the web to get insects.",
            stamp: Date.now()
          },
          goal: {
            text: "The spiders need to fix the web to get insects.",
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
          value: "/public/img/ranger_forester-7.png"
        },
        HumanSpeechbubbleAction: ["Pause", "Next"],
        SpeechSynthesisAction: {
          goal_id: {
            id:
              "Here is the kangaroo family. Forester cannot see the little kangaroo.",
            stamp: Date.now()
          },
          goal: {
            text:
              "Here is the kangaroo family. Forester cannot see the little kangaroo.",
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
          value: "/public/img/ranger_forester-8.png"
        },
        HumanSpeechbubbleAction: ["Pause", "Next"],
        SpeechSynthesisAction: {
          goal_id: {
            id: "The little kangaroo got stuck in a trap. Forester helps.",
            stamp: Date.now()
          },
          goal: {
            text: "The little kangaroo got stuck in a trap. Forester helps.",
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
          value: "/public/img/ranger_forester-9.png"
        },
        HumanSpeechbubbleAction: ["Pause", "Next"],
        SpeechSynthesisAction: {
          goal_id: {
            id: "The little roo is happy. Back to its family. Thanks Forester.",
            stamp: Date.now()
          },
          goal: {
            text:
              "The little roo is happy. Back to its family. Thanks Forester.",
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
          value: "/public/img/ranger_forester-10.png"
        },
        HumanSpeechbubbleAction: ["Pause", "Next"],
        SpeechSynthesisAction: {
          goal_id: {
            id:
              "Forester keeps the trap. He is very upset. He will tell the cops.",
            stamp: Date.now()
          },
          goal: {
            text:
              "Forester keeps the trap. He is very upset. He will tell the cops.",
            rate: 0.8,
            afterpauseduration: 3000
          }
        }
      }
    };
  } else if (
    stateStamped.state === "SP12" &&
    inputD.type === "HumanSpeechbubbleAction" &&
    inputD.status === "SUCCEEDED" &&
    inputD.result === "Resume"
  ) {
    return {
      state: "S12",
      outputs: {
        RobotSpeechbubbleAction: {
          type: "IMAGE",
          value: "/public/img/ranger_forester-11.png"
        },
        HumanSpeechbubbleAction: ["Pause", "Next"],
        SpeechSynthesisAction: {
          goal_id: {
            id: "The cops get the man that set the trap. The animals are safe.",
            stamp: Date.now()
          },
          goal: {
            text:
              "The cops get the man that set the trap. The animals are safe.",
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
            value: "/public/img/ranger_forester-1.png"
          },
          HumanSpeechbubbleAction: ["Pause", "Next"],
          SpeechSynthesisAction: {
            goal_id: {
              id: "RANGER FORESTER by Bel Richardson",
              stamp: Date.now()
            },
            goal: {
              text:
                ", , , , , , Let's see... RANGER FORESTER by Bel Richardson",
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
            value: "/public/img/ranger_forester-2.png"
          },
          HumanSpeechbubbleAction: ["Pause", "Next"],
          SpeechSynthesisAction: {
            goal_id: {
              id: "Ranger Forester will check on the animals.",
              stamp: Date.now()
            },
            goal: {
              text:
                ", , , , , , Let's see... Ranger Forester will check on the animals.",
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
            value: "/public/img/ranger_forester-3.png"
          },
          HumanSpeechbubbleAction: ["Pause", "Next"],
          SpeechSynthesisAction: {
            goal_id: {
              id: "Forester sees insects. This sort of bee cannot sting.",
              stamp: Date.now()
            },
            goal: {
              text:
                ", , , , , , Let's see... Forester sees insects. This sort of bee cannot sting.",
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
            value: "/public/img/ranger_forester-4.png"
          },
          HumanSpeechbubbleAction: ["Pause", "Next"],
          SpeechSynthesisAction: {
            goal_id: {
              id: "Tweet! Forester can see soft fluff.",
              stamp: Date.now()
            },
            goal: {
              text:
                ", , , , , , Let's see... Tweet! Forester can see soft fluff.",
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
            value: "/public/img/ranger_forester-5.png"
          },
          HumanSpeechbubbleAction: ["Pause", "Next"],
          SpeechSynthesisAction: {
            goal_id: {
              id: "Hiss! A snake is looking for a rock to sit on in the sun.",
              stamp: Date.now()
            },
            goal: {
              text:
                ", , , , , , Let's see... Hiss! A snake is looking for a rock to sit on in the sun.",
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
            value: "/public/img/ranger_forester-6.png"
          },
          HumanSpeechbubbleAction: ["Pause", "Next"],
          SpeechSynthesisAction: {
            goal_id: {
              id: "The spiders need to fix the web to get insects.",
              stamp: Date.now()
            },
            goal: {
              text:
                ", , , , , , Let's see... The spiders need to fix the web to get insects.",
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
            value: "/public/img/ranger_forester-7.png"
          },
          HumanSpeechbubbleAction: ["Pause", "Next"],
          SpeechSynthesisAction: {
            goal_id: {
              id:
                "Here is the kangaroo family. Forester cannot see the little kangaroo.",
              stamp: Date.now()
            },
            goal: {
              text:
                ", , , , , , Let's see... Here is the kangaroo family. Forester cannot see the little kangaroo.",
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
            value: "/public/img/ranger_forester-8.png"
          },
          HumanSpeechbubbleAction: ["Pause", "Next"],
          SpeechSynthesisAction: {
            goal_id: {
              id: "The little kangaroo got stuck in a trap. Forester helps.",
              stamp: Date.now()
            },
            goal: {
              text:
                ", , , , , , Let's see... The little kangaroo got stuck in a trap. Forester helps.",
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
            value: "/public/img/ranger_forester-9.png"
          },
          HumanSpeechbubbleAction: ["Pause", "Next"],
          SpeechSynthesisAction: {
            goal_id: {
              id:
                "The little roo is happy. Back to its family. Thanks Forester.",
              stamp: Date.now()
            },
            goal: {
              text:
                ", , , , , , Let's see... The little roo is happy. Back to its family. Thanks Forester.",
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
            value: "/public/img/ranger_forester-10.png"
          },
          HumanSpeechbubbleAction: ["Pause", "Next"],
          SpeechSynthesisAction: {
            goal_id: {
              id:
                "Forester keeps the trap. He is very upset. He will tell the cops.",
              stamp: Date.now()
            },
            goal: {
              text:
                ", , , , , , Let's see... Forester keeps the trap. He is very upset. He will tell the cops.",
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
  } else if (stateStamped.state === "SP12" && inputD.type === "Features") {
    if (
      inputC.history.humanSpeechbubbleActionResultStamped[0].result !=
        "Pause" && // don't override human
      inputC.face.isVisible &&
      (inputC.face.noseAngle < engagedMaxNoseAngle &&
        inputC.face.noseAngle > engagedMinNoseAngle)
    ) {
      return {
        state: "S12",
        outputs: {
          RobotSpeechbubbleAction: {
            type: "IMAGE",
            value: "/public/img/ranger_forester-11.png"
          },
          HumanSpeechbubbleAction: ["Pause", "Next"],
          SpeechSynthesisAction: {
            goal_id: {
              id:
                "The cops get the man that set the trap. The animals are safe.",
              stamp: Date.now()
            },
            goal: {
              text:
                ", , , , , , Let's see... The cops get the man that set the trap. The animals are safe.",
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
