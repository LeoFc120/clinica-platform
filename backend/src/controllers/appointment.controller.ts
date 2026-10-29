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

// Obtener una cita por su ID
export const getAppointmentById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const appointment = await prisma.appointment.findUnique({
      where: { id: String(id) },
      include: {
        patient: {
          select: { firstName: true, lastName: true, phone: true },
        },
        doctor: {
          select: { name: true, role: true },
        },
      },
    });

    if (!appointment) {
      return res.status(404).json({
        status: 'error',
        message: 'Cita no encontrada',
      });
    }

    res.status(200).json({
      status: 'success',
      data: appointment,
    });
  } catch (error) {
    next(error);
  }
};

// Actualizar una cita existente
export const updateAppointment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { date, reason, patientId, doctorId, status } = req.body;

    // Verificar si la cita existe
    const existingAppointment = await prisma.appointment.findUnique({
      where: { id: String(id) },
    });

    if (!existingAppointment) {
      return res.status(404).json({
        status: 'error',
        message: 'Cita no encontrada',
      });
    }

    // Actualizar la cita
    const updatedAppointment = await prisma.appointment.update({
      where: { id: String(id) },
      data: {
        ...(date && { date: new Date(date) }),
        ...(reason && { reason }),
        ...(patientId && { patientId }),
        ...(doctorId && { doctorId }),
        ...(status && { status }),
      },
    });

    res.status(200).json({
      status: 'success',
      message: 'Cita actualizada exitosamente',
      data: updatedAppointment,
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar (o cancelar) una cita
export const deleteAppointment = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Verificar si la cita existe
    const existingAppointment = await prisma.appointment.findUnique({
      where: { id: String(id) },
    });

    if (!existingAppointment) {
      return res.status(404).json({
        status: 'error',
        message: 'Cita no encontrada',
      });
    }

    // Eliminar la cita de la base de datos
    await prisma.appointment.delete({
      where: { id: String(id) },
    });

    res.status(200).json({
      status: 'success',
      message: 'Cita eliminada exitosamente',
    });
  } catch (error) {
    next(error);
  }
};
