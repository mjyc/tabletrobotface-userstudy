var settings = require('./settings.json');

var defaultVal = {
  dataplayer: {
    fileprefix: 'test',
  },
  robot: {
    name: 'demo',
    withTabletFaceRobotActionsOptions: {},
    recording: {
      enabled: true,
    },
  },
  applysrtr: {
    options: {H: 1},
  },
};

settings = (function defaults(s, dVal) {
  if (typeof dVal !== 'object' && typeof dVal !== null) {
    return typeof s === 'undefined' ? dVal : s;
  } else {
    if (Array.isArray(dVal)) {
      return dVal.map(function(k) {return defaults(typeof s === 'undefined' ? s : s[k], dVal[k]);});
    } else {
      return Object.keys(dVal).reduce(function(prev, k) {
        prev[k] = defaults(typeof s === 'undefined' ? s : s[k], dVal[k]);
        return prev;
      }, {});
    }
  }
})(typeof settings === 'undfined' ? {} : settings, defaultVal);

module.exports = settings;
