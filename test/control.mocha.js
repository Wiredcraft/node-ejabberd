var Q = require('q');
var path = require('path');
var should = require('should');
var control = require('../lib/control');
var helpers = require('./helpers');
var ctl = process.env.EJABBERDCTL_BIN
var f = function() {};

describe('ejabberdctl', function() {
  it('should failed if ejabberdclt command is not found', function(done) {
    var promise = control.echo('no_ejabberdctl');

    promise.then(f, function(reason) { setTimeout(done, 0); });
  });

  // it('should success if ejabberdclt command is found', function(done) {
  //   var promise = control.echo(exec);

  //   promise.then(function(stdout) { setTimeout(done, 0); });
  // });


  it('should failed if config file is not found', function(done) {
    var promise = control.loadConfig('ejabberdctl', './fixture/no.cfg');

    promise.then(f, function(reason) { setTimeout(done, 0); });
  });

  it('should can register user', function(done) {
    var host = 'localhost';
    var username = helpers.randomUsername();
    var password = helpers.randomPassword();

    var promise = control.register(ctl, username, host, password);

    promise.then(function(stdout) { setTimeout(done, 0); });
  });

  it('should can unregister user', function(done) {
    var host = 'localhost';
    var username = helpers.randomUsername();
    var password = helpers.randomPassword();

    var promise = control.unregister(ctl, username, host, password);

    promise.then(function(stdout) {
      var promise = control.unregister(exec, username, host);

      promise.then(function(stdout) { setTimeout(done, 0); });
    });
  });

  it('should can change password', function(done) {
    var host = 'localhost';
    var username = helpers.randomUsername();
    var password = helpers.randomPassword();

    var promise = control.register(ctl, username, host);

    promise.then(function(stdout) {
      var newPass = helpers.randomPassword();
      var promise = control.changePassword(exec, username, newPass);

      promise.then(function(stdout) { setTimeout(done, 0); });
    });
  }); 

});
