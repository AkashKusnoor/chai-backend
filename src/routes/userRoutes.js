import express from "express";
import { changecurrentPassword, getCurrentUser, getUserChannelProfile, getWatchHistory, loginUser, logoutUser, refreshAccessToken, reigisterUser, updateAccountDetails, updateUserAvatar, updateUserCoverImage } from "../controllers/userController.js";
import { upload } from "../middlewares/multer.js";
import { verifyJWT } from "../middlewares/authMiddleware.js";
import multer from "multer";

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
router.post("/logout", verifyJWT,logoutUser);
router.post("/refresh-token", refreshAccessToken);
router.post("/change-password", verifyJWT, changecurrentPassword);
router.post("/current-user", verifyJWT, getCurrentUser);
router.patch("/update-account", verifyJWT, updateAccountDetails);
router.patch("/update-avatar", verifyJWT, upload.single("avatar"), updateUserAvatar);
router.patch("/update-coverImage", verifyJWT, upload.single("/coverImage"), updateUserCoverImage);
router.get("/channel/:username", verifyJWT, getUserChannelProfile);
router.get("/watcHistory/:", verifyJWT, getWatchHistory)


export  default router;