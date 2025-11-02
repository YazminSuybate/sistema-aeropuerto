import { Router } from 'express';
import { UsuarioController } from '../controllers/usuario.controller.js';

const router = Router();
const usuarioController = new UsuarioController();

// Definición de Rutas CRUD
router.get('/', usuarioController.getAll);             // Obtener todos
router.get('/:id', usuarioController.getById);         // Obtener por ID
router.post('/', usuarioController.create);            // Crear uno nuevo
router.put('/:id', usuarioController.update);          // Actualizar uno existente
router.delete('/:id', usuarioController.remove);       // Eliminación lógica

export default router;