import mongoose from "mongoose";

mongoose.set("strictQuery", true);

const DBConnection = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error("DB connection error:", err);
        process.exit(1);
    }
};

export default DBConnection;