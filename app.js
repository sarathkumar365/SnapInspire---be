const express = require('express');
const app = express();
const path =require('path')
const cors  = require('cors')
const {upload,storage} = require('./configs/multerConfigs')
const globalErrorController = require('./controllers/errorController')
const AppError = require('./utils/AppError')

// routes 
const postsRoute = require('./routes/postsRoutes')

// SCHEMAS
const Posts = require('./models/postsSchema')

// CORS 
app.use(cors())

 // set STATIC folders
//  console.log(path.join(__dirname, 'public'))
// app.use(express.static(path.join(__dirname, 'public')))

// to make it available like : http://localhost:port/images, then do the folllowing
 app.use('/images',express.static(path.join(__dirname, 'public/images')))

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))

// parse application/json
app.use(express.json())

// ROUTES
app.use('/posts',upload.single('post'), postsRoute)

// UNDEFINED ROUTES
app.all('*',(req, res,next) => {
    const err = AppError(404,'oops, no such route found 🔴', null)
    next(err)
})

// Error Controller
app.use(globalErrorController)


module.exports = app;