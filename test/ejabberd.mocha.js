var Q = require('q');
var should = require('should');
var Ejabberd = require('../lib/ejabberd');

describe('Ejabberd', function() {
  describe('class', function() {
    it('should be a function', function(done) {
      Ejabberd.should.be.a('function');

      setTimeout(done, 0);
    });
  });

  describe('instance', function() {
    var instance = new Ejabberd('/usr/local/etc/ejabberd/');

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

    it('should has a reload method', function(done) {
      instance.reload.should.be.a('function');

      setTimeout(done, 0);
    });  

  });
});
