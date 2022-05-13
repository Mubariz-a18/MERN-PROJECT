const orderModel = require('../models/orderModel')
const productModel = require('../models/productModel')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncError = require('../middleWare/catchAsyncError')


// create order


exports.createOrder = catchAsyncError(async (req, res, next) => {
    const {
        shippingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice
    } = req.body

    const order = await orderModel.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt: Date.now(),
        user: req.user._id
    })
    res.status(201).json({success: true, order})
})


// get single order


exports.getSingleOrder = catchAsyncError(async (req, res, next) => {
    const order = await orderModel.findById(req.params.id).populate('user', 'name email')
    if (! order) {
        return next(new ErrorHandler("order not found", 404))
    }
    res.status(200).json({success: true, order})
})


// get orders of logged in user

exports.myOrders = catchAsyncError(async (req, res, next) => {
    const orders = await orderModel.find({user: req.user._id})
    console.log(req.user._id)
    console.log(orders)

    res.status(200).json({success: true, orders})
})


// get all orders with total amount by admin
exports.getAllOrder = catchAsyncError(async (req, res, next) => {
    const orders = await orderModel.find()

    let totalAmount = 0

    orders.forEach((order) => {
        totalAmount += order.totalPrice;
    })

    res.status(200).json({success: true, totalAmount, orders})
})


// update orders  by admin
exports.updateOrder = catchAsyncError(async (req, res, next) => {
    const order = await orderModel.findById(req.params.id)
    if (! order) {
        return next(new ErrorHandler("order not found", 404))
    }

    if (order.orderStatus === 'Delivered') {
        return next(new ErrorHandler('order is already delivered', 400))
    }

    order.orderItems.forEach(async (odr) => {
        await updateStock(odr.product, odr.quantity)
    })

    order.orderStatus = req.body.orderStatus

    if (req.body.orderStatus === 'Delivered') {
        order.deliveredAt = Date.now()

    }

    await order.save({validateBeforeSave:false})
    res.status(200).json({success: true})
})

async function updateStock(id,quantity){
    const product = await productModel.findById(id)
    product.stock -= quantity;
    await product.save({validateBeforeSave:false})
     
}


//delete order -- admin
exports.deleteOrder = catchAsyncError(async (req, res, next) => {
    const order = await orderModel.findById(req.params.id)
    if (! order) {
        return next(new ErrorHandler("order not found", 404))
    }
    order.remove()
    

    res.status(200).json({success: true})
})