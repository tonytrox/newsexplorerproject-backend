import mongoose from "mongoose";
import validator from "validator";

const articleSchema = new mongoose.Schema({
    keyword: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    source: {
        type: String,
        required: true,
    },
    link: {
        type: String,
        required: true,
        validate: {
            validator(value) {
                return validator.isURL(value);
            },
            message: "You must enter a valid URL for the link",
        },
    },
    image: {
        type: String,
        required: true,
        validate: {
            validator(value) {
                return validator.isURL(value);
            },
            message: "You must enter a valid URL for the image",
        },
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        select: false,
    },
});

const Article = mongoose.model("Article", articleSchema);

export default Article;
