const WebSocket = require('ws')

const wss = new WebSocket.Server({port: 4000}, () => {
  console.log('wss listening on port 4000')
})

wss.on('connection', (ws) => {
  let date = new Date()
  console.log(`connected: ${date.toLocaleString()}`)
  ws.on('message', (data) => {
    console.log(`message: ${data}`)
    ws.send(data)
  })
  ws.on('close', () => {
    date = new Date()
    console.log(`disconnected: ${date.toLocaleString()}`)
  })
  ws.on('error', (e) => console.error(e))
})
