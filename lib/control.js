var child = require('./child');

var sleep = require('./helpers').sleep;
var logger = require('./helpers').logger;

module.exports = {
  status: function(ejabberd) {
    var cmd = ejabberd.ctl + ' status';

    if (ejabberd.debug) logger.debug('Promise to run: ' + cmd);

    return child.exec(cmd);
  },

  loadConfig: function(ejabberd, config) {
    var cmd = ejabberd.ctl + ' load_config ' + config;

    if (ejabberd.debug) logger.debug('Promise to run: ' + cmd);

    return child.exec(cmd);
  },

  register: function(ejabberd, username, host, password) {
    var cmd = ejabberd.ctl + ' register ' + username + ' ' + host + ' ' + password;

    if (ejabberd.debug) logger.debug('Promise to run: ' + cmd);

    return child.exec(cmd);
  },

  unregister: function(ejabberd, username, host) {
    var cmd = ejabberd.ctl + ' unregister ' + username + ' ' + host;

    if (ejabberd.debug) logger.debug('Promise to run: ' + cmd);

    return child.exec(cmd);
  },

  changePassword: function(ejabberd, username,  host, newPass) {
    var cmd = ejabberd.ctl + ' change_password ' + username + ' ' + host + ' ' + newPass;

    if (ejabberd.debug) logger.debug('Promise to run: ' + cmd);

    return child.exec(cmd);
  },

  registeredUsers: function(ejabberd, host) {
    var options = {parse: 'array'};
    var cmd = ejabberd.ctl + ' registered_users ' + host;

    if (ejabberd.debug) logger.debug('Promise to run: ' + cmd);

    return child.exec(cmd, options);
  },

  restart: function(ejabberd) {
    var promise;
    var errMsg = 'Ejabberd seems not shutdown properly';

    if (ejabberd.debug) logger.debug('Promise to run: ' + cmd);

    var restart = child.exec(ejabberd.dist.restart);

    var wait = restart.then(function(stdout) {
      
      sleep(ejabberd.stopTime);

      if (ejabberd.running) {

        if (ejabberd.debug) logger.error(errMsg);

        throw new Error(errMsg);

      } else {

        sleep(ejabberd.restartTime);

        return ejabberd;
      }
    });

    promise = wait;

    return promise;
  },
};
