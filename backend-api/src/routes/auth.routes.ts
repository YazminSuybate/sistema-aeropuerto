import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { loginValidation } from '../middleware/validation/auth.validation.js';

const router = Router();
const authController = new AuthController();

router.post('/login',
    loginValidation,
    authController.login);

// --- ¡ESTA ES LA RUTA QUE FALTA Y ARREGLA EL 404! ---
// Tu index.ts usa '/api' como prefijo, así que la ruta completa
// será GET /api/auth/profile, que es lo que el frontend llama.
router.get(
  '/auth/profile',
  protect, // <-- ¡Importante! Asegura que solo usuarios con token puedan verla
  authController.getProfile // <-- El método que ya añadimos al controlador
);
// --- FIN DE LA RUTA NUEVA ---

router.post('/refresh',
    protect,
    authController.refresh);

router.post('/logout',
    protect,
    authController.logout);

export default router;