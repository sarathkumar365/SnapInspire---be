const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
    type: String,
    required: [true, 'Please provide a name'],
    },
    email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    },
    password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    },
    joined: {
    type: Date,
    default: Date.now,
    },
    refreshTokens: {
        type: Array,
    },
    myApplauds: {
        type:Array,
    },
});
    
    const User = mongoose.model('User', userSchema);
    
    module.exports = User;
