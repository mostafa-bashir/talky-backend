const {decodeToken} = require("./jwt");
const User = require('../Models/User');

const authorization = async(req,res,next) => {
    try{

        const decodedToken = decodeToken(req.headers["authorization"])
        const user = await User.findById(decodedToken.id);
        if (user){
                req.user = user;
                return next()
        }else{
            res.status(401).json({message:'didnot find it'})
        }
    }catch(err){
        res.status(403).json({message:'unauthorized'})
    }
}

module.exports = authorization