const mongoose=require("mongoose")
const saltRounds=10;
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    


})


module.exports=mongoose.model("user",userSchema)