/*
 * ejabberd
 * https://github.com/kuno/ejabberd
 *
 * Copyright (c) 2012 wiredcraft
 * Licensed under the MIT license.
 */

// Default location of ejabberd.cfg
const EJABBERD_CFG_DIR = '/etc/ejabberd/';
const EJABBERD_PID_FILE = '/var/run/ejabberd/ejabberd.pid';
const EMPTY_DB = {hosts:[], configs:[]};

var fs = require('fs');
var path = require('path');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

var which = require('which');
var Q = require('q');
var _ = require('underscore');

var db = require('./db');
var config = require('./config');
var control = require('./control');
var logger = require('./helpers').logger;
var ensureExt = require('./helpers').ensureExt;

var Ejabberd = function(cfgDir) {
  var ejabberd = this;

  // Check status
  this.checker = setInterval(function() {
    ejabberd.ping().then(
      // Running
      function() {
      ejabberd.running = true;
      ejabberd.emit('running', true);
    },
    // Down
    function() {
      ejabberd.status = false;
      ejabberd.emit('running', false);
    });
  }, 500);

  return ejabberd.initialize.call(ejabberd, cfgDir);
};

// .
util.inherits(Ejabberd, EventEmitter);

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
  this.dbFile = path.resolve(this.cfgDir, 'database.json')

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

Ejabberd.prototype.ping = function() {
  // FIXME: saft check later
  return control.ping(this.ctl);

};

// .
Ejabberd.prototype.addVhost = function(host, vCfg) {
  var ejabberd = this;

  //if (!this.running) {
  //  return Q.fcall(function() { throw new Error('Ejabberd server is not running'); });
  //}

  var incFile = ensureExt(host, 'cfg');
  var include = path.resolve(ejabberd.incDir, incFile);

  ejabberd.db['hosts'].push(host);
  ejabberd.db['configs'].push(include);

  return config.updateVhostConfig(ejabberd, host, vCfg).then(function() {
    return config.updateConfig(ejabberd).then(function() {
      return control.restart(ejabberd.ctl);
    });
  });
};

Ejabberd.prototype.removeVhost = function(name, hosts, options) {
  if (!this.running) {
    return Q.fcall(function() { throw new Error('Ejabberd server is not running'); });
  }  
};

Ejabberd.prototype.register = function(username, host, password) {
  if (!this.running) {
    return Q.fcall(function() { throw new Error('Ejabberd server is not running'); });
  }

  return control.register(this.ctl, username, host, password);
};

Ejabberd.prototype.unregister = function(username, host, password) {
  if (!this.running) {
    return Q.fcall(function() { throw new Error('Ejabberd server is not running'); });
  }

  return control.unregister(this.ctl, username, host);
};

Ejabberd.prototype.getUsers = function(host) {
  if (!this.running) {
    return Q.fcall(function() { throw new Error('Ejabberd server is not running'); });
  }

  return control.registeredUsers(this.ctl, host);
};

Ejabberd.prototype.changeUserPassword = function(username, newPass) {
  if (!this.running) {
    return Q.fcall(function() { throw new Error('Ejabberd server is not running'); });
  }

  return control.changePassword(this.ctl, username, newPass);
};

Ejabberd.prototype.restart = function() {
  if (!this.running) {
    return Q.fcall(function() { throw new Error('Ejabberd server is not running'); });
  }

  return control.restart(this.ctl);
};

// .
module.exports = Ejabberd;
