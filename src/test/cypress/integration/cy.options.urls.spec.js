describe('Options -> URLs', function () {
  const urlInvalid = 's://test'
  const echoServer = 'ws://demos.kaazing.com/echo'
  const urlNameNew = `${echoServer}/test`

  beforeEach(function () {
    cy.mockChromeStorageAndVisit('/#options')
    cy.get('#optionsUrlsAnchor').click()
    cy.get('#optionsUrls').should('be.visible')
    cy.wait(400)
  })

  it('entering an invalid URL in #optionsUrlInput should show #optionsUrlInvalidWarning', function () {
    cy.get('#optionsUrlInput')
      .clear()
      .type(urlInvalid)
    cy.fixture('optionsDefaults').then((input) => {
      input.optionsUrlInputValue = urlInvalid
      input.optionsUrlInvalidWarningVisible = ''
      cy.checkOptionsUrls(input)
    })
  })

  it('entering and then deleting text in #optionsUrlInput should show #optionsUrlInputEmpty', function () {
    cy.get('#optionsUrlInput')
      .clear()
      .type('a{backspace}')
    cy.fixture('optionsDefaults').then((input) => {
      input.optionsUrlInputEmptyVisible = ''
      input.optionsUrlInvalidWarningVisible = ''
      cy.checkOptionsUrls(input)
    })
  })

  it('saving and working with a URL', function () {
    // save a protocol
    cy.log('save a protocol')
    cy.get('#optionsUrlInput').clear().type(echoServer)
    cy.get('#optionsUrlSaveButton').click()
    cy.fixture('optionsDefaults').then((input) => {
      input.optionsUrlNoneSavedVisible = 'not.'
      input.optionsUrlSavedTableVisible = ''
      input.optionsUrlStatusVisible = ''
      input.optionsUrlStatusText = 'URL saved.'
      cy.checkOptionsUrls(input)
    })

    // click URL edit icon and then cancel button
    cy.log('click URL edit icon and then cancel button')
    cy.get('.editUrl').click({ force: true })
    cy.fixture('optionsDefaults').then((input) => {
      input.optionsUrlNoneSavedVisible = 'not.'
      input.optionsUrlSavedTableVisible = ''
      input.optionsUrlInputLabelText = `Editing URL: ${echoServer}`
      input.optionsUrlInputValue = echoServer
      input.optionsUrlSaveButtonDisabled = 'not.'
      cy.checkOptionsUrls(input)
    })
    cy.get('#optionsUrlCancelEditButton').click()
    cy.fixture('optionsDefaults').then((input) => {
      input.optionsUrlNoneSavedVisible = 'not.'
      input.optionsUrlSavedTableVisible = ''
      input.optionsUrlInputValue = ''
      input.optionsUrlSaveButtonDisabled = ''
      cy.checkOptionsUrls(input)
    })

    // click URL edit icon and then save button
    cy.log('click URL edit icon and then save button')
    cy.get('.editUrl').click({ force: true })
    cy.get('#optionsUrlInput').type('/test')
    cy.get('#optionsUrlSaveButton').click()
    cy.fixture('optionsDefaults').then((input) => {
      input.optionsUrlInputValue = ''
      input.optionsUrlNoneSavedVisible = 'not.'
      input.optionsUrlSaveButtonDisabled = ''
      input.optionsUrlSavedTableVisible = ''
      input.optionsUrlStatusText = 'URL saved.'
      input.optionsUrlStatusVisible = ''
      cy.checkOptionsUrls(input)
    })
    cy.get('.bwc-table-row').invoke('text').should('be', urlNameNew)

    // use saved URL in client
    cy.log('use saved URL in client')
    cy.get('#clientAnchor').click()
    cy.get('#client').should('be.visible')
    cy.get('#urlSelectMenu').click()
    cy.get('.dropdown-item.url').invoke('text').should('be', urlNameNew)
    cy.get('.dropdown-item.url').click()
    cy.fixture('clientDefaults').then((input) => {
      input.urlSelectMenuVisible = ''
      input.urlInputValue = urlNameNew
      input.connectButtonDisabled = 'not.'
      cy.checkClient(input)
    })

    // click URL delete icon and then cancel button
    cy.log('click URL delete icon and then cancel button')
    cy.get('#optionsAnchor').click()
    cy.get('#options').should('be.visible')
    cy.get('#optionsUrls').should('be.visible')
    cy.get('.deleteUrl').click({ force: true })
    cy.get('#deleteModal').should('be.visible')
    cy.wait(400)
    cy.get('#deleteModalCancelButton').click()
    cy.get('#deleteModal').should('not.be.visible')
    cy.fixture('optionsDefaults').then((input) => {
      input.optionsUrlNoneSavedVisible = 'not.'
      input.optionsUrlSavedTableVisible = ''
      cy.checkOptionsUrls(input)
    })

    // click URL delete icon and then delete button
    cy.wait(400)
    cy.log('click URL delete icon and then delete button')
    cy.get('.deleteUrl').click({ force: true })
    cy.get('#deleteModal').should('be.visible')
    cy.get('#deleteModalBody').invoke('text').should('be', 'Are you sure you want to delete the URL shown below?')
    cy.get('#deleteModalName').invoke('text').should('be', urlNameNew)
    cy.get('#deleteModalDeleteButton').invoke('text').should('be', 'Delete!')
    cy.get('#deleteModalCancelButton').invoke('text').should('be', 'Cancel')
    cy.get('#deleteModalDeleteButton').click()
    cy.get('#deleteModalBody').invoke('text').should('be', 'Protocol deleted:')
    cy.get('#deleteModalName').invoke('text').should('be', urlNameNew)
    cy.get('#deleteModalDeleteButton').should('not.be.visible')
    cy.get('#deleteModalCancelButton').invoke('text').should('be', 'Close')
    cy.get('#deleteModalCancelButton').click()
    cy.get('#deleteModal').should('not.be.visible')
    cy.fixture('optionsDefaults').then((input) => {
      cy.checkOptionsUrls(input)
    })
  })
})

