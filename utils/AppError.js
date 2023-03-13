module.exports = AppError =(statusCode,msg , err )=>{
    // console.log(err);

    const message = msg || err.message
    const errorStack = new Error(message)
    
    const error = {
        statusCode,
        name:err?.name || 'Generic error',
        message,
        isOperational:true,
        errorStack,
        err

    }
    return error
}