import crypto from 'crypto';
import express from 'express';
import request from 'supertest';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

jest.mock('@prisma/client', () => ({
  Prisma: {
    TransactionIsolationLevel: {
      Serializable: 'Serializable',
    },
  },
}));
jest.mock('../../config/prisma.js', () => ({
  prisma: {
    whatsappMessage: {
      findUnique: jest.fn(),
      create: jest.fn(),
      findMany: jest.fn(),
    },
    whatsappConversation: {
      findUnique: jest.fn(),
      upsert: jest.fn(),
      update: jest.fn(),
    },
    user: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
    },
    patient: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    appointment: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

import { prisma } from '../../config/prisma.js';
import whatsappRoutes from './whatsapp.routes.js';
import { resetWhatsappRateLimit } from './whatsapp.controller.js';
import { executeWhatsappTool } from './whatsapp.tools.js';

const TEST_VERIFY_TOKEN = 'test_verify_token_2026';
const TEST_APP_SECRET = 'test_app_secret_2026';

const createTestApp = () => {
  const app = express();
  app.use(
    express.json({
      verify: (req, _res, buf) => {
        (req as express.Request & { rawBody?: Buffer }).rawBody = buf;
      },
    })
  );
  app.use('/api/whatsapp', whatsappRoutes);
  return app;
};

const signPayload = (body: unknown): string => {
  const raw = JSON.stringify(body);
  return 'sha256=' + crypto.createHmac('sha256', TEST_APP_SECRET).update(raw).digest('hex');
};

describe('Módulo WhatsApp Agent (TASK-023 / ADR-005)', () => {
  const app = createTestApp();

  beforeEach(() => {
    process.env.WHATSAPP_VERIFY_TOKEN = TEST_VERIFY_TOKEN;
    process.env.WHATSAPP_APP_SECRET = TEST_APP_SECRET;
    process.env.WHATSAPP_PHONE_NUMBER_ID = 'test_phone_number_id';
    process.env.WHATSAPP_ACCESS_TOKEN = 'test_access_token';
    resetWhatsappRateLimit();
    jest.restoreAllMocks();
  });

  describe('Webhook GET /api/whatsapp/webhook', () => {
    it('debe devolver 200 y el hub.challenge cuando el verify_token es correcto', async () => {
      const res = await request(app).get('/api/whatsapp/webhook').query({
        'hub.mode': 'subscribe',
        'hub.verify_token': TEST_VERIFY_TOKEN,
        'hub.challenge': 'challenge_12345',
      });

      expect(res.status).toBe(200);
      expect(res.text).toBe('challenge_12345');
    });

    it('debe devolver 403 cuando el verify_token es inválido', async () => {
      const res = await request(app).get('/api/whatsapp/webhook').query({
        'hub.mode': 'subscribe',
        'hub.verify_token': 'token_incorrecto',
        'hub.challenge': 'challenge_12345',
      });

      expect(res.status).toBe(403);
    });
  });

  describe('Webhook POST /api/whatsapp/webhook (Firma HMAC y Rate Limit)', () => {
    it('debe rechazar con 401 si falta o es inválida la firma X-Hub-Signature-256', async () => {
      const res = await request(app)
        .post('/api/whatsapp/webhook')
        .set('x-hub-signature-256', 'sha256=firma_falsa')
        .send({ object: 'whatsapp_business_account', entry: [] });

      expect(res.status).toBe(401);
    });

    it('debe aceptar con 200 cuando la firma HMAC es válida', async () => {
      const payload = { object: 'whatsapp_business_account', entry: [] };
      const res = await request(app)
        .post('/api/whatsapp/webhook')
        .set('x-hub-signature-256', signPayload(payload))
        .send(payload);

      expect(res.status).toBe(200);
    });

    it('debe bloquear al superar el límite de 20 mensajes por ventana para el mismo teléfono', async () => {
      const fetchSpy = jest
        .spyOn(globalThis, 'fetch')
        .mockResolvedValue({ ok: true, json: async () => ({}) } as Response);

      jest.spyOn(prisma.whatsappMessage, 'findUnique').mockResolvedValue({ id: 'dup-id' } as never);

      for (let i = 1; i <= 21; i++) {
        const payload = {
          object: 'whatsapp_business_account',
          entry: [
            {
              changes: [
                {
                  value: {
                    messages: [
                      {
                        id: `wamid_${i}`,
                        from: '5212761000001',
                        type: 'text',
                        text: { body: `Mensaje ${i}` },
                      },
                    ],
                  },
                },
              ],
            },
          ],
        };

        const res = await request(app)
          .post('/api/whatsapp/webhook')
          .set('x-hub-signature-256', signPayload(payload))
          .send(payload);

        expect(res.status).toBe(200);
        await new Promise((r) => setTimeout(r, 10));
      }

      // En el mensaje 21 se dispara 1 notificación de límite alcanzado por WhatsApp
      expect(fetchSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Herramientas de Negocio (whatsapp.tools.ts)', () => {
    it('debe rechazar consultas de horarios en fin de semana (sábado o domingo)', async () => {
      // 2026-11-28 es Sábado
      const result = await executeWhatsappTool(
        'listar_horarios_disponibles',
        { fecha: '2026-11-28' },
        '5212761336151'
      );

      expect(result.disponible).toBe(false);
      expect(String(result.mensaje)).toContain('Lunes a Viernes');
    });

    it('debe rechazar agendamiento fuera del rango 09:00 a 16:00', async () => {
      const result = await executeWhatsappTool(
        'agendar_cita',
        {
          doctorId: 'doc-1',
          fecha: '2026-12-15',
          hora: '19:00',
          motivo: 'Consulta nocturna',
        },
        '5212761336151'
      );

      expect(result.exito).toBe(false);
    });

    it('debe detectar doble reserva simultánea cuando el horario ya está ocupado', async () => {
      jest.spyOn(prisma, '$transaction').mockImplementation((async (callback: any) => {
        const fakeTx = {
          user: {
            findFirst: jest.fn<() => Promise<unknown>>().mockResolvedValue({
              id: 'doc-1',
              name: 'Dr. Housee',
            }),
          },
          appointment: {
            findFirst: jest.fn<() => Promise<unknown>>().mockResolvedValue({
              id: 'cita-existente',
              status: 'PENDING',
            }),
          },
        };
        return callback(fakeTx);
      }) as never);

      const result = await executeWhatsappTool(
        'agendar_cita',
        {
          doctorId: 'doc-1',
          fecha: '2026-12-15',
          hora: '11:00',
          motivo: 'Revisión general',
        },
        '5212761336151'
      );

      expect(result.exito).toBe(false);
      expect(String(result.error)).toContain('acaba de ser ocupado');
    });
  });
});
