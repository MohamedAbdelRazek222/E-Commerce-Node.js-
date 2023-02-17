const catchAsyncErrors = require('../middlewares/catchAsyncErrors')
const User=require('../models/user')
const ErrorHandler = require('../utils/errorHandler')
const sendToken = require('../utils/jwtToken')
const sendEmail = require('../utils/sendEmail')
const crypto = require('crypto')


// Register User   ==> /api/v1/register
exports.registerUser=catchAsyncErrors(async(req,res,next)=>{
const {name,email,password} = req.body
const user=await User.create({
name,
email,
password,
avatar:{
public_id:'rflvh1vicfhdylbrlbnh',
url:'https://res.cloudinary.com/dz2f1rokn/image/upload/v1667886103/rflvh1vicfhdylbrlbnh.jpg'
}

})

sendToken(user,200,res)

})


// Login User   ==> /api/v1/login -------------------------------
exports.login=catchAsyncErrors(async(req,res,next)=>{

const {email,password}=req.body

// checks if email and pass is entered by user
if(!email || !password){
    return next(new ErrorHandler('please enter email & password',400))
}

// Finding user in db
const user=await User.findOne({email}).select('+password')

if(!user){

    return next(new ErrorHandler('Invalid Email or password',401))
}

// Checks if password is correct or not
const isPasswordMatched=await user.comparePassword(password)
if(!isPasswordMatched){

    return next(new ErrorHandler('Invalid Email or password',401))
}
sendToken(user,200,res)



})

// Forgot password =>/api/v1/password/forgot--------------------
exports.forgotPassword = catchAsyncErrors(async(req,res,next)=>{

const user=await User.findOne({email:req.body.email})
if(!user){
 
    return next(new ErrorHandler('User not found with this email',404))
}

// Get reset token
const resetToken=user.getResetPasswordToken()
await user.save({validateBeforeSave:false})

// create reset password url
const resetUrl=`${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`
console.log(resetUrl)
const message=`your password reset token is as follow :\n\n${resetUrl}\n\nIf you have not request this email , then ignore it`
// try{
//     await sendEmail({

//         email:user.email,
//         subject:'ShopIT Password Recovery',
//         message
//     })
//     res.status(200).json({
//         success:true,
//         message:`Email sent to: ${user.email}`
//     })

// }catch(error){
// user.resetPasswordToken =undefined
// user.resetPasswordExpire=undefined

// await user.save({validateBeforeSave:false})
// return next(new ErrorHandler(error.message,500))
// }

})

// reset password =>/api/v1/password/reset/:token--------------------
exports.resetPassword = catchAsyncErrors(async(req,res,next)=>{

// Hash URL Token
const resetPasswordToken=crypto.createHash('sha256').update(req.params.token).digest('hex')
const user=await User.findOne({
    resetPasswordToken,
    resetPasswordExpire:{$gt:Date.now()}
})
console.log({resetPasswordToken})
if(!user){
    return next(new ErrorHandler('password reset is invalid or has been expired',400))
}
if(req.body.password !==req.body.confirmPassword){
    return next(new ErrorHandler('password doesnot match'))
}

// setUp new password
user.password=req.body.password
user.resetPasswordToken =undefined
user.resetPasswordExpire=undefined
await user.save()
sendToken(user,200,res)
})

// Get Currently logged in user detail => /api/v1/me

exports.getUserProfile=catchAsyncErrors(async(req,res,next)=>{

const user=await User.findById(req.user.id)
res.status(200).json({success:true,user})

})
// update / changePassword  => api/v1/password/update

exports.updatePassword=catchAsyncErrors(async(req,res,next)=>{

const user=await User.findById(req.user.id).select('+password')

// check previous user password
const isMatched=await user.comparePassword(req.body.oldPassword)
if(!isMatched){

    return next(new ErrorHandler('old password is in correct'),400)
}
user.password=req.body.password
await user.save()
sendToken(user,200,res)

})
//  update user profile => /api/v1/me/update--------------------


exports.updateUserProfile=catchAsyncErrors(async(req,res,next)=>{

const newUserData={
    name:req.body.name,
    email:req.body.email
}

// update avatar:TODO
const user=await User.findByIdAndUpdate(req.user.id,newUserData,{
new :true,
runValidators:true,
useFindAndModify:false    
})
    
res.status(200).json({
    screen:true,
    user

})
})



// Logout User   ==> /api/v1/Logout -------------------------------

exports.Logout=catchAsyncErrors(async(req,res,next)=>{

res.cookie('token',null,{expires:new Date(Date.now()) ,httpOnly:true })
res.status(200).json({success:true,message:'logged out'})

})

//Admin Routers--------------------------------------

// Get All Users =>/api/v1/admin/users---------------------

exports.GetAllUsers=catchAsyncErrors(async(req,res,next)=>{

const users=await User.find()

res.status(200).json({
    success:true,
    users

})
})

// Get All Users =>/api/v1/admin/users------------------------

exports.getUserDetails=catchAsyncErrors(async(req,res,next)=>{

const user=await User.findById(req.params.id)

if(!user){
    return next(new ErrorHandler(`user does not found with id: ${req.params.id}`))
}

res.status(200).json({
    success:true,
    user

})
})

//  update user profile => /api/v1/admin/user/:id--------------------


exports.updateUser=catchAsyncErrors(async(req,res,next)=>{

    const newUserData={
        name:req.body.name,
        email:req.body.email,
        role:req.body.role
    }
// console.log(typeof parseInt(req.params.id))
    // update avatar:TODO
    const user=await User.findByIdAndUpdate(req.user.id,newUserData,{
        new :true,
        runValidators:true,
        useFindAndModify:false    
        })

    res.status(200).json({
        success:true,
        user
    
    })
    })


    
//  delete user profile => /api/v1/admin/user/:id--------------------


exports.deletUser=catchAsyncErrors(async(req,res,next)=>{



    const user=await User.findById(req.user.id)

    if(!user){
        return next(new ErrorHandler(`user does not found with id:${req.params.id}`))
    }

// remove avatar from cloudinry

    await user.remove()
    res.status(200).json({
        success:true,
      
    
    })
    })


    