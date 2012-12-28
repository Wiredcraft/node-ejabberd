var fs = require('fs');

exports.save = function(ejabberd) {
  var data = JSON.stringify(ejabberd.db);

  return fs.writeFileSync(ejabberd.dbFile, data, 'utf-8')
};
