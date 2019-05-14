// https://www.geeksforgeeks.org/maximum-difference-between-two-elements/
function maxDiff(arr) {
  var n = arr.length;
  var maxDiff = -1;
  var maxRight = arr[n - 1];
  for (var i = n - 2; i >= 0; i--) {
    if (arr[i] > maxRight) maxRight = arr[i];
    else {
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
    if (arr[i] > maxLeft) maxLeft = arr[i];
    else {
      var diff = maxLeft - arr[i];
      if (diff > maxDiff) {
        maxDiff = diff;
      }
    }
  }
  return maxDiff;
}

module.exports = {
  maxDiff: maxDiff,
  maxDiffReverse: maxDiffReverse
};
