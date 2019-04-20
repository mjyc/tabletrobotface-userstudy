export var defaultFaceFeatures = {
  isVisible: false,
  faceSize: 0,
  faceCenterX: 0,
  faceCenterY: 0,
  faceOrientation: 0,
  noseOrientation: 0,
};

export function extractFaceFeatures(poses) {
  let isVisible = null;
  let faceSize = null;
  let faceCenterX = null;
  let faceCenterY = null;
  let faceOrientation = null;
  let noseOrientation = null;

  isVisible = poses.length === 1;
  if (!isVisible) {
    return {  // only isVisible is not null
      isVisible,
      faceSize,
      faceCenterX,
      faceCenterY,
      faceOrientation,
      noseOrientation,
    };
  }

  const person = poses[0];
  if (
    !person.keypoints.find(function (kpt) {return kpt.part === 'nose';})
    || !person.keypoints.find(function (kpt) {return kpt.part === 'leftEye';})
    || !person.keypoints.find(function (kpt) {return kpt.part === 'rightEye';})
  ) {
    return {  // only isVisible is not null
      isVisible,
      faceSize,
      faceCenterX,
      faceCenterY,
      faceOrientation,
      noseOrientation,
    };
  }
  const ns = person.keypoints.filter(function (kpt) {return kpt.part === 'nose';})[0].position;
  const le = person.keypoints.filter(function (kpt) {return kpt.part === 'leftEye';})[0].position;
  const re = person.keypoints.filter(function (kpt) {return kpt.part === 'rightEye';})[0].position;
  const dnsre = Math.sqrt(Math.pow(ns.x - le.x, 2) + Math.pow(ns.y - le.y, 2));
  const dnsle = Math.sqrt(Math.pow(ns.x - re.x, 2) + Math.pow(ns.y - re.y, 2));
  const drele = Math.sqrt(Math.pow(re.x - le.x, 2) + Math.pow(re.y - le.y, 2));
  const s = 0.5 * (dnsre + dnsle + drele);
  faceSize = Math.sqrt(s * (s - dnsre) * (s - dnsle) * (s - drele));

  faceCenterX = (ns.x + le.x + re.x) / 3;
  faceCenterY = (ns.y + le.y + re.y) / 3;

  const btnEyesPt = {
    x: (le.x + re.x) * 0.5,
    y: (le.y + re.y) * 0.5,
  };
  const v = {  // a vector from the point between two eyes to the nose
    x: ns.x - btnEyesPt.x,
    y: ns.y - btnEyesPt.y,
  };
  faceOrientation = Math.atan2(v.y, v.x);

  const dbere = Math.sqrt(Math.pow(btnEyesPt.x - re.x, 2) + Math.pow(btnEyesPt.y - re.y, 2));
  const dbens = Math.sqrt(Math.pow(ns.x - btnEyesPt.x, 2) + Math.pow(ns.y - btnEyesPt.y, 2));
  noseOrientation = Math.acos((Math.pow(dbere, 2) + Math.pow(dbens, 2) - Math.pow(dnsre, 2)) / (2 * dbere * dbens));

  return {
    isVisible,
    faceSize,
    faceCenterX,
    faceCenterY,
    faceOrientation,
    noseOrientation,
  };
}
