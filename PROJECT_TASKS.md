# Tareas

## Estados permitidos

- PENDING
- READY
- IN_PROGRESS
- BLOCKED
- REVIEW
- DONE
- CANCELLED

---

# Reglas

1. Cada tarea debe tener un TASK-ID único.
2. Una tarea debe tener un responsable.
3. Una tarea debe tener una branch.
4. Una tarea debe tener criterios de aceptación.
5. No se debe trabajar en una tarea CANCELLED.
6. Una tarea BLOCKED debe indicar qué la bloquea.
7. Una tarea DONE debe tener evidencia del trabajo realizado.
8. Una persona puede tener varias tareas, pero no debe iniciar
   nuevas tareas si las dependencias críticas no están resueltas.

---

# TAREAS INICIALES

## TASK-001

## TASK-001
Título: Resolver compilación del backend

Responsable: Leopoldo Fuentes Cruz

Rol: Arquitectura / Integración

Backup: Pendiente

Estado: DONE

Prioridad: HIGH

Tipo: FIX

Branch: fix/backend-build

Dependencias: Ninguna

Descripción: Aislar el alcance del compilador TypeScript del backend y resolver conflictos de módulos CommonJS/ESM.

Criterios de aceptación:

- [x] Backend compila sin errores hacia dist/.
- [x] No hay fuga de compilación hacia el frontend.
- [x] Pruebas ejecutan correctamente.
- [x] Pipeline CI en verde.

Evidencia:
- PR #11 fusionado a develop.
- Build generado exitosamente.


## TASK-TEST-001

Título:
Prueba del flujo colaborativo del equipo

Responsable:
Charbel

Backup:
Leopoldo

Estado:
DONE

Branch:
docs/team-collaboration-test

PR:
#8

Resultado:
Prueba colaborativa completada.

Evidencia:

- branch correcta;
- commit correcto;
- push correcto;
- Pull Request #8;
- review realizada;
- PR fusionado a develop.

---

## TASK-002

Título:
Corregir validación de formato del pipeline CI

Responsable:
Leopoldo

Backup:
Pendiente

Estado:
DONE

Prioridad:
HIGH

Tipo:
FIX

Branch:
fix/ci-format-validation

Dependencias:
Ninguna

Descripción:

Corregir el comportamiento del pipeline para evitar que
errores de formato preexistentes en archivos no modificados
bloqueen Pull Requests que no los afectan.

Criterios de aceptación:

- [ ] CI ejecuta correctamente.
- [ ] No bloquear PRs por errores preexistentes no relacionados.
- [ ] No eliminar validaciones importantes.
- [ ] No modificar funcionalidades.
- [ ] Pull Request revisado.
- [ ] Pipeline en verde.

---

## TASK-003

Título: Plantilla base del Frontend (Layout principal)

Responsable: Leopoldo Fuentes Cruz

Rol: Arquitectura / Integración

Backup: Natali

Estado: REVIEW

Prioridad: HIGH

Tipo: FEAT

Branch: feat/frontend-base-layout

Dependencias: Ninguna

Descripción: 
Implementar la estructura visual base (MainLayout) del frontend, incluyendo barra superior (header) y menú lateral (sidebar), para que sirva como contenedor principal de todos los módulos del sistema.

Archivos esperados:
- MainLayout.tsx
- MainLayout.css
- App.tsx (modificado)

Criterios de aceptación:
- [x] El componente MainLayout renderiza un header y un sidebar.
- [x] Se cuenta con un área dinámica para inyectar contenido (children).
- [x] Compila sin errores.
- [ ] PR revisado y aprobado por equipo de frontend.

Pruebas requeridas:
- [x] Renderizado local.

PR: Pendiente

Commit: feat(frontend): crear estructura base del layout con menu lateral y header

---------------------------------------
## TASK-004

Título: Definición del esquema inicial de Base de Datos

Responsable: Leopoldo Fuentes Cruz

Rol: Arquitectura / Integración

Backup: Charbel

Estado: REVIEW

Prioridad: HIGH

Tipo: FEAT

Branch: feat/database-schema-init

Dependencias: Ninguna

Descripción: 
Crear el esquema inicial de Prisma con las entidades core del sistema (Usuarios, Pacientes y Citas) para desbloquear el trabajo del equipo de Backend.

Archivos esperados:
- schema.prisma actualizado
- Carpeta de migración SQL generada

Criterios de aceptación:
- [x] Los modelos User, Patient y Appointment están definidos con sus relaciones.
- [x] La migración se ejecuta sin errores en PostgreSQL.
- [ ] PR revisado y aprobado por el responsable de Base de Datos (Charbel).

Pruebas requeridas:
- [x] Ejecución de migración local sin errores de validación (Prisma CLI 7.10).

PR: Pendiente

Commit: feat(database): inicializar esquema de bd con tablas de usuarios, pacientes y citas
---------------------------------------
## TASK-005

Título: Estructura base de enrutamiento API REST y Middlewares globales Express

Responsable: Naye

Rol: Backend / API

Backup: Leopoldo Fuentes Cruz

Estado: IN_PROGRESS

Prioridad: HIGH

Tipo: FEAT

Branch: feat/backend-api-routes

Dependencias: TASK-001, TASK-004

Descripción:
Crear la estructura modular de directorios en el backend (routes, controllers, services, middlewares), configurar el enrutador principal /api/v1, implementar el endpoint GET /api/v1/health y el middleware global de captura de errores.

Archivos esperados:
- backend/src/middlewares/errorHandler.ts
- backend/src/controllers/health.controller.ts
- backend/src/routes/health.routes.ts
- backend/src/routes/index.ts
- backend/src/server.ts

Criterios de aceptación:
- [x] Directorios routes/, controllers/, middlewares/ estructurados.
- [x] GET /api/v1/health responde 200 OK con payload JSON.
- [x] Rutas inexistentes capturadas con respuesta 404 estructurada.
- [x] npm run build ejecuta sin errores.
- [x] npm test mantiene ejecutables las pruebas existentes.

---------------------------------------
## TASK-006

Título: Integración de Prisma Client y CORS en el servidor Express

Responsable: Leopoldo Fuentes Cruz

Rol: Arquitectura / Integración

Backup: Naye

Estado: REVIEW

Prioridad: HIGH

Tipo: FEAT

Branch: feat/backend-prisma-cors

Dependencias: TASK-004, TASK-005

Descripción:
Instanciar el cliente global de Prisma (Singleton) para evitar el agotamiento de conexiones a la base de datos y configurar el middleware CORS en Express para permitir peticiones desde el frontend (puerto 5173).

Archivos esperados:
- backend/src/config/prisma.ts
- backend/src/server.ts (modificado)
- backend/package.json (dependencias cors)

Criterios de aceptación:
- [x] Prisma Client exportado como instancia única.
- [x] CORS configurado y aceptando peticiones del origen del frontend.
- [x] El servidor compila y ejecuta sin errores.

Pruebas requeridas:
- [x] Ejecutar el servidor y validar que no haya errores de instancia.
- [x] Validación cruzada de Fetch API desde el navegador.

PR: Pendiente

Commit: feat(backend): integrar prisma client global y habilitar cors para frontend
---------------------------------------
## TASK-007

Título: Módulo de Pacientes en Backend (Endpoints de Creación y Lectura)

Responsable: Leopoldo Fuentes Cruz (o Naye)

Rol: Backend / API

Backup: Naye

Estado: REVIEW

Prioridad: HIGH

Tipo: FEAT

Branch: feat/backend-patients-crud

Dependencias: TASK-004, TASK-005, TASK-006

Descripción:
Implementar el controlador y las rutas para el recurso de pacientes. Se deben crear al menos dos endpoints funcionales que utilicen el cliente global de Prisma para interactuar con la base de datos.

Archivos esperados:
- backend/src/controllers/patient.controller.ts
- backend/src/routes/patient.routes.ts
- backend/src/routes/index.ts (Actualizar para incluir las rutas de pacientes)

Criterios de aceptación:
- [x] Endpoint POST `/api/v1/patients` recibe datos JSON y crea un paciente en la base de datos.
- [x] Endpoint GET `/api/v1/patients` devuelve la lista de pacientes registrados.
- [x] Los controladores manejan los errores correctamente pasándolos al `errorHandler`.

Pruebas requeridas:
- [x] Creación exitosa de un paciente usando Thunder Client o Postman.
- [x] Obtención de la lista de pacientes con código HTTP 200.

PR: Pendiente

Commit: feat(backend): crear rutas y controlador basico para pacientes
---------------------------------------


# PLANTILLA PARA NUEVAS TAREAS

## TASK-XXX

Título:

Responsable:

Rol:

Backup:

Estado:
PENDING

Prioridad:
MEDIUM

Tipo:
FEAT / FIX / DOCS / TEST / REFACTOR

Branch:

Dependencias:

Descripción:

Archivos esperados:

Criterios de aceptación:

- [ ]
- [ ]
- [ ]

Pruebas requeridas:

- [ ]

PR:

Commit:

Fecha de inicio:

Fecha de finalización:

Notas:
