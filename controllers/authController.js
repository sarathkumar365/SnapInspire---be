const jwt = require('jsonwebtoken')
const User = require('../models/userSchema')
const AppError = require('../utils/AppError')
const catchAsyncErrors = require('../utils/catchAsyncErrors')
const {sendResponse,checkPassValid,createSendToken} = require('../utils/factoryFunctions');


exports.login = async (req,res,next) => {
    
    console.log('LOGIN ✅ 🏁');


    // check if user and pass field exists
    if(!req.body.email || !req.body.password) 
        return next(AppError(404,'Please provide a valid email and password',null)) 

    const {email,password} = req.body

    // check if such user exists
    const [ifUserExists,ifUserExistsErr] = await catchAsyncErrors(User.find({email}))
    
    if(ifUserExists.length <= 0) 
    return next(AppError(404,'No user found for this email address, please check your email address 🔴',null)) 
    
    const userId = ifUserExists[0]._id
    
    // verify if the password is correct
    // get password from DB
    const [savedPassword,passwordErr ]= await catchAsyncErrors(User.find({email})
            .select('password'))

    const isValid = await checkPassValid(password,savedPassword[0].password)

    

    // invalid password
    if(!isValid) return next(AppError(401,'Invalid password 🚧',null))

    // create token and send to user
    const [token,refreshToken] = await createSendToken(savedPassword[0]._id)
    // console.log(ifUserExists);
    // successfully logged in
    const data = {
        status: 'success',
        msg:'Logged in successfully ✅ 🏁',
        userName:ifUserExists[0].name,
        userId:savedPassword[0]._id,
        myApplauds:ifUserExists[0].myApplauds,
        token,
    }
    // sendResponse(res,'success',200,data)
    // res.cookie('refreshToken', refreshToken, { httpOnly: true, maxAge: 5  * 60  * 1000 }).json(data); // 5 mins 
    res.cookie('jwt', refreshToken, 
    { maxAge: 5  * 60  * 1000, httpOnly: true }).json(data) // 5 mins 
    // res.json(data);

   

}

// generate token

exports.refresh = async (req, res,next) => {
    // console.log(req.headers.cookie);
    let cookieVal 
    req.headers.cookie ? cookieVal = req.headers.cookie.split('=')[1] : cookieVal = 'none'


    if(cookieVal === 'none') return next(AppError(401,'login again 🚧',500));
    
    isRefreshVerified = jwt.verify(cookieVal,process.env.JWT_SECRET_REFRESH)
    currentUserId = isRefreshVerified.userId

    // const refreshToken =  jwt.sign(currentUserId,process.env.JWT_SECRET)
    const newAccessToken =  jwt.sign(currentUserId,process.env.JWT_SECRET)



res.json({
    newAccessToken
})
}





