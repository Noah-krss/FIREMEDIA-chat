const joinChatBtn = document.querySelector('button')
const chat = document.querySelector('.chat')
const messagesContainer = document.querySelector('#messages')
const loginInput = document.querySelector('#login')
const errorMessageElement = document.querySelector('#error')

const chatStatus = {
  error: undefined,
  username: '',
  messages: [],
  logginStatus: false
}


joinChatBtn.onclick = () => {
  const {value: username}  = loginInput
  if(validateUsername(username)) {
    loginSuccess(username)
  } else loginFailure()
}

// STEP1: VALIDATE USER
function validateUsername(username) {
  if(username.length < 3) {
    chatStatus.error = 'username need at least 3 characters'
    return false
  }
  const regex = /^[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*$/
  if(!regex.test(username)) {
    chatStatus.error  ='Username only accepts alphanumeric character'
    return false
  }
  chatStatus.error = undefined
  return true
}

function  loginFailure() {
  loginInput.dataset.error = true
  errorMessageElement.innerText = chatStatus.error
}

function loginSuccess(username) {
  delete loginInput.dataset.error 
  errorMessageElement.innerText = ''
  chatStatus.username = username
  createUser()
}

/**  */
function createMessage({avatar, username, message}) {
  return `<div class="message">
    <div class="avatar">
      <img src="${avatar}"></img>
      <span class="username">${username}</span>
    </div>
    <div class="message-content">
      ${message}
    </div>
  </div>`
}

function LoadMessages(messages) {
  for(const message of messages) {
    messagesContainer.innerHTML += createMessage(message)
  }
}

function showChat() {
  if(chatStatus.logginStatus) chat.dataset.show = "true"
}

/** WEBSOCKET */
if(typeof io === 'undefined') {
  console.log('Your browser not soport Websockets')
}
const socket = new io()
function createUser() {
  socket.emit('login', {username: chatStatus.username})
}
socket.on('loginFailure', (error) => {
  loginFailure()
})

socket.on('loginSuccess', (messages) => {
  loginSuccess()
  chatStatus.logginStatus = true
  chatStatus.messages = [...chatStatus.messages, ...messages]
  LoadMessages()
  showChat()
})
