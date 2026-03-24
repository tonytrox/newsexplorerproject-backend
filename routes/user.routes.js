import express from "express";
import { celebrate, Joi } from "celebrate";
import { createUser, login, getUser } from "../controllers/users.controller.js";
import auth from "../middlewares/auth.js";

const router = express.Router();

// rutas pública

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

// ruta protegida
router.get("/users/me", auth, getUser);
//                  middleware  controlador

export default router;
