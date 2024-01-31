import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/Apierror.js";
import { User } from "../models/userModel.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import multer from "multer";


const reigisterUser = asyncHandler(async (req,res) => {
    
    // get user details from user
    const {username, email,fullName, password } = req.body
    
    //validation not empty
    if(
        [fullName,username,email,password].some((field)=>
        field?.trim() ==="")
    ){
        throw new ApiError(400, "All fields are required")
    }

     //check if user already exist: username / email
     const existedUser = await User.findOne({
        $or: [{ username }, { email }]                    // or--> "or" is operator to check rhe different inputs
     })

     if(existedUser){
        throw new ApiError(409, "User with email or username already exists")
     }

      //console.log(req.files)
      //check for images ,avatar and files
      const avatarLocalPath = await req.files?.avatar[0]?.path;   
      console.log(avatarLocalPath) ;
      
       let coverImageLocalPath; 
       if (req.files && Array.isArray(req.files.coverimage) && req.files.coverimage.length > 0) {
        
         coverImageLocalPath =  await req.files.coverimage[0].path;
      }
    // //  console.log("coverImageLocalPath")

      if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
      }
 
      
      //upload them to cloudinary,avatar
         const avatar = await uploadOnCloudinary(avatarLocalPath);
         console.log(avatar)
        const coverimage = await uploadOnCloudinary(coverImageLocalPath);

       if(!avatar){
         throw new ApiError(400, "Avatar file is required")  
      }


    //create user object - create entry in db
    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverimage:coverimage?.url || "",
        email,
        password,
        username    //:username.tolowercase()
    })

    
    //remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering user")
    }

    
    //check for user creation
    //return response
    return res.status(201).json(
        new ApiResponse(200,createdUser, "User registered successfully")
    )

 
   })
     
   export { reigisterUser } 