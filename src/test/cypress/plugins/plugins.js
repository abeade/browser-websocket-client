const webpack = require('@cypress/webpack-preprocessor')
const webpackOptions = require('../../../../webpack.config')

module.exports = (on, config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  const options = {
    webpackOptions: webpackOptions,
    watchOptions: {}
  }
  on('file:preprocessor', webpack(options))
}
