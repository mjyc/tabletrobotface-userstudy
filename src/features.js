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

  const dbwre = Math.sqrt(
    Math.pow(bw.x - re.x, 2) + Math.pow(bw.y - re.y, 2)
  );
  const dbwns = Math.sqrt(
    Math.pow(ns.x - bw.x, 2) + Math.pow(ns.y - bw.y, 2)
  );
  const noseRotation = Math.acos(
    (Math.pow(dbwre, 2) + Math.pow(dbwns, 2) - Math.pow(dnsre, 2)) /
      (2 * dbwre * dbwns)
  );

  return {
    stamp: Date.now(),
    isVisible: true,
    faceSize: faceSize,
    faceCenterX: faceCenterX,
    faceCenterY: faceCenterY,
    faceRotation: faceRotation,
    noseRotation: noseRotation
  };
}

module.exports = {
  maxDiff: maxDiff,
  maxDiffReverse: maxDiffReverse,
  defaultFaceFeatures: defaultFaceFeatures,
  extractFaceFeatures: extractFaceFeatures
};
