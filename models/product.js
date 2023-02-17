const { default: mongoose } = require("mongoose");


const productSchema=new mongoose.Schema({

name:{
    type:String,
    required:[true,'please enter product name'],
    trim:true,
    maxLength:[100,'product name can mot exceed 100 charas']

},
price:{

    type:Number,
    required:[true,'please enter product price'],
    maxLength:[5,'product price can exceed 5 charas'],
default:0.0

},
description:{

type:String,
required:[true,'please enter description'],
maxLength:[1000,'description can exceed 100 char']

},
ratings:{

    type:Number,
    default:0
},
images:[
{    //image_id
public_id:{

type:String,
required:true
},
url:{
type:String

}
}
],
category:{
    type:String,
    required:[true,'please select category for this product'],
    enum:{
        values:[
            'Electronics',
            'cameras',
            'laptops',
            'accessories',
            'Headphones',
            'Food',
            'Books',
            'clothes/shoes',
            'Beauty/Health',
            'Sports',
            'Outdoor',
            'Home'
        ],
        message:'please select correct the category for product '
    }
},
seller:{
    type:String,
    required:[true,'please enter the product seller']

},
stock:{
type:Number,
required:[true,'please enter product stock'],
maxLength:[5,'product name cannot exceed 5 characters'],
default:0

},
numOfReviews:{
    type:Number,
    default:0
},
reviews:[

    {
name:{
    type:String,
    required:true
},rating:{

type:Number,
required:true

},
comment:{
    type:String,
    required:true
}
,
user:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'user',
    required:true
},
    }
],
user:{
    type: mongoose.Schema.Types.ObjectId,
    ref:'user',
    required:true
},
createdAt:{
    type:Date,
    default:Date.now
}


})


module.exports =mongoose.model('Prodcut', productSchema)