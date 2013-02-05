# node-ejabberd

nodejs bridge to ejabberd

##Limitations

Essentially, what this module can do is just talk to `ejabberdclt` command, edit `ejabberd.cfg` file.

So if you don't have the permission to run `ejabberdclt` and to read/write in `/etc/ejabberd` config directoty, this module **wont** works for you.

On unix-like sytems, this means, you **must** have the `root` permission to use this module or to run the application that required this moduel.

__In the simple words, you are fully reponsed to make sure this module can tale to ejabberd.__

###Adpaters

Since node-ejabberd is highly depending on the os setup, in order to make it working properly with different OSes, here comes the concept of `adaper`.

An adaper is simpely a bunch of info about the ejabberd setups on an OS that defined in [adapers.json](./adapers.json), like:

```
 ...
 "ubuntu:apt": {
    "cfgDir"  : "/etc/ejabberd/",
    "dbDir"   : "/var/lib/ejabberd",
    "pidFile" : "/var/run/ejabberd/ejabberd.pid",
    "ctl"     : "/usr/sbin/ejabberdctl",
    "daemon"  : "/usr/sbin/ejabberd",
    "script"  : "/etc/init.d/ejabberd",
    "restart" : "/etc/init.d/ejabberd restart"
  }
  ...
```

### Explanation

#### name

The name of the adapter object should follow `os-name`:`The-name-of-package-manager`, e.g: `ubuntu:apt`, `osx:brew`

#### member

* `cfgDir`: The absolute path of ejabberd config directory.

* `dbDir`: The absolute path of ejbberd database directory.

* `pidFile`: The absolute path of ejabberd process id file.

* `ctl`: The absolute path of ejabberdctl binary.

* `daemon`: The absolute path of ejabberd daemon binary.

* `script`: The os level daemon script, **optional**.

* `restart`: The full ejabberd restart command.

**Fork please**

If you found that there are not adaper fro your favorite os, please fork this repo, adding it, then fire a pull request.

## Directory and files

###Config directory structure
```
.
|-- ejabberd.cfg
|-- includes
|   |-- vhost1.cfg
|   `-- vhost2.cfg
```

###Sample of included vhost config file
```erlang
{host_config, "vhost1.example.com",[{acl, admin, {user, "admin", "vhost1.example.com"}}]}.
```

## Getting Started
Install the module with: `npm install ejabberd`

## Documentation

### Before use this module, You need those knowledge.
* __Promise based API__

    Any value return from a public api is a `promise` object.

    More precie, it is follow the [Promise/A+](http://promises-aplus.github.com/promises-spec/) specification,
      and implemented in a nodejs module called [Q](https://github.com/kriskowal/q).

   I highly recommened to read the speicification and documents of aboves, if you are new to promise.

* __Basic knowledge about `ejabberd` and its configuration is also required__

###API

See [API](https://github.com/Wiredcraft/node-ejabberd/wiki/API)


## Examples
```js
var Ejabberd = require('ejabberd');
var e = new Ejabberd('ubuntu:apt', {
    checkerInterval : 1000
});

// The address of virtual host
var host = 'example.lvh.me';
var config = {host: host};

function test_ejabber() {
    // Add a virtual host to ejabberd's configuration then restart server
    var p1 = e.addVhost(host, config);

    p1.then(  // This return a promise
    // success
    function() {
    },
    // error
    function(err) {
    }
    );

    var username = 'Lorem';
    var password = 'secret';

    // Register a new use
    var p2 = e.register(username, host, password);

    p2.then(  // This is also a promise
    // success
    function() {
    },
    // error
    function(err) {
    }
    );
}

e.once('status', function(status) {
    test_ejabber();
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/gruntjs/grunt).

## License
Copyright (c) 2012 wiredcraft
Licensed under the MIT license.
