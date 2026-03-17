import express from "express";
import {
    getUserArticles,
    createArticle,
    deleteArticle,
} from "../controllers/articles.controller.js";

// Esto crea un módulo de rutas
const router = express.Router();

// Escuchar peticiones (GET, POST, DELETE)
// Asociarlas a funciones
router.get("/articles/:id", getUserArticles);
router.post("/articles/:id", createArticle);
router.delete("/articles/:articleId", deleteArticle);

export default router;
