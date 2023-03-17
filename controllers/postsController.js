const mongoose = require('mongoose');
const Posts = require('../models/postsSchema')
const asyncWrap = require('../utils/catchAsyncErrors')
const AppError = require('../utils/AppError');
const catchAsyncErrors = require('../utils/catchAsyncErrors');

// route for development purpose 
const deleteAllPosts = async ()=>{
    // code to delete all posts
    const [data,err] = await asyncWrap(Posts.deleteMany({}) )
    console.log(data,err);
}

exports.getPosts =  async (req,res)=> {

    // Get all posts
    const [data,err] = await asyncWrap(Posts.find())
    console.log(err);


    if(err) return next(AppError(409,null,err))

    if(data.length > 0) {
        return res.json({
            status:200,
            msg:'Sucess',
            data
        })
    }

    if(data.length === 0) {
        return res.json({
            status:200,
            msg:'Sucess',
            data:'No posts found, please upload some posts 🖼️'
        })
    }
}

exports.uploadPosts = async (req,res,next)=> {
    // console.log(req.file,req.body);

    const post = new Posts({
        imageId:req.file.filename,
        userId:'3edder3r45554trf',
    })

    const [data,err] = await asyncWrap(Posts.create(post))

    // if(err) return res.status(500).json({msg:'Error',err})
    if(err) return next(AppError(500,null,err))
    
    // if no error, return
    return res.status(200).json({msg:'Success',data})
}

exports.liked = async (req,res,next)=>{
    const imageId = `${req.params['imageId'].split(':')[1] + '.jpg'}`
    
    const [post,err] = await asyncWrap(Posts.find({imageId}).exec())
    console.log(post,err);

    res.send('hai')
}

