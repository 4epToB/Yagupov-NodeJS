const express = require('express');
const app = express();
const server = require('http').Server(app);
const cors = require('cors');
var moment = require('moment');
moment.locale('ru');  

let mongoClient = require('mongodb').MongoClient;
let url = 'mongodb://localhost:27017';



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
let m=(username,text)=>({username, text, time:moment().format('LT')})
mongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client)=>{
	if(err){
		return console.log("ошибка1");
	}
    io.on('connection', function (socket) {
        let collection=client.db('test').collection("users");

        socket.on("registration",(formdata,cb)=>{
            collection.find({username:formdata.username}).toArray(function(err, results){
                console.log(results.length);
                console.log(results);
                if(results.length!=0){
                    return cb("Такой пользователь уже есть");
                }
                const user={
                    username:formdata.username,
                    password:formdata.password,
                    games:0,
                    win:0
                }
                collection.insertOne(user, (err, result)=>{
                    if(err){
                        return console.log("ошибка2",err);
                    }
                    console.log("Пользователь зарегистрирован");
                    /* client.close(); */
                })
                
            })
        })
        
        socket.on("login",(formdata,cb)=>{
            if(!formdata.username){
                return cb("Введите имя")
            }
            collection.find(
                    {username:formdata.username}
                ).toArray(function(err, results){
                    console.log(results);
                    if(results.length==0){
                        return cb("Такой пользователь не зарегистрирован");
                    }
                    if(results[0].password==formdata.password){
                        results[0].id=socket.id
                        const user={
                            username:results[0].username,
                            games:results[0].games,
                            win:results[0].win,
                            id:socket.id
                        }
                        console.log(user)
                        users.push(user)
                        socket.join("mainroom")
                        cb(user)
                        socket.emit('loggedIn',user)
                        socket.emit('newMessage',m('admin',`Привет ${formdata.username}`))
                        io.emit('getUsers',users)
                        console.log(lobbies.length)
                        socket.emit('getLobbies',lobbies)
                        socket.broadcast
                            .to("mainroom")
                            .emit('newMessage',m('admin',`Смотрите кто к нам пришел, да это же ${formdata.username}!!`))
                    }else {
                        return cb("Пароль неверный")
                    }

            })
            /* const user={
                username:formdata.username,
                id:socket.id
            }
            socket.join("mainroom")
            users.push(user) */

            /* cb(user)
            socket.emit('loggedIn',user)
            socket.emit('newMessage',m('admin',`Привет ${formdata.username}`))
            io.emit('getUsers',users)
            console.log(lobbies.length)
            socket.emit('getLobbies',lobbies)
            socket.broadcast
                .to("mainroom")
                .emit('newMessage',m('admin',`Смотрите кто к нам пришел, да это же ${formdata.username}!!`)) */

        })
        
        socket.on("sendMessage",(message)=>{
            if(message.textMessage.match(/^\//)){
                let lobbyToSend = lobbies.find(lobby => lobby.hasOwnProperty(socket.id))
                if(lobbyToSend){
                    let regMessage=message.textMessage.substring(1)
                    io.to(lobbyToSend.lobbyName).emit('newMessage',m(message.username,regMessage))
                }
                return
            }
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
            lobby[socket.id].push(data.path)
            
            if(getWinner(lobby[socket.id])){
                console.log('Список лобби до:',lobbies)
                console.log('имя лобби:',data.lobbyName)
                let index=lobbies.findIndex(lobby=>lobby.lobbyName==data.lobbyName)
                console.log('index:',index)
                lobbies.splice(index,1) 
                console.log('Список лобби после:',lobbies)
                io.to("mainroom").emit('getLobbies',lobbies)
                socket.emit('youWin');
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
            if(users.length!=0){
                let lobbyToleave = lobbies.find(lobby => lobby.hasOwnProperty(socket.id))
                if(lobbyToleave){
                    socket.broadcast
                        .to(lobbyToleave.lobbyName)
                        .emit('youWin')
                    let index=lobbies.findIndex(lobby=>lobby.lobbyName==lobbyToleave.lobbyName)
                    lobbies.splice(index,1)
                    io.to("mainroom").emit('getLobbies',lobbies)
                }
                let userLeaving=users.find(user => user.id==socket.id)
                let userIndex=users.findIndex(user => user.id==socket.id)
                users.splice(userIndex,1)
                io.emit('getUsers',users)
                io.emit('newMessage',m('admin',`${userLeaving.username} покинул игру`))
            }
        })
    }); 
})
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
