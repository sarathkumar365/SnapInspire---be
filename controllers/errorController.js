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
        default:
            break;
    }

}
const sendProdErrors = (err,res)=> {
    console.log('prodErrors 🚧',err);
    
    if(err.message.startsWith('E11000')) {
        let errorInTheseFields = Object.keys(err.err.keyValue).map(fields => fields)

        Msg = `Duplicate values found for ${errorInTheseFields} 2️⃣`

        return res.status(500).json({
            status: 'fail',
            message:Msg || 'Something went wrong, please contact admin 👨‍💼 🕥'
        })
    }


    const errMsg = errMsgGenerator(err.message,err.name)

    res.status(500).json({
        status: 'fail',
        message:errMsg || 'Something went wrong, please contact admin 👨‍💼 🕥',
        type: err.name
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