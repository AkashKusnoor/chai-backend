import mongoose from "mongoose";

// Define schema for skills
const skillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    imageUrl: {
        type: String,
        required: true
    }
},
  {timestamps:true}
);

export default mongoose.model("Skill",skillSchema)