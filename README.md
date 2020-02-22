## Browser-WebSocket-Client

Browser WebSocket Client is an extension for Chrome ~~and Firefox~~ that provides a simple method for testing a WebSocket server. It allows you to send and receive raw JSON messages as well as save server URLs, protocols, and messages for later use.

### Release Notes

See the [release notes](https://github.com/kensiprell/browser-websocket-client/releases) for the latest changes.

### Browser Installation

Chrome: [https://chrome.google.com/webstore/detail/browser-websocket-client/mdmlhchldhfnfnkfmljgeinlffmdgkjo](https://chrome.google.com/webstore/detail/browser-websocket-client/mdmlhchldhfnfnkfmljgeinlffmdgkjo)

~~Firefox:~~ 

Look for the blue WebSocket icon in the toolbar after installation:

![icon](icons/icon_048.png?raw=true)

### Advantages

* Intuitive Bootstrap 4 user interface
* Save server URLs, protocols, and messages for later use
* Login to Chrome or Mozilla and your saved settings will be synced across different devices
* Pretty-print incoming JSON messages and saved message bodies

## Description and Screenshots

### Client Section

The screenshot below shows the "Client" section in use with a pretty-printed message modal on top. The message is formatted as a JavaScript Object with a single color for keys and different colors for values based on the type: boolean, null, number, and string.

![screenshot_1](screenshots/chrome/screenshot_1.png?raw=true)

### Options Section

All user options are saved using [storage.sync](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/API/storage/sync) which allows you to login to [Chrome](https://accounts.google.com) or [Mozilla](https://www.mozilla.org/en-US/firefox/accounts/)  and sync your settings across different devices. Your settings also remain available locally after a browser restart even if you do not login with a Chrome or Mozilla account.

#### Preferences

The screenshot below shows the "Preferences" section. It allows you to control the following four functions:
* Allow or prevent saving invalid URLs in the Options section
* Allow or prevent using invalid URLs in the Client section
* Allow or prevent saving message bodies with invalid JSON in the Options section
* Allow or prevent using message bodies with invalid JSON Client section

![screenshot_2](screenshots/chrome/screenshot_2.png?raw=true)

#### Server URLs

The screenshot below shows the "Server URLs" section. It allows you to save URLs that you can use later in the Client section by selecting them from a dropdown menu. You can create, edit, and delete URLs. When creating or editing a URL you will receive a warning if the URL does not begin with `ws://` or `wss://` or if the URL contains spaces.

![screenshot_3](screenshots/chrome/screenshot_3.png?raw=true)

#### Server Protocols

The screenshot below shows the "Server Protocols" section. It allows you to save URLs that you can use later in the Client section by selecting them from a dropdown menu. You can create, edit, and delete protocols.

![screenshot_4](screenshots/chrome/screenshot_4.png?raw=true)

#### Messages

The screenshot below shows the "Messages" section. It allows you to save message names and bodies that you can use later in the Client section by selecting the message name from a dropdown menu. You can create, edit, and delete messages. You will receive a warning if the message body is not valid JSON. Note the toggle switch under the message body textarea. Use it to change the JSON formatting from single line to multi-line and vice versa. 

![screenshot_5](screenshots/chrome/screenshot_5.png?raw=true)

#### Configuration Export and Import

The screenshot below shows the "Configuration Export and Import" section. It allows you to export and import the whole plugin configuration including stored preferences, server URLs, server protocols and messages. This way you can easily backup and share your configuration. 

![screenshot_5](screenshots/chrome/screenshot_6.png?raw=true)

## Manual Installation

Installing manually should only be necessary if you want to make changes to the extension and possibly submit a pull request. The instructions below assume you have [Node.js](https://nodejs.org/en/) installed.

```
cd /some/directory
git clone https://github.com/kensiprell/browser-websocket-client.git
cd browser-websocket-client
npm install
```

After ```npm``` finishes you can edit files as necessary, focusing on the files in the ```src/main/**``` and ```src/test/cypress/integration``` directories although you probably don't need to make changes to ```background.js```.

The ```scripts``` section of ```package.json``` should be self explanatory. For example, if you want to test changes on Chrome, you would do the following from the project root directory (```/some/directory/browser-websocket-client```):

```
npm run build:chrome
```

Then you can load the unpacked extension using these [instructions](https://developer.chrome.com/extensions/getstarted#unpacked) and choosing the path below:

```
/some/directory/browser-websocket-client/build/dev/chrome
```

~~And for Firefox you could do the following from the project root directory:~~

```
npm run build:firefox
```

Then you can load the unpacked extension using these [instructions](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Temporary_Installation_in_Firefox) and choosing the path below:

```
/some/directory/browser-websocket-client/build/dev/firefox
```

## Development Notes

The JavaScript is written in ES6.
 
[jQuery](https://jquery.com) and [Bootstrap](https://getbootstrap.com) provide the heavy lifting.

[Cypress](https://www.cypress.io) does all the testing.

To run the tests:

* Start [Serve](https://github.com/zeit/serve) using `npx serve` on the prject root folder
* Execute `npx cypress open` in the tests folder at `src/test`

## Inspiration

This extension was inspired by [Simple-WebSocket-Client](https://github.com/hakobera/Simple-WebSocket-Client).

The `highlightJson` function came from this [stackoverflow answer](https://stackoverflow.com/a/7220510/1705701).
