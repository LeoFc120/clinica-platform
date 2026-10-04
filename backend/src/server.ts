import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRouter from './routes/index.js';
import { errorHandler } from './middlewares/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'OK', message: 'Clinica Platform Backend is running' });
});

// Nuevas rutas base de la API v1 (TASK-005)
app.use('/api/v1', apiRouter);

// Manejo de rutas inexistentes (404)
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    status: 'fail',
    message: 'Ruta no encontrada',
  });
});

// Middleware global de errores
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
export { app };
export default app;
