const socketIO = require('socket.io');
const {Chat} = require('./chat')
const {LOGIN_REQUEST, EMIT_MESSAGE, HANDLE_MESSAGE} = require('./eventType')
const {emitLoginError, emitLoginSuccess} = require('./loginService')

module.exports = (server) => {
  const io = socketIO(server)
  io.on('connection', (socket) => {
    const {id: socketId} = socket
    
    /** LOGIN REQUEST EVENT */
    socket.on(LOGIN_REQUEST, ({username}) => {
      if(Chat.alreadyExists(username)) {
        emitLoginError(
          io, 
          socketId, 
          'Your username it\'s already in use, please try an other'
          )    
          return
      }
      Chat.addUser({username, id: socketId})
      emitLoginSuccess(io, socketId)
    }) /** END OF LOGIN REQUEST EVENT */

    /** HANDLER MESSAGES EVEMT*/
    socket.on(EMIT_MESSAGE, (message) => {
      Chat.pushMessage(message)
      socket.broadcast.emit(HANDLE_MESSAGE, message)
    })

    socket.on('disconnect', () => {
      Chat.removeUser(socketId)
    })
  })
}