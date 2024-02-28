import mongoose from "mongoose";

const trainerSchema = new mongoose.Schema({
    trainerName:{
        type:String,
        required:true
    },
    location: {
        type:String
    },
    expertise: [{
        type:String
    }],            // Changed field name from skills to expertise
    //available: Boolean

},
{timestamps:true}
)

export default mongoose.model("Trainer",trainerSchema);
