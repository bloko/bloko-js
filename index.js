if (process.env.NODE_ENV === 'production') {
  module.exports = require('./dist/bloko.min.js');
} else {
  module.exports = require('./dist/bloko.js');
}
