# Roles del Equipo

# PROJECT ROLES

## Proyecto

Plataforma web para la gestión de expedientes clínicos y citas médicas.

Institución:
TecNM Campus Libres

Semestre:
7.º semestre

Equipo:
6 integrantes

---

# 1. Integrantes

| ID | Nombre | Rol principal | Área principal | Estado |
|---|---|---|---|---|
| INT-001 | Leopoldo Fuentes Cruz | Arquitectura / Integración | Arquitectura técnica | ACTIVO |
| INT-002 | Naye | Backend / API | Servidor y API | ACTIVO |
| INT-003 | Charbel | Base de datos / Prisma | Persistencia de datos | ACTIVO |
| INT-004 | Natali | Frontend / React | Interfaz web | ACTIVO |
| INT-005 | Juan | Pacientes / Expedientes clínicos | Módulo clínico | ACTIVO |
| INT-006 | Roque | Citas / QA / Testing | Citas y calidad | ACTIVO |

---

# 2. Responsabilidades por integrante

## INT-001 — Leopoldo Fuentes Cruz

### Rol
Arquitectura / Integración

### Responsabilidades principales

- Arquitectura general.
- Integración entre frontend y backend.
- Organización técnica del proyecto.
- Flujo de trabajo Git/GitHub.
- Integración de módulos.
- Configuración general.
- Docker e infraestructura cuando corresponda.
- Middleware global.
- Manejo de errores global.
- Coordinación técnica.
- Revisión de Pull Requests.
- Apoyo técnico al equipo.

### Participación obligatoria

- Programación: SÍ
- Documentación: SÍ
- Testing: SÍ
- Git/GitHub: SÍ

---

## INT-002 — Naye

### Rol
Backend / API

### Responsabilidades principales

- Node.js.
- Express.
- TypeScript.
- Routes.
- Controllers.
- Services.
- API REST.
- Validaciones.
- Lógica de negocio.
- Manejo de errores.
- Integración con Prisma.
- Pruebas del backend.
- Documentación de API.

### Participación obligatoria

- Programación: SÍ
- Documentación: SÍ
- Testing: SÍ
- Git/GitHub: SÍ

---

## INT-003 — Charbel

### Rol
Base de datos / Prisma

### Responsabilidades principales

- PostgreSQL.
- Prisma.
- schema.prisma.
- Modelos.
- Relaciones.
- Migraciones.
- Integridad de datos.
- Consultas.
- Índices cuando sean necesarios.
- Datos de prueba.
- Documentación de base de datos.

### Participación obligatoria

- Programación: SÍ
- Documentación: SÍ
- Testing: SÍ
- Git/GitHub: SÍ

### Regla

Los cambios estructurales importantes de la base de datos deberán coordinarse con Backend y Arquitectura.

---

## INT-004 — Natali

### Rol
Frontend / React

### Responsabilidades principales

- React.
- TypeScript.
- Vite.
- Componentes.
- Páginas.
- Formularios.
- Navegación.
- Consumo de API.
- Validaciones del lado cliente.
- Manejo de estados.
- Manejo de errores.
- Interfaz general.

### Participación obligatoria

- Programación: SÍ
- Documentación: SÍ
- Testing: SÍ
- Git/GitHub: SÍ

---

## INT-005 — Juan

### Rol
Pacientes / Expedientes clínicos

### Responsabilidades principales

- Módulo de pacientes.
- Módulo de expedientes clínicos.
- Flujo completo del módulo.
- Frontend relacionado.
- Integración con API.
- Validaciones.
- Pruebas funcionales.
- Documentación del módulo.

### Participación obligatoria

- Programación: SÍ
- Documentación: SÍ
- Testing: SÍ
- Git/GitHub: SÍ

### Coordinación

Deberá coordinar cambios de datos con Base de Datos
y endpoints con Backend.

---

## INT-006 — Roque

### Rol
Citas / QA / Testing

### Responsabilidades principales

- Módulo de citas.
- Registro de citas.
- Consulta de citas.
- Modificación.
- Cancelación.
- Agenda.
- Estados de las citas.
- Validaciones.
- Pruebas funcionales.
- Pruebas de integración.
- Detección de errores.
- Documentación de pruebas.

### Participación obligatoria

- Programación: SÍ
- Documentación: SÍ
- Testing: SÍ
- Git/GitHub: SÍ

---

# 3. Owner y Backup

Cada área deberá tener:

OWNER:
Responsable principal.

BACKUP:
Responsable secundario.

Los backups serán definidos posteriormente.

Mientras no exista una asignación oficial:

OWNER:
Pendiente

BACKUP:
Pendiente

No se deben inventar asignaciones.

---

# 4. Cambios de roles

Un cambio de rol deberá registrarse en:

- PROJECT_ROLES.md
- PROJECT_STATUS.md
- PROJECT_CHANGELOG.md

Si el cambio representa una decisión técnica o de organización importante,
también deberá registrarse en:

- PROJECT_DECISIONS.md