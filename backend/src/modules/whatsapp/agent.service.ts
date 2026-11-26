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

const MAX_HISTORY_MESSAGES = 12;
const MAX_TOOL_ITERATIONS = 5;
const FALLBACK_REPLY =
  'En este momento tengo un problema técnico para procesar tu solicitud. Por favor intenta de nuevo en unos minutos o comunícate directamente con la clínica.';

const getCurrentMexicoDateInfo = (): string => {
  const nowMexico = new Date(Date.now() - 6 * 60 * 60 * 1000);
  const yyyy = nowMexico.getUTCFullYear();
  const mm = String(nowMexico.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(nowMexico.getUTCDate()).padStart(2, '0');
  const hh = String(nowMexico.getUTCHours()).padStart(2, '0');
  const min = String(nowMexico.getUTCMinutes()).padStart(2, '0');
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const dayName = days[nowMexico.getUTCDay()];
  return `${dayName} ${yyyy}-${mm}-${dd}, hora local México ${hh}:${min} (zona America/Mexico_City)`;
};

const buildSystemInstruction = (senderPhone: string): string => {
  return [
    'Eres el asistente virtual de recepción de Clínica Platform por WhatsApp.',
    `Fecha y hora actual: ${getCurrentMexicoDateInfo()}.`,
    `Teléfono del usuario que escribe: ${senderPhone}.`,
    'Reglas estrictas:',
    '1. Responde siempre en español, de forma breve, clara, cordial y directa (formato WhatsApp, sin tablas complejas).',
    '2. Al iniciar una conversación o cuando el usuario pida consultar/agendar/cancelar citas, llama primero a buscar_paciente para identificar si ya está registrado y ver sus citas pendientes.',
    '3. Horario de atención: Lunes a Viernes de 09:00 a 17:00 (última cita a las 16:00, bloques de 1 hora). Nunca ofrezcas fines de semana ni horarios fuera de ese rango.',
    '4. Nunca inventes médicos, horarios ni IDs de cita; usa exclusivamente los datos devueltos por las herramientas.',
    '5. Si el paciente es nuevo (encontrado: false), antes de llamar a agendar_cita pídele en un solo mensaje su nombre completo, su fecha de nacimiento (día, mes y año) y el motivo de consulta.',
    '6. NUNCA ejecutes agendar_cita ni cancelar_cita sin haberle mostrado antes los datos exactos (médico, fecha y hora) y recibido su confirmación explícita ("sí", "confirmo", "adelante").',
    '7. Nunca des diagnósticos médicos, consejos clínicos ni recomendaciones de medicamentos; ante cualquier consulta médica o síntoma, indica que no realizas valoraciones médicas y ofrece agendar una cita con un médico de la clínica.',
    '8. Convierte fechas relativas ("mañana", "este viernes") a formato YYYY-MM-DD usando la fecha actual indicada arriba.',
    '9. Nunca reveles UUIDs internos al paciente.',
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

  // 2. Obtener o crear la conversación aislada por teléfono
  const conversation = await prisma.whatsappConversation.upsert({
    where: { phone: senderPhone },
    update: { lastMessageAt: new Date() },
    create: { phone: senderPhone, lastMessageAt: new Date() },
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

  // 4. Cargar historial reciente y asegurar alternancia válida terminando en 'user'
  const recentMessages = await prisma.whatsappMessage.findMany({
    where: { conversationId: conversation.id },
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

  // 5. Bucle de conversación + Function Calling con Gemini 3.5
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
            thinkingLevel: ThinkingLevel.MEDIUM,
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