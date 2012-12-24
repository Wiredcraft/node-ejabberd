var Q = require('q');
var cp = require('child_process');

exports.promise = function(cmd) {
  var d = Q.defer();

  cp.exec(cmd, function(err, stderr, stdout) {
    if (err) {
      d.reject(err);
    } else {
      d.resolve(stdout);
    }
  });

  return d.promise;
}
