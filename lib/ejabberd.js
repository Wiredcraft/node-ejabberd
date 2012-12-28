/*
 * ejabberd
 * https://github.com/kuno/ejabberd
 *
 * Copyright (c) 2012 wiredcraft
 * Licensed under the MIT license.
 */

// Default location of ejabberd.cfg
const EJABBERD_CFG_DIR = '/etc/ejabberd/';

var fs = require('fs');
var path = require('path');

var which = require('which');
var Q = require('q');
var _ = require('underscore');

var config = require('./config');
var control = require('./control');
var logger = require('./helpers').logger;
var ensureExt = require('./helpers').ensureExt;

var Ejabberd = function(cfgDir) {
  this.initialize.call(this, cfgDir);

  return this;
};

// Class
Ejabberd.prototype.initialize = function(cfgDir) {
  // Ensure there is a ejabberdctl executable
  if (process.env.EJABBERDCTL_BIN) {
    this.ctl = process.env.EJABBERDCTL_BIN;
  } else {
    this.ctl = which.sync('ejabberdctl');
  }

  // .
  fs.readFileSync(this.ctl);

  // FIXME: check existsness of config dir
  this.cfgDir = cfgDir || process.env.EJABBERD_CFG_DIR || EJABBERD_CFG_DIR;
  this.incDir = path.resolve(this.cfgDir, 'includes');

  // .
  var cfgFile = path.resolve(this.cfgDir, 'ejabberd.cfg');
  var markFile = path.resolve(this.incDir, 'mark.txt');
  var backupFile = path.resolve(this.cfgDir, 'ejabberd.cfg.backup');

  if (!fs.existsSync(this.incDir)) fs.mkdirSync(this.incDir);
  if (!fs.existsSync(backupFile)) fs.linkSync(cfgFile, backupFile);

  fs.writeFileSync(markFile, 'MARK', 'utf-8');

  return this;
};

Ejabberd.prototype.addHost = function(name, options) {
  var ejabberd = this;
  var hosts = [name];
  var f = path.resolve(ejabberd.incDir, ensureExt(name, 'cfg'));
  var configs = [f];

  return config.createHostConfig(ejabberd, name, cfg).then(function() {
    return config.updateHosts(ejabberd, hosts, configs);
  });
};

Ejabberd.prototype.removeHost = function(host, hosts, options) {
  // TODO: need implemented
};

Ejabberd.prototype.register = function(username, host, password) {
  // FIXME: saft check later
  return control.register(this.ctl, username, host, password);
};

Ejabberd.prototype.unregister = function(username, host, password) {
  // FIXME: saft check later
  return control.unregister(this.ctl, username, host);
};

Ejabberd.prototype.getUsers = function(host) {
  // FIXME: saft check later
  return control.registeredUsers(this.ctl, host);
};

Ejabberd.prototype.changePassword = function(username, newPass) {
  // FIXME: saft check later
  return control.changePassword(this.ctl, username, newPass);
};

Ejabberd.prototype.restart = function() {
  // FIXME: saft check later

  return control.restart(this.ctl);
};

// .
module.exports = Ejabberd;
