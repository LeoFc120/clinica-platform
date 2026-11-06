import type { Request, Response, NextFunction } from 'express';

export const checkRole = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user; // Extraído previamente por tu auth.middleware.ts

    if (!user || !user.role) {
      res.status(401).json({ message: 'No autenticado o rol no identificado' });
      return;
    }

    if (!allowedRoles.includes(user.role)) {
      res.status(403).json({
        message: 'Acceso denegado: No tienes permisos suficientes para realizar esta acción',
      });
      return;
    }

    next();
  };
};
