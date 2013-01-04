/*
 * ejabberd
 * https://github.com/kuno/ejabberd
 *
 * Copyright (c) 2012 wiredcraft
 * Licensed under the MIT license.
 */

// Defaults
const CHECKER_INTERVAL = 500; // ms
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
var server = require('./server');
var config = require('./config');
var control = require('./control');

var logger = require('./helpers').logger;
var ensureExt = require('./helpers').ensureExt;

// Ejabberd class
var Ejabberd = function(cfgDir, options) {
  options = options || {};

  return this.initialize(cfgDir, options);
};

// Make Ejabberd instance a event emitter
util.inherits(Ejabberd, EventEmitter);

// .
Ejabberd.prototype.initialize = function(cfgDir, options) {
  var ejabberd = this;

  // Ensure there is a ejabberdctl executable
  if (process.env.EJABBERDCTL_BIN) {
    ejabberd.ctl = process.env.EJABBERDCTL_BIN;
  } else {
    ejabberd.ctl = which.sync('ejabberdctl');
  }

  // .
  fs.readFileSync(this.ctl);

  // FIXME: check existsness of config dir
  ejabberd.cfgDir = cfgDir || process.env.EJABBERD_CFG_DIR || EJABBERD_CFG_DIR;
  ejabberd.incDir = path.resolve(ejabberd.cfgDir, 'includes');
  ejabberd.dbFile = path.resolve(ejabberd.cfgDir, 'database.json')

  // .
  var markFile = path.resolve(ejabberd.incDir, 'mark.txt');
  var cfgFile = path.resolve(ejabberd.cfgDir, 'ejabberd.cfg');
  var backupFile = path.resolve(ejabberd.cfgDir, 'ejabberd.cfg.backup');

  if (!fs.existsSync(ejabberd.incDir)) fs.mkdirSync(ejabberd.incDir);
  if (!fs.existsSync(backupFile)) fs.linkSync(cfgFile, backupFile);

  // .
  if (!fs.existsSync(ejabberd.dbFile)) {
    fs.writeFileSync(ejabberd.dbFile, JSON.stringify(EMPTY_DB), 'utf-8');
    ejabberd.db = EMPTY_DB;
  } else {
    ejabberd.db = require(ejabberd.dbFile);
  };

  fs.writeFileSync(markFile, 'MARK', 'utf-8');

  // Check status
  ejabberd.checker = setInterval(function() {
    ejabberd.ping().then(
      // Running
      function() {
      ejabberd.running = true;
      logger.info('Ejabber is running.');
      ejabberd.emit('running', true);
    },
    // Down
    function() {
      ejabberd.running = false;
      logger.error('Ejabberd is down.');
      ejabberd.emit('running', false);
    });
  }, options.checkerInterval || CHECKER_INTERVAL);

  return ejabberd;
};

Ejabberd.prototype.ping = function() {
  return control.status(this);
};

// .
Ejabberd.prototype.addVhost = function(host, vCfg) {
  var ejabberd = this;

  if (!ejabberd.running) {
    throw new Error('Ejabberd server is not running');
  }

  if (ejabberd.db['hosts'].indexOf(host) > -1) {
    throw new Error('Host ' + host + ' is already existing');
  }

  var incFile = ensureExt(host, 'cfg');
  var incPath = path.resolve(ejabberd.incDir, incFile);

  ejabberd.db['hosts'].push(host);
  ejabberd.db['configs'].push(incPath);

  config.updateVhostConfig(ejabberd, host, vCfg).then(function() {
    config.updateConfig(ejabberd).then(function() {
      // Save
      db.save(ejabberd);

      return control.restart(ejabberd).then(function() {
        if (ejabberd.running) {
          throw new Error('Ejabberd server seems not down properly');
        }
      });
    });
  });
};

Ejabberd.prototype.removeVhost = function(host, options) {
  var ejabberd = this;

  if (!ejabberd.running) {
    throw new Error('Ejabberd server is not running');
  }

  if (ejabberd.db['hosts'].indexOf(host) === -1) {
    throw new Error('Host ' + host + ' is not existing');
  }

  var incFile = ensureExt(host, 'cfg');
  var incPath = path.resolve(ejabberd.incDir, incFile);

  ejabberd.db['hosts'] = ejabberd.db['hosts'].splice(host);
  ejabberd.db['configs'] = ejabberd.db['configs'].splice(incPath);

  return config.removeVhostConfig(ejabberd, host).then(function() {
    return config.updateConfig(ejabberd).then(function() {
      // Save
      db.save(ejabberd);

      return control.restart(ejabberd);
    });
  });
};

Ejabberd.prototype.register = function(username, host, password) {
  var ejabberd = this;

  if (!ejabberd.running) {
    throw new Error('Ejabberd server is not running');
  }

  return control.register(ejabberd, username, host, password);
};

Ejabberd.prototype.unregister = function(username, host, password) {
  var ejabberd = this;

  if (!ejabberd.running) {
    throw new Error('Ejabberd server is not running');
  }

  return control.unregister(ejabberd, username, host);
};

Ejabberd.prototype.changeUserPassword = function(username, newPass) {
  var ejabberd = this;

  if (!ejabberd.running) {
    throw new Error('Ejabberd server is not running');
  }

  return control.changePassword(ejabberd, username, newPass);
};

Ejabberd.prototype.restart = function() {
  var ejabberd = this;

  if (!ejabberd.running) {
    throw new Error('Ejabberd server is not running');
  }

  return control.restart(ejabberd);
};

// .
module.exports = Ejabberd;
