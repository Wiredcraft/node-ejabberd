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
    it('should has s ejabberd.cfg template', function(done) {
      var file = path.resolve(__dirname, '../templates/ejabberd.cfg.ejs');
      var promise = io.exists(file);

      promise.then(function(exists) { setTimeout(done, 0); });
    });

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
    it('should has a updateConfig method', function(done) {
      config.updateConfig.should.be.a('function');

      setTimeout(done, 0);
    });

    it('should can update ejabberd config', function(done) {
      var cfgDir = path.resolve(__dirname, './fixture/ejabberd');
      var fakeEjabberd = {cfgDir:cfgDir};   
      var fakeHosts = ['org1.example.com', 'org2.example.com'];
      var promise = config.updateConfig(fakeEjabberd, fakeHosts);

      promise.then(function() { setTimeout(done, 0); });
    });

    it('should has a createVhostConfig method', function(done) {
      config.updateVhostConfig.should.be.a('function');

      setTimeout(done, 0);
    });

    it('should can create/update vhost config', function(done) {
      var incDir = path.resolve(__dirname, './fixture/ejabberd/includes');
      var fakeEjabberd = {incDir:incDir};
      var host = 'test_host';
      var fakeConfig = {host:host};

      var promise = config.updateVhostConfig(fakeEjabberd, host, fakeConfig);

      promise.then(function() { setTimeout(done, 0); });
    });

    it('should has a removeVhostConfig method', function(done) {
      config.removeVhostConfig.should.be.a('function');

      setTimeout(done, 0);
    });

    it('should can remove vhost config', function(done) {
      var incDir = path.resolve(__dirname, './fixture/ejabberd/includes');
      var fakeEjabberd = {incDir:incDir};
      var host = 'test_host';

      var promise = config.removeVhostConfig(fakeEjabberd, host);

      promise.then(function() { setTimeout(done, 0); });
    });

    it('should has a updateVhosts method', function(done) {
      config.updateVhosts.should.be.a('function');

      setTimeout(done, 0);
    });

    it('should can update vhosts file', function(done) {
      var hosts = ['127.0.0.1', '127.0.0.2'];
      var configs = ['/path/to/127.0.0.1', '/path/to/127.0.0.2'];
      var cfgDir = path.resolve(__dirname, './fixture/ejabberd');
      var fakeEjabberd = {cfgDir:cfgDir};

      var promise = config.updateVhosts(fakeEjabberd, hosts, configs);

      promise.then(function() { setTimeout(done, 0); });
    });

  });

});
