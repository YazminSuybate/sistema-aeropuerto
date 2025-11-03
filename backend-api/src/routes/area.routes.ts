import { Router } from 'express';
import { AreaController } from '../controllers/area.controller.js';

const router = Router();
const areaController = new AreaController();

router.get('/', areaController.getAllAreas);             // Obtener todos
router.get('/:id', areaController.getAreaById);         // Obtener por ID
router.post('/', areaController.createArea);            // Crear uno nuevo
router.put('/:id', areaController.updateArea);          // Actualizar uno existente
router.delete('/:id', areaController.deleteArea);       // Eliminación lógica

export default router;