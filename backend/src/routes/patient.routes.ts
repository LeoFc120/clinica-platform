import { Router } from 'express';
import {
  createPatient,
  getPatients,
  updatePatient,
  deletePatient,
} from '../controllers/patient.controller.js';

const router = Router();

router.post('/', createPatient);
router.get('/', getPatients);

// Nuevas rutas con parámetro dinámico :id
router.put('/:id', updatePatient);
router.delete('/:id', deletePatient);

export default router;
