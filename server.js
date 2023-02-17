require('dotenv').config({path:'backend/config/config.env'})
const app=require('./app')
// const dotenv=require('dotenv')
const connectDatabase = require('./config/database')
// Handle Uncaught exceptions Server دي يعني لو كتب حاجه ملهاش معني في ال ------
process.on('uncaughtException',err=>{
    console.log(`Error ${err.stack}`);
    // err.stack : دا بيشرح الخطا
    console.log('Shutting down server dur yo uncaught exception')
    process.exit(1)
})

// setting up config file----
// dotenv.config({path:'backend/config/config.env'})


// Connectiong to database-----
connectDatabase()
app.listen(process.env.PORT, () => {
console.log(`Example app listening on port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`)})

// Handle unhandle promise rejections
process.on('unhandledRejection',err=>{


console.log('Error :',`${err.message}`);
console.log('Shutting down the server due to unhandled Promise rejection');
server.close(()=>{

process.exit(1)

})

})
