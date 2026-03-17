import express from "express";
import { createUser, login, getUser } from "../controllers/users.controller.js";

const router = express.Router();
// Esto crea un módulo de rutas

router.post("/signup", createUser);
router.post("/signin", login);
router.get("/users/:id", getUser);

export default router;
