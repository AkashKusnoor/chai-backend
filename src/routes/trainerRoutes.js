import express from 'express';
//import { upload } from '../middlewares/multer.js';
import { createtrainer, deletePost, getAllTrainers, post  } from '../controllers/trainerController.js';
import { upload } from '../middlewares/multer.js';



const router = express.Router();

router.post("/createtrainer", createtrainer);
router.get("/getAllTrainers", getAllTrainers);
//router.get("/gettrainerbylocation/:location", searchByLocation);
//router.get("/gettrainerbyexpertise", searchByExpertise);
//router.post("/createpost", upload.array("files",10),post);
router.post("/createpost", upload.array('files') ,post);

router.post("/createpost", upload.single("file"),post )

// router.post("/createpost", upload.fields([
//     {
//         name: "file",
//         maxCount: 1
//     }, 
  
// ]),post);

router.delete("/deletePost/:id",deletePost)


export default router;

// fields([
//     {
//         name: "file",
//         maxCount: 10
//     }, 
  
// ])

