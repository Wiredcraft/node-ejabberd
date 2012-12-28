var fs = require('fs');
var path = require('path');

var ejs = require('ejs');

var io = require('./io');
var logger = require('./helpers').logger;
var ensureExt = require('./helpers').ensureExt;

// Cache templates
var templDir = path.resolve(__dirname, '../templates');

var cfgTemplFile = path.resolve(templDir, 'ejabberd.cfg.ejs');
var cfgTempl = fs.readFileSync(cfgTemplFile, 'utf-8');

var vhostsTemplFile = path.resolve(templDir, 'vhosts.cfg.ejs');
var vhostsTempl = fs.readFileSync(vhostsTemplFile, 'utf-8');

var vhostConfigTemplFile = path.resolve(templDir, 'vhost.cfg.ejs');
var vhostConfigTempl = fs.readFileSync(vhostConfigTemplFile, 'utf-8');

module.exports = exports = {
  updateConfig: function(ejabberd, hosts, configs) {
    var file = path.resolve(ejabberd.cfgDir, 'ejabberd.cfg');
    var data = ejs.render(cfgTempl, {hosts:hosts, configs:configs});

    logger.info('Promise to update ejabberd config file: ', file);

    return io.writeFile(file, data);
  },

  updateVhostConfig: function(ejabberd, host, config) {
    name = ensureExt(host, 'cfg');
    var file = path.resolve(ejabberd.incDir, host);
    var data = ejs.render(vhostConfigTempl, config);

    logger.info('Promise to write file: ', file);

    return io.writeFile(file, data);
  },

  removeVhostConfig: function(ejabberd, name) {
    name = ensureExt(name, 'cfg');
    var file = path.resolve(ejabberd.incDir, name);

    logger.info('Promise to unlink file: ', file);

    return io.unlink(file);
  },

  updateVhosts: function(ejabberd, hosts, configs) {
    var file = path.resolve(ejabberd.cfgDir, 'vhosts.cfg');
    var data = ejs.render(vhostsTempl, {hosts: hosts, configs: configs});

    logger.info('Promise to update hosts: ', file);
    logger.info('Updated vhosts data: ', data);

    return io.writeFile(file, data);
  }

};
