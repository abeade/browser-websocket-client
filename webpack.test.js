const path = require('path')
const ROOT = path.resolve(__dirname)
const root = path.join.bind(path, ROOT)

process.traceDeprecation = true

module.exports = function () {
  // noinspection WebpackConfigHighlighting
  return {
    mode: 'development',
    devtool: 'inline-source-map',
    resolve: {
      modules: [
        root('src/main'),
        root('node_modules')
      ]
    },
    module: {
      rules: [{
        test: /\.js$/,
        loader: 'babel-loader'
      }, {
        test: /\.scss$/,
        loader: ['raw-loader', 'sass-loader'],
        exclude: [root('src/index.html')]
      }, {
        test: /\.html$/,
        loader: 'raw-loader',
        exclude: [root('src/main/index.html')]
      }]
    }
  }
}
