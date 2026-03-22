import express from "express";
import { celebrate, Joi } from "celebrate";
import {
    getUserArticles,
    createArticle,
    deleteArticle,
} from "../controllers/articles.controller.js";
import auth from "../middlewares/auth.js";

// Esto crea un módulo de rutas
const router = express.Router();

// celebrate actúa como portero: valida el body antes de que llegue al controlador
// si los datos no cumplen las reglas → responde con error y nunca llega al controlador
// si los datos son válidos → pasa al controlador

// rutas protegidas

// no necesita :id porque el usuario viene del token (auth)
router.get("/articles", auth, getUserArticles);

// Joi.string().uri() → valida que sea una URL válida en link e image
router.post(
    "/articles",
    auth,
    celebrate({
        body: Joi.object({
            keyword: Joi.string().required(),
            title: Joi.string().required(),
            text: Joi.string().required(),
            date: Joi.string().required(),
            source: Joi.string().required(),
            link: Joi.string().uri().required(),
            image: Joi.string().uri().required(),
        }),
    }),
    createArticle,
);

// sí necesita :articleId porque necesita saber QUÉ artículo borrar
router.delete(
    "/articles/:articleId",
    auth,
    celebrate({
        params: Joi.object({
            articleId: Joi.string().hex().length(24).required(),
            // Joi.string().hex().length(24) → valida que el articleId sea un ObjectId válido de MongoDB
        }),
    }),
    deleteArticle,
);

export default router;
