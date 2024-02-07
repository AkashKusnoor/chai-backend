import mongoose from "mongoose";
import trainerModel from "./trainerModel.js";


const createPostSchema = new mongoose.Schema({
    description:{
        type:String,
        reuired:true,
    },
    files:{
        type: String,
        required:true
    },
    //  trainerId:{
    //      type: mongoose.Schema.Types.ObjectId,
    //      ref:"Trainer"      
    //  },
    visibility:{ type:String, enum: ['connections','all'],default: 'connections'},

},{timestamps:true})



export default mongoose.model("Post",createPostSchema) 