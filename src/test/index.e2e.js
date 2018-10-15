describe('Browser WebSocket Client', function () {
  const EC = protractor.ExpectedConditions
  const EXTENSION_ID = 'bekcoofjhbhgplgbiemoeopghmholjel'
  const KEY_BACKSPACE = protractor.Key.BACK_SPACE
  const KEY_CTRL = protractor.Key.CONTROL
  const KEY_ENTER = protractor.Key.ENTER
  const SLEEP = 500
  const WAIT = 5000
  const echoServer = 'ws://demos.kaazing.com/echo'
  const element = protractor.element
  const messageInvalid = '"missingLeadingBracket": true}'
  const message1 = '{"Message 1":{"null":null,"number":42,"string":"is the answer to everything","boolean":false}}'
  const message2 = '{"Message 2":{"null":null,"number":42,"string":"is the answer to everything","boolean":false}}'
  const message3 = '{"Message 3":{"null":null,"number":42,"string":"is the answer to everything","boolean":false}}'

  // Options HTML elements
  const deleteModal = element(by.id('deleteModal'))
  const deleteModalBody = element(by.id('deleteModalBody'))
  const deleteModalCancelButton = element(by.id('deleteModalCancelButton'))
  const deleteModalDeleteButton = element(by.id('deleteModalDeleteButton'))
  const deleteModalName = element(by.id('deleteModalName'))
  const options = element(by.id('options'))
  const optionsAnchor = element(by.id('optionsAnchor'))
  const optionsMessageCancelEditButton = element(by.id('optionsMessageCancelEditButton'))
  const optionsMessageJsonInvalidWarning = element(by.id('optionsMessageJsonInvalidWarning'))
  const optionsMessageNameInput = element(by.id('optionsMessageNameInput'))
  const optionsMessageNameInputLabel = element(by.id('optionsMessageNameInputLabel'))
  const optionsMessageNameInvalid = element(by.id('optionsMessageNameInvalid'))
  const optionsMessageNoneSaved = element(by.id('optionsMessageNoneSaved'))
  const optionsMessageSaveButton = element(by.id('optionsMessageSaveButton'))
  const optionsMessageSavedTable = element(by.id('optionsMessageSavedTable'))
  const optionsMessageStatus = element(by.id('optionsMessageStatus'))
  const optionsMessageTextarea = element(by.id('optionsMessageTextarea'))
  const optionsMessageTextareaEmpty = element(by.id('optionsMessageTextareaEmpty'))
  const optionsMessageTextareaFormatSlider = element(by.id('optionsMessageTextareaFormatSlider'))
  const optionsMessageTextareaLabel = element(by.id('optionsMessageTextareaLabel'))
  const optionsProtocolCancelEditButton = element(by.id('optionsProtocolCancelEditButton'))
  const optionsProtocolInput = element(by.id('optionsProtocolInput'))
  const optionsProtocolInputEmpty = element(by.id('optionsProtocolInputEmpty'))
  const optionsProtocolInputLabel = element(by.id('optionsProtocolInputLabel'))
  const optionsProtocolNoneSaved = element(by.id('optionsProtocolNoneSaved'))
  const optionsProtocolSaveButton = element(by.id('optionsProtocolSaveButton'))
  const optionsProtocolSavedTable = element(by.id('optionsProtocolSavedTable'))
  const optionsProtocolStatus = element(by.id('optionsProtocolStatus'))
  const optionsUrlCancelEditButton = element(by.id('optionsUrlCancelEditButton'))
  const optionsUrlInput = element(by.id('optionsUrlInput'))
  const optionsUrlInputEmpty = element(by.id('optionsUrlInputEmpty'))
  const optionsUrlInputLabel = element(by.id('optionsUrlInputLabel'))
  const optionsUrlInvalidWarning = element(by.id('optionsUrlInvalidWarning'))
  const optionsUrlNoneSaved = element(by.id('optionsUrlNoneSaved'))
  const optionsUrlSaveButton = element(by.id('optionsUrlSaveButton'))
  const optionsUrlSavedTable = element(by.id('optionsUrlSavedTable'))
  const optionsUrlStatus = element(by.id('optionsUrlStatus'))

  // Client HTML elements
  const clearMessagesButton = element(by.id('clearMessagesButton'))
  const client = element(by.id('client'))
  const clientAnchor = element(by.id('clientAnchor'))
  const connectButton = element(by.id('connectButton'))
  const connectionStatus = element(by.id('connectionStatus'))
  const disconnectButton = element(by.id('disconnectButton'))
  const jsonModal = element(by.id('jsonModal'))
  const jsonModalBody = element(by.id('jsonModalBody'))
  const jsonModalCloseButton = element(by.id('jsonModalCloseButton'))
  const jsonModalTitle = element(by.id('jsonModalTitle'))
  const messageJsonInvalidWarning = element(by.id('messageJsonInvalidWarning'))
  const messages = element(by.id('messages'))
  const messageSelectMenu = element(by.id('messageSelectMenu'))
  const messageSendButton = element(by.id('messageSendButton'))
  const messageTextarea = element(by.id('messageTextarea'))
  const messageTextareaFormatSlider = element(by.id('messageTextareaFormatSlider'))
  const protocolInput = element(by.id('protocolInput'))
  const protocolSelectMenu = element(by.id('protocolSelectMenu'))
  const urlInput = element(by.id('urlInput'))
  const urlSelectMenu = element(by.id('urlSelectMenu'))

  // Immutable variables
  const optionsUrlInputLabelDefaultText = 'The URL should begin with ws:// or wss://:'
  const optionsProtocolInputLabelDefaultText = 'Enter a single protocol name or multiple comma-separated names:'
  const optionsMessageNameInputLabelDefaultText = 'The display name appears in the "Saved Messages" table and client drop-down menu:'
  const optionsMessageTextareaLabelDefaultText = 'The message body does not appear in the "Saved Messages" table or drop-down menu:'
  const textareaFormatSliderDisabledClass = 'bwc-slider bwc-slider-disabled'
  const textareaFormatSliderEnabledClass = 'bwc-slider'

  // Used with checkOptions()
  const optionsDefaults = {
    optionsUrlInputValue: '',
    optionsUrlInputLabelText: optionsUrlInputLabelDefaultText,
    optionsUrlInputEmptyDisplayed: false,
    optionsUrlInvalidWarningDisplayed: false,
    optionsUrlNoneSavedDisplayed: true,
    optionsUrlSavedTableDisplayed: false,
    optionsUrlStatusDisplayed: false,
    optionsUrlStatusText: '',
    optionsUrlSaveButtonEnabled: false,
    optionsUrlCancelEditButtonEnabled: true,
    optionsProtocolInputValue: '',
    optionsProtocolInputLabelText: optionsProtocolInputLabelDefaultText,
    optionsProtocolInputEmptyDisplayed: false,
    optionsProtocolNoneSavedDisplayed: true,
    optionsProtocolSavedTableDisplayed: false,
    optionsProtocolStatusDisplayed: false,
    optionsProtocolStatusText: '',
    optionsProtocolSaveButtonEnabled: false,
    optionsProtocolCancelEditButtonEnabled: true,
    optionsMessageNameInputValue: '',
    optionsMessageNameInputLabelText: optionsMessageNameInputLabelDefaultText,
    optionsMessageNameInvalidDisplayed: false,
    optionsMessageTextareaValue: '',
    optionsMessageTextareaLabelText: optionsMessageTextareaLabelDefaultText,
    optionsMessageTextareaEmptyDisplayed: false,
    optionsMessageJsonInvalidWarningDisplayed: false,
    optionsMessageTextareaFormatSliderClass: textareaFormatSliderDisabledClass,
    optionsMessageNoneSavedDisplayed: true,
    optionsMessageSavedTableDislayed: false,
    optionsMessageStatusDisplayed: false,
    optionsMessageStatusText: '',
    optionsMessageSaveButtonEnabled: false,
    optionsMessageCancelEditButtonEnabled: true
  }

  // Verify Options section
  const checkOptions = function (input) {
    expect(optionsUrlInput.getAttribute('value')).toBe(input.optionsUrlInputValue, 'optionsUrlInputValue')
    expect(optionsUrlInputLabel.getText()).toBe(input.optionsUrlInputLabelText, 'optionsUrlInputLabelText')
    expect(optionsUrlInputEmpty.isDisplayed()).toBe(input.optionsUrlInputEmptyDisplayed, 'optionsUrlInputEmptyDisplayed')
    expect(optionsUrlInvalidWarning.isDisplayed()).toBe(input.optionsUrlInvalidWarningDisplayed, 'optionsUrlInvalidWarningDisplayed')
    expect(optionsUrlNoneSaved.isDisplayed()).toBe(input.optionsUrlNoneSavedDisplayed, 'optionsUrlNoneSavedDisplayed')
    expect(optionsUrlSavedTable.isDisplayed()).toBe(input.optionsUrlSavedTableDisplayed, 'optionsUrlSavedTableDisplayed')
    expect(optionsUrlStatus.isDisplayed()).toBe(input.optionsUrlStatusDisplayed, 'optionsUrlStatusDisplayed')
    expect(optionsUrlStatus.getText()).toBe(input.optionsUrlStatusText, 'optionsUrlStatusText')
    expect(optionsUrlSaveButton.isEnabled()).toBe(input.optionsUrlSaveButtonEnabled, 'optionsUrlSaveButtonEnabled')
    expect(optionsUrlCancelEditButton.isEnabled()).toBe(input.optionsUrlCancelEditButtonEnabled, 'optionsUrlCancelEditButtonEnabled')
    expect(optionsProtocolInput.getAttribute('value')).toBe(input.optionsProtocolInputValue, 'optionsProtocolInputValue')
    expect(optionsProtocolInputLabel.getText()).toBe(input.optionsProtocolInputLabelText, 'optionsProtocolInputLabelText')
    expect(optionsProtocolInputEmpty.isDisplayed()).toBe(input.optionsProtocolInputEmptyDisplayed, 'optionsProtocolInputEmptyDisplayed')
    expect(optionsProtocolNoneSaved.isDisplayed()).toBe(input.optionsProtocolNoneSavedDisplayed, 'optionsProtocolNoneSavedDisplayed')
    expect(optionsProtocolSavedTable.isDisplayed()).toBe(input.optionsProtocolSavedTableDisplayed, 'optionsProtocolSavedTableDisplayed')
    expect(optionsProtocolStatus.isDisplayed()).toBe(input.optionsProtocolStatusDisplayed, 'optionsProtocolStatusDisplayed')
    expect(optionsProtocolStatus.getText()).toBe(input.optionsProtocolStatusText, 'optionsProtocolStatusText')
    expect(optionsProtocolSaveButton.isEnabled()).toBe(input.optionsProtocolSaveButtonEnabled, 'optionsProtocolSaveButtonEnabled')
    expect(optionsProtocolCancelEditButton.isEnabled()).toBe(input.optionsProtocolCancelEditButtonEnabled, 'optionsProtocolCancelEditButtonEnabled')
    expect(optionsMessageNameInput.getAttribute('value')).toBe(input.optionsMessageNameInputValue, 'optionsMessageNameInputValue')
    expect(optionsMessageNameInputLabel.getText()).toBe(input.optionsMessageNameInputLabelText, 'optionsMessageNameInputLabelText')
    expect(optionsMessageNameInvalid.isDisplayed()).toBe(input.optionsMessageNameInvalidDisplayed, 'optionsMessageNameInvalidDisplayed')
    expect(optionsMessageTextarea.getAttribute('value')).toBe(input.optionsMessageTextareaValue, 'optionsMessageTextareaValue')
    expect(optionsMessageTextareaLabel.getText()).toBe(input.optionsMessageTextareaLabelText, 'optionsMessageTextareaLabelText')
    expect(optionsMessageTextareaEmpty.isDisplayed()).toBe(input.optionsMessageTextareaEmptyDisplayed, 'optionsMessageTextareaEmptyDisplayed')
    expect(optionsMessageJsonInvalidWarning.isDisplayed()).toBe(input.optionsMessageJsonInvalidWarningDisplayed, 'optionsMessageJsonInvalidWarningDisplayed')
    expect(optionsMessageTextareaFormatSlider.getAttribute('class')).toBe(input.optionsMessageTextareaFormatSliderClass, 'optionsMessageTextareaFormatSliderClass')
    expect(optionsMessageNoneSaved.isDisplayed()).toBe(input.optionsMessageNoneSavedDisplayed, 'optionsMessageNoneSavedDisplayed')
    expect(optionsMessageSavedTable.isDisplayed()).toBe(input.optionsMessageSavedTableDislayed, 'optionsMessageSavedTableDislayed')
    expect(optionsMessageStatus.isDisplayed()).toBe(input.optionsMessageStatusDisplayed, 'optionsMessageStatusDisplayed')
    expect(optionsMessageStatus.getText()).toBe(input.optionsMessageStatusText, 'optionsMessageStatusText')
    expect(optionsMessageSaveButton.isEnabled()).toBe(input.optionsMessageSaveButtonEnabled, 'optionsMessageSaveButtonEnabled')
    expect(optionsMessageCancelEditButton.isEnabled()).toBe(input.optionsMessageCancelEditButtonEnabled, 'optionsMessageCancelEditButtonEnabled')
  }

  // Used with checkClient()
  const clientDefaults = {
    urlSelectMenuDisplayed: false,
    urlInputValue: '',
    protocolSelectMenuDisplayed: false,
    protocolInputValue: '',
    connectionStatusText: 'CLOSED',
    connectButtonEnabled: false,
    disconnectButtonDisplayed: false,
    messageSelectMenuDisplayed: false,
    messageTextareaValue: '',
    messageTextareaFormatSliderclass: textareaFormatSliderDisabledClass,
    messageJsonInvalidWarningDisplayed: false,
    messageSendButtonEnabled: false,
    messagesText: '',
    clearMessagesButtonEnabled: false,
    jsonModalDisplayed: false
  }

  // Verify Client section
  const checkClient = function (input) {
    expect(urlSelectMenu.isDisplayed()).toBe(input.urlSelectMenuDisplayed, 'urlSelectMenuDisplayed')
    expect(urlInput.getAttribute('value')).toBe(input.urlInputValue, 'urlInputValue')
    expect(protocolSelectMenu.isDisplayed()).toBe(input.protocolSelectMenuDisplayed, 'protocolSelectMenuDisplayed')
    expect(protocolInput.getAttribute('value')).toBe(input.protocolInputValue, 'protocolInputValue')
    expect(connectionStatus.getText()).toBe(input.connectionStatusText, 'connectionStatusText')
    expect(connectButton.isEnabled()).toBe(input.connectButtonEnabled, 'connectButtonEnabled')
    expect(disconnectButton.isDisplayed()).toBe(input.disconnectButtonDisplayed, 'disconnectButtonDisplayed')
    expect(messageSelectMenu.isDisplayed()).toBe(input.messageSelectMenuDisplayed, 'messageSelectMenuDisplayed')
    expect(messageTextarea.getAttribute('value')).toBe(input.messageTextareaValue, 'messageTextareaValue')
    expect(messageTextareaFormatSlider.getAttribute('class')).toBe(input.messageTextareaFormatSliderclass, 'messageTextareaFormatSliderclass')
    expect(messageJsonInvalidWarning.isDisplayed()).toBe(input.messageJsonInvalidWarningDisplayed, 'messageJsonInvalidWarningDisplayed')
    expect(messageSendButton.isEnabled()).toBe(input.messageSendButtonEnabled, 'messageSendButtonEnabled')
    expect(messages.getText()).toBe(input.messagesText, 'messagesText')
    expect(clearMessagesButton.isEnabled()).toBe(input.clearMessagesButtonEnabled, 'clearMessagesButtonEnabled')
    expect(jsonModal.isDisplayed()).toBe(input.jsonModalDisplayed, 'jsonModalDisplayed')
  }

  beforeEach(function () {
    browser.ignoreSynchronization = true
  })

  it('#options should be visible if "#options" is in URL', function () {
    browser.get(`chrome-extension://${EXTENSION_ID}/index.html#options`)
    browser.wait(EC.visibilityOf(options), WAIT)
    expect(options.isDisplayed()).toBe(true)
  })

  describe('default page status', function () {
    beforeEach(function () {
      browser.get(`chrome-extension://${EXTENSION_ID}/index.html`)
    })
    it('#client should be visible and #options should not be visible', function () {
      expect(client.isDisplayed()).toBe(true)
      expect(options.isDisplayed()).toBe(false)
    })
    it('Options click opens #options and hides #client and vice versa', function () {
      optionsAnchor.click()
      browser.wait(EC.invisibilityOf(client), WAIT)
      expect(client.isDisplayed()).toBe(false)
      expect(options.isDisplayed()).toBe(true)
      clientAnchor.click()
      browser.wait(EC.invisibilityOf(options), WAIT)
      expect(client.isDisplayed()).toBe(true)
      expect(options.isDisplayed()).toBe(false)
    })
  })

  describe('default settings', function () {
    it('options', function () {
      browser.get(`chrome-extension://${EXTENSION_ID}/index.html`)
      optionsAnchor.click()
      browser.wait(EC.visibilityOf(options), WAIT)
      checkOptions(optionsDefaults)
    })

    it('client', function () {
      browser.get(`chrome-extension://${EXTENSION_ID}/index.html`)
      browser.wait(EC.visibilityOf(client), WAIT)
      checkClient(clientDefaults)
    })
  })

  describe('URL options', function () {
    beforeEach(function () {
      browser.get(`chrome-extension://${EXTENSION_ID}/index.html`)
      optionsAnchor.click()
      browser.wait(EC.visibilityOf(optionsUrlInput), WAIT)
    })
    it('entering an invalid URL in #optionsUrlInput should show #optionsUrlInvalidWarning', function () {
      const test = 's://test'
      let input = JSON.parse(JSON.stringify(optionsDefaults))
      optionsUrlInput.clear().sendKeys(test).then(function () {
        input.optionsUrlInputValue = test
        input.optionsUrlInvalidWarningDisplayed = true
        checkOptions(input)
      })
    })
    it('entering and then deleting text in #optionsUrlInput should show #optionsUrlInputEmpty', function () {
      let input = JSON.parse(JSON.stringify(optionsDefaults))
      optionsUrlInput.clear().sendKeys('a', KEY_BACKSPACE).then(function () {
        input.optionsUrlInputEmptyDisplayed = true
        input.optionsUrlInvalidWarningDisplayed = true
        checkOptions(input)
      })
    })
    it('saving a URL adds it to #optionsUrlSavedTable', function () {
      let input = JSON.parse(JSON.stringify(optionsDefaults))
      optionsUrlInput.clear().sendKeys(echoServer).then(function () {
        optionsUrlSaveButton.click()
        input.optionsUrlNoneSavedDisplayed = false
        input.optionsUrlSavedTableDisplayed = true
        input.optionsUrlStatusDisplayed = true
        input.optionsUrlStatusText = 'URL saved.'
        checkOptions(input)
      })
    })

    it('clicking URL edit icon and then cancel button', function () {
      let input = JSON.parse(JSON.stringify(optionsDefaults))
      $('.editUrl').click()
      input.optionsUrlNoneSavedDisplayed = false
      input.optionsUrlSavedTableDisplayed = true
      input.optionsUrlInputLabelText = `Editing URL: ${echoServer}`
      input.optionsUrlInputValue = echoServer
      input.optionsUrlSaveButtonEnabled = true
      checkOptions(input)
      optionsUrlCancelEditButton.click().then(function () {
        input.optionsUrlInputLabelText = optionsUrlInputLabelDefaultText
        input.optionsUrlInputValue = ''
        input.optionsUrlSaveButtonEnabled = false
        checkOptions(input)
      })
    })
    it('clicking URL edit icon and then save button', function () {
      let input = JSON.parse(JSON.stringify(optionsDefaults))
      $('.editUrl').click()
      input.optionsUrlNoneSavedDisplayed = false
      input.optionsUrlSavedTableDisplayed = true
      input.optionsUrlInputLabelText = `Editing URL: ${echoServer}`
      input.optionsUrlInputValue = echoServer
      input.optionsUrlSaveButtonEnabled = true
      checkOptions(input)
      optionsUrlInput.sendKeys('/test').then(function () {
        optionsUrlSaveButton.click().then(function () {
          input.optionsUrlNoneSavedDisplayed = false
          input.optionsUrlSavedTableDisplayed = true
          input.optionsUrlInputLabelText = optionsUrlInputLabelDefaultText
          input.optionsUrlInputValue = ''
          input.optionsUrlSaveButtonEnabled = false
          input.optionsUrlStatusDisplayed = true
          input.optionsUrlStatusText = 'URL saved.'
          checkOptions(input)
          expect($('.bwc-table-row').getText()).toBe(`${echoServer}/test`)
        })
      })
    })
    it('clicking URL delete icon and then cancel button', function () {
      let input = JSON.parse(JSON.stringify(optionsDefaults))
      $('.deleteUrl').click()
      browser.sleep(SLEEP)
      deleteModalCancelButton.click()
      browser.wait(EC.invisibilityOf(deleteModal), WAIT)
      input.optionsUrlNoneSavedDisplayed = false
      input.optionsUrlSavedTableDisplayed = true
      checkOptions(input)
    })
    it('clicking URL delete icon and then delete button', function () {
      const url = `${echoServer}/test`
      let input = JSON.parse(JSON.stringify(optionsDefaults))
      $('.deleteUrl').click()
      browser.wait(EC.elementToBeClickable(deleteModalDeleteButton), WAIT)
      expect(deleteModalBody.getText()).toBe('Are you sure you want to delete the URL shown below?')
      expect(deleteModalName.getText()).toBe(url)
      expect(deleteModalDeleteButton.getText()).toBe('Delete!')
      expect(deleteModalCancelButton.getText()).toBe('Cancel')
      deleteModalDeleteButton.click()
      expect(deleteModalBody.getText()).toBe('URL deleted:')
      expect(deleteModalName.getText()).toBe(url)
      expect(deleteModalDeleteButton.isDisplayed()).toBe(false)
      expect(deleteModalCancelButton.getText()).toBe('Close')
      deleteModalCancelButton.click()
      browser.wait(EC.invisibilityOf(deleteModal), WAIT)
      expect(deleteModal.isDisplayed()).toBe(false)
      checkOptions(input)
    })
    it('add three URLs for client tests', function () {
      let input = JSON.parse(JSON.stringify(optionsDefaults))
      input.optionsUrlNoneSavedDisplayed = false
      input.optionsUrlSavedTableDisplayed = true
      input.optionsUrlStatusDisplayed = true
      input.optionsUrlStatusText = 'URL saved.'
      optionsUrlInput.clear().sendKeys(echoServer).then(function () {
        optionsUrlSaveButton.click()
        optionsUrlInput.clear().sendKeys(`${echoServer}/test1`).then(function () {
          optionsUrlSaveButton.click()
          optionsUrlInput.clear().sendKeys(`${echoServer}/test2`).then(function () {
            optionsUrlSaveButton.click()
            checkOptions(input)
            expect(optionsUrlSavedTable.all(by.className('editUrl')).count()).toBe(3)
          })
        })
      })
    })
  })

  describe('protocol options', function () {
    beforeEach(function () {
      browser.get(`chrome-extension://${EXTENSION_ID}/index.html`)
      optionsAnchor.click()
      browser.wait(EC.visibilityOf(optionsProtocolInput), WAIT)
    })
    it('entering and then deleting text in #optionsProtocolInput should show #optionsProtocolIEmpty', function () {
      let input = JSON.parse(JSON.stringify(optionsDefaults))
      input.optionsUrlNoneSavedDisplayed = false
      input.optionsUrlSavedTableDisplayed = true
      optionsProtocolInput.clear().sendKeys('a', KEY_BACKSPACE).then(function () {
        input.optionsProtocolInputEmptyDisplayed = true
        checkOptions(input)
      })
    })
    it('saving a protocol adds it to #optionsProtocolSavedTable', function () {
      let input = JSON.parse(JSON.stringify(optionsDefaults))
      input.optionsUrlNoneSavedDisplayed = false
      input.optionsUrlSavedTableDisplayed = true
      optionsProtocolInput.clear().sendKeys('protocol1').then(function () {
        optionsProtocolSaveButton.click()
        input.optionsProtocolNoneSavedDisplayed = false
        input.optionsProtocolSavedTableDisplayed = true
        input.optionsProtocolStatusDisplayed = true
        input.optionsProtocolStatusText = 'Protocol saved.'
        checkOptions(input)
      })
    })

    it('clicking protocol edit icon and then cancel button', function () {
      let input = JSON.parse(JSON.stringify(optionsDefaults))
      input.optionsUrlNoneSavedDisplayed = false
      input.optionsUrlSavedTableDisplayed = true
      input.optionsProtocolNoneSavedDisplayed = false
      input.optionsProtocolSavedTableDisplayed = true
      $('.editProtocol').click()
      input.optionsProtocolInputLabelText = 'Editing protocol: protocol1'
      input.optionsProtocolInputValue = 'protocol1'
      input.optionsProtocolSaveButtonEnabled = true
      checkOptions(input)
      optionsProtocolCancelEditButton.click().then(function () {
        input.optionsProtocolInputValue = ''
        input.optionsProtocolInputLabelText = optionsProtocolInputLabelDefaultText
        input.optionsProtocolStatusDisplayed = false
        input.optionsProtocolSaveButtonEnabled = false
        checkOptions(input)
      })
    })
    it('clicking protocol edit icon and then save button', function () {
      let input = JSON.parse(JSON.stringify(optionsDefaults))
      input.optionsUrlNoneSavedDisplayed = false
      input.optionsUrlSavedTableDisplayed = true
      input.optionsProtocolNoneSavedDisplayed = false
      input.optionsProtocolSavedTableDisplayed = true
      $('.editProtocol').click()
      input.optionsProtocolInputLabelText = 'Editing protocol: protocol1'
      input.optionsProtocolInputValue = 'protocol1'
      input.optionsProtocolSaveButtonEnabled = true
      checkOptions(input)
      optionsProtocolInput.sendKeys(', protocol2').then(function () {
        optionsProtocolSaveButton.click().then(function () {
          input.optionsProtocolInputValue = ''
          input.optionsProtocolInputLabelText = optionsProtocolInputLabelDefaultText
          input.optionsProtocolStatusDisplayed = true
          input.optionsProtocolStatusText = 'Protocol saved.'
          input.optionsProtocolSaveButtonEnabled = false
          checkOptions(input)
          expect(element.all(by.css('[class="bwc-table-row rounded"]')).get(3).getText()).toBe('protocol1, protocol2')
        })
      })
    })
    it('clicking protocol delete icon and then cancel button', function () {
      let input = JSON.parse(JSON.stringify(optionsDefaults))
      input.optionsUrlNoneSavedDisplayed = false
      input.optionsUrlSavedTableDisplayed = true
      input.optionsProtocolNoneSavedDisplayed = false
      input.optionsProtocolSavedTableDisplayed = true
      $('.deleteProtocol').click()
      browser.sleep(SLEEP)
      deleteModalCancelButton.click()
      browser.wait(EC.invisibilityOf(deleteModal), WAIT)
      checkOptions(input)
      expect(deleteModal.isDisplayed()).toBe(false)
    })
    it('clicking protocol delete icon and then delete button', function () {
      let input = JSON.parse(JSON.stringify(optionsDefaults))
      input.optionsUrlNoneSavedDisplayed = false
      input.optionsUrlSavedTableDisplayed = true
      input.optionsProtocolNoneSavedDisplayed = true
      input.optionsProtocolSavedTableDisplayed = false
      $('.deleteProtocol').click()
      browser.sleep(SLEEP)
      expect(deleteModalBody.getText()).toBe('Are you sure you want to delete the protocol shown below?')
      expect(deleteModalName.getText()).toBe('protocol1, protocol2')
      expect(deleteModalDeleteButton.getText()).toBe('Delete!')
      expect(deleteModalCancelButton.getText()).toBe('Cancel')
      deleteModalDeleteButton.click()
      expect(deleteModalBody.getText()).toBe('Protocol deleted:')
      expect(deleteModalName.getText()).toBe('protocol1, protocol2')
      expect(deleteModalDeleteButton.isDisplayed()).toBe(false)
      expect(deleteModalCancelButton.getText()).toBe('Close')
      deleteModalCancelButton.click()
      browser.wait(EC.invisibilityOf(deleteModal), WAIT).then(function () {
        checkOptions(input)
        expect(deleteModal.isDisplayed()).toBe(false)
      })
    })
    it('add three protocols for client tests', function () {
      let input = JSON.parse(JSON.stringify(optionsDefaults))
      input.optionsUrlNoneSavedDisplayed = false
      input.optionsUrlSavedTableDisplayed = true
      input.optionsProtocolNoneSavedDisplayed = false
      input.optionsProtocolSavedTableDisplayed = true
      input.optionsProtocolStatusDisplayed = true
      input.optionsProtocolStatusText = 'Protocol saved.'
      optionsProtocolInput.clear().sendKeys('protocol1').then(function () {
        optionsProtocolSaveButton.click()
        optionsProtocolInput.clear().sendKeys('protocol2').then(function () {
          optionsProtocolSaveButton.click()
          optionsProtocolInput.clear().sendKeys('protocol3').then(function () {
            optionsProtocolSaveButton.click()
            checkOptions(input)
            expect(optionsProtocolSavedTable.all(by.className('editProtocol')).count()).toBe(3)
          })
        })
      })
    })
  })

  describe('message options', function () {
    beforeEach(function () {
      browser.get(`chrome-extension://${EXTENSION_ID}/index.html`)
      optionsAnchor.click()
      browser.wait(EC.visibilityOf(optionsUrlInput), WAIT)
      browser.executeScript('arguments[0].scrollIntoView();', optionsMessageSaveButton)
    })
    it('entering and then deleting text in #optionsMessageNameInput should show #optionsMessageNameInvalid', function () {
      let input = JSON.parse(JSON.stringify(optionsDefaults))
      input.optionsUrlNoneSavedDisplayed = false
      input.optionsUrlSavedTableDisplayed = true
      input.optionsProtocolNoneSavedDisplayed = false
      input.optionsProtocolSavedTableDisplayed = true
      optionsMessageNameInput.clear().sendKeys('a', KEY_BACKSPACE).then(function () {
        input.optionsMessageNameInvalidDisplayed = true
        checkOptions(input)
      })
    })
    it('entering a message with invalid JSON in #optionsMessageTextarea should show #optionsMessageJsonInvalidWarning', function () {
      let input = JSON.parse(JSON.stringify(optionsDefaults))
      input.optionsUrlNoneSavedDisplayed = false
      input.optionsUrlSavedTableDisplayed = true
      input.optionsProtocolNoneSavedDisplayed = false
      input.optionsProtocolSavedTableDisplayed = true
      optionsMessageTextarea.clear().sendKeys(messageInvalid).then(function () {
        input.optionsMessageTextareaValue = '"missingLeadingBracket": true}'
        input.optionsMessageJsonInvalidWarningDisplayed = true
        checkOptions(input)
      })
    })
    it('entering and then deleting text in #optionsMessageTextarea should show #optionsMessageTextareaEmpty', function () {
      let input = JSON.parse(JSON.stringify(optionsDefaults))
      input.optionsUrlNoneSavedDisplayed = false
      input.optionsUrlSavedTableDisplayed = true
      input.optionsProtocolNoneSavedDisplayed = false
      input.optionsProtocolSavedTableDisplayed = true
      optionsMessageTextarea.clear().sendKeys('a', KEY_BACKSPACE).then(function () {
        input.optionsMessageTextareaEmptyDisplayed = true
        checkOptions(input)
      })
    })
    it('saving a message adds it to #optionsMessageSavedTable', function () {
      let input = JSON.parse(JSON.stringify(optionsDefaults))
      input.optionsUrlNoneSavedDisplayed = false
      input.optionsUrlSavedTableDisplayed = true
      input.optionsProtocolNoneSavedDisplayed = false
      input.optionsProtocolSavedTableDisplayed = true
      optionsMessageNameInput.clear().sendKeys('Echo One').then(function () {
        optionsMessageTextarea.clear().sendKeys(message1).then(function () {
          optionsMessageSaveButton.click()
          input.optionsMessageNoneSavedDisplayed = false
          input.optionsMessageSavedTableDislayed = true
          input.optionsMessageStatusDisplayed = true
          input.optionsMessageTextareaFormatSliderClass = textareaFormatSliderDisabledClass
          input.optionsMessageStatusText = 'Message saved.'
          checkOptions(input)
        })
      })
    })
    it('clicking printer icon should show JSON modal', function () {
      const printMessage = element(by.css('.printMessage'))
      let input = JSON.parse(JSON.stringify(optionsDefaults))
      input.optionsUrlNoneSavedDisplayed = false
      input.optionsUrlSavedTableDisplayed = true
      input.optionsProtocolNoneSavedDisplayed = false
      input.optionsProtocolSavedTableDisplayed = true
      input.optionsMessageNoneSavedDisplayed = false
      input.optionsMessageSavedTableDislayed = true
      browser.sleep(SLEEP)
      printMessage.click()
      browser.wait(EC.visibilityOf(jsonModal), WAIT)
      expect(jsonModalTitle.getText()).toBe('Echo One')
      expect(jsonModalBody.all(by.className('bwc-key')).count()).toBe(5)
      expect(jsonModalBody.all(by.className('bwc-null')).count()).toBe(1)
      expect(jsonModalBody.all(by.className('bwc-number')).count()).toBe(1)
      expect(jsonModalBody.all(by.className('bwc-string')).count()).toBe(1)
      expect(jsonModalBody.all(by.className('bwc-boolean')).count()).toBe(1)
      browser.wait(EC.elementToBeClickable(jsonModalCloseButton), WAIT)
      jsonModalCloseButton.click()
      browser.sleep(SLEEP)
      checkOptions(input)
    })
    it('clicking edit icon and then cancel button', function () {
      const editMessage = element(by.css('.editMessage'))
      let input = JSON.parse(JSON.stringify(optionsDefaults))
      input.optionsUrlNoneSavedDisplayed = false
      input.optionsUrlSavedTableDisplayed = true
      input.optionsProtocolNoneSavedDisplayed = false
      input.optionsProtocolSavedTableDisplayed = true
      input.optionsMessageNoneSavedDisplayed = false
      input.optionsMessageSavedTableDislayed = true
      browser.sleep(SLEEP)
      browser.wait(EC.visibilityOf(editMessage), WAIT)
      editMessage.click().then(function () {
        input.optionsMessageNameInputLabelText = 'Editing message: Echo One'
        input.optionsMessageNameInputValue = 'Echo One'
        input.optionsMessageTextareaValue = message1
        input.optionsMessageTextareaFormatSliderClass = textareaFormatSliderEnabledClass
        input.optionsMessageSaveButtonEnabled = true
        checkOptions(input)
        optionsMessageCancelEditButton.click().then(function () {
          input.optionsMessageNameInputLabelText = optionsMessageNameInputLabelDefaultText
          input.optionsMessageNameInputValue = ''
          input.optionsMessageTextareaValue = ''
          input.optionsMessageTextareaFormatSliderClass = textareaFormatSliderDisabledClass
          input.optionsMessageSaveButtonEnabled = false
          checkOptions(input)
        })
      })
    })
    it('clicking edit icon and then save button', function () {
      let input = JSON.parse(JSON.stringify(optionsDefaults))
      input.optionsUrlNoneSavedDisplayed = false
      input.optionsUrlSavedTableDisplayed = true
      input.optionsProtocolNoneSavedDisplayed = false
      input.optionsProtocolSavedTableDisplayed = true
      input.optionsMessageNoneSavedDisplayed = false
      input.optionsMessageSavedTableDislayed = true
      browser.sleep(SLEEP)
      $('.editMessage').click()
      optionsMessageNameInput.sendKeys(' Test').then(function () {
        optionsMessageSaveButton.click().then(function () {
          input.optionsMessageStatusDisplayed = true
          input.optionsMessageStatusText = 'Message saved.'
          checkOptions(input)
          expect(optionsMessageSavedTable.all(by.className('bwc-table-row')).get(0).getText()).toBe('Echo One Test')
        })
      })
    })
    it('clicking delete icon and then cancel button', function () {
      let input = JSON.parse(JSON.stringify(optionsDefaults))
      input.optionsUrlNoneSavedDisplayed = false
      input.optionsUrlSavedTableDisplayed = true
      input.optionsProtocolNoneSavedDisplayed = false
      input.optionsProtocolSavedTableDisplayed = true
      input.optionsMessageNoneSavedDisplayed = false
      input.optionsMessageSavedTableDislayed = true
      browser.sleep(SLEEP)
      $('.deleteMessage').click()
      browser.sleep(SLEEP)
      deleteModalCancelButton.click()
      browser.sleep(SLEEP)
      checkOptions(input)
      expect(deleteModal.isDisplayed()).toBe(false)
    })
    it('clicking delete icon and then delete button', function () {
      let input = JSON.parse(JSON.stringify(optionsDefaults))
      input.optionsUrlNoneSavedDisplayed = false
      input.optionsUrlSavedTableDisplayed = true
      input.optionsProtocolNoneSavedDisplayed = false
      input.optionsProtocolSavedTableDisplayed = true
      input.optionsMessageNoneSavedDisplayed = true
      input.optionsMessageSavedTableDislayed = false
      browser.sleep(SLEEP)
      $('.deleteMessage').click()
      browser.wait(EC.elementToBeClickable(deleteModalDeleteButton), WAIT)
      expect(deleteModalBody.getText()).toBe('Are you sure you want to delete the message shown below?')
      expect(deleteModalName.getText()).toBe('Echo One Test')
      expect(deleteModalDeleteButton.getText()).toBe('Delete!')
      expect(deleteModalCancelButton.getText()).toBe('Cancel')
      deleteModalDeleteButton.click()
      expect(deleteModalBody.getText()).toBe('Message deleted:')
      expect(deleteModalName.getText()).toBe('Echo One Test')
      expect(deleteModalDeleteButton.isDisplayed()).toBe(false)
      expect(deleteModalCancelButton.getText()).toBe('Close')
      browser.wait(EC.elementToBeClickable(deleteModalCancelButton), WAIT)
      deleteModalCancelButton.click()
      browser.sleep(SLEEP)
      checkOptions(input)
      expect(deleteModal.isDisplayed()).toBe(false)
    })
    it('toggling JSON formatting', function () {
      let input = JSON.parse(JSON.stringify(optionsDefaults))
      input.optionsUrlNoneSavedDisplayed = false
      input.optionsUrlSavedTableDisplayed = true
      input.optionsProtocolNoneSavedDisplayed = false
      input.optionsProtocolSavedTableDisplayed = true
      input.optionsMessageNoneSavedDisplayed = true
      input.optionsMessageSavedTableDislayed = false
      optionsMessageNameInput.clear().sendKeys('One').then(function () {
        optionsMessageTextarea.clear().sendKeys(message1).then(function () {
          input.optionsMessageTextareaFormatSliderClass = textareaFormatSliderEnabledClass
          input.optionsMessageNameInputValue = 'One'
          input.optionsMessageTextareaValue = message1
          input.optionsMessageSaveButtonEnabled = true
          checkOptions(input)
          optionsMessageTextarea.getAttribute('value').then(function (value) {
            expect(value.split(/\r*\n/).length).toBe(1)
          })
          optionsMessageTextareaFormatSlider.click()
          browser.sleep(SLEEP)
          optionsMessageTextarea.getAttribute('value').then(function (value) {
            expect(value.split(/\r*\n/).length).toBeGreaterThan(1)
          })
          optionsMessageTextareaFormatSlider.click()
          browser.sleep(SLEEP)
          checkOptions(input)
          optionsMessageTextarea.getAttribute('value').then(function (value) {
            expect(value.split(/\r*\n/).length).toBe(1)
          })
        })
      })
    })
    it('add three messages for client tests', function () {
      let input = JSON.parse(JSON.stringify(optionsDefaults))
      input.optionsUrlNoneSavedDisplayed = false
      input.optionsUrlSavedTableDisplayed = true
      input.optionsProtocolNoneSavedDisplayed = false
      input.optionsProtocolSavedTableDisplayed = true
      input.optionsMessageNoneSavedDisplayed = false
      input.optionsMessageSavedTableDislayed = true
      input.optionsMessageStatusDisplayed = true
      input.optionsMessageStatusText = 'Message saved.'
      optionsMessageNameInput.clear().sendKeys('One').then(function () {
        optionsMessageTextarea.clear().sendKeys(message1).then(function () {
          optionsMessageSaveButton.click()
          optionsMessageNameInput.clear().sendKeys('Two').then(function () {
            optionsMessageTextarea.clear().sendKeys(message2).then(function () {
              optionsMessageSaveButton.click()
              optionsMessageNameInput.clear().sendKeys('Three').then(function () {
                optionsMessageTextarea.clear().sendKeys(message3).then(function () {
                  optionsMessageSaveButton.click()
                  checkOptions(input)
                  expect(optionsMessageSavedTable.all(by.className('editMessage')).count()).toBe(3)
                })
              })
            })
          })
        })
      })
    })
  })

  describe('client input tests', function () {
    beforeEach(function () {
      browser.get(`chrome-extension://${EXTENSION_ID}/index.html`)
    })
    it('verify defaults', function () {
      let input = JSON.parse(JSON.stringify(clientDefaults))
      input.urlSelectMenuDisplayed = true
      input.protocolSelectMenuDisplayed = true
      input.messageSelectMenuDisplayed = true
      checkClient(input)
      urlSelectMenu.click()
      expect(element.all(by.css('[class="dropdown-item url"]')).get(0).getText()).toBe('ws://demos.kaazing.com/echo')
      protocolSelectMenu.click()
      expect(element.all(by.css('[class="dropdown-item protocol"]')).get(0).getText()).toBe('protocol1')
      messageSelectMenu.click()
      expect(element.all(by.css('[class="dropdown-item message"]')).get(0).getText()).toBe('One')
    })
    it('choosing saved URL should set #urlInput', function () {
      let input = JSON.parse(JSON.stringify(clientDefaults))
      input.urlSelectMenuDisplayed = true
      input.protocolSelectMenuDisplayed = true
      input.messageSelectMenuDisplayed = true
      urlSelectMenu.click()
      element(by.buttonText('ws://demos.kaazing.com/echo/test1')).click()
      input.urlInputValue = 'ws://demos.kaazing.com/echo/test1'
      input.connectButtonEnabled = true
      checkClient(input)
    })
    it('choosing saved protocol should set #protocolInput', function () {
      let input = JSON.parse(JSON.stringify(clientDefaults))
      input.urlSelectMenuDisplayed = true
      input.protocolSelectMenuDisplayed = true
      input.messageSelectMenuDisplayed = true
      protocolSelectMenu.click()
      element(by.buttonText('protocol2')).click()
      input.protocolInputValue = 'protocol2'
      checkClient(input)
    })
    it('choosing saved message should set #messageTextarea', function () {
      let input = JSON.parse(JSON.stringify(clientDefaults))
      input.urlSelectMenuDisplayed = true
      input.protocolSelectMenuDisplayed = true
      input.messageSelectMenuDisplayed = true
      messageSelectMenu.click()
      element(by.buttonText('Three')).click()
      input.messageTextareaValue = message3
      input.messageTextareaFormatSliderclass = textareaFormatSliderEnabledClass
      checkClient(input)
    })
    it('entering invalid JSON in #messageTextarea should show #messageJsonInvalidWarning', function () {
      let input = JSON.parse(JSON.stringify(clientDefaults))
      input.urlSelectMenuDisplayed = true
      input.protocolSelectMenuDisplayed = true
      input.messageSelectMenuDisplayed = true
      messageTextarea.clear().sendKeys(messageInvalid).then(function () {
        input.messageJsonInvalidWarningDisplayed = true
        input.messageTextareaValue = messageInvalid
        checkClient(input)
        messageTextarea.clear().sendKeys(message1).then(function () {
          input.messageJsonInvalidWarningDisplayed = false
          input.messageTextareaValue = message1
          input.messageTextareaFormatSliderclass = textareaFormatSliderEnabledClass
          checkClient(input)
        })
      })
    })
    it('toggling JSON formatting', function () {
      let input = JSON.parse(JSON.stringify(clientDefaults))
      input.urlSelectMenuDisplayed = true
      input.protocolSelectMenuDisplayed = true
      input.messageSelectMenuDisplayed = true
      messageTextarea.clear().sendKeys(message1).then(function () {
        input.messageTextareaValue = message1
        input.messageTextareaFormatSliderclass = textareaFormatSliderEnabledClass
        checkClient(input)
        messageTextarea.getAttribute('value').then(function (value) {
          expect(value.split(/\r*\n/).length).toBe(1)
        })
        messageTextareaFormatSlider.click()
        browser.sleep(SLEEP)
        messageTextarea.getAttribute('value').then(function (value) {
          expect(value.split(/\r*\n/).length).toBeGreaterThan(1)
        })
        messageTextareaFormatSlider.click()
        browser.sleep(SLEEP)
        checkClient(input)
        messageTextarea.getAttribute('value').then(function (value) {
          expect(value.split(/\r*\n/).length).toBe(1)
        })
      })
    })
  })

  describe('client connection tests', function () {
    beforeEach(function () {
      browser.get(`chrome-extension://${EXTENSION_ID}/index.html`)
    })
    it('connect to echoServer and then disconnect', function () {
      let input = JSON.parse(JSON.stringify(clientDefaults))
      input.urlSelectMenuDisplayed = true
      input.protocolSelectMenuDisplayed = true
      input.messageSelectMenuDisplayed = true
      urlInput.clear().sendKeys(echoServer).then(function () {
        connectButton.click()
        browser.wait(EC.textToBePresentInElement(connectionStatus, 'OPENED'), WAIT)
        input.urlInputValue = echoServer
        input.connectionStatusText = 'OPENED'
        input.connectButtonDisplayed = false
        input.disconnectButtonDisplayed = true
        checkClient(input)
        disconnectButton.click()
        browser.wait(EC.textToBePresentInElement(connectionStatus, 'CLOSED'), WAIT)
        input.connectionStatusText = 'CLOSED'
        input.connectButtonDisplayed = true
        input.connectButtonEnabled = true
        input.disconnectButtonDisplayed = false
        checkClient(input)
      })
    })
    it('send message using send button and open with JSON modal', function () {
      const receivedMessage = $('.bwc-received')
      let input = JSON.parse(JSON.stringify(clientDefaults))
      input.urlSelectMenuDisplayed = true
      input.protocolSelectMenuDisplayed = true
      input.messageSelectMenuDisplayed = true
      urlInput.clear().sendKeys(echoServer).then(function () {
        connectButton.click()
        browser.wait(EC.textToBePresentInElement(connectionStatus, 'OPENED'), WAIT)
        messageTextarea.clear().sendKeys(message1).then(function () {
          input.urlInputValue = echoServer
          input.connectionStatusText = 'OPENED'
          input.connectButtonDisplayed = false
          input.connectButtonEnabled = false
          input.disconnectButtonDisplayed = true
          input.messageTextareaValue = message1
          input.messageTextareaFormatSliderclass = textareaFormatSliderEnabledClass
          input.messageSendButtonEnabled = true
          messageSendButton.click()
          browser.wait(EC.textToBePresentInElement(receivedMessage, message1), WAIT)
          input.clearMessagesButtonEnabled = true
          input.messagesText = `${message1}\n${message1}`
          checkClient(input)
          expect($('.bwc-sent').getText()).toBe(message1)
          receivedMessage.click()
          browser.wait(EC.visibilityOf(jsonModal), WAIT)
          expect(jsonModal.isDisplayed()).toBe(true)
          expect(jsonModalTitle.getText()).toBe('Incoming Message')
          expect(jsonModalBody.getText()).toContain('Message 1')
        })
      })
    })
    it('send two messages with Ctrl + Enter, open and close each with JSON modal, clear messages', function () {
      const ctrlEnter = protractor.Key.chord(KEY_CTRL, KEY_ENTER)
      const receivedMessages = element.all(by.css('.bwc-received'))
      urlInput.clear().sendKeys(echoServer).then(function () {
        connectButton.click()
        browser.wait(EC.textToBePresentInElement(connectionStatus, 'OPENED'), WAIT)
        messageTextarea.clear().sendKeys(message1, ctrlEnter).then(function () {
          browser.wait(EC.textToBePresentInElement(receivedMessages.get(0), message1), WAIT)
          messageTextarea.clear().sendKeys(message2, ctrlEnter).then(function () {
            browser.wait(EC.textToBePresentInElement(receivedMessages.get(1), message2), WAIT)
            receivedMessages.get(0).click()
            browser.sleep(SLEEP)
            expect(jsonModal.isDisplayed()).toBe(true)
            expect(jsonModalTitle.getText()).toBe('Incoming Message')
            expect(jsonModalBody.getText()).toContain('Message 1')
            jsonModalCloseButton.click()
            browser.sleep(SLEEP)
            expect(jsonModal.isDisplayed()).toBe(false)
            receivedMessages.get(1).click()
            browser.sleep(SLEEP)
            expect(jsonModal.isDisplayed()).toBe(true)
            expect(jsonModalTitle.getText()).toBe('Incoming Message')
            expect(jsonModalBody.getText()).toContain('Message 2')
            jsonModalCloseButton.click()
            browser.sleep(SLEEP)
            expect(jsonModal.isDisplayed()).toBe(false)
            clearMessagesButton.click()
            expect(messages.getText()).toBe('')
          })
        })
      })
    })
  })
})
