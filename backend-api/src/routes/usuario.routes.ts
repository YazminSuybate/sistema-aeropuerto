import { Router } from 'express';
import { UsuarioController } from '../controllers/usuario.controller.js';
import { createUsuarioValidation, updateUsuarioValidation } from '../middleware/validation/usuario.validation.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorizeDynamic } from '../middleware/authorize.middleware.js';

const router = Router();
const usuarioController = new UsuarioController();

// Obtener todos
router.get('/',
    protect,
    authorizeDynamic('USUARIO_READ'),
    usuarioController.getAll);

// Obtener por ID
router.get('/:id',
    protect,
    authorizeDynamic('USUARIO_READ_ID'),
    usuarioController.getById);

// Crear uno nuevo
router.post('/',
    protect,
    authorizeDynamic('USUARIO_CREATE'),
    createUsuarioValidation, usuarioController.create);

// Actualizar uno existente
router.put('/:id',
    protect,
    authorizeDynamic('USUARIO_UPDATE'),
    updateUsuarioValidation, usuarioController.update);

// Eliminación lógica
router.delete('/:id',
    protect,
    authorizeDynamic('USUARIO_DELETE'),
    usuarioController.remove);

export default router;