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

Título:
Resolver compilación del backend

Responsable:
Leopoldo Fuentes Cruz

Rol:
Arquitectura / Integración

Estado:
READY

Prioridad:
HIGH

Tipo:
FIX

Branch:
fix/backend-build

Dependencias:
Ninguna

Descripción:
Resolver el problema de compilación TypeScript previamente detectado
en el backend sin realizar cambios funcionales no relacionados.

Criterios de aceptación:

- [ ] Backend tests PASS
- [ ] Backend build PASS
- [ ] Frontend build PASS
- [ ] Prisma sin cambios no relacionados
- [ ] Docker sin cambios no relacionados
- [ ] Pull Request revisado
- [ ] Documentación actualizada

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