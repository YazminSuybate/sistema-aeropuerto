import { Router } from 'express';
import { SolicitudCambioAreaController } from '../controllers/solicitudcambioarea.controller.js';
import { createSolicitudValidation, updateSolicitudValidation } from '../middleware/validation/solicitudcambioarea.validation.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorizeDynamic } from '../middleware/authorize.middleware.js';

const router = Router();
const controller = new SolicitudCambioAreaController();

// Obtener todas
router.get('/',
    protect,
    authorizeDynamic('SOLICITUDCAMBIOAREA_READ'),
    controller.getAll);

// Obtener por ID
router.get('/:id',
    protect,
    authorizeDynamic('SOLICITUDCAMBIOAREA_READ_ID'),
    controller.getById);

// Crear una nueva solicitud
router.post('/',
    protect,
    authorizeDynamic('SOLICITUDCAMBIOAREA_CREATE'),
    createSolicitudValidation, 
    controller.create);

// Actualizar una solicitud (ej. aprobar/rechazar)
router.put('/:id',
    protect,
    authorizeDynamic('SOLICITUDCAMBIOAREA_UPDATE'),
    updateSolicitudValidation, 
    controller.update);

// Eliminar una solicitud
router.delete('/:id',
    protect,
    authorizeDynamic('SOLICITUDCAMBIOAREA_DELETE'),
    controller.remove);

export default router;