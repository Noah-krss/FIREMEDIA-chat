const http = require("http");
const Express = require("express");
const { resolve } = require("path");
const App = Express();

/** Running client app */
App.use(Express.static(resolve(__dirname, "client")));
App.get("*", (req, res) => {
  res.sendFile(resolve(__dirname, "client/index.html"));
});

/** Starting server */
const server = http.createServer(App);
server.listen(8080, () => 
  console.log('Http server running up in port 8080'))

require('./websocket')(server)