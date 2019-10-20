import $ from 'jquery'
import fontawesome from '@fortawesome/fontawesome'
import faChevronDown from '@fortawesome/fontawesome-free-solid/faChevronDown'
import faChevronUp from '@fortawesome/fontawesome-free-solid/faChevronUp'
import faInfoCircle from '@fortawesome/fontawesome-free-solid/faInfoCircle'
import faPencilAlt from '@fortawesome/fontawesome-free-solid/faPencilAlt'
import faPrint from '@fortawesome/fontawesome-free-solid/faPrint'
import faTrashAlt from '@fortawesome/fontawesome-free-solid/faTrashAlt'

require('popper.js')
require('bootstrap/js/src/button')
require('bootstrap/js/src/collapse')
require('bootstrap/js/src/dropdown')
require('bootstrap/js/src/modal')
require('bootstrap/js/src/popover')
require('bootstrap/js/src/tooltip')
require('bootstrap/js/src/util')

// Configure jquery
window.$ = $
window.jQuery = $

// Define savedOptions object
const savedOptions = {
  preferences: {
    preventSavingUrl: true,
    preventUsingUrl: false,
    preventSavingMessage: true,
    preventUsingMessage: true
  },
  messages: [],
  protocols: [],
  urls: []
}

// Mock chrome.storage.sync
const mockChromeStorage = function (browser) {
  if (browser === 'chrome') {
    console.warn('Chrome is using mocked chrome.storage.sync')
  } else {
    console.warn('Browser is using mocked chrome.storage.sync')
    window.chrome = {}
    // eslint-disable-next-line no-global-assign
    chrome = window.chrome
  }
  chrome.storage = {}
  chrome.storage.sync = {
    data: {
      savedOptions: savedOptions
    },
    get: function (key, callback) {
      callback({key: chrome.storage.sync.data[key]})
    },
    set: function ({key, value}, callback) {
      chrome.storage.sync.data[key] = value
      callback()
    }
  }
}

// Use mocked chrome.storage.sync if not running as extension
if (typeof chrome === 'undefined') {
  mockChromeStorage()
} else if (typeof chrome.permissions === 'undefined') {
  mockChromeStorage('chrome')
}

// Add Font Awesome icons to its library
fontawesome.library.add(
  faChevronDown,
  faChevronUp,
  faInfoCircle,
  faPencilAlt,
  faPrint,
  faTrashAlt
)

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

// Preferences HTML elements
const preferencesOptionsUrlCheckbox = $('#preferencesOptionsUrlCheckbox')
const preferencesClientUrlCheckbox = $('#preferencesClientUrlCheckbox')
const preferencesOptionsMessageCheckbox = $('#preferencesOptionsMessageCheckbox')
const preferencesClientMessageCheckbox = $('#preferencesClientMessageCheckbox')

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
const optionsMessageTextareaFormatCheckbox = $('#optionsMessageTextareaFormatCheckbox')
const optionsExportButton = $('#optionsExportButton')
const optionsImportButton = $('#optionsImportButton')
const importModal = $('#importModal')
const importModalBody = $('#importModalBody')
const importModalDescription = $('#importModalDescription')
const importModalCancelButton = $('#importModalCancelButton')
const importModalContinueButton = $('#importModalContinueButton')
const optionsFile = $('#optionsFile')
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
const messageTextareaFormatCheckbox = $('#messageTextareaFormatCheckbox')
const messageTextareaFormatSlider = $('#messageTextareaFormatSlider')
const protocolInput = $('#protocolInput')
const protocolSelect = $('#protocolSelect')
const protocolSelectOptions = $('#protocolSelectOptions')
const urlInput = $('#urlInput')
const urlInvalidWarning = $('#urlInvalidWarning')
const urlSelect = $('#urlSelect')
const urlSelectOptions = $('#urlSelectOptions')

// Immutable variables
const url = document.location.toString()
const optionsUrlInputLabelDefaultText = 'The URL should begin with <code>ws://</code> or <code>wss://</code>:'
const optionsMessageNameInputLabelDefaultText = 'The display name appears in the "Saved Messages" table and client drop-down menu:'
const optionsProtocolInputLabelDefaultText = 'Enter a single protocol name or multiple comma-separated names:'

// Mutable variables
let editingMessage = false
let editingMessageTargetBody = ''
let editingMessageTargetName = ''
let editingProtocol = false
let editingProtocolTarget = ''
let editingUrl = false
let editingUrlTarget = ''
let ws = null
let wsConnected = false
let wsPoliteDisconnection = false

// Used only by background.js to show the options section
// when user chooses extension options in browser settings
if (url.match(/#options/)) {
  client.removeClass('show')
  options.addClass('show')
}

// PREFERENCES SECTION

// Set checkbox properties
const setPreferencesCheckboxes = function () {
  const preferences = savedOptions.preferences
  preferencesOptionsUrlCheckbox.prop('checked', preferences.preventSavingUrl)
  preferencesClientUrlCheckbox.prop('checked', preferences.preventUsingUrl)
  preferencesOptionsMessageCheckbox.prop('checked', preferences.preventSavingMessage)
  preferencesClientMessageCheckbox.prop('checked', preferences.preventUsingMessage)
}

// React to preventSavingUrl checkbox changes
preferencesOptionsUrlCheckbox.on('change', function () {
  savedOptions.preferences.preventSavingUrl = preferencesOptionsUrlCheckbox.is(':checked')
  saveOptions()
})

// React to preventUsingUrl checkbox changes
preferencesClientUrlCheckbox.on('change', function () {
  savedOptions.preferences.preventUsingUrl = preferencesClientUrlCheckbox.is(':checked')
  saveOptions()
})

// React to preventSavingMessage checkbox changes
preferencesOptionsMessageCheckbox.on('change', function () {
  savedOptions.preferences.preventSavingMessage = preferencesOptionsMessageCheckbox.is(':checked')
  saveOptions()
})

// React to preventUsingMessage checkbox changes
preferencesClientMessageCheckbox.on('change', function () {
  savedOptions.preferences.preventUsingMessage = preferencesClientMessageCheckbox.is(':checked')
  saveOptions()
})

// OPTIONS SECTION

// Save options to storage
const saveOptions = function () {
  chrome.storage.sync.set({
    'savedOptions': savedOptions
  }, function () {
    loadOptions()
  })
}

// Fetch extension options from storage and update all related objects and elements
const loadOptions = function () {
  chrome.storage.sync.get('savedOptions', function (result) {
    if (result['savedOptions']) {
      if (result['savedOptions']['preferences']) {
        savedOptions.preferences = result['savedOptions']['preferences']
      }
      if (result['savedOptions']['messages']) {
        savedOptions.messages = result['savedOptions']['messages']
      }
      if (result['savedOptions']['protocols']) {
        savedOptions.protocols = result['savedOptions']['protocols']
      }
      if (result['savedOptions']['urls']) {
        savedOptions.urls = result['savedOptions']['urls']
      }
    }
    setPreferencesCheckboxes()
    if (savedOptions.messages.length > 0) {
      populateMessageTable()
      populateSavedMessageSelect()
      messageSelect.show()
      optionsMessageNoneSaved.hide()
      optionsMessageSavedTable.show()
    } else {
      messageSelect.hide()
      optionsMessageNoneSaved.show()
      optionsMessageSavedTable.hide()
    }
    if (savedOptions.protocols.length > 0) {
      populateProtocolTable()
      populateSavedProtocolSelect()
      optionsProtocolNoneSaved.hide()
      optionsProtocolSavedTable.show()
      protocolSelect.show()
    } else {
      optionsProtocolNoneSaved.show()
      optionsProtocolSavedTable.hide()
      protocolSelect.hide()
    }
    if (savedOptions.urls.length > 0) {
      populateUrlTable()
      populateSavedUrlSelect()
      optionsUrlNoneSaved.hide()
      optionsUrlSavedTable.show()
      urlSelect.show()
    } else {
      optionsUrlNoneSaved.show()
      optionsUrlSavedTable.hide()
      urlSelect.hide()
    }
    optionsFile.val(undefined)
    optionsFile.change()
  })
}

function downloadFile(options) {
  if(!options.url) {
      var blob = new Blob([ options.content ], {type : "text/plain;charset=UTF-8"})
      options.url = window.URL.createObjectURL(blob)
  }
  chrome.downloads.download({
      url: options.url,
      filename: options.filename
  })
}

// Delete from savedOptions
const deleteSavedOptions = function (option, target) {
  const options = deleteOptions(option, target, savedOptions)
  savedOptions.messages = options.messages
  savedOptions.protocols = options.protocols
  savedOptions.urls = options.urls
}

// Delete options
const deleteOptions = function (option, target, options) {
  let messages, protocols, urls
  switch (option) {
    case 'message':
      messages = options.messages.filter(e => !e.toString().startsWith(target))
      protocols = options.protocols ? options.protocols : []
      urls = options.urls ? options.urls : []
      break
    case 'protocol':
      messages = options.messages ? options.messages : []
      protocols = options.protocols.filter(e => e !== target)
      urls = options.urls ? options.urls : []
      break
    case 'url':
      messages = options.messages ? options.messages : []
      protocols = options.protocols ? options.protocols : []
      urls = options.urls.filter(e => e !== target)
      break
    default:
      return false
  }
  return {messages, protocols, urls}
}

// OPTIONS: URL PERSISTENCE

// Populate the saved URLs table
const populateUrlTable = function () {
  let table = ''
  let urls = savedOptions.urls.sort()
  $.each(urls, function (key, url) {
    table += urlTableRow.replace(/REPLACE_URL/g, url)
  })
  optionsUrlSavedTable
    .html('')
    .append(table)
  $('.editUrl').on('click', function () {
    editUrl(jQuery(this).data('url'))
  })
  $('.deleteUrl').on('click', function () {
    deleteUrl(jQuery(this).data('url'))
  })
  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })
}

// Test if URL begins with ws:// or wss:// and has no spaces
const isValidUrl = function (url) {
  return /^(ws|wss):\/\/[^ "]+$/.test(url)
}

// Copy a saved URL to the input element and show cancel button
const editUrl = function (url) {
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
const deleteUrl = function (url) {
  deleteModalBody.text('Are you sure you want to delete the URL shown below?')
  deleteModalName.text(url)
  deleteModalDeleteButton.show()
  deleteModalDeleteButton
    .data('target', url)
    .on('click', function () {
      const url = jQuery(this).data('target')
      deleteSavedOptions('url', url)
      saveOptions()
      deleteModalBody.text('URL deleted:')
      deleteModalName.text(url)
      deleteModalDeleteButton.hide()
      deleteModalCancelButton.text('Close')
    })
  deleteModal.modal('show')
}

// Validate URL input on input change
optionsUrlInput.on('keyup', function () {
  if (optionsUrlInput.val().length > 0) {
    optionsUrlInputEmpty.hide()
  } else {
    optionsUrlInputEmpty.show()
  }
  if (isValidUrl(optionsUrlInput.val())) {
    optionsUrlInvalidWarning.hide()
  } else {
    optionsUrlInvalidWarning.show()
  }
  if (optionsUrlInput.val().length > 0 && isValidUrl(optionsUrlInput.val())) {
    optionsUrlSaveButton.prop('disabled', false)
  } else {
    optionsUrlSaveButton.prop('disabled', savedOptions.preferences.preventSavingUrl)
  }
})

// Cancel URL edit and reset variables
optionsUrlCancelEditButton.on('click', function () {
  editingUrl = false
  editingUrlTarget = ''
  optionsUrlInput.val('')
  optionsUrlInputLabel.html(optionsUrlInputLabelDefaultText)
  optionsUrlInputEmpty.hide()
  optionsUrlInvalidWarning.hide()
  optionsUrlSaveButton.prop('disabled', savedOptions.preferences.preventSavingUrl)
})

// Persist URL to storage on save button click
optionsUrlSaveButton.on('click', function () {
  let url = optionsUrlInput.val()
  if (editingUrl) {
    deleteSavedOptions('url', editingUrlTarget)
  } else {
    deleteSavedOptions('url', url)
  }
  savedOptions.urls.push(url)
  saveOptions()
  optionsUrlInput.val('')
  optionsUrlInputLabel.html(optionsUrlInputLabelDefaultText)
  optionsUrlSaveButton.prop('disabled', savedOptions.preferences.preventSavingUrl)
  optionsUrlStatus
    .text('URL saved.')
    .show()
})

// OPTIONS: PROTOCOL PERSISTENCE

// Convert protocol input value to an array if necessary and
// trim unnecessary commas and spaces
const getProtocols = function (input) {
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

// Populate the saved protocols table
const populateProtocolTable = function () {
  let table = ''
  let protocols = savedOptions.protocols.sort()
  $.each(protocols, function (key, protocol) {
    table += protocolTableRow.replace(/REPLACE_PROTOCOL/g, protocol)
  })
  optionsProtocolSavedTable
    .html('')
    .append(table)
  $('.editProtocol').on('click', function () {
    editProtocol(jQuery(this).data('protocol'))
  })
  $('.deleteProtocol').on('click', function () {
    deleteProtocol(jQuery(this).data('protocol'))
  })
  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })
}

// Copy a saved protocol to the input element and show cancel button
const editProtocol = function (protocol) {
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
const deleteProtocol = function (protocol) {
  deleteModalBody.text('Are you sure you want to delete the protocol shown below?')
  deleteModalName.text(protocol)
  deleteModalDeleteButton.show()
  deleteModalDeleteButton
    .data('target', protocol)
    .on('click', function () {
      const protocol = jQuery(this).data('target')
      deleteSavedOptions('protocol', protocol)
      saveOptions()
      deleteModalBody.text('Protocol deleted:')
      deleteModalName.text(protocol)
      deleteModalDeleteButton.hide()
      deleteModalCancelButton.text('Close')
    })
  deleteModal.modal('show')
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
  let protocol = getProtocols(optionsProtocolInput)
  if (editingProtocol) {
    deleteSavedOptions('protocol', editingProtocolTarget)
  } else {
    deleteSavedOptions('protocol', protocol)
  }
  savedOptions.protocols.push(protocol.toString().replace(/,/g, ', '))
  saveOptions()
  optionsProtocolInput.val('')
  optionsProtocolInputLabel.text(optionsProtocolInputLabelDefaultText)
  optionsProtocolSaveButton.prop('disabled', true)
  optionsProtocolStatus
    .text('Protocol saved.')
    .show()
})

// OPTIONS: MESSAGE PERSISTENCE

// Populate the saved messages table
const populateMessageTable = function () {
  let messages = savedOptions.messages.sort()
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
    printMessage(jQuery(this).data('message'))
  })
  $('.editMessage').on('click', function () {
    editMessage(jQuery(this).data('message'))
  })
  $('.deleteMessage').on('click', function () {
    deleteMessage(jQuery(this).data('message'))
  })
  $(function () {
    $('[data-toggle="tooltip"]').tooltip()
  })
}

// Test a string to determine if it is valid JSON
const isValidJson = function (string) {
  try {
    const test = JSON.parse(string)
    if (test && typeof test === 'object') {
      return true
    }
  } catch (e) { }
  return false
}

// Convert JSON object to a string
const stringifyJson = function (input) {
  if (typeof input === 'object') {
    return JSON.stringify(input)
  } else {
    return input
  }
}

// Toggle JSON formatting from single line to multi-line and vice versa
const formatTextarea = function (checkbox, textarea) {
  const checked = checkbox.is(':checked')
  const message = textarea.val()
  const valid = isValidJson(message)
  if (!valid) {
    checkbox.prop('checked', false)
  } else if (checked) {
    textarea.val(JSON.stringify(JSON.parse(message), null, 2))
  } else {
    textarea.val(editingMessageTargetBody)
  }
}

// Validate message name input and message textarea values
// Enable or disable save button and JSON formatting toggle
const validateOptionsMessage = function () {
  const validMessageName = optionsMessageNameInput.val().trim().length > 0
  const validMessageLength = optionsMessageTextarea.val().trim().length > 0
  const validMessageJson = isValidJson(optionsMessageTextarea.val())
  if (validMessageName && validMessageLength && validMessageJson) {
    optionsMessageSaveButton.prop('disabled', false)
    optionsMessageTextareaFormatSlider.removeClass('bwc-slider-disabled')
  } else {
    optionsMessageSaveButton.prop('disabled', savedOptions.preferences.preventSavingMessage)
    optionsMessageTextareaFormatSlider.addClass('bwc-slider-disabled')
  }
}

// Validate message name input and show user feedback
const validateOptionsMessageName = function () {
  const validMessageName = optionsMessageNameInput.val().trim().length > 0
  let valid = true
  if (validMessageName) {
    optionsMessageNameInvalid.hide()
  } else {
    valid = false
    optionsMessageNameInvalid.show()
  }
  if (valid) {
    validateOptionsMessage()
  }
}

// Validate message textarea value and show user feedback
const validateOptionsMessageTextarea = function () {
  const validMessageLength = optionsMessageTextarea.val().trim().length > 0
  const validMessageJson = isValidJson(optionsMessageTextarea.val())
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
    validateOptionsMessage()
  }
}

// Copy a saved message to the input elements
const editMessage = function (message) {
  const [name, body] = message.split(SEPARATOR)
  editingMessage = true
  editingMessageTargetBody = body
  editingMessageTargetName = `${name}${SEPARATOR}`
  optionsMessageCancelEditButton.show()
  optionsMessageTextareaEmpty.hide()
  optionsMessageNameInput.val(name)
  optionsMessageNameInputLabel.text(`Editing message: ${name}`)
  optionsMessageNameInvalid.hide()
  optionsMessageSaveButton.prop('disabled', false)
  optionsMessageStatus.hide()
  optionsMessageTextarea.val(body)
  validateOptionsMessage()
}

// Delete a saved message from storage
const deleteMessage = function (all) {
  const name = all.split(SEPARATOR)[0]
  deleteModalBody.text('Are you sure you want to delete the message shown below?')
  deleteModalName.text(name)
  deleteModalDeleteButton.show()
  deleteModalDeleteButton
    .data('target', all)
    .on('click', function () {
      deleteSavedOptions('message', `${name}${SEPARATOR}`)
      saveOptions()
      deleteModalBody.text('Message deleted:')
      deleteModalName.text(name)
      deleteModalDeleteButton.hide()
      deleteModalCancelButton.text('Close')
    })
  deleteModal.modal('show')
}

// Format JSON for pretty-print modal
const highlightJson = function (string) {
  return JSON.stringify(JSON.parse(string), null, 2)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
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
const printMessage = function (message) {
  const [title, body] = message.split(SEPARATOR)
  jsonModalTitle.html(title)
  jsonModalBody.html(getJsonModalBody(body))
  jsonModal.modal('show')
}

// Validate message name input value
optionsMessageNameInput.on('keyup', function () {
  validateOptionsMessageName()
})

// Validate message textarea value
optionsMessageTextarea.on('keyup', function () {
  validateOptionsMessageTextarea()
})

// Toggle message textarea JSON formatting
optionsMessageTextareaFormatCheckbox.on('change', function () {
  formatTextarea($(this), optionsMessageTextarea)
})

// Cancel message edit and reset elements
optionsMessageCancelEditButton.on('click', function () {
  editingMessage = false
  editingMessageTargetBody = ''
  editingMessageTargetName = ''
  optionsMessageTextareaEmpty.hide()
  optionsMessageJsonInvalidWarning.hide()
  optionsMessageNameInput.val('')
  optionsMessageNameInputLabel.text(optionsMessageNameInputLabelDefaultText)
  optionsMessageNameInvalid.hide()
  optionsMessageSaveButton.prop('disabled', savedOptions.preferences.preventSavingMessage)
  optionsMessageStatus.hide()
  optionsMessageTextarea.val('')
  optionsMessageTextareaFormatSlider.addClass('bwc-slider-disabled')
  optionsMessageTextareaFormatCheckbox.prop('checked', false)
})

// Persist message to storage on save button click
optionsMessageSaveButton.on('click', function () {
  const name = optionsMessageNameInput.val()
  const body = optionsMessageTextarea.val()
  const message = `${name}${SEPARATOR}${body}`
  if (editingMessage) {
    deleteSavedOptions('message', editingMessageTargetName)
  } else {
    deleteSavedOptions('message', `${name}${SEPARATOR}`)
  }
  savedOptions.messages.push(message)
  saveOptions()
  optionsMessageTextareaEmpty.hide()
  optionsMessageJsonInvalidWarning.hide()
  optionsMessageNameInput.val('')
  optionsMessageNameInputLabel.text(optionsMessageNameInputLabelDefaultText)
  optionsMessageNameInvalid.hide()
  optionsMessageSaveButton.prop('disabled', savedOptions.preferences.preventSavingMessage)
  optionsMessageStatus
    .text('Message saved.')
    .show()
  optionsMessageTextarea.val('')
  optionsMessageTextareaFormatSlider.addClass('bwc-slider-disabled')
  optionsMessageTextareaFormatCheckbox.prop('checked', false)
})

// OPTIONS: EXPORT IMPORT

optionsFile.on('change', function(){ 
  var file = optionsFile[0].files[0]
  optionsImportButton.prop('disabled', file === undefined) 
})

// Dowloads current persisted data
optionsExportButton.on('click', function () {
  downloadFile({
    filename: "wsclient.json",
    content: JSON.stringify(savedOptions)
  });
})

// Imports data
optionsImportButton.on('click', function () {
  var file = optionsFile[0].files[0]
  if (file === undefined) {
    return
  }
  importData(file)
})

// Imports data from file by using confirmation
const importData = function (file) {
  importModalBody.text('Are you sure you want to import data oberriding current settings?')
  importModalContinueButton.show()
  importModalDescription.hide()
  importModalContinueButton.on('click', function () {
      importModalDescription.hide()
      importModalContinueButton.hide()
      var reader = new FileReader()
      reader.onload = function(e){
        var data = null
        try {
          data = JSON.parse(e.target.result)
        } catch(e) {
          importModalBody.text('Error parsing data JSON')
          importModalDescription.text(e)
          importModalDescription.show()
          importModalCancelButton.text('Close')
          return;
        }
        if (data != null && data.hasOwnProperty('messages') && data.hasOwnProperty('protocols') && data.hasOwnProperty('urls') && data.hasOwnProperty('preferences')) {
          savedOptions.messages = data.messages
          savedOptions.protocols = data.protocols
          savedOptions.urls = data.urls
          savedOptions.preferences = data.preferences
          saveOptions()
          importModalDescription.hide()
          importModalBody.text('File successfully imported')
          importModalCancelButton.text('Close')
        } else {
          importModalBody.text('Error parsing data JSON')
          importModalDescription.text('No expected format found.')
          importModalDescription.show()
          importModalCancelButton.text('Close')
        }
      }
      reader.readAsText(file)
    })
  importModal.modal('show')
}

// CLIENT SECTION

// Populate URL select menu
const populateSavedUrlSelect = function () {
  const urls = savedOptions.urls.sort()
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
const populateSavedProtocolSelect = function () {
  const protocols = savedOptions.protocols.sort()
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
const populateSavedMessageSelect = function () {
  const messages = savedOptions.messages.sort()
  let options = ''
  $.each(messages, function (key, message) {
    const [name, body] = message.split(SEPARATOR)
    options += `<button class="dropdown-item message" type="button" data-value='${body}'>${name}</button>`
  })
  messageSelectOptions
    .html('')
    .append(options)
  $('.dropdown-item.message').on('click', function () {
    messageTextarea.val(stringifyJson(jQuery(this).data('value')))
    validateClientMessage()
  })
}

// Validate message textarea value, show user feedback,
// and enable or disable send button
const validateClientMessage = function () {
  const validJson = isValidJson(messageTextarea.val())
  if (validJson) {
    if (wsConnected) {
      messageSendButton.prop('disabled', false)
    } else {
      messageSendButton.prop('disabled', savedOptions.preferences.preventUsingMessage)
    }
    messageJsonInvalidWarning.hide()
    messageTextareaFormatSlider.removeClass('bwc-slider-disabled')
  } else {
    if (messageTextarea.val().length === 0) {
      messageJsonInvalidWarning.hide()
    } else {
      messageJsonInvalidWarning.show()
    }
    messageSendButton.prop('disabled', savedOptions.preferences.preventUsingMessage)
    messageTextareaFormatSlider.addClass('bwc-slider-disabled')
  }
  return validJson
}

// Enable and disable connect button based on URL input length and validation
urlInput.on('keyup', function () {
  if (urlInput.val().length === 0) {
    urlInvalidWarning.hide()
    connectButton.prop('disabled', true)
  } else {
    if (isValidUrl(urlInput.val())) {
      connectButton.prop('disabled', false)
      urlInvalidWarning.hide()
    } else {
      connectButton.prop('disabled', savedOptions.preferences.preventUsingUrl)
      urlInvalidWarning.show()
    }
  }
})

// Validate message body on textarea keyup
messageTextarea.on('keyup', function (e) {
  validateClientMessage()
})

// Toggle message textarea JSON formatting
messageTextareaFormatCheckbox.on('change', function () {
  formatTextarea($(this), messageTextarea)
})

// Clear message log
clearMessagesButton.on('click', function () {
  messages.html('')
  clearMessagesButton.prop('disabled', true)
})

// CLIENT: WEBSOCKET

// Open WebSocket connection
const open = function () {
  let url = urlInput.val().toString()
  let protocol = getProtocols(protocolInput)
  if (protocol) { ws = new WebSocket(url, protocol) } else { ws = new WebSocket(url) }
  ws.onopen = onOpen
  ws.onclose = onClose
  ws.onmessage = onMessage
  ws.onerror = onError
  connectionStatus.text('OPENING CONNECTION ...')
}

// Close WebSocket connection
const close = function () {
  if (ws) {
    console.log('CLOSING CONNECTION ...')
    wsPoliteDisconnection = true
    ws.close()
  }
}

// WebSocket onOpen handler
const onOpen = function () {
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
  validateClientMessage()
}

// WebSocket onClose handler
const onClose = function () {
  let disconnectionMessage = 'CLOSED'
  disconnectionMessage += (wsPoliteDisconnection) ? '' : '. Disconnected by the server.'
  console.log('CLOSED: ' + urlInput.val())
  ws = null
  connectButton
    .prop('disabled', false)
    .show()
  connectionStatus.text(disconnectionMessage)
  disconnectButton.hide()
  messageSendButton.prop('disabled', savedOptions.preferences.preventUsingMessage)
  urlInput.prop('disabled', false)
  protocolInput.prop('disabled', false)
  wsConnected = false
}

// WebSocket onMessage handler
const onMessage = function (event) {
  addMessage(event.data)
}

// WebSocket onError handler
const onError = function (event) {
  console.error(event.data)
}

// Add outgoing and incoming message to DOM, formatting as necessary
// Format incoming messages to open JSON pretty-print modal on click
const addMessage = function (data, type) {
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
        jsonModalBody.html(getJsonModalBody(jQuery(this).data('target')))
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
const sendMessage = function () {
  let message = messageTextarea.val()
  addMessage(message, 'SENT')
  ws.send(message)
}

// Connect button click
connectButton.on('click', function () {
  close()
  open()
})

// Disconnect button click
disconnectButton.on('click', function () {
  close()
})

// Send message button click
messageSendButton.on('click', function () {
  sendMessage()
})

// Allow Ctrl+Enter shortcut to send message from message body textarea
messageTextarea.on('keydown', function (e) {
  const sendEnabled = !messageSendButton.prop('disabled')
  if (sendEnabled && (e.ctrlKey || e.metaKey) && (e.keyCode === 13 || e.keyCode === 10)) {
    sendMessage()
  }
})

// UTILITIES

// Return JSON Modal body used for pretty-printing
// Handles valid and invalid JSON and valid JSON objects enclosed within a string
const getJsonModalBody = function (string) {
  const prefix = '<p><code class="bwc-code">'
  const suffix = '</code></p>'
  let body = ''
  let wrapperPrefix
  let wrapperSuffix
  if (isValidJson(string)) {
    body = `<pre>${highlightJson(string)}</pre>`
  } else {
    const curlyBracketSubstring = string.substring(string.indexOf('{'), string.lastIndexOf('}') + 1)
    const squareBracketSubstring = string.substring(string.indexOf('['), string.lastIndexOf(']') + 1)
    const curlyValid = isValidJson(curlyBracketSubstring)
    const squareValid = isValidJson(squareBracketSubstring)
    const curlyLonger = curlyBracketSubstring.length >= squareBracketSubstring.length
    if (curlyLonger && curlyValid) {
      wrapperPrefix = string.substring(0, string.indexOf('{'))
      wrapperSuffix = string.substring(string.lastIndexOf('}') + 1, string.length)
      if (wrapperPrefix) body += `${prefix}${wrapperPrefix}${suffix}`
      body += `<pre>${highlightJson(curlyBracketSubstring)}</pre>`
      if (wrapperSuffix) body += `${prefix}${wrapperSuffix}${suffix}`
    } else if (squareValid) {
      wrapperPrefix = string.substring(0, string.indexOf('['))
      wrapperSuffix = string.substring(string.lastIndexOf(']') + 1, string.length)
      if (wrapperPrefix) body += `${prefix}${wrapperPrefix}${suffix}`
      body += `<pre>${highlightJson(squareBracketSubstring)}</pre>`
      if (wrapperSuffix) body += `${prefix}${wrapperSuffix}${suffix}`
    } else {
      body = `<p class ="alert alert-warning rounded hide" role="alert">This message does not contain any valid JSON.</p>
              <p><code class="bwc-key">${string}</code></p>`
    }
  }
  return body
}

// Change collapse header chevron to up on show and down on hide
const setChevron = function (id) {
  const anchor = $(`#${id}Anchor`)
  if (anchor.attr('aria-expanded') === 'true') {
    anchor
      .find('.bwc-accordion-heading-icon')
      .attr('data-icon', 'chevron-up')
  } else {
    anchor
      .find('.bwc-accordion-heading-icon')
      .attr('data-icon', 'chevron-down')
  }
}

// Change chevron on show
$('div.collapse').on('shown.bs.collapse', function () {
  setChevron($(this).attr('id'))
})

// Change chevron on hide
$('div.collapse').on('hidden.bs.collapse', function () {
  setChevron($(this).attr('id'))
})

// Ensure status messages are not persistent
$('*').focus(function () {
  optionsUrlStatus.text('').hide()
  optionsProtocolStatus.text('').hide()
  optionsMessageStatus.text('').hide()
})

// Document ready
$(document).ready(function () {
  loadOptions()
  $('.hide').hide()
  $('[data-toggle="popover"]').popover()
  optionsUrlInput.val('')
  optionsProtocolInput.val('')
  optionsMessageNameInput.val('')
  optionsMessageTextarea.val('')
  urlInput.val('')
  protocolInput.val('')
  messageTextarea.val('')
  optionsMessageTextareaFormatCheckbox.prop('checked', false)
  messageTextareaFormatCheckbox.prop('checked', false)
})

// Used in unit tests
export {
  deleteOptions,
  getJsonModalBody,
  getProtocols,
  highlightJson,
  isValidJson,
  isValidUrl,
  stringifyJson
}
