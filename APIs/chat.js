const express = require('express');
const router = express.Router();

const authorization = require('../services/authorization');

const User = require('../Models/User');
const Chat = require('../Models/Chat');
const Message = require('../Models/Message');

const mongoose = require('mongoose');

router.get('/getusers', authorization, async (req, res) =>{
    try{
        const users = await User.find({$and: [
            {_id: {$ne: new mongoose.Types.ObjectId(req.user.id)}},
            // {$nin: await Chat.distinct('participants', { participants: new mongoose.Types.ObjectId(req.user.id) })}
        ]}).select('name');

        res.status(200).json({users})
    }catch(error){
        res.status(200).json({message: 'something went wrong, please try again', error})
    }
});

router.post('/createchat', authorization, async (req, res) => {
    try {
      const { usersId } = req.body;
      const usersMongooseIds = usersId.map((id) => new mongoose.Types.ObjectId(id));
  
      // Check if a chat with the specified users already exists
      const isChatExist = await Chat.findOne({
        messagers: { $all: [new mongoose.Types.ObjectId(req.user.id), ...usersMongooseIds] },
      });
  
      if (isChatExist) {
        const nonMatchingMessager = isChatExist.messagers.find((messager) => !messager.equals(req.user.id));
  
        if (nonMatchingMessager) {
          // Fetch the user information by ID
          const user = await User.findById(nonMatchingMessager);
  
          if (user) {
            // Return an object with _id, messager, and user name
            const chatInfo = {
              chatId: isChatExist._id, // Use isChatExist._id
              messagerId: nonMatchingMessager,
              messagerName: user.name,
            };
  
            res.status(200).json({ message: 'Chat already exists', chat: chatInfo });
          } else {
            // Handle the case where the user is not found
            res.status(404).json({ message: 'User not found' });
          }
        }
      } else {
        // Create a new chat if it doesn't exist
        const newChat = await Chat.create({
          messagers: [new mongoose.Types.ObjectId(req.user.id), ...usersMongooseIds],
        });
  
        // Fetch the user information for the non-matching messager
        const nonMatchingMessager = newChat.messagers.find((messager) => !messager.equals(req.user.id));
        const user = await User.findById(nonMatchingMessager);
  
        if (user) {
          // Return chat information in the response
          const chatInfo = {
            chatId: newChat._id, // Use newChat._id
            messagerId: nonMatchingMessager,
            messagerName: user.name,
          };
  
          res.status(200).json({ message: 'New Chat has been created', chat: chatInfo });
        } else {
          // Handle the case where the user for the new chat is not found
          res.status(404).json({ message: 'User not found' });
        }
      }
    } catch (error) {
      res.status(500).json({ message: 'Something went wrong, please try again', error });
    }
  });
  


router.get('/getchats', authorization, async(req, res) =>{

    try{

        const chats = await Chat.find({ messagers: { $elemMatch: { $eq: new mongoose.Types.ObjectId(req.user.id) } } });

        // Map the original array to create a new array of objects
        const chatsInfo = await Promise.all(
        chats.map(async (originalObject) => {
            const nonMatchingMessager = originalObject.messagers.find((messager) => !messager._id.equals(req.user.id));

            if (nonMatchingMessager) {
            // Fetch the user information by ID
            const user = await User.findById(nonMatchingMessager);

            // Return an object with _id, messager, and user name
            return {
                chatId: originalObject._id,
                messagerId: nonMatchingMessager,
                messagerName: user ? user.name : 'Unknown', // Handle cases where the user is not found
            };
            } else {
            return null; // No non-matching messager found
            }
        })
        );



        res.status(200).json({chats:chatsInfo, myId: req.user.id})
    }catch(error){
        res.status(200).json({message: 'something went wrong, please try again', error});
    }
})

router.get('/getchat', authorization, async (req, res) => {
    
    try{
        console.log(req.query)
        const messages = await Message.find({$and:[
            {senderId: new mongoose.Types.ObjectId(req.user.id)},
            {chatId: new mongoose.Types.ObjectId(req.query.chatId)}
        
    ]})
        res.status(200).json({messages})
    }catch(error){
        res.status(200).json({message: 'something went wrong, please try again', error});
    }
})


module.exports = router;