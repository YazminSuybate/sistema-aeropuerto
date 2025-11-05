import { Router } from 'express';
import { UsuarioController } from '../controllers/usuario.controller.js';
import { createUsuarioValidation, updateUsuarioValidation } from '../middleware/usuario.validation.js';

const router = Router();
const usuarioController = new UsuarioController();

router.get('/', usuarioController.getAll);             // Obtener todos
router.get('/:id', usuarioController.getById);         // Obtener por ID
router.post('/', createUsuarioValidation, usuarioController.create);            // Crear uno nuevo
router.put('/:id', updateUsuarioValidation, usuarioController.update);          // Actualizar uno existente
router.delete('/:id', usuarioController.remove);       // Eliminación lógica

export default router;