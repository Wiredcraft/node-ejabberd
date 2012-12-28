var path = require('path');

var Q = require('q');
var should = require('should');

var Ejabberd = require('../lib/ejabberd');
var cfgDir = path.resolve(__dirname, './fixture/ejabberd');

describe('Ejabberd', function() {
  describe('class', function() {
    it('should be a function', function(done) {
      Ejabberd.should.be.a('function');

      setTimeout(done, 0);
    });
  });

  describe('instance', function() {
    var instance = new Ejabberd(cfgDir);

    it('should has a addHost method', function(done) {
      instance.addHost.should.be.a('function');

      setTimeout(done, 0);
    });  

    it('should has a removeHost method', function(done) {
      instance.removeHost.should.be.a('function');

      setTimeout(done, 0);
    });

    it('should has a register method', function(done) {
      instance.register.should.be.a('function');

      setTimeout(done, 0);
    });

    it('should has a unregister method', function(done) {
      instance.unregister.should.be.a('function');

      setTimeout(done, 0);
    });  

    it('should has a changePassword method', function(done) {
      instance.changePassword.should.be.a('function');

      setTimeout(done, 0);
    });

    it('should has a restart method', function(done) {
      instance.restart.should.be.a('function');

      setTimeout(done, 0);
    });
  });
});
