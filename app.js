import express from "express";
import connectDB from "./db.js";

const app = express();

const PORT = 3000;

connectDB();

// middleware para JSON
app.use(express.json());

// ruta básica
app.get("/", (req, res) => {
    res.send("Servidor funcionando correctamente");
});

// endpoint test
app.get("/api/test", (req, res) => {
    res.json({
        message: "API funcionando",
        status: "ok",
    });
});

// iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
