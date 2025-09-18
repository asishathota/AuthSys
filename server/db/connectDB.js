import mongoose from "mongoose";

export const connectDB = async () => {
    const URI = process.env.MONGO_URI;
    mongoose.connect(URI)
        .then((res) => console.log("DB is connected to host: " + res.connection.host))
        .catch((error) => console.log("Error connecting to DB: " + error.message))
}