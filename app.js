import express from "express";

const app = express();

const PORT = 3000;

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
