import { Router } from "express";
import { reigisterUser } from "../controllers/userController.js";
import {upload} from "../middlewares/multer.js"

    const router = Router()

    router.post("/register",upload.fields([
        {
            name:"avatar",
            maxCount:1
        },
        {
            name:"coverimage",
            maxCount:1
        }
    ]),reigisterUser)


    export default router;