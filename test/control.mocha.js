var path = require('path');

var Q = require('q');
var should = require('should');

var control = require('../lib/control');
var helpers = require('./helpers');

var ctl = process.env.EJABBERDCTL_BIN;
var ejabberd = {ctl: ctl};

var f = function() {};

describe('Ejabberdctl', function() {
  describe('ctl', function() {
    // .
    var test_admin = helpers.randomUsername();

    // it('should failed if ejabberdclt command is not found', function(done) {
    //   var promise = control.status({ctl: 'no_ejabberdctl'});

    //   promise.then(f, function(reason) { setTimeout(done, 0); });
    // });

    it('should success if ejabberdclt command is found', function(done) {
      var promise = control.status(ejabberd);

      promise.then(function(stdout) { setTimeout(done, 0); });
    });


    it('should failed if config file is not found', function(done) {
      var file = path.resolve(__dirname, './fixture/no.cfg');
      var promise = control.loadConfig(ejabberd, file);

      promise.then(f, function(reason) { setTimeout(done, 0); });
    });

    it('should can register user', function(done) {
      var host = 'localhost';
      var username = test_admin;
      var password = helpers.randomPassword();

      var promise = control.register(ejabberd, username, host, password);

      promise.then(function(stdout) { setTimeout(done, 0); });
    });

    it('should can change password', function(done) {
      var host = 'localhost';
      var username = test_admin;
      var newPass = helpers.randomPassword();

      var promise = control.changePassword(ejabberd, username, host, newPass);

      promise.then(function(stdout) { setTimeout(done, 0); });
    });

    it('should can unregister user', function(done) {
      var host = 'localhost';
      var username = test_admin;

      var promise = control.unregister(ejabberd, username, host);

      promise.then(function(stdout) { setTimeout(done, 0); });
    });

    it('should has getUsernames method', function(done) {
      control.registeredUsers.should.be.a('function');

      setTimeout(done, 0);
    });

    // it('should can get usernames of a host', function(done) {
    //   var host = 'localhost';

    //   var promise = control.registeredUsers(ctl, host);

    //   promise.then(function(names) {
    //     names.should.be.a('array');

    //     setTimeout(done, 0);
    //   }, function(reason) {
    //     setTimeout(done, 0);
    //   });
    // });

    it('should has a restart method', function(done) {
      control.restart.should.be.a('function');

      setTimeout(done, 0);
    });

    // it('should can restart ejabberd server', function(done) {
    //   var promise = control.restart(ctl);

    //   promise.then(function() { setTimeout(done, 0); });
    // });

  });

});
