import { z } from 'zod';

export const createAppointmentSchema = z.object({
  date: z.string().datetime({ message: 'La fecha debe tener un formato ISO8601 válido' }),
  reason: z.string().min(3, { message: 'El motivo debe tener al menos 3 caracteres' }),
  patientId: z.string().uuid({ message: 'El ID del paciente debe ser un UUID válido' }),
  doctorId: z.string().uuid({ message: 'El ID del doctor debe ser un UUID válido' }),
  status: z.enum(['PENDING', 'COMPLETED', 'CANCELLED']).optional(),
});

export const updateAppointmentSchema = createAppointmentSchema.partial();
