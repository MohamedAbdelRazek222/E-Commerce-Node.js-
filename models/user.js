const { default: mongoose } = require("mongoose");
const validator=require("validator");
const bcrypt=require("bcryptjs");
const jwt=require('jsonwebtoken')
const crypto=require('crypto'); //biltIn 

const userSchema=new mongoose.Schema({

name:{
type:String,
required:[true,'please enter your name'],
maxLength:[30,'your name canot exceed 30 chars']

},
email:{
    type:String,
    required:[true,'please enter your email'],
    unique:true,
    validate:[validator.isEmail,'please enter valid email address']

},
password:{
    type:String,
    required:[true,'please enter your password'],
    minlength:[6,'your password must be at least 6 characters'],
    select:false //يعني متخليهوش يرجع اصلا غير لما انا الي ارجعه
},
avatar:{ //{public_id   , url:    }
    public_id:{
    type:String,
    required:true
},
url:{
    type:String,
    required:true
}
},
role:{
    type:String,
    default:'user'
},
createAt:{
    type:Date,
    default:Date.now
},
resetPasswordToken:{

type:String,
default:''

},
resetPasswordExpire:{
    type:Date,
    default:''
}

})
// Encrypting password befotr saving user
userSchema.pre('save',async function(next){

if(!this.isModified('password')){ //يعني ااتغير ولا لا
    next()
}
this.password=await bcrypt.hash(this.password,10)
})

//compare user password 
userSchema.methods.comparePassword=async function(enteredPassword) {
return await bcrypt.compare(enteredPassword,this.password)

}

// return JWT token
userSchema.methods.getJwtToken=function (){ //  بتاعته method دي في ال  fun حطيت ال 
    return jwt.sign({id:this.id},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRES_TIME})
}

//   تاني token تقريبا في حاله لو اتنت عايزه يبعت ال  mail تتبعت في ال  token يعني هنا كانه بيعمل كلمه سر زي ال 
// generate password reset token
userSchema.methods.getResetPasswordToken=function(){ 
// fenerate Token
const resetToken=crypto.randomBytes(20).toString('hex')
// Hash and set to resetPasswordToken
this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex')

// set token expires time
this.resetPasswordExpire=Date.now() + 30 *60 *1000
return resetToken
}


module.exports=mongoose.model('user',userSchema)