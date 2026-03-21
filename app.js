import dotenv from "dotenv"; // → carga el .env automáticamente
dotenv.config();
// “Lee el archivo .env y mételo dentro de process.env”

import express from "express";
import connectDB from "./db.js";
import userRouter from "./routes/user.routes.js";
import articleRouter from "./routes/article.routes.js";

const app = express();

const PORT = process.env.PORT; // <- viene del .env

connectDB();

// middleware para JSON
app.use(express.json());

// raíz del servidor, Express busca en ambos routers cuál ruta coincide
app.use("/", userRouter); // rutas de usuario
app.use("/", articleRouter); // rutas de artículos

// ruta básica
app.use("/status", (req, res) => {
    res.send("Servidor funcionando correctamente");
});

// iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
