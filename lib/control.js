var Q = require('q');

var child = require('./child');

var sleep = require('./helpers').sleep;
var logger = require('./helpers').logger;

module.exports = {
  status: function(ejabberd) {
    var cmd = ejabberd.sudo ? 'sudo' : ejabberd.ctl;
    var args = ejabberd.sudo ? [ejabberd.ctl, 'status'] : ['status'];

    if (ejabberd.debug) logger.debug('Promise to run: ' + cmd + ' ' + args.join(' '));

    return child.spawn(cmd, args);
  },

  loadConfig: function(ejabberd, config) {
    var cmd = ejabberd.sudo ? 'sudo' : ejabberd.ctl;
    var args = ejabberd.sudo ? [ejabberd.ctl, 'load_config', config] : ['load_config', config];

    if (ejabberd.debug) logger.debug('Promise to run: ' + cmd + ' ' + args.join(' '));

    sleep(ejabberd.pauseTime);

    return child.spawn(cmd, args);
  },

  register: function(ejabberd, username, host, password) {
    var cmd = ejabberd.sudo ? 'sudo' : ejabberd.ctl;
    var args = ejabberd.sudo ? [ejabberd.ctl, 'register', username, host, password] : [ 'register', username, host, password];

    if (ejabberd.debug) logger.debug('Promise to run: ' + cmd + ' ' + args.join(' '));

    sleep(ejabberd.pauseTime);

    return child.spawn(cmd, args);
  },

  unregister: function(ejabberd, username, host) {
    var cmd = ejabberd.sudo ? 'sudo' : ejabberd.ctl;
    var args = ejabberd.sudo ? [ejabberd.ctl, 'unregister', username, host] : ['unregister', username, host];

    if (ejabberd.debug) logger.debug('Promise to run: ' + cmd + ' ' + args.join(' '));

    sleep(ejabberd.pauseTime);

    return child.spawn(cmd, args);
  },

  changePassword: function(ejabberd, username,  host, newPass) {
    var cmd = ejabberd.sudo ? 'sudo' : ejabberd.ctl;
    var args = ejabberd.sudo ? [ejabberd.ctl, 'change_password', username, host, newPass] : ['change_password', username, host, newPass];

    if (ejabberd.debug) logger.debug('Promise to run: ' + cmd + ' ' + args.join(' '));

    sleep(ejabberd.pauseTime);

    return child.spawn(cmd, args);
  },

  registeredUsers: function(ejabberd, host) {
    var options = {parse: 'array'};
    var cmd = ejabberd.sudo ? 'sudo' : ejabberd.ctl;
    var args = ejabberd.sudo ? [ejabberd.ctl,'registered_users', host] : ['registered_users', host];

    if (ejabberd.debug) logger.debug('Promise to run: ' + cmd + ' ' + args.join(' '));

    sleep(ejabberd.pauseTime);

    return child.spawn(cmd, args, options);
  },

  restart: function(ejabberd) {
    var d = Q.defer();
    var cmd, args, restart, wait;
    var errMsg = 'Ejabberd seems not shutdown properly';

    if (ejabberd.debug) logger.debug('Promise to run: ' + cmd);

    if (ejabberd.script) {
      cmd = ejabberd.sudo ? 'sudo' : ejabberd.dist.script;
      args = ejabberd.sudo ? [ejabberd.dist.script, 'restart'] : ['restart'];

      if (ejabberd.debug) logger.debug('Promise to run: ' + cmd + ' ' + args.join(' '));

      restart = child.spawn(cmd, args);
    } else {
      cmd = ejabberd.sudo ? 'sudo ' + ejabberd.dist.restart : ejabberd.dist.restart;

      if (ejabberd.debug) logger.debug('Promise to run: ' + cmd);

      restart = child.exec(cmd);
    }

    wait = restart.then(function(code) {

      //sleep(ejabberd.stopTime);

      if (ejabberd.running) {

        if (ejabberd.debug) logger.error(errMsg);

        d.reject(new Error(errMsg));

      } else {

        sleep(ejabberd.restartTime);

        d.resolve();

      }
    });

    return d.promise;
  },
};
