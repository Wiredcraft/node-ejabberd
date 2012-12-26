var fs = require('fs');
var cp = require('child_process');

var Q = require('q');

var logger = require('./helpers').logger;

exports.exec = function(cmd) {
  var d = Q.defer();

  cp.exec(cmd, function(err, stderr, stdout) {
    if (err) {
      d.reject(err);
    } else {
      d.resolve(stdout);
    }
  });

  return d.promise;
};

exports.exists = function(path) {
  var d = Q.defer();

  fs.exists(path, function(exists) {
    if (!exists) {
      d.reject(exists);
    } else {
      d.resolve(exists);
    }
  });

  return d.promise;
};

exports.mkdir = function(path) {
  var d = Q.defer();
  var mode = '0777';

  fs.mkdir(path, mode, function(err) {
    if (err) {
      d.reject(err);
    } else {
      d.resolve(path);
    }
  });

  return d.promise;
};

exports.rmdir = function(path) {
  var d = Q.defer();

  fs.rmdir(path, function(err) {
    if (err) {
      d.reject(err);
    } else {
      d.resolve(path);
    }  
  });

  return p.promise;
};

exports.readFile = function(path) {
  var d = Q.defer();
  var encoding = 'utf-8';

  fs.readFile(path, encoding, function(err, data) {
    if (err) {
      d.reject(err);
    } else {
      d.resolve(data);
    }  
  });

  return d.promise;
};

exports.writeFile = function(path, data) {
  var d = Q.defer();
  var encoding = 'utf-8';

  fs.writeFile(path, data, encoding, function(err) {
    if (err) {
      d.reject(err);
    } else {
      d.resolve(path);
    }   
  });

  return d.promise;
};
