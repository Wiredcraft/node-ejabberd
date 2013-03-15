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

    if (ejabberd.dist.script) {
      cmd = ejabberd.sudo ? 'sudo' : ejabberd.dist.script;
      args = ejabberd.sudo ? [ejabberd.dist.script, 'restart'] : ['restart'];

    } else {
      cmd = ejabberd.sudo ? 'sudo ' : ejabberd.clt;
      args = ejabberd.sudo ? [ejabberd.ctl, 'restart'] : ['restart'];
    }

    if (ejabberd.debug) logger.debug('Promise to run: ' + cmd + ' ' + args.join(' '));

    sleep(ejabberd.pauseTime);

    restart = child.spawn(cmd, args);

    wait = restart.then(function(code) {

      //sleep(ejabberd.stopTime);

      if (ejabberd.debug && ejabberd.running) {

        if (ejabberd.debug) logger.error(errMsg);

        d.reject(new Error(errMsg));

      } else {

        sleep(ejabberd.restartTime);

        d.resolve();

      }
    });

    return d.promise;
  },

  srgCreate: function(ejabberd, group, host, name, description, display) {
    var cmd = ejabberd.sudo ? 'sudo' : ejabberd.ctl;
    var args = ejabberd.sudo ? [ejabberd.ctl, 'srg_create', group, host, name, description, display] : ['srg_create', group, host, name, description, display];

    if (ejabberd.debug) logger.debug('Promise to run: ' + cmd + ' ' + args.join(' '));

    sleep(ejabberd.pauseTime);

    return child.spawn(cmd, args);
  },

  srgDelete: function(ejabberd, group, host) {
    var cmd = ejabberd.sudo ? 'sudo' : ejabberd.ctl;
    var args = ejabberd.sudo ? [ejabberd.ctl, 'srg_delete', group, host] : ['srg_delete', group, host];

    if (ejabberd.debug) logger.debug('Promise to run: ' + cmd + ' ' + args.join(' '));

    sleep(ejabberd.pauseTime);

    return child.spawn(cmd, args);
  },

  srgUserAdd: function(ejabberd, username, host, group, grouphost) {
    var cmd = ejabberd.sudo ? 'sudo' : ejabberd.ctl;
    var args = ejabberd.sudo ? [ejabberd.ctl, 'srg_user_add', username, host, group, grouphost] : ['srg_user_add', user, host, group, grouphost];

    if (ejabberd.debug) logger.debug('Promise to run: ' + cmd + ' ' + args.join(' '));

    sleep(ejabberd.pauseTime);

    return child.spawn(cmd, args);

  },

  srgUserDel: function(ejabberd, username, host, group, grouphost) {
    var cmd = ejabberd.sudo ? 'sudo' : ejabberd.ctl;
    var args = ejabberd.sudo ? [ejabberd.ctl, 'srg_user_del', username, host, group, grouphost] : ['srg_user_del', user, host, group, grouphost];

    if (ejabberd.debug) logger.debug('Promise to run: ' + cmd + ' ' + args.join(' '));

    sleep(ejabberd.pauseTime);

    return child.spawn(cmd, args);
  }
};
