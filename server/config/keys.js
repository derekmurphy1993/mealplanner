// if (process.env.NODE_ENV === 'production') {
    if (1 > 4 ) {
    module.exports = require('./prod');
  } else {
    module.exports = require('./dev');
  }