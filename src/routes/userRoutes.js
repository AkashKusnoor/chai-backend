import express from "express";
import { loginUser, logoutUser, refreshAccessToken, reigisterUser } from "../controllers/userController.js";
import { upload } from "../middlewares/multer.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";

const router =express.Router()
//register
router.post("/register", upload.fields([
    {
        name: "avatar",
        maxCount: 1
    }, 
    {
        name: "coverimage",
        maxCount: 1
    }
]) ,reigisterUser);

//login
router.post("/login",loginUser);


//secured routes
//logout
router.post("/logout",verifyJWT,logoutUser);
router.post("/refresh-token", refreshAccessToken)


export  default router;