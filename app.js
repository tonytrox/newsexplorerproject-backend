import express from "express";
import connectDB from "./db.js";
import testRuta from "./routes/article.routes.js";

const app = express();

const PORT = 3000;

connectDB();

// middleware para JSON
app.use(express.json());

// usar rutas
app.use("/api", testRuta);

// endpoint test
app.get("/prueba", (req, res) => {
    res.json({
        message: "API funcionando",
        status: "ok",
    });
});

// ruta básica
app.use("/status", (req, res) => {
    res.send("Servidor funcionando correctamente");
});

// COMO FUNCIONA EL FLUJO

// Cuando haces una solicitud a /api/ping, Express busca una coincidencia en las rutas definidas en article.routes.js
// porque app.use("/api", testRuta); delega todas las solicitudes que comienzan con /api a ese archivo.
// En article.routes.js, encuentra la ruta router.get("/ping", ping); y ejecuta la función ping del controlador.
// La función ping responde con el JSON: { message: "pong", status: "ok" }.

// iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
