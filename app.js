const express = require('express');
const app = express();
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

 
// parse application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }))

// parse application/json
app.use(express.json())

// ROUTES
app.use('/posts',upload.single('image'), postsRoute)

// UNDEFINED ROUTES
app.all('*',(req, res,next) => {
    const err = AppError(404,'oops, no such route found 🔴', null)
    next(err)
})

// Error Controller
app.use(globalErrorController)


module.exports = app;