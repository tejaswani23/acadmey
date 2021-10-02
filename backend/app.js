const express = require("express");
const app= express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

// app.use(cors());

app.use(express.json());
app.use(cookieParser());
app.use(require("./router/auth"));

app.get("/about",(req,res)=>{
    res.cookie("Test","thapa");
    res.send("hello");
})
dotenv.config({path:"./config.env"});
const db= process.env.DATABASE;



app.listen(5000,()=>{
    console.log("server is connected");
})