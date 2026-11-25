import 'dotenv/config'; // <-- 1. Forzamos la lectura del .env desde el primer milisegundo
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg'; // <-- 2. Usamos el administrador de conexiones de PostgreSQL
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = process.env.DATABASE_URL as string;

// 3. Creamos el Pool y se lo pasamos al adaptador
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prismaGlobal = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = prismaGlobal.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  prismaGlobal.prisma = prisma;
}
