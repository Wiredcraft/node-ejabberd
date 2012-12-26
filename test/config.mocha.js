var path = require('path');

var Q = require('q');
var should = require('should');
var helpers = require('./helpers');
var config = require('../lib/config');

//var ctl = process.env.EJABBERDCTL_BIN;
//var cfgDir = process.evn.EJABBERD_CFG_DIR;
var cfgDir = path.resolve(__dirname, './fixture/ejabberd/');
var f = function() {};

describe('ejabberdctl', function() {

  describe('templates', function() {
    it('should has a hosts template', function(done) {
    });

    it('should has a host_config template', function(done) {
    });
  });

  describe('config', function() {
    it('should has a backup method', function(done) {
    });

    it('should can backup ejabberd.cfg', function(done) {
    });

    it('should has a createHostConfig method', function(done) {
    });

    it('should can conreate host config', function(done) {
    });

    it('should has a removeHostConfig method', function(done) {
    });

    it('should can remove host config', function(done) {
    });

    it('should has includeHost method', function(done) {
    });

    it('should can include host', function(done) {
    });

    it('should has exlucdeHost method', function(done) {
    });

    it('should can exlucde host', function(done) {
    });

  });

});
