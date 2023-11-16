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
        case 'TokenExpiredError':
            return msgForUser = `oops, session expires. Please login again 🕥` 
        case 'MongoServerError':
            return 
        case 'Generic error':
            return msgForUser = errMsg
        case 'MulterError':
            return msgForUser = `something is wrong with posts uploading functionality 🖼️. Please contact your administrator`
        case 'JsonWebTokenError':
            return msgForUser = `oops, please login again`
        default:
            break;
    }

}
const sendProdErrors = (err,res)=> {
    console.log('prodErrors 🚧');
    console.log(err);
    
    if(err.message.startsWith('E11000')) {
        let errorInTheseFields = Object.keys(err.err.keyValue).map(fields => fields)

        Msg = `This ${errorInTheseFields} is already taken`

        const sttusCode = err.message.startsWith('E11000 duplicate key error') ? 409 : 500

        return res.status(sttusCode).json({
            status: 'fail',
            message:Msg || 'Something went wrong, please contact admin 👨‍💼 🕥'
        })
    }


    const errMsg = errMsgGenerator(err.message,err.name)

    res.status(err.statusCode || 500).json({
        status: 'fail',
        message:errMsg || 'Something went wrong, please contact admin 👨‍💼 🕥',
        type: err.name
    })
}



module.exports = globalErrorController = (err,req,res,next) => {
    console.log(err);

    if(process.env.NODE_ENV === 'production') {
        sendProdErrors(err,res);
    } else {
        sendDevErrors(err,res);
    }
}