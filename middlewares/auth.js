import jwt from "jsonwebtoken";

const auth = (req, res, next) => {
    const JWT_SECRET = process.env.JWT_SECRET;
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
        return res.status(401).send({ message: "Authorization required" });
    }

    const token = authorization.replace("Bearer ", "");

    try {
        const payload = jwt.verify(token, JWT_SECRET);

        req.user = payload;

        next();
    } catch (err) {
        res.status(401).send({ message: "Invalid token" });
    }
};

export default auth;

// next()
// Es la función que le dice a Express "todo bien, continúa hacia el controlador".
// Sin next() la petición se queda atascada en el middleware y nunca llega a la ruta.
