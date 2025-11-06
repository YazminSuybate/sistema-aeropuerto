import { Router } from 'express';
import { CategoriaController } from '../controllers/categoria.controller.js';
import { createCategoriaValidation, updateCategoriaValidation } from '../middleware/validation/categoria.validation.js';
import { protect } from '../middleware/auth.middleware.js';
import { authorizeDynamic } from '../middleware/authorize.middleware.js';

const router = Router();
const categoriaController = new CategoriaController();

// Obtener todos
router.get('/',
    protect,
    authorizeDynamic('CATEGORIA_READ'),
    categoriaController.getAll);

// Obtener por ID
router.get('/:id',
    protect,
    authorizeDynamic('CATEGORIA_READ_ID'),
    categoriaController.getById);

// Crear uno nuevo
router.post('/',
    protect,
    authorizeDynamic('CATEGORIA_CREATE'),
    createCategoriaValidation, categoriaController.create);

// Actualizar uno existente
router.put('/:id',
    protect,
    authorizeDynamic('CATEGORIA_UPDATE'),
    updateCategoriaValidation, categoriaController.update);

// Eliminar
router.delete('/:id',
    protect,
    authorizeDynamic('CATEGORIA_DELETE'),
    categoriaController.remove);

export default router;