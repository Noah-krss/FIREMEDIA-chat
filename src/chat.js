const generateAvatar = require("./generateAvatar")

class _Chat {

  constructor() {
    this.messages = []
    this.users = {}
    this.idToUsersMap = {}
  }

  pushMessage(message) {
    this.messages.push(message)
  }

  alreadyExists(username) {
    return !!this.users[username]
  }

  addUser({username, id}) {
    if(this.alreadyExists(username)) return
    this.users[username] = {
      username,
      avatar: generateAvatar(username)
    }
    this.idToUsersMap[id] = username
  }
  
  removeUser(id) {
    delete this.users[this.idToUsersMap[id]]
    delete this.idToUsersMap[id]
  }

  getUsers () {
    return this.users
  }

  usersCount() {
    return Object.keys(this.users).length
  }
}

const Chat = new _Chat()
module.exports = {Chat}