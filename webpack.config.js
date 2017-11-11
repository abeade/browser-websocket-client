const merge = require('webpack-merge')
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const GenerateJsonPlugin = require('generate-json-webpack-plugin')
const MinifyPlugin = require('babel-minify-webpack-plugin')
const path = require('path')
const ROOT = path.resolve(__dirname)
const root = path.join.bind(path, ROOT)
const version = require('./src/manifest/common.json').version

module.exports = function (env) {
  const [mode, platform] = env.split(':')
  let buildPath = root('build/' + mode + '/' + platform)

  const config = {
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
      loaders: [
        {
          test: /\.js$/,
          exclude: [
            /node_modules/,
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
        }, {
          test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: 'url-loader?limit=10000&mimetype=application/font-woff'
        }, {
          test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: 'file-loader'
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
      new webpack.ProvidePlugin({
        $: 'jquery',
        jQuery: 'jquery'
      }),
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
  if (mode === 'prod') {
    config.plugins = config.plugins.concat([
      new MinifyPlugin()
    ])
  }
  return config
}
