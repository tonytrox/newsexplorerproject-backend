import jwt from "jsonwebtoken";

const JWT_SECRET = "news-explorer-secret"; // la misma clave que usaste en login

const auth = (req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith("Bearer ")) {
        return res.status(401).send({ message: "Authorization required" });
    }

    // extraemos el token quitando el "Bearer " del inicio
    const token = authorization.replace("Bearer ", "");

    try {
        // verificamos y decodificamos el token
        const payload = jwt.verify(token, JWT_SECRET);

        // guardamos el payload en req.user para usarlo en los controladores
        // Es decir, req.user no existe por defecto en Express, nosotros lo creamos en el middleware
        req.user = payload;

        next(); // "aprobado, sigue al siguiente..(controlador)"
    } catch (err) {
        res.status(401).send({ message: "Invalid token" });
    }
};

export default auth;

// next()
// Es la función que le dice a Express "todo bien, continúa hacia el controlador".
// Sin next() la petición se queda atascada en el middleware y nunca llega a la ruta.
