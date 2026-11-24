import { Router } from 'express';
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} from '../controllers/appointment.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { validateBody } from '../middlewares/validate.middleware.js';
import { checkRole } from '../middlewares/rbac.middleware.js';
import { createAppointmentSchema, updateAppointmentSchema } from '../schemas/appointment.schema.js';

const router = Router();

// Aplicamos el middleware verifyToken a todas las rutas de citas
router.use(verifyToken);

// Rutas protegidas con control de roles (RBAC) y validación de datos (Zod)
router.post(
  '/',
  checkRole(['ADMIN', 'DOCTOR', 'PATIENT']),
  validateBody(createAppointmentSchema),
  createAppointment
);

router.get('/', checkRole(['ADMIN', 'DOCTOR', 'PATIENT']), getAppointments);

router.get('/:id', checkRole(['ADMIN', 'DOCTOR', 'PATIENT']), getAppointmentById);

router.put(
  '/:id',
  checkRole(['ADMIN', 'DOCTOR']),
  validateBody(updateAppointmentSchema),
  updateAppointment
);

router.delete('/:id', checkRole(['ADMIN']), deleteAppointment);

export default router;
