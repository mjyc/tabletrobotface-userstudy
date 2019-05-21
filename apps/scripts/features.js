export var defaultFaceFeatures = {
  stamp: 0,
  isVisible: false,
  faceSize: 0,
  faceCenterX: 0,
  faceCenterY: 0,
  faceOrientation: 0,
  noseOrientation: 0
};

export function extractFaceFeatures(poses) {
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

  var ns = poses[0].keypoints.filter(function(kpt) {
    return kpt.part === "nose";
  })[0].position;
  var le = poses[0].keypoints.filter(function(kpt) {
    return kpt.part === "leftEye";
  })[0].position;
  var re = poses[0].keypoints.filter(function(kpt) {
    return kpt.part === "rightEye";
  })[0].position;
  var dnsre = Math.sqrt(Math.pow(ns.x - le.x, 2) + Math.pow(ns.y - le.y, 2));
  var dnsle = Math.sqrt(Math.pow(ns.x - re.x, 2) + Math.pow(ns.y - re.y, 2));
  var drele = Math.sqrt(Math.pow(re.x - le.x, 2) + Math.pow(re.y - le.y, 2));
  var s = 0.5 * (dnsre + dnsle + drele);
  var faceSize = Math.sqrt(s * (s - dnsre) * (s - dnsle) * (s - drele));
  var faceCenterX = (ns.x + le.x + re.x) / 3;
  var faceCenterY = (ns.y + le.y + re.y) / 3;

  var btnEyesPt = {
    x: (le.x + re.x) * 0.5,
    y: (le.y + re.y) * 0.5
  };
  var v = {
    // a vector from the point between two eyes to the nose
    x: ns.x - btnEyesPt.x,
    y: ns.y - btnEyesPt.y
  };
  var faceOrientation = Math.atan2(v.y, v.x);

  var dbere = Math.sqrt(
    Math.pow(btnEyesPt.x - re.x, 2) + Math.pow(btnEyesPt.y - re.y, 2)
  );
  var dbens = Math.sqrt(
    Math.pow(ns.x - btnEyesPt.x, 2) + Math.pow(ns.y - btnEyesPt.y, 2)
  );
  var noseOrientation = Math.acos(
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
