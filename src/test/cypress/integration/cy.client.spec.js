describe('Client', function () {
  const message = '{"Message 1":{"null":null,"number":42,"string":"is the answer to everything","boolean":false}}'
  const inputMessage = message.replace(/{/g, '{{}')

  beforeEach(function () {
    cy.mockChromeStorageAndVisit()
  })

  it('verify defaults', function () {
    cy.fixture('clientDefaults').then((input) => {
      cy.checkClient(input)
    })
  })

  it('entering invalid JSON in #messageTextarea should show #messageJsonInvalidWarning', function () {
    const messageInvalid = '"missingLeadingBracket": true}'
    cy.get('#messageTextarea').clear().type(messageInvalid)
    cy.fixture('clientDefaults').then((input) => {
      input.messageJsonInvalidWarningVisible = ''
      input.messageTextareaValue = messageInvalid
      cy.checkClient(input)
    })
  })

  it('toggle JSON formatting', function () {
    cy.get('#messageTextarea').clear().type(inputMessage)
    cy.get('#messageTextarea').should(($textarea) => {
      expect($textarea.val().split(/\r*\n/).length).to.eq(1)
    })
    cy.get('#messageTextareaFormatSlider').click()
    cy.get('#messageTextarea').should(($textarea) => {
      expect($textarea.val().split(/\r*\n/).length).to.be.greaterThan(1)
    })
    cy.get('#messageTextareaFormatSlider').click()
    cy.get('#messageTextarea').should(($textarea) => {
      expect($textarea.val().split(/\r*\n/).length).to.eq(1)
    })
  })

  it('connection and message tests', function () {
    const echoServer = 'ws://demos.kaazing.com/echo'
    const textareaFormatSliderEnabledClass = 'bwc-slider'

    // connect to server
    cy.log('connect to server')
    cy.get('#urlInput')
      .clear()
      .type(echoServer)
    cy.get('#connectButton').click()
    cy.get('#disconnectButton').should('be.enabled')
    // cy.get('#connectionStatus').invoke('text').should('be', 'OPENED')
    cy.fixture('clientDefaults').then((input) => {
      input.urlInputValue = echoServer
      input.connectionStatusText = 'OPENED'
      input.connectButtonVisible = 'not.'
      input.disconnectButtonVisible = ''
      cy.checkClient(input)
    })

    // send message using send button
    cy.log('send message using send button')
    cy.get('#messageTextarea').clear().type(inputMessage)
    cy.get('#messageSendButton').click()
    cy.get('.bwc-sent').invoke('text').should('be', message)
    cy.fixture('clientDefaults').then((input) => {
      input.urlInputValue = echoServer
      input.connectionStatusText = 'OPENED'
      input.connectButtonVisible = 'not.'
      input.disconnectButtonVisible = ''
      input.messageTextareaValue = message
      input.messageTextareaFormatSliderClass = textareaFormatSliderEnabledClass
      input.messageSendButtonDisabled = 'not.'
      input.clearMessagesButtonDisabled = 'not.'
      input.messagesText = `${message}\n${message}`
      cy.checkClient(input)
    })

    // open message with JSON modal and close modal
    cy.log('open message with JSON modal')
    cy.get('.bwc-received').click()
    cy.get('#jsonModal').should('be.visible')
    cy.get('#jsonModalTitle').invoke('text').should('be', 'Incoming Message')
    cy.get('#jsonModalBody').invoke('text').should('contain', 'Message 1')
    cy.get('#jsonModalCloseButton').click()
    cy.get('#jsonModal').should('not.be.visible')

    // clear messages
    cy.log('clear messages')
    cy.get('#clearMessagesButton').click()
    cy.get('#messages').invoke('text').should('be', '')

    // send message with Ctrl + Enter
    cy.log('send message with Ctrl + Enter')
    cy.get('#messageTextarea').clear().type(`${inputMessage}{ctrl}{enter}`)
    cy.get('.bwc-sent').invoke('text').should('be', message)
    cy.fixture('clientDefaults').then((input) => {
      input.urlInputValue = echoServer
      input.connectionStatusText = 'OPENED'
      input.connectButtonVisible = 'not.'
      input.disconnectButtonVisible = ''
      input.messageTextareaValue = `${message}\n`
      input.messageTextareaFormatSliderClass = textareaFormatSliderEnabledClass
      input.messageSendButtonDisabled = 'not.'
      input.clearMessagesButtonDisabled = 'not.'
      input.messagesText = `${message}\n${message}`
      cy.checkClient(input)
    })

    // disconnect from server
    cy.log('disconnect from server')
    cy.get('#disconnectButton').click()
    cy.get('#connectButton').should('be.visible')
    cy.fixture('clientDefaults').then((input) => {
      input.urlInputValue = echoServer
      input.connectionStatusText = 'CLOSED'
      input.connectButtonVisible = ''
      input.connectButtonDisabled = 'not.'
      input.disconnectButtonVisible = 'not.'
      input.messageTextareaValue = `${message}\n`
      input.messageTextareaFormatSliderClass = textareaFormatSliderEnabledClass
      input.clearMessagesButtonDisabled = 'not.'
      input.messagesText = `${message}\n${message}`
      cy.checkClient(input)
    })
  })
})
