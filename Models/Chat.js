const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
    messagers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
})

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
