
const mongoose= require("mongoose")
require('dotenv').config()

mongoose.connect(process.env.DB_URL)
.then(()=>{
    console.log("Connected to database")
}).catch(err=>{
    console.log("Error connecting to db "+err)
})