
const Product=require('../models/product')
const ErrorHandler=require('../utils/errorHandler')
const catchAsyncErrors=require('../middlewares/catchAsyncErrors')
const APIFeatures=require('../utils/apiFeatures')
// create new product ==> /admin/api/v1/product/new
//add  newProduct---------------------------------------------------------

exports.newProduct=catchAsyncErrors( async(req,res,next) => {
    req.body.user=req.user.id // login الي عامل  user بتاع ال  id حط فيه ال  ref بتاع ال   user  يعني حد في ال 
const product=await Product.create(req.body)
res.status(201).json({success:true,product})

})
// getProducts--------api/v1/products?keyword=apple-------------------------------------------------

exports.getProducts=catchAsyncErrors(  async(req,res,next)=>{
    const resperpage=4;
    const productCount=await Product.countDocuments()
    const apiFeatures=new APIFeatures(Product.find(),req.query ).search().filter().pagination(resperpage)

    const products=await apiFeatures.query

res.status(200).json({

success:true,
count:products.length,
productCount,
products

})



})
// get single product details -- /api/v1/product/:id-------------------------------------------------------

exports.getSingleProduct=catchAsyncErrors(  async(req,res,next) => {

const product=await Product.findById(req.params.id)
if(!product){
    return next (new ErrorHandler('product not found',404))
}
res.status(200).json({

success:true,
product

})


})
// update product  -- /admin/api/v1/product/:id-------------------------------------------------------


exports.updateProduct= catchAsyncErrors(  async(req,res,next) => {


let product=await Product.findById(req.params.id)

if(!product){ 

    return next (new ErrorHandler('product not found',404))

}

product=await Product.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true,useFindAndModify:true})
res.status(200).json({
    sccuess:true,
    product
})
})
// delete product  -- /api/v1/product/:id-------------------------------------------------------

exports.deleteProduct= catchAsyncErrors(  async(req,res,next) => {

const product=await Product.findById(req.params.id)

if(!product){

    return next (new ErrorHandler('product not found',404))

}
await Product.findByIdAndDelete(req.params.id)
res.status(200).json({
sccuess:true,
message: 'product is deleted'


})
})


// create new review  => /api/v1/review

exports.createProductReview=catchAsyncErrors(async(req,res,next) =>{


const {rating,comment,productId}=req.body

const review={
    user:req.user._id,
    name:req.user.name,
    rating:Number(rating),
    comment
}
const product=await Product.findById(productId)
const isReviewed=product.reviews.find(r=>{
// console.log(req.user._id.toString())
// console.log(r.user.toString())

 return r.user ===  req.user._id

})

if(isReviewed){
product.reviews.forEach(review=>{
if(review.user ===  req.user._id){

    review.comment=comment
    review.rating=rating
}
 
})

}else{
product.reviews.push(review)
product.numOfReviews=product.reviews.length

}
product.ratings=product.reviews.reduce((acc,item)=>item.rating + acc,0)/product.reviews.length
await product.save({validateBeforeSave:false})
res.status(200).json({
    success: true,
})    
})
//get product review  => /api/v1/reviews ------------------------------


exports.getProductReviews=catchAsyncErrors(async(req,res,next)=>{

const product=await Product.findById(req.query.id)


res.status(200).json({
    success: true,
    reviews:product.reviews
})

})

//delete product review  => /api/v1/reviews ------------------------------


exports.deleteReview=catchAsyncErrors(async(req,res,next)=>{

    const product=await Product.findById(req.query.productId)
    
const reviews=product.reviews.filter((review)=>{

    console.log(review._id.toString() !== req.query.id.toString())
    return review._id.toString() !== req.query.id.toString()

})


const numOfReviews=reviews.length

const ratings=product.reviews.reduce((acc,item)=>item.rating +acc,0) /reviews.length

await Product.findByIdAndUpdate(req.query.productId,{
    reviews,
    ratings,
    numOfReviews
},{
    new:true,
    runValidators:true,
    useFindAndModify:false
})
    res.status(200).json({
        success: true,
   
        reviews:product.reviews
    })
    
    })

/*
created : 201
get/sccuess : 200
notFoundTheGet : 404

*/