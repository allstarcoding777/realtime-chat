const path = require('path');
const http = require('http');
const express = require('express');
const app = express();
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const server = http.createServer(app);
const io = socketio(server);
//static folder
app.use(express.static(path.join(__dirname + '/public')));
const chatBot = 'ChatApp Bot';
//run when client connects
io.on('connection', socket => {
    socket.on('joinRoom', ({ username, room }) => {
    });
    console.log('New WS Connection...');
    //welcome current user
    socket.emit('message', formatMessage(chatBot, 'Welcome to ChatApp!'));
    //broadcasts when a user connects
    socket.broadcast.emit('message', formatMessage(chatBot, 'A user has joined the chat'));
    //runs when client disconnects
    socket.on('disconnect', () => {
        io.emit('message', formatMessage(chatBot,'A user has left the chat'));
    });
    //catch/listen for chatMessage onserver
    socket.on('chatMessage', (msg) => {
        console.log(msg);
        io.emit('message', formatMessage('USER', msg));
    });
});
const PORT = 3000 || process.env.PORT;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));