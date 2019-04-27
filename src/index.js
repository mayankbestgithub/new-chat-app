const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const {generateMessage,generateLocationMessage} = require('../public/utils/message.js');
const {addUser,removeUser,getUser,getUsersInRoom} = require('../public/utils/users.js');

const app = express();
const server = http.createServer(app);

const io = socketio(server);

const port = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname,'../public');


app.use(express.static(publicDirectoryPath));

io.on('connection',(socket)=>{
    console.log('New Websocket connection');
    
    socket.on('join',({username,room},callback)=>{
     const {error,user} =  addUser({id:socket.id,username,room})
        if(error){
            return callback(error)
        }
        socket.join(user.room);
        socket.emit('messageFound',generateMessage('Admin','Welcome!'))
        socket.broadcast.to(user.room).emit('messageFound', generateMessage(`Admin`,`${user.username} has joined`));
        io.to(user.room).emit('userJoinedRoom',{
            room:user.room,
            users:getUsersInRoom(user.room)
        })
        callback()
    })
    socket.on('message',(messageData,callback)=>{
        const user = getUser(socket.id)
        if(user){
            io.to(user.room).emit('messageFound',generateMessage(user.username,messageData));
            callback()
        }else{
            callback('failed to send message')
        }
       
        
    })
    socket.on('disconnect',()=>{
        const user = removeUser(socket.id)
        console.log(user)
        if(user){

            io.to(user.room).emit('messageFound',generateMessage(`Admin`,`${user.username} has left!`));
            io.to(user.room).emit('userJoinedRoom',{
                room:user.room,
                users:getUsersInRoom(user.room)
            })
        }
    })

    // socket.on('locationMessage',(locationMessage,callback)=>{
        
    //     io.emit('messageFound',`https://google.com/maps?q=${locationMessage.latitude},${locationMessage.longitude}`);
    //     callback('Delievered')
    // })
    socket.on('locationMessage',(message)=>{
        const user = getUser(socket.id)
        if(user){

            io.to(user.room).emit('locationmessageFound',generateLocationMessage(`${user.username}`,`https://google.com/maps?q=${message.latitude},${message.longitude}`));
        }
    })

})
server.listen(port,()=>{
    console.log('server is started at port '+port);
})