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
        // Este campo owner guarda el _id de un documento del modelo "user", creando una relación entre el Article y el User.
        // define que ese campo almacenará el identificador único.
        type: mongoose.Schema.Types.ObjectId,
        // Esto crea una referencia a otro modelo.
        // Ese "user" le dice a Mongoose:
        // "Este ObjectId pertenece a un documento del modelo user"
        ref: "user",
        // ref: "user" le indica a Mongoose que ese ObjectId pertenece a la colección del modelo user,
        // permitiendo usar populate() para obtener los datos del usuario.
        required: true,
        // select false: Evita exponer información sensible (como el identificador del usuario) en las respuestas de la API.
        select: false,
    },
});

const Article = mongoose.model("Article", articleSchema);

export default Article;
