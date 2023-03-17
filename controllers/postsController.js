const mongoose = require('mongoose');
const Posts = require('../models/postsSchema')
const asyncWrap = require('../utils/catchAsyncErrors')
const AppError = require('../utils/AppError');
const sendResponse = require('../utils/factoryFunctions');

// route for development purpose 
const deleteAllPosts = async ()=>{
    // code to delete all posts
    const [data,err] = await asyncWrap(Posts.deleteMany({}) )
    console.log(data,err);
}

exports.getAllPosts =  async (req,res)=> {

    // Get all posts
    const [data,err] = await asyncWrap(Posts.find())


    if(err) return next(AppError(409,null,err))

    if(data.length > 0) {
        return res.json({
            status:200,
            msg:'Sucess',
            count:data.length,
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

exports.applaud = async (req,res,next)=>{
    
    const id = req.params['id']
    const incORdec = Number(req.params['incORdec'])

    // filter out invalid params. Only accept 1 or 0
    if(!(incORdec === 1 || incORdec === 0))  return next(AppError(500,"Invalid params passed for applauds",null))    

    // get the current applauds count
    const [currentApplaudsCount,err] = await asyncWrap(Posts.findById(id).select('applaud'))

    // return if currentApplaudsCount = 0 && incORdec = 0
    // this ensures that applauds cannot go sub zero
    if(currentApplaudsCount.applaud === 0 && incORdec === 0 ) {
            sendResponse(res,'success',200, {
                data:{
                    message:'applauds cannot go below zero 👎'
                }
            })
            return
        }
    
    // update the applaud field
    const filter = {_id:id}
    const update = { applaud : incORdec === 1? currentApplaudsCount.applaud + 1 : currentApplaudsCount.applaud - 1}
    const [post,posterr] = await asyncWrap(Posts.findOneAndUpdate(filter,update,{returnOriginal:false}))

    // err for getting currentApplaudsCount 
    if(err) return next(AppError(500,null,err))

    // err for updating document
    if(posterr) return next(AppError(500,null,err))
    
    if(post) return sendResponse(res,'success',200,post)
}

