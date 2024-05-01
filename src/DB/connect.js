import mongoose from "mongoose"
import {MONGODB_URI} from '../config.js'

async function connectDb(){
   
    try{
        const connectionInstance = await mongoose.connect(MONGODB_URI)
         
    }
    catch(err){
        console.log("MongoDB connection Error: " + err)
    }
}

export default connectDb;