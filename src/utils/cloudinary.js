import {v2 as cloudinary} from "cloudinary";
import fs from "fs";
import dotenv from 'dotenv';
dotenv.config({path: './.env'}); 

//cloudinary config
cloudinary.config({
    cloud_name : process.env.CLOUDINARY_NAME,
    api_key :  process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_SECRET
});

const uploadOnCloudinary  =  async (localFilePath) => {
    try {
        if(!localFilePath) return null
       // console.log(localFilePath)
        //upload the file on cloudinary
        const response = await  cloudinary.uploader.upload(localFilePath,{ resource_type:"auto",})                         //file has been uploaded successfully
        // console.log("file has been uploaded on cloudinary",response.url);
        // return response
        fs.unlinkSync(localFilePath)
          return response;
     } catch (error) {
        console.error("Error uploading file to Cloudinary", error);
       fs.unlinkSync(localFilePath)   //remove the locally saved temporary file as the upload operation got failed 
       return null;
    }
 
}

export {uploadOnCloudinary}