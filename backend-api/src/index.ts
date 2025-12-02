import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import type { Application } from "express";
import userRoutes from "./routes/usuario.routes.js";
import rolRoutes from "./routes/rol.routes.js";
import areaRoutes from "./routes/area.routes.js";
import authRoutes from "./routes/auth.routes.js";
import categoriaRoutes from "./routes/categoria.routes.js";
import estadoRoutes from "./routes/estado.routes.js";
import pasajeroRoutes from "./routes/pasajero.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";
import comentariosRoutes from './routes/comentarios.routes.js';
import histoticketRoutes from './routes/historialtickets.routes.js';
import morgan from 'morgan';
import logger from './config/logger.js';
import { errorHandler } from './middleware/error.middleware.js';

import { env } from 'prisma/config';


const app: Application = express();
const PORT = 3000;

const corsOptions = {
  origin: env("FRONTEND_URL"),
  credentials: true,
};

// 1. Configurar Morgan (HTTP Logger)
const morganFormat = ':method :url :status :res[content-length] - :response-time ms';

app.use(
  morgan(morganFormat, {
    stream: {
      write: (message: string) => {
        // Limpiamos el salto de línea extra que agrega morgan
        logger.http(message.trim());
      },
    },
  })
);

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

// Rutas de la API
app.use("/api/usuarios", userRoutes);
app.use("/api/roles", rolRoutes);
app.use("/api/areas", areaRoutes);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/estados", estadoRoutes);
app.use("/api/pasajeros", pasajeroRoutes);
app.use("/api/tickets", ticketRoutes);
app.use('/api/comentarios', comentariosRoutes);
app.use('/api/historialtickets', histoticketRoutes);
app.use("/api", authRoutes);

// 2. Endpoint Health Check
app.get('/api/health', (_req, res) => {
  res.status(200).json({
    status: 'UP',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 3. Manejo Global de Errores (SIEMPRE AL FINAL)
app.use(errorHandler);

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
