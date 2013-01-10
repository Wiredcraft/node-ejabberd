# node-ejabberd

nodejs bridge to ejabberd

##Limitations
Essentially, what this module can do is just talk to `ejabberdclt` command, edit `ejabberd.cfg` file.

So if you don't have the permission to run `ejabberdclt` and to read/write in `/etc/ejabberd` config directoty, this module **wont** works for you.

On unix-like sytems, this means, you **must** have the `root` permission to use this module or to run the application that required this moduel.

__In the simple words, you are fully reponsed to make sure this module can tale to ejabberd.__

### Passed tests on those OSes

* ubuntu 12.04


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
var e = new Ejabberd('/etc/ejabberd/');

var host = 'chat.example.com';
var config = {host: host};

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
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/gruntjs/grunt).

## Release History
* 2013/01/03: **0.1.0**
  
  Initial release


* 2013/01/04: **0.1.2**

  1, enhance restart by force at 'sleep' time.


* 2013/01/07: **0.1.3**

  1, Dose exist when encaurage error.


* 2013/01/08: **0.1.4**

  1, allow re-add host

  2, make log optional


* 2013/01/08: **0.1.5**

  1, more demo

  2, fixed removeVhost


* 2013/01/09: **0.1.6**

  1, add arguments checker for public api methods


* 2013/01/10: **0.1.7**

  1, clean up

  2, sleep function


## License
Copyright (c) 2012 wiredcraft  
Licensed under the MIT license.
