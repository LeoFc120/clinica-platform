import crypto from 'crypto';
import type { Request, Response } from 'express';
import { sendMessage } from './whatsapp.provider.js';
import { processIncomingWhatsappMessage } from './agent.service.js';

interface RequestWithRawBody extends Request {
  rawBody?: Buffer;
}

interface RateLimitEntry {
  timestamps: number[];
  notifiedInWindow: boolean;
}

const RATE_LIMIT_MAX_MESSAGES = 20;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutos
const phoneRateLimits = new Map<string, RateLimitEntry>();

export const resetWhatsappRateLimit = (): void => {
  phoneRateLimits.clear();
};

export const checkPhoneRateLimit = (
  phone: string,
  nowMs: number = Date.now()
): { allowed: boolean; shouldNotify: boolean } => {
  const key = phone.replace(/\D/g, '') || phone;
  const windowStart = nowMs - RATE_LIMIT_WINDOW_MS;
  const current = phoneRateLimits.get(key) ?? {
    timestamps: [],
    notifiedInWindow: false,
  };

  current.timestamps = current.timestamps.filter((ts) => ts > windowStart);

  if (current.timestamps.length === 0) {
    current.notifiedInWindow = false;
  }

  if (current.timestamps.length >= RATE_LIMIT_MAX_MESSAGES) {
    const shouldNotify = !current.notifiedInWindow;
    current.notifiedInWindow = true;
    phoneRateLimits.set(key, current);
    return { allowed: false, shouldNotify };
  }

  current.timestamps.push(nowMs);
  phoneRateLimits.set(key, current);
  return { allowed: true, shouldNotify: false };
};

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

// POST /api/whatsapp/webhook — Recepción de mensajes y ejecución del Agente IA (F4/F5)
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
            const senderPhone = String(msg.from);
            const rateStatus = checkPhoneRateLimit(senderPhone);

            if (!rateStatus.allowed) {
              console.warn('[WhatsApp RateLimit] Límite excedido para teléfono:', senderPhone);
              if (rateStatus.shouldNotify) {
                await sendMessage(
                  senderPhone,
                  'Has alcanzado el límite temporal de mensajes. Por favor espera unos minutos antes de volver a escribir.'
                );
              }
              continue;
            }

            const reply = await processIncomingWhatsappMessage({
              externalId: typeof msg.id === 'string' ? msg.id : undefined,
              senderPhone,
              text: String(msg.text.body),
            });

            if (reply) {
              await sendMessage(senderPhone, reply);
            }
          }
        }
      }
    }
  } catch (error) {
    console.error('[WhatsApp Agent F4 Error]:', error);
  }
};