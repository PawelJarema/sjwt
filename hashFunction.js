const sha256 = require('simple-sha256')
module.exports = (str) => sha256.sync(str)