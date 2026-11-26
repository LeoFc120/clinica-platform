# Decisiones Técnicas
# PROJECT DECISIONS

Este documento registra decisiones importantes que afectan
la arquitectura, organización o funcionamiento del proyecto.

---

# ADR-001

Fecha:
AAAA-MM-DD

Título:
Uso de develop como rama de integración

Estado:
ACEPTADA

Decisión:

La rama develop será utilizada como rama principal de integración
durante el desarrollo.

main será utilizada para versiones estables.

Motivo:

Evitar que código en desarrollo llegue directamente a la rama estable.

---

# ADR-002

Fecha:
AAAA-MM-DD

Título:
Uso obligatorio de Pull Requests

Estado:
ACEPTADA

Decisión:

Todo cambio realizado por un integrante deberá enviarse mediante
una rama de trabajo y Pull Request hacia develop.

Motivo:

Permitir revisión, detectar errores y mantener trazabilidad.

---

# ADR-003

Fecha:
AAAA-MM-DD

Título:
Uso de archivos PROJECT_* como fuente de verdad

Estado:
ACEPTADA

Decisión:

Los archivos PROJECT_STATUS.md, PROJECT_ROLES.md, PROJECT_TASKS.md,
PROJECT_DECISIONS.md, PROJECT_CHANGELOG.md y PROJECT_SESSIONS.md
serán utilizados como fuente oficial de información del proyecto.

Motivo:

Evitar depender de conversaciones individuales con herramientas de IA.

---

# ADR-004

Fecha:
AAAA-MM-DD

Título:
Todos los integrantes deben programar y documentar

Estado:
ACEPTADA

Decisión:

Los seis integrantes participarán en programación,
documentación y pruebas.

Motivo:

Cumplir con los requisitos académicos del proyecto.

---

# PLANTILLA

# ADR-XXX

Fecha:

Título:

Estado:
PROPUESTA / ACEPTADA / RECHAZADA / OBSOLETA

Problema:

Opciones consideradas:

Decisión:

Motivo:

Impacto:

Integrantes involucrados:


# ADR-005

Fecha:
2026-11-24

Título:
Integración de Agente de IA por WhatsApp para gestión de citas médicas

Estado:
APROBADA

Problema:
Los pacientes actualmente dependen de la recepción o del personal clínico para agendar, consultar o cancelar citas médicas en la plataforma, generando carga operativa manual y limitando la atención fuera de horario.

Opciones consideradas:
1. Flujo rígido basado únicamente en menús numéricos de WhatsApp.
2. Bot acoplado directamente a consultas SQL o modificando los controladores existentes.
3. Módulo aislado (`backend/src/modules/whatsapp/`) conectado a WhatsApp Cloud API de Meta y Gemini (modelo Flash vigente vía `@google/genai`) con *function calling*, delegando toda la lógica y validación de negocio a capas de servicio del backend.

Decisión:
Implementar un módulo nuevo y aislado en `backend/src/modules/whatsapp/` que reciba eventos de WhatsApp Cloud API mediante `POST /api/whatsapp/webhook`, valide firma HMAC (`X-Hub-Signature-256`) e idempotencia (`externalId`), y utilice Gemini Flash con *function calling* como interfaz conversacional. El modelo de IA nunca tendrá acceso directo a Prisma ni a PostgreSQL; únicamente invocará herramientas tipadas (`buscar_paciente`, `listar_horarios_disponibles`, `agendar_cita`, `cancelar_cita`) ejecutadas y validadas por el backend, persistiendo el historial en dos tablas nuevas (`WhatsappConversation` y `WhatsappMessage`) sin alterar los modelos existentes (`User`, `Patient`, `Appointment`).

Motivo:
Aislar completamente la nueva funcionalidad para no romper los módulos ya aprobados, garantizar seguridad mediante verificación de firma y revalidación de reglas en el backend, y mantener una capa de canal desacoplada (`sendMessage`).

Impacto:
- Se agregará únicamente `@google/genai` en `backend/package.json`.
- Se añadirán dos tablas nuevas en `backend/prisma/schema.prisma` (requiere revisión con Charbel antes de migrar).
- Se montará la ruta `/api/whatsapp` en `backend/src/server.ts` con captura de `rawBody` para validación criptográfica.

Integrantes involucrados:
Leopoldo Fuentes Cruz (Arquitectura / Integración), Charbel (Revisión de BD / Prisma), Roque / Naye (Revisión de reglas de citas).

---