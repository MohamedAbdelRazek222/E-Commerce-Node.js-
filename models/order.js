const { default: mongoose } = require("mongoose");


const orderSchema=new mongoose.Schema({

    shippingInfo:{
        address:{
            type:String,
            required:true
        },
        
        city:{
            type:String,
            required:true
        },
        phoneNo:{
            type:String,
            required:true
        },
        postalCode:{
            type:String,
            required:true
        },
        country:{
            type:String,
            required:true
        }

    },
    user:{

        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'user'
    },
    //  عشان هيدخلها حجات كتير محتاج اخزن كل واحده في سطر Arr هنا 
    orderItems:[ 
        {
   name:{
    type:String,
    required:true
   },
   quantity:{ //الكميه
    type:Number,
    required:true
   },
   image:{
    type:String,
    required:true
   },
   price:{
    type:Number,
    require:true
   },
   product:{

    type:mongoose.Schema.Types.ObjectId,
    required:true,
    ref:'product'
}
       }
],
paymentInfo:{
    id:{
        type:String,

    },
    status:{
       type:String
    },
},
    paidAt:{
type:Date
    },
    itemsPrice:{
        type:Number,
        required:true,
        default:0.0
    },
    taxPrice:{
        type:Number,
        required:true,
        default:0.0
    },
    shippingPrice:{
        type:Number,
        required:true,
        default:0.0
    },
    totalPrice:{
        type:Number,
        required:true,
        default:0.0
    },
    orderStatus:{
        type:String,
        required:true,
        default:'processing'
    },
    deliverdAt:{
        type:Date
    },
    createAt:{
        type:Date,
        default:Date.now
    }



})

module.exports=mongoose.model('order',orderSchema)