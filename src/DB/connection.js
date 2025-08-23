import mongoose from "mongoose";
import {MongoClient, ServerApiVersion } from "mongodb";

export const connectDB = () => {
    mongoose.connect(process.env.DB_URL).then(() => {
        console.log("Connected to DB successfully");
    }).catch((error) => {
        console.log("failed to connect to DB", error);
    });
}




