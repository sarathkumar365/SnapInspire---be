const handleOperationalErrors = (err) =>{
    console.log('handleOperationalErrors');
    console.log(err);
}

const handleUnknownErrors = (err) =>{
    console.log('handleUnknownErrors');
    console.log(err);
}


module.exports = globalErrorController = (err,req,res,next) => {
    // console.log(err);

    if(err.isOperational){
        handleOperationalErrors(err);
    } else {
        handleUnknownErrors(err);
    }
}