## Browser-WebSocket-Client

Browser WebSocket Client is an extension for Chrome and Firefox that provides a simple method for testing a WebSocket server. It allows you to send and receive raw JSON messages as well as save server URLs and messages for later use.

### TODO
- Add installation URL for Firefox

### Browser Installation

Chrome: [browser-websocket-client](https://chrome.google.com/webstore/detail/browser-websocket-client/mdmlhchldhfnfnkfmljgeinlffmdgkjo)

Firefox: []()

After installing look for the icon in the toolbar:

![icon](icons/icon_128.png?raw=true)

### Advantages

* Bootstrap 4 user interface
* Save server URLs and JSON messages for later use
* Pretty-print incoming JSON messages and saved messages

### Screenshots

#### Client Section

The screenshot below shows the extension on initial startup. Note that it consists of "Options" and "Client" sections.

![screenshot_1](screenshots/screenshot_1.png?raw=true)

The screenshot below shows a manually entered URL and the result of sending a message. Note the explanation under the "Received Messages" header.

![screenshot_2](screenshots/screenshot_2.png?raw=true)

#### JSON Pretty-Print

The screenshot below shows the result of clicking on an incoming message. The message is formatted as a JavaScript Object with a single color for keys and different colors for values based on the type: null, number, string, and boolean.

![screenshot_3](screenshots/screenshot_3.png?raw=true)

#### Options Section

The "Options" section allows you to save server URLs and messages that you can select from drop-down menus in the "Client" section. They are saved to [storage.sync](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/storage/sync) so they remain available after a browser restart. You can edit and delete both URLs and messages. Additionally, you can pretty-print a saved message body.

![screenshot_4](screenshots/screenshot_4.png?raw=true)

Below you can see an example of choosing a saved server URL and then a saved message.

![screenshot_5](screenshots/screenshot_5.png?raw=true)

### Manual Installation

Installing manually should only be necessary if you want to make changes to the extension and possibly submit a pull request. The instructions below assume you have [Node.js](https://nodejs.org/en/) installed.

```
cd /some/directory
git clone https://github.com/kensiprell/browser-websocket-client.git
cd browser-websocket-client
npm install
```

After ```npm``` finishes you can edit files as necessary, focusing on the files in the ```src/main/**``` and ```src/test``` directories although you probably don't need to make changes to ```background.js```.

The ```scripts``` section of ```package.json``` should be self explanatory. For example, if you want to test changes on Chrome, you would do the following from the project root directory (```/some/directory/browser-websocket-client```):

```
npm run build:chrome
```

Then you can load the unpacked extension using these [instructions](https://developer.chrome.com/extensions/getstarted#unpacked) and choosing the path below:

```
/some/directory/browser-websocket-client/build/dev/chrome
```

And for Firefox you could do the following from the project root directory:

```
npm run build:firefox
```

Then you can load the unpacked extension using these [instructions](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Temporary_Installation_in_Firefox) and choosing the path below:

```
/some/directory/browser-websocket-client/build/dev/firefox
```

Notes:

The JavaScript is written in ES6 using the jQuery framework.

Unit test report: ```karma_html/Karma_Report/index.html```

E2E test report: ```protractor_html/htmlReport_BrowserWebSocketClient.html```

### Inspiration

This extension was inspired by [Simple-WebSocket-Client](https://github.com/hakobera/Simple-WebSocket-Client).
