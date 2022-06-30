const userModel = require('../models/userModel')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncError = require('./catchAsyncError')
const jwt = require('jsonwebtoken')


exports.isAuthenUser = catchAsyncError(async (req, res, next) => {

    const {token} = req.cookies
    if (!token) {
        return next(new ErrorHandler('please login to access this resource', 401))
    }
    const deCodedData = jwt.verify(token, "CFKGVhFTDMKJgyjfrDtfJHbhgTYG")

    req.user = await userModel.findById(deCodedData.id)

    next()
})

exports.authRoles = (...roles) => {
    return (req, res, next) => {
        
        if (!roles.includes(req.user.role)) 
        {
            return next(new ErrorHandler(`Role : ${req.user.role } is not allowed to access this resource`, 403))
        }
        next()
    }
}
