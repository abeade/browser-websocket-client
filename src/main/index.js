import fontawesome from '@fortawesome/fontawesome'
import faPencilAlt from '@fortawesome/fontawesome-free-solid/faPencilAlt'
import faPrint from '@fortawesome/fontawesome-free-solid/faPrint'
import faTrashAlt from '@fortawesome/fontawesome-free-solid/faTrashAlt'

require('jquery')
require('popper.js')
require('bootstrap/js/src/button')
require('bootstrap/js/src/collapse')
require('bootstrap/js/src/dropdown')
require('bootstrap/js/src/modal')
require('bootstrap/js/src/tooltip')
require('bootstrap/js/src/util')

// Add Font Awesome icons to its library
fontawesome.library.add(
  faPencilAlt,
  faPrint,
  faTrashAlt
)

// Set namespace
window.app = {}
const APP = window.app

// Define savedOptions object
APP.savedOptions = {
  messages: [],
  protocols: [],
  urls: []
}

// Use Unicode BELL character as string separator
const SEPARATOR = '\u0007'

// HTML snippets for saved table row items
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
const protocolTableRow = `
<div class="bwc-table-row rounded">
  <span>
    REPLACE_PROTOCOL
  </span>
  <span class="deleteProtocol bwc-table-row-icon float-right" data-toggle="tooltip" data-placement="top" title="Click to delete this protocol" data-protocol='REPLACE_PROTOCOL'>
    <i class="fa fa-trash-alt" aria-hidden="true"></i>
  </span>
  <span class="editProtocol bwc-table-row-icon float-right" data-toggle="tooltip" data-placement="top" title="Click to edit this protocol" data-protocol='REPLACE_PROTOCOL'>
    <i class="fa fa-pencil-alt" aria-hidden="true"></i>
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

// Options HTML elements
const deleteModal = $('#deleteModal')
const deleteModalBody = $('#deleteModalBody')
const deleteModalCancelButton = $('#deleteModalCancelButton')
const deleteModalDeleteButton = $('#deleteModalDeleteButton')
const deleteModalName = $('#deleteModalName')
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
const optionsMessageTextareaFormatSlider = $('#optionsMessageTextareaFormatSlider')
const optionsMessageTextareaFormatToggle = $('#optionsMessageTextareaFormatToggle')
const optionsProtocolCancelEditButton = $('#optionsProtocolCancelEditButton')
const optionsProtocolInput = $('#optionsProtocolInput')
const optionsProtocolInputEmpty = $('#optionsProtocolInputEmpty')
const optionsProtocolInputLabel = $('#optionsProtocolInputLabel')
const optionsProtocolNoneSaved = $('#optionsProtocolNoneSaved')
const optionsProtocolSaveButton = $('#optionsProtocolSaveButton')
const optionsProtocolSavedTable = $('#optionsProtocolSavedTable')
const optionsProtocolStatus = $('#optionsProtocolStatus')
const optionsUrlCancelEditButton = $('#optionsUrlCancelEditButton')
const optionsUrlInput = $('#optionsUrlInput')
const optionsUrlInputEmpty = $('#optionsUrlInputEmpty')
const optionsUrlInputLabel = $('#optionsUrlInputLabel')
const optionsUrlInvalidWarning = $('#optionsUrlInvalidWarning')
const optionsUrlNoneSaved = $('#optionsUrlNoneSaved')
const optionsUrlSaveButton = $('#optionsUrlSaveButton')
const optionsUrlSavedTable = $('#optionsUrlSavedTable')
const optionsUrlStatus = $('#optionsUrlStatus')

// Client HTML elements
const clearMessagesButton = $('#clearMessagesButton')
const client = $('#client')
const connectButton = $('#connectButton')
const connectionStatus = $('#connectionStatus')
const disconnectButton = $('#disconnectButton')
const jsonModal = $('#jsonModal')
const jsonModalBody = $('#jsonModalBody')
const jsonModalTitle = $('#jsonModalTitle')
const messageJsonInvalidWarning = $('#messageJsonInvalidWarning')
const messages = $('#messages')
const messageSelect = $('#messageSelect')
const messageSelectOptions = $('#messageSelectOptions')
const messageSendButton = $('#messageSendButton')
const messageTextarea = $('#messageTextarea')
const messageTextareaFormatToggle = $('#messageTextareaFormatToggle')
const messageTextareaFormatSlider = $('#messageTextareaFormatSlider')
const protocolInput = $('#protocolInput')
const protocolSelect = $('#protocolSelect')
const protocolSelectOptions = $('#protocolSelectOptions')
const urlInput = $('#urlInput')
const urlSelect = $('#urlSelect')
const urlSelectOptions = $('#urlSelectOptions')

// Immutable variables
const url = document.location.toString()
const optionsUrlInputLabelDefaultText = 'The URL should begin with <code>ws://</code> or <code>wss://</code>:'
const optionsMessageNameInputLabelDefaultText = 'The display name appears in the "Saved Messages" table and client drop-down menu:'
const optionsProtocolInputLabelDefaultText = 'Enter a single protocol name or multiple comma-separated names:'

// Mutable variables
let editingMessage = false
let editingMessageTarget = ''
let editingProtocol = false
let editingProtocolTarget = ''
let editingUrl = false
let editingUrlTarget = ''
let isCtrlKey = false
let ws = null
let wsConnected = false
let wsPoliteDisconnection = false

// Used only by background.js to show the options card
// when user chooses extension options in browser settings
if (url.match(/#options/)) {
  client.removeClass('show')
  options.addClass('show')
}

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
  let messages, protocols, urls
  switch (option) {
    case 'message':
      messages = APP.savedOptions.messages.filter(e => !e.toString().startsWith(target))
      protocols = APP.savedOptions.protocols ? APP.savedOptions.protocols : []
      urls = APP.savedOptions.urls ? APP.savedOptions.urls : []
      break
    case 'protocol':
      messages = APP.savedOptions.messages ? APP.savedOptions.messages : []
      protocols = APP.savedOptions.protocols.filter(e => e !== target)
      urls = APP.savedOptions.urls ? APP.savedOptions.urls : []
      break
    case 'url':
      messages = APP.savedOptions.messages ? APP.savedOptions.messages : []
      protocols = APP.savedOptions.protocols ? APP.savedOptions.protocols : []
      urls = APP.savedOptions.urls.filter(e => e !== target)
      break
    default:
      return false
  }
  APP.savedOptions.messages = messages
  APP.savedOptions.protocols = protocols
  APP.savedOptions.urls = urls
}

// Fetch extension options from storage and update all related objects and elements
APP.loadOptions = function () {
  chrome.storage.sync.get('savedOptions', function (result) {
    if (result['savedOptions']['messages']) {
      APP.savedOptions.messages = result['savedOptions']['messages']
    }
    if (result['savedOptions']['protocols']) {
      APP.savedOptions.protocols = result['savedOptions']['protocols']
    }
    if (result['savedOptions']['urls']) {
      APP.savedOptions.urls = result['savedOptions']['urls']
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
    if (APP.savedOptions.protocols.length > 0) {
      APP.populateProtocolTable()
      APP.populateSavedProtocolSelect()
      optionsProtocolNoneSaved.hide()
      optionsProtocolSavedTable.show()
      protocolSelect.show()
    } else {
      optionsProtocolNoneSaved.show()
      optionsProtocolSavedTable.hide()
      protocolSelect.hide()
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

// Validate URL input on input change
optionsUrlInput.on('keyup', function () {
  if (optionsUrlInput.val().length > 0) {
    optionsUrlInputEmpty.hide()
  } else {
    optionsUrlInputEmpty.show()
  }
  if (APP.isValidUrl(optionsUrlInput.val())) {
    optionsUrlInvalidWarning.hide()
  } else {
    optionsUrlInvalidWarning.show()
  }
  if (optionsUrlInput.val().length > 0 && APP.isValidUrl(optionsUrlInput.val())) {
    optionsUrlSaveButton.prop('disabled', false)
  } else {
    optionsUrlSaveButton.prop('disabled', true)
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
optionsUrlCancelEditButton.on('click', function () {
  editingUrl = false
  editingUrlTarget = ''
  optionsUrlInput.val('')
  optionsUrlInputLabel.html(optionsUrlInputLabelDefaultText)
  optionsUrlInputEmpty.hide()
  optionsUrlInvalidWarning.hide()
  optionsUrlSaveButton.prop('disabled', true)
})

// Persist URL to storage on save button click
optionsUrlSaveButton.on('click', function () {
  let url = optionsUrlInput.val()
  if (editingUrl) {
    APP.savedOptionsDelete('url', editingUrlTarget)
  } else {
    APP.savedOptionsDelete('url', url)
  }
  APP.savedOptions.urls.push(url)
  APP.saveOptions()
  optionsUrlInput.val('')
  optionsUrlInputLabel.html(optionsUrlInputLabelDefaultText)
  optionsUrlSaveButton.prop('disabled', true)
  optionsUrlStatus
    .text('URL saved.')
    .show()
})

// OPTIONS: PROTOCOL PERSISTENCE

// Populate the saved protocols table
APP.populateProtocolTable = function () {
  let table = ''
  let protocols = APP.savedOptions.protocols.sort()
  $.each(protocols, function (key, protocol) {
    table += protocolTableRow.replace(/REPLACE_PROTOCOL/g, protocol)
  })
  optionsProtocolSavedTable
    .html('')
    .append(table)
  $('.editProtocol').on('click', function () {
    APP.editProtocol(jQuery(this).data('protocol'))
  })
  $('.deleteProtocol').on('click', function () {
    APP.deleteProtocol(jQuery(this).data('protocol'))
  })
  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })
}

// Enable protocol save button if input is not empty
optionsProtocolInput.on('keyup', function () {
  if (optionsProtocolInput.val().replace(/\s/g, '').length > 0) {
    optionsProtocolInputEmpty.hide()
    optionsProtocolSaveButton.prop('disabled', false)
  } else {
    optionsProtocolInputEmpty.show()
    optionsProtocolSaveButton.prop('disabled', true)
  }
})

// Copy a saved protocol to the input element and show cancel button
APP.editProtocol = function (protocol) {
  editingProtocol = true
  editingProtocolTarget = protocol
  optionsProtocolCancelEditButton.show()
  optionsProtocolInput.val(protocol)
  optionsProtocolInputEmpty.hide()
  optionsProtocolInputLabel.text(`Editing protocol: ${protocol}`)
  optionsProtocolSaveButton.prop('disabled', false)
  optionsProtocolStatus.hide()
}

// Delete a saved protocol from storage
APP.deleteProtocol = function (protocol) {
  deleteModalBody.text('Are you sure you want to delete the protocol shown below?')
  deleteModalName.text(protocol)
  deleteModalDeleteButton.show()
  deleteModalDeleteButton
    .data('target', protocol)
    .on('click', function () {
      const protocol = jQuery(this).data('target')
      APP.savedOptionsDelete('protocol', protocol)
      APP.saveOptions()
      deleteModalBody.text('Protocol deleted:')
      deleteModalName.text(protocol)
      deleteModalDeleteButton.hide()
      deleteModalCancelButton.text('Close')
    })
  deleteModal.modal('show')
}

// Cancel protocol edit and reset variables
optionsProtocolCancelEditButton.on('click', function () {
  editingProtocol = false
  editingProtocolTarget = ''
  optionsProtocolInput.val('')
  optionsProtocolInputLabel.text(optionsProtocolInputLabelDefaultText)
  optionsProtocolInputEmpty.hide()
  optionsProtocolSaveButton.prop('disabled', true)
})

// Persist protocol to storage on save button click
optionsProtocolSaveButton.on('click', function () {
  let protocol = APP.getProtocols(optionsProtocolInput)
  if (editingProtocol) {
    APP.savedOptionsDelete('protocol', editingProtocolTarget)
  } else {
    APP.savedOptionsDelete('protocol', protocol)
  }
  APP.savedOptions.protocols.push(protocol.toString().replace(/,/g, ', '))
  APP.saveOptions()
  optionsProtocolInput.val('')
  optionsProtocolInputLabel.text(optionsProtocolInputLabelDefaultText)
  optionsProtocolSaveButton.prop('disabled', true)
  optionsProtocolStatus
    .text('Protocol saved.')
    .show()
})

// Convert protocol input value to an array if necessary and
// trim unnecessary commas and spaces
APP.getProtocols = function (input) {
  const protocolsInput = input.val()
  const protocolsResult = protocolsInput
    .split(',')
    .map(item => item.trim())
    .filter(item => item !== '')
  let protocols
  if (protocolsResult.length === 1) {
    protocols = protocolsResult[0].trim()
  } else if (protocolsResult.length > 1) {
    protocols = protocolsResult
  } else {
    protocols = null
  }
  return protocols
}

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

// Convert JSON to a string for saving and copying to textareas
APP.convertJsonToString = function (input) {
  let string
  if (typeof input === 'object') {
    string = JSON.stringify(input)
  } else {
    string = JSON.stringify(JSON.parse(input))
  }
  return string
}

// Toggle JSON formatting from single line to multi-line and vice versa
APP.formatTextarea = function (checkbox, textarea) {
  const checked = checkbox.is(':checked')
  const message = textarea.val()
  const valid = APP.isValidJson(message)
  if (!valid) {
    checkbox.prop('checked', false)
  } else if (valid && checked) {
    textarea.val(JSON.stringify(JSON.parse(message), null, 2))
  } else {
    textarea.val(APP.convertJsonToString(message))
  }
}

// Validate message name input and message textarea values
// Enable or disable save button and JSON formatting toggle
APP.validateOptionsMessage = function () {
  const validMessageName = optionsMessageNameInput.val().trim().length > 0
  const validMessageLength = optionsMessageTextarea.val().trim().length > 0
  const validMessageJson = APP.isValidJson(optionsMessageTextarea.val())
  if (validMessageName && validMessageLength && validMessageJson) {
    optionsMessageSaveButton.prop('disabled', false)
    optionsMessageTextareaFormatSlider.removeClass('bwc-slider-disabled')
  } else {
    optionsMessageSaveButton.prop('disabled', true)
    optionsMessageTextareaFormatSlider.addClass('bwc-slider-disabled')
  }
}

// Validate message name input and show user feedback
APP.validateOptionsMessageName = function () {
  const validMessageName = optionsMessageNameInput.val().trim().length > 0
  let valid = true
  if (validMessageName) {
    optionsMessageNameInvalid.hide()
  } else {
    valid = false
    optionsMessageNameInvalid.show()
  }
  if (valid) {
    APP.validateOptionsMessage()
  }
}

// Validate message textarea value and show user feedback
APP.validateOptionsMessageTextarea = function () {
  const validMessageLength = optionsMessageTextarea.val().trim().length > 0
  const validMessageJson = APP.isValidJson(optionsMessageTextarea.val())
  let valid = true
  optionsMessageJsonInvalidWarning.hide()
  if (validMessageLength) {
    optionsMessageTextareaEmpty.hide()
    if (!validMessageJson) {
      valid = false
      optionsMessageJsonInvalidWarning.show()
    }
  } else {
    valid = false
    optionsMessageTextareaEmpty.show()
  }
  if (valid) {
    APP.validateOptionsMessage()
  }
}

// Validate message name input value
optionsMessageNameInput.on('keyup', function () {
  APP.validateOptionsMessageName()
})

// Validate message textarea value
optionsMessageTextarea.on('keyup', function () {
  APP.validateOptionsMessageTextarea()
})

// Copy a saved message to the input elements
APP.editMessage = function (message) {
  const [name, body] = message.split(SEPARATOR)
  editingMessage = true
  editingMessageTarget = `${name}${SEPARATOR}`
  optionsMessageCancelEditButton.show()
  optionsMessageTextareaEmpty.hide()
  optionsMessageNameInput.val(name)
  optionsMessageNameInputLabel.text(`Editing message: ${name}`)
  optionsMessageNameInvalid.hide()
  optionsMessageSaveButton.prop('disabled', false)
  optionsMessageStatus.hide()
  optionsMessageTextarea.val(body)
  APP.validateOptionsMessage()
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
      APP.savedOptionsDelete('message', `${name}${SEPARATOR}`)
      APP.saveOptions()
      deleteModalBody.text('Message deleted:')
      deleteModalName.text(name)
      deleteModalDeleteButton.hide()
      deleteModalCancelButton.text('Close')
    })
  deleteModal.modal('show')
}

// Toggle message textarea JSON formatting
optionsMessageTextareaFormatToggle.on('change', function () {
  APP.formatTextarea($(this), optionsMessageTextarea)
})

// Cancel message edit and reset variables
optionsMessageCancelEditButton.on('click', function () {
  editingMessage = false
  editingMessageTarget = ''
  optionsMessageTextareaEmpty.hide()
  optionsMessageJsonInvalidWarning.hide()
  optionsMessageNameInput.val('')
  optionsMessageNameInputLabel.text(optionsMessageNameInputLabelDefaultText)
  optionsMessageNameInvalid.hide()
  optionsMessageSaveButton.prop('disabled', true)
  optionsMessageStatus.hide()
  optionsMessageTextarea.val('')
  optionsMessageTextareaFormatSlider.addClass('bwc-slider-disabled')
  optionsMessageTextareaFormatToggle.prop('checked', false)
})

// Persist message to storage on save button click
optionsMessageSaveButton.on('click', function () {
  const name = optionsMessageNameInput.val()
  const body = APP.convertJsonToString(optionsMessageTextarea.val())
  const message = `${name}${SEPARATOR}${body}`
  if (editingMessage) {
    APP.savedOptionsDelete('message', editingMessageTarget)
  } else {
    APP.savedOptionsDelete('message', `${name}${SEPARATOR}`)
  }
  APP.savedOptions.messages.push(message)
  APP.saveOptions()
  optionsMessageTextareaEmpty.hide()
  optionsMessageJsonInvalidWarning.hide()
  optionsMessageNameInput.val('')
  optionsMessageNameInputLabel.text(optionsMessageNameInputLabelDefaultText)
  optionsMessageNameInvalid.hide()
  optionsMessageSaveButton.prop('disabled', true)
  optionsMessageStatus
    .text('Message saved.')
    .show()
  optionsMessageTextarea.val('')
  optionsMessageTextareaFormatSlider.addClass('bwc-slider-disabled')
  optionsMessageTextareaFormatToggle.prop('checked', false)
})

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

// Pretty-print a saved message body
APP.printMessage = function (message) {
  const [name, body] = message.split(SEPARATOR)
  const json = JSON.parse(body)
  const html = $('<pre>').html(APP.syntaxHighlight(JSON.stringify(json, null, 2)))
  jsonModalTitle.html(name)
  jsonModalBody.html(html)
  jsonModal.modal('show')
}

// CLIENT SECTION

// Populate URL select menu
APP.populateSavedUrlSelect = function () {
  const urls = APP.savedOptions.urls.sort()
  let options = ''
  $.each(urls, function (key, url) {
    options += `<button class="dropdown-item url" type="button" data-value="${url}">${url}</button>`
  })
  urlSelectOptions
    .html('')
    .append(options)
  $('.dropdown-item.url').on('click', function () {
    urlInput.val(jQuery(this).data('value'))
    connectButton.prop('disabled', false)
  })
}

// Populate protocol select menu
APP.populateSavedProtocolSelect = function () {
  const protocols = APP.savedOptions.protocols.sort()
  let options = ''
  $.each(protocols, function (key, protocol) {
    options += `<button class="dropdown-item protocol" type="button" data-value="${protocol}">${protocol}</button>`
  })
  protocolSelectOptions
    .html('')
    .append(options)
  $('.dropdown-item.protocol').on('click', function () {
    protocolInput.val(jQuery(this).data('value'))
  })
}

// Populate message select menu
APP.populateSavedMessageSelect = function () {
  const messages = APP.savedOptions.messages.sort()
  let options = ''
  $.each(messages, function (key, message) {
    const [name, body] = message.split(SEPARATOR)
    options += `<button class="dropdown-item message" type="button" data-value='${body}'>${name}</button>`
  })
  messageSelectOptions
    .html('')
    .append(options)
  $('.dropdown-item.message').on('click', function () {
    messageTextarea.val(APP.convertJsonToString(jQuery(this).data('value')))
    APP.validateClientMessage()
  })
}

// Validate message textarea value, show user feedback,
// and enable or disable send button
APP.validateClientMessage = function () {
  const validMessageJson = APP.isValidJson(messageTextarea.val())
  if (validMessageJson) {
    if (wsConnected) {
      messageSendButton.prop('disabled', false)
    } else {
      messageSendButton.prop('disabled', true)
    }
    messageJsonInvalidWarning.hide()
    messageTextareaFormatSlider.removeClass('bwc-slider-disabled')
  } else {
    messageSendButton.prop('disabled', true)
    if (messageTextarea.isFocused) {
      messageJsonInvalidWarning.show()
    }
    messageTextareaFormatSlider.addClass('bwc-slider-disabled')
  }
}

// Enable and disable connect button based on URL input length
urlInput.on('keyup', function () {
  if (urlInput.val().length === 0) {
    connectButton.prop('disabled', true)
  } else {
    connectButton.prop('disabled', false)
  }
})

// Validate message textarea value on change
messageTextarea.on('keyup', function () {
  APP.validateClientMessage()
})

// Toggle message textarea JSON formatting
messageTextareaFormatToggle.on('change', function () {
  APP.formatTextarea($(this), messageTextarea)
})

// Clear message log
clearMessagesButton.on('click', function () {
  messages.html('')
  clearMessagesButton.prop('disabled', true)
})

// CLIENT: WEBSOCKET

// Open WebSocket connection
APP.open = function () {
  let url = urlInput.val().toString()
  let protocol = APP.getProtocols(protocolInput)
  if (protocol) { ws = new WebSocket(url, protocol) } else { ws = new WebSocket(url) }
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
  connectButton
    .prop('disabled', true)
    .hide()
  connectionStatus.text('OPENED')
  disconnectButton.show()
  urlInput.prop('disabled', true)
  protocolInput.prop('disabled', true)
  wsConnected = true
  wsPoliteDisconnection = false
  APP.validateClientMessage()
}

// WebSocket onClose handler
APP.onClose = function () {
  let disconnectionMessage = 'CLOSED'
  disconnectionMessage += (wsPoliteDisconnection) ? '' : '. Disconnected by the server.'
  console.log('CLOSED: ' + urlInput.val())
  ws = null
  connectButton
    .prop('disabled', false)
    .show()
  connectionStatus.text(disconnectionMessage)
  disconnectButton.hide()
  messageSendButton.prop('disabled', true)
  urlInput.prop('disabled', false)
  protocolInput.prop('disabled', false)
  wsConnected = false
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
connectButton.on('click', function () {
  APP.close()
  APP.open()
})

// Disconnect button click
disconnectButton.on('click', function () {
  APP.close()
})

// Send message button click
messageSendButton.on('click', function () {
  APP.sendMessage()
})

// Allow Ctrl+Enter shortcut to send message from message body textarea
// Test if message body is valid JSON on textarea keyup
messageTextarea.on('keyup', function (e) {
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
}).on('keydown', function (e) {
  if (e.which === 17) isCtrlKey = true
  if (e.which === 13 && isCtrlKey === true) {
    APP.sendMessage()
  }
})

// Ensure status messages are not persistent
$('*').focus(function () {
  optionsUrlStatus.text('').hide()
  optionsProtocolStatus.text('').hide()
  optionsMessageStatus.text('').hide()
})

$(document).ready(function () {
  // Prevent unit tests from failing
  if (typeof chrome.storage !== 'undefined') {
    APP.loadOptions()
  }
  $('.hide').hide()
  optionsUrlInput.val('')
  optionsProtocolInput.val('')
  optionsMessageNameInput.val('')
  optionsMessageTextarea.val('')
  urlInput.val('')
  protocolInput.val('')
  messageTextarea.val('')
  optionsMessageTextareaFormatToggle.prop('checked', false)
  optionsMessageSaveButton.prop('disabled', true)
  connectButton.prop('disabled', true)
  messageTextareaFormatToggle.prop('checked', false)
  messageSendButton.prop('disabled', true)
})
