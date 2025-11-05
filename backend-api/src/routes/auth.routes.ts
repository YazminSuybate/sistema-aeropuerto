import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import { loginValidation } from '../middleware/validation/auth.validation.js';

const router = Router();
const authController = new AuthController();

router.post('/login',
    loginValidation,
    authController.login);

router.post('/refresh',
    protect,
    authController.refresh);

router.post('/logout',
    protect,
    authController.logout);

export default router;