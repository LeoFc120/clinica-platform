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

---

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
