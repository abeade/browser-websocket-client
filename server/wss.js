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
let wss

// stop server 'x' seconds after last message received
if (arg) {
  const number = parseInt(arg, 10)
  if (Number.isInteger(number)) {
    timeout = number * 1000
    console.log(`wss will stop ${number} seconds after last message is received\n`)
  } else {
    console.error(`'${arg}' is not an integer\nwss will stop one hour after last message is received\n`)
  }
}

const startTimer = function () {
  timer = setTimeout(() => { stop() }, timeout)
}

const stop = function () {
  console.log('\nstopping wss ...')
  process.exit(0)
}

const handleHeartbeatMessage = function (ws, message) {
  counter++
  if (counter >= 2) {
    if (counter === 4) counter = 0
  } else {
    ws.send(message)
  }
}

wss = new WebSocket.Server({port: port}, () => {
  console.log('wss listening on port 4000')
  startTimer()
})

wss.on('error', (e) => console.error(e))

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
