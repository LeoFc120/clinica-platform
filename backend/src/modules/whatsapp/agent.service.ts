import {
  GoogleGenAI,
  ThinkingLevel,
  type Content,
  type Part,
} from '@google/genai';
import { prisma } from '../../config/prisma.js';
import {
  whatsappToolDeclarations,
  executeWhatsappTool,
} from './whatsapp.tools.js';

const MAX_HISTORY_MESSAGES = 8;
const MAX_TOOL_ITERATIONS = 5;
const SESSION_TIMEOUT_MS = 12 * 60 * 60 * 1000; // 12 horas
const FALLBACK_REPLY =
  'En este momento tengo un problema técnico para procesar tu solicitud. Por favor intenta de nuevo en unos minutos o comunícate directamente con la clínica.';

const WELCOME_REPLY = [
  '¡Hola! 👋 Bienvenido a *Clínica Platform*.',
  '',
  'Soy tu asistente virtual de recepción. Puedo ayudarte con:',
  '• *Consultar horarios* disponibles (Lunes a Viernes de 09:00 a 16:00 hrs.)',
  '• *Agendar* una cita médica',
  '• *Consultar o cancelar* tus citas activas',
  '',
  '¿En qué te puedo ayudar hoy?',
].join('\n');

const GREETING_REGEX =
  /^(hola+|buen[oa]s(\s+(dias|días|tardes|noches))?|que\s+tal|qué\s+tal|hey|hi|hello|inicio|empezar|menu|menú|ayuda|info|informacion|información)[!?.¡¿\s]*$/i;

const getCurrentMexicoDateInfo = (): string => {
  const nowMexico = new Date(Date.now() - 6 * 60 * 60 * 1000);
  const yyyy = nowMexico.getUTCFullYear();
  const mm = String(nowMexico.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(nowMexico.getUTCDate()).padStart(2, '0');
  const hh = String(nowMexico.getUTCHours()).padStart(2, '0');
  const min = String(nowMexico.getUTCMinutes()).padStart(2, '0');
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const dayName = days[nowMexico.getUTCDay()];
  return `${dayName} ${yyyy}-${mm}-${dd} ${hh}:${min} (America/Mexico_City)`;
};

const buildSystemInstruction = (senderPhone: string): string => {
  return [
    'Eres el asistente de recepción de Clínica Platform por WhatsApp.',
    `Hoy: ${getCurrentMexicoDateInfo()}. Teléfono: ${senderPhone}.`,
    'Reglas:',
    '1. Español, breve, cordial y directo (formato WhatsApp, sin tablas).',
    '2. Al consultar/agendar/cancelar, llama primero a buscar_paciente.',
    '3. Horario: Lunes a Viernes 09:00-17:00 (última cita 16:00, bloques de 1h). Nunca fines de semana ni fuera de horario.',
    '4. Usa solo datos devueltos por las herramientas; nunca inventes médicos, horarios ni IDs ni reveles UUIDs.',
    '5. Si encontrado=false, pide en un mensaje: nombre completo, fecha de nacimiento (YYYY-MM-DD) y motivo antes de agendar_cita.',
    '6. NUNCA ejecutes agendar_cita ni cancelar_cita sin mostrar resumen (médico, fecha, hora) y recibir confirmación explícita ("sí", "confirmo").',
    '7. No des diagnósticos ni medicamentos; deriva cualquier síntoma a agendar consulta médica.',
    '8. Convierte fechas relativas a YYYY-MM-DD según la fecha actual.',
  ].join('\n');
};

const buildSanitizedContents = (
  messages: Array<{ role: string; content: string }>
): Content[] => {
  const sanitized: Content[] = [];

  for (const msg of messages) {
    const role: 'user' | 'model' = msg.role === 'assistant' ? 'model' : 'user';
    const last = sanitized[sanitized.length - 1];

    if (last && last.role === role) {
      last.parts = [...(last.parts ?? []), { text: msg.content }];
    } else {
      sanitized.push({
        role,
        parts: [{ text: msg.content }],
      });
    }
  }

  while (sanitized.length > 0 && sanitized[sanitized.length - 1]?.role !== 'user') {
    sanitized.pop();
  }

  return sanitized;
};

export interface IncomingWhatsappInput {
  externalId?: string;
  senderPhone: string;
  text: string;
}

export const processIncomingWhatsappMessage = async (
  input: IncomingWhatsappInput
): Promise<string | null> => {
  const { externalId, senderPhone, text } = input;
  const cleanText = text.trim();
  if (!cleanText) return null;

  // 1. Idempotencia: evitar procesar dos veces el mismo wamid si Meta reintenta
  if (externalId) {
    const existing = await prisma.whatsappMessage.findUnique({
      where: { externalId },
      select: { id: true },
    });
    if (existing) {
      return null;
    }
  }

  // 2. Verificar estado previo para detectar chat nuevo o sesión expirada
  const previousConversation = await prisma.whatsappConversation.findUnique({
    where: { phone: senderPhone },
    select: { id: true, lastMessageAt: true },
  });

  const now = new Date();
  const isNewOrExpiredSession =
    !previousConversation ||
    now.getTime() - previousConversation.lastMessageAt.getTime() > SESSION_TIMEOUT_MS;

  const conversation = await prisma.whatsappConversation.upsert({
    where: { phone: senderPhone },
    update: { lastMessageAt: now },
    create: { phone: senderPhone, lastMessageAt: now },
  });

  // 3. Guardar mensaje entrante del usuario
  await prisma.whatsappMessage.create({
    data: {
      externalId: externalId ?? null,
      conversationId: conversation.id,
      role: 'user',
      content: cleanText,
    },
  });

  // 3.1 Ahorro de tokens: bienvenida automática local (0 tokens) ante saludos simples
  if (GREETING_REGEX.test(cleanText)) {
    await prisma.whatsappMessage.create({
      data: {
        conversationId: conversation.id,
        role: 'assistant',
        content: WELCOME_REPLY,
      },
    });
    return WELCOME_REPLY;
  }

  // 4. Cargar historial reciente de la sesión activa y asegurar alternancia 'user'/'model'
  const sessionCutoff = isNewOrExpiredSession
    ? new Date(now.getTime() - 60 * 1000)
    : new Date(now.getTime() - SESSION_TIMEOUT_MS);

  const recentMessages = await prisma.whatsappMessage.findMany({
    where: {
      conversationId: conversation.id,
      createdAt: { gte: sessionCutoff },
    },
    orderBy: { createdAt: 'desc' },
    take: MAX_HISTORY_MESSAGES,
  });

  const contents = buildSanitizedContents(recentMessages.reverse());
  if (contents.length === 0 || contents[contents.length - 1]?.role !== 'user') {
    contents.push({ role: 'user', parts: [{ text: cleanText }] });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.error('[WhatsApp Agent][Config Error] Falta GEMINI_API_KEY en .env', {
      senderPhone,
      externalId,
    });
    return FALLBACK_REPLY;
  }

  const model = process.env.GEMINI_MODEL?.trim() || 'gemini-3.5-flash-lite';
  const ai = new GoogleGenAI({ apiKey });

  let finalReply: string | null = null;

  // 5. Bucle de conversación + Function Calling con Gemini 3.5 (ThinkingLevel.LOW)
  try {
    for (let step = 0; step < MAX_TOOL_ITERATIONS; step++) {
      if (contents[contents.length - 1]?.role !== 'user') {
        throw new Error('Estado inválido de conversación: el último turno no tiene rol user');
      }

      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction: buildSystemInstruction(senderPhone),
          tools: [{ functionDeclarations: whatsappToolDeclarations }],
          thinkingConfig: {
            thinkingLevel: ThinkingLevel.LOW,
          },
          temperature: 0.2,
        },
      });

      const functionCalls = response.functionCalls;

      if (!functionCalls || functionCalls.length === 0) {
        if (response.text && response.text.trim().length > 0) {
          finalReply = response.text.trim();
        }
        break;
      }

      // Preservamos los parts completos del modelo (incluye thoughtSignature en Gemini 3.x)
      const candidateParts = response.candidates?.[0]?.content?.parts;
      const modelParts: Part[] =
        candidateParts && candidateParts.length > 0
          ? candidateParts
          : functionCalls.map((fc) => ({
              functionCall: {
                name: fc.name,
                args: fc.args ?? {},
              },
            }));

      contents.push({ role: 'model', parts: modelParts });

      const responseParts: Part[] = [];
      for (const fc of functionCalls) {
        const toolName = fc.name ?? '';
        const toolArgs = (fc.args ?? {}) as Record<string, unknown>;
        const toolResult = await executeWhatsappTool(toolName, toolArgs, senderPhone);

        if (
          toolName === 'buscar_paciente' &&
          toolResult.encontrado === true &&
          typeof (toolResult.paciente as { id?: string } | undefined)?.id === 'string'
        ) {
          await prisma.whatsappConversation.update({
            where: { id: conversation.id },
            data: { patientId: (toolResult.paciente as { id: string }).id },
          });
        }

        responseParts.push({
          functionResponse: {
            name: toolName,
            response: toolResult,
          },
        });
      }

      // Respuesta de herramientas siempre en turno con rol 'user'
      contents.push({ role: 'user', parts: responseParts });
    }

    if (!finalReply) {
      console.error('[WhatsApp Agent][Max Iterations] Se agotaron las iteraciones sin respuesta', {
        senderPhone,
        externalId,
        model,
        maxIterations: MAX_TOOL_ITERATIONS,
      });
      finalReply = FALLBACK_REPLY;
    }
  } catch (error) {
    console.error('[WhatsApp Agent][Gemini Error]', {
      senderPhone,
      externalId,
      model,
      error,
    });
    finalReply = FALLBACK_REPLY;
  }

  // 6. Guardar respuesta final (o respaldo) del asistente en WhatsappMessage
  await prisma.whatsappMessage.create({
    data: {
      conversationId: conversation.id,
      role: 'assistant',
      content: finalReply,
    },
  });

  return finalReply;
};