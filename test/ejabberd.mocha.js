var path = require('path');

var Q = require('q');
var should = require('should');

var Ejabberd = require('../lib/ejabberd');
var cfgDir = path.resolve(__dirname, './fixture/ejabberd');
var dist = process.env.EJABBERD_DIST;
var f = function() {};

describe('Ejabberd', function() {
  describe('class', function() {
    it('should be a function', function(done) {
      Ejabberd.should.be.a('function');

      setTimeout(done, 0);
    });
  });

  describe('instance', function() {
    var instance = new Ejabberd(dist, {debug:true});

    it('should has a version property', function(done) {
      instance.version.should.be.a('string');

      setTimeout(done, 0);
    });

    it('should has a addVhost method', function(done) {
      instance.addVhost.should.be.a('function');

      setTimeout(done, 0);
    });

    it('should fail it addVhost missing arguments', function(done) {
      var promise = instance.addVhost('blah');

      promise.then(f).fail(function(error) { console.log(error); setTimeout(done, 0); });
    });

    it('should has a removeVhost method', function(done) {
      instance.removeVhost.should.be.a('function');

      setTimeout(done, 0);
    });

    it('should fail it removeVhost missing arguments', function(done) {
      var promise = instance.removeVhost();

      promise.then(f).fail(function() { setTimeout(done, 0); });
    });

    it('should has a register method', function(done) {
      instance.register.should.be.a('function');

      setTimeout(done, 0);
    });

    it('should has a addUsers method', function(done) {
      instance.addUsers.should.be.a('function');

      setTimeout(done, 0);
    });

    it('should fail it register missing arguments', function(done) {
      var promise = instance.register();

      promise.then(f).fail(function() { setTimeout(done, 0); });
    });

    it('should has a unregister method', function(done) {
      instance.unregister.should.be.a('function');

      setTimeout(done, 0);
    });

    it('should has a removeUsers method', function(done) {
      instance.removeUsers.should.be.a('function');

      setTimeout(done, 0);
    });

    it('should fail it unregister missing arguments', function(done) {
      var promise = instance.unregister();

      promise.then(f).fail(function() { setTimeout(done, 0); });
    });

    it('should has a changePassword method', function(done) {
      instance.changePassword.should.be.a('function');

      setTimeout(done, 0);
    });

    it('should has a changeAllPasswords method', function(done) {
      instance.changeAllPasswords.should.be.a('function');

      setTimeout(done, 0);
    });

    it('should fail it changePassword missing arguments', function(done) {
      var promise = instance.changePassword();

      promise.then(f).fail(function() { setTimeout(done, 0); });
    });

    it('should has a restart method', function(done) {
      instance.restart.should.be.a('function');

      setTimeout(done, 0);
    });
  });
});
