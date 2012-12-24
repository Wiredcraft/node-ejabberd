var Q = require('q');
var should = require('should');
var Ejabberd = require('../lib/ejabberd');

describe('Ejabberd', function() {
  describe('ejabberd class', function() {
    it('should be a function', function(done) {
      Ejabberd.should.be.a('function');

      setTimeout(done, 0);
    });
  });
});
