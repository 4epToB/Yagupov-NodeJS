const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const PORT = process.env.PORT || 3000;
app.use(express.static("public"));

let clientRooms = {};

io.on("connection", (client) => {
  console.log("a user connected");

  client.on("newChat", function handleNewChat(obj) {
    clientRooms[obj[1]] = {};
    clientRooms[obj[1]].messages = [];
    clientRooms[obj[1]].users = [{id: client.id, username: obj[0], roomname: obj[1]}];
    client.join(obj[1]);
    client.emit("newRoom", obj[1]);
    console.log(clientRooms)
  });

  client.on("joinChat", function handleJoinChat(obj) {
    console.log(obj)
    client.join(obj[0]);
    clientRooms[obj[0]].users.push({id: client.id, username: obj[1]})
  });

  client.on('message', function handleMessage(obj) {
    console.log( "client.on('message'", obj)
    clientRooms[obj[0]].messages.push(obj[1])
    io.to(obj[0]).emit('emitmessage', clientRooms[obj[0]].messages)
    console.log( clientRooms[obj[0]].messages)
  })

  client.on('getRooms', function handleMessage(obj) {
    
    client.emit('emitRooms', Object.keys(clientRooms))
  })



  client.on("disconnect", () => {
    console.log("UserLeft")
  });
});








http.listen(PORT, () => {
  console.log("listening on *:3000");
});
