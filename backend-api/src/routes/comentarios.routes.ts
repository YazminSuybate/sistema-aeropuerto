import { Router } from 'express';
import { ComentarioController } from '../controllers/comentarios.controller.js';
import { createComentarioValidation, updateComentarioValidation } from '../middleware/validation/comentarios.validation.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorizeDynamic } from '../middleware/authorize.middleware.js';

const router = Router();
const comentarioController = new ComentarioController();

// Obtener todos (asumiendo que se obtendrán por ticket, pero siguiendo el patrón)
// Si getAll no es necesario o debe ser por ticket_id, este endpoint podría cambiar.
// Por ahora, sigo el patrón exacto.
router.get('/',
    protect,
    authorizeDynamic('COMENTARIO_READ'),
    comentarioController.getAll);

// Obtener por ID
router.get('/:id',
    protect,
    authorizeDynamic('COMENTARIO_READ_ID'),
    comentarioController.getById);

// Crear uno nuevo
router.post('/',
    protect,
    authorizeDynamic('COMENTARIO_CREATE'),
    createComentarioValidation, 
    comentarioController.create);

// Actualizar uno existente
router.put('/:id',
    protect,
    authorizeDynamic('COMENTARIO_UPDATE'),
    updateComentarioValidation, 
    comentarioController.update);

// Eliminar
router.delete('/:id',
    protect,
    authorizeDynamic('COMENTARIO_DELETE'),
    comentarioController.remove);

export default router;