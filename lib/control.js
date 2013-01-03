var child = require('./child');

var logger = require('./helpers').logger;

module.exports = {
  ping: function(ctl) {
    var cmd = ctl + ' status';

    logger.debug('Promise to run: ' + cmd);

    return child.exec(cmd);
  },

  loadConfig: function(ctl, config) {
    var cmd = ctl + ' load_config ' + config;

    logger.debug('Promise to run: ' + cmd);

    return child.exec(cmd);
  },

  register: function(ctl, username, host, password) {
    var cmd = ctl + ' register ' + username + ' ' + host + ' ' + password;

    logger.debug('Promise to run: ' + cmd);

    return child.exec(cmd);
  },

  unregister: function(ctl, username, host) {
    var cmd = ctl + ' unregister ' + username + ' ' + host;

    logger.debug('Promise to run: ' + cmd);

    return child.exec(cmd);
  },

  changePassword: function(ctl, username,  host, newPass) {
    var cmd = ctl + ' change_password ' + username + ' ' + host + ' ' + newPass;

    logger.debug('Promise to run: ' + cmd);

    return child.exec(cmd);
  },

  registeredUsers: function(ctl, host) {
    var options = {parse: 'array'};
    var cmd = ctl + ' registered_users ' + host;

    logger.debug('Promise to run: ' + cmd);

    return child.exec(cmd, options);
  },

  restart: function(ctl) {
    //var cmd = ctl + ' restart';
    var cmd = 'service ejabberd restart';

    logger.debug('Promise to run: ' + cmd);

    return child.exec(cmd);
  },
};
