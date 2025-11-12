import { Router } from 'express';
import { EvidenciaController } from '../controllers/evidencia.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorizeDynamic } from '../middleware/authorize.middleware.js';
import { uploadEvidencia } from '../middleware/upload.middleware.js'; // <-- IMPORTANTE

const router = Router();
const controller = new EvidenciaController();

/**
 * @route   POST /api/evidencias/upload
 * @desc    Sube un archivo de evidencia para un ticket.
 * @access  Privado (Requiere permiso TICKET_ADD_EVIDENCE)
 */
router.post(
    '/upload',
    protect,
    authorizeDynamic('TICKET_ADD_EVIDENCE'), // Asumo este permiso
    uploadEvidencia, // 1. Multer procesa el archivo primero
    controller.createEvidencia // 2. El controlador lo recibe
);

/**
 * @route   GET /api/evidencias/ticket/:id_ticket
 * @desc    Ver todas las evidencias de un ticket.
 * @access  Privado (Requiere permiso TICKET_READ_ID)
 */
router.get(
    '/ticket/:id_ticket',
    protect,
    authorizeDynamic('TICKET_READ_ID'),
    controller.getEvidenciasByTicketId
);

/**
 * @route   DELETE /api/evidencias/:id
 * @desc    Eliminar un archivo de evidencia.
 * @access  Privado (Requiere permiso TICKET_DELETE_EVIDENCE)
 */
router.delete(
    '/:id',
    protect,
    authorizeDynamic('TICKET_DELETE_EVIDENCE'), // Asumo este permiso
    controller.deleteEvidencia
);

export default router;