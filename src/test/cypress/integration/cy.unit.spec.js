import { deleteOptions, getJsonModalBody, getProtocols, highlightJson, isValidJson, isValidUrl, stringifyJson } from '../../../main/index'

describe('Unit Tests', function () {
  const jsonMessageInvalid = '"missingLeadingBracket": true}'
  const jsonMessageValid = '{"Message 1":{"null":null,"number":42,"string":"is the answer to everything","boolean":false}}'
  const curlyPrefix = 'Prefix{"subscribe": ["id1", "id2"]}'
  const curlySuffix = '{"subscribe": ["id1", "id2"]}Suffix'
  const curlyWrapper = 'Prefix{"subscribe": ["id1", "id2"]}Suffix'
  const squarePrefix = 'Prefix["subscribe", ["id1", "id2"]]'
  const squareSuffix = '["subscribe", ["id1", "id2"]]Suffix'
  const squareWrapper = 'Prefix["subscribe", ["id1", "id2"]]Suffix'

  before(() => {
    cy.mockChromeStorageAndVisit()
  })

  describe('highlightJson()', function () {
    it('should return an element with formatted JSON', function () {
      const json = JSON.parse(jsonMessageValid)
      const text = highlightJson(JSON.stringify(json, null, 2))
      const element = window.document.createElement('pre')
      element.innerHTML = text
      const children = element.children
      expect(children.length).to.eq(9)
      expect(children[1].className).to.eq('bwc-key')
      expect(children[1].innerHTML).to.eq('"null":')
      expect(children[2].className).to.eq('bwc-null')
      expect(children[2].innerHTML).to.eq('null')
      expect(children[3].className).to.eq('bwc-key')
      expect(children[3].innerHTML).to.eq('"number":')
      expect(children[4].className).to.eq('bwc-number')
      expect(children[4].innerHTML).to.eq('42')
      expect(children[5].className).to.eq('bwc-key')
      expect(children[5].innerHTML).to.eq('"string":')
      expect(children[6].className).to.eq('bwc-string')
      expect(children[6].innerHTML).to.eq('"is the answer to everything"')
      expect(children[7].className).to.eq('bwc-key')
      expect(children[7].innerHTML).to.eq('"boolean":')
      expect(children[8].className).to.eq('bwc-boolean')
      expect(children[8].innerHTML).to.eq('false')
    })
  })

  describe('getJsonModalBody()', function () {
    it('should return one element with valid JSON', function () {
      const body = getJsonModalBody(jsonMessageValid)
      const element = window.document.createElement('div')
      element.innerHTML = body
      const children = element.children
      expect(children.length).to.eq(1)
    })
    it('should return two elements and a warning with invalid JSON', function () {
      const body = getJsonModalBody(jsonMessageInvalid)
      const element = window.document.createElement('div')
      element.innerHTML = body
      const children = element.children
      expect(children.length).to.eq(2)
      expect(children[0].innerHTML).to.eq('This message does not contain any valid JSON.')
    })
    it('should return two elements with curlyPrefix', function () {
      const body = getJsonModalBody(curlyPrefix)
      const element = window.document.createElement('div')
      element.innerHTML = body
      const children = element.children
      expect(children.length).to.eq(2)
      expect(children[0].textContent).to.eq('Prefix')
    })
    it('should return two elements with curlySuffix', function () {
      const body = getJsonModalBody(curlySuffix)
      const element = window.document.createElement('div')
      element.innerHTML = body
      const children = element.children
      expect(children.length).to.eq(2)
      expect(children[1].textContent).to.eq('Suffix')
    })
    it('should return three elements with curlyWrapper', function () {
      const body = getJsonModalBody(curlyWrapper)
      const element = window.document.createElement('div')
      element.innerHTML = body
      const children = element.children
      expect(children.length).to.eq(3)
      expect(children[0].textContent).to.eq('Prefix')
      expect(children[2].textContent).to.eq('Suffix')
    })
    it('should return two elements with squarePrefix', function () {
      const body = getJsonModalBody(squarePrefix)
      const element = window.document.createElement('div')
      element.innerHTML = body
      const children = element.children
      expect(children.length).to.eq(2)
      expect(children[0].textContent).to.eq('Prefix')
    })
    it('should return two elements with squareSuffix', function () {
      const body = getJsonModalBody(squareSuffix)
      const element = window.document.createElement('div')
      element.innerHTML = body
      const children = element.children
      expect(children.length).to.eq(2)
      expect(children[1].textContent).to.eq('Suffix')
    })
    it('should return three elements with squareWrapper', function () {
      const body = getJsonModalBody(squareWrapper)
      const element = window.document.createElement('div')
      element.innerHTML = body
      const children = element.children
      expect(children.length).to.eq(3)
      expect(children[0].textContent).to.eq('Prefix')
      expect(children[2].textContent).to.eq('Suffix')
    })
  })

  describe('stringifyJson()', function () {
    const object = {'question': 'answer'}
    const string = '{"question": "answer"}'
    const result = '{"question":"answer"}'

    it('should return a string if passed an object', function () {
      expect(stringifyJson(object)).to.eq(result)
    })

    it('should return the same string if passed a string', function () {
      expect(stringifyJson(string)).to.eq(string)
    })
  })

  describe('isValidJson()', function () {
    it('should return false if invalid', function () {
      expect(isValidJson(jsonMessageInvalid)).to.eq(false)
    })

    it('should return true if valid', function () {
      expect(isValidJson(jsonMessageValid)).to.eq(true)
    })
  })

  describe('isValidUrl()', function () {
    it('should return true if begins with ws', function () {
      const url = 'ws://abc'
      expect(isValidUrl(url)).to.eq(true)
    })

    it('should return true if begins with wss', function () {
      const url = 'wss://abc'
      expect(isValidUrl(url)).to.eq(true)
    })

    it('should return false if it has spaces', function () {
      const url = 'ws://a bc'
      expect(isValidUrl(url)).to.eq(false)
    })

    it('should return false if it does not begin with ws or wss', function () {
      const url = 's://abc'
      expect(isValidUrl(url)).to.eq(false)
    })
  })

  describe('getProtocols()', function () {
    const string = 'protocol1'
    const array = 'protocol1, protocol2, protocol3'
    let input

    beforeEach(function () {
      input = $('<input>')
      $(document.body).append(input)
    })

    it('should return a string', function () {
      input.val(string)
      expect(getProtocols(input)).to.eq('protocol1')
    })

    it('should return an array', function () {
      input.val(array)
      const result = getProtocols(input)
      expect(typeof result).to.eq('object')
      expect(result.length).to.eq(3)
    })

    it('should return null', function () {
      input.val('')
      expect(getProtocols(input)).to.eq(null)
    })
  })

  describe('deleteOptions()', function () {
    const SEPARATOR = '\u0007'
    let savedOptions

    beforeEach(() => {
      savedOptions = {
        messages: [
          `ONE${SEPARATOR}{"type":"CHAT_MESSAGE","payload":{"chatUser":{"alias":"one"},"message":"one"}}`,
          `TWO${SEPARATOR}{"type":"CHAT_MESSAGE","payload":{"chatUser":{"alias":"two"},"message":"two"}}`,
          `THREE${SEPARATOR}{"type":"CHAT_MESSAGE","payload":{"chatUser":{"alias":"three"},"message":"three"}}`
        ],
        protocols: [
          'protocol1',
          [
            'protocol2',
            'protocol3'
          ]
        ],
        urls: [
          'ws://localhost:8080/ws/one',
          'ws://localhost:8080/ws/two',
          'ws://localhost:8080/ws/three'
        ]
      }
    })

    it('switch.message', function () {
      const options = deleteOptions('message', `ONE${SEPARATOR}`, savedOptions)
      expect(options.messages.length).to.eq(2, 'messages')
      expect(options.protocols.length).to.eq(2, 'protocols')
      expect(options.urls.length).to.eq(3, 'urls')
    })

    it('switch.protocol', function () {
      const options = deleteOptions('protocol', 'protocol1', savedOptions)
      expect(options.messages.length).to.eq(3, 'messages')
      expect(options.protocols.length).to.eq(1, 'protocols')
      expect(options.urls.length).to.eq(3, 'urls')
    })

    it('switch.url', function () {
      const options = deleteOptions('url', 'ws://localhost:8080/ws/one', savedOptions)
      expect(options.messages.length).to.eq(3, 'messages')
      expect(options.protocols.length).to.eq(2, 'protocols')
      expect(options.urls.length).to.eq(2, 'urls')
    })
  })
})
