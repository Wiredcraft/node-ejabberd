/*
 * ejabberd
 * https://github.com/kuno/ejabberd
 *
 * Copyright (c) 2012 wiredcraft
 * Licensed under the MIT license.
 */

// Default location of ejabberd.cfg
var EJABBERDCFG_DIR = '/etc/ejabberd/';
var EJABBERDCFG_FILE = '/etc/ejabberd/ejabberd.cfg';

var fs = require('fs');
var path = require('path');
var which = require('which');
var _ = require('underscore');

var Q = require('q');

var config = require('./config');
var control = require('./control');

var Ejabberd = function(configPath) {
    this.initialize.call(this, configPath);

    return this;
};

// Class
Ejabberd.prototype.initialize = function(configPath) {
    var ejabberd = this;

    // Ensure there is a ejabberd installation
    this.ctl = which.sync('ejabberdctl');
    // FIXME: check existsness of config file
    this.cfgFile = configPath || EJABBERDCFG_FILE;
    this.cfgDir = path.dirname(this.cfgFile);

    /*
    // Bind
    _(config).each(function(func, name) {
        _.bind(func, ejabberd);
    });

    _(control).each(function(func, name) {
        _.bind(func, ejabberd);
    });
    */

    /*
    this.config = config;
    this.control = control;
    */
};

Ejabberd.prototype.addOrg = function(name, options) {
  // TODO: need implemented
};

Ejabberd.prototype.removeOrg = function(name, options) {
  // TODO: need implemented
};

Ejabberd.prototype.register = function(username, host, password) {
  // FIXME: saft check later
  return control._register(username, host, password);
};

Ejabberd.prototype.unregister = function(username, host, password) {
  // FIXME: saft check later
  return control._unregister(username, host);
};

Ejabberd.prototype.changePassword = function(username, newPass) {
  // TODO: need implemented
};

Ejabberd.prototype.reload = function() {
  // TODO: need implemented
};

// .
module.exports = Ejabberd;
