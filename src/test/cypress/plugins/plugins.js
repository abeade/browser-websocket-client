const webpack = require('@cypress/webpack-preprocessor')

module.exports = (on, config) => {
  const options = {}
  on('file:preprocessor', webpack(options))
}
