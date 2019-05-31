"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
// https://www.geeksforgeeks.org/maximum-difference-between-two-elements/
function maxDiff(arr) {
  var n = arr.length;
  var maxDiff = -1;
  var maxRight = arr[n - 1];
  for (var i = n - 2; i >= 0; i--) {
    if (arr[i] > maxRight) maxRight = arr[i];else {
      var diff = maxRight - arr[i];
      if (diff > maxDiff) {
        maxDiff = diff;
      }
    }
  }
  return maxDiff;
}

function maxDiffReverse(arr) {
  var n = arr.length;
  var maxDiff = -1;
  var maxLeft = arr[0];
  for (var i = 1; i < n; i++) {
    if (arr[i] > maxLeft) maxLeft = arr[i];else {
      var diff = maxLeft - arr[i];
      if (diff > maxDiff) {
        maxDiff = diff;
      }
    }
  }
  return maxDiff;
}

var defaultFaceFeatures = {
  stamp: 0,
  isVisible: false,
  faceSize: 0,
  faceCenterX: 0,
  faceCenterY: 0,
  faceRotation: 0,
  noseRotation: 0
};

function norm(pt) {
  return Math.sqrt(pt.x * pt.x + pt.y * pt.y);
}

function rotate(pt, theta) {
  return {
    x: pt.x * Math.cos(theta) - pt.y * Math.sin(theta),
    y: pt.x * Math.sin(theta) + pt.y * Math.cos(theta)
  };
}

function extractFaceFeatures(poses) {
  if (poses.length === 0 || !poses[0].keypoints.find(function (kpt) {
    return kpt.part === "nose";
  }) || !poses[0].keypoints.find(function (kpt) {
    return kpt.part === "leftEye";
  }) || !poses[0].keypoints.find(function (kpt) {
    return kpt.part === "rightEye";
  })) {
    return {
      stamp: Date.now(),
      isVisible: false,
      faceSize: defaultFaceFeatures.faceSize,
      faceCenterX: defaultFaceFeatures.faceCenterX,
      faceCenterY: defaultFaceFeatures.faceCenterY,
      faceRotation: defaultFaceFeatures.faceRotation,
      noseRotation: defaultFaceFeatures.noseRotation
    };
  }

  var ns = poses[0].keypoints.filter(function (kpt) {
    return kpt.part === "nose";
  })[0].position;
  var le = poses[0].keypoints.filter(function (kpt) {
    return kpt.part === "leftEye";
  })[0].position;
  var re = poses[0].keypoints.filter(function (kpt) {
    return kpt.part === "rightEye";
  })[0].position;
  var dnsre = Math.sqrt(Math.pow(ns.x - le.x, 2) + Math.pow(ns.y - le.y, 2));
  var dnsle = Math.sqrt(Math.pow(ns.x - re.x, 2) + Math.pow(ns.y - re.y, 2));
  var drele = Math.sqrt(Math.pow(re.x - le.x, 2) + Math.pow(re.y - le.y, 2));
  var s = 0.5 * (dnsre + dnsle + drele);
  var faceSize = Math.sqrt(s * (s - dnsre) * (s - dnsle) * (s - drele));
  var faceCenterX = (ns.x + le.x + re.x) / 3;
  var faceCenterY = (ns.y + le.y + re.y) / 3;

  // a point between two eyes
  var bw = {
    x: (le.x + re.x) * 0.5,
    y: (le.y + re.y) * 0.5
  };
  // a vector from the point between two eyes to the right eye
  var vbl = {
    x: le.x - bw.x,
    y: le.y - bw.y
  };
  var faceRotation = Math.atan2(vbl.y, vbl.x);

  var vbn = {
    x: ns.x - bw.x,
    y: ns.y - bw.y
  };
  var dvbl = Math.sqrt(Math.pow(vbl.x, 2) + Math.pow(vbl.y, 2));
  var dvbn = Math.sqrt(Math.pow(vbn.x, 2) + Math.pow(vbn.y, 2));
  var noseRotation = Math.acos((vbl.x * vbn.x + vbl.y * vbn.y) / (dvbl * dvbn));

  return {
    stamp: Date.now(),
    isVisible: true,
    faceSize: faceSize,
    faceHeight: norm(vbn),
    faceCenterX: faceCenterX,
    faceCenterY: faceCenterY,
    faceAngle: faceRotation / Math.PI * 180,
    noseAngle: (noseRotation - Math.PI / 2) / Math.PI * 180
  };
}

var defaultVoiceFeatures = {
  stamp: 0,
  vadLevel: 0,
  vadState: "INACTIVE"
};

function extractVoiceFeatures(prev, type, value) {
  var stamp = Date.now();
  var vadState = type === "START" ? "ACTIVE" : type === "STOP" ? "INACTIVE" : prev.vadState;
  return {
    stamp: stamp,
    vadState: vadState,
    vadLevel: type === "UPDATE" ? value : prev.vadLevel
  };
}

exports.maxDiff = maxDiff;
exports.maxDiffReverse = maxDiffReverse;
exports.defaultFaceFeatures = defaultFaceFeatures;
exports.extractFaceFeatures = extractFaceFeatures;
exports.defaultVoiceFeatures = defaultVoiceFeatures;
exports.extractVoiceFeatures = extractVoiceFeatures;