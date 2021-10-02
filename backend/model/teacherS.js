const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt= require("jsonwebtoken");

const teacherS = mongoose.Schema({
    name:String,
    department : String,
    email:String,
    username:String,
    password:String,
    cpass: String,
    tokens:[
        {
            token:{
                type:String
            }
        }
    ]
})

teacherS.pre('save',async function(next){
    console.log("hello");
   if(this.isModified('password')){
       this.password= await bcrypt.hash(this.password, 10);
       this.cpass=await bcrypt.hash(this.cpass, 10);
   }
   next();
})

teacherS.methods.generateAuthToken = async function(){
    try{
       let token= jwt.sign({_id:this._id},process.env.SECRET_KEY);
       this.tokens= this.tokens.concat({ token: token});
       await this.save();
       return token;
    }catch(err){
        console.log(err);
    }
}

const Teacher = mongoose.model('Teacher',teacherS);

module.exports = Teacher;