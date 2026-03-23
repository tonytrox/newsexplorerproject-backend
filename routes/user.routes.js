import express from "express";
import { celebrate, Joi } from "celebrate";
import { createUser, login, getUser } from "../controllers/users.controller.js";
import auth from "../middlewares/auth.js";

const router = express.Router();
// Esto crea un módulo de rutas

// rutas pública

// celebrate: actúa como portero: valida el body antes de que llegue al controlador
// si los datos no cumplen las reglas → responde con error y nunca llega al controlador
// si los datos son válidos → pasa al controlador
router.post(
    "/signup",
    celebrate({
        body: Joi.object({
            name: Joi.string().min(2).max(30).required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        }),
    }),
    createUser,
);

router.post(
    "/signin",
    celebrate({
        body: Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        }),
    }),
    login,
);

// ✅ con auth - ruta protegida
router.get("/users/me", auth, getUser);
//                  middleware  controlador

export default router;
