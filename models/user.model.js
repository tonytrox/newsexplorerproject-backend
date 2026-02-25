import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 30,
    },

    email: {
        type: String,
        // hace obligatorio el campo email y lanza este mensaje si está ausente
        required: [true, "You must enter a valid email "],
        unique: true,
        validate: {
            validator(value) {
                return validator.isEmail(value);
            },
            message: "You must enter a valid email address",
        },
    },
    password: {
        type: String,
        required: [true, "Please enter the correct password"],
        select: false,
    },
});

const User = mongoose.model("User", userSchema);

export default User;
