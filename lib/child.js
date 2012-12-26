var cp = require('child_process');

var Q = require('q');

var logger = require('./helpers').logger;
var parseArray = require('./helpers').parseArray;

exports.exec = function(cmd, options) {
  var d = Q.defer(), value;
  options = options || {};

  cp.exec(cmd, function(err, stderr, stdout) {
    if (err) {
      d.reject(err);
    } else {
      // TODO: More parse choice?
      //d.resolve(options.parse ? parseArray(stderr) : stderr);
      d.resolve(stdout);
    }
  });

  return d.promise;
};
