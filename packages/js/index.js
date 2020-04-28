if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/core.min.js');
} else {
  module.exports = require('./dist/core.js');
}
