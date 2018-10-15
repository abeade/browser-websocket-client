module.exports = function (config) {
  let webpackConfig = require('./webpack.test.js')({ env: 'test' })
  let configuration = {
    autoWatch: false,
    basePath: '.',
    browserConsoleLogOptions: {
      level: 'error'
    },
    browsers: [
      'Chrome'
    ],
    colors: true,
    client: {
      captureConsole: true
    },
    files: [
      'node_modules/jquery/dist/jquery.js',
      'node_modules/popper.js/dist/umd/popper.js',
      'node_modules/bootstrap/dist/js/bootstrap.js',
      'src/main/index.js',
      'src/test/index.spec.js'
    ],
    frameworks: ['jasmine'],
    htmlReporter: {
      outputDir: 'karma_html',
      templatePath: null,
      focusOnFailures: true,
      namedFiles: false,
      pageTitle: null,
      urlFriendlyName: false,
      reportName: 'Karma_Report',
      preserveDescribeNesting: false,
      foldAll: false
    },
    logLevel: config.LOG_ERROR,
    plugins: [
      'karma-chrome-launcher',
      'karma-html-reporter',
      'karma-jasmine',
      'karma-mocha-reporter',
      'karma-sourcemap-loader',
      'karma-webpack'
    ],
    port: 9876,
    preprocessors: {
      'src/main/index.js': ['sourcemap', 'webpack']
    },
    reporters: ['html', 'mocha'],
    singleRun: true,
    webpack: webpackConfig
  }
  config.set(configuration)
}
