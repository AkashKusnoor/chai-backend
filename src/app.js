import express, { urlencoded }  from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";

//rest object
const app = express();


//middlewares
app.use(express.json({limit:"16kb"}));
app.use(cors());
app.use(express.urlencoded({extended:true, limit:"16kb"}));
app.use(express.static("public"));
app.use(cookieParser());
app.use(morgan("dev"));


export {app}