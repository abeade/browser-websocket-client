describe('Options -> Messages', function () {
  const message = '{"Message 1":{"null":null,"number":42,"string":"is the answer to everything","boolean":false}}'
  const inputMessage = message.replace(/{/g, '{{}')
  const messageNameNew = 'One New'
  const messageInvalid = '"missingLeadingBracket": true}'
  const textareaFormatSliderDisabledClass = 'bwc-slider bwc-slider-disabled'
  const textareaFormatSliderEnabledClass = 'bwc-slider'

  beforeEach(function () {
    cy.mockChromeStorageAndVisit('/#options')
    cy.get('#optionsMessagesAnchor').click()
    cy.get('#optionsMessages').should('be.visible')
    cy.wait(400)
  })

  it('entering and then deleting text in #optionsMessageNameInput should show #optionsMessageNameInvalid', function () {
    cy.get('#optionsMessageNameInput')
      .clear()
      .type('a{backspace}')
    cy.fixture('optionsDefaults').then((input) => {
      input.optionsUrlNoneSavedVisible = 'not.'
      input.optionsProtocolNoneSavedVisible = 'not.'
      input.optionsMessageNameInvalidVisible = ''
      cy.checkOptionsMessages(input)
    })
  })

  it('entering a message with invalid JSON in #optionsMessageTextarea should show #optionsMessageJsonInvalidWarning', function () {
    cy.get('#optionsMessageTextarea')
      .clear()
      .type(messageInvalid)
    cy.fixture('optionsDefaults').then((input) => {
      input.optionsUrlNoneSavedVisible = 'not.'
      input.optionsProtocolNoneSavedVisible = 'not.'
      input.optionsMessageTextareaValue = messageInvalid
      input.optionsMessageJsonInvalidWarningVisible = ''
      cy.checkOptionsMessages(input)
    })
  })

  it('entering and then deleting text in #optionsMessageTextarea should show #optionsMessageTextareaEmpty', function () {
    cy.get('#optionsMessageTextarea')
      .clear()
      .type('a{backspace}')
    cy.fixture('optionsDefaults').then((input) => {
      input.optionsMessageTextareaEmptyVisible = ''
      cy.checkOptionsMessages(input)
    })
  })

  it('toggle JSON formatting', function () {
    cy.get('#optionsMessageNameInput').clear().type('One')
    cy.get('#optionsMessageTextarea').clear().type(inputMessage)
    cy.get('#optionsMessageTextarea').should(($textarea) => {
      expect($textarea.val().split(/\r*\n/).length).to.eq(1)
    })
    cy.get('#optionsMessageTextareaFormatSlider').click()
    cy.get('#optionsMessageTextarea').should(($textarea) => {
      expect($textarea.val().split(/\r*\n/).length).to.be.greaterThan(1)
    })
    cy.get('#optionsMessageTextareaFormatSlider').click()
    cy.get('#optionsMessageTextarea').should(($textarea) => {
      expect($textarea.val().split(/\r*\n/).length).to.eq(1)
    })
  })

  it('saving and working with a message', function () {
    // save a message
    cy.log('save a message')
    cy.get('#optionsMessageNameInput')
      .clear()
      .type('One')
    cy.get('#optionsMessageTextarea')
      .clear()
      .type(inputMessage)
    cy.get('#optionsMessageSaveButton').click()
    cy.fixture('optionsDefaults').then((input) => {
      input.optionsMessageNoneSavedVisible = 'not.'
      input.optionsMessageSavedTableVisible = ''
      input.optionsMessageStatusText = 'Message saved.'
      input.optionsMessageStatusVisible = ''
      input.optionsMessageTextareaEmptyVisible = 'not.'
      input.optionsMessageTextareaFormatSliderClass = textareaFormatSliderDisabledClass
      cy.checkOptionsMessages(input)
    })

    // clicking printer icon should show JSON modal
    cy.log('clicking printer icon should show JSON modal')
    cy.get('.printMessage').click({ force: true })
    cy.get('#jsonModal').should('be.visible')
    cy.get('#jsonModalTitle').invoke('text').should('be', 'One')
    cy.get('#jsonModalBody').find('.bwc-key').should('have.length', 5)
    cy.get('#jsonModalBody').find('.bwc-null').should('have.length', 1)
    cy.get('#jsonModalBody').find('.bwc-number').should('have.length', 1)
    cy.get('#jsonModalBody').find('.bwc-string').should('have.length', 1)
    cy.get('#jsonModalBody').find('.bwc-boolean').should('have.length', 1)
    cy.get('#jsonModalCloseButton').click()
    cy.get('#jsonModal').should('not.be.visible')

    // click edit icon and then cancel button
    cy.log('click edit icon and then cancel button')
    cy.get('.editMessage').click()
    cy.fixture('optionsDefaults').then((input) => {
      input.optionsMessageNameInputLabelText = 'Editing message: One'
      input.optionsMessageNameInputValue = 'One'
      input.optionsMessageNoneSavedVisible = 'not.'
      input.optionsMessageSaveButtonDisabled = 'not.'
      input.optionsMessageSavedTableVisible = ''
      input.optionsMessageStatusVisible = 'not.'
      input.optionsMessageTextareaEmptyVisible = 'not.'
      input.optionsMessageTextareaFormatSliderClass = textareaFormatSliderEnabledClass
      input.optionsMessageTextareaValue = message
      cy.checkOptionsMessages(input)
    })
    cy.get('#optionsMessageCancelEditButton').click()
    cy.fixture('optionsDefaults').then((input) => {
      input.optionsMessageNameInputValue = ''
      input.optionsMessageNoneSavedVisible = 'not.'
      input.optionsMessageSaveButtonDisabled = ''
      input.optionsMessageSavedTableVisible = ''
      input.optionsMessageStatusVisible = 'not.'
      input.optionsMessageTextareaEmptyVisible = 'not.'
      input.optionsMessageTextareaFormatSliderClass = textareaFormatSliderDisabledClass
      input.optionsMessageTextareaValue = ''
      cy.checkOptionsMessages(input)
    })

    // click edit icon and then save button
    cy.log('click edit icon and then save button')
    cy.get('.editMessage').click()
    cy.get('#optionsMessageNameInput').type(' New')
    cy.get('#optionsMessageSaveButton').click()
    cy.fixture('optionsDefaults').then((input) => {
      input.optionsMessageNoneSavedVisible = 'not.'
      input.optionsMessageSavedTableVisible = ''
      input.optionsMessageStatusText = 'Message saved.'
      input.optionsMessageStatusVisible = ''
      input.optionsMessageTextareaEmptyVisible = 'not.'
      cy.checkOptionsMessages(input)
    })
    cy.get('#optionsMessageSavedTable').find('.bwc-table-row').should('be', messageNameNew)

    // use saved message in client
    cy.log('use saved message in client')
    cy.get('#clientAnchor').click()
    cy.get('#client').should('be.visible')
    cy.get('#messageSelectMenu').click()
    cy.get('.dropdown-item.message').invoke('text').should('be', messageNameNew)
    cy.get('.dropdown-item.message').click()
    cy.fixture('clientDefaults').then((input) => {
      input.messageSelectMenuVisible = ''
      input.messageTextareaFormatSliderClass = textareaFormatSliderEnabledClass
      input.messageTextareaValue = message
      cy.checkClient(input)
    })

    // click delete icon and then cancel button
    cy.log('click delete icon and then cancel button')
    cy.get('#optionsAnchor').click()
    cy.get('#options').should('be.visible')
    cy.get('#optionsMessages').should('be.visible')
    cy.get('.deleteMessage').click()
    cy.get('#deleteModal').should('be.visible')
    cy.get('#deleteModalName').invoke('text').should('be', messageNameNew)
    cy.get('#deleteModalCancelButton').click()
    cy.get('#deleteModal').should('not.be.visible')
    cy.fixture('optionsDefaults').then((input) => {
      input.optionsMessageNoneSavedVisible = 'not.'
      input.optionsMessageSavedTableVisible = ''
      cy.checkOptionsMessages(input)
    })

    // click delete icon and then delete button
    cy.log('click delete icon and then delete button')
    cy.get('.deleteMessage').click()
    cy.get('#deleteModal').should('be.visible')
    cy.get('#deleteModalBody').invoke('text').should('be', 'Are you sure you want to delete the message shown below?')
    cy.get('#deleteModalName').invoke('text').should('be', messageNameNew)
    cy.get('#deleteModalDeleteButton').invoke('text').should('be', 'Delete!')
    cy.get('#deleteModalCancelButton').invoke('text').should('be', 'Cancel')
    cy.get('#deleteModalDeleteButton').click()
    cy.get('#deleteModalBody').invoke('text').should('be', 'Message deleted:')
    cy.get('#deleteModalName').invoke('text').should('be', messageNameNew)
    cy.get('#deleteModalDeleteButton').should('not.be.visible')
    cy.get('#deleteModalCancelButton').invoke('text').should('be', 'Close')
    cy.get('#deleteModalCancelButton').click()
    cy.get('#deleteModal').should('not.be.visible')
    cy.fixture('optionsDefaults').then((input) => {
      cy.checkOptionsMessages(input)
    })
  })
})
