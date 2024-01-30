import express from "express";
import { reigisterUser } from "../controllers/userController.js";

const router =express.Router()

router.post("/register", reigisterUser);

export  default router;