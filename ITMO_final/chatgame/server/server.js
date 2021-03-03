const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

server.listen(3000, function () {
    console.log('Server started!');
});
/* app.use(express.static('../public')); */
let sockets={}
let turn
let unit
let unitClass
io.on('connection', function (socket) {
    if (Object.getOwnPropertyNames(sockets).length==0){
        turn=Math.round(Math.random())
        unit=Math.round(Math.random())
        unitClass=Math.round(Math.random())
        sockets[socket.id]=socket
        socket.emit('setNewPlayer',{unit:unit,turn:turn,unitClass:unitClass})
    } else {
        sockets[socket.id]=socket
        socket.emit('setNewPlayer',{unit:!unit,turn:!turn,unitClass:!unitClass})
    }
    socket.on('PlayerTurn',function(data){
        for(var id in sockets){
			if(id !== socket.id){
				sockets[id].emit('PlayerTurn', data);
			}
		}
        console.log(data)
    })
    socket.on('disconnect', () => {
		delete sockets[socket.id];
		console.log(socket.id+"вышел")
        console.log(Object.getOwnPropertyNames(sockets))
		}
        
	)
    console.log(Object.getOwnPropertyNames(sockets))
});