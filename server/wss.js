const WebSocket = require('ws')

const arg = process.argv[2]
const port = 4000
const stringMessage = 'heartbeat message from server'
const objectMessage = {
  message: {
    type: 'heartbeat',
    payload: stringMessage
  }
}
// stop server one hour after last message received
let counter = 0
let timeout = 3600 * 1000
let timer

if (arg === 'auto') {
  // stop server one minute after last message received
  timeout = 60 * 1000
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

const handleHeartbeatMessage = function (ws, message) {
  counter++
  if (counter >= 2) {
    if (counter === 4) counter = 0
  } else {
    ws.send(message)
  }
}

wss.on('connection', (ws) => {
  let date = new Date()
  console.log(`connected: ${date.toLocaleString()}`)
  ws.on('message', (data) => {
    console.log(`message: ${data}`)
    clearInterval(timer)
    startTimer()
    switch (data) {
      case 'heartbeatString':
        handleHeartbeatMessage(ws, stringMessage)
        break
      case 'heartbeatObject':
        handleHeartbeatMessage(ws, JSON.stringify(objectMessage))
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
