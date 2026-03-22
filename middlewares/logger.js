import winston from "winston";
import expressWinston from "express-winston";

// registra todas las solicitudes entrantes a la API
export const requestLogger = expressWinston.logger({
    // define donde se guardan los logs
    transports: [new winston.transports.File({ filename: "request.log" })],
    // formato JSON
    format: winston.format.json(),
});

// registra todos los errores devueltos por la API
export const errorLogger = expressWinston.errorLogger({
    transports: [new winston.transports.File({ filename: "error.log" })],
    format: winston.format.json(),
});
