import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

//cloudinary config
cloudinary.v2.config({
    cloud_name : process.env.CLODINARY_NAME,
    api_key : process.env.CLODINARY_API_KEY,
    api_secret : process.env.CLODINARY_SECRET
});

const uploadOnCloudinary  = async (localFilePath) => {
    try {
        if(!localFilePath) return null
        //upload the file on cloudinary
        const response = await  cloudinary.uploader.upload(localFilePath,{
            resource_type:"auto"
        })                         //file has been uploaded successfully
        console.log("file has beenuploaded on cloudinary",
        response.url
        );
        return response
    } catch (error) {
        fs.unlinkSync(localFilePath)   //remove the locally saved temporary file as the upload operation got failed 
        return null;
    }
}

export {uploadOnCloudinary}