var crypto = require('crypto');

module.exports.hashPassword = function (password) {
  var hash = crypto.createHash('sha256');

  return hash.update(password).digest('base64');
};
