const ErrorHandler=require('../utils/errorHandler')


module.exports =(err,req,res,next)=> {
    
err.statusCode=err.statusCode ||500
if(process.env.NODE_ENV === 'DEVELOPMENT'){
    res.status(err.statusCode).json({

        success:false,
        errorMessage:err.message,
        stack:err.stack

    })
}
if(process.env.NODE_ENV === 'PRODUCTION'){

    let error={...err}
    error.message=err.message

    // Wrong Mongoose object id Error------
    if(err.name ==="CastError"){ // parameter دا لو في مشكله في ال  
        const message=`Resource not found .Invalid : ${err.path}`
        error=new ErrorHandler(message,400)
    }
    // Handling Mongoose validation error---
    if(err.name === 'validationError'){
        const message=object.values(err.errors).map(value => value.message)
        error=new ErrorHandler(message,400)
    }

// Handling mongoose duplicate key errors
if(err.code ===11000){
   
    const message=`Duplicate ${Object.keys(err.keyValue)} entered`
    error=new ErrorHandler(message,400)

}

// Handling wrong jwt error
if(err.name === 'jsonWebTokenError'){
    const message='Json Web Token is  invalid .Try Again'
    error=new ErrorHandler(message,400)
}

// Handling Expired JWT  error
if(err.name === 'TokenExpiredError'){
    const message='Json Web Token is  Expired .Try Again'
    error=new ErrorHandler(message,400)
}


    res.status(error.statusCode).json({
    
    success:false,
    message:error.message || 'Internal Server Error'
    
    })
}
};
