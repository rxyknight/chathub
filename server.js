const express = require('express');
const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const CreateMessage = require('./utils/message');
const { joinRoom, getUserById, getUsersByRoom, leaveRoom } = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const botName = 'ChatHub Bot';

// Set static folder
app.use(express.static(path.join(__dirname, 'public')));

// Set script folder
app.use('/scripts', express.static(__dirname + '/node_modules/qs/dist/'));

// Run when client connects
io.on('connection', socket => {
    socket.on('joinRoom', (username, room) => {
        const user = joinRoom(socket.id, username, room);
        socket.join(user.room);

        // Update user list
        io.to(user.room).emit('updateUserList', getUsersByRoom(user.room));

        // Welcome current user
        socket.emit('message', CreateMessage(botName, 'Welcome to Chathub!'));
        // Broadcast when a user connects
        socket.to(user.room).broadcast.emit('message', CreateMessage(botName, `${user.username} has joined the chat`));
    })

    // Listen for chatMessage
    socket.on('chatMessage', (msg) => {
        const user = getUserById(socket.id);
        if (user) {
            io.to(user.room).emit('message', CreateMessage(user.username, msg));
        }

    });

    // Runs when client disconnects
    socket.on('disconnect', () => {
        const user = leaveRoom(socket.id);
        // Update user list
        if (user) {
            io.to(user.room).emit('updateUserList', getUsersByRoom(user.room));
            io.to(user.room).emit('message', CreateMessage(botName, `${user.username} has left the chat`));
        }
    })
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`server is running on port ${PORT}`));