const express = require('express')
const { getAllProduct , createProduct, updateProduct, deleteProducts, getProductDetail, createProductReview, getAllReview, deleteReviews} = require('../controllers/productController')
const { isAuthenUser ,authRoles} = require('../middleWare/auth')


const router = express.Router()

router.route('/products').get(getAllProduct)


router.route('/admin/products/new').post(isAuthenUser,authRoles('admin'),createProduct)

router.route('/admin/products/:id')
.put(isAuthenUser,authRoles('admin'),updateProduct)
.delete(isAuthenUser,authRoles('admin'),deleteProducts)
.get(getProductDetail)

router.route('/review').put(isAuthenUser,createProductReview)


router.route('/reviews').get(getAllReview).delete(isAuthenUser,deleteReviews)


module.exports = router