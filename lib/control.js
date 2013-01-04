var child = require('./child');

var logger = require('./helpers').logger;

module.exports = {
  status: function(ejabberd) {
    var cmd = ejabberd.ctl + ' status';

    logger.debug('Promise to run: ' + cmd);

    return child.exec(cmd);
  },

  loadConfig: function(ejabberd, config) {
    var cmd = ejabberd.ctl + ' load_config ' + config;

    logger.debug('Promise to run: ' + cmd);

    return child.exec(cmd);
  },

  register: function(ejabberd, username, host, password) {
    var cmd = ejabberd.ctl + ' register ' + username + ' ' + host + ' ' + password;

    logger.debug('Promise to run: ' + cmd);

    return child.exec(cmd);
  },

  unregister: function(ejabberd, username, host) {
    var cmd = ejabberd.ctl + ' unregister ' + username + ' ' + host;

    logger.debug('Promise to run: ' + cmd);

    return child.exec(cmd);
  },

  changePassword: function(ejabberd, username,  host, newPass) {
    var cmd = ejabberd.ctl + ' change_password ' + username + ' ' + host + ' ' + newPass;

    logger.debug('Promise to run: ' + cmd);

    return child.exec(cmd);
  },

  registeredUsers: function(ejabberd, host) {
    var options = {parse: 'array'};
    var cmd = ejabberd.ctl + ' registered_users ' + host;

    logger.debug('Promise to run: ' + cmd);

    return child.exec(cmd, options);
  },

  restart: function(ejabberd) {
    //var cmd = ejabberd.ctl + ' restart';
    var cmd = '/etc/init.d/ejabberd restart';
    var promise;

    logger.debug('Promise to run: ' + cmd);

    var restart = child.exec(cmd);

    var wait = restart.then(function(stdout) {
      var start = Date.now();

      while (Date.now() - start < 1000) {};

      if (ejabberd.running) {

        var msg = 'Ejabberd seems not shutdown properly';
        console.error(msg);
        throw new Error(msg);

      } else {

        while (Date.now() - start < ejabberd.restartWait) {};

        return ejabberd;
      }
    });

    // [shutdown, wait].forEach(function(f) {
    //   promise = promise.then(f);
    // });
    //

    promise = wait.done();

    return promise;
  },
};
