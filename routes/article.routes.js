import express from "express";
import { celebrate, Joi } from "celebrate";
import {
    getUserArticles,
    createArticle,
    deleteArticle,
} from "../controllers/articles.controller.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

// rutas protegidas

router.get("/articles", auth, getUserArticles);

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

router.delete(
    "/articles/:articleId",
    auth,
    celebrate({
        params: Joi.object({
            articleId: Joi.string().hex().length(24).required(),
        }),
    }),
    deleteArticle,
);

export default router;
