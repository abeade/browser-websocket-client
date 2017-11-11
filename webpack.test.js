const path = require('path')
const ROOT = path.resolve(__dirname)
const root = path.join.bind(path, ROOT)

module.exports = function () {
  return {
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
        include: [
          root('src/main/index.js'),
          root('src/test/index.spec.js')
        ],
        exclude: [/node_modules/],
        loader: 'babel-loader'
      }, {
        test: /\.scss$/,
        loader: ['raw-loader', 'sass-loader'],
        exclude: [root('src/index.html')]
      }, {
        test: /\.html$/,
        loader: 'raw-loader',
        exclude: [root('src/main/index.html')]
      }, {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff'
      }, {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader'
      }]
    }
  }
}
