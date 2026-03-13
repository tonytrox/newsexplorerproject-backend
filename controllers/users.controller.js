import User from "../models/user.model";

// Versión SIN middleware

// POST /signup
export const createUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const newUser = await User.create({ name, email, password });

        res.status(201).send({
            name: newUser.name,
            email: newUser.email,
        });
    } catch (err) {
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

        // verificar password
        // comparacion manual (sin bcrypt)
        if (user.password !== password) {
            //  👆 DB          👆 formulario
            return res.status(401).send({ message: "Invalid credentials" });
        }

        res.status(200).send({
            name: user.name,
            email: user.email,
        });
    } catch (err) {
        res.status(500).send({ message: "Server error" });
    }
};

// GET /users/:id
export const getUser = async (req, res) => {
    const userId = req.params.id;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).send({ message: "User not found" });
        }

        res.status(200).send({
            name: user.name,
            email: user.email,
        });
    } catch (err) {
        res.status(500).send({ message: "Server error" });
    }
};
