import { Router } from 'express';
import { AreaController } from '../controllers/area.controller.js';
import { createAreaValidation, updateAreaValidation } from '../middleware/validation/area.validation.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorizeDynamic } from '../middleware/authorize.middleware.js';

const router = Router();
const areaController = new AreaController();

// Obtener todos
router.get('/',
    protect,
    authorizeDynamic('AREA_READ'),
    areaController.getAllAreas);

// Obtener por ID
router.get('/:id',
    protect,
    authorizeDynamic('AREA_READ_ID'),
    areaController.getAreaById);

// Crear uno nuevo
router.post('/',
    protect,
    authorizeDynamic('AREA_CREATE'),
    createAreaValidation, areaController.createArea);

// Actualizar uno existente
router.put('/:id',
    protect,
    authorizeDynamic('AREA_UPDATE'),
    updateAreaValidation, areaController.updateArea);

// Eliminación lógica
router.delete('/:id',
    protect,
    authorizeDynamic('AREA_DELETE'),
    areaController.deleteArea);

export default router;