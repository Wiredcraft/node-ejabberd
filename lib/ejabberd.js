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

var Ejabberd = function(configPath) {
  this.initialize.call(this, configPath);

  return this;
};

// Class
Ejabberd.prototype.initialize = function(configPath) {
  var ejabberd = this;

  // Ensure there is a ejabberdctl executable
  if (process.env.EJABBERDCTL_BIN) {
    this.ctl = process.env.EJABBERDCTL_BIN;
  } else {
    this.ctl = which.sync('ejabberdctl');
  }

  // FIXME: check existsness of config dir
  if (process.env.EJABBERD_CFG_DIR) {
    this.cfgDir = process.env.EJABBERD_CFG_DIR;
  } else {
    this.cfgDir = EJABBERD_CFG_DIR;
  }

  
};

Ejabberd.prototype.addHost = function(host, hosts, options) {
  // TODO: need implemented
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

Ejabberd.prototype.reload = function() {
  // FIXME: saft check later
  return control.reload(this.ctl);
};

// .
module.exports = Ejabberd;
