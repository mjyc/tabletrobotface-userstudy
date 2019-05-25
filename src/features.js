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
  faceOrientation: 0,
  noseOrientation: 0
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
      faceOrientation: defaultFaceFeatures.faceOrientation,
      noseOrientation: defaultFaceFeatures.noseOrientation
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

  const btnEyesPt = {
    x: (le.x + re.x) * 0.5,
    y: (le.y + re.y) * 0.5
  };
  const v = {
    // a vector from the point between two eyes to the nose
    x: ns.x - btnEyesPt.x,
    y: ns.y - btnEyesPt.y
  };
  const faceOrientation = Math.atan2(v.y, v.x);

  const dbere = Math.sqrt(
    Math.pow(btnEyesPt.x - re.x, 2) + Math.pow(btnEyesPt.y - re.y, 2)
  );
  const dbens = Math.sqrt(
    Math.pow(ns.x - btnEyesPt.x, 2) + Math.pow(ns.y - btnEyesPt.y, 2)
  );
  const noseOrientation = Math.acos(
    (Math.pow(dbere, 2) + Math.pow(dbens, 2) - Math.pow(dnsre, 2)) /
      (2 * dbere * dbens)
  );

  return {
    stamp: Date.now(),
    isVisible: true,
    faceSize: faceSize,
    faceCenterX: faceCenterX,
    faceCenterY: faceCenterY,
    faceOrientation: faceOrientation - noseOrientation,
    noseOrientation: noseOrientation - Math.PI / 2
  };
}

module.exports = {
  maxDiff: maxDiff,
  maxDiffReverse: maxDiffReverse,
  defaultFaceFeatures: defaultFaceFeatures,
  extractFaceFeatures: extractFaceFeatures
};
