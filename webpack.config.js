const CopyWebpackPlugin = require('copy-webpack-plugin')
const GenerateJsonPlugin = require('generate-json-webpack-plugin')
const merge = require('webpack-merge')
const path = require('path')
const ROOT = path.resolve(__dirname)
const root = path.join.bind(path, ROOT)
const version = require('./src/manifest/common.json').version

process.traceDeprecation = true

module.exports = function (env) {
  const environment = env.toString().split(':')
  let mode = environment[0] ? environment[0] : 'development'
  let platform = environment[1] ? environment[1] : 'chrome'
  let buildPath = root('build/' + mode + '/' + platform)

  // noinspection WebpackConfigHighlighting
  return {
    mode: mode,
    entry: {
      'index': './src/main/index.js',
      'background': './src/main/background.js',
      'styles': './src/main/styles/custom.scss'
    },
    output: {
      path: buildPath,
      filename: '[name].js',
      sourceMapFilename: '[name].js.map'
    },
    devtool: 'source-map',
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: [
            /\.spec\.js$/
          ],
          loader: 'babel-loader'
        }, {
           test: /\.(scss)$/,
          use: [{
            loader: 'style-loader'
          }, {
            loader: 'css-loader'
          }, {
            loader: 'postcss-loader',
            options: {
              plugins: function () {
                return [
                  require('precss'),
                  require('autoprefixer')
                ]
              }
            }
          }, {
            loader: 'sass-loader'
          }]
        }
      ]
    },
    resolve: {
      modules: [
        root('src'),
        root('node_modules')
      ]
    },
    plugins: [
      new CopyWebpackPlugin([
        {
          from: 'icons', to: buildPath
        }, {
          from: 'src/main/index.html', to: buildPath
        }
      ]),
      new GenerateJsonPlugin('manifest.json', merge(
        require('./src/manifest/common.json'),
        require(`./src/manifest/${platform}.json`),
        {version}
      ), null, 2)
    ]
  }
}
