import express from 'express';
import userRoutes from './routes/usuario.routes.js';
const app = express();
const PORT = 3000;
app.use(express.json());
// **Rutas de la API**
app.use('/api/usuarios', userRoutes);
// Ruta de prueba
app.get('/', (_req, res) => {
    res.send('API de Usuarios en Express, TypeScript y Prisma/MySQL');
});
// Inicio del servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
//# sourceMappingURL=index.js.map