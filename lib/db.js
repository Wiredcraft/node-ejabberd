var fs = require('fs');
var Q = require('q');

var logger = require('./helpers').logger;

exports.save = function(ejabberd) {
  var deferred = Q.defer();
  var data = JSON.stringify(ejabberd.db);

  logger.info('The db going to save: ' + data);

  fs.writeFile(ejabberd.dbFile, data, 'utf-8', deferred.makeNodeResolver());

  return deferred.promise;
};
