import { Router } from 'express';
import { register, login } from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { checkRole } from '../middlewares/rbac.middleware.js';

const router = Router();

router.post('/register', verifyToken, checkRole(['ADMIN']), register);
router.post('/login', login);

export default router;
