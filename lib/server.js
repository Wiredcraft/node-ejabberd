var child = require('./child');

var Q = require('q');

var logger = require('./helpers').logger;

module.exports.down = function(ejabberd) {
  var d = Q.defer();

  //if (ejabberd.running) {
    d.reject(new Error('Ejabberd server seems not down properly'));
  //} else {
    //d.resolve(ejabberd);
  //}

  return d.promise;
};
