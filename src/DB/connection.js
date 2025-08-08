import mongoose from "mongoose";

export const connectDB = () => {
    mongoose.connect("mongodb://127.0.0.1:27017/saraha").then(() => {
        console.log("Connected to DB successfully");
    }).catch((error) => {
        console.log("failed to connect to DB", error);
    });
}

