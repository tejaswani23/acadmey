const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const studentS = mongoose.Schema({
    name:String,
    registrationNo : String,
    section: String,
    email:String,
    username:String,
    password:String,
    cpass: String,
    status:{
        type:String,
        default:"Not Updated"
    },
    maths:{
        type:String,
        default:"0"
    },
    science:{
        type:String,
        default:"0"
    },
    english:{
        type:String,
        default:"0"
    },
    evs:{
        type:String,
        default:"0"
    },
    social:{ 
        type:String,
        default:"0"
    },
    tokens:[
        {
            token:{
                type:String
            }
        }
    ]
})



studentS.pre('save',async function(next){
    console.log("hello");
   if(this.isModified('password')){
       this.password= await bcrypt.hash(this.password, 10);
       this.cpass=await bcrypt.hash(this.cpass, 10);
   }
   next();
})

studentS.methods.generateAuthToken = async function(){
    try{
       let token= jwt.sign({_id:this._id},process.env.SECRET_KEY);
       this.tokens= this.tokens.concat({ token: token});
       await this.save();
       return token;
    }catch(err){
        console.log(err);
    }
}

const Student = mongoose.model('Student',studentS);

module.exports = Student;