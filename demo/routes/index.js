
/*
 * GET home page.
 */

var Ejabberd = require('../..');
var e = new Ejabberd(null, {debug:true, sudo:true});

exports.index = function(req, res){
  res.render('index', { title: 'Team Chat' });
};

exports.admin = function(req,res) {
  var host = req.params.host;

  res.render('admin',
             { host: host,
               title: 'Admin panel',
               message: 'Welcome to admin panel'
             }
            );
};


exports.create = function(req, res, next) {
  var appHost = 'ejabberd.local';
  var org = req.body.org;
  var host = org + '.' + appHost;

  var config = {host: host, admins:['bot']};

  e.addVhost(host, config).then(
    function() {
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

exports.add = function(req, res) {
  var host = req.params.host;
  var username1 = req.body.username1;
  var password1 = req.body.password1;
  var username2 = req.body.username2;
  var password2 = req.body.password2;

  var users = [{name:username1, password:password1},{name:username2, password:password2}]

  e.addUsers(users, host).then(
    function() {
    msg = 'register ok, Now you can use your jid and password login server ';
    res.send(msg);
  }).fail(function() {
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

exports.remove = function(req, res) {
  var host = req.params.host;
  var username1 = req.body.username1;
  var username2 = req.body.username2;

  e.removeUsers([username1, username2], host).then(
    function() {
    var msg = 'ok, ' + username1 + ' and ' + username2 + ' removed!';

    res.send(msg);
  },
  function() {
    res.send('remove users failed');
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

exports.modify = function(req, res) {
  var username = req.body.username;
  var newPass = req.body.newPass;

  e.changeAllPasswords(username, e.db['hosts'], newPass).then(
    function() {
    var msg = 'ok, user ' + username + ' password is ' + newPass + ' now';

    res.send(msg);
  },
  function() {
    res.send('change password failed');
  });
};  
