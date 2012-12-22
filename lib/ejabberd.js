/*
 * ejabberd
 * https://github.com/kuno/ejabberd
 *
 * Copyright (c) 2012 wiredcraft
 * Licensed under the MIT license.
 */

// Default location of ejabberd.cfg
var EJABBDCFG_FILE = '/etc/ejabberd/ejabberd.cfg';

var fs = require('fs');
var path = require('path');
var which = require('which');
var _ = require('underscore');

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
    this.ejabberdclt = which.sync('ejabberdctl');
    // FIXME: check existsness of config file
    this.ejabberdcfg = configPath || EJABBERDCFG_FILE;

    /*
    // Bind
    _(config).each(function(func, name) {
        _.bind(func, ejabberd);
    });

    _(control).each(function(func, name) {
        _.bind(func, ejabberd);
    });
    */

    require('./config')(ejabberd);
    require('./control')(ejabberd);

    /*
    this.config = config;
    this.control = control;
    */
};

/*
// Config
Ejabberd.prototype.config = config;

// Control
Ejabberd.prototype.control = control;
*/
module.exports = Ejabberd;