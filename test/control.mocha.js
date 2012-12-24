var Q = require('q');
var path = require('path');
var should = require('should');
var control = require('../lib/control');

describe('ejabberdctl', function() {
  it('should failed if ejabberdclt command is not found', function(done) {
    var promise = control.loadConfig('no_ejabberdctl');

    promise.then(function(stdout) {},
                 function(reason) {
                   setTimeout(done, 0);
                 });
  });

  it('should failed if config file is not found', function(done) {
    var promise = control.loadConfig('ejabberdctl', './fixture/no.cfg');

    promise.then(function(stdout) {},
                 function(reason) {
                   setTimeout(done, 0);
                 });
  });

  it('should resolved if config file is found', function(done) {
    var config = path.resolve(__dirname, 'fixture/hosts.cfg');
    var promise = control.loadConfig('ejabberdctl', config);

    promise.then(function(stdout) { setTimeout(done, 0);},
                 function(reason) {
                   //setTimeout(done, 0);
                 });
  }); 

});
