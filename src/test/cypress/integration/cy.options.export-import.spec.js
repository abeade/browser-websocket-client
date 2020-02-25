describe('Options -> Export Import', function () {

  Cypress.on('window:before:load', (win) => {
    cy.spy(win.console, "warn").as('consoleWarn')
    cy.spy(win.console, "log").as('consoleLog')
    cy.spy(win.console, "dir").as('consoleDir')
  })

  beforeEach(function () {
    cy.mockChromeStorageAndVisit('/#options')
    cy.get('#optionsExportImportAnchor').click()
    cy.get('#optionsExportImport').should('be.visible')
    cy.wait(400)
  })

  it('clicking export configuration button should start the download process', function () {
    cy.log('clicking export configuration button should start the download process')
    cy.get('#optionsExportImportExportButton').click()
    cy.get('@consoleWarn').should('be.calledWith', 'Chrome is using mocked chrome.storage.sync')
    cy.get('@consoleLog').should('be.calledWith', 'Mocking chrome.downloads.download() with the following options:')
    cy.get('@consoleDir').should(a => {
      const { args } = a["getCalls"]()[0];
      expect(args[0].filename).to.be.equal("wsclient.json");
      expect(args[0].saveAs).to.be.true;
    });
  })

  it('selecting configuration file should show the selected file name', function () {
    cy.log('clicking choose configuration file should ')
    cy.get('#optionsExportImportFileInput').uploadFile('wsclientDefault.json')
    cy.get('#optionsExportImportFileName').should('be.visible')
    cy.get('#optionsExportImportFileName > code').contains('wsclientDefault.json')
  })

  it('clicking choose configuration file should show import dialog and be able to be canceled', function () {
    cy.log('clicking choose configuration file should ')
    cy.get('#optionsExportImportFileInput').uploadFile('wsclientDefault.json')
    cy.get('#optionsExportImportImportButton').click()
    cy.get('#importModal').should('be.visible')
    cy.wait(400)
    cy.get('#importModalCancelButton').click()
    cy.get('#importModal').should('not.be.visible')
  })

  it('clicking choose configuration file should show validation error when import file is not valid json', function () {
    cy.log('clicking choose configuration file should ')
    cy.get('#optionsExportImportFileInput').uploadFileContent('wsclientInvalid.json', 'Not a json content')
    cy.get('#optionsExportImportImportButton').click()
    cy.get('#importModal').should('be.visible')
    cy.wait(400)
    cy.get('#importModalContinueButton').click()
    cy.get('#importModalBody').contains('Error parsing JSON')
    cy.get('#importModalDescription').contains('SyntaxError: Unexpected token N in JSON at position 0')
  })

  it('clicking choose configuration file should show validation error when import file is not valid format', function () {
    cy.log('clicking choose configuration file should ')
    cy.get('#optionsExportImportFileInput').uploadFile('wsclientInvalidFormat.json')
    cy.get('#optionsExportImportImportButton').click()
    cy.get('#importModal').should('be.visible')
    cy.wait(400)
    cy.get('#importModalContinueButton').click()
    cy.get('#importModalBody').contains('Error parsing JSON')
    cy.get('#importModalDescription').contains('Unexpected file format found.')
  })

  it('clicking choose configuration file should show success when import file is valid', function () {
    cy.log('clicking choose configuration file should ')
    cy.get('#optionsExportImportFileInput').uploadFile('wsclientTest.json')
    cy.get('#optionsExportImportImportButton').click()
    cy.get('#importModal').should('be.visible')
    cy.wait(400)
    cy.get('#importModalContinueButton').click()
    cy.get('#importModalBody').contains('File successfully imported')
    cy.get('#importModalCancelButton').contains('Close')
    cy.get('#importModalContinueButton').should('not.be.visible')
  })
})
