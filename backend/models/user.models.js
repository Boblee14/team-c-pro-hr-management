const mongoose = require("mongoose")

const userDetails = new mongoose.Schema({
    username : String,
    password : String,
})

const logindetails = mongoose.model("logindetails",userDetails)

module.exports = logindetails;