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

- [x] CI ejecuta correctamente.
- [x] No bloquear PRs por errores preexistentes no relacionados.
- [x] No eliminar validaciones importantes.
- [x] No modificar funcionalidades.
- [x] Pull Request revisado.
- [x] Pipeline en verde.

---

## TASK-003

Título: Plantilla base del Frontend (Layout principal)

Responsable: Leopoldo Fuentes Cruz

Rol: Arquitectura / Integración

Backup: Natali

Estado: DONE

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
- [x] PR revisado y aprobado por equipo de frontend.

Pruebas requeridas:

- [x] Renderizado local.

PR: Pendiente

Commit: feat(frontend): crear estructura base del layout con menu lateral y header

---

## TASK-004

Título: Definición del esquema inicial de Base de Datos

Responsable: Leopoldo Fuentes Cruz

Rol: Arquitectura / Integración

Backup: Charbel

Estado: DONE

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
- [x] PR revisado y aprobado por el responsable de Base de Datos (Charbel).

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

Estado: DONE

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

---

## TASK-006

Título: Integración de Prisma Client y CORS en el servidor Express

Responsable: Leopoldo Fuentes Cruz

Rol: Arquitectura / Integración

Backup: Naye

Estado: DONE

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

Estado: DONE

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

## TASK-008

Título: Configuración de la capa de servicios API en el Frontend

Responsable: Leopoldo Fuentes Cruz

Rol: Arquitectura / Integración

Backup: Natali

Estado: DONE

Prioridad: HIGH

Tipo: FEAT

Branch: feat/frontend-api-services

Dependencias: TASK-003, TASK-007

Descripción:
Crear la configuración base del cliente HTTP y el servicio específico para el módulo de pacientes en React. Esto estandarizará la forma en que el frontend consume la API del backend y manejará las respuestas de forma centralizada.

Archivos esperados:

- frontend/src/services/api.ts (Configuración base)
- frontend/src/services/patient.service.ts (Métodos GET y POST para pacientes)

Criterios de aceptación:

- [x] El archivo `api.ts` define la URL base hacia el backend.
- [x] El `patient.service.ts` expone funciones asíncronas fuertemente tipadas para `createPatient` y `getPatients`.
- [x] La compilación de TypeScript en el frontend pasa sin errores.

Pruebas requeridas:

- [x] Inyectar el servicio temporalmente en `App.tsx` o `MainLayout` para validar que el frontend recibe los datos del backend correctamente.

PR: Pendiente

Commit: feat(frontend): implementar capa de servicios api para modulo de pacientes
---------------------------------------

## TASK-009

Título: Interfaz de Tabla de Pacientes (UI)

Responsable: Natali (o Juan)

Rol: Frontend / UI

Backup: Juan (o Natali)

Estado: DONE

Prioridad: HIGH

Tipo: FEAT

Branch: feat/frontend-patients-table

Dependencias: TASK-008

Descripción:
Crear la vista principal del módulo de pacientes. Se debe implementar una tabla en React que consuma el servicio `PatientService.getAll()` para listar los pacientes registrados en la base de datos.

Archivos esperados:

- frontend/src/pages/Patients/PatientsPage.tsx (o la ruta correspondiente)
- frontend/src/components/Patients/PatientsTable.tsx

Criterios de aceptación:

- [x] La vista renderiza una tabla con las columnas: Nombre, Apellidos, Fecha de Nacimiento, Teléfono y Email.
- [x] El componente maneja estados de carga (loading spinner/texto) mientras espera la respuesta del backend.
- [x] Se muestran los datos reales provenientes de la base de datos usando `PatientService.getAll()`.

Pruebas requeridas:

- [x] Validar visualmente que el paciente de prueba ("Carlos Mendoza") aparece correctamente en la tabla al cargar la pantalla.

PR: Pendiente

Commit: Pendiente
---------------------------------------

## TASK-010

Título: Completar CRUD de Pacientes en Backend (Update & Delete)

Responsable: Leopoldo Fuentes Cruz

Rol: Backend / API

Backup: Naye

Estado: DONE

Prioridad: HIGH

Tipo: FEAT

Branch: feat/backend-patients-update-delete

Dependencias: TASK-007

Descripción:
Implementar los endpoints restantes para el recurso de pacientes (PUT y DELETE) en el controlador y las rutas, asegurando que se actualicen y eliminen registros por su ID mediante Prisma Client.

Archivos esperados:

- backend/src/controllers/patient.controller.ts
- backend/src/routes/patient.routes.ts

Criterios de aceptación:

- [x] Endpoint PUT `/api/v1/patients/:id` actualiza los datos de un paciente existente.
- [x] Endpoint DELETE `/api/v1/patients/:id` elimina un paciente de la base de datos.

Pruebas requeridas:

- [x] Actualizar un paciente desde Thunder Client y verificar código 200.
- [x] Eliminar un paciente desde Thunder Client y verificar código 204 o 200.

PR: Pendiente

Commit: Pendiente
---------------------------------------

## TASK-011

Título: Formulario de Registro de Pacientes (Frontend)

Responsable: Leopoldo Fuentes Cruz

Rol: Frontend / UI

Backup: Natali

Estado: DONE

Prioridad: HIGH

Tipo: FEAT

Branch: feat/frontend-patient-form

Dependencias: TASK-009, TASK-010

Descripción:
Crear el componente del formulario para registrar nuevos pacientes desde la interfaz gráfica. Debe consumir el método `create` del `PatientService`, manejar el estado de los inputs y actualizar la tabla automáticamente al guardar.

Archivos esperados:

- frontend/src/components/Patients/PatientForm.tsx (Nuevo)
- frontend/src/pages/Patients/PatientsPage.tsx (Actualización)

Criterios de aceptación:

- [x] El formulario captura: Nombre, Apellidos, Fecha de Nacimiento, Teléfono y Email.
- [x] Al enviar, ejecuta `PatientService.create()`.
- [x] Si es exitoso, cierra el formulario y recarga la lista de pacientes en la tabla.

PR: Pendiente
---------------------------------------

## TASK-012

Título: Reorganizar Arquitectura de Carpetas del Frontend (Pages & Components)

Responsable: Leopoldo Fuentes Cruz

Rol: Frontend / Architecture

Backup: Juan

Estado: DONE

Prioridad: MEDIUM

Tipo: REFACTOR

Branch: refactor/frontend-architecture

Dependencias: TASK-009, TASK-011

Descripción:
Separar responsabilidades en el frontend moviendo las vistas a `src/pages/` y los componentes reutilizables a `src/components/`, ajustando las rutas de importación relativas.

Archivos esperados:

- frontend/src/pages/Patients/PatientsPage.tsx
- frontend/src/components/Patients/PatientsTable.tsx
- frontend/src/components/Patients/PatientForm.tsx
- frontend/src/App.tsx

Criterios de aceptación:

- [x] La vista de pacientes reside en `src/pages/Patients/`.
- [x] Los componentes `PatientsTable` y `PatientForm` residen en `src/components/Patients/`.
- [x] Todas las rutas de importación en TypeScript/React compilan sin errores.
- [x] La aplicación renderiza y funciona exactamente igual en el navegador.

PR: Pendiente
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
