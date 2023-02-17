const { registerUser,
    login,
    Logout, 
    forgotPassword,
    resetPassword,
    getUserProfile,
    updatePassword,
    updateUserProfile, 
    GetAllUsers,
    getUserDetails,
    updateUser,
    deletUser
        } = require('../controllers/authController')
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth')

const router=require('express').Router()



router.route('/register').post(registerUser)
router.route('/login').post(login)
router.route('/password/forgot').post(forgotPassword)
router.route('/password/reset/:token').put(resetPassword)
router.route('/Logout').get(Logout)
router.route('/getUserProfile').get(isAuthenticatedUser,getUserProfile)
router.route('/password/update').put(isAuthenticatedUser,updatePassword)
router.route('/me/update').put(isAuthenticatedUser,updateUserProfile)

// Admin Routes-----------------
router.route('/admin/users').get(isAuthenticatedUser,authorizeRoles('admin'),GetAllUsers)
router.route('/admin/user/:id')
.get(isAuthenticatedUser,authorizeRoles('admin'),getUserDetails)
.put(isAuthenticatedUser,authorizeRoles('admin'),updateUser)
.delete(isAuthenticatedUser,authorizeRoles('admin'),deletUser)

module.exports = router;
