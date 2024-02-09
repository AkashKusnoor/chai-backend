import mongoose, { Schema } from "mongoose";

const plalistSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true 
    },
    videos:[
        {
        video:{
        type: Schema.Types.ObjectId,
        ref: "Video"
    },
        },
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

},
    {timestamps:true})

export default mongoose.model("Playlist", plalistSchema)