const { Chat } = require("./chat");
const { LOGIN_FAILURE, LOGIN_SUCCESS } = require("./eventType");

module.exports = {
  emitLoginError(io, socketId, error) {
    io.to(socketId).emit(
      LOGIN_FAILURE,
      {error}
    );
  },
  emitLoginSuccess(io, socketId) {
    io.to(socketId).emit(
      LOGIN_SUCCESS,
      {
        messages: Chat.messages,
        userData: Chat.users[Chat.idToUsersMap[socketId]]
      }
    )
  }
}