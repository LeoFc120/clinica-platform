import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma.js';

export const getDoctors = async (
  _req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const doctors = await prisma.user.findMany({
      where: { role: 'DOCTOR' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    res.status(200).json({
      status: 'success',
      data: doctors,
    });
  } catch (error) {
    next(error);
  }
};
