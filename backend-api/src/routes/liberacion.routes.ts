import { Router } from 'express';
import { LiberacionController } from '../controllers/liberacion.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorizeDynamic } from '../middleware/authorize.middleware.js';
// (Aquí iría la validación con express-validator si la tienes)
// import { createLiberacionValidation } from '../middleware/validation/liberacion.validation.js';

const router = Router();
const controller = new LiberacionController();

// --- Rutas Principales ---

/**
 * @route   POST /api/liberaciones
 * @desc    Un usuario (Junior) libera un ticket que le pertenece.
 * @access  Privado (Requiere permiso TICKET_RELEASE)
 */
router.post('/',
    protect,
    authorizeDynamic('TICKET_RELEASE'), // Asumo que este es el permiso
    // createLiberacionValidation,
    controller.createLiberacion
);

/**
 * @route   GET /api/liberaciones/ticket/:id_ticket
 * @desc    Ver el historial de liberaciones de un ticket específico.
 * @access  Privado (Requiere permiso TICKET_READ_ID)
 */
router.get('/ticket/:id_ticket',
    protect,
    authorizeDynamic('TICKET_READ_ID'), // Si puedes ver el ticket, puedes ver su historial
    controller.getLiberacionesByTicketId
);


// --- Rutas de Administración ---

/**
 * @route   GET /api/liberaciones
 * @desc    Ver TODAS las liberaciones (Log de Admin).
 * @access  Privado (Requiere permiso LOGS_READ_ALL)
 */
router.get('/',
    protect,
    authorizeDynamic('LOGS_READ_ALL'), // Un permiso de administrador
    controller.getAllLiberaciones
);

/**
 * @route   DELETE /api/liberaciones/:id
 * @desc    Eliminar un registro de liberación (Admin).
 * @access  Privado (Requiere permiso LOGS_DELETE)
 */
router.delete('/:id',
    protect,
    authorizeDynamic('LOGS_DELETE'), // Un permiso de administrador
    controller.deleteLiberacion
);

export default router;