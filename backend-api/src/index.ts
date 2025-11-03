import express from 'express';
import type { Application } from 'express';
import userRoutes from './routes/usuario.routes.js';
import rolRoutes from './routes/rol.routes.js';
import areaRoutes from './routes/area.routes.js';
import authRoutes from './routes/auth.routes.js';

const app: Application = express();
const PORT = 3000;

app.use(express.json());

// Rutas de la API
app.use('/api/usuarios', userRoutes);
app.use('/api/roles', rolRoutes);
app.use('/api/area', areaRoutes);
app.use('/api', authRoutes);


// Ruta de prueba
app.get('/', (_req, res) => {
    res.send('Backend Jira en Express, TypeScript y Prisma/MySQL');
});

// Inicio del servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});