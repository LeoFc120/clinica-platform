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
