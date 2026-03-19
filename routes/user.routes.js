import express from "express";
import { createUser, login, getUser } from "../controllers/users.controller.js";
import auth from "../middleware/auth.js";

const router = express.Router();
// Esto crea un módulo de rutas

// ❌ sin auth - rutas pública
router.post("/signup", createUser);
router.post("/signin", login);

// ✅ con auth - ruta protegida
router.get("/users/me", auth, getUser);
//                  middleware  controlador

export default router;
