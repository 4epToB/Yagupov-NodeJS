const express = require('express');
const app = express();
const server = require('http').Server(app);
const cors = require('cors');

const corsOptions = {
  credentials: true
}

app.use(cors(corsOptions));
const io = require('socket.io')(server,{
	cors: { 
		origin: "http://localhost:8080", 
		methods: ["GET", "POST"], 
		transports: ['websocket', 'polling'], 
		credentials: true 
	}, 
	allowEIO3: true
});
server.listen(3000, function () {
    console.log('Server started!');
});
let users=[]
let lobbies=[]
let m=(username,text,id)=>({username, text, id})
io.on('connection', function (socket) {
    socket.on("login",(username,cb)=>{
        if(!username){
            return cb("Введите имя")
        }
        const user={
            username:username,
            id:socket.id
        }
        socket.join("mainroom")
        users.push(user)
        cb(user)
        socket.emit('loggedIn',user)
        socket.emit('newMessage',m('admin',`Привет ${username}`))
        io.emit('getUsers',users)
        console.log(lobbies.length)
        socket.emit('getLobbies',lobbies)
        socket.broadcast
            .to("mainroom")
            .emit('newMessage',m('admin',`Смотрите кто к нам пришел, да это же ${username}!!`))

    })
    socket.on("sendMessage",(message)=>{
        io.to("mainroom").emit('newMessage',m(message.username,message.textMessage))
    })
    
    socket.on("createLobby",(username,cb)=>{
        let turn=Math.round(Math.random())
        let unit=Math.round(Math.random())
        const lobby={
            username:username,
            lobbyName:socket.id,
            turn:turn,
            unit:unit,
            [socket.id]:[]
        }
        socket.join(lobby.lobbyName)
        lobbies.unshift(lobby)
        cb({lobby:lobby.lobbyName,turn:turn,unit:unit})
        io.to("mainroom").emit('getLobbies',lobbies)
        console.log('Список лобби:',lobbies)
    })
    socket.on("deleteLobby",(username)=>{
        let lobyToDelete = lobbies.find(lobby => lobby.username === username)
        socket.leave(lobyToDelete.lobbyName)
        let index=lobbies.findIndex(lobby=>lobby.username==username)
        lobbies.splice(index,1)
        io.to("mainroom").emit('getLobbies',lobbies)
    })
    socket.on("joinLobby",(usersInLobby)=>{
        let lobyToDelete = lobbies.find(lobby => lobby.username === usersInLobby.username2)
        console.log('Удаляем лобби:',lobyToDelete)
        if (lobyToDelete){
            socket.leave(lobyToDelete.lobbyName)
            let indexDel=lobbies.findIndex(lobby=>lobby.username==usersInLobby.username2)
            lobbies.splice(indexDel,1)
        }
        
        let lobyToConnect = lobbies.find(lobby => lobby.username === usersInLobby.username)
        lobyToConnect.username2=usersInLobby.username2
        lobyToConnect[socket.id]=[]
        socket.join(lobyToConnect.lobbyName)
        socket.emit("setOponent",{turn:!lobyToConnect.turn,unit:!lobyToConnect.unit,lobbyname:lobyToConnect.lobbyName})
        io.to(lobyToConnect.lobbyName).emit('newMessage',m('admin',"Бейтесь до конца"))
        io.to(lobyToConnect.lobbyName).emit('gameStart')
        io.to("mainroom").emit('newMessage',m('admin',`Между ${usersInLobby.username} и ${usersInLobby.username2} начался махач!`))
        io.to("mainroom").emit('getLobbies',lobbies)

    })

    socket.on('PlayerTurn',function(data){
        let lobby = lobbies.find(lobby => lobby.lobbyName === data.lobbyName)
        console.log('Список лобби:',lobbies)
        console.log("data:",data)
        console.log("lobby:",lobby)
        lobby[socket.id].push(data.path)
        if(getWinner(lobby[socket.id])){
            let index=lobbies.findIndex(lobby=>lobby.username==data.lobbyName)
            lobbies.splice(index,1) 
            io.to("mainroom").emit('getLobbies',lobbies)
            io.to(data.lobbyName).emit('youWin');
            socket.broadcast
            .to(data.lobbyName)
            .emit('youLose')

        }else {
            socket.broadcast
            .to(data.lobbyName)
            .emit('PlayerTurn', data);
        }
        

    })
    socket.on('disconnect', () => {
		/* delete sockets[socket.id];
		console.log(socket.id+"вышел") */
        /* console.log(Object.getOwnPropertyNames(sockets)) */
		}
        
	)
    /* console.log(Object.getOwnPropertyNames(sockets)) */
}); 
function getWinner(socketid){
    if (socketid.includes("0") && socketid.includes("1") && socketid.includes("2")) return 1 
    if (socketid.includes("3") && socketid.includes("4") && socketid.includes("5")) return 1
    if (socketid.includes("6") && socketid.includes("7") && socketid.includes("8")) return 1
    if (socketid.includes("0") && socketid.includes("3") && socketid.includes("6")) return 1
    if (socketid.includes("1") && socketid.includes("4") && socketid.includes("7")) return 1
    if (socketid.includes("2") && socketid.includes("5") && socketid.includes("8")) return 1
    if (socketid.includes("0") && socketid.includes("4") && socketid.includes("8")) return 1
    if (socketid.includes("2") && socketid.includes("4") && socketid.includes("6")) return 1
}