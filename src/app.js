import express from "express";
//import express from 'express';
import mongoose from "mongoose";

import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
//routes import


import userRoutes from "./routes/userRoutes.js"
import trainerRoutes from "./routes/trainerRoutes.js";
import skillRoute from "./routes/skillRoute.js"


import connectDB from "./db/db.js";




//rest object
const app = express();

 


//db connection
connectDB()


//middlewares
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({extended:true, limit:"16kb"}));
app.use(express.static("public"));
app.use(cookieParser());
app.use(morgan("dev"));

//routes declaration

app.use("/api/v1/user", userRoutes)
app.use("/api/v1/trainer", trainerRoutes)
app.use("/api/v1/skill", skillRoute)


app.post("/test",(req,resp)=>{
    console.log('test athe api ')
})


console.log("Akash Patil");

<p>this is new feature (dropdown)</p>


const PORT = process.env.PORT || 8000

app.get("/", (req,res)=>{
   res.send("<h1>abcd</h1>")
})

app.listen(PORT || 8000, ()=>{
    console.log(`Server is running at port : ${PORT}`);
})


export {app}