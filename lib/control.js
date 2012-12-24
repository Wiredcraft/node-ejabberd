var Q = require('q');
var cp = require('child_process');

module.exports = {
  _loadConfig: function(ctl, config) {
    var d = Q.defer();
    var cmd = ctl + ' load_config ' + config;

    cp.exec(cmd, function(err, stderr, stdout) {
      if (err) {
        d.reject(err);
      } else {
        d.resolve(stdout);
      }
    });

    return d.promise;
  },

  _register: function(ctl, username, host, password) {
    var d = Q.defer();
    var cmd = ctl + ' register ' + username + ' ' + host + ' ' + password;

    cp.exec(cmd, function(err, stderr, stdout) {
      if (err) {
        d.reject(err);
      } else {
        d.resolve(stdout);
      }
    });

    return d.promise;
  },

  _unregister: function(ctl, username, host) {
    var d = Q.defer();
    var cmd = ctl + ' unregister ' + username + ' ' + host;

    cp.exec(cmd, function(err, stderr, stdout) {
      if (err) {
        d.reject(err);
      } else {
        d.resolve(stdout);
      }
    });

    return d.promise;  
  }
}
