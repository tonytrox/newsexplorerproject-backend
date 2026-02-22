import mongoose from "mongoose";

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
    },
    image: {
        type: String,
        required: true,
        // validate: {
        //   validator(value) {
        //     return validator.isURL(value);
        //   },
        //   message: "You must enter a valid URL for the image",
        // },
    },
    owner: {
        type: String,
        // type: mongoose.Schema.Types.ObjectId,
        // ref: "user",
        required: true,
        select: false,
    },
});

export default mongoose.model("Article", articleSchema);
