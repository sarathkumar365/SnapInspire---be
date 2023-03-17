
// generic response method
module.exports =  sendResponse = (res,status,statusCode,data = null) => {
    if(status === 'success')    return res.status(statusCode).json({msg:'Success',data})
    if(status === 'fail')    return res.status(statusCode).json({msg:'Success',data})    
}