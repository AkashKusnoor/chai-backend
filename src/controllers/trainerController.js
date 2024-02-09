import trainerModel from "../models/trainerModel.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/Apierror.js";
// import { User } from "../models/userModel.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
//import { createPost } from "../models/trainerModel.js"
import trainerPostModel from "../models/trainerPostModel.js";
//import { authenticateTrainer } from "../middlewares/authMiddleware.js";

//create trainer
const createtrainer = async(req,res)=>{
 try {
    const { trainerName } = req.body;
    if(!trainerName){
        return res.status(401).send({
            message:'trainerName is  required'
        })
    }
    const trainer = await new trainerModel({trainerName}).save();
    res.status(200).send({
        message:'Trainer created successfully',
        trainer
    })
 } catch (error) {
    console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in crating trainer',
            error
        })
 }

 }

//create post from trainer

//create post
const post = async(req,res)=>{ 
    try {
        const {description, postForAllSissoMember,onlyPostMyConnenctions} = req.body;
        console.log(description)
        console.log(postForAllSissoMember)
    
        //file upload
        const fileLocalPath = await req.files?.file[0]?.path;   
        console.log(fileLocalPath) ;
        if(!fileLocalPath){
            throw new ApiError(400, "File is required")
        }

        //upload them to cloudinary,avatar
         const file = await uploadOnCloudinary(fileLocalPath);
         console.log(file);

         if(!file){
            throw new ApiError(400, "file is required")  
         }

         //create post
         const post = await new trainerPostModel({
          //  trainerId,
            description,
            file: file.url,
            postForAllSissoMember:postForAllSissoMember?postForAllSissoMember:false,
            onlyPostMyConnenctions:onlyPostMyConnenctions?onlyPostMyConnenctions:false
         }) 

         //save post to the data base
         await post.save();

         res.status(201).json(
            { success: true,
             post 
            });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
}


//code to send multiple files
// const post = async (req, res) => {
//     try {
//         const { description, visibility } = req.body;

//         const files = req.files // Get array of files
//        // console.log(files)

//         if (!files || files.length === 0) {
//             throw new ApiError(400, "Files are required");
//         }

//         const uploadedFiles = await Promise.all(files.map(async (file) => {
//             const fileLocalPath = file.path;
//             if (!fileLocalPath) {
//                 throw new ApiError(400, "File path is required");
//             }
//          }))

//             // Upload each file to Cloudinary
//             // const uploadedFile = await uploadOnCloudinary(fileLocalPath);

//             // if (!uploadedFile) {
//             //     throw new ApiError(400, "File upload failed");
//             // }

//       //       return { url: uploadedFile.url, originalname: file.originalname };
//       //   }));

//       //   const posts = await Promise.all(uploadedFiles.map(async (uploadedFile) => {
//       //       const post = await new trainerPostModel({
//       //           description,
//       //           file: uploadedFile.url,
//       //           visibility,
//       //           originalname: uploadedFile.originalname,
//       //       }).save();

//       //       return post;
//       //   }));

//       //   res.status(201).json({
//       //       success: true,
//       //       posts,
//       //   });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, error: 'Internal Server Error' });
//     }
// };





//delete post
const deletePost = async (req,res) =>{
    try {
       const { id } = req.params;
       await trainerPostModel.findByIdAndDelete(id);
        res.status(200).send({
            success:true,
            message:" Post Successfully Deleted",
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            error,
            message:'Internal Server Error'
        })
    }
    
   }

export {createtrainer,post,deletePost}



