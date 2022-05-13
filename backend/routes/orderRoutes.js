const express = require('express')

const { isAuthenUser,authRoles } = require('../middleWare/auth')
const {createOrder, getSingleOrder, myOrders, getAllOrder, updateOrder, deleteOrder} = require('../controllers/orderController')

const router = express.Router()

router.route('/order/new').post(isAuthenUser,createOrder)

router.route('/orders/me').get(isAuthenUser,myOrders)

router.route('/order/:id').get(isAuthenUser,getSingleOrder)


router.route('/admin/orders').get(isAuthenUser,authRoles('admin'),getAllOrder)
router.route('/admin/order/:id').put(isAuthenUser,authRoles('admin'),updateOrder).delete(isAuthenUser,authRoles('admin'),deleteOrder)

module.exports = router
