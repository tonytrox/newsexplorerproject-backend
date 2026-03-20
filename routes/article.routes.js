import express from "express";
import {
    getUserArticles,
    createArticle,
    deleteArticle,
} from "../controllers/articles.controller.js";
import auth from "../middlewares/auth.js";

// Esto crea un módulo de rutas
const router = express.Router();

// rutas protegidas
// no necesita :id porque el usuario viene del token (auth)
router.get("/articles", auth, getUserArticles);
router.post("/articles", auth, createArticle);

// sí necesita :articleId porque necesita saber QUÉ artículo borrar
router.delete("/articles/:articleId", auth, deleteArticle);

export default router;
