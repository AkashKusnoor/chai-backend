import { ApiError } from "../utils/Apierror.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";


export const verifyJWT = asyncHandler(async(req, _, next)=>{           // insterd of "res" we can write underscore "_" when there is no response
try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")
  
    if(!token){
      throw new ApiError(401, "Unauthorized request")
    }
  
    const decodedTokn = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
  
    const user = await User.findById(decodedTokn?._id).select("-password -refreshToken");
  
    if(!user){
      //todo discuss about frontend
      throw new ApiError(401, "Invalid access token")
    }
  
    req.user = user,
    next()
} catch (error) {
  throw new ApiError(401, error?.message || "Invalid access token")
}
})






















// //Middele ware function to authenticate trainer
// const authenticateTrainer = (req,res,next)=>{

//     // Assuming you have the trainer information in the request object after authentication
//     const trainerId = req.user.trainerId;

//     // Check if the requester is the trainer
//     if(!trainerId){
//       return res.status(401).json({ error: 'Unauthorized' });
//     }

//       // Add trainerId to the request object for later use
//       req.trainerId = trainerId;
//       next();
//     }

     
//   export { authenticateTrainer };












// // Middleware function to authenticate a trainer
// const authenticateTrainer = (req, res, next) => {
//     // Assuming you have the trainer information in the request object after authentication
//     const trainerId = req.user.trainerId; // Change this according to your authentication setup
  
//     // Check if the requester is the trainer
//     if (!trainerId) {
//       return res.status(401).json({ error: 'Unauthorized' });
//     }
  
//     // Add trainerId to the request object for later use
//     req.trainerId = trainerId;
//     next();
//   };
  
//   export { authenticateTrainer };
  