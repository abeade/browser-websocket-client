const WebSocket = require('ws')

const port = 4000
const timeout = 60 * 1000
let timer

const stringMessage = 'heartbeat message from server'

const objectMessage = {
  message: {
    type: 'heartbeat',
    payload: stringMessage
  }
}

const startTimer = function () {
  timer = setTimeout(() => { stop() }, timeout)
}

const stop = function () {
  console.log('\nstopping wss ...')
  process.exit(0)
}

const wss = new WebSocket.Server({port: port}, () => {
  console.log('wss listening on port 4000')
  startTimer()
})

wss.on('connection', (ws) => {
  let date = new Date()
  console.log(`connected: ${date.toLocaleString()}`)
  ws.on('message', (data) => {
    console.log(`message: ${data}`)
    clearInterval(timer)
    startTimer()
    switch (data) {
      case 'heartbeatString':
        ws.send(stringMessage)
        break
      case 'heartbeatObject':
        ws.send(JSON.stringify(objectMessage))
        break
      default:
        ws.send(data)
    }
  })
  ws.on('close', () => {
    date = new Date()
    console.log(`disconnected: ${date.toLocaleString()}`)
  })
  ws.on('error', (e) => console.error(e))
})
