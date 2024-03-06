import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/Apierror.js";
import { User } from "../models/userModel.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import multer from "multer";
import jwt from "jsonwebtoken"

const generateAccessAndRefreshTokens = async(userId)=>{
   try {
      const user = await User.findById(userId);
      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()

      //save refrestoken in data base
      user.refreshToken = refreshToken
      await user.save({ validateBeforeSave: false })

      return{accessToken, refreshToken}
   } catch (error) {
      throw new ApiError(500, "Somethinfg went wrong while generating refrsh and access token ")
   }
}

//register user
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

//login user
const loginUser = asyncHandler(async (req,res)=>{
     //reqbody -> data
     const {email, username, password} = req.body

     if(!username && !email){
        throw new ApiError(400, "Username or Email is required")
     }

      // Here is an alternative of above code based on logic discussed in video:
    // if (!(username || email)) {
    //     throw new ApiError(400, "username or email is required")
        
    // }

     // find the user
     const user = await User.findOne({       
        $or:[{username}, {email}]
     })

     if(!user){
        throw new ApiError(404, "User does not exist")
     }
    
     // password check
     const isPasswordValid = await user.isPasswordCorrect(password);

     if(!isPasswordValid){
      throw new ApiError(401, "Invalid user credentials")
      }
     
     // access and refresh token
     const {accessToken, refreshToken} = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    
   //   send cookie
     const options = {
         httponly: true,
         secure: true
     }

     return res.status(200)
     .cookie("accessToken", accessToken, options)
     .cookie("refreshToken", refreshToken, options) 
     .json(
         new ApiResponse(
            200,
            {
               user: loggedInUser, accessToken, refreshToken
            },
            "User loggedIn Successfully"
         )
     )
});

//logout
const logoutUser = asyncHandler( async(req,res)=>{
   await User.findByIdAndUpdate(
      req.user._id,
      {
         $unset: {
            refreshToken: 1  //this removes field from document
         }
      },
      {
         new: true
      }
   )
   const options = {
      httponly: true,
      secure: true
  }

   return res
   .status(200)
   .clearCookie("accessToken", options)
   .clearCookie("refreshToken", options)
   .json(new ApiResponse(200, {}, "User logged Out"))

})

//refresh access token
const refreshAccessToken = asyncHandler(async(req,res)=>{
   const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

   if(!incomingRefreshToken){
      throw new ApiError(401, "Unauthorized request")
   }

  try {
    const decodedToken = jwt.verify(
       incomingRefreshToken, 
       process.env.REFRESH_TOKEN_SECRET
    )
 
    const user = await User.findById(decodedToken?._id)
    
    
    if(!user){
          throw new ApiError(401, "Invalid request token")
       }   
 
    if(incomingRefreshToken !== user?.refreshToken){
       throw new ApiError(401, "refresh token is expired or used")
    }
 
    const options = {
       httponly: true,
       secure: true
    } 
 
    const {accessToken,newRefreshToken} = await generateAccessAndRefreshTokens(user._id)
 
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options) 
    .json(
       new ApiResponse(
          200,
          {accessToken, refreshToken: newRefreshToken},
          "Access token Refreshed"
 
       )
    )
 
   } catch (error) {
       throw new ApiError(401, error?.message || "Invalid refresh token")
  }
})

//password update
const changecurrentPassword = asyncHandler(async(req,res)=>{
   const {oldPassword , newPassword} = req.body;     //for confirm password just add
                                                     // const {oldPassword , newPassword,confPassword} = req.body; 
   const user = await User.findById(req.user?._id);     //  if(!(newPassword === confPassword)){
   const isPasswordCorrect = await user.isPasswordCorrect(oldPassword); //  throw new ApiError(400, "Password  dosent match")}

   if(!isPasswordCorrect){
      throw new ApiError(400, "Invalid old password")
   }

   user.password = newPassword
   await user.save({validateBeforeSave:false})
 
   return res
   .status(200)
   .json(new ApiResponse(200, {}, "Password changed Successfully"))
})

//get user
const getCurrentUser = asyncHandler(async(req,res)=>{
   return res
   .status(200)
   .json(200, req.user, "Current user fetched Successfully")
})

//update account details
const updateAccountDetails = asyncHandler(async(req,res)=>{
   const { fullName, email } = req.body;
   if(!fullName || !email){
      throw new ApiError(400, "All fields are required")
   }

   const user = await User.findByIdAndUpdate(
      req.user?._id, 
      {
         $set:{                                   // $set will receive object
             fullName ,        // (or) fullName: fullName
             email:email             // (or) email: email
         }
      }, 
      {new: true}
   ).select("-password")
   return res
   .status(200)
   .json(new ApiResponse(200, user, "Account details updated Successfully"))
})

//update avatar
const updateUserAvatar = asyncHandler(async(req,res)=>{
   const avatarLocalPath = req.file?.path
   
   if(!avatarLocalPath){
      throw new ApiError(400, "Avatar file is missing")
   }

   const avatar = await uploadOnCloudinary(avatarLocalPath)

   if(!avatar.url){
      throw new ApiError(400, "Error while uploading on avatar")
   }

      const user = awaitUser.findByIdAndUpdate(req.user?._id,
         {
            $set:{
               avatar: avatar.url
            }
         },
         {new :true}
      ).select("-password")

      return res
      .status(200)
      .json(
         new ApiResponse(200, user, "Avatar updated Successfully")
      )
})

//update cover image
const updateUserCoverImage = asyncHandler(async(req,res)=>{
   const coverImageLocalPath = req.file?.path
   
   if(!coverImageLocalPath){
      throw new ApiError(400, "Cover image file is missing")
   }

   const coverImage = await uploadOnCloudinary(coverImageLocalPath)

   if(!coverImage.url){
      throw new ApiError(400, "Error while uploading on avatar")
   }

      const user = awaitUser.findByIdAndUpdate(
         req.user?._id,
         { 
            $set:{
               coverImage: coverImage.url
            }
         },
         {new :true}
      ).select("-password")

      return res
      .status(200)
      .json(
         new ApiResponse(200, user, "Image Cover updated Successfully")
      )
});

const getUserChannelProfile = asyncHandler(async(req,res)=>{
   const { username } = req.params
   
   if(!username?.trim()){
      throw new ApiError(400, "User name is missing")
   }

   const channel = await User.aggregate([
      {
         $match:{
            username : username?.toLowerCase()
         }                                            //first pipeline is match pipe line in that we can find particular username yo
      },
      {       //toatl no of your subscribers
         $lookup:{
            from: "subscriptions",
            localField: "_id",
            foreignField: "channel",
            as: "subscribers"
         }
      },  
      {      // no of channels you have subcribed or subscriptions
         $lookup:{
            from:"subscriptions",
            localField: "_id",
            foreignField: "subscriber",
            as: "subscribedTo"
         }
      },
      {       // add fields is to add the additional fields
         $addFields:{
            subscribersCount:{
               $size: "$subscribers",
            },
            channelsSubscribedToCount:{
               $size: "subscribedTo"
            },
            isSubscribed:{
               $cond: {
                  if: {$in: [req.user?._id, "$subscribers.subscriber"]},
                  then: true,
                  else : false
               }
            }
         }
      },
      {       //$project pipe line is used to send only selected things you wish to send
         $project:{
            fullName: 1,
            username: 1,
            subscribersCount: 1,
            channelsSubscribedToCount: 1,
            isSubscribed: 1,
            avatar: 1,
            coverImage: 1,
            email: 1
         }
      }   
   ])

   if(!channel?.length){
      throw new ApiError(400, "Channel does not exist")
   }

   return res
   .status(200)
   .json(new ApiResponse(200, channel[0], "User channel fetched successfully"))
})

//watch history
const getWatchHistory = asyncHandler(async(req,res)=>{
   const user = await User.aggregate([                                       
      {
         $match:{                                                         //req.user._id  
            _id: new mongoose.Types.ObjectId(req.user._id)                //_id  will give you string that is from mongodb and this is not mongodb id
         }                                                                //  ex:-> '65c4715917cebb50d42255b7'
      },                                                                   // if you want full mongodb id then than this is full mongodb id that is object plus id ex:-> objectId('65c4715917cebb50d42255b7')
      {
         $lookup:{
            from: "videos",
            localField:"watchHistory",
            foreignField:"_id",
            as: "watchHistory",
            pipeline: [                                  //sub pipie line to find owner
               {
                  $lookup:{
                     from: "users",
                     localField:"owner",
                     foreignField: "_id",
                     as: "owner",
                     pipeline: [                         //sub pipe line to show only few details  about owner
                        {
                           $project: {
                              fullName: 1,
                              username: 1,
                              avatar: 1
                           }
                        }
                     ]
                  }
               },
               {
                  $addFields:{
                     owner:{
                        $first: "$owner"
                     }
                  }
               }
            ]
         }
      }
   ])  
   return res
   .status(200)                                           
   .json(                                                     
      new ApiResponse(                                         
         200,                                                  
         user[0].watchHistory,
        " watch history fetch successfully"
      )
   )                                             
})                                               
                                                
   export {                                     
      reigisterUser, 
      loginUser, 
      logoutUser, 
      refreshAccessToken, 
      changecurrentPassword, 
      getCurrentUser, 
      updateAccountDetails,
      updateUserAvatar,
      updateUserCoverImage,
      getUserChannelProfile,
      getWatchHistory
   }    