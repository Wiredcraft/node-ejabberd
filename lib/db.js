var fs = require('fs');

var logger = require('./helpers').logger;

exports.save = function(ejabberd) {
  var data = JSON.stringify(ejabberd.db);

  logger.info('The db going to save: ' + data);

  return fs.writeFileSync(ejabberd.dbFile, data, 'utf-8')
};
