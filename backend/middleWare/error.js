const ErrorHandler = require('../utils/errorHandler')


module.exports = (err,req,res,next)=>{
    err.statusCode = err.statusCode || 500
    err.message = err.message || 'internal server error'


    if(err.name === 'CastError'){
        const message = `resource not found: invalid url ${err.path}`
        err = new ErrorHandler(message,400)
    }

    if(err.code === 11000){
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`
        err = new ErrorHandler(message,400)
    }

    
    if(err.name === 'jsonWebTokenError'){
        const message = `json web token error`
        err = new ErrorHandler(message,400)
    }

    if(err.name === 'tokenExpireError'){
        const message = `json web token expired : try again`
        err = new ErrorHandler(message,400)
    }

    res.status(err.statusCode).json({success:false,message:err.message,error:err.stack})
}