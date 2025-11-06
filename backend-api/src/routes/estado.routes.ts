import { Router } from 'express';
import { EstadoController } from '../controllers/estado.controller.js';
import { createEstadoValidation, updateEstadoValidation } from '../middleware/validation/estado.validation.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorizeDynamic } from '../middleware/authorize.middleware.js';

const router = Router();
const estadoController = new EstadoController();

// Obtener todos
router.get('/',
    protect,
    authorizeDynamic('ESTADO_READ'),
    estadoController.getAll);

// Obtener por ID
router.get('/:id',
    protect,
    authorizeDynamic('ESTADO_READ_ID'),
    estadoController.getById);

// Crear uno nuevo
router.post('/',
    protect,
    authorizeDynamic('ESTADO_CREATE'),
    createEstadoValidation, estadoController.create);

// Actualizar uno existente
router.put('/:id',
    protect,
    authorizeDynamic('ESTADO_UPDATE'),
    updateEstadoValidation, estadoController.update);

// Eliminar
router.delete('/:id',
    protect,
    authorizeDynamic('ESTADO_DELETE'),
    estadoController.remove);

export default router;