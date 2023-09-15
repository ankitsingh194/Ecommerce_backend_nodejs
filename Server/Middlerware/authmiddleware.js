const User = require('../Model/UserModel');
const jwt = require('jsonwebtoken');
const asynchandler = require('express-async-handler');


const AuthMiddleware = asynchandler(async(req,res, next)=>{
    let token;
    if(req.headers?.authorization?.startsWith('Bearer')){
        token = req.headers.authorization.split(" ")[1];
        try{

            if(token){
                const decode = jwt.verify(token, process.env.SECRET_KEY);
                const user = await User.findById(decode?.id);
                req.user = user;
                next();
                
                       }

        }catch(error){
            res.send("You are not authorise. Please login again");

        }
    } else{
        res.send("There is no token attached to header");
    }
});

const isAdmin = asynchandler(async(req,res,next)=>{
    const {email}= req.user;
    const adminuser = await User.findOne({email});
    if(adminuser.role !== "admin"){

        res.send("you are not Admin fuck off");
    }else{
        next();
    }

})

module.exports = { AuthMiddleware , isAdmin};