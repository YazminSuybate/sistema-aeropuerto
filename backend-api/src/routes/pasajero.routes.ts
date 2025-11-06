import { Router } from 'express';
import { PasajeroController } from '../controllers/pasajero.controller.js';
import { createPasajeroValidation, updatePasajeroValidation } from '../middleware/validation/pasajero.validation.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorizeDynamic } from '../middleware/authorize.middleware.js';

const router = Router();
const pasajeroController = new PasajeroController();

// Obtener todos
router.get('/',
    protect,
    authorizeDynamic('PASAJERO_READ'),
    pasajeroController.getAll);

// Obtener por ID
router.get('/:id',
    protect,
    authorizeDynamic('PASAJERO_READ_ID'),
    pasajeroController.getById);

// Crear uno nuevo
router.post('/',
    protect,
    authorizeDynamic('PASAJERO_CREATE'),
    createPasajeroValidation, pasajeroController.create);

// Actualizar uno existente
router.put('/:id',
    protect,
    authorizeDynamic('PASAJERO_UPDATE'),
    updatePasajeroValidation, pasajeroController.update);

// Eliminar
router.delete('/:id',
    protect,
    authorizeDynamic('PASAJERO_DELETE'),
    pasajeroController.remove);

export default router;