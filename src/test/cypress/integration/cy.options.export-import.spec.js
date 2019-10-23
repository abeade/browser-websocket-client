describe('Options -> Export Import', function () {

  beforeEach(function () {
    cy.mockChromeStorageAndVisit('/#options')
    cy.get('#optionsExportImportAnchor').click()
    cy.get('#optionsExportImport').should('be.visible')
  })

  // TODO
  it('stub', function () {
  })
})
