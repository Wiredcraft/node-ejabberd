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
    it('should has a hosts template', function(done) {
      var file = path.resolve(__dirname, '../templates/hosts.cfg.ejs');
      var promise = io.exists(file);

      promise.then(function(exists) { setTimeout(done, 0); });
    });

    it('should has a host_config template', function(done) {
      var file = path.resolve(__dirname, '../templates/host_config.cfg.ejs');
      var promise = io.exists(file);

      promise.then(function(exists) { setTimeout(done, 0); });
    });
  });

  describe('config', function() {
    it('should has a backup method', function(done) {
      config.backup.should.be.a('function');

      setTimeout(done, 0);
    });

    it('should can backup ejabberd.cfg', function(done) {
    });

    it('should has a createHostConfig method', function(done) {
      config.createHostConfig.should.be.a('function');

      setTimeout(done, 0);
    });

    it('should can conreate host config', function(done) {
    });

    it('should has a removeHostConfig method', function(done) {
      config.removeHostConfig.should.be.a('function');
      
      setTimeout(done, 0);
    });

    it('should can remove host config', function(done) {
    });

    it('should has includeHost method', function(done) {
      config.includeHost.should.be.a('function');

      setTimeout(done, 0);
    });

    it('should can include host', function(done) {
    });

    it('should has excludeHost method', function(done) {
      config.excludeHost.should.be.a('function');

      setTimeout(done, 0);
    });

    it('should can exclude host', function(done) {
    });

  });

});
