
/*
 * GET home page.
 */

var Ejabberd = require('../..');
var e = new Ejabberd();

exports.index = function(req, res){
  res.render('index', { title: 'Github Chat' });
};

exports.create = function(req, res, next) {
  var org = req.body.org;
  var admin = req.body.admin;
  var password = req.body.password;
  var host = req.get('host');

  var config = {host: org + '.' + host};

  e.addVhost(org, config).then(function() {
    res.send('Success', 200);
  }, function(reason) {
    next(new Error.HTTP(reason, 500));
  });
};

exports.panel = function(req, res) {
};

exports.register = function(req, res) {
}
