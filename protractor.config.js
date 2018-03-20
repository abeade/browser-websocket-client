const HtmlScreenshotReporter = require('protractor-jasmine2-html-reporter')
const reporter = new HtmlScreenshotReporter({
  savePath: './protractor_html',
  fileNameSeparator: '_',
  cleanDestination: true,
  showSummary: true,
  showQuickLinks: true,
  showConfiguration: true,
  consolidate: true,
  consolidateAll: false
})

exports.config = {
  capabilities: {
    browserName: 'chrome',
    chromeOptions: {
      args: [
        'load-extension=build/production/chrome'
      ]
    }
  },
  directConnect: true,
  framework: 'jasmine',
  jasmineNodeOpts: {
    showColors: true
  },
  onPrepare: function () {
    jasmine.getEnv().addReporter(reporter)
  },
  specs: ['src/test/index.e2e.js']
}
