/*
 * ejabberd
 * https://github.com/kuno/ejabberd
 *
 * Copyright (c) 2012 wiredcraft
 * Licensed under the MIT license.
 */

// Default location of ejabberd.cfg
const EJABBERD_CFG_DIR = '/etc/ejabberd/';
const EMPTY_DB = {hosts:[], includedConfigs:[]};

var fs = require('fs');
var path = require('path');

var which = require('which');
var Q = require('q');
var _ = require('underscore');

var db = require('./db');
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
  this.dbFile = path.resolve(this.cfgDir, 'database.json');
  // .
  var markFile = path.resolve(this.incDir, 'mark.txt');
  var cfgFile = path.resolve(this.cfgDir, 'ejabberd.cfg');
  var backupFile = path.resolve(this.cfgDir, 'ejabberd.cfg.backup');

  if (!fs.existsSync(this.incDir)) fs.mkdirSync(this.incDir);
  if (!fs.existsSync(backupFile)) fs.linkSync(cfgFile, backupFile);

  // .
  if (!fs.existsSync(this.dbFile)) {
    fs.writeFileSync(this.dbFile, JSON.stringify(EMPTY_DB), 'utf-8');
    this.db = EMPTY_DB;
  } else {
    this.db = require(this.dbFile);
  };

  fs.writeFileSync(markFile, 'MARK', 'utf-8');

  return this;
};

Ejabberd.prototype.addVhost = function(host, config) {
  config = config || {};
  config.host = config.host || host;

  var ejabberd = this;
  var file = path.resolve(ejabberd.incDir, ensureExt(host, 'cfg'));

  // .
  ejabberd.db['hosts'].push(host);
  ejabberd.db['includeDConfig'].push(file);

  return config.updateVhostConfig(ejabberd, host, config).then(function() {
    return config.updateConfig(ejabberd, hosts, configs).then(function() {
      // .
      db.save(ejabberd);

      return control.restart(ejabberd.ctl);
    });
  });
};

Ejabberd.prototype.removeVhost = function(name, hosts, options) {
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

Ejabberd.prototype.changeUserPassword = function(username, newPass) {
  // FIXME: saft check later
  return control.changePassword(this.ctl, username, newPass);
};

Ejabberd.prototype.restart = function() {
  // FIXME: saft check later

  return control.restart(this.ctl);
};

// .
module.exports = Ejabberd;
