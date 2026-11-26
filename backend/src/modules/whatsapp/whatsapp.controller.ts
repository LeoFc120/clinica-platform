import crypto from 'crypto';
import type { Request, Response } from 'express';
import { sendMessage } from './whatsapp.provider.js';

interface RequestWithRawBody extends Request {
  rawBody?: Buffer;
}

const isValidSignature = (req: RequestWithRawBody): boolean => {
  const appSecret = process.env.WHATSAPP_APP_SECRET;
  const signatureHeader = req.headers['x-hub-signature-256'];

  if (!appSecret || typeof signatureHeader !== 'string' || !req.rawBody) {
    return false;
  }

  const expectedHash =
    'sha256=' +
    crypto.createHmac('sha256', appSecret).update(req.rawBody).digest('hex');

  const sigBuffer = Buffer.from(signatureHeader);
  const expectedBuffer = Buffer.from(expectedHash);

  if (sigBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(sigBuffer, expectedBuffer);
};

// GET /api/whatsapp/webhook — Verificación inicial de Meta
export const verifyWebhook = (req: Request, res: Response): void => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    res.status(200).send(challenge);
    return;
  }

  res.sendStatus(403);
};

// POST /api/whatsapp/webhook — Recepción de mensajes (Modo Eco en F2)
export const handleWebhook = (req: Request, res: Response): void => {
  console.log('[WhatsApp POST] Petición recibida de Meta');

  if (!isValidSignature(req as RequestWithRawBody)) {
    console.warn('[WhatsApp POST] Firma X-Hub-Signature-256 inválida');
    res.sendStatus(401);
    return;
  }

  res.sendStatus(200);
  void processIncomingPayload(req.body);
};

const processIncomingPayload = async (body: any): Promise<void> => {
  try {
    const entries = body?.entry;
    if (!Array.isArray(entries)) return;

    for (const entry of entries) {
      const changes = entry?.changes;
      if (!Array.isArray(changes)) continue;

      for (const change of changes) {
        const messages = change?.value?.messages;
        if (!Array.isArray(messages)) continue;

        for (const msg of messages) {
          if (msg.type === 'text' && msg.from && msg.text?.body) {
            await sendMessage(msg.from, `Eco: ${msg.text.body}`);
          }
        }
      }
    }
  } catch (error) {
    console.error('[WhatsApp Webhook F2 Error]:', error);
  }
};