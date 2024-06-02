const mongoose = require("mongoose")

const userDetails = new mongoose.Schema({
    email: String,
    password : String
})

const logindetails = mongoose.model("logindetails",userDetails)

module.exports = logindetails;