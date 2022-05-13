const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const crypto = require('crypto')
dotenv.config()


const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,'name is required'],
        maxLength:[30,'max 30 charecters'],
        minLength:[4,'min 4 charecters']
    },
    email:{
        type:String,
        required:true,
        validator:[validator.isEmail,'email is not valid'],
        unique:true
    },
    password:{
        type:String,
        maxLength:[8,'maximun 8 charecters'],
        select:false
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role:{
        type:String,
        default:"user"
    },
    resetPasswordToken:String,
    resetPasswordExpire:Date

})


userSchema.pre('save',async function(next){

    if(!this.isModified('password')){
        next()
    }
    this.password = await bcrypt.hash(this.password,10)

})

//jw token

userSchema.methods.getJwtToken = function (){
    return jwt.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    })
}

userSchema.methods.comparePassword = async function (enteredPassowrd){
    return await bcrypt.compare(enteredPassowrd,this.password)
}







module.exports = mongoose.model('user',userSchema)