const { generateToken } = require("../Configs/jwttoken");
const User=require("../Model/UserModel");
const asynchandler = require('express-async-handler');
const {validateMongoesId} = require('../utils/validateMongoesdbid')
const {generaterefresToken }= require('../Configs/refreshtoken')
const jwt = require('jsonwebtoken');




// Create user
const createUser = async (req, res) => {
    let {email} = req.body;
    const findUser= await User.findOne({email: email});
    if(!findUser) {
        const newUser = await User.create(req.body);
        res.json(newUser);
        
    }else{
        res.json({
            msg: "User Already Exists",
            Success:false,
        });
    }
};

// Login a user
const loginUserCtrl = asynchandler(async (req, res) => {
    let {email, password} = req.body;
    //check if user exists or not 
    const findUser=await User.findOne({email});
    if(findUser && await findUser.isPasswordMatched(password)) {
        const refreshtoken = await generaterefresToken(findUser?.id);
        const updateuser = await  User.findByIdAndUpdate(findUser.id,{
            refreshtoken : refreshtoken,
        },{
            new:true,
        });
        res.cookie(`refreshtoken`, refreshtoken,{
            httpOnly: true,
            maxAge: 72*60*60*100,
        });
        console.log("password is Matched")
        res.send({
            _id: findUser?._id,
            firstname: findUser?.firstname,
            lastname: findUser?.lastname,
            email: findUser?.email,
            mobile: findUser?.mobile,
            token:generateToken(findUser?._id),
        });

    }else{
        console.log("password did not match");
    }
    console.log(email,password);
});

//handle refresh token 

const handleRefreshToken = asynchandler(async(req,res) =>{
     const cookie = req.cookies;
     
     if(!cookie?.refreshtoken){
        res.send("No Refresh Token in Cookies");
     }
     const refreshtoken = cookie.refreshtoken;
     console.log(refreshtoken);
     const user = await User.findOne({refreshtoken});
     console.log("user id "+ user);
     if(!user){
        res.send('No Refresh token present in db');
     }
     jwt.verify(refreshtoken, process.env.SECRET_KEY,(err,decoded)=>{
        console.log(decoded);
        if(err || user.id !== decoded.id){
            res.send("There is somthing wrong with refresh token");
        }
        console.log("user id "+ user.id);
        const accessToken =  generateToken(user?.id);
        res.json({accessToken});
     });
});

// logout functionality 

const logoutUserCntrl= asynchandler(async(req,res)=>{
    const cookie = req.cookies;
    if(!cookie?.refreshtoken){
        res.send("No Refreesh token in Cookies");
    }
    const refreshtoken = cookie.refreshtoken;
    const user = await User.findOne({refreshtoken});
    if(!user){
    
        res.send("No Refresh token present in db");
        res.clearCookie('refreshtoken', {
            httpOnly: true,
            secure: true,
        });
        return res.sendStatus(204); //forbidden
    }
    
    await User.findOneAndUpdate({refreshtoken });
    res.clearCookie('refreshtoken', {
        httpOnly: true,
        secure: true,
    });
    return res.sendStatus(204);
 
})

//update a user 

const updateUser = asynchandler(async(req,res) => {
    const {id} = req.params;
    validateMongoesId(id);
    try{
        const updateUsers = await User.findByIdAndUpdate(
            id,
              {
                firstname: req?.body?.firstname,
                lastname: req?.body?.lastname,
                email: req?.body?.email,
                mobile: req?.body?.mobile,
                

              },
              {
                new: true,
              }
              );
              res.json(updateUsers)



    }catch(err){
        res.send("Error while updateing User");
    }
})

//Get all users
const getallUser= asynchandler(async (req,res) => {
    try {
    const getUser = await User.find();
    let user = res.json(getUser);
    res.send(user);
}catch (error){
    res.send("Error will retrevig user data ")

}
})

//Get a single users 

const getsingleuser = asynchandler(async(req,res) => {
    const {id} = req.params;
    validateMongoesId(id);
    try{
        const SingleUser = await User.findById(id);
        res.json({SingleUser});
        


    }catch(e){
        res.send("Error will fetching user data ")
    }
})

// Delete user
const Deletesingleuser = asynchandler(async(req,res) => {
    const {id} = req.params;
    validateMongoesId(id);
    try{
        const DeleteUser = await User.findByIdAndDelete(id);
        res.json({
            DeleteUser
        });
    
    }catch(e){
        res.send("Error will fetching user data ")
    }
})
//block user
const blockUser = asynchandler(async (req, res) => {
    const {id} = req.params;
    validateMongoesId(id);
    try{
        const blockuser = await User.findByIdAndUpdate(
            id,
            {
                isBlocked:true,
            },
            {
                new:true,
            }
            );
            res.send("User is blocked Sucessfully");         
    }catch(error){
        res.send("Error while updateing ");
    }
});
//unblock user
const UnblockUser = asynchandler(async(req,res) => {
    const {id} = req.params;
    validateMongoesId(id);
    try{
        const unblockuser = await User.findByIdAndUpdate(
            id,
            {
                isBlocked:false,
            },
            {
                new:true,
            }
            );
            res.send("User is unblocked Sucessfully");         
    }catch(error){
        res.send("Error while updateing ");
    }

});

const updatePassword  = asynchandler(async(req,res) =>{
    const { _id } = req.user;
    const {password} = req.body;
    const user = await User.findById(_id);
    if(password){
        user.password = password;
        const updatePassword = await user.save();
        res.json(updatePassword);
    }else{
        res.json(user);
    }

});


module.exports= {createUser, loginUserCtrl, getallUser, getsingleuser, Deletesingleuser, updateUser, blockUser, UnblockUser,handleRefreshToken, logoutUserCntrl, updatePassword};