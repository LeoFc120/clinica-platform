import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';

export const createPatient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Extraemos los campos exactos que definiste en tu schema.prisma
    const { firstName, lastName, dateOfBirth, phone, email } = req.body;

    const newPatient = await prisma.patient.create({
      data: {
        firstName,
        lastName,
        // Prisma requiere un objeto Date (o cadena ISO válida) para los campos DateTime
        dateOfBirth: new Date(dateOfBirth),
        phone,
        email,
      },
    });

    res.status(201).json({ status: 'success', data: newPatient });
  } catch (error) {
    next(error);
  }
};

export const getPatients = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const patients = await prisma.patient.findMany();
    res.status(200).json({ status: 'success', data: patients });
  } catch (error) {
    next(error);
  }
};

// Actualizar un paciente existente
export const updatePatient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const data = req.body;

    const updatedPatient = await prisma.patient.update({
      where: { id },
      data,
    });

    res.status(200).json({
      status: 'success',
      data: updatedPatient,
    });
  } catch (error) {
    next(error);
  }
};

// Eliminar un paciente
export const deletePatient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;

    await prisma.patient.delete({
      where: { id },
    });

    res.status(200).json({
      status: 'success',
      message: 'Paciente eliminado correctamente',
    });
  } catch (error) {
    next(error);
  }
};
