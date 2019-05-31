// https://www.geeksforgeeks.org/maximum-difference-between-two-elements/
function maxDiff(arr) {
  const n = arr.length;
  let maxDiff = -1;
  let maxRight = arr[n - 1];
  for (let i = n - 2; i >= 0; i--) {
    if (arr[i] > maxRight) maxRight = arr[i];
    else {
      const diff = maxRight - arr[i];
      if (diff > maxDiff) {
        maxDiff = diff;
      }
    }
  }
  return maxDiff;
}

function maxDiffReverse(arr) {
  const n = arr.length;
  let maxDiff = -1;
  let maxLeft = arr[0];
  for (let i = 1; i < n; i++) {
    if (arr[i] > maxLeft) maxLeft = arr[i];
    else {
      const diff = maxLeft - arr[i];
      if (diff > maxDiff) {
        maxDiff = diff;
      }
    }
  }
  return maxDiff;
}

const defaultFaceFeatures = {
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
  if (
    poses.length === 0 ||
    (!poses[0].keypoints.find(function(kpt) {
      return kpt.part === "nose";
    }) ||
      !poses[0].keypoints.find(function(kpt) {
        return kpt.part === "leftEye";
      }) ||
      !poses[0].keypoints.find(function(kpt) {
        return kpt.part === "rightEye";
      }))
  ) {
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

  const ns = poses[0].keypoints.filter(function(kpt) {
    return kpt.part === "nose";
  })[0].position;
  const le = poses[0].keypoints.filter(function(kpt) {
    return kpt.part === "leftEye";
  })[0].position;
  const re = poses[0].keypoints.filter(function(kpt) {
    return kpt.part === "rightEye";
  })[0].position;
  const dnsre = Math.sqrt(Math.pow(ns.x - le.x, 2) + Math.pow(ns.y - le.y, 2));
  const dnsle = Math.sqrt(Math.pow(ns.x - re.x, 2) + Math.pow(ns.y - re.y, 2));
  const drele = Math.sqrt(Math.pow(re.x - le.x, 2) + Math.pow(re.y - le.y, 2));
  const s = 0.5 * (dnsre + dnsle + drele);
  const faceSize = Math.sqrt(s * (s - dnsre) * (s - dnsle) * (s - drele));
  const faceCenterX = (ns.x + le.x + re.x) / 3;
  const faceCenterY = (ns.y + le.y + re.y) / 3;

  // a point between two eyes
  const bw = {
    x: (le.x + re.x) * 0.5,
    y: (le.y + re.y) * 0.5
  };
  // a vector from the point between two eyes to the right eye
  const vbl = {
    x: le.x - bw.x,
    y: le.y - bw.y
  };
  const faceRotation = Math.atan2(vbl.y, vbl.x);

  const vbn = {
    x: ns.x - bw.x,
    y: ns.y - bw.y
  };
  const dvbl = Math.sqrt(Math.pow(vbl.x, 2) + Math.pow(vbl.y, 2));
  const dvbn = Math.sqrt(Math.pow(vbn.x, 2) + Math.pow(vbn.y, 2));
  let noseRotation = Math.acos((vbl.x * vbn.x + vbl.y * vbn.y) / (dvbl * dvbn));

  return {
    stamp: Date.now(),
    isVisible: true,
    faceSize: faceSize,
    faceHeight: norm(vbn),
    faceCenterX: faceCenterX,
    faceCenterY: faceCenterY,
    faceAngle: (faceRotation / Math.PI) * 180,
    noseAngle: ((noseRotation - Math.PI / 2) / Math.PI) * 180
  };
}

const defaultVoiceFeatures = {
  stamp: 0,
  vadLevel: 0,
  vadState: "INACTIVE"
};

function extractVoiceFeatures(prev, type, value) {
  const stamp = Date.now();
  const vadState =
    type === "START" ? "ACTIVE" : type === "STOP" ? "INACTIVE" : prev.vadState;
  return {
    stamp,
    vadState,
    vadLevel: type === "UPDATE" ? value : prev.vadLevel
  };
}

export {
  maxDiff,
  maxDiffReverse,
  defaultFaceFeatures,
  extractFaceFeatures,
  defaultVoiceFeatures,
  extractVoiceFeatures
};
