var fs = require('fs');
var cp = require('child_process');
var success = 0;
var start = Date.now();

for (var i = 0; i < 10; ++i) {
  cp.exec('/etc/init.d/ejabberd restart', function(err, stderr, stdout) {
    if (err) throw err;

    ++success;
  });
}

for (Date.now() - start < 1000 * 10) {}

console.log('Success time is $s', success);
