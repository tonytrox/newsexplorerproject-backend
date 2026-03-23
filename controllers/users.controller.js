import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

// POST /signup
export const createUser = async (req, res, next) => {
    const { name, email, password } = req.body;

    try {
        const hash = await bcrypt.hash(password, 10); // <- 10 es el nivel de seguridad
        // password: hash → guarda el hash en lugar del texto plano

        const newUser = await User.create({ name, email, password: hash });

        res.status(201).send({
            name: newUser.name,
            email: newUser.email,
        });
    } catch (err) {
        // error de validación del modelo (campos inválidos)
        if (err.name === "ValidationError") {
            return next({ status: 400, message: "Invalid data" });
        }
        // err.name === "ValidationError"
        // Lo lanza Mongoose cuando los datos no supera las validaciones del modelo.

        // email duplicado
        if (err.code === 11000) {
            // MongoDB lanza este código cuando intentas guardar un email duplicado (unique: true)
            return next({ status: 409, message: "Email already exists" });
        }
        // ✅ ahora → pasa el error al middleware centralizado
        next(err);
    }
};

// POST /signin
export const login = async (req, res, next) => {
    const { email, password } = req.body;
    const JWT_SECRET = process.env.JWT_SECRET; // <- viene del .env, se lee cuando se ejecuta la función

    try {
        // findOne por defecto devuelve todos sus campos excepto los que el modelo tenga marcados como select: false.
        const user = await User.findOne({ email }).select("+password");
        // .select('+password') fuerza a MongoDB a incluir el password

        // select: false -> solo afecta las consultas (lectura), no la escritura (guardar)

        // verificar si el usuario existe
        if (!user) {
            return next({ status: 401, message: "Invalid credentials" });
        }

        // compara el password del formulario con el hash guardado en la DB
        const matched = await bcrypt.compare(password, user.password);

        if (!matched) {
            return next({ status: 401, message: "Invalid credentials" });
        }

        const token = jwt.sign(
            // user._id es simplemente el id que MongoDB le asignó cuando se creó el usuario en el DB
            { _id: user._id }, // <- payload
            JWT_SECRET, // <- clave secreta
            { expiresIn: "7d" }, // <- expira en 7 días
        );

        res.status(200).send({ token });
    } catch (err) {
        next(err);
        // pasa al middleware centralizado con status 500 por defecto
    }
};

// GET /users/me
// req.user <- esto lo creamos en el middleware
export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return next({ status: 404, message: "User not found" });
        }

        res.status(200).send({
            name: user.name,
            email: user.email,
        });
    } catch (err) {
        // id con formato inválido
        if (err.name === "CastError") {
            return next({ status: 400, message: "Invalid id" });
        }

        next(err);
    }
};
