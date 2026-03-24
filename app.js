import dotenv from "dotenv"; // → carga el .env automáticamente

if (process.env.NODE_ENV !== "production") {
    // “Lee el archivo .env y mételo dentro de process.env”
    dotenv.config();
}

import express from "express";
import connectDB from "./db.js";
import userRouter from "./routes/user.routes.js";
import articleRouter from "./routes/article.routes.js";
import { requestLogger, errorLogger } from "./middlewares/logger.js";

const app = express();

const PORT = process.env.PORT; // <- viene del .env

connectDB();

// middleware para JSON
app.use(express.json());

// registra todas las solicitudes, va antes de las rutas
app.use(requestLogger);

app.use("/", userRouter);
app.use("/", articleRouter);

// ruta básica
app.use("/status", (req, res) => {
    res.send("Servidor funcionando correctamente");
});

// registra todos los errores, va después de las rutas
app.use(errorLogger);

// middleware centralizado de errores, siempre al final
app.use((err, req, res, next) => {
    const { status = 500, message } = err;
    res.status(status).send({ message });
});

// iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
