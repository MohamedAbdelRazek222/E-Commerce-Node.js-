
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const Order=require('../models/order');
const Product=require('../models/product');
const ErrorHandler = require('../utils/errorHandler');


// Create a new order => /api/v1/order/new
exports.newOrder=catchAsyncErrors(async(req,res,next)=>{
    console.log("order")

    const {
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo
    }=req.body
    const order=await Order.create({
        orderItems,
        shippingInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paymentInfo,
        paidAt:Date.now(),
        user:req.user._id
    })
    res.status(200).json({
        success:true,
        order
    })


})

// Get Single order => /api/v1/order/:id -------------------------------

exports.getSingleOrder = catchAsyncErrors(async(req,res,next)=>{

const order=await Order.findById(req.params.id).populate({

path:'user',
select:'name email'

})
if(!order){


    return next(new ErrorHandler('No order found with this Id',404 )) 
}


res.status(200).json({
success:true,
order

})

})

// Get logged in yser orders => /api/v1/order/me الاوردارات الي هو طالباها ---------------------

exports.myOrders = catchAsyncErrors(async(req,res,next)=>{

    const orders=await Order.find({user:req.user.id})

    
    res.status(200).json({
    success:true,
    orders
    
    })
    
    })


// Get all orders => /api/v1/admin/orders الاوردارات الي هو طالباها --------------------

exports.allOrders = catchAsyncErrors(async(req,res,next)=>{

    const orders=await Order.find()


    let totalAmount=0;

    orders.forEach((order)=>{
        console.log({order})
        totalAmount+=order.totalPrice
    })
    
    res.status(200).json({
    success:true,
    totalAmount,
    orders
    
    })
    
    })


// update / process order => /api/v1/admin/order/:id الاوردارات الي هو طالباها --------------------

exports.updateOrder=catchAsyncErrors(async(req, res, next)=>{


const order=await Order.findById(req.params.id)

if(order.orderStatus ==='Delivered'){

    return next(new ErrorHandler('You have already delivered this order',400))
}
order.orderItems.forEach(async (item)=>{

await updateStock(item.product,item.quantity)
})

order.orderStatus=req.body.status,
order.deliverdAt=Date.now()

await order.save()

res.status(200).json({
success:true,


   
})
    });


    async function updateStock(id, quantity) {

const product=await Product.findById(id)

product.stock=product.stock - quantity

await product.save({validateBeforeSave:false})

    }