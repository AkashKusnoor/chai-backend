//import mongoose from 'mongoose';
import mongoose, { Mongoose } from 'mongoose';
import dotenv from 'dotenv'
// import { DB_NAME } from "../constants.js";
dotenv.config({path: './.env'}); 

const connectDB = async (req,res)=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URL);
        console.log(`MongoDB connected !! DB HOST: ${conn.connection.host}`);
    } catch (error) {
        console.log(`MONGODB connection error ${error}`)
    }
}

export default connectDB;