const userModel = require('../models/userModel')
const productModel = require('../models/productModel')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncError = require('../middleWare/catchAsyncError');
const jwtToken = require('../utils/jwttoken');


exports.registerUser = catchAsyncError(async (req, res, next) => {
    const {name, email, password} = req.body;
    const user = await userModel.create({
        name,
        email,
        password,
        avatar: {
            public_id: 'this is a sample url',
            url: 'thisisSampleUrl'
        }
    })
    jwtToken(user, 201, res)

})


exports.loginUser = catchAsyncError(async (req, res, next) => {
    const {email, password} = req.body;

    if (!email || !password) {
        return next(new ErrorHandler('please Enter email & password', 400));
    }

    const user = await userModel.findOne({email}).select('+password');

    if (! user) {
        return next(new ErrorHandler('invalid email Or password', 401));

    }

    const isPassowrdMAtch = user.comparePassword(password)

    if (! isPassowrdMAtch) {
        return next(new ErrorHandler('invalid email Or password', 401));
    }
    jwtToken(user, 200, res)

})
// logout
exports.logoutUser = catchAsyncError(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({success: true, message: 'succesfully logout'})
})

exports.updatePassword = catchAsyncError(async (req, res, next) => {


    const user = await userModel.findById(req.user.id).select('+password');

    const {currentPassword, newPassword, confirmPassword} = req.body;

    const isPassowrdMAtch = await user.comparePassword(currentPassword)

    if (! isPassowrdMAtch) {
        return next(new ErrorHandler('current password incorrect', 401));
    }


    if (newPassword !== confirmPassword) {
        return next(new ErrorHandler('passwords doesnot match', 400));
    }
    user.password = newPassword;
    await user.save()

    jwtToken(user, 200, res)

})


exports.getUserDetails = catchAsyncError(async (req, res, next) => {
    const user = await userModel.findById(req.user.id)
    console.log(user)
    res.status(200).json({success: true, user})
})


exports.updateUser = catchAsyncError(async (req, res, next) => {
    const updatedData = {
        name: req.body.name,
        email: req.body.email
    }
    const user = await userModel.findByIdAndUpdate(req.user.id, updatedData, {
        runValidators: true,
        useFindAndModify: false,
        new: true
    })

    res.status(200).json({success: true, user})
})


// all users {admin}
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
    const users = await userModel.find()

    res.status(200).json({success: true, users})
})

// get single user {admin}
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
    const user = await userModel.findById(req.params.id)

    if (! user) {
        return next(new ErrorHandler("user not found", 404))
    }


    res.status(200).json({success: true, user})
})


// updating user by admin
exports.updateUserRole = catchAsyncError(async (req, res, next) => {
    const updatedData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }
    const user = await userModel.findByIdAndUpdate(req.params.id, updatedData, {
        runValidators: true,
        useFindAndModify: false,
        new: true
    })

    res.status(200).json({success: true, user})
})

// deleting user by admin
exports.deleteUser = catchAsyncError(async (req, res, next) => {

    const user = await userModel.findById(req.params.id)

    if (! user) {
        return next(new ErrorHandler(`user:${
            req.params.id
        } not found`, 404))
    }

    await user.remove()

    res.status(200).json({success: true, message: "user deleted successfully"})
})


