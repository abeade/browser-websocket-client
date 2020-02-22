Cypress.Commands.add('mockChromeStorageAndVisit', {prevSubject: false}, (url) => {
  cy.visit(url || '/', {
    onBeforeLoad (window) {
      window.chrome = {}
      window.chrome.storage = {}
      window.chrome.storage.sync = {
        data: {
          savedOptions: {
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
        },
        get: function (key, callback) {
          callback({key: window.chrome.storage.sync.data[key]})
        },
        set: function ({key, value}, callback) {
          window.chrome.storage.sync.data[key] = value
          callback()
        }
      }
    }
  })
})

Cypress.Commands.add('checkOptionsUrls', {prevSubject: false}, (input) => {
  cy.get('#optionsUrlCancelEditButton').should(`${input.optionsUrlCancelEditButtonDisabled}be.disabled`)
  cy.get('#optionsUrlInput').should('have.value', input.optionsUrlInputValue)
  cy.get('#optionsUrlInputEmpty').should(`${input.optionsUrlInputEmptyVisible}be.visible`)
  cy.get('#optionsUrlInputLabel').invoke('text').should('be', input.optionsUrlInputLabelText)
  cy.get('#optionsUrlInvalidWarning').should(`${input.optionsUrlInvalidWarningVisible}be.visible`)
  cy.get('#optionsUrlNoneSaved').should(`${input.optionsUrlNoneSavedVisible}be.visible`)
  cy.get('#optionsUrlSaveButton').should(`${input.optionsUrlSaveButtonDisabled}be.disabled`)
  cy.get('#optionsUrlSavedTable').should(`${input.optionsUrlSavedTableVisible}be.visible`)
  cy.get('#optionsUrlStatus').invoke('text').should('be', input.optionsUrlStatusText)
  cy.get('#optionsUrlStatus').should(`${input.optionsUrlStatusVisible}be.visible`)
})

Cypress.Commands.add('checkOptionsProtocols', {prevSubject: false}, (input) => {
  cy.get('#optionsProtocolCancelEditButton').should(`${input.optionsProtocolCancelEditButtonDisabled}be.disabled`)
  cy.get('#optionsProtocolInput').should('have.value', input.optionsProtocolInputValue)
  cy.get('#optionsProtocolInputEmpty').should(`${input.optionsProtocolInputEmptyVisible}be.visible`)
  cy.get('#optionsProtocolInputLabel').invoke('text').should('be', input.optionsProtocolInputLabelText)
  cy.get('#optionsProtocolNoneSaved').should(`${input.optionsProtocolNoneSavedVisible}be.visible`)
  cy.get('#optionsProtocolSaveButton').should(`${input.optionsProtocolSaveButtonDisabled}be.disabled`)
  cy.get('#optionsProtocolSavedTable').should(`${input.optionsProtocolSavedTableVisible}be.visible`)
  cy.get('#optionsProtocolStatus').invoke('text').should('be', input.optionsProtocolStatusText)
  cy.get('#optionsProtocolStatus').should(`${input.optionsProtocolStatusVisible}be.visible`)
})

Cypress.Commands.add('checkOptionsMessages', {prevSubject: false}, (input) => {
  cy.get('#optionsMessageCancelEditButton').should(`${input.optionsMessageCancelEditButtonDisabled}be.disabled`)
  cy.get('#optionsMessageJsonInvalidWarning').should(`${input.optionsMessageJsonInvalidWarningVisible}be.visible`)
  cy.get('#optionsMessageNameInput').should('have.value', input.optionsMessageNameInputValue)
  cy.get('#optionsMessageNameInputLabel').invoke('text').should('be', input.optionsMessageNameInputLabelText)
  cy.get('#optionsMessageNameInvalid').should(`${input.optionsMessageNameInvalidVisible}be.visible`)
  cy.get('#optionsMessageNoneSaved').should(`${input.optionsMessageNoneSavedVisible}be.visible`)
  cy.get('#optionsMessageSaveButton').should(`${input.optionsMessageSaveButtonDisabled}be.disabled`)
  cy.get('#optionsMessageSavedTable').should(`${input.optionsMessageSavedTableVisible}be.visible`)
  cy.get('#optionsMessageStatus').invoke('text').should('be', input.optionsMessageStatusText)
  cy.get('#optionsMessageStatus').should(`${input.optionsMessageStatusVisible}be.visible`)
  cy.get('#optionsMessageTextarea').should('have.value', input.optionsMessageTextareaValue)
  cy.get('#optionsMessageTextareaEmpty').should(`${input.optionsMessageTextareaEmptyVisible}be.visible`)
  cy.get('#optionsMessageTextareaFormatSlider').should('have.class', input.optionsMessageTextareaFormatSliderClass)
  cy.get('#optionsMessageTextareaLabel').invoke('text').should('be', input.optionsMessageTextareaLabelText)
})

Cypress.Commands.add('checkOptions', {prevSubject: false}, (input) => {
  cy.checkOptionsMessages(input)
  cy.checkOptionsProtocols(input)
  cy.checkOptionsUrls(input)
})

Cypress.Commands.add('checkClient', {prevSubject: false}, (input) => {
  cy.get('#clearMessagesButton').should(`${input.clearMessagesButtonDisabled}be.disabled`)
  cy.get('#connectButton').should(`${input.connectButtonDisabled}be.disabled`)
  cy.get('#connectButton').should(`${input.connectButtonVisible}be.visible`)
  cy.get('#connectionStatus').invoke('text').should('be', input.connectionStatusText)
  cy.get('#disconnectButton').should(`${input.disconnectButtonVisible}be.visible`)
  cy.get('#jsonModal').should(`${input.jsonModalVisible}be.visible`)
  cy.get('#messageJsonInvalidWarning').should(`${input.messageJsonInvalidWarningVisible}be.visible`)
  cy.get('#messages').invoke('text').should('be', input.messagesText)
  cy.get('#messageSelectMenu').should(`${input.messageSelectMenuVisible}be.visible`)
  cy.get('#messageSendButton').should(`${input.messageSendButtonDisabled}be.disabled`)
  cy.get('#messageTextarea').should('have.value', input.messageTextareaValue)
  cy.get('#messageTextareaFormatSlider').should('have.class', input.messageTextareaFormatSliderClass)
  cy.get('#protocolInput').should('have.value', input.protocolInputValue)
  cy.get('#protocolSelectMenu').should(`${input.protocolSelectMenuVisible}be.visible`)
  cy.get('#urlInput').should('have.value', input.urlInputValue)
  cy.get('#urlInvalidWarning').should(`${input.urlInvalidWarningVisible}be.visible`)
  cy.get('#urlSelectMenu').should(`${input.urlSelectMenuVisible}be.visible`)
})

Cypress.Commands.add('uploadFile', { prevSubject: true }, (subject, fileName) => {
  cy.fixture(fileName).then((content) => {
      const el = subject[0]
      const testFile = new File([JSON.stringify(content)], fileName, {type: "text/plain;charset=utf-8"})
      const dataTransfer = new DataTransfer()
      dataTransfer.items.add(testFile)
      el.files = dataTransfer.files
      cy.wrap(subject).trigger('change', { force: true })
  })
})

Cypress.Commands.add('uploadFileContent', { prevSubject: true }, (subject, fileName, content) => {
  const el = subject[0]
  const testFile = new File([content], fileName, {type: "text/plain;charset=utf-8"})
  const dataTransfer = new DataTransfer()
  dataTransfer.items.add(testFile)
  el.files = dataTransfer.files
  cy.wrap(subject).trigger('change', { force: true })
})