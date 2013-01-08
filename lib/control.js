var child = require('./child');

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
    //var cmd = ejabberd.ctl + ' restart';
    var cmd = '/etc/init.d/ejabberd restart';
    var promise;

    if (ejabberd.debug) logger.debug('Promise to run: ' + cmd);

    var restart = child.exec(cmd);

    // .
    ejabberd.emit('down');

    var wait = restart.then(function(stdout) {
      var start = Date.now();

      while (Date.now() - start < 1000) {};

      if (ejabberd.running) {

        var msg = 'Ejabberd seems not shutdown properly';

        console.error(msg);

        throw new Error(msg);

      } else {

        while (Date.now() - start < ejabberd.restartWait) {};

        // .
        ejabberd.emit('up');

        return ejabberd;
      }
    });

    promise = wait;

    return promise;
  },
};
