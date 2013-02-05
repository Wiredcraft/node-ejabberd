var cp = require('child_process');
var host = process.argv[2];

var child = cp.spawn('ejabberdctl', ['registered_users', host]);

child.stderr.on('data', function(data) {
  console.log('stderr: ', data.toString());
});

child.stdout.on('data', function(data) {
  console.log(data);

  var users = data.toString().split(' ');
  console.log('Length of data is $d', users.length);
  console.log('stdout: ', users.toString());
});

child.on('exit', function(code) {
  console.log('Process exit with code ', code);
});
