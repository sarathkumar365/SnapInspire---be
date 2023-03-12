const mongoose = require('mongoose');
const {Schema} = mongoose

const postsSchema = Schema({
    imageId:{
        type:String,
        required:true
    },
    userId:{
        type:String,
        required:true
    },
    uploadDate:{
        type:Date,
        default:Date.now
    },
    likes:{
        type:Number,
        default:0
    }
})

const Posts = mongoose.model('Post',postsSchema)

module.exports = Posts