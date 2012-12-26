var promise = require('./promise');
var logger = require('./helpers').logger;

module.exports = {
  echo: function(ctl) {
    var cmd = ctl + ' help';

    logger.info('Promise to run: ' + cmd);

    return promise.exec(ctl);
  },

  loadConfig: function(ctl, config) {
    var cmd = ctl + ' load_config ' + config;

    logger.info('Promise to run: ' + cmd);

    return promise.exec(cmd);
  },

  register: function(ctl, username, host, password) {
    var cmd = ctl + ' register ' + username + ' ' + host + ' ' + password;

    logger.info('Promise to run: ' + cmd);

    return promise.exec(cmd);
  },

  unregister: function(ctl, username, host) {
    var cmd = ctl + ' unregister ' + username + ' ' + host;

    logger.info('Promise to run: ' + cmd);

    return promise.exec(cmd);
  },

  changePassword: function(ctl, username,  host, newPass) {
    var cmd = ctl + ' change_password ' + username + ' ' + host + ' ' + newPass;

    logger.info('Promise to run: ' + cmd);

    return promise.exec(cmd);
  },

  registeredUsers: function(ctl, host) {
    var options = {parse: 'array'};
    var cmd = ctl + ' registered_users ' + host;

    logger.info('Promise to run: ' + cmd);

    return promise.exec(cmd, options);
  },

  restart: function(ctl) {
    var cmd = ctl + ' restart';

    logger.info('Promise to run: ' + cmd);

    return promise.exec(cmd);
  },

  reload: function(ctl) {
    // TODO: need implemented
  }

};
