import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js'; 

const router = Router();
const authController = new AuthController();

router.post('/login', authController.login);
router.post('/refresh', authController.refresh);

router.post('/logout', protect, authController.logout);


export default router;