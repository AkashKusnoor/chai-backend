import mongoose ,{Schema} from "mongoose";
import  Jwt  from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new Schema({
    username:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    email:{
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    fullName:{
        type: String,
        required: true,
        trim: true,
        index: true
    },
    avatar:{
        type: String,   //Cloudibary url
        required: true,
    },
    coverimage:{
        type: String,   //Cloudibary url
    },
    watchHistory:[
        {
            type: Schema.Types.ObjectId,
            ref: "Video"
        }
    ],
    password:{
        type: String,
        required:[true, 'Password is required']
    },
    refreshToken:{
        type:String
    }
},{
    timestamps:true
})


//password encrypt
userSchema.pre("save", async function (next) {                //do not use => arrow fun for call back 
    if(!this.isModified("password")) return next();
    
    this.password = bcrypt.hash(this.password, 10)
    next()
})

//comparing password from use and data base
userSchema.methods.isPasswordCorrect = async function
(password){
   return await bcrypt.compare(password, this.password)
}

//JWT Token  //  generateAccessToken & generateRefreshToken both are jwt tokens
userSchema.methods.generateAccessToken = function(){
    return Jwt.sign(
        {
             _id: this._id,    // this._id is coming from monogodb & _id -> this is payload name
             email: this.email,
             username: this.username,
             fullName: this.fullName  
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    return Jwt.sign(
        {
             _id: this._id,    // this._id is coming from monogodb & _id -> this is payload nam
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )   
}



export const User = mongoose.model("User", userSchema)