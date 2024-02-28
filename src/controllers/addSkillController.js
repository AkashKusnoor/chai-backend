
import skillModel from "../models/skillModel.js";

// Function to add a new skill to MongoDB
const addSkills = async (req, res) => {
   
    try{
        
            const {name, imageUrl} = req.body;
            if(!name && !imageUrl){
                res.status(200).send({
                    success:false,
                    messsage:"name and imageUrl is mandatory"
                })
              
            }
 
            // Create a new skill document
        const skill = await skillModel.create({ name, imageUrl });
        return res.status(201).json({
            success: true,
            message: "Skill added successfully",
            skill
        });
        
    } catch (error) {
        console.error('Error adding skill:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

export { addSkills } 