import fontawesome from '@fortawesome/fontawesome'
import faPencilAlt from '@fortawesome/fontawesome-free-solid/faPencilAlt'
import faPrint from '@fortawesome/fontawesome-free-solid/faPrint'
import faTrashAlt from '@fortawesome/fontawesome-free-solid/faTrashAlt'
require('jquery')
require('popper.js')
require('bootstrap/js/src/button')
require('bootstrap/js/src/collapse')
require('bootstrap/js/src/modal')
require('bootstrap/js/src/tooltip')
require('bootstrap/js/src/util')

// Add Font Awesome icons to its library
fontawesome.library.add(
  faPencilAlt,
  faPrint,
  faTrashAlt
)

window.app = {}
const APP = window.app
APP.savedOptions = {
  urls: [],
  messages: []
}
const SEPARATOR = '\u0007'
const messageTableRow = `
<div class="bwc-table-row rounded">
  <span>
    REPLACE_NAME
  </span>
  <span class="deleteMessage bwc-table-row-icon float-right" data-toggle="tooltip" data-placement="top" title="Click to delete this message" data-message='REPLACE_ALL'>
      <i class="fa fa-trash-alt" aria-hidden="true"></i>
  </span>
  <span class="editMessage bwc-table-row-icon float-right" data-toggle="tooltip" data-placement="top" title="Click to edit this message" data-message='REPLACE_ALL'>
    <i class="fa fa-pencil-alt" aria-hidden="true"></i>
  </span>
  <span class="printMessage bwc-table-row-icon float-right" data-toggle="tooltip" data-placement="top" title="Click to pretty-print this message" data-message='REPLACE_ALL'>
    <i class="fa fa-print" aria-hidden="true"></i>
  </span>
</div>
`
const urlTableRow = `
<div class="bwc-table-row rounded">
  <span>
    REPLACE_URL
  </span>
  <span class="deleteUrl bwc-table-row-icon float-right" data-toggle="tooltip" data-placement="top" title="Click to delete this URL" data-url='REPLACE_URL'>
    <i class="fa fa-trash-alt" aria-hidden="true"></i>
  </span>
  <span class="editUrl bwc-table-row-icon float-right" data-toggle="tooltip" data-placement="top" title="Click to edit this URL" data-url='REPLACE_URL'>
    <i class="fa fa-pencil-alt" aria-hidden="true"></i>
  </span>
</div>
`
const clearMessagesButton = $('#clearMessagesButton')
const client = $('#client')
const connectButton = $('#connectButton')
const connectionStatus = $('#connectionStatus')
const deleteModal = $('#deleteModal')
const deleteModalBody = $('#deleteModalBody')
const deleteModalCancelButton = $('#deleteModalCancelButton')
const deleteModalDeleteButton = $('#deleteModalDeleteButton')
const deleteModalName = $('#deleteModalName')
const disconnectButton = $('#disconnectButton')
const jsonModal = $('#jsonModal')
const jsonModalBody = $('#jsonModalBody')
const jsonModalTitle = $('#jsonModalTitle')
const messageJsonInvalidWarning = $('#messageJsonInvalidWarning')
const messages = $('#messages')
const messageSelect = $('#messageSelect')
const messageSendButton = $('#messageSendButton')
const messageTextarea = $('#messageTextarea')
const options = $('#options')
const optionsMessageCancelEditButton = $('#optionsMessageCancelEditButton')
const optionsMessageJsonInvalidWarning = $('#optionsMessageJsonInvalidWarning')
const optionsMessageNameInput = $('#optionsMessageNameInput')
const optionsMessageNameInputLabel = $('#optionsMessageNameInputLabel')
const optionsMessageNameInvalid = $('#optionsMessageNameInvalid')
const optionsMessageNoneSaved = $('#optionsMessageNoneSaved')
const optionsMessageSaveButton = $('#optionsMessageSaveButton')
const optionsMessageSavedTable = $('#optionsMessageSavedTable')
const optionsMessageStatus = $('#optionsMessageStatus')
const optionsMessageTextarea = $('#optionsMessageTextarea')
const optionsMessageTextareaEmpty = $('#optionsMessageTextareaEmpty')
const optionsUrlCancelEditButton = $('#optionsUrlCancelEditButton')
const optionsUrlInput = $('#optionsUrlInput')
const optionsUrlInputEmpty = $('#optionsUrlInputEmpty')
const optionsUrlInputLabel = $('#optionsUrlInputLabel')
const optionsUrlInvalidWarning = $('#optionsUrlInvalidWarning')
const optionsUrlNoneSaved = $('#optionsUrlNoneSaved')
const optionsUrlSaveButton = $('#optionsUrlSaveButton')
const optionsUrlSavedTable = $('#optionsUrlSavedTable')
const optionsUrlStatus = $('#optionsUrlStatus')
const urlInput = $('#urlInput')
const urlSelect = $('#urlSelect')
const url = document.location.toString()
let editingUrl = false
let editingUrlTarget = ''
let editingMessage = false
let editingMessageTarget = ''
let isCtrlKey = false
let ws = null
let wsPoliteDisconnection = false

// Used only by background.js to show the options card
// when user chooses extension options in browser settings
if (url.match(/#options/)) {
  client.removeClass('show')
  options.addClass('show')
}

// Hide some elements on startup
$('.hide').hide()

// OPTIONS SECTION

// Save options to storage
APP.saveOptions = function () {
  chrome.storage.sync.set({
    'savedOptions': APP.savedOptions
  }, function () {
    APP.loadOptions()
  })
}

// Delete from APP.savedOptions
APP.savedOptionsDelete = function (option, target) {
  let messages, urls
  switch (option) {
    case 'message':
      messages = APP.savedOptions.messages.filter(e => e !== target)
      urls = APP.savedOptions.urls ? APP.savedOptions.urls : []
      break
    case 'url':
      messages = APP.savedOptions.messages ? APP.savedOptions.messages : []
      urls = APP.savedOptions.urls.filter(e => e !== target)
      break
    default:
      return false
  }
  APP.savedOptions.messages = messages
  APP.savedOptions.urls = urls
}

// Fetch extension options from storage and update all related objects and elements
APP.loadOptions = function () {
  chrome.storage.sync.get('savedOptions', function (result) {
    if (result['savedOptions']) {
      APP.savedOptions = result['savedOptions']
    }
    if (APP.savedOptions.urls.length > 0) {
      APP.populateUrlTable()
      APP.populateSavedUrlSelect()
      optionsUrlNoneSaved.hide()
      optionsUrlSavedTable.show()
      urlSelect.show()
    } else {
      optionsUrlNoneSaved.show()
      optionsUrlSavedTable.hide()
      urlSelect.hide()
    }
    if (APP.savedOptions.messages.length > 0) {
      APP.populateMessageTable()
      APP.populateSavedMessageSelect()
      messageSelect.show()
      optionsMessageNoneSaved.hide()
      optionsMessageSavedTable.show()
    } else {
      messageSelect.hide()
      optionsMessageNoneSaved.show()
      optionsMessageSavedTable.hide()
    }
  })
}

// OPTIONS: URL PERSISTENCE

// Populate the saved URLs table
APP.populateUrlTable = function () {
  let table = ''
  let urls = APP.savedOptions.urls.sort()
  $.each(urls, function (key, url) {
    table += urlTableRow.replace(/REPLACE_URL/g, url)
  })
  optionsUrlSavedTable
    .html('')
    .append(table)
  $('.editUrl').on('click', function () {
    APP.editUrl(jQuery(this).data('url'))
  })
  $('.deleteUrl').on('click', function () {
    APP.deleteUrl(jQuery(this).data('url'))
  })
  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })
}

// Enable URL save button if input is not empty
optionsUrlInput.keyup(function () {
  if (optionsUrlInput.val().length > 0) {
    optionsUrlInputEmpty.hide()
    optionsUrlSaveButton.prop('disabled', false)
  } else {
    optionsUrlInputEmpty.show()
    optionsUrlSaveButton.prop('disabled', true)
  }
})

// Validate URL input on input change
optionsUrlInput.keyup(function () {
  if (APP.isValidUrl(optionsUrlInput.val())) {
    optionsUrlInvalidWarning.hide()
  } else {
    optionsUrlInvalidWarning.show()
  }
})

// Test if URL begins with ws:// or wss:// and has no spaces
APP.isValidUrl = function (url) {
  return /^(ws|wss):\/\/[^ "]+$/.test(url)
}

// Copy a saved URL to the input element and show cancel button
APP.editUrl = function (url) {
  editingUrl = true
  editingUrlTarget = url
  optionsUrlCancelEditButton.show()
  optionsUrlInput.val(url)
  optionsUrlInputEmpty.hide()
  optionsUrlInputLabel.text(`Editing URL: ${url}`)
  optionsUrlInvalidWarning.hide()
  optionsUrlSaveButton.prop('disabled', false)
  optionsUrlStatus.hide()
}

// Delete a saved URL from storage
APP.deleteUrl = function (url) {
  deleteModalBody.text('Are you sure you want to delete the URL shown below?')
  deleteModalName.text(url)
  deleteModalDeleteButton.show()
  deleteModalDeleteButton
    .data('target', url)
    .on('click', function () {
      const url = jQuery(this).data('target')
      APP.savedOptionsDelete('url', url)
      APP.saveOptions()
      deleteModalBody.text('URL deleted:')
      deleteModalName.text(url)
      deleteModalDeleteButton.hide()
      deleteModalCancelButton.text('Close')
    })
  deleteModal.modal('show')
}

// Cancel URL edit and reset variables
optionsUrlCancelEditButton.click(function () {
  editingUrl = false
  editingUrlTarget = ''
  optionsUrlInput.val('')
  optionsUrlInputLabel.text('URL:')
  optionsUrlInputEmpty.hide()
  optionsUrlInvalidWarning.hide()
  optionsUrlSaveButton.prop('disabled', true)
})

// Persist URL to storage on save button click
optionsUrlSaveButton.click(function () {
  let url = optionsUrlInput.val()
  if (editingUrl) {
    APP.savedOptionsDelete('url', editingUrlTarget)
  } else {
    APP.savedOptionsDelete('url', url)
  }
  APP.savedOptions.urls.push(url)
  APP.saveOptions()
  optionsUrlInput.val('')
  optionsUrlInputLabel.text('URL:')
  optionsUrlSaveButton.prop('disabled', true)
  optionsUrlStatus
    .text('URL saved.')
    .show()
})

// OPTIONS: MESSAGE PERSISTENCE

// Populate the saved messages table
APP.populateMessageTable = function () {
  let messages = APP.savedOptions.messages.sort()
  let table = ''
  $.each(messages, function (key, message) {
    const [name, body] = message.split(SEPARATOR)
    table += messageTableRow
      .replace(/REPLACE_ALL/g, message)
      .replace(/REPLACE_MESSAGE/g, body)
      .replace(/REPLACE_NAME/g, name)
  })
  optionsMessageSavedTable
    .html('')
    .append(table)
  $('.printMessage').on('click', function () {
    APP.printMessage(jQuery(this).data('message'))
  })
  $('.editMessage').on('click', function () {
    APP.editMessage(jQuery(this).data('message'))
  })
  $('.deleteMessage').on('click', function () {
    APP.deleteMessage(jQuery(this).data('message'))
  })
  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })
}

// Test a string to determine if it is valid JSON
APP.isValidJson = function (string) {
  try {
    const test = JSON.parse(string)
    if (test && typeof test === 'object') {
      return true
    }
  } catch (e) { }
  return false
}

// Format JSON for pretty-print modal
APP.syntaxHighlight = function (json) {
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
    let cls = 'bwc-number'
    if (/^"/.test(match)) {
      if (/:$/.test(match)) {
        cls = 'bwc-key'
      } else {
        cls = 'bwc-string'
      }
    } else if (/true|false/.test(match)) {
      cls = 'bwc-boolean'
    } else if (/null/.test(match)) {
      cls = 'bwc-null'
    }
    return `<span class="${cls}">${match}</span>`
  })
}

// Enable message save button if inputs are not empty
APP.validateMessage = function () {
  if (optionsMessageNameInput.val().length > 0 && optionsMessageTextarea.val().length > 0) {
    optionsMessageSaveButton.prop('disabled', false)
  } else {
    optionsMessageSaveButton.prop('disabled', true)
  }
}

// Show, hide elements on display name input change
optionsMessageNameInput.keyup(function () {
  if (optionsMessageNameInput.val().length > 0) {
    optionsMessageNameInvalid.hide()
    APP.validateMessage()
  } else {
    optionsMessageNameInvalid.show()
  }
})

// Show, hide elements on message body input change
optionsMessageTextarea.keyup(function () {
  if (optionsMessageTextarea.val().length > 0) {
    optionsMessageTextareaEmpty.hide()
    APP.validateMessage()
  } else {
    optionsMessageTextareaEmpty.show()
  }
})

// Show, hide invalid JSON warning based on message body input
optionsMessageTextarea.keyup(function () {
  if (APP.isValidJson(optionsMessageTextarea.val())) {
    optionsMessageJsonInvalidWarning.hide()
  } else {
    optionsMessageJsonInvalidWarning.show()
  }
})

// Pretty-print a saved message body
APP.printMessage = function (message) {
  const [name, body] = message.split(SEPARATOR)
  const json = JSON.parse(body)
  const html = $('<pre>').html(APP.syntaxHighlight(JSON.stringify(json, null, 2)))
  jsonModalTitle.html(name)
  jsonModalBody.html(html)
  jsonModal.modal('show')
}

// Copy a saved message to the input elements
APP.editMessage = function (message) {
  const [name, body] = message.split(SEPARATOR)
  editingMessage = true
  editingMessageTarget = message
  optionsMessageCancelEditButton.show()
  optionsMessageTextareaEmpty.hide()
  optionsMessageNameInput.val(name)
  optionsMessageNameInputLabel.text(`Editing message: ${name}`)
  optionsMessageNameInvalid.hide()
  optionsMessageSaveButton.prop('disabled', false)
  optionsMessageStatus.hide()
  optionsMessageTextarea.val(body)
}

// Delete a saved message from storage
APP.deleteMessage = function (all) {
  const name = all.split(SEPARATOR)[0]
  deleteModalBody.text('Are you sure you want to delete the message shown below?')
  deleteModalName.text(name)
  deleteModalDeleteButton.show()
  deleteModalDeleteButton
    .data('target', all)
    .on('click', function () {
      const message = jQuery(this).data('target')
      APP.savedOptionsDelete('message', message)
      APP.saveOptions()
      deleteModalBody.text('Message deleted:')
      deleteModalName.text(name)
      deleteModalDeleteButton.hide()
      deleteModalCancelButton.text('Close')
    })
  deleteModal.modal('show')
}

// Cancel message edit and reset variables
optionsMessageCancelEditButton.click(function () {
  editingMessage = false
  editingMessageTarget = ''
  optionsMessageTextareaEmpty.hide()
  optionsMessageJsonInvalidWarning.hide()
  optionsMessageNameInput.val('')
  optionsMessageNameInputLabel.text(`Display Name:`)
  optionsMessageNameInvalid.hide()
  optionsMessageSaveButton.prop('disabled', true)
  optionsMessageStatus.hide()
  optionsMessageTextarea.val('')
})

// Persist URL to storage on save button click
optionsMessageSaveButton.click(function () {
  const name = optionsMessageNameInput.val()
  const body = optionsMessageTextarea.val()
  const message = `${name}${SEPARATOR}${body}`
  if (editingMessage) {
    APP.savedOptionsDelete('message', editingMessageTarget)
  } else {
    APP.savedOptionsDelete('message', message)
  }
  APP.savedOptions.messages.push(message)
  APP.saveOptions()
  optionsMessageTextareaEmpty.hide()
  optionsMessageJsonInvalidWarning.hide()
  optionsMessageNameInput.val('')
  optionsMessageNameInputLabel.text(`Display Name:`)
  optionsMessageNameInvalid.hide()
  optionsMessageSaveButton.prop('disabled', true)
  optionsMessageStatus
    .text('Message saved.')
    .show()
  optionsMessageTextarea.val('')
})

// CLIENT SECTION

// Populate URL select menu
APP.populateSavedUrlSelect = function () {
  const urls = APP.savedOptions.urls.sort()
  let options = '<option selected>Saved connections</option>'
  $.each(urls, function (key, url) {
    options += `<option value='${url}'>${url}</option>`
  })
  urlSelect
    .html('')
    .append(options)
}

// Enable and disable connect button based on URL input length
urlInput.keyup(function () {
  if (urlInput.val().length === 0) {
    connectButton.prop('disabled', true)
  } else {
    connectButton.prop('disabled', false)
  }
})

// Update URL input value on select menu change
urlSelect.on('change', function () {
  connectButton.prop('disabled', false)
  urlInput.val(this.value)
})

// Populate message select menu
APP.populateSavedMessageSelect = function () {
  const messages = APP.savedOptions.messages.sort()
  let options = '<option selected>Saved messages</option>'
  $.each(messages, function (key, message) {
    const [name, body] = message.split(SEPARATOR)
    options += `<option value='${body}'>${name}</option>`
  })
  messageSelect
    .html('')
    .append(options)
}

// Populate message textarea on select menu change
messageSelect.on('change', function () {
  messageTextarea.val(this.value)
})

// Clear message log
clearMessagesButton.click(function () {
  messages.html('')
  clearMessagesButton.prop('disabled', true)
})

// CLIENT: WEBSOCKET

// Open WebSocket connection
APP.open = function () {
  let url = urlInput.val()
  ws = new WebSocket(url)
  ws.onopen = APP.onOpen
  ws.onclose = APP.onClose
  ws.onmessage = APP.onMessage
  ws.onerror = APP.onError
  connectionStatus.text('OPENING CONNECTION ...')
}

// Close WebSocket connection
APP.close = function () {
  if (ws) {
    console.log('CLOSING CONNECTION ...')
    wsPoliteDisconnection = true
    ws.close()
  }
}

// WebSocket onOpen handler
APP.onOpen = function () {
  console.log('OPENED: ' + urlInput.val())
  connectButton.hide()
  connectionStatus.text('OPENED')
  disconnectButton.show()
  messageSendButton.prop('disabled', false)
  urlInput.prop('disabled', true)
  wsPoliteDisconnection = false
}

// WebSocket onClose handler
APP.onClose = function () {
  const disconnectionMessage = 'CLOSED';
  disconnectionMessage += (wsPoliteDisconnection) ? '' : '. Disconnected by the server.';
  console.log('CLOSED: ' + urlInput.val())
  ws = null
  connectButton.show()
  connectionStatus.text(disconnectionMessage)
  disconnectButton.hide()
  messageSendButton.prop('disabled', true)
  urlInput.prop('disabled', false)
}

// WebSocket onMessage handler
APP.onMessage = function (event) {
  APP.addMessage(event.data)
}

// WebSocket onError handler
APP.onError = function (event) {
  console.error(event.data)
}

// Add outgoing and incoming message to DOM, formatting as necessary
// Format incoming messages to open JSON pretty-print modal on click
APP.addMessage = function (data, type) {
  let message, messageBox
  if (type === 'SENT') {
    message = $('<pre>')
      .attr('class', 'bwc-sent')
      .text(data)
  } else {
    message = $('<pre>')
      .attr('class', 'bwc-pointer bwc-received')
      .text(data)
      .data('target', data)
      .on('click', function () {
        let body
        if (APP.isValidJson(jQuery(this).data('target'))) {
          const target = jQuery(this).data('target')
          const json = JSON.parse(target)
          body = $('<pre>').html(APP.syntaxHighlight(JSON.stringify(json, null, 2)))
        } else {
          body = $('<p>').text('The incoming message cannot be parsed into valid JSON.')
        }
        jsonModalBody.html(body)
        jsonModal.modal('show')
      })
  }
  messages.append(message)
  clearMessagesButton.prop('disabled', false)
  messageBox = messages.get(0)
  while (messageBox.childNodes.length > 500) {
    messageBox.removeChild(messageBox.firstChild)
  }
  messageBox.scrollTop = messageBox.scrollHeight
}

// Add outgoing message to DOM and send it to server
APP.sendMessage = function () {
  let message = messageTextarea.val()
  APP.addMessage(message, 'SENT')
  ws.send(message)
}

// Connect button click
connectButton.click(function () {
  APP.close()
  APP.open()
})

// Disconnect button click
disconnectButton.click(function () {
  APP.close()
})

// Send message button click
messageSendButton.click(function () {
  APP.sendMessage()
})

// Allow Ctrl+Enter shortcut to send message from message body textarea
// Test if message body is valid JSON on textarea keyup
messageTextarea.keyup(function (e) {
  if (e.which === 17) {
    isCtrlKey = true
  } else {
    isCtrlKey = false
    if (APP.isValidJson(messageTextarea.val())) {
      messageJsonInvalidWarning.hide()
    } else {
      messageJsonInvalidWarning.show()
    }
  }
}).keydown(function (e) {
  if (e.which === 17) isCtrlKey = true
  if (e.which === 13 && isCtrlKey === true) {
    APP.sendMessage()
  }
})

// Prevent tests from failing
if (typeof chrome.storage !== 'undefined') {
  APP.loadOptions()
}
