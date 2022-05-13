const express = require('express');
const { registerUser, loginUser, logoutUser, updatePassword, getUserDetails, updateUser, getAllUsers, updateUserRole, deleteUser } = require('../controllers/usercontroller');
const { isAuthenUser,authRoles } = require('../middleWare/auth')
const router = express.Router();

router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').get(logoutUser)
router.route('/update/password').put(isAuthenUser,updatePassword)

router.route('/me').get(isAuthenUser,getUserDetails)
router.route('/update/me').put(isAuthenUser,updateUser)



router.route('/admin/users').get(isAuthenUser,authRoles('admin'),getAllUsers)


router.route('/admin/user/:id')
.get(isAuthenUser,authRoles('admin'),getAllUsers)
.put(isAuthenUser,authRoles('admin'),updateUserRole)
.delete(isAuthenUser,authRoles('admin'),deleteUser)





module.exports = router