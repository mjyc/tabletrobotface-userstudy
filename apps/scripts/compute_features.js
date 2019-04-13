if (process.argv.length < 4) {
  console.error('usage: node compute_features.js in.json out.json');
  process.exit(1);
}

var fs = require('fs');

function computeFeatures(poses) {
  let isVisible = null;
  let faceSize = null;
  let faceCenterX = null;
  let faceCenterY = null;
  let faceOrientation = null;
  let noseOrientation = null;

  isVisible = poses.length === 1;
  if (!isVisible) {
    return {
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
    !person.keypoints.find(kpt => kpt.part === 'nose')
    || !person.keypoints.find(kpt => kpt.part === 'leftEye')
    || !person.keypoints.find(kpt => kpt.part === 'rightEye')
  ) {
    return {
      isVisible,
      faceSize,
      faceCenterX,
      faceCenterY,
      faceOrientation,
      noseOrientation,
    };
  }
  const ns = person.keypoints.filter(kpt => kpt.part === 'nose')[0].position;
  const le = person.keypoints.filter(kpt => kpt.part === 'leftEye')[0].position;
  const re = person.keypoints.filter(kpt => kpt.part === 'rightEye')[0].position;
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


fs.readFile(process.argv[2], function(err, data) {
  if(err) throw err;

  var features = JSON.parse(data).poses.map(p => ({
    timestamp: p.timestamp,
    value: computeFeatures(p.value),
  }));

  fs.writeFileSync(process.argv[3], JSON.stringify({features}));
});
