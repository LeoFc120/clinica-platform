# clinica-platform

- Estado del Pipeline: CI/CD activo y ramas protegidas.

Requisitos previos obligatorios:

Docker Desktop instalado y abierto.
Node.js (v24).
VS Code con terminal configurada en Command Prompt (cmd) o Git Bash (eviten PowerShell para prevenir bloqueos de npm).

1. Clonación y Sincronización Base
   Al clonar, Git muestra por defecto la rama vacía. Es crítico cambiarse a la rama de desarrollo inmediatamente.

git clone https://github.com/LeoFc120/clinica-platform.git
cd clinica-platform
git checkout develop
code .

2. Identidad de Git (Prevención de errores al guardar)
   Para evitar el error "Author identity unknown" al intentar subir código, configuren su firma electrónica en la terminal de VS Code:

git config --global user.name "Tu Nombre Real"
git config --global user.email "tu_correo_de_github@ejemplo.com"

3. Levantar la Base de Datos
   Asegúrense de estar en la raíz (clinica-platform) y ejecuten:

docker-compose up -d

4. Configuración del Backend y Credenciales
   Para evitar errores de rutas con el archivo .env, lo crearemos de forma visual.

En la terminal, entren al servidor e instalen paquetes:

cd backend
npm install

En el panel izquierdo de VS Code, den clic derecho sobre la carpeta backend > New File (Nuevo archivo).
Nombren el archivo exactamente .env.
Peguen esta credencial exacta (alineada con Docker) y guarden (Ctrl + S):
DATABASE_URL="postgresql://admin:admin_password@localhost:5432/clinica_db?schema=public"

5. Migración de Tablas y Pruebas
   En la misma terminal (dentro de backend), conecten Prisma a Docker y validen la estructura:
   npx prisma migrate dev
   npm run test
   Si la prueba de Jest sale con un PASS verde, el servidor está listo. Enciéndanlo con npm run dev.

6. Configuración del Frontend
   Abran una nueva pestaña en la terminal de VS Code (el símbolo +), entren a la carpeta de React y levanten la interfaz:
   cd frontend
   npm install
   npm run dev
   Hagan clic con Ctrl presionado en el enlace http://localhost:5173/ para ver la plataforma funcionando.

Reglas para Nombrar Ramas
Nunca trabajen directamente en develop ni en main.
Siempre crear una rama local nueva utilizando el siguiente formato:
Prefijo: (feat/,fix/,docs/)
Cuándo usarlo: (Para pantallas, rutas de API o funciones nuevas,Para corregir un error, caída o bug específico,Para modificar o agregar documentación)
Ejemplo: (feat/registro-pacientes,fix/boton-calendario,docs/guia-instalacion)

Flujo de Subida Seguro
Sigan este orden exacto en la terminal para no perder código y asegurar que los cambios viajen completos:
-Paso 1: Sincronizar y aislar. Siempre partan de la última versión disponible en la nube:
1-git checkout develop
2-git pull origin develop
3-git checkout -b feat/nombre-de-tu-rama

Paso 2: Formatear y empaquetar. Revisen qué archivos tocaron, estandaricen el código y guarden el paquete localmente:
1-git status
2-npm run format
3-git add .
4-git commit -m "feat: agrega formulario de creación de citas"

Paso 3: Enviar a GitHub.
git push origin feat/nombre-de-tu-rama

La Regla de Oro del Pull Request
Al abrir GitHub y hacer clic en el botón verde "Compare & pull request",
el sistema intentará enviarlos a main por defecto. Es obligatorio corregir esto antes de continuar:

Verifiquen en los menús desplegables grises que la configuración exacta sea: base: develop ← compare: feat/tu-rama.

Punto de control visual: Antes de presionar el botón de crear, revisen el número de archivos en la pestaña "Files changed".
Si el sistema marca cientos de archivos modificados pero ustedes solo editaron dos, están apuntando a main.
Cambien la rama base a develop de inmediato para ver únicamente su código real.
