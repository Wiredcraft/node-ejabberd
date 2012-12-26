# node-ejabberd

node interface to ejabberd

##Limitations
Essentially, what this module can do is just talk to `ejabberdclt` command, edit `ejabberd.cfg` file.

So if you don't have the permission to run `ejabberdclt` and to read/write in `/etc/ejabberd` config directoty, this module **wont** works for you.

On unix-like sytems, this means, you **must** have the `root` permission to use this module or to run the application that required this moduel.

## Getting Started
Install the module with: `npm install ejabberd`

## Documentation
_(Coming soon)_

## Examples
_(Coming soon)_

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [grunt](https://github.com/gruntjs/grunt).

## Release History
_(Nothing yet)_

## License
Copyright (c) 2012 wiredcraft  
Licensed under the MIT license.
