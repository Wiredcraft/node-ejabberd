var fs = require('fs');
var path = require('path');
var ejs = require('ejs');

var promise = require('./promise');
var logger = require('./helpers').logger;

// Cache templates
var templDir = path.resolve(__dirname, '../templates');
var hostsTemplFile = path.resolve(templDir, 'hosts.cfg.ejs');
var hostsTempl = fs.readFileSync(hostsTemplFile, 'utf-8');
var hostConfigTemplFile = path.resolve(templDir, 'host_config.cfg.ejs');
var hostConfigTempl = fs.readFileSync(hostConfigTemplFile, 'utf-8');

module.exports = {
  backupConfig: function(ejabberd) {

  },

  createHostConfig: function(ejabberd, name, config) {
    var dir = path.resolve(ejabberd.cfgDir, name);

    return promise.mkdir(dir).then(function(dir) {
      var file = path.resolve(dir, 'host.cfg');
      var data = ejs.render(hostConfigTempl, config);

      return promise.writeFile(file, data);
    });
  },

  removeHostConfig: function(ejabberd, name) {
    var dir = path.resolve(ejabberd.cfgDir, name);

    return promise.rmdir(dir);
  },

  updateHosts: function(ejabberd, hosts) {
    var file = path.resolve(ejabberd.cfgDir, 'hosts.cfg');
    var data = ejs.render(hostsTemplFile, {hosts: hosts});

    return promise.writeFile(file, data);
  },

  includeHost: function(ejabberd, host) {
  },

  excludeHost: function(ejabberd, host) {
  }

};
