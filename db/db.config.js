import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()


mongoose.connect(process.env.MONGO_URI)

export const connection = mongoose.connection