function main() {
  const loginButton = document.querySelector('button')
  const loginInput = document.querySelector('#login')
  const errorElement = document.querySelector('#error')
  const chat = document.querySelector('#chat')
  const messagesContainer = document.querySelector('#messages')
  const messageInput = document.querySelector('#message-input')
  
  let user = {
    username: '',
    avatar: ''
  }

  function showChat() {
    chat.dataset.show = "true"
  }
  function renderError(error) {
    errorElement.innerText = error
  }

  function login(username) {
    const isValid = checkUsername(username)
    if(!isValid) return
    socket.emit(LOGIN_REQUEST, {username})
  }

  function createMessage({avatar, username, message}, local=false) {
    messagesContainer.innerHTML 
    += `<div class="message" data-local="${local}">
      <div class="avatar">
        <img src="${avatar}"></img>
        <span class="username">${username}</span>
      </div>
      <div class="message-content">
        ${message}
      </div>
    </div>`
  }
  
  function loadMessages(messages) {
    for(const message of messages) {
      createMessage(message)
    }
  }

  /** Render error if username not respect format and retoor boolean */
  function checkUsername(username) {
    const regex = /^[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*$/
    if(username.length < 3) {
      renderError('Username most contains 3 characters at least')
      return false
    }
    if(!regex.test(username)) {
      renderError('Username most contains only Alphanumeric characters')
      return false
    }
    return true
  }

  
  /** Intialize websocket client */
  if (typeof io === 'undefined') throw new Error('Your borwser cannot sopport websockets')
  const socket = new io()
  
  /** Websocket event types */
  const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
  const LOGIN_FAILURE = 'LOGIN_FAILURE'
  const HANDLE_MESSAGE = 'HANDLE_MESSAGE'
  const EMIT_MESSAGE = 'EMIT_MESSAGE'
  const LOGIN_REQUEST = 'LOGIN_REQUEST'
  
  /** Websocket Events */
  socket.on(LOGIN_FAILURE, ({error}) => {
    renderError(error)
  })
  
  socket.on(LOGIN_SUCCESS, ({messages, userData}) => {
    showChat()
    user = userData
    loadMessages(messages)
  })

  socket.on(HANDLE_MESSAGE, (message) => {
    createMessage(message)
  })

  loginButton.onclick = () => {
    const {value: username} = loginInput
    login(username)
  }
  loginInput.onkeydown = (e) => {
    const {value: username} = e.target
    if(e.code === 'Enter') login(username)
  }

  messageInput.onkeydown = ({code, target}) => {
    const {value: message} = target
    if(code === 'Enter') {
      if(message.length) {
        createMessage({message, ...user}, true)
        socket.emit(EMIT_MESSAGE, {message, ...user})
        target.value = ''
      }
    }
  }
}
window.onload = main