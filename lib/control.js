var promise = require('./promise');
var logger = require('./helpers').logger;

module.exports = {
  echo: function(ctl) {
    var cmd = ctl;

    return promise.exec(ctl);
  },

  loadConfig: function(ctl, config) {
    var cmd = ctl + ' load_config ' + config;

    return promise.exec(cmd);
  },

  register: function(ctl, username, host, password) {
    var cmd = ctl + ' register ' + username + ' ' + host + ' ' + password;

    return promise.exec(cmd);
  },

  unregister: function(ctl, username, host) {
    var cmd = ctl + ' unregister ' + username + ' ' + host;

    return promise.exec(cmd);
  },

  changePassword: function(ctl, username,  host, newPass) {
    var cmd = ctl + ' change_password ' + user + ' ' + host + ' ' + newPass;

    logger.debug('Promise to run: ' + cmd);

    return promise.exec(cmd);
  },

  restart: function(ctl) {
    var cmd = ctl + ' restart';

    return promise.exec(cmd);
  }

};
