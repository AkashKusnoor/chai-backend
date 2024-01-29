import dotenv from 'dotenv'
import {app} from './app.js'
import connectDB from "./db/db.js";


//dot env config
dotenv.config();

const PORT = process.env.PORT || 8000

//db connection
connectDB()

app.listen(PORT || 8000, ()=>{
    console.log(`Server is running at port : ${PORT}`);
})
