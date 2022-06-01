const { Chat } = require("./chat")

const EmitNewMessage = (socket, message) => {
  socket.broadcast.emit('newMessage', message)
}

const HandleNewMessage = (socket) => {
  socket.on('sendMessage', (message) => {
    Chat.pushMessage(message)
    EmitNewMessage(socket, message)
  })
}

module.exports  = {
  EmitNewMessage,
  HandleNewMessage
}