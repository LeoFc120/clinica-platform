import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';

// Crear una nueva cita
export const createAppointment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { date, reason, patientId, doctorId, status } = req.body;

    const newAppointment = await prisma.appointment.create({
      data: {
        date: new Date(date), // Aseguramos que sea un objeto Date válido
        reason,
        patientId,
        doctorId,
        status: status || 'PENDING',
      },
    });

    res.status(201).json({
      message: 'Cita creada exitosamente',
      data: newAppointment,
    });
  } catch (error) {
    next(error); // Pasamos el error al errorHandler global
  }
};

// Obtener todas las citas
export const getAppointments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const appointments = await prisma.appointment.findMany({
      include: {
        patient: {
          select: { firstName: true, lastName: true, phone: true }, // Solo traemos datos relevantes
        },
        doctor: {
          select: { name: true, role: true },
        },
      },
      orderBy: {
        date: 'asc', // Ordenamos de la más próxima a la más lejana
      },
    });

    res.status(200).json({
      data: appointments,
    });
  } catch (error) {
    next(error);
  }
};
