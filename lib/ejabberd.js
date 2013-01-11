/*
 * ejabberd
 * https://github.com/kuno/ejabberd
 *
 * Copyright (c) 2012 wiredcraft
 * Licensed under the MIT license.
 */

// Defaults
const DEBUG = process.env.NODE_ENV !== 'production' ? true : false;
const STOP_TIME = 2000 * 1; // ms
const RESTART_TIME = 1000 * 10; // ms
const CHECKER_INTERVAL = 500; // ms
const EMPTY_DB = {hosts:[], configs:[]};
const ADAPTERS = require('../adapters');

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
var sortArgs = require('./helpers').sortArgs;
var ensureExt = require('./helpers').ensureExt;

// Ejabberd class
var Ejabberd = function(dist, options) {
  options = options || {};

  if (!dist) {
    throw new Error('Arguments Error: You need to specify the os distribution, e.g ubuntu/osx ...');
  }

  var distKey = options.distOpt ? dist + ':' + options.distOpt : dist + ':all';

  if (!ADAPTERS[distKey]) {
    throw new Error('Key Error: The distKey ' + distKey + ' not found in existing adapters');
  } else {
    this.dist = ADAPTERS[distKey];
  }

  return this.initialize(options);
};

// Make Ejabberd instance a event emitter
util.inherits(Ejabberd, EventEmitter);

// .
Ejabberd.prototype.initialize = function(options) {
  var ejabberd = this;

  ejabberd.ctl = ejabberd.dist.ctl || which.sync('ejabberdctl');
  fs.readFileSync(ejabberd.ctl);

  // FIXME: check existsness of config dir
  ejabberd.cfgDir = ejabberd.dist.cfgDir;
  ejabberd.incDir = path.resolve(ejabberd.cfgDir, 'includes');
  ejabberd.dbFile = path.resolve(ejabberd.cfgDir, 'database.json');
  ejabberd.stopTime = options.stopTime || STOP_TIME;
  ejabberd.restartTime = options.restartTime || RESTART_TIME;
  ejabberd.debug = options.debug || DEBUG;

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

      if (ejabberd.debug) logger.info('Ejabber is running.');

      ejabberd.emit('status', { running: true} );
    },
    // Down
    function() {
      ejabberd.running = false;

      if (ejabberd.debug) logger.warn('Ejabberd is down.');

      ejabberd.emit('status', { running: false });
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
  var promise, errMsg;

  if (!(host && vCfg)) {
    if (!host) {
      errMsg = 'missing host';
    } else {
      errMsg = 'missing vCfg';
    }

    return Q.fcall(function() { throw new Error('Arguments error: ' + errMsg); });
  }

  if (!ejabberd.running) {
    return Q.fcall(function() { throw new Error('Ejabberd server is not running'); });
  }

  var incFile = ensureExt(host, 'cfg');
  var incPath = path.resolve(ejabberd.incDir, incFile);

  // .
  ejabberd.db['hosts'].push(host);
  ejabberd.db['configs'].push(incPath);

  // .
  ejabberd.db['hosts'] = _(ejabberd.db['hosts']).uniq();
  ejabberd.db['configs'] = _(ejabberd.db['configs']).uniq();

  var promise = config.updateVhostConfig(ejabberd, host, vCfg);
  var updateConfig = function() {
    return config.updateConfig(ejabberd);
  };
  var restart = function() {
    // Save
    db.save(ejabberd);

    return control.restart(ejabberd);
  };

  // .
  [updateConfig, restart].forEach(function(f) {
    promise = promise.then(f);
  });

  return promise;
};

Ejabberd.prototype.removeVhost = function(host, options) {
  var ejabberd = this;
  var promise, errMsg;

  if (!host) {
    errMsg = 'Arguments error: missing host';

    return Q.fcall(function() { throw new Error(errMsg); });
  }

  if (!ejabberd.running) {
    return Q.fcall(function() { throw new Error('Ejabberd server is not running'); });
  } 

  if (ejabberd.db['hosts'].indexOf(host) === -1) {
    return Q.fcall(function() { throw new Error('Host ' + host + ' is not existing'); });
  }

  var incFile = ensureExt(host, 'cfg');
  var incPath = path.resolve(ejabberd.incDir, incFile);

  ejabberd.db['hosts'] = _(ejabberd.db['hosts']).reject(function(h) { return h === host });
  ejabberd.db['configs'] = _(ejabberd.db['configs']).reject(function(p) { return p === incPath });

  var promise = config.removeVhostConfig(ejabberd, host);
  var updateConfig = function() {
    return config.updateConfig(ejabberd);
  };
  var restart = function() {
    // Save
    db.save(ejabberd);

    return control.restart(ejabberd);
  };

  // .
  [updateConfig, restart].forEach(function(f) {
    promise = promise.then(f);
  });

  return promise;    
};

Ejabberd.prototype.register = function(username, host, password) {
  var ejabberd = this;
  var errMsg;

  if (!(username && host && password)) {
    if (!username) {
      errMsg = 'missing username';
    } else if (!host) {
      errMsg = 'missing host';
    } else {
      errMsg = 'missing password'
    }

    return Q.fcall(function() { throw new Error('Arguments error: ' + errMsg); });
  }

  if (!ejabberd.running) {
    return Q.fcall(function() { throw new Error('Ejabberd server is not running'); });
  } 

  return control.register(ejabberd, username, host, password);
};

Ejabberd.prototype.unregister = function(username, host) {
  var ejabberd = this;
  var errMsg;

  if (!(username && host)) {
    if (!username) {
      errMsg = 'missing username';
    } else {
      errMsg = 'missing host';
    }

    return Q.fcall(function() { throw new Error('Arguments error: ' + errMsg); });
  }

  if (!ejabberd.running) {
    return Q.fcall(function() { throw new Error('Ejabberd server is not running'); });
  }

  return control.unregister(ejabberd, username, host);
};

Ejabberd.prototype.changePassword = function(username, host, newPass) {
  var ejabberd = this;
  var errMsg;

  if (!(username && host && newPass)) {
    if (!username) {
      errMsg = 'missing username';
    } else if (!host) {
      errMsg = 'missing host';
    } else {
      errMsg = 'missing new pasword'
    }

    return Q.fcall(function() { throw new Error('Arguments error: ' + errMsg); });
  }

  if (!ejabberd.running) {
    return Q.fcall(function() { throw new Error('Ejabberd server is not running'); });
  }

  return control.changePassword(ejabberd, username, host, newPass);
};

Ejabberd.prototype.restart = function() {
  var ejabberd = this;

  if (!ejabberd.running) {
    return Q.fcall(function() { throw new Error('Ejabberd server is not running'); });
  }

  return control.restart(ejabberd);
};

// .
module.exports = Ejabberd;
