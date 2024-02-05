import express from 'express';
import { upload } from '../middlewares/multer.js';
import { createtrainer, deletePost, post } from '../controllers/trainerController.js';




const router = express.Router();

router.post("/createtrainer",createtrainer);
router.post("/createpost", upload.array("files",10),post);
router.delete("/deletePost/:id",deletePost)


export default router;

// fields([
//     {
//         name: "file",
//         maxCount: 1
//     }, 
  
// ])

