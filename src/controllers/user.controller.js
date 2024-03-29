const express=require("express")
const router=express.Router()
const mongoose=require("mongoose")
const User=require("../models/User.model")


require("dotenv").config()








router.post('/setprofilepic', (req, res) => {
    const { email, profilepic } = req.body;


    // console.log("email: ", email);
    User.findOne({ email: email })
        .then((savedUser) => {
            if (!savedUser) {
                return res.status(422).json({ error: "Invalid Credentials" })
            }
            savedUser.profilepic = profilepic;
            savedUser.save()
                .then(user => {
                    res.json({ message: "Profile picture updated successfully" })
                })
                .catch(err => {
                    console.log(err);
                })
        })
        .catch(err => {
            console.log(err);
        })
})



module.exports=router