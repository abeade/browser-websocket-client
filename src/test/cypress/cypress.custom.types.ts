declare global {
    namespace Cypress {
        interface Chainable {
            /**
             * Runs assertions using "clientDefaults.json" or a custom object
             *
             * @param {object} input one or more key-value pairs forming a test assertion
             * @example
             *     cy.fixture('clientDefaults').then((input) => {
             *         input.connectionStatusText = 'OPEN'
             *         cy.checkClient(input)
             *     })
             */
            checkClient(input: object): Chainable<null>

            /**
             * Runs assertions using "optionsDefaults.json" or a custom object, calling
             * checkOptionsUrls()
             * checkOptionsProtocols()
             * checkOptionsMessages()
             *
             * @param {object} input one or more key-value pairs forming a test assertion
             * @example
             *     cy.fixture('optionsDefaults').then((input) => {
             *         input.optionsUrlInputValue = 'ws://test'
             *         cy.checkOptions(input)
             *     })
             */
            checkOptions(input: object): Chainable<null>

            /**
             * Runs assertions using "optionsDefaults.json" or a custom object
             *
             * @param {object} input one or more key-value pairs forming a test assertion
             * @example
             *     cy.fixture('optionsDefaults').then((input) => {
             *         input.optionsMessageTextareaValue = '{"new": "message"}'
             *         cy.checkOptionsMessages(input)
             *     })
             */
            checkOptionsMessages(input: object): Chainable<null>

            /**
             * Runs assertions using "optionsDefaults.json" or a custom object
             *
             * @param {object} input one or more key-value pairs forming a test assertion
             * @example
             *     cy.fixture('optionsDefaults').then((input) => {
             *         input.optionsProtocolInputValue = 'protocol1'
             *         cy.checkOptionsProtocols(input)
             *     })
             */
            checkOptionsProtocols(input: object): Chainable<null>

            /**
             * Runs assertions using "optionsDefaults.json" or a custom object
             *
             * @param {object} input one or more key-value pairs forming a test assertion
             * @example
             *     cy.fixture('optionsDefaults').then((input) => {
             *         input.optionsUrlInputValue = 'ws://test'
             *         cy.checkOptionsUrls(input)
             *     })
             */
            checkOptionsUrls(input: object): Chainable<null>

            /**
             * Mocks chrome.storage.sync and calls cy.visit(url), defaulting to '/'
             *
             * @param {string} url The URL to visit. If relative uses `baseUrl`
             * @param {VisitOptions} [options] Pass in an options object to change the default behavior of `cy.visit()`
             * @see https://on.cypress.io/visit
             * @example
             *    cy.mockChromeStorageAndVisit()
             *    cy.mockChromeStorageAndVisit('/#home')
             */
            mockChromeStorageAndVisit(url: string, options ?: Partial<VisitOptions>): Chainable<Window>
        }
    }
}

export function checkClient() {
    return 'checkClient'
}

export function checkOptions() {
    return 'checkOptions'
}

export function checkOptionsMessages() {
    return 'checkOptionsMessages'
}

export function checkOptionsProtocols() {
    return 'checkOptionsProtocols'
}

export function checkOptionsUrls() {
    return 'checkOptionsUrls'
}

export function mockChromeStorageAndVisit() {
    return 'mockChromeStorageAndVisit'
}

