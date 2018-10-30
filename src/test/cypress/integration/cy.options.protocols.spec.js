describe('Options -> Protocols', function () {
  const protocolNameNew = 'protocol1, protocol2'

  beforeEach(function () {
    cy.mockChromeStorageAndVisit('/#options')
    cy.get('#optionsProtocolsAnchor').click()
    cy.get('#optionsProtocols').should('be.visible')
  })

  it('entering and then deleting text in #optionsProtocolInput should show #optionsProtocolIEmpty', function () {
    cy.get('#optionsProtocolInput')
      .clear()
      .type('a{backspace}')
    cy.fixture('optionsDefaults').then((input) => {
      input.optionsProtocolInputEmptyVisible = ''
      cy.checkOptionsProtocols(input)
    })
  })

  it('saving and working with a protocol', function () {
    // saving a protocol
    cy.log('saving a protocol')
    cy.get('#optionsProtocolInput')
      .clear()
      .type('protocol1')
    cy.get('#optionsProtocolSaveButton').click()
    cy.fixture('optionsDefaults').then((input) => {
      input.optionsProtocolNoneSavedVisible = 'not.'
      input.optionsProtocolSavedTableVisible = ''
      input.optionsProtocolStatusText = 'Protocol saved.'
      input.optionsProtocolStatusVisible = ''
      cy.checkOptionsProtocols(input)
    })

    // click protocol edit icon and then cancel button
    cy.log('click protocol edit icon and then cancel button')
    cy.get('.editProtocol').click()
    cy.fixture('optionsDefaults').then((input) => {
      input.optionsProtocolInputLabelText = 'Editing protocol: protocol1'
      input.optionsProtocolInputValue = 'protocol1'
      input.optionsProtocolNoneSavedVisible = 'not.'
      input.optionsProtocolSaveButtonDisabled = 'not.'
      input.optionsProtocolSavedTableVisible = ''
      cy.checkOptionsProtocols(input)
    })
    cy.get('#optionsProtocolCancelEditButton').click()
    cy.fixture('optionsDefaults').then((input) => {
      input.optionsProtocolInputValue = ''
      input.optionsProtocolNoneSavedVisible = 'not.'
      input.optionsProtocolSaveButtonDisabled = ''
      input.optionsProtocolSavedTableVisible = ''
      input.optionsProtocolStatusVisible = 'not.'
      cy.checkOptionsProtocols(input)
    })

    // click protocol edit icon and then save button
    cy.log('click protocol edit icon and then save button')
    cy.get('.editProtocol').click()
    cy.get('#optionsProtocolInput').type(', protocol2')
    cy.get('#optionsProtocolSaveButton').click()
    cy.fixture('optionsDefaults').then((input) => {
      input.optionsProtocolInputValue = ''
      input.optionsProtocolNoneSavedVisible = 'not.'
      input.optionsProtocolSaveButtonDisabled = ''
      input.optionsProtocolSavedTableVisible = ''
      input.optionsProtocolStatusText = 'Protocol saved.'
      input.optionsProtocolStatusVisible = ''
      cy.checkOptionsProtocols(input)
    })
    cy.get('#optionsProtocolSavedTable').find('.bwc-table-row').should('be', protocolNameNew)

    // use saved protocol in client
    cy.log('use saved protocol in client')
    cy.get('#clientAnchor').click()
    cy.get('#client').should('be.visible')
    cy.get('#protocolSelectMenu').click()
    cy.get('.dropdown-item.protocol').invoke('text').should('be', protocolNameNew)
    cy.get('.dropdown-item.protocol').click()
    cy.fixture('clientDefaults').then((input) => {
      input.protocolSelectMenuVisible = ''
      input.protocolInputValue = protocolNameNew
      cy.checkClient(input)
    })

    // click protocol delete icon and then cancel button
    cy.log('click protocol delete icon and then cancel button')
    cy.get('#optionsAnchor').click()
    cy.get('#options').should('be.visible')
    cy.get('#optionsProtocols').should('be.visible')
    cy.get('.deleteProtocol').click()
    cy.get('#deleteModal').should('be.visible')
    cy.get('#deleteModalCancelButton').click()
    cy.get('#deleteModalCancelButton').click()
    cy.get('#deleteModal').should('not.be.visible')
    cy.fixture('optionsDefaults').then((input) => {
      input.optionsProtocolNoneSavedVisible = 'not.'
      input.optionsProtocolSavedTableVisible = ''
      cy.checkOptionsProtocols(input)
    })

    // click protocol delete icon and then delete button
    cy.log('click protocol delete icon and then delete button')
    cy.get('.deleteProtocol').click()
    cy.get('#deleteModal').should('be.visible')
    cy.get('#deleteModalBody').invoke('text').should('be', 'Are you sure you want to delete the protocol shown below?')
    cy.get('#deleteModalName').invoke('text').should('be', protocolNameNew)
    cy.get('#deleteModalDeleteButton').invoke('text').should('be', 'Delete!')
    cy.get('#deleteModalCancelButton').invoke('text').should('be', 'Cancel')
    cy.get('#deleteModalDeleteButton').click()
    cy.get('#deleteModalBody').invoke('text').should('be', 'Protocol deleted:')
    cy.get('#deleteModalName').invoke('text').should('be', protocolNameNew)
    cy.get('#deleteModalDeleteButton').should('not.be.visible')
    cy.get('#deleteModalCancelButton').invoke('text').should('be', 'Close')
    cy.get('#deleteModalCancelButton').click()
    cy.get('#deleteModal').should('not.be.visible')
    cy.fixture('optionsDefaults').then((input) => {
      cy.checkOptionsProtocols(input)
    })
  })
})
