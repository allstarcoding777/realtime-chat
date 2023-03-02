const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const { userJoin, getCurrentUser, userLeave, getRoomUsers } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//static folder
app.use(express.static(path.join(__dirname + '/public')));

//sets variable for chat bot
const chatBot = 'Chat Bot';

//run when client connects
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
        //create user and room they join
        const user = userJoin(socket.id, username, room);
        //join user to room
        socket.join(user.room);

    //welcome current user
    socket.emit('message', formatMessage(chatBot, 'Welcome!'));

    //broadcasts when a user connects to a specific room
    socket.broadcast.to(user.room).emit(
        'message', formatMessage(chatBot, `${user.username} has joined the chat`));
        //send users and room info
        io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room),
        });
    });


    //catch/listen for chatMessage onserver
    socket.on('chatMessage', (msg) => {
        //get current user
        const user = getCurrentUser(socket.id);
        io.to(user.room).emit('message', formatMessage(user.username, msg));
    });

    //runs when client disconnects from a specific room
    socket.on('disconnect', () => {
        //get user that left
        const user = userLeave(socket.id);
        if(user) {
            io.to(user.room).emit(
                'message', formatMessage(chatBot, `${user.username} has left the chat`)
            );

      //send users and room info
        io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
        });
        }
    });
});

const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));