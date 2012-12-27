module.exports.randomUsername = function() {
  return 'user' + parseInt(Math.random() * 100000000000000);
}

module.exports.randomHostname = function() {
  return 'host' + parseInt(Math.random() * 100000000000000);
}

module.exports.randomPassword = function() {
  var factor = parseInt(Math.random() * 10);
  var base = parseInt(Math.random() * 1000000000000);

  return ((base >> factor) + '').replace(/-/g, '');
}
