
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
  var host = org + '.' + appHost;

  var config = {host: host};

  e.addVhost(host, config).then(function() {
    res.redirect('/admin/' + host);
  },
  function() {
    e.restart();
  }).fail(function(reason) {
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
  var username = req.body.username;
  var password = req.body.password;

  e.register(username, host, password).then(
    function() {
    var msg = 'register ok, Now you can use your jid and password login server ';

    res.send(msg);
  },
  function() {
    res.send('register failed');
  });
};

exports.unregister = function(req, res) {
  var host = req.params.host;
  var username = req.body.username;

  e.unregister(username, host).then(
    function() {
    var msg = 'unregister ok, user ' + username + 'has been removed from ' + host;

    res.send(msg);
  },
  function() {
    res.send('unregister failed');
  });
};

exports.change= function(req, res) {
  var host = req.params.host;
  var username = req.body.username;
  var newPass = req.body.newPass;

  e.changePassword(username, host, newPass).then(
    function() {
    var msg = 'ok, user ' + username + ' password is ' + newPass + ' now';

    res.send(msg);
  },
  function() {
    res.send('change password failed');
  });
}; 
