const sendDevErrors= (err,res)=> {
    console.log('sendDevErrors');

    res.status(500).json({
        status: 'fail',
        message:'Developer is fixing it 🧑‍💻',
        err
    })
}

const errMsgGenerator = (errMsg,errName) => {
        
    switch (errName) {
        case 'ValidationError':
            return msgForUser = `The field for ${errMsg.split(':')[1].split(':')[0]} is empty.`
        case 'Generic error':
            return msgForUser = errMsg
        default:
            break;
    }

}
const sendProdErrors = (err,res)=> {
    console.log('prodErrors 🚧');
    const errMsg = errMsgGenerator(err.message,err.name)

    

    res.status(500).json({
        status: 'fail',
        message:errMsg || 'Something went wrong 🕥'
    })
}



module.exports = globalErrorController = (err,req,res,next) => {
    // console.log(err);

    if(process.env.NODE_ENV === 'production') {
        sendProdErrors(err,res);
    } else {
        sendDevErrors(err,res);
    }
}