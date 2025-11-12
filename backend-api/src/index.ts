import express from "express";
import cors from "cors";
import type { Application } from "express";
import userRoutes from "./routes/usuario.routes.js";
import rolRoutes from "./routes/rol.routes.js";
import areaRoutes from "./routes/area.routes.js";
import authRoutes from "./routes/auth.routes.js";
import categoriaRoutes from "./routes/categoria.routes.js";
import estadoRoutes from "./routes/estado.routes.js";
import pasajeroRoutes from "./routes/pasajero.routes.js";
import ticketRoutes from "./routes/ticket.routes.js";

//import Jesus
import comentariosRoutes from './routes/comentarios.routes.js';
import histoticketRoutes from './routes/historialtickets.routes.js';

const app: Application = express();
const PORT = 3000;

const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));

app.use(express.json());

// Rutas de la API
app.use("/api/usuarios", userRoutes);
app.use("/api/roles", rolRoutes);
app.use("/api/areas", areaRoutes);
app.use("/api/categorias", categoriaRoutes);
app.use("/api/estados", estadoRoutes);
app.use("/api/pasajeros", pasajeroRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api", authRoutes);

//Jesus-(Comentarios,HistorialTickets)
app.use('/api/comentarios', comentariosRoutes);
app.use('/api/historialtickets', histoticketRoutes);

// Inicio del servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
