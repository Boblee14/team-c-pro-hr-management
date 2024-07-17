const express = require('express')
const mongoose = require('mongoose')
const app= express()
const bodyParser = require("body-parser")
const userRouter = require('./routers/user.routers')
const cors=require("cors")
require('dotenv').config();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors())

app.get("/",(req,res)=>{
    res.send("Hello asdgfjdgfdhi")
})
app.use("/api",userRouter)

mongoose.connect(process.env.MONGO_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(()=>console.log("Database connected successfully"))
.catch((err)=>console.log(err)) 

app.listen(process.env.PORT,()=>{
    console.log("Server is running on port no 5001")
})
