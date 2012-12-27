var path = require('path');

var Q = require('q');
var should = require('should');
var helpers = require('./helpers');
var config = require('../lib/config');
var io = require('../lib/io');

//var ctl = process.env.EJABBERDCTL_BIN;
//var cfgDir = process.evn.EJABBERD_CFG_DIR;
var cfgDir = path.resolve(__dirname, './fixture/ejabberd/');
var f = function() {};

describe('Ejabberdctl', function() {

  describe('templates', function() {
    it('should has a vhosts template', function(done) {
      var file = path.resolve(__dirname, '../templates/vhosts.cfg.ejs');
      var promise = io.exists(file);

      promise.then(function(exists) { setTimeout(done, 0); });
    });

    it('should has a vhost template', function(done) {
      var file = path.resolve(__dirname, '../templates/vhost.cfg.ejs');
      var promise = io.exists(file);

      promise.then(function(exists) { setTimeout(done, 0); });
    });
  });

  describe('config', function() {
    it('should has a createHostConfig method', function(done) {
      config.createHostConfig.should.be.a('function');

      setTimeout(done, 0);
    });

    it('should can create host config', function(done) {
      var incDir = path.resolve(__dirname, './fixture/ejabberd/includes');
      var fakeEjabberd = {incDir:incDir};
      var host = 'test_host';
      var fakeConfig = {host:host};

      var promise = config.createHostConfig(fakeEjabberd, host, fakeConfig);

      promise.then(function() { setTimeout(done, 0); });
    });

    it('should has a removeHostConfig method', function(done) {
      config.removeHostConfig.should.be.a('function');

      setTimeout(done, 0);
    });

    it('should can remove host config', function(done) {
      var incDir = path.resolve(__dirname, './fixture/ejabberd/includes');
      var fakeEjabberd = {incDir:incDir};
      var host = 'test_host';

      var promise = config.removeHostConfig(fakeEjabberd, host);

      promise.then(function() { setTimeout(done, 0); });
    });

  });

});
