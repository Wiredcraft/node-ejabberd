var promise = require('./command').promise;

module.exports = {
  _loadConfig: function(ctl, config) {
    var cmd = ctl + ' load_config ' + config;

    return promise(cmd);
  },

  _register: function(ctl, username, host, password) {
    var cmd = ctl + ' register ' + username + ' ' + host + ' ' + password;

    return promise(cmd);
  },

  _unregister: function(ctl, username, host) {
    var cmd = ctl + ' unregister ' + username + ' ' + host;

    return promise(cmd);
  },

  _changePassword: function(ctl, username,  host, newPass) {
    var cmd = ctl + ' change_password ' + user + ' ' + host + ' ' + newPass;

    return promise(cmd);
  },

}
