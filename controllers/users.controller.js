import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/user.model.js";

// POST /signup
export const createUser = async (req, res, next) => {
    const { name, email, password } = req.body;

    try {
        const hash = await bcrypt.hash(password, 10);

        const newUser = await User.create({ name, email, password: hash });

        res.status(201).send({
            name: newUser.name,
            email: newUser.email,
        });
    } catch (err) {
        if (err.name === "ValidationError") {
            return next({ status: 400, message: "Invalid data" });
        }

        if (err.code === 11000) {
            return next({ status: 409, message: "Email already exists" });
        }

        next(err);
    }
};

// POST /signin
export const login = async (req, res, next) => {
    const { email, password } = req.body;
    const JWT_SECRET = process.env.JWT_SECRET;

    try {
        const user = await User.findOne({ email }).select("+password");

        if (!user) {
            return next({ status: 401, message: "Invalid credentials" });
        }

        // compara el password del formulario con el hash guardado en la DB
        const matched = await bcrypt.compare(password, user.password);

        if (!matched) {
            return next({ status: 401, message: "Invalid credentials" });
        }

        const token = jwt.sign(
            { _id: user._id }, // <- payload
            JWT_SECRET, // <- clave secreta
            { expiresIn: "7d" }, // <- expira en 7 días
        );

        res.status(200).send({ token });
    } catch (err) {
        next(err);
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
        if (err.name === "CastError") {
            return next({ status: 400, message: "Invalid id" });
        }

        next(err);
    }
};
