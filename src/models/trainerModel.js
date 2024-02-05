import mongoose from "mongoose";

const trainerSchema = new mongoose.Schema({
    trainerName:{
        type:String,
        required:true
    },

},
{timestamps:true}
)

export default mongoose.model("Trainer",trainerSchema);
