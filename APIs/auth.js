const express = require('express');
const router = express.Router();

const jwt = require("../services/jwt");
const bcrypt = require('bcrypt');

const User = require('../Models/User');

router.post('/signup', async (req, res) => {

    const {email, password, name} = req.body;

    const cryptedPassword = await bcrypt.hash(password, 10);

    try{
        const newUser = await User.create({
            email: email,
            name: name,
            password: cryptedPassword
        })     
        
        const token = jwt.generateToken(newUser._id.toString())
        res.status(200).json({token, user: newUser})

    }catch(error){
        res.status(200).json({message: 'something went wrong, please try again', error})
        console.log(error)
    }
})

router.post('/login', async (req, res) => {
    
    const {email, password} = req.body;

    try{
        const user = await User.findOne({email: email})

        if (user){

            const isPasswordMatched = await bcrypt.compare(password, user.password);

            if (isPasswordMatched){
                const token = jwt.generateToken(user._id.toString())
                res.status(200).json({token, user});
            }else{
                res.status(200).json({message: 'Email or Password is incorrect'});
            }
        }else{
            res.status(200).json({message: 'Email or Password is incorrect'});
        }
    }catch(error){
        console.log(error)
    }

})

module.exports = router;