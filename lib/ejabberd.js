/*
 * ejabberd
 * https://github.com/Wiredcraft/ejabberd
 *
 * Copyright (c) 2012 wiredcraft
 * Licensed under the MIT license.
 */

var fs = require('fs');
var path = require('path');
var util = require('util');
var EventEmitter = require('events').EventEmitter;

// Defaults
const STOP_TIME = 1000 * 3; // ms
const PAUSE_TIME = 1000 * 0.5; // ms
const RESTART_TIME = 1000 * 8; // ms
const CHECKER_INTERVAL = 500; // ms
const EMPTY_DB = {hosts:[], configs:[]};
const ADAPTERS = require('../adapters');
const DEBUG = process.env.NODE_ENV === 'development' ? true : false;
const PACKAGE = require('../package.json');
const TEMPL_DIR = path.resolve(__dirname, '../templates');

var which = require('which');
var ejs = require('ejs');
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
  dist = dist || process.env.EJABBERD_DIST;

  if (!dist) {
    throw new Error('Arguments Error: You need to specify the os distribution, e.g ubuntu/osx ...');
  }

  if (!ADAPTERS[dist] && !options.dist) {
    throw new Error('Key Error: The dist name ' + dist+ ' not found in existing adapters');
  } else {
    this.dist = ADAPTERS[dist] || options.dist;
  }

  // .
  this.version = PACKAGE.version;

  return this.initialize(dist, options);
};

// Make Ejabberd instance a event emitter
util.inherits(Ejabberd, EventEmitter);

// .
Ejabberd.prototype.initialize = function(dist, options) {
  var ejabberd = this;
  var cfgTemplFile = path.resolve(TEMPL_DIR, dist, 'ejabberd.cfg.ejs');
  var vhostsTemplFile = path.resolve(TEMPL_DIR, dist, 'vhosts.cfg.ejs');
  var vhostConfigTemplFile = path.resolve(TEMPL_DIR, dist, 'vhost.cfg.ejs');

  ejabberd.ctl = ejabberd.dist.ctl || which.sync('ejabberdctl');
  fs.readFileSync(ejabberd.ctl);

  // FIXME: check existsness of config dir
  ejabberd.sudo = !!options.sudo;
  ejabberd.cfgDir = ejabberd.dist.cfgDir || options.cfgDir;
  ejabberd.vhostsFile = path.resolve(ejabberd.cfgDir, 'vhosts.cfg');
  ejabberd.incDir = path.resolve(ejabberd.cfgDir, 'includes');
  ejabberd.stopTime = options.stopTime || STOP_TIME;
  ejabberd.pauseTime = options.pauseTime || PAUSE_TIME;
  ejabberd.restartTime = options.restartTime || RESTART_TIME;
  ejabberd.debug = options.debug || DEBUG;
  ejabberd.cfgTempl = fs.readFileSync(cfgTemplFile, 'utf-8');
  ejabberd.vhostsTempl = fs.readFileSync(vhostsTemplFile, 'utf-8');
  ejabberd.vhostConfigTempl = fs.readFileSync(vhostConfigTemplFile, 'utf-8');

  // .
  if (!fs.existsSync(ejabberd.vhostsFile)) {
    var data = ejs.render(ejabberd.vhostsTempl, EMPTY_DB);
    fs.writeFileSync(ejabberd.vhostsFile, data, 'utf-8');
  }

  // .
  if (!fs.existsSync(ejabberd.incDir)) {
    fs.mkdirSync(ejabberd.incDir);
  }

  // Check status
  ejabberd.checker = setInterval(function() {
    ejabberd.ping().then(
      function() {  // Running
      ejabberd.running = true;

      if (ejabberd.debug) logger.info('Ejabberd is running.');

      ejabberd.emit('status', { running: true} );
    },
    function() {  // Down
      ejabberd.running = false;

      if (ejabberd.debug) logger.warn('Ejabberd is down.');

      ejabberd.emit('status', { running: false });
    }
    );
  }, options.checkerInterval || CHECKER_INTERVAL);

  return ejabberd;
};

Ejabberd.prototype.ping = function() {
  return control.status(this);
};

// .
Ejabberd.prototype.addVhost = function(data, target, cfg) {
  var ejabberd = this;
  var promises = [];
  var errMsg;
  var d = Q.defer();
  var db = {hosts:[], configs:[]};

  if (!_(data).isArray()) {
    return Q.fcall(function() { throw new Error('Arguments error: data is not an array'); });
  };

  if (!(target && cfg)) {
    if (!target) {
      errMsg = 'missing host';
    } else {
      errMsg = 'missing vhost config';
    }

    return Q.fcall(function() { throw new Error('Arguments error: ' + errMsg); });
  }

  if (!ejabberd.running) {
    return Q.fcall(function() { throw new Error('Ejabberd server is not running'); });
  }

  var incFile = ensureExt(target, 'cfg');
  var incPath = path.resolve(ejabberd.incDir, incFile);

  // .
  data.forEach(function(host, index) {
    db['hosts'].push(host);
    db['configs'].push(path.resolve(ejabberd.incDir, host + '.cfg'));
  });

  // .
  db['hosts'].push(target);
  db['configs'].push(incPath);

  db['hosts'] = _(db['hosts']).uniq();
  db['configs'] = _(db['configs']).uniq();

  // Here, order matters
  promises.push(config.updateVhostConfig(ejabberd, target, cfg));
  promises.push(config.updateVhosts(ejabberd, db));
  promises.push(control.restart(ejabberd));

  Q.allResolved(promises).then(function(promises) {
    var success = 0;

    promises.forEach(function(p) {
      if (p.isFulfilled()) ++success;
    });

    if (success === promises.length) {
      d.resolve();
    } else {
      d.reject(new Error('Fail to add virtual host'));
    }
  });

  return d.promise;
};

Ejabberd.prototype.removeVhost = function(data, target, options) {
  var ejabberd = this;
  var promises = [];
  var errMsg;
  var d = Q.defer();
  var db = {hosts:[], configs:[]};

  if (!_(data).isArray()) {
    return Q.fcall(function() { throw new Error('Arguments error: data is not an array'); });
  };

  if (!target) {
    errMsg = 'Arguments error: missing host';

    return Q.fcall(function() { throw new Error(errMsg); });
  }

  if (!ejabberd.running) {
    return Q.fcall(function() { throw new Error('Ejabberd server is not running'); });
  }

  var incFile = ensureExt(target, 'cfg');
  var incPath = path.resolve(ejabberd.incDir, incFile);

  // .
  data.forEach(function(host, index) {
    db['hosts'].push(host);
    db['configs'].push(path.resolve(ejabberd.incDir, host + '.cfg'));
  });

  // .
  db['hosts'] = _(db['hosts']).uniq();
  db['configs'] = _(db['configs']).uniq();

  db['hosts'] = _(db['hosts']).reject(function(h) { return h === target });
  db['configs'] = _(db['configs']).reject(function(p) { return p === incPath });

  // Here, order matters
  promises.push(config.removeVhostConfig(ejabberd, target));
  promises.push(config.updateVhosts(ejabberd, db));
  promises.push(control.restart(ejabberd));

  Q.allResolved(promises).then(function(promises) {
    var success = 0;

    promises.forEach(function(p) {
      if (p.isFulfilled()) ++success;
    });

    if (success === promises.length) {
      d.resolve();
    } else {
      d.reject(new Error('Fail to remove virtual host'));
    }
  });

  return d.promise;
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

Ejabberd.prototype.addUsers = function(users, host) {
  var ejabberd = this;
  var promises = [];
  var d = Q.defer();

  if (_(users).isEmpty()) {
    d.resolve();

    return d.promise;
  }

  if (!host) {
    return Q.fcall(function() { throw new Error('Arguments error: missing host'); });
  }

  if (!ejabberd.running) {
    return Q.fcall(function() { throw new Error('Ejabberd server is not running'); });
  }

  users.forEach(function(user) {
    promises.push(control.register(ejabberd, user.name, host, user.password));
  });

  Q.allResolved(promises).then(function(promises) {
    var success = 0;

    promises.forEach(function(p) {
      if (p.isFulfilled()) ++success;
    });

    if (success === promises.length) {
      d.resolve();
    } else {
      d.reject(new Error('Fail to add users'));
    }
  });

  return d.promise;
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

Ejabberd.prototype.removeUsers = function(usernames, host) {
  var ejabberd = this;
  var promises = [];
  var d = Q.defer();

  if (_(usernames).isEmpty()) {
    d.resolve();

    return d.promise;
  }

  if (!host) {
    return Q.fcall(function() { throw new Error('Arguments error: missing host'); });
  }

  if (!ejabberd.running) {
    return Q.fcall(function() { throw new Error('Ejabberd server is not running'); });
  }

  usernames.forEach(function(username) {
    promises.push(control.unregister(ejabberd, username, host));
  });

  Q.allResolved(promises).then(function(promises) {
    var success = 0;

    promises.forEach(function(p) {
      if (p.isFulfilled()) ++success;
    });

    if (success === promises.length) {
      d.resolve();
    } else {
      d.reject(new Error('Fail to remove users'));
    }
  });

  return d.promise;
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

Ejabberd.prototype.changeAllPasswords = function(username, hosts, newPass) {
  var ejabberd = this;
  var errMsg, promises = [];
  var d = Q.defer();

  hosts = hosts.length ? hosts : [hosts];

  if (!(username && hosts && newPass)) {
    if (!username) {
      errMsg = 'missing username';
    } else if (hosts.length === 0) {
      errMsg = 'missing hosts';
    } else {
      errMsg = 'missing new pasword'
    }

    return Q.fcall(function() { throw new Error('Arguments error: ' + errMsg); });
  }

  if (!ejabberd.running) {
    return Q.fcall(function() { throw new Error('Ejabberd server is not running'); });
  };

  hosts.forEach(function(host) {
    promises.push(control.changePassword(ejabberd, username, host, newPass));
  });

  Q.allResolved(promises).then(function(promises) {
    var success = 0;

    promises.forEach(function(p) {
      if (p.isFulfilled()) ++success;
    });

    if (success === promises.length) {
      d.resolve();
    } else {
      d.reject(new Error('Fail to change passwords'));
    }
  });

  return d.promise;
};

Ejabberd.prototype.addSharedRosterGroup = function(group, host, name, description, display) {
  var ejabberd = this;
  var errMsg;

  if (!(group && host && name && description && display)) {
    if (!group) {
      errMsg = 'missing group';
    } else if (!host) {
      errMsg = 'missing group';
    } else if (!name) {
      errMsg = 'missing name';
    } else if (!description) {
      errMsg = 'missing description';
    } else {
      errMsg = 'missing display'
    }

    return Q.fcall(function() { throw new Error('Arguments error: ' + errMsg); });
  };

  if (!ejabberd.running) {
    return Q.fcall(function() { throw new Error('Ejabberd server is not running'); });
  }

  return control.srgCreate(ejabberd, group, host, name, description, display);
};

Ejabberd.prototype.removeSharedRosterGroup = function(group, host) {
  var ejabberd = this;
  var errMsg;

  if (!(group && host)) {
    if (!group) {
      errMsg = 'missing group';
    } else {
      errMsg = 'missing host';
    }

    return Q.fcall(function() { throw new Error('Arguments error: ' + errMsg); });
  };

  if (!ejabberd.running) {
    return Q.fcall(function() { throw new Error('Ejabberd server is not running'); });
  }

  return control.srgDelete(ejabberd, group, host);
};

Ejabberd.prototype.addSRGMembers = function(usernames, host, group, grouphost) {
  var ejabberd = this;
  var errMsg, promises = [];
  var d = Q.defer();
  usernames = _(usernames).isArray() ? usernames : [usernames];

  if (!(host && group && grouphost)) {
    if (!host) {
      errMsg = 'missing host';
    } else if (!group) {
      errMsg = 'missing group';
    } else {
      errMsg = 'missing grouphost';
    }

    return Q.fcall(function() { throw new Error('Arguments error: ' + errMsg); });
  }

  if (!ejabberd.running) {
    return Q.fcall(function() { throw new Error('Ejabberd server is not running'); });
  }

  usernames.forEach(function(username) {
    promises.push(control.srgUserAdd(ejabberd, username, host, group, grouphost));
  });

  Q.allResolved(promises).then(function(promises) {
    var success = 0;

    promises.forEach(function(p) {
      if (p.isFulfilled()) ++success;
    });

    if (success === promises.length) {
      d.resolve();
    } else {
      d.reject(new Error('Fail to add shared roster members'));
    }
  });

  return d.promise;
};

Ejabberd.prototype.removeSRGMembers = function(usernames, host, group, grouphost) {
  var ejabberd = this;
  var errMsg, promises = [];
  var d = Q.defer();
  usernames = _(usernames).isArray() ? usernames : [usernames];

  if (!(host && group && grouphost)) {
    if (!host) {
      errMsg = 'missing host';
    } else if (!group) {
      errMsg = 'missing group';
    } else {
      errMsg = 'missing grouphost';
    }

    return Q.fcall(function() { throw new Error('Arguments error: ' + errMsg); });
  }

  if (!ejabberd.running) {
    return Q.fcall(function() { throw new Error('Ejabberd server is not running'); });
  }

  usernames.forEach(function(username) {
    promises.push(control.srgUserDel(ejabberd, username, host, group, grouphost));
  });

  Q.allResolved(promises).then(function(promises) {
    var success = 0;

    promises.forEach(function(p) {
      if (p.isFulfilled()) ++success;
    });

    if (success === promises.length) {
      d.resolve();
    } else {
      d.reject(new Error('Fail to remove shared roster group members'));
    }
  });

  return d.promise;
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
