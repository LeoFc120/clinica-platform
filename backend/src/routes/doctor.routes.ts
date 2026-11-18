import { Router } from 'express';
import { getDoctors } from '../controllers/doctor.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

// Endpoint protegido unicamente con JWT existente en develop
router.get('/', verifyToken, getDoctors);

export default router;
