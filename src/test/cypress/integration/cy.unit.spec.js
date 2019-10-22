import { functions, variables } from '../../../main/index'

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
      const text = functions.highlightJson(JSON.stringify(json, null, 2))
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

  describe('checkMessageForHeartbeat()', function () {
    const clientHeartbeatDefault = {
      name: 'none',
      interval: 60,
      clientMessage: 'none',
      trackServerMessage: false,
      serverMessageType: 'object',
      serverMessageObjectKey: 'none',
      serverMessageObjectOperator: 'equals',
      serverMessageObjectValue: 'none',
      serverMessageString: 'none',
      displayServerMessage: false
    }
    const objectMessage = '{"message": {"type": "heartbeat", "payload": "heartbeat message from server"}}'
    const serverMessageObjectKey = 'message.type'
    const serverMessageObjectValue = 'heartbeat'
    const stringMessage = 'heartbeat message from server'
    let messageFromServer = ''
    beforeEach(() => {
      variables.clientHeartbeat =  clientHeartbeatDefault
      cy.spy(console, 'error')
      cy.stub(functions, 'addMessage')
      cy.stub(functions, 'updateHeartbeatServerStatus')
    })
    it ('should react correctly to invalid JSON in the server message', function () {
      messageFromServer = '{"invalid"'
      variables.clientHeartbeat.trackServerMessage = true
      functions.checkMessageForHeartbeat(messageFromServer)
      expect(console.error).to.be.calledWith('The server message below is not valid JSON:')
      expect(functions.addMessage).to.be.calledWith(messageFromServer, null)
      expect(functions.updateHeartbeatServerStatus).not.to.be.called
    })
    it ('should react correctly to object and noValue when not heartbeatMessage', function () {
      messageFromServer = objectMessage
      variables.clientHeartbeat.trackServerMessage = true
      variables.clientHeartbeat.serverMessageType = 'object'
      variables.clientHeartbeat.serverMessageObjectOperator = 'noValue'
      functions.checkMessageForHeartbeat(messageFromServer)
      expect(console.error).not.to.be.called
      expect(functions.addMessage).to.be.calledWith(messageFromServer, null)
      expect(functions.updateHeartbeatServerStatus).not.to.be.called
    })
    it ('should react correctly to object and noValue when heartbeatMessage', function () {
      messageFromServer = objectMessage
      variables.clientHeartbeat.trackServerMessage = true
      variables.clientHeartbeat.serverMessageType = 'object'
      variables.clientHeartbeat.serverMessageObjectOperator = 'noValue'
      variables.clientHeartbeat.serverMessageObjectKey = serverMessageObjectKey
      functions.checkMessageForHeartbeat(messageFromServer)
      expect(console.error).not.to.be.called
      expect(functions.addMessage).to.be.calledWith(messageFromServer, null)
      expect(functions.updateHeartbeatServerStatus).to.be.called
    })
    it ('should react correctly to object and noValue when heartbeatMessage and displayServerMessage', function () {
      messageFromServer = objectMessage
      variables.clientHeartbeat.trackServerMessage = true
      variables.clientHeartbeat.serverMessageType = 'object'
      variables.clientHeartbeat.serverMessageObjectOperator = 'noValue'
      variables.clientHeartbeat.serverMessageObjectKey = serverMessageObjectKey
      functions.checkMessageForHeartbeat(messageFromServer)
      expect(console.error).not.to.be.called
      expect(functions.addMessage).to.be.calledWith(messageFromServer, null)
      expect(functions.updateHeartbeatServerStatus).to.be.called
    })
    it ('should react correctly to object and equals when not heartbeatMessage', function () {
      messageFromServer = objectMessage
      variables.clientHeartbeat.trackServerMessage = true
      variables.clientHeartbeat.serverMessageType = 'object'
      variables.clientHeartbeat.serverMessageObjectOperator = 'equals'
      functions.checkMessageForHeartbeat(messageFromServer)
      expect(console.error).not.to.be.called
      expect(functions.addMessage).to.be.calledWith(messageFromServer, null)
      expect(functions.updateHeartbeatServerStatus).not.to.be.called
    })
    it ('should react correctly to object and equals when heartbeatMessage', function () {
      messageFromServer = objectMessage
      variables.clientHeartbeat.trackServerMessage = true
      variables.clientHeartbeat.serverMessageType = 'object'
      variables.clientHeartbeat.serverMessageObjectOperator = 'equals'
      variables.clientHeartbeat.serverMessageObjectValue = serverMessageObjectValue
      functions.checkMessageForHeartbeat(messageFromServer)
      expect(console.error).not.to.be.called
      expect(functions.addMessage).not.to.be.called
      expect(functions.updateHeartbeatServerStatus).to.be.called
    })
    it ('should react correctly to object and equals when heartbeatMessage and displayServerMessage', function () {
      messageFromServer = objectMessage
      variables.clientHeartbeat.trackServerMessage = true
      variables.clientHeartbeat.serverMessageType = 'object'
      variables.clientHeartbeat.serverMessageObjectOperator = 'equals'
      variables.clientHeartbeat.serverMessageObjectKey = serverMessageObjectKey
      variables.clientHeartbeat.serverMessageObjectValue = serverMessageObjectValue
      functions.checkMessageForHeartbeat(messageFromServer)
      expect(console.error).not.to.be.called
      expect(functions.addMessage).to.be.calledWith(messageFromServer, null)
      expect(functions.updateHeartbeatServerStatus).not.to.be.called
    })
    it ('should react correctly to object and notEquals when not heartbeatMessage', function () {
      messageFromServer = objectMessage
      variables.clientHeartbeat.trackServerMessage = true
      variables.clientHeartbeat.serverMessageType = 'object'
      variables.clientHeartbeat.serverMessageObjectOperator = 'notEquals'
      variables.clientHeartbeat.serverMessageObjectValue = serverMessageObjectValue
      functions.checkMessageForHeartbeat(messageFromServer)
      expect(console.error).not.to.be.called
      expect(functions.addMessage).to.be.calledWith(messageFromServer, null)
      expect(functions.updateHeartbeatServerStatus).not.to.be.called
    })
    it ('should react correctly to object and notEquals when heartbeatMessage', function () {
      messageFromServer = objectMessage
      variables.clientHeartbeat.trackServerMessage = true
      variables.clientHeartbeat.serverMessageType = 'object'
      variables.clientHeartbeat.serverMessageObjectOperator = 'notEquals'
      functions.checkMessageForHeartbeat(messageFromServer)
      expect(console.error).not.to.be.called
      expect(functions.addMessage).to.be.calledWith(messageFromServer, null)
      expect(functions.updateHeartbeatServerStatus).not.to.be.called
    })
    it ('should react correctly to object and notEquals when heartbeatMessage and displayServerMessage', function () {
      messageFromServer = objectMessage
      variables.clientHeartbeat.trackServerMessage = true
      variables.clientHeartbeat.serverMessageType = 'object'
      variables.clientHeartbeat.serverMessageObjectOperator = 'notEquals'
      functions.checkMessageForHeartbeat(messageFromServer)
      expect(console.error).not.to.be.called
      expect(functions.addMessage).to.be.calledWith(messageFromServer, null)
      expect(functions.updateHeartbeatServerStatus).not.to.be.called
    })
    it ('should react correctly to invalid clientHeartbeat.serverMessageObjectOperator', function () {
      messageFromServer = objectMessage
      variables.clientHeartbeat.trackServerMessage = true
      variables.clientHeartbeat.serverMessageType = 'object'
      variables.clientHeartbeat.serverMessageObjectOperator = 'none'
      functions.checkMessageForHeartbeat(messageFromServer)
      expect(console.error).to.be.calledWith('none is not a valid value for serverMessageObjectOperator')
      expect(functions.addMessage).to.be.calledWith(messageFromServer, null)
      expect(functions.updateHeartbeatServerStatus).not.to.be.called
    })
    it ('should react correctly to string when not heartbeatMessage', function () {
      messageFromServer = stringMessage
      variables.clientHeartbeat.trackServerMessage = true
      variables.clientHeartbeat.serverMessageType = 'string'
      functions.checkMessageForHeartbeat(messageFromServer)
      expect(console.error).not.to.be.called
      expect(functions.addMessage).to.be.calledWith(messageFromServer, null)
      expect(functions.updateHeartbeatServerStatus).not.to.be.called
    })
    it ('should react correctly to string when heartbeatMessage', function () {
      messageFromServer = stringMessage
      variables.clientHeartbeat.trackServerMessage = true
      variables.clientHeartbeat.serverMessageType = 'string'
      variables.clientHeartbeat.serverMessageString = stringMessage
      functions.checkMessageForHeartbeat(messageFromServer)
      expect(console.error).not.to.be.called
      expect(functions.addMessage).not.to.be.called
      expect(functions.updateHeartbeatServerStatus).to.be.called
    })
    it ('should react correctly to string when heartbeatMessage and displayServerMessage', function () {
      messageFromServer = stringMessage
      variables.clientHeartbeat.trackServerMessage = true
      variables.clientHeartbeat.serverMessageType = 'string'
      variables.clientHeartbeat.serverMessageString = stringMessage
      variables.clientHeartbeat.displayServerMessage = true
      functions.checkMessageForHeartbeat(messageFromServer)
      expect(console.error).not.to.be.called
      expect(functions.addMessage).to.be.calledWith(messageFromServer, null)
      expect(functions.updateHeartbeatServerStatus).to.be.called
    })
    it ('should react correctly to invalid clientHeartbeat.serverMessageType', function () {
      messageFromServer = stringMessage
      variables.clientHeartbeat.trackServerMessage = true
      variables.clientHeartbeat.serverMessageType = 'none'
      functions.checkMessageForHeartbeat(messageFromServer)
      expect(console.error).to.be.calledWith('none is not a valid value for serverMessageType')
      expect(functions.addMessage).to.be.calledWith(messageFromServer, null)
      expect(functions.updateHeartbeatServerStatus).not.to.be.called
    })
  })

  describe('getJsonModalBody()', function () {
    it('should return one element with valid JSON', function () {
      const body = functions.getJsonModalBody(jsonMessageValid)
      const element = window.document.createElement('div')
      element.innerHTML = body
      const children = element.children
      expect(children.length).to.eq(1)
    })
    it('should return two elements and a warning with invalid JSON', function () {
      const body = functions.getJsonModalBody(jsonMessageInvalid)
      const element = window.document.createElement('div')
      element.innerHTML = body
      const children = element.children
      expect(children.length).to.eq(2)
      expect(children[0].innerHTML).to.eq('This message does not contain any valid JSON.')
    })
    it('should return two elements with curlyPrefix', function () {
      const body = functions.getJsonModalBody(curlyPrefix)
      const element = window.document.createElement('div')
      element.innerHTML = body
      const children = element.children
      expect(children.length).to.eq(2)
      expect(children[0].textContent).to.eq('Prefix')
    })
    it('should return two elements with curlySuffix', function () {
      const body = functions.getJsonModalBody(curlySuffix)
      const element = window.document.createElement('div')
      element.innerHTML = body
      const children = element.children
      expect(children.length).to.eq(2)
      expect(children[1].textContent).to.eq('Suffix')
    })
    it('should return three elements with curlyWrapper', function () {
      const body = functions.getJsonModalBody(curlyWrapper)
      const element = window.document.createElement('div')
      element.innerHTML = body
      const children = element.children
      expect(children.length).to.eq(3)
      expect(children[0].textContent).to.eq('Prefix')
      expect(children[2].textContent).to.eq('Suffix')
    })
    it('should return two elements with squarePrefix', function () {
      const body = functions.getJsonModalBody(squarePrefix)
      const element = window.document.createElement('div')
      element.innerHTML = body
      const children = element.children
      expect(children.length).to.eq(2)
      expect(children[0].textContent).to.eq('Prefix')
    })
    it('should return two elements with squareSuffix', function () {
      const body = functions.getJsonModalBody(squareSuffix)
      const element = window.document.createElement('div')
      element.innerHTML = body
      const children = element.children
      expect(children.length).to.eq(2)
      expect(children[1].textContent).to.eq('Suffix')
    })
    it('should return three elements with squareWrapper', function () {
      const body = functions.getJsonModalBody(squareWrapper)
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
      expect(functions.stringifyJson(object)).to.eq(result)
    })

    it('should return the same string if passed a string', function () {
      expect(functions.stringifyJson(string)).to.eq(string)
    })
  })

  describe('isValidJson()', function () {
    it('should return false if invalid', function () {
      expect(functions.isValidJson(jsonMessageInvalid)).to.eq(false)
    })

    it('should return true if valid', function () {
      expect(functions.isValidJson(jsonMessageValid)).to.eq(true)
    })
  })

  describe('isValidUrl()', function () {
    it('should return true if begins with ws', function () {
      const url = 'ws://abc'
      expect(functions.isValidUrl(url)).to.eq(true)
    })

    it('should return true if begins with wss', function () {
      const url = 'wss://abc'
      expect(functions.isValidUrl(url)).to.eq(true)
    })

    it('should return false if it has spaces', function () {
      const url = 'ws://a bc'
      expect(functions.isValidUrl(url)).to.eq(false)
    })

    it('should return false if it does not begin with ws or wss', function () {
      const url = 's://abc'
      expect(functions.isValidUrl(url)).to.eq(false)
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
      expect(functions.getProtocols(input)).to.eq('protocol1')
    })

    it('should return an array', function () {
      input.val(array)
      const result = functions.getProtocols(input)
      expect(typeof result).to.eq('object')
      expect(result.length).to.eq(3)
    })

    it('should return null', function () {
      input.val('')
      expect(functions.getProtocols(input)).to.eq(null)
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
      const options = functions.deleteOptions('message', `ONE${SEPARATOR}`, savedOptions)
      expect(options.messages.length).to.eq(2, 'messages')
      expect(options.protocols.length).to.eq(2, 'protocols')
      expect(options.urls.length).to.eq(3, 'urls')
    })

    it('switch.protocol', function () {
      const options = functions.deleteOptions('protocol', 'protocol1', savedOptions)
      expect(options.messages.length).to.eq(3, 'messages')
      expect(options.protocols.length).to.eq(1, 'protocols')
      expect(options.urls.length).to.eq(3, 'urls')
    })

    it('switch.url', function () {
      const options = functions.deleteOptions('url', 'ws://localhost:8080/ws/one', savedOptions)
      expect(options.messages.length).to.eq(3, 'messages')
      expect(options.protocols.length).to.eq(2, 'protocols')
      expect(options.urls.length).to.eq(2, 'urls')
    })
  })
})
