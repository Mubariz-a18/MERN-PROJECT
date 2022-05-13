const productModel = require('../models/productModel')
const ErrorHandler = require('../utils/errorHandler')
const catchAsyncError = require('../middleWare/catchAsyncError')
const ApiFeatures = require('../utils/apiFeatures')
// create produt --admin
exports.createProduct = catchAsyncError(async (req, res, next) => {
    req.body.user = req.user.id
    const products = await productModel.create(req.body)
    res.status(201).json({success: true, products})
})

//get all products
exports.getAllProduct = catchAsyncError(async (req, res) => {
    const resultPerPage = 5;
    const productCount = await productModel.count()
    const apiFeatures = new ApiFeatures(productModel.find(), req.query).search().filter().pageInation(resultPerPage)
    const products = await apiFeatures.query
    res.status(200).json({success: true, products, productCount})
})
//product detail --admin
exports.getProductDetail = catchAsyncError(async (req, res, next) => {
    const products = await productModel.findById(req.params.id);
    if (! products) {
        next(new ErrorHandler('product not found', 404))
    } else {
        res.status(200).json({sucess: true, products})
    }
})

// updae product--admin

exports.updateProduct = catchAsyncError(async (req, res, next) => {
    let products = await productModel.findById(req.params.id);
    if (! products) {
        next(new ErrorHandler('product not found', 404))
    }
    products = await productModel.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindModify: false
    })
    res.status(200).json({success: true, products})
})

//delete product
exports.deleteProducts = catchAsyncError(async (req, res, next) => {
    const products = await productModel.findById(req.params.id);
    if (! products) {
        next(new ErrorHandler('product not found', 404))
    } else {

        await products.remove();
        res.status(200).json({success: true, message: 'product deleted'})
    }

})

//create product reviews 
exports.createProductReview = catchAsyncError(async (req, res, next) => {
    const {comment, rating, productId} = req.body;
    const review = {
        user: req.user._id,
        name: req.user.name,
        comment: comment,
        rating: Number(rating)
    }
    
    const product = await productModel.findById(productId);
    const isAlreadyReviewed = product.reviews.find(
    (rev) =>rev.user.toString() === req.user._id.toString() 
    ) 
 

    if (isAlreadyReviewed) {
        product.reviews.forEach(rev => {
            if (rev.user.toString() === req.user._id.toString()) 
                (rev.rating = rating),(rev.comment = comment)
            
        })
    } else {
        product.reviews.push(review)
        product.numOfReviewes = product.reviews.length
  
    }

    let average = 0;

    product.reviews.forEach((rev) => {
        average +=rev.rating
    })

    product.ratings = average / product.reviews.length

    await product.save({validateBeforeSave: false})
    res.status(200).json({success: true})
})
//get reviews
exports.getAllReview = catchAsyncError(async (req,res,next)=>{
    const product = await productModel.findById(req.query.id);
    if(!product){
        return next(new ErrorHandler('product not found ',404))
    }
    res.status(200).json({
        success:true,
        reviews: product.reviews
    })
})

//delete reviews
exports.deleteReviews = catchAsyncError( async (req,res,next)=>{
    const product = await productModel.findById(req.query.productId);
    if(!product){
        return next(new ErrorHandler('product not found ',404))
    }

    const reviews = product.reviews.filter(rev => rev._id.toString() !== req.query.id)

    let average = 0;

    reviews.forEach((rev) => {
        average +=rev.rating
    })

    const ratings = average / reviews.length
    const numOfReviewes = reviews.length

    await productModel.findByIdAndUpdate(req.query.productId,{
        reviews,ratings,numOfReviewes
    },{
        new:true,
        runValidators:true,
        useFindAndModify :false
    })

    res.status(200).json({
        success:true,

    })
})