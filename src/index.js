import dotenv from 'dotenv'

import connectDB from "./db/db.js";


//dot env config
dotenv.config();

connectDB()