describe('Defaults', function () {

  describe('#options in URL', function () {
    it('should show "Options" section', function () {
      cy.mockChromeStorageAndVisit('/#options')
      cy.get('#options').should('be.visible')
    })
  })

  describe('initial page load', function () {
    it('#client should be visible and #options should not be visible', function () {
      cy.mockChromeStorageAndVisit()
      cy.get('#client').should('be.visible')
      cy.get('#options').should('not.be.visible')
    })

    it('"Options" click opens #options and hides #client and vice versa', function () {
      cy.mockChromeStorageAndVisit()
      cy.get('#optionsAnchor').click()
      cy.get('#client').should('not.be.visible')
      cy.get('#options').should('be.visible')
      cy.get('#clientAnchor').click()
      cy.get('#client').should('be.visible')
      cy.get('#options').should('not.be.visible')
    })
  })

  describe('options default settings', function () {
    it('preferences', function () {
      cy.mockChromeStorageAndVisit('/#options')
      cy.get('#optionsPreferencesAnchor').click()
      cy.get('#optionsPreferences').should('be.visible')
      cy.get('#preferencesOptionsUrlCheckbox').should('be.checked')
      cy.get('#preferencesOptionsMessageCheckbox').should('be.checked')
      cy.get('#preferencesClientUrlCheckbox').should('not.be.checked')
      cy.get('#preferencesClientMessageCheckbox').should('be.checked')
    })

    it('urls', function () {
      cy.mockChromeStorageAndVisit('/#options')
      cy.get('#optionsUrlsAnchor').click()
      cy.get('#optionsUrls').should('be.visible')
      cy.fixture('optionsDefaults').then((input) => {
        cy.checkOptionsUrls(input)
      })
    })

    it('protocols', function () {
      cy.mockChromeStorageAndVisit('/#options')
      cy.get('#optionsProtocolsAnchor').click()
      cy.fixture('optionsDefaults').then((input) => {
        cy.checkOptionsProtocols(input)
      })
    })

    it('messages', function () {
      cy.mockChromeStorageAndVisit('/#options')
      cy.get('#optionsMessagesAnchor').click()
      cy.fixture('optionsDefaults').then((input) => {
        cy.checkOptionsMessages(input)
      })
    })
    
    it('client', function () {
      cy.mockChromeStorageAndVisit()
      cy.fixture('clientDefaults').then((input) => {
        cy.checkClient(input)
      })
    })
  })
})
