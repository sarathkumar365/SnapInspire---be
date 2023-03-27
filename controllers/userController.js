const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/userSchema')
const catchAsyncErrors = require('../utils/catchAsyncErrors')
const AppError = require('../utils/AppError');
const {sendResponse} = require('../utils/factoryFunctions');

// delete all users
exports.deleteAllUsers = async (req,res,next)=>{
    // code to delete all posts
    const [data,err] = await catchAsyncErrors(User.deleteMany({}) )

    if(err) return next(AppError(500,'Posts deletion err.', err))

    res.json({msg:'success',data})
}

exports.createUser = async(req,res,next) =>{

    // get all details of the user
    const {name,email,password:userPassword} = req.body

    // genereate the salt
    const [salt,saltErr] = await catchAsyncErrors(bcrypt.genSalt(10))
    if(saltErr) return next(AppError(500,'Salt generation failed 🧂',null))
    
    // eccrypt password
    const [hashedPass,hashedPassErr] = await catchAsyncErrors(bcrypt.hash(userPassword,salt))
    if(hashedPassErr) return next(AppError(500,'password hashing failed ⚔️',null))

    const newUser = {
        name:name,
        email:email,
        password:hashedPass
    }

    // save to DB
    const [data,err] = await catchAsyncErrors(User.create(newUser))

    if(err) return next(AppError(500,null,err))    

    sendResponse(res,'success',200,data)

}

exports.getAllUsers =  async (req,res)=> {

    // Get all posts
    const [data,err] = await catchAsyncErrors(User.find())


    if(err) return next(AppError(409,null,err))

    if(data.length > 0) {
        return res.json({
            status:200,
            msg:'Sucess',
            length:data.length,
            data
        })
    }

    if(data.length === 0) {
        return res.json({
            status:200,
            msg:'Sucess',
            data:'No users found, please create some 🖼️'
        })
    }
}

exports.deleteUser = async (req , res , next) => {
    const userId = req.params.user

    // check if user exists
    const [ifUserExists,err] = await catchAsyncErrors(User.find({userId}))

    if(ifUserExists.length <= 0) return next(AppError(404,'No such user exists 🚸',null))

    const [deleted,deletedErr] = await catchAsyncErrors(User.deleteOne(userId))

    if(deletedErr) return next(AppError(500,null,err))

    sendResponse(res,'success',200,deleted)
}



