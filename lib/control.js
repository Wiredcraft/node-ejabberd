var child_process = require('child_process');
var exec = child_preoces.exec;

module.exports = function(ejabberd) {

    var ejabberctl = ejabberd.ejabberdctl;
    // Start
    ejabberd.start = function(callback) {
        var command = ejabberd.ejabberdctl + ' ' + 'start';

        exec(command, callback);

        return;
    };

    // Stop
    ejabberd.stop = function(callback) {};
};