const { getProducts, newProduct, getSingleProduct, updateProduct, deleteProduct, createProductReview, getProductReviews, deleteReview } = require('../controllers/productController')
const { isAuthenticatedUser,authorizeRoles } = require('../middlewares/auth')

const router=require('express').Router()


router.route('/products').get(isAuthenticatedUser,authorizeRoles('admin'),getProducts)
router.route('/product/:id').get(getSingleProduct)
router.route('/admin/products/new').post(isAuthenticatedUser,newProduct)
router.route('/admin/product/:id').put(updateProduct).delete(deleteProduct)
router.route('/review').put(isAuthenticatedUser,createProductReview)
router.route('/reviews').get(isAuthenticatedUser,getProductReviews)
router.route('/reviews').delete(isAuthenticatedUser,deleteReview)



module.exports =router