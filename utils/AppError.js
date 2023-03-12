module.exports = AppError =(statusCode,msg , err )=>{

    const message = msg || err.message
    const completeError = new Error(message)
    
    const error = {
        statusCode,
        message,
        isOperational:true,
        stack: completeError

    }
    return error
}