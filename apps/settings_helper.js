var settings = require("./settings.json");

var defaultVal = {
  dataplayer: {
    fileprefix: "test"
  },
  robot: {
    name: "demo",
    withTabletFaceRobotActionsOptions: {
      styles: {
        robotSpeechbubble: {
          styles: {
            img: {
              height: "75vmin"
            }
          }
        },
        humanSpeechbubble: {
          styles: {
            button: {
              fontSize: "8vmin"
            }
          }
        }
      }
    },
    recording: {
      enabled: true
    },
    charts: {
      enabled: true
    },
    parameters: {
      setName: ""
    }
  }
};

settings = (function defaults(s, dVal) {
  if (typeof dVal !== "object" && typeof dVal !== null) {
    return typeof s === "undefined" ? dVal : s;
  } else {
    if (Array.isArray(dVal)) {
      return dVal.map(function(k) {
        return defaults(typeof s === "undefined" ? s : s[k], dVal[k]);
      });
    } else {
      return Object.keys(dVal).reduce(function(prev, k) {
        prev[k] = defaults(typeof s === "undefined" ? s : s[k], dVal[k]);
        return prev;
      }, {});
    }
  }
})(typeof settings === "undfined" ? {} : settings, defaultVal);

module.exports = settings;
