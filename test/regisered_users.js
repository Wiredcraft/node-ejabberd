var cp = require('child_process');
var _ = require('underscore');

var host = process.argv[2];

var child = cp.spawn('ejabberdctl', ['registered_users', host]);

child.stderr.on('data', function(data) {
  console.log('stderr: ', data.toString());
});

child.stdout.on('data', function(data) {
  var users = [];
  console.log(data);

  _(data.toString().split('\n')).each(function(u, i) {
    u = u.trim();

    if (u) users.push(u);
  });

  console.log('Length of data is $d', users.length);
  console.log('stdout: ', users.toString());
});

child.on('exit', function(code) {
  console.log('Process exit with code ', code);
});
