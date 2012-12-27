var winston = require('winston');

var config = {
  levels: {
    silly: 0,
    verbose: 1,
    info: 2,
    data: 3,
    warn: 4,
    debug: 5,
    error: 6
  },
  colors: {
    silly: 'magenta',
    verbose: 'cyan',
    info: 'green',
    data: 'grey',
    warn: 'yellow',
    debug: 'blue',
    error: 'red'
  }
};

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)({colorize: true}),
    //new (winston.transports.File)({ filename: 'somefile.log' })
  ]
});

var parseArray = function(string) {
  logger.debug('Parse string ' + string + ' to  array');

  //var arr = [];
  var raw = string.trim().split('\n');

  console.log(raw);

  // raw.forEach(function(s, i) {
  //   arr[i] = s.trim();
  // });

  return raw;
};

var parseObject = function(string) {
};

var ensureExt = function(name, ext) {
  ext = ext.replace(/\./g, '');

  return name.match(ext) ? name : name + '.' + ext;
};

exports.logger = logger;
exports.parseArray = parseArray;
exports.ensureExt = ensureExt;
