import { Router } from 'express';
import { RolController } from '../controllers/rol.controller.js';
import { createRolValidation, updateRolValidation } from '../middleware/validation/rol.validation.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorizeDynamic } from '../middleware/authorize.middleware.js';

const router = Router();
const rolController = new RolController();

// Obtener todos
router.get('/',
    protect,
    authorizeDynamic('ROL_READ'),
    rolController.getAllRoles);
// Obtener por ID    
router.get('/:id',
    protect,
    authorizeDynamic('ROL_READ_ID'),
    rolController.getRolById);

// Crear uno nuevo   
router.post('/',
    protect,
    authorizeDynamic('ROL_CREATE'),
    createRolValidation,
    rolController.createRol);

// Actualizar uno existente
router.put('/:id',
    protect,
    authorizeDynamic('ROL_UPDATE'),
    updateRolValidation, rolController.updateRol);

// Eliminar (lógico)        
router.delete('/:id',
    protect,
    authorizeDynamic('ROL_DELETE'),
    rolController.deleteRol);

export default router;