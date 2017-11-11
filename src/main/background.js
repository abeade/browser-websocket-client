/*
This functions in this file are only needed to open index.html when the user clicks on the toolbar icon.
It does not impact the WebSocket client itself.
 */

function extensionUrl () {
  let isFirefox = typeof InstallTrigger !== 'undefined'
  let extensionUrl = 'chrome-extension://' + location.host + '/index.html'
  if (isFirefox) {
    extensionUrl = 'moz-extension://' + location.host + '/index.html'
  }
  return extensionUrl
}

function isOptionsUrl (url) {
  return url === extensionUrl()
}

function goToOptions () {
  chrome.tabs.query({currentWindow: true}, function (tabs) {
    tabs.forEach(function (tab) {
      if (tab.url && isOptionsUrl(tab.url)) {
        chrome.tabs.update(tab.id, {selected: true})
      }
    })
    chrome.tabs.create({url: extensionUrl()})
  })
}

chrome.browserAction.onClicked.addListener(function () {
  goToOptions()
})
