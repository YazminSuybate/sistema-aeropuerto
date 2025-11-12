import { Router } from 'express';
import { HistorialTicketsController } from '../controllers/historialtickets.controller.js';
import { createHistorialTicketValidation, updateHistorialTicketValidation } from '../middleware/validation/historialtickets.validation.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorizeDynamic } from '../middleware/authorize.middleware.js';

const router = Router();
const historialController = new HistorialTicketsController();

// Obtener todos
router.get('/',
    protect,
    authorizeDynamic('HISTORIALTICKET_READ'),
    historialController.getAll);

// Obtener por ID
router.get('/:id',
    protect,
    authorizeDynamic('HISTORIALTICKET_READ_ID'),
    historialController.getById);

// Crear uno nuevo
// (Aunque un historial usualmente no se crea manualmente, seguimos el patrón)
router.post('/',
    protect,
    authorizeDynamic('HISTORIALTICKET_CREATE'),
    createHistorialTicketValidation, 
    historialController.create);

// Actualizar uno existente
// (Esto es muy inusual para un log, pero seguimos el patrón)
router.put('/:id',
    protect,
    authorizeDynamic('HISTORIALTICKET_UPDATE'),
    updateHistorialTicketValidation, 
    historialController.update);

// Eliminar
// (Esto es muy inusual para un log, pero seguimos el patrón)
router.delete('/:id',
    protect,
    authorizeDynamic('HISTORIALTICKET_DELETE'),
    historialController.remove);

export default router;