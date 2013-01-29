var cp = require('child_process');

var Q = require('q');
var _ = require('underscore');

var logger = require('./helpers').logger;
var parseArray = require('./helpers').parseArray;

var defaultOpts = { stdio: 'inherit' };

exports.exec = function(cmd, options) {
  var d = Q.defer(), value;
  options = _(defaultOpts).extend(options || {});

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

exports.spawn = function(cmd, args, options) {
  var d = Q.defer();
  options = _(defaultOpts).extend(options || {});

  var child = cp.spawn(cmd, args);

  child.stdout.on('data', function(data) {
  });

  child.stderr.on('data', function(data) {
  });

  child.on('exit', function(code) {
    if (code !== 0) {
      d.reject(new Error('Process exit with code: ' + code));
    } else {
      d.resolve(code);
    }
  });

  return d.promise;
};

exports.immediaSpawn = function(cmd, args, options) {
  var d = Q.defer();
  options = _(defaultOpts).extend(options || {});

  process.nextTick(function() {
    var child = cp.spawn(cmd, args);

    child.stdout.on('data', function(data) {
    });

    child.stderr.on('data', function(data) {
    });

    child.on('exit', function(code) {
      if (code !== 0) {
        d.reject(new Error('Process exit with code: ' + code));
      } else {
        d.resolve(code);
      }
    });
  });

  return d.promise;
};
