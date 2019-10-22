describe('Options -> Heartbeats', function () {

  beforeEach(function () {
    cy.mockChromeStorageAndVisit('/#options')
    cy.get('#optionsHeartbeatsAnchor').click()
    cy.get('#optionsHeartbeats').should('be.visible')
  })

  // TODO

})

