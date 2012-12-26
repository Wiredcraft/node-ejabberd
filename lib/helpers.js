var winston = require('winston');

exports.logger = new (winston.Logger)({
  transports: [
    new (winston.transports.Console)(),
    //new (winston.transports.File)({ filename: 'somefile.log' })
  ]
});
