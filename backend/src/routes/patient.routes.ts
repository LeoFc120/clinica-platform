import { Router } from 'express';
import {
  createPatient,
  getPatients,
  updatePatient,
  deletePatient,
} from '../controllers/patient.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

// Rutas protegidas con el middleware verifyToken
router.post('/', verifyToken, createPatient);
router.get('/', verifyToken, getPatients);

// Rutas con parámetro dinámico :id también protegidas
router.put('/:id', verifyToken, updatePatient);
router.delete('/:id', verifyToken, deletePatient);

export default router;
