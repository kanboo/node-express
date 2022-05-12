const { Server } = require('socket.io')

let io = null

const getSocketIO = () => io

const init = () => {
  io.on('connection', (socket) => {
    console.log('connection', socket.id)

    /**
     * Socket.io 常用的 API
     * @url https://ithelp.ithome.com.tw/articles/10276725
     */
    socket.on('post:create', (payload) => {
      console.log('post:create', payload)

      // 給除了自己以外的使用者廣播訊息
      socket.broadcast.emit('post:create', payload)

      // 給所有使用者廣播訊息(含自己)
      // io.emit('post:create', payload)
    })
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
