const port = 8000;
const express = require('express');
const app = express();
const cors = require('cors');
app.use(cors({origin: '*'}));

const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/talky');

const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app); // Create an HTTP server using 'app'
const io = socketIo(server); // Attach Socket.io to the HTTP server

app.locals.io = io;

io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('active', (socket) =>{
        console.log(socket.myId, 'activee')
    })

    // Example: Emit a message to the connected client
    socket.emit('message', 'Welcome to the chat!');
});



const authRoutes = require('./APIs/auth');
app.use("/auth", authRoutes);

const chatRoutes = require('./APIs/chat');
app.use("/chat", chatRoutes);

const messageRoutes = require('./APIs/message');
app.use("/message", messageRoutes);

server.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
