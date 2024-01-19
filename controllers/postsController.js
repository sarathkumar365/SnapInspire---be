const mongoose = require('mongoose');
const sizeOf = require('image-size')
const path = require('path')

const Posts = require('../models/postsSchema')
const User = require('../models/userSchema')

const asyncWrap = require('../utils/catchAsyncErrors')
const AppError = require('../utils/AppError');
const sendResponse = require('../utils/factoryFunctions');
const catchAsyncErrors = require('../utils/catchAsyncErrors');

const findPortrait0rNot = (imageId)=>{
    const dimensions = sizeOf(path.join(__dirname, `../public/images/${imageId}`))

    // image is landscape
    if(dimensions.width > dimensions.height) return false

    // image is portrait
    return true 
}


// route for development purpose 
exports.deleteAllPosts = async (req,res,next)=>{
    // code to delete all posts
    const [data,err] = await asyncWrap(Posts.deleteMany({}) )

    if(err) return next(AppError(500,'Posts deletion err.', err))

    res.json({msg:'success',data})
}


exports.getAllPosts =  async (req,res)=> {

    // Get all posts
    const [data,err] = await asyncWrap(Posts.find())


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
            data:'No posts found, please upload some posts 🖼️'
        })
    }
}

exports.uploadPosts = async (req,res,next) => {    
    const post = new Posts({
        imageId:req.file.filename,
        userId:req.currentUser._id,
    })

    const [data,err] = await asyncWrap(Posts.create(post))

    // if(err) return res.status(500).json({msg:'Error',err})
    if(err) return next(AppError(500,null,err))

    // find portrait or not 
    const isPortrait = findPortrait0rNot(data.imageId)

    // update the corresponding images portrait field
    const filter = {_id:data._id}
    const update = { portrait : isPortrait }
    const [portraitUpdated,portraitUpdatedErr] = await asyncWrap(Posts.findOneAndUpdate(filter,update,{returnOriginal:false}))

    if(portraitUpdatedErr) return next(AppError(500,null,portraitUpdatedErr))

    const d = {
        portraitUpdated,
        data
    }

    // if no error, return
    return res.status(200).json({msg:'Success',d})
}

checkApplauded = async (userId,postId) => {
    // const userId =  req.params['userId']
    // const postId =  req.params['postId']

    // 1. check if current user has already applauded the current post

    // const [addUserApplaud,addUserApplaudErr] = await asyncWrap(User.updateOne({_id:userId},{$push:{myApplauds:postId}}))

    const [applaudedOrNot,applaudedOrNotErr] = await asyncWrap(User.findOne({_id:userId}).select('-password').select('-refreshTokens'))

    // console.log(applaudedOrNot.myApplauds);

    const allApplauds = applaudedOrNot.myApplauds
    
    //check if the post is already applauded by the user
    if(allApplauds.includes(postId))  {
        // return res.status(200).json({
        //     'applauded':true
        // })

        return true
    } else {
        // else return not applauded status
        // return res.status(404).json({
        //     'applauded':false
        // })

        return false
    }
    
    // if(!allApplauds.includes(postId)) return next(AppError(404,"The user has not liked this post yet",null))

}

const removeApplaud = async (userId,postId) => {

      const filter = { _id: userId }
      const update = { $pull: { myApplauds: postId } }
      const [removeApplaud,removeApplaudErr] = await asyncWrap(User.findOneAndUpdate(filter,update,{returnOriginal:false}))
  
      if(removeApplaud) {
        console.log('applauds removed from user array');
        console.log(removeApplaud);

        return 1;
      }
      else {
        console.log(removeApplaudErr);
        return 0;
      }



}


exports.applaud = async (req,res,next) => {
    console.log('API call for applauding a post ');

    const postId = req.params['postId']
    const incORdec = Number(req.params['incORdec'])
    // const incORdec = 1

    //     // check if current user has already applauded for this post

    if (await checkApplauded(req.currentUser,postId)){
        // 1. remove the current post from user myApplauds array
        if(removeApplaud(req.currentUser._id,postId)) {
            return res.status(200).json({
                applaudsRemoved:true,
                applaudsRemovedBy:req.currentUser.name,
                updatedApplaudsArr: await asyncWrap(User.findById({_id:req.currentUser._id})).myApplauds
            })  
        }   else {
            return next(AppError(500,'Something went wrong in removing ypur applauds',null))
        }

        
    } else {

           
    // 1. add the applauded post to current users myApplauds array

    const [addUserApplaud,addUserApplaudErr] = await asyncWrap(User.updateOne({_id:req.currentUser._id},{$push:{myApplauds:postId}}))
    // if(addUserApplaud) return res.status(200).json({
    //     message:'post applauded ㊗️'
    // })

    if(addUserApplaudErr) return next(AppError(400,'failed adding post to current user myApplauds',null))

    // 2. add +1 to total applauds count for the current post
    
    // filter out invalid params. Only accept 1 or 0
    if(!(incORdec === 1 || incORdec === 0))  return next(AppError(500,"Invalid params passed for applauds",null))    
    
    // get the current applauds count
    const [currentApplaudsCount,err] = await asyncWrap(Posts.findById(postId).select('applaud'))
    
    // return if currentApplaudsCount = 0 && incORdec = 0
    // this ensures that applauds cannot go sub zero
    if(currentApplaudsCount.applaud === 0 && incORdec === 0 ) {

        return res.status(200).json ({
            message:'applauds cannot go below zero 👎'
        })
            
        }
    
        // update the applaud field
    const filter = {_id:postId}
    const update = { applaud : incORdec === 1? currentApplaudsCount.applaud + 1 : currentApplaudsCount.applaud - 1}
    const [post,posterr] = await asyncWrap(Posts.findOneAndUpdate(filter,update,{returnOriginal:false}))

    // err for getting currentApplaudsCount 
    if(err) return next(AppError(500,null,err))

    // err for updating document
    if(posterr) return next(AppError(500,null,err))
    


    //  if everything went well,return alreadyApplauded:true

    return res.status(200).json({
        message:'post applaudedd ㊗️',
        updatedApplaudsArr : addUserApplaud.myApplauds
    }) 
    
}

}


// exports.applaud = async (req,res,next) => {
//     console.log('cookies are');
//     // console.log(req.currentUser);
    
    // const postId = req.params['postId']
    // const incORdec = Number(req.params['incORdec'])

//     // check if current user has already applauded for this post
    
//     if(await checkApplauded(req.currentUser._id,postId)) return res.status(200).json({
//         message:'User already applauded for this post',
//         alreadyApplauded:true
//     }) 

//     // 1. add +1 to total applauds count for the current post
    
//     // filter out invalid params. Only accept 1 or 0
//     if(!(incORdec === 1 || incORdec === 0))  return next(AppError(500,"Invalid params passed for applauds",null))    
    
//     // get the current applauds count
//     const [currentApplaudsCount,err] = await asyncWrap(Posts.findById(postId).select('applaud'))
    
//     // return if currentApplaudsCount = 0 && incORdec = 0
//     // this ensures that applauds cannot go sub zero
//     if(currentApplaudsCount.applaud === 0 && incORdec === 0 ) {
//             sendResponse(res,'success',200, {
//                 data:{
//                     message:'applauds cannot go below zero 👎'
//                 }
//             })
//             return
//         }
    
//         // update the applaud field
//     const filter = {_id:postId}
//     const update = { applaud : incORdec === 1? currentApplaudsCount.applaud + 1 : currentApplaudsCount.applaud - 1}
//     const [post,posterr] = await asyncWrap(Posts.findOneAndUpdate(filter,update,{returnOriginal:false}))

//     // err for getting currentApplaudsCount 
//     if(err) return next(AppError(500,null,err))

//     // err for updating document
//     if(posterr) return next(AppError(500,null,err))
    
//     // if(post) return sendResponse(res,'success',200,post)
//     // if(post) res.status(200).json({
//     //     msg:'success',
//     //     data:post
//     // })
    
//     // 2. add the applauded post to current users myApplauds array
//     const [addUserApplaud,addUserApplaudErr] = await asyncWrap(User.updateOne({_id:req.currentUser._id},{$push:{myApplauds:postId}}))

//     if(addUserApplaud) res.status(200).json({
//         message:'post applauded ㊗️'
//     })

//     if(addUserApplaudErr) return next(AppError(400,'failed adding post to current user myApplauds',null))


// }

