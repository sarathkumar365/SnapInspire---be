const jwt = require('jsonwebtoken')
const User = require('../models/userSchema')
const AppError = require('../utils/AppError')
const catchAsyncErrors = require('../utils/catchAsyncErrors')
const {sendResponse,checkPassValid,createSendToken} = require('../utils/factoryFunctions');


exports.login = async (req,res,next) => {
    console.log('login');


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

    // successfully logged in
    const data = {
        status: 'success',
        msg:'Logged in successfully',
        userName:ifUserExists[0].name,
        userId:savedPassword[0]._id,
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








// //authController.js



// // Function to create and send jwt token
// const createSendToken = (user, statusCode, res) => {
// const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
// expiresIn: process.env.JWT_EXPIRES_IN,
// })

// // Remove password from output
// user.password = undefined

// sendResponse(res, 'success', statusCode, {
// token,
// user,
// })
// }

// // Function to login user
// exports.login = catchAsyncErrors(async (req, res, next) => {
// const { email, password } = req.body

// // Check if email and password are provided
// if (!email || !password) {
// return next(AppError(400, 'Please provide email and password', null))
// }

// // Check if user exists and password is correct
// const user = await User.findOne({ email }).select('+password')

// if (!user || !(await bcrypt.compare(password, user.password))) {
// return next(AppError(401, 'Incorrect email or password', null))
// }

// // If everything is ok, create and send token
// createSendToken(user, 200, res)
// })

// // Function to logout user
// exports.logout = (req, res) => {
// res.cookie('jwt', 'loggedout', {
// expires: new Date(Date.now() + 10 * 1000),
// httpOnly: true,
// })

// sendResponse(res, 'success', 200, {
// message: 'User logged out successfully',
// })
// }

// // Middleware to protect routes
// exports.protect = catchAsyncErrors(async (req, res, next) => {
// let token

// // Check if token is provided in headers or cookies
// if (
// req.headers.authorization &&
// req.headers.authorization.startsWith('Bearer')
// ) {
// token = req.headers.authorization.split(' ')[1]
// } else if (req.cookies.jwt) {
// token = req.cookies.jwt
// }

// // If token is not provided, return error
// if (!token) {
// return next(
// AppError(401, 'You are not logged in. Please log in to get access', null)
// )
// }

// // Verify token
// const decoded = jwt.verify(token, process.env.JWT_SECRET)

// // Check if user still exists
// const currentUser = await User.findById(decoded.id)
// if (!currentUser) {
// return next(
// AppError(
// 401,
// 'The user belonging to this token does no longer exist',
// null
// )
// )
// }

// // Grant access to protected route
// req.user = currentUser
// next()
// })

