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
