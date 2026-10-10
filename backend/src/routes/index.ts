import { Router } from 'express';
import healthRoutes from './health.routes.js';
import patientRoutes from './patient.routes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/patients', patientRoutes);

export default router;
