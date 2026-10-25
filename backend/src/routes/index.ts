import { Router } from 'express';
import healthRoutes from './health.routes.js';
import patientRoutes from './patient.routes.js';
import authRoutes from './auth.routes.js';
import appointmentRoutes from './appointment.routes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/patients', patientRoutes);
router.use('/auth', authRoutes);
router.use('/appointments', appointmentRoutes);

export default router;
