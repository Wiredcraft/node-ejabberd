var child = require('./child');

var sleep = require('./helpers').sleep;
var logger = require('./helpers').logger;

module.exports = {
  status: function(ejabberd) {
    var cmd = ejabberd.ctl + ' status';
    var args = ['status'];

    if (ejabberd.debug) logger.debug('Promise to run: ' + cmd);

    return child.spawn(ejabberd.ctl, args);
  },

  loadConfig: function(ejabberd, config) {
    var cmd = ejabberd.ctl + ' load_config ' + config;
    var args = ['load_config', config]

    if (ejabberd.debug) logger.debug('Promise to run: ' + cmd);

    return child.spawn(ejabberd.ctl, args);
  },

  register: function(ejabberd, username, host, password) {
    var cmd = ejabberd.ctl + ' register ' + username + ' ' + host + ' ' + password;
    var args = ['register', username, host, password];

    if (ejabberd.debug) logger.debug('Promise to run: ' + cmd);

    return child.spawn(ejabberd.ctl, args);
  },

  unregister: function(ejabberd, username, host) {
    var cmd = ejabberd.ctl + ' unregister ' + username + ' ' + host;
    var args = ['unregister', username, host];

    if (ejabberd.debug) logger.debug('Promise to run: ' + cmd);

    return child.spawn(ejabberd.ctl, args);
  },

  changePassword: function(ejabberd, username,  host, newPass) {
    var cmd = ejabberd.ctl + ' change_password ' + username + ' ' + host + ' ' + newPass;
    var args = ['change_password', username, host, newPass];

    if (ejabberd.debug) logger.debug('Promise to run: ' + cmd);

    return child.spawn(ejabberd.ctl, args);
  },

  registeredUsers: function(ejabberd, host) {
    var options = {parse: 'array'};
    var cmd = ejabberd.ctl + ' registered_users ' + host;
    var args = ['registered_users', host];

    if (ejabberd.debug) logger.debug('Promise to run: ' + cmd);

    return child.spawn(cmd, args, options);
  },

  restart: function(ejabberd) {
    var restart, wait, promise;
    var errMsg = 'Ejabberd seems not shutdown properly';
    var cmd = ejabberd.dist.script ? ejabberd.dist.script + ' restart' : ejabberd.dist.restart;

    if (ejabberd.debug) logger.debug('Promise to run: ' + cmd);

    if (ejabberd.script) {
       restart = child.spawn(ejabberd.dist.script, ['restart']);
    } else {
       restart = child.exec(ejabberd.dist.restart);
    }

    wait = restart.then(function(code) {

       //sleep(ejabberd.stopTime);

       if (ejabberd.running) {

         if (ejabberd.debug) logger.error(errMsg);

         throw new Error(errMsg);

       } else {

        //sleep(ejabberd.restartTime);

        return ejabberd;

      }
    }).fail(function(err) {
      throw err;
    });

    promise = wait;

    return promise;
  },
};
