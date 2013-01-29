var fs = require('fs');
var path = require('path');

var ejs = require('ejs');

var io = require('./io');
var logger = require('./helpers').logger;
var ensureExt = require('./helpers').ensureExt;

// Cache templates
// var templDir = path.resolve(__dirname, '../templates');
//
// var cfgTemplFile = path.resolve(templDir, 'ejabberd.cfg.ejs');
// var cfgTempl = fs.readFileSync(cfgTemplFile, 'utf-8');
//
// var vhostsTemplFile = path.resolve(templDir, 'vhosts.cfg.ejs');
// var vhostsTempl = fs.readFileSync(vhostsTemplFile, 'utf-8');
//
// var vhostConfigTemplFile = path.resolve(templDir, 'vhost.cfg.ejs');
// var vhostConfigTempl = fs.readFileSync(vhostConfigTemplFile, 'utf-8');
//
module.exports = exports = {
  updateConfig: function(ejabberd) {
    var file = path.resolve(ejabberd.cfgDir, 'ejabberd.cfg');
    var data = ejs.render(ejabberd.cfgTempl, ejabberd.db);

    if (ejabberd.debug) logger.debug('Promise to update ejabberd config file: ', file);

    return io.writeFile(file, data);
  },

  updateVhostConfig: function(ejabberd, host, config) {
    host = ensureExt(host, 'cfg');
    var file = path.resolve(ejabberd.incDir, host);
    var data = ejs.render(ejabberd.vhostConfigTempl, config);

    if (ejabberd.debug) logger.debug('Promise to write file: ', file);

    return io.writeFile(file, data);
  },

  removeVhostConfig: function(ejabberd, host) {
    host = ensureExt(host, 'cfg');
    var file = path.resolve(ejabberd.incDir, host);

    if (ejabberd.debug) logger.debug('Promise to unlink file: ', file);

    return io.unlink(file);
  },

  updateVhosts: function(ejabberd, hosts, configs) {
    var file = path.resolve(ejabberd.cfgDir, 'vhosts.cfg');
    var data = ejs.render(ejabberd.vhostsTempl, {hosts: hosts, configs: configs});

    if (ejabberd.debug) {
      logger.debug('Promise to update hosts: ', file);
      logger.debug('Updated vhosts data: ', data);
    }

    return io.writeFile(file, data);
  }

};
