import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/Apierror.js";
import { User } from "../models/userModel.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const reigisterUser = asyncHandler(async (req,res) => {
   
    // get user details from user
    const {username, email,fullName, password } = req.body
    console.log("email:", email);
    console.log("AKASH KUSNOOR");
    console.log("username:", username);

    //validation not empty
    if(
        [fullName,username,email,password].some((field)=>
        field?.trim() ==="")
    ){
        throw new ApiError(400, "All fields are required")
    }

     //check if user already exist: username / email
     const existedUser = User.findOne({
        $or: [{ username }, { email }]                    // or--> "or" is operator to check rhe different inputs
     })

     if(existedUser){
        throw new ApiError(409, "User with email or username already exists")
     }


      //check for images ,avatar and files
      const avatarLocalPath = req.files?.avatar[0]?.path;
      
      const coverimageLocalPath =req.files?.coverimage[0]?.path;

      if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
      }

      
    //upload them to cloudinary,avatar
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverimage = await uploadOnCloudinary(coverimageLocalPath);

    if(!avatar){
        throw new ApiError(400, "Avatar file is required")
    }


    //create user object - create entry in db
    const user = User.create({
        fullName,
        avatar: avatar.url,
        coverimage:coverimage?.url || "",
        email,
        password,
        username:username.toLowercase()
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
  

export {reigisterUser}