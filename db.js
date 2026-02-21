import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect("mongodb://127.0.0.1:27017/newsexplorer_db");

        console.log("Conectado a MongoDB: ", mongoose.connection.name);
    } catch (error) {
        console.error("Error de conexión : MongoDB:", error.message);
    }
};

export default connectDB;
