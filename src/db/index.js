
import mongoose from 'mongoose';
import {dbName} from "../constants.js";




const connectDb=async()=>{
    try {
        
       const connection= await mongoose.connect(`${process.env.MONGO_URI}/${dbName}`);
         console.log("Connected to database successfully",connection.connection.host,connection.connection.port);
    } catch (error) {
        console.log("Error connecting to database",error);
        process.exit(1);
        
        
    }
}

export default connectDb;

