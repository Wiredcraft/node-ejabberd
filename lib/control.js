var promise = require('./command').promise;

module.exports = {
  loadConfig: function(exec, config) {
    var cmd = exec + ' load_config ' + config;

    return promise(cmd);
  },

  register: function(exec, username, host, password) {
    var cmd = exec + ' register ' + username + ' ' + host + ' ' + password;

    return promise(cmd);
  },

  unregister: function(exec, username, host) {
    var cmd = exec + ' unregister ' + username + ' ' + host;

    return promise(cmd);
  },

  changePassword: function(exec, username,  host, newPass) {
    var cmd = exec + ' change_password ' + user + ' ' + host + ' ' + newPass;

    return promise(cmd);
  },

}
