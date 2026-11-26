import { Type, type FunctionDeclaration } from '@google/genai';
import { Prisma } from '@prisma/client';
import { prisma } from '../../config/prisma.js';

const WORK_HOURS = [9, 10, 11, 12, 13, 14, 15, 16]; // Lunes a Viernes 09:00 - 17:00 (bloques de 1h)
const MEXICO_OFFSET_HOURS = 6; // America/Mexico_City (UTC-6 estándar)

const normalizePhoneDigits = (phone: string): string => {
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('521') && digits.length === 13) {
    return `52${digits.slice(3)}`;
  }
  return digits;
};

const buildMexicoDateUtc = (dateStr: string, hourLocal: number): Date | null => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr.trim());
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]) - 1;
  const day = Number(match[3]);
  const utcDate = new Date(Date.UTC(year, month, day, hourLocal + MEXICO_OFFSET_HOURS, 0, 0, 0));
  return Number.isNaN(utcDate.getTime()) ? null : utcDate;
};

const formatMexicoDateTime = (utcDate: Date): string => {
  const localMs = utcDate.getTime() - MEXICO_OFFSET_HOURS * 60 * 60 * 1000;
  const local = new Date(localMs);
  const yyyy = local.getUTCFullYear();
  const mm = String(local.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(local.getUTCDate()).padStart(2, '0');
  const hh = String(local.getUTCHours()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd} ${hh}:00`;
};

const isWeekdayMexico = (dateStr: string): boolean => {
  const noonUtc = buildMexicoDateUtc(dateStr, 12);
  if (!noonUtc) return false;
  const dayOfWeek = noonUtc.getUTCDay(); // 0 = Domingo, 6 = Sábado
  return dayOfWeek >= 1 && dayOfWeek <= 5;
};

export const whatsappToolDeclarations: FunctionDeclaration[] = [
  {
    name: 'buscar_paciente',
    description:
      'Busca al paciente por el número de teléfono de WhatsApp actual y devuelve sus datos y citas activas (PENDING).',
    parameters: {
      type: Type.OBJECT,
      properties: {},
    },
  },
  {
    name: 'listar_horarios_disponibles',
    description:
      'Lista los médicos disponibles y los horarios libres (Lunes a Viernes 09:00 a 16:00, hora de México) para una fecha YYYY-MM-DD.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        fecha: {
          type: Type.STRING,
          description: 'Fecha a consultar en formato YYYY-MM-DD (ejemplo: 2026-11-27).',
        },
        medico: {
          type: Type.STRING,
          description: 'Nombre parcial o ID opcional del médico a filtrar.',
        },
      },
      required: ['fecha'],
    },
  },
  {
    name: 'agendar_cita',
    description:
      'Agenda una cita médica validando disponibilidad en tiempo real. Si el paciente aún no está registrado, requiere nombreCompleto y fechaNacimiento.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        doctorId: {
          type: Type.STRING,
          description: 'UUID del médico elegido (obtenido de listar_horarios_disponibles).',
        },
        fecha: {
          type: Type.STRING,
          description: 'Fecha de la cita en formato YYYY-MM-DD.',
        },
        hora: {
          type: Type.STRING,
          description: 'Hora en formato HH:00 (24h, entre 09:00 y 16:00, ejemplo: 10:00).',
        },
        motivo: {
          type: Type.STRING,
          description: 'Motivo breve de la consulta médica.',
        },
        nombreCompleto: {
          type: Type.STRING,
          description: 'Nombre y apellidos del paciente (obligatorio si el paciente no existe).',
        },
        fechaNacimiento: {
          type: Type.STRING,
          description:
            'Fecha de nacimiento en formato YYYY-MM-DD (obligatorio si el paciente no existe).',
        },
      },
      required: ['doctorId', 'fecha', 'hora', 'motivo'],
    },
  },
  {
    name: 'cancelar_cita',
    description:
      'Cancela una cita pendiente perteneciente al paciente actual cambiando su estado a CANCELLED.',
    parameters: {
      type: Type.OBJECT,
      properties: {
        citaId: {
          type: Type.STRING,
          description: 'UUID de la cita a cancelar (obtenido de buscar_paciente).',
        },
      },
      required: ['citaId'],
    },
  },
];

const findPatientBySenderPhone = async (senderPhone: string) => {
  const normalized = normalizePhoneDigits(senderPhone);
  const last10 = normalized.slice(-10);

  return prisma.patient.findFirst({
    where: {
      OR: [
        { phone: senderPhone },
        { phone: normalized },
        ...(last10.length === 10 ? [{ phone: { endsWith: last10 } }] : []),
      ],
    },
    include: {
      appointments: {
        where: { status: 'PENDING' },
        include: { doctor: { select: { id: true, name: true } } },
        orderBy: { date: 'asc' },
      },
    },
  });
};

export const executeWhatsappTool = async (
  toolName: string,
  args: Record<string, unknown>,
  senderPhone: string
): Promise<Record<string, unknown>> => {
  if (toolName === 'buscar_paciente') {
    const patient = await findPatientBySenderPhone(senderPhone);
    if (!patient) {
      return {
        encontrado: false,
        mensaje:
          'No existe un paciente registrado con este teléfono. Pide su nombre completo y fecha de nacimiento antes de agendar.',
      };
    }

    return {
      encontrado: true,
      paciente: {
        id: patient.id,
        nombre: `${patient.firstName} ${patient.lastName}`.trim(),
        telefono: patient.phone,
      },
      citasPendientes: patient.appointments.map((apt) => ({
        citaId: apt.id,
        fechaHoraMexico: formatMexicoDateTime(apt.date),
        medico: apt.doctor.name,
        motivo: apt.reason,
        estado: apt.status,
      })),
    };
  }

  if (toolName === 'listar_horarios_disponibles') {
    const fecha = String(args.fecha ?? '').trim();
    const medicoFiltro = args.medico ? String(args.medico).trim().toLowerCase() : '';

    if (!/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
      return { error: 'Formato de fecha inválido. Usa YYYY-MM-DD.' };
    }

    if (!isWeekdayMexico(fecha)) {
      return {
        fecha,
        disponible: false,
        mensaje: 'La clínica atiende únicamente de Lunes a Viernes de 09:00 a 17:00.',
      };
    }

    const doctors = await prisma.user.findMany({
      where: {
        role: 'DOCTOR',
        ...(medicoFiltro
          ? {
              OR: [{ id: medicoFiltro }, { name: { contains: medicoFiltro, mode: 'insensitive' } }],
            }
          : {}),
      },
      select: { id: true, name: true },
    });

    if (doctors.length === 0) {
      return {
        fecha,
        disponible: false,
        mensaje: 'No se encontraron médicos registrados con ese criterio.',
      };
    }

    const dayStartUtc = buildMexicoDateUtc(fecha, 0)!;
    const dayEndUtc = buildMexicoDateUtc(fecha, 24)!;

    const existingAppointments = await prisma.appointment.findMany({
      where: {
        doctorId: { in: doctors.map((d) => d.id) },
        status: { not: 'CANCELLED' },
        date: { gte: dayStartUtc, lt: dayEndUtc },
      },
      select: { doctorId: true, date: true },
    });

    const now = new Date();
    const agendaPorMedico = doctors.map((doc) => {
      const busyHours = new Set(
        existingAppointments
          .filter((a) => a.doctorId === doc.id)
          .map((a) => {
            const localMs = a.date.getTime() - MEXICO_OFFSET_HOURS * 60 * 60 * 1000;
            return new Date(localMs).getUTCHours();
          })
      );

      const horariosLibres = WORK_HOURS.filter((hour) => {
        if (busyHours.has(hour)) return false;
        const slotUtc = buildMexicoDateUtc(fecha, hour)!;
        return slotUtc.getTime() > now.getTime();
      }).map((h) => `${String(h).padStart(2, '0')}:00`);

      return {
        doctorId: doc.id,
        medico: doc.name,
        horariosLibres,
      };
    });

    return {
      fecha,
      zonaHoraria: 'America/Mexico_City',
      medicos: agendaPorMedico,
    };
  }

  if (toolName === 'agendar_cita') {
    const doctorId = String(args.doctorId ?? '').trim();
    const fecha = String(args.fecha ?? '').trim();
    const horaRaw = String(args.hora ?? '').trim();
    const motivo = String(args.motivo ?? 'Consulta general').trim();
    const nombreCompleto = args.nombreCompleto ? String(args.nombreCompleto).trim() : '';
    const fechaNacimientoRaw = args.fechaNacimiento ? String(args.fechaNacimiento).trim() : '';

    const hourMatch = /^(\d{1,2}):00$/.exec(horaRaw);
    const hourLocal = hourMatch ? Number(hourMatch[1]) : -1;

    if (!doctorId || !isWeekdayMexico(fecha) || !WORK_HOURS.includes(hourLocal)) {
      return {
        exito: false,
        error:
          'Parámetros inválidos. Verifica doctorId, fecha hábil (Lunes a Viernes) y hora entre 09:00 y 16:00.',
      };
    }

    const slotStartUtc = buildMexicoDateUtc(fecha, hourLocal)!;
    if (slotStartUtc.getTime() <= Date.now()) {
      return { exito: false, error: 'No se pueden agendar citas en fechas u horas pasadas.' };
    }
    const slotEndUtc = new Date(slotStartUtc.getTime() + 60 * 60 * 1000);

    try {
      const result = await prisma.$transaction(
        async (tx) => {
          const doctor = await tx.user.findFirst({
            where: { id: doctorId, role: 'DOCTOR' },
            select: { id: true, name: true },
          });
          if (!doctor) {
            throw new Error('DOCTOR_NOT_FOUND');
          }

          const conflict = await tx.appointment.findFirst({
            where: {
              doctorId,
              status: { not: 'CANCELLED' },
              date: { gte: slotStartUtc, lt: slotEndUtc },
            },
          });

          if (conflict) {
            throw new Error('SLOT_TAKEN');
          }

          const normalizedPhone = normalizePhoneDigits(senderPhone);
          const last10 = normalizedPhone.slice(-10);

          let patient = await tx.patient.findFirst({
            where: {
              OR: [
                { phone: senderPhone },
                { phone: normalizedPhone },
                ...(last10.length === 10 ? [{ phone: { endsWith: last10 } }] : []),
              ],
            },
          });

          if (!patient) {
            if (!nombreCompleto || !/^\d{4}-\d{2}-\d{2}$/.test(fechaNacimientoRaw)) {
              throw new Error('MISSING_PATIENT_DATA');
            }

            const parts = nombreCompleto.split(/\s+/);
            const firstName = parts[0] ?? nombreCompleto;
            const lastName = parts.slice(1).join(' ') || 'Sin Apellido';
            const dob = new Date(`${fechaNacimientoRaw}T00:00:00.000Z`);

            if (Number.isNaN(dob.getTime())) {
              throw new Error('INVALID_DOB');
            }

            patient = await tx.patient.create({
              data: {
                firstName,
                lastName,
                dateOfBirth: dob,
                phone: normalizedPhone,
              },
            });
          }

          const appointment = await tx.appointment.create({
            data: {
              date: slotStartUtc,
              reason: motivo,
              status: 'PENDING',
              patientId: patient.id,
              doctorId: doctor.id,
            },
          });

          return { appointment, patient, doctor };
        },
        { isolationLevel: Prisma.TransactionIsolationLevel.Serializable }
      );

      return {
        exito: true,
        citaId: result.appointment.id,
        paciente: `${result.patient.firstName} ${result.patient.lastName}`.trim(),
        medico: result.doctor.name,
        fechaHoraMexico: formatMexicoDateTime(result.appointment.date),
        motivo: result.appointment.reason,
        estado: result.appointment.status,
      };
    } catch (error) {
      const code = error instanceof Error ? error.message : '';
      if (code === 'SLOT_TAKEN') {
        return {
          exito: false,
          error:
            'Ese horario acaba de ser ocupado por otro paciente. Consulta de nuevo los horarios disponibles y ofrece otra opción.',
        };
      }
      if (code === 'MISSING_PATIENT_DATA' || code === 'INVALID_DOB') {
        return {
          exito: false,
          error:
            'El paciente es nuevo. Solicita su nombre completo y fecha de nacimiento (YYYY-MM-DD) antes de confirmar la cita.',
        };
      }
      if (code === 'DOCTOR_NOT_FOUND') {
        return { exito: false, error: 'El médico seleccionado no existe.' };
      }
      throw error;
    }
  }

  if (toolName === 'cancelar_cita') {
    const citaId = String(args.citaId ?? '').trim();
    if (!citaId) {
      return { exito: false, error: 'Se requiere el citaId para cancelar.' };
    }

    const patient = await findPatientBySenderPhone(senderPhone);
    if (!patient) {
      return { exito: false, error: 'No se encontró un paciente asociado a este teléfono.' };
    }

    const appointment = await prisma.appointment.findFirst({
      where: { id: citaId, patientId: patient.id },
      include: { doctor: { select: { name: true } } },
    });

    if (!appointment) {
      return {
        exito: false,
        error: 'No se encontró esa cita asociada a tu número de teléfono.',
      };
    }

    if (appointment.status === 'CANCELLED') {
      return { exito: false, error: 'Esa cita ya se encuentra cancelada.' };
    }

    if (appointment.status === 'COMPLETED') {
      return { exito: false, error: 'No es posible cancelar una cita ya completada.' };
    }

    await prisma.appointment.update({
      where: { id: appointment.id },
      data: { status: 'CANCELLED' },
    });

    return {
      exito: true,
      citaId: appointment.id,
      medico: appointment.doctor.name,
      fechaHoraMexico: formatMexicoDateTime(appointment.date),
      estado: 'CANCELLED',
    };
  }

  return { error: `Herramienta desconocida: ${toolName}` };
};
