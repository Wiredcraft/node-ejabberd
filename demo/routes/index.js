
/*
 * GET home page.
 */

var Ejabberd = require('../..');
var e = new Ejabberd();

exports.index = function(req, res){
  res.render('index', { title: 'Github Chat' });
};

exports.create = function(req, res, next) {
  var appHost = 'ejabberd.local';
  var org = req.body.org;
  var admin = req.body.admin;
  var password = req.body.password;
  var host = org + '.' + appHost;

  var config = {host: host};

  e.addVhost(host, config).then(function() {
    res.redirect('/admin/' + host);
  }, function(reason) {
    next(new Error.HTTP(reason, 500));
  });
};

exports.admin = function(req,res) {
  var host = req.params.host;

  res.render('admin',
             { host: host,
               title: 'Register admin'}
            );
};

exports.register = function(req, res) {
  var host = req.params.host;
  var admin = req.body.admin;
  var password = req.body.password;

  e.register(admin, host, password).then(
    function() {
    res.send('register ok');
  },
  function() {
    res.send('register failed');
  });
}
