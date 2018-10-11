describe('index.js', function () {
  const APP = window.app
  const SEPARATOR = '\u0007'
  const jsonMessageInvalid = '"missingLeadingBracket": true}'
  const jsonMessageValid = '{"syntaxHighlight() test": {"null": null, "number": 42, "string": "is the answer to everything", "boolean": false }}'
  let optionsMessageSavedTable
  let optionsUrlSavedTable
  let savedOptions

  beforeEach(function () {
    optionsMessageSavedTable = $('#optionsMessageSavedTable')
    optionsUrlSavedTable = $('#optionsUrlSavedTable')
    savedOptions = {
      messages: [
        `ONE${SEPARATOR}{"type":"CHAT_MESSAGE","payload":{"chatUser":{"alias": "one"},"message":"one"}}`,
        `TWO${SEPARATOR}{"type":"CHAT_MESSAGE","payload":{"chatUser":{"alias": "two"},"message":"two"}}`,
        `THREE${SEPARATOR}{"type":"CHAT_MESSAGE","payload":{"chatUser":{"alias": "three"},"message":"three"}}`
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

  it('populateMessageTable() should populate #optionsMessageSavedTable', function () {
    APP.savedOptions = savedOptions
    APP.populateMessageTable()
    expect(optionsMessageSavedTable.children.length).toBeGreaterThan(0)
  })

  it('populateUrlTable() should populate #optionsUrlSavedTable', function () {
    APP.savedOptions = savedOptions
    APP.populateUrlTable()
    expect(optionsUrlSavedTable.children.length).toBeGreaterThan(0)
  })

  it('syntaxHighlight() should return an element with formatted JSON', function () {
    const json = JSON.parse(jsonMessageValid)
    const text = APP.syntaxHighlight(JSON.stringify(json, null, 2))
    const element = window.document.createElement('pre')
    element.innerHTML = text
    const children = element.children
    expect(children.length).toBe(9)
    expect(children[1].className).toBe('bwc-key')
    expect(children[1].innerHTML).toBe('"null":')
    expect(children[2].className).toBe('bwc-null')
    expect(children[2].innerHTML).toBe('null')
    expect(children[3].className).toBe('bwc-key')
    expect(children[3].innerHTML).toBe('"number":')
    expect(children[4].className).toBe('bwc-number')
    expect(children[4].innerHTML).toBe('42')
    expect(children[5].className).toBe('bwc-key')
    expect(children[5].innerHTML).toBe('"string":')
    expect(children[6].className).toBe('bwc-string')
    expect(children[6].innerHTML).toBe('"is the answer to everything"')
    expect(children[7].className).toBe('bwc-key')
    expect(children[7].innerHTML).toBe('"boolean":')
    expect(children[8].className).toBe('bwc-boolean')
    expect(children[8].innerHTML).toBe('false')
  })

  describe('isValidJson()', function () {
    it('should return false if invalid', function () {
      expect(APP.isValidJson(jsonMessageInvalid)).toBe(false)
    })
    it('should return true if valid', function () {
      expect(APP.isValidJson(jsonMessageValid)).toBe(true)
    })
  })

  describe('isValidUrl()', function () {
    it('should return true if begins with ws', function () {
      const url = 'ws://abc'
      expect(APP.isValidUrl(url)).toBe(true)
    })
    it('should return true if begins with wss', function () {
      const url = 'wss://abc'
      expect(APP.isValidUrl(url)).toBe(true)
    })
    it('should return false if it has spaces', function () {
      const url = 'ws://a bc'
      expect(APP.isValidUrl(url)).toBe(false)
    })
    it('should return false if it does not begin with ws or wss', function () {
      const url = 's://abc'
      expect(APP.isValidUrl(url)).toBe(false)
    })
  })

  describe('savedOptionsDelete()', function () {
    it('switch.message', function () {
      APP.savedOptions = savedOptions
      APP.savedOptionsDelete('message', `ONE${SEPARATOR}{"type":"CHAT_MESSAGE","payload":{"chatUser":{"alias": "one"},"message":"one"}}`)
      expect(APP.savedOptions.messages.length).toBe(2, 'messages')
      expect(APP.savedOptions.protocols.length).toBe(2, 'protocols')
      expect(APP.savedOptions.urls.length).toBe(3, 'urls')
    })
    it('switch.protocol', function () {
      APP.savedOptions = savedOptions
      APP.savedOptionsDelete('protocol', 'protocol1')
      expect(APP.savedOptions.messages.length).toBe(3, 'messages')
      expect(APP.savedOptions.protocols.length).toBe(1, 'protocols')
      expect(APP.savedOptions.urls.length).toBe(3, 'urls')
    })
    it('switch.url', function () {
      APP.savedOptions = savedOptions
      APP.savedOptionsDelete('url', 'ws://localhost:8080/ws/one')
      expect(APP.savedOptions.messages.length).toBe(3, 'messages')
      expect(APP.savedOptions.protocols.length).toBe(2, 'protocols')
      expect(APP.savedOptions.urls.length).toBe(2, 'urls')
    })
  })
})
