const express = require("express");
const router= express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authenticate = require("../middleware/authenticate");
const authenticate1 = require("../middleware/authenticate1");

require("../db/conn");
const Student=require("../model/studentS");
const Teacher=require("../model/teacherS");


router.get("/",(req,res)=>{
    res.send("hello");
})

router.post("/student",async (req,res)=>{

    const {name,registrationNo,section,email,username,password,cpass} = req.body;

    if(!name||!registrationNo||!section||!email||!username||!password||!cpass)
    {
        return res.status(422).json({msg : "enter all the fields"});
    }

    try{

        const userExist = await Student.findOne({username:username})
         
        if(userExist)
        {
            return res.status(422).json({msg: "username already exist"});
        }
        
        const user = new Student({name,registrationNo,section,email,username,password,cpass});
         
        const userRegister = await  user.save();
        console.log(userRegister);

        if(userRegister){
           return  res.status(201).json({msg:"registered"});
        }
        
    }catch(err){
        console.log(err);
    }

    res.json({msg : "registered successfully"});
    console.log(req.body);
})

router.post("/teacher",async (req,res)=>{
    res.json({msg : "registered successfully"});
    console.log(req.body);
    const {name,department,email,username,password,cpass} = req.body;

    if(!name||!department||!email||!username||!password||!cpass)
    {
        return res.status(422).json({msg : "enter all the fields"});
    }

    try{

        const userExist = await Teacher.findOne({username:username})
         
        if(userExist)
        {
            return res.status(422).json({msg: "username already exist"});
        }
        
        const user = new Teacher({name,department,email,username,password,cpass});
         
        const userRegister = await  user.save();
        console.log(userRegister);

        if(userRegister){
           return  res.status(201).json({msg:"registered"});
        }
        
    }catch(err){
        console.log(err);
    }

    res.json({msg : "registered successfully"});
    console.log(req.body);
})

router.post("/Slogin",async (req,res)=>{
    try{
       
      const {username,password} = req.body;

      if(!username || !password)
      {
          return res.status(400).json({error:"please Fill the details"});
      }

      const ulogin = await Student.findOne({username: username});
      
      

      if(ulogin)
      {
        const isMatch = await bcrypt.compare(password,ulogin.password);

        const token = await ulogin.generateAuthToken();
        console.log(token);

        res.cookie("jwtoken", token ,{
            maxAge:900000,
            httpOnly:true
        });

        if(!isMatch)
        {
            res.status(400).json({error: "Invalid Credentials"});
        }else{
            res.json({message:"login successfully"});
        }
         
      }else{
        res.status(400).json({error: "Invalid Credentials"});
      }

    }catch(err){
        console.log(err);
    }
})

router.post("/Tlogin",async (req,res)=>{
    try{
        let token;
      const {username,password} = req.body;

      if(!username || !password)
      {
          return res.status(400).json({error:"please Fill the details"});
      }

      const ulogin = await Teacher.findOne({username: username});
      
      

      if(ulogin)
      {
        const isMatch = await bcrypt.compare(password,ulogin.password);

        token = await ulogin.generateAuthToken();
        console.log(token);

        res.cookie("jwtoken", token ,{
            expires :new Date(Date.now() + 25892000000),
            httpOnly:true
        });

        if(!isMatch)
        {
            res.status(400).json({error: "Invalid Credentials"});
        }else{
            res.json({message:"login successfully"});
        }
         
      }else{
        res.status(400).json({error: "Invalid Credentials"});
      }

    }catch(err){
        console.log(err);
    }
})

router.get("/profile",authenticate,(req,res)=>{
   res.send(req.rootUser);
   console.log(req.rootUser);
})

router.get("/profile1",authenticate1,(req,res)=>{
    res.send(req.rootUser);
    console.log(req.rootUser);
 })

 router.get("/logout",(req,res)=>{
     res.clearCookie('jwtoken',{path:'/'});
     res.status(200).send("User Logout");
 })
 
 router.get("/classmates",async (req,res)=>{
     try{
      const studentsData = await Student.find();
      res.send(studentsData);
     }catch(err){
         console.log(err);
     }
 })

 router.get("/teachers",async (req,res)=>{
    try{
     const studentsData = await Teacher.find();
     res.send(studentsData);
    }catch(err){
        console.log(err);
    }
})

router.get("/sortName/:sec",async (req,res)=>{
    try{
        const sec= req.params.sec;
        const classmates = await Student.find({sec:sec});
        res.send(classmates);

    }catch(err){
        console.log(err);
    }
})


router.get("/teachers/:dept",async (req,res)=>{
    try{
        const dept= req.params.dept;
        const teachers = await Teacher.find({department: dept});
        res.send(teachers);

    }catch(err){
        console.log(err);
    }
})

router.post("/result",async (req,res)=>{
    try {
        const {registrationNo,maths,science,evs,social,english} = req.body;

        const user= await Student.findOneAndUpdate({registrationNo:registrationNo},{
            $set:{
                "status":"Updated",
                "maths":maths,
                "science":science,
                "evs":evs,
                "social":social,
                "english":english
            }
        });
        console.log(user);
        res.send("updated successfully");
    } catch (error) {
        console.log(error);
    }
})

module.exports = router;