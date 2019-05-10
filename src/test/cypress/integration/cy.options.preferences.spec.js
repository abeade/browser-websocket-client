describe('Options -> Preferences', function () {
  const urlInvalid = 's://test'
  const messageInvalid = '"missingLeadingBracket": true}'

  beforeEach(() => {
    cy.mockChromeStorageAndVisit('/#options')
    cy.get('#optionsPreferencesAnchor').click()
    cy.get('#optionsPreferences').should('be.visible')
  })

  it('clicking "i" icon should show and hide popover', function() {
    // TODO redo these 
    // Prevent Saving Invalid URL
    cy.log('Prevent Saving Invalid URL')
    cy.get('[data-test=popover-save-url]').click()
    cy.get('[data-title="Prevent Saving Invalid URL"]').should('have.attr', 'aria-describedby')
    cy.get('[data-test=popover-save-url]').click()
    cy.get('[data-title="Prevent Saving Invalid URL"]').should('not.have.attr', 'aria-describedby')

    // Prevent Using Invalid URL
    cy.log('Prevent Using Invalid URL')
    cy.get('[data-test=popover-use-url]').click()
    cy.get('[data-title="Prevent Using Invalid URL"]').should('have.attr', 'aria-describedby')
    cy.get('[data-test=popover-use-url]').click()
    cy.get('[data-title="Prevent Using Invalid URL"]').should('not.have.attr', 'aria-describedby')

    // Prevent Saving Message Body with Invalid JSON
    cy.log('Prevent Saving Message Body with Invalid JSON')
    cy.get('[data-test=popover-save-message]').click()
    cy.get('[data-title="Prevent Saving Message Body with Invalid JSON"]').should('have.attr', 'aria-describedby')
    cy.get('[data-test=popover-save-message]').click()
    cy.get('[data-title="Prevent Saving Message Body with Invalid JSON"]').should('not.have.attr', 'aria-describedby')

    // Prevent Using Message Body with Invalid JSON
    cy.log('Prevent Using Message Body with Invalid JSON')
    cy.get('[data-test=popover-use-message]').click()
    cy.get('[data-title="Prevent Using Message Body with Invalid JSON"]').should('have.attr', 'aria-describedby')
    cy.get('[data-test=popover-use-message]').click()
    cy.get('[data-title="Prevent Using Message Body with Invalid JSON"]').should('not.have.attr', 'aria-describedby')
  })

  it('prevent saving an invalid URL in the Options section', function () {
    cy.get('#preferencesOptionsUrlCheckbox').then((checkbox) => {
      if (!checkbox.prop('checked')) {
        cy.get('#preferencesOptionsUrlSlider').click()
      }
    })
    cy.get('#preferencesOptionsUrlCheckbox').should('be.checked')
    cy.get('#optionsUrlsAnchor').click()
    cy.get('#optionsUrlsAnchor').click()
    cy.get('#optionsUrls').should('be.visible')
    cy.get('#optionsUrlInput')
      .clear()
      .type(urlInvalid)
    cy.fixture('optionsDefaults').then((input) => {
      input.optionsUrlInputValue = urlInvalid
      input.optionsUrlInvalidWarningVisible = ''
      input.optionsUrlSaveButtonDisabled = ''
      cy.checkOptionsUrls(input)
    })
  })

  it('allow saving an invalid URL in the Options section', function () {
    cy.get('#preferencesOptionsUrlCheckbox').then((checkbox) => {
      if (checkbox.prop('checked')) {
        cy.get('#preferencesOptionsUrlSlider').click()
      }
    })
    cy.get('#preferencesOptionsUrlCheckbox').should('not.be.checked')
    cy.get('#optionsUrlsAnchor').click()
    cy.get('#optionsUrlsAnchor').click()
    cy.get('#optionsUrls').should('be.visible')
    cy.get('#optionsUrlInput')
      .clear()
      .type(urlInvalid)
    cy.fixture('optionsDefaults').then((input) => {
      input.optionsUrlInputValue = urlInvalid
      input.optionsUrlInvalidWarningVisible = ''
      input.optionsUrlSaveButtonDisabled = 'not.'
      cy.checkOptionsUrls(input)
    })
  })

  it('prevent saving an invalid message body in the Options section', function () {
    const name = 'name'
    cy.get('#preferencesOptionsMessageCheckbox').then((checkbox) => {
      if (!checkbox.prop('checked')) {
        cy.get('#preferencesOptionsMessageSlider').click()
      }
    })
    cy.get('#preferencesOptionsMessageCheckbox').should('be.checked')
    cy.get('#optionsMessagesAnchor').click()
    cy.get('#optionsMessagesAnchor').click()
    cy.get('#optionsMessages').should('be.visible')
    cy.get('#optionsMessageNameInput')
      .clear()
      .type(name)
    cy.get('#optionsMessageTextarea')
      .clear()
      .type(messageInvalid)
    cy.fixture('optionsDefaults').then((input) => {
      input.optionsMessageNameInputValue = name
      input.optionsMessageTextareaValue = messageInvalid
      input.optionsMessageJsonInvalidWarningVisible = ''
      input.optionsMessageSaveButtonDisabled = ''
      cy.checkOptionsMessages(input)
    })
  })

  it('allow saving an invalid message body in the Options section', function () {
    const name = 'name'
    cy.get('#preferencesOptionsMessageCheckbox').then((checkbox) => {
      if (checkbox.prop('checked')) {
        cy.get('#preferencesOptionsMessageSlider').click()
      }
    })
    cy.get('#preferencesOptionsMessageCheckbox').should('not.be.checked')
    cy.get('#optionsMessagesAnchor').click()
    cy.get('#optionsMessagesAnchor').click()
    cy.get('#optionsMessages').should('be.visible')
    cy.get('#optionsMessageNameInput')
      .clear()
      .type(name)
    cy.get('#optionsMessageTextarea')
      .clear()
      .type(messageInvalid)
    cy.fixture('optionsDefaults').then((input) => {
      input.optionsMessageNameInputValue = name
      input.optionsMessageTextareaValue = messageInvalid
      input.optionsMessageJsonInvalidWarningVisible = ''
      input.optionsMessageSaveButtonDisabled = 'not.'
      cy.checkOptionsMessages(input)
    })
  })

  it('prevent using an invalid URL in the Client section', function () {
    cy.get('#preferencesClientUrlCheckbox').then((checkbox) => {
      if (!checkbox.prop('checked')) {
        cy.get('#preferencesClientUrlSlider').click()
      }
    })
    cy.get('#preferencesClientUrlCheckbox').should('be.checked')
    cy.get('#clientAnchor').click()
    cy.get('#clientAnchor').click()
    cy.get('#client').should('be.visible')
    cy.get('#urlInput')
      .clear()
      .type(urlInvalid)
    cy.fixture('clientDefaults').then((input) => {
      input.urlInputValue = urlInvalid
      input.urlInvalidWarningVisible = ''
      input.connectButtonDisabled = ''
      cy.checkClient(input)
    })
  })

  it('allow using an invalid URL in the Client section', function () {
    cy.get('#preferencesClientUrlCheckbox').then((checkbox) => {
      if (checkbox.prop('checked')) {
        cy.get('#preferencesClientUrlSlider').click()
      }
    })
    cy.get('#preferencesClientUrlCheckbox').should('not.be.checked')
    cy.get('#clientAnchor').click()
    cy.get('#clientAnchor').click()
    cy.get('#client').should('be.visible')
    cy.get('#urlInput')
      .clear()
      .type(urlInvalid)
    cy.fixture('clientDefaults').then((input) => {
      input.urlInputValue = urlInvalid
      input.urlInvalidWarningVisible = ''
      input.connectButtonDisabled = 'not.'
      cy.checkClient(input)
    })
  })

  it('prevent using an invalid message body in the Client section', function () {
    cy.get('#preferencesClientMessageCheckbox').then((checkbox) => {
      if (!checkbox.prop('checked')) {
        cy.get('#preferencesClientMessageSlider').click()
      }
    })
    cy.get('#preferencesClientMessageCheckbox').should('be.checked')
    cy.get('#clientAnchor').click()
    cy.get('#clientAnchor').click()
    cy.get('#client').should('be.visible')
    cy.get('#messageTextarea')
      .clear()
      .type(messageInvalid)
    cy.fixture('clientDefaults').then((input) => {
      input.messageTextareaValue = messageInvalid
      input.messageJsonInvalidWarningVisible = ''
      input.messageSendButtonDisabled = ''
      cy.checkClient(input)
    })
  })

  it('allow using an invalid message body in the Client section', function () {
    cy.get('#preferencesClientMessageCheckbox').then((checkbox) => {
      if (checkbox.prop('checked')) {
        cy.get('#preferencesClientMessageSlider').click()
      }
    })
    cy.get('#preferencesClientMessageCheckbox').should('not.be.checked')
    cy.get('#clientAnchor').click()
    cy.get('#clientAnchor').click()
    cy.get('#client').should('be.visible')
    cy.get('#messageTextarea')
      .clear()
      .type(messageInvalid)
    cy.fixture('clientDefaults').then((input) => {
      input.messageTextareaValue = messageInvalid
      input.messageJsonInvalidWarningVisible = ''
      input.messageSendButtonDisabled = 'not.'
      cy.checkClient(input)
    })
  })
})
