const { Server } = require('socket.io')

let io = null

const getSocketIO = () => io

const init = () => {
  io.on('connection', (socket) => {
    console.log('connection', socket.id)
  })
}

const initSocketIO = (server) => {
  io = new Server(server, {
    cors: { origin: process.env.FORENTEND_HOST },
  })
  init()
}

// Socket 事件通知
const triggerSocketNotification = (eventName, payload) => {
  io?.emit(eventName, payload)
}

module.exports = {
  initSocketIO,
  getSocketIO,
  triggerSocketNotification,
}
