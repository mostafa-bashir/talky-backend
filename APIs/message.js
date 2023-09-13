const express = require('express');
const router = express.Router();

const authorization = require('../services/authorization');

const Message = require('../Models/Message');

const mongoose = require('mongoose');

var http = require('http');
const server = http.createServer(express);
var io = require('socket.io')(server);

router.post('/sendmessage', authorization, async (req, res) => {

    try{


        

        const {chatId, message} = req.body;

        const io = req.app.locals.io;

;
        console.log(chatId)

        const newMessage = await Message.create({
            senderId: new mongoose.Types.ObjectId(req.user.id),
            chatId: new mongoose.Types.ObjectId(chatId),
            message: message,
            time: new Date()
        })

        io.emit(`chat-${chatId}`, newMessage);


        res.status(200).json({message: newMessage})
    }catch(error){
        res.status(200).json({message: 'something went wrong, please try again', error})
    }
});

module.exports = router;