var cp = require('child_process');
var host = process.argv[2];

var child = cp.spawn('ejabberdctl', ['registered_users', host]);

child.stderr.on('data', function(data) {
  console.log('stderr: ', data.toString());
});

child.stdout.on('data', function(data) {
  console.log('stdout: ', data.toString());
});

child.on('exit', function(code) {
  console.log('Process exit with code ', code);
});
