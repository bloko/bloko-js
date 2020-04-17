if (process.env.NODE_ENV === 'production') {
  module.exports = require('./core/index.js');
} else {
  module.exports = require('./core/index.min.js');
}
