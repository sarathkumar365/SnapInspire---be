const mongoose = require('mongoose');
const Posts = require('../models/postsSchema')
const asyncWrap = require('../utils/catchAsyncErrors')
const AppError = require('../utils/AppError')



exports.getPosts =  (req,res)=> {
    console.log('req received');
    res.json({
        status:200,
        msg:'Sucess'
    })
}

exports.uploadPosts = async (req,res,next)=> {

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

