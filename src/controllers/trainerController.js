import trainerModel from "../models/trainerModel.js";
// import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/Apierror.js";
// import { User } from "../models/userModel.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import { ApiResponse } from "../utils/ApiResponse.js";
//import { createPost } from "../models/trainerModel.js"
import trainerPostModel from "../models/trainerPostModel.js";
//import { upload } from "../middlewares/multer.js";
//import { storage } from "../middlewares/multer.js"
//import { authenticateTrainer } from "../middlewares/authMiddleware.js";
import multer from "multer"; 
//import { extname, parse } from 'path'; // Use path.parse for correct file extension handling
import { v4 as uuidv4} from 'uuid';



//--------
import { extname, parse } from 'path'; // Use path.parse for correct file extension handling
import fs from 'fs/promises'; // Needed for file operations
import path from "path";
import mongoose from "mongoose";



//create trainer
const createtrainer = async(req,res)=>{
 try {
    const { trainerName, location, expertise} = req.body;
    if(!trainerName || !location || !expertise ){
        return res.status(401).send({
            message:'All fields are  required'
        })
    }
    const trainer = await new trainerModel({
        trainerName,
        location,
        expertise,

    }).save();
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

 //get all trainers and filtering by location and expertise 
 const getAllTrainers = async (req, res) => {
    try {

      const {location, expertise} = req.query; 
      const queryObject ={};

    //  const trainers = await trainerModel.find(req.query)   // we can make use this to filter but for advance filter we can follow below steps
        console.log(req.query);
       if(location){
        queryObject.location = { $regex:location , $options:"i"};
       }

       if(expertise){
        queryObject.expertise = { $regex:expertise , $options:"i"};;
       }
       console.log(req.query);
       

      const trainers = await trainerModel.find(queryObject)
      res.status(200).json(trainers);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };


//get trainer by location
  // const searchByLocation = async (req, res) => {
  //   try {
    
  //      const trainers = await trainerModel.aggregate([
  //       {
            
  //       }
  //     ]);
  //     res.status(200).json(trainers);
  //   } catch (err) {
  //     res.status(500).json({ error: err.message });
  //   }
  // };     

//get trainer by expertiseIn
// const searchByExpertise = async (req, res) => {
//     try {
//       const { post } = req.query;
//       const trainers = await trainerModel.find({ post });
//       res.status(200).json(trainers);
//     } catch (err) {
//       res.status(500).json({ error: err.message });
//     }
//   };

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

//----------------------------------------------------------------

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


//-----------------------------------

//import multer from 'multer';
// import { extname, parse } from 'path'; // Use path.parse for correct file extension handling
// import fs from 'fs'; // Needed for file operations
//import mongoose from 'mongoose'; // Assuming you have mongoose set up
//import trainerPostModel from './trainerPostModel.js'; // Assuming you have a trainerPost model

//const app = express(); // Assuming you have Express set up

// Set up multer configuration
// const storage = multer.diskStorage({
//   destination: 'uploads/', // Customize upload directory if needed
//   filename: (req, file, callback) => {
//     const uniqueSuffix = uuid.v4();
//     const originalExt = extname(file.originalname).toLowerCase(); // Handle all filename extensions correctly
//     callback(null, `${file.fieldname}-${uniqueSuffix}${originalExt}`);
//   }
// });

// const upload = multer({ storage });

// // Create post endpoint
// const post =  async (req, res) => {
//     console.log(req.files)
//   try {
//     const { description, postForAllSissoMember, onlyPostMyConnenctions } = req.body;

//     // Validate file types and sizes (adjust according to your requirements)
//     const allowedTypes = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx', '.xls', '.xlsx'];
//     const uploadedFiles = [];
//     for (const file of req.files) {
//       const ext = extname(file.originalname).toLowerCase();
//       if (!allowedTypes.includes(ext)) {
//         throw new Error(`Invalid file type: ${ext}. Only ${allowedTypes.join(', ')} are allowed.`);
//       }

//       if (file.size > 1024 * 1024 * 5) { // 5MB maximum file size (adjust as needed)
//         throw new Error(`File size exceeds the maximum limit of 5MB.`);
//       }

//       uploadedFiles.push(file);
//     }

//     // Process uploaded files
//     const filePaths =  [];
//     for (const file of uploadedFiles) {
//       const filePath =  await path.join(__dirname, storage.destination, file.filename);
//       await fs.writeFileSync(filePath, file.buffer);
//       filePaths.push(filePath);
//       console.log(`File uploaded successfully: ${filePath}`);

//       // You can extend processing here to store metadata, generate thumbnails, etc.
//     }

//     // Create a new post with file paths
//     const post = new trainerPostModel({
//       description,
//       filePaths, // Store array of file paths
//       postForAllSissoMember: postForAllSissoMember ? postForAllSissoMember : false,
//       onlyPostMyConnenctions: onlyPostMyConnenctions ? onlyPostMyConnenctions : false
//     });

//     // Save the post to the database
//     await post.save();

//     res.status(201).json({ message: 'Post created successfully!', post });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: error.message });
//   }
// };

// ... other routes and code

// app.listen(port, () => {
//   console.log(`Server listening on port ${port}`);
// });






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



export {createtrainer, post, deletePost, getAllTrainers}



