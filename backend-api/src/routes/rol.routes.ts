import { Router } from 'express';
import { RolController } from '../controllers/rol.controller.js';

const router = Router();
const rolController = new RolController();

router.get('/', rolController.getAllRoles);             // Obtener todos
router.get('/:id', rolController.getRolById);         // Obtener por ID
router.post('/', rolController.createRol);            // Crear uno nuevo
router.put('/:id', rolController.updateRol);          // Actualizar uno existente
router.delete('/:id', rolController.deleteRol);       // Eliminación lógica

export default router;