
/*
 * GET home page.
 */

var Ejabberd = require('../..');
var e = new Ejabberd();

exports.index = function(req, res){
  res.render('index', { title: 'Github Chat' });
};

exports.admin = function(req,res) {
  var host = req.params.host;

  res.render('admin',
             { host: host,
               title: 'Register admin'}
            );
};

exports.create = function(req, res, next) {
  var appHost = 'ejabberd.local';
  var org = req.body.org;
  var host = org + '.' + appHost;

  var config = {host: host};

  e.addVhost(host, config).then(function() {
    res.redirect('/admin/' + host);
  }).fail(function(reason) {
    next(new Error.HTTP(reason, 500));
  });
};


exports.remove = function(req, res) {
  var host = req.params.host;

  e.removeVhost(host).then(
    function() {
    var msg = 'Host ' + host + ' has bee removed';

    res.send(msg);
  },
  function() {
    res.send('remove failed');
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
