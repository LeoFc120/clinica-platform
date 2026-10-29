import { Router } from 'express';
import {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
} from '../controllers/appointment.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

// Aplicamos el middleware verifyToken a todas las rutas de citas
router.use(verifyToken);

router.post('/', createAppointment);
router.get('/', getAppointments);
router.get('/:id', getAppointmentById);
router.put('/:id', updateAppointment);
router.delete('/:id', deleteAppointment);

export default router;
