import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

const JWT_SECRET = "news-explorer-secret"; // temporal, luego irá en .env

// POST /signup
export const createUser = async (req, res) => {
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
            return res.status(400).send({ message: "Invalid data" });
        }
        // err.name === "ValidationError"
        // Lo lanza Mongoose cuando los datos no supera las validaciones del modelo.

        // email duplicado
        if (err.code === 11000) {
            // MongoDB lanza este código cuando intentas guardar un email duplicado (unique: true)
            return res.status(409).send({ message: "Email already exists" });
        }

        res.status(500).send({ message: "Server error" });
    }
};

// POST /signin
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // findOne por defecto devuelve todos sus campos excepto los que el modelo tenga marcados como select: false.
        const user = await User.findOne({ email }).select("+password");
        // .select('+password') fuerza a MongoDB a incluir el password

        // select: false -> solo afecta las consultas (lectura), no la escritura (guardar)

        // verificar si el usuario existe
        if (!user) {
            return res.status(401).send({ message: "Invalid credentials" });
        }

        // compara el password del formulario con el hash guardado en la DB
        const matched = await bcrypt.compare(password, user.password);

        if (!matched) {
            return res.status(401).send({ message: "Invalid credentials" });
        }

        const token = jwt.sign(
            // user._id es simplemente el id que MongoDB le asignó cuando se creó el usuario en el DB
            { _id: user._id }, // <- payload
            JWT_SECRET, // <- clave secreta
            { expiresIn: "7d" }, // <- expira en 7 días
        );

        res.status(200).send({ token });
    } catch (err) {
        res.status(500).send({ message: "Server error" });
    }
};

// GET /users/me
// req.user <- esto lo creamos en el middleware
export const getUser = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        res.status(200).send({
            name: user.name,
            email: user.email,
        });
    } catch (err) {
        // id con formato inválido
        if (err.name === "CastError") {
            return res.status(400).send({ message: "Invalid id" });
        }
        res.status(500).send({ message: "Server error" });
    }
};
