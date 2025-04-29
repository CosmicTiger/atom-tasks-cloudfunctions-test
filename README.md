# 📘 Atom Tasks Cloud Functions API (Technical Test)

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Firebase](https://img.shields.io/badge/firebase-%23039BE0.svg?style=for-the-badge&logo=firebase&logoColor=white)
![Node.js](https://img.shields.io/badge/node.js-%23339933.svg?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
![Firestore](https://img.shields.io/badge/Firestore-%23FFCA28.svg?style=for-the-badge&logo=firebase&logoColor=black)
![Zod](https://img.shields.io/badge/zod-%233068b7.svg?style=for-the-badge&logo=zod&logoColor=white)
![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/prettier-%23F7B93E.svg?style=for-the-badge&logo=prettier&logoColor=black)
![GitHub](https://img.shields.io/badge/GitHub-%23181717.svg?style=for-the-badge&logo=github&logoColor=white)
![Git](https://img.shields.io/badge/Git-%23F05032.svg?style=for-the-badge&logo=git&logoColor=white)
![Visual Studio Code](https://custom-icon-badges.demolab.com/badge/Visual%20Studio%20Code-0078d7.svg?style=for-the-badge&logo=vsc&logoColor=white)

## 🧩 Descripción del Proyecto

Este proyecto forma parte de la prueba técnica para un sistema de gestión de tareas.
Está construido como un backend serverless API utilizando Cloud Functions de Firebase, TypeScript, y Firestore como base de datos.
La API permite autenticación simple basada en correo electrónico y gestión de tareas (crear, leer, actualizar, eliminar), cumpliendo con los principios de arquitectura limpia, validaciones,
y buenas prácticas de desarrollo.

## 🚀 Tecnologías Usadas

| Tecnología                                                             | Propósito                                                                      |
| ---------------------------------------------------------------------- | ------------------------------------------------------------------------------ |
| [TypeScript](https://www.typescriptlang.org/)                          | Superset de JavaScript con tipado estático para mayor seguridad y claridad     |
| [Node.js](https://nodejs.org/)                                         | Entorno de ejecución para JavaScript del lado del servidor                     |
| [Express.js](https://expressjs.com/)                                   | Framework minimalista para definir rutas y middlewares                         |
| [Firebase Cloud Functions](https://firebase.google.com/docs/functions) | Backend sin servidor que escala automáticamente, usado para alojar esta API    |
| [Firestore](https://firebase.google.com/products/firestore)            | Base de datos NoSQL en tiempo real usada para almacenar usuarios y tareas      |
| [Zod](https://zod.dev/)                                                | Librería de validación de esquemas de datos basada en TypeScript               |
| [ESLint](https://eslint.org/)                                          | Linter de JavaScript/TypeScript para mantener consistencia y calidad de código |
| [Prettier](https://prettier.io/)                                       | Formateador de código para mantener estilo uniforme                            |
| [Git](https://git-scm.com/) + [GitHub](https://github.com/)            | Control de versiones y repositorio remoto                                      |
| [Visual Studio Code](https://code.visualstudio.com/)                   | Editor de código optimizado para TypeScript y desarrollo con Firebase          |

---

## 📁 Estructura del Proyecto

```bash
functions/
└── src/
├── app.ts # Configuración principal de Express y definición basada en clase para mejor control de composición de código
├── index.ts # Entry point para exportar como Cloud Function bajo CF denominada "api"
├── config/ # Firebase config y configuración de entorno
├── controllers/ # Controladores HTTP (usuarios, tareas) controlando la clase Router de Express en un enfoque de clase en lugar de funcional
├── middleware/ # Middlewares para validación de entrada de datos antes de llegar a controladores y logging
├── schemas/ # Esquemas de validación con Zod
├── interface/ # Interfaces para controladores y otros tipos de composición de código no relacionados a validación
```

## ✅ Funcionalidades Implementadas

### 🧑 Usuarios

- <b>POST /users/login-or-create</b>: Valida si un usuario con el correo proporcionado existe.
  Si no existe, lo crea automáticamente.
  - [x] Valida estructura con Zod
  - [x] Crea usuario con ID automático
  - [x] Permite login sin contraseña (flujo simplificado)

### 📝 Tareas

- <b>GET /tasks</b>: Lista todas las tareas del usuario autenticado.

  - [x] Filtra por ID de usuario
  - [x] Ordena por fecha de creación (createdAt)
  - [x] Permite paginación y búsqueda (opcional)
        Lista todas las tareas del usuario, ordenadas por fecha de creación.

- <b>GET /tasks/:taskId</b>: Obtiene una tarea específica por su ID.

  - [x] Valida que la tarea pertenezca al usuario autenticado
  - [x] Devuelve la tarea con todos sus campos
  - [x] Manejo de errores para tareas no encontradas

- <b>POST /tasks</b>: Crea una nueva tarea.

  - [x] Valida la estructura de la tarea con Zod
  - [x] Asigna automáticamente el ID del usuario autenticado
  - [x] Guarda la tarea en Firestore
  - [x] Devuelve la tarea creada con su ID

- <b>PUT /tasks/:taskId</b>: Actualiza una tarea existente.

  - [x] Valida la estructura de la tarea con Zod
  - [x] Permite actualizar campos específicos (título, descripción, estado)
  - [x] Manejo de errores para tareas no encontradas
  - [x] Devuelve la tarea actualizada

- <b> PATCH /tasks/:taskId/complete</b>: Marca una tarea como completada.

  - [x] Valida que la tarea pertenezca al usuario autenticado
  - [x] Actualiza el estado de la tarea a "completada"
  - [x] Manejo de errores para tareas no encontradas
  - [x] Devuelve la tarea actualizada

- <b>DELETE /tasks/:taskId</b>: Elimina una tarea por su ID.
  - [x] Valida que la tarea pertenezca al usuario autenticado
  - [x] Manejo de errores para tareas no encontradas
  - [x] Devuelve un mensaje de éxito o error
  - [x] Elimina la tarea de Firestore
  - [x] Manejo de errores para tareas no encontradas

<b>Consideraciones extras</b>

- [x] Validación de payloads con Zod
- [x] Manejo de errores con respuestas coherentes
- [x] Transformación de fechas Firestore a Date

## 🧪 Validaciones

Validadas con Zod en:

🗒️**user.schemas.ts**<br>
🗒️**task.schemas.ts**<br>
Middleware centralizado: 🗒️**validateData.middleware.ts**

## 🔐 Seguridad

- Validación estricta del schema de entrada
- CORS habilitado de forma controlada
- Estructura limpia para poder añadir autenticación por token fácilmente

## 🧼 Código limpio y mantenible

<pre >
  ✅ Principios SOLID
  ✅ Separación por capas
  ✅ Tipado fuerte con TypeScript
  ✅ Reutilización de lógica vía interfaces y middlewares
</pre>

## 🛠 Instalación y ejecución local

1. Clonar repositorio
   ```bash
   git clone https://github.com/tu-usuario/atom-tasks-cloudfunctions-test.git
   cd functions
   ```
2. Instalar dependencias
   ```bash
   npm install
   ```
3. Ejecutar localmente con Firebase Emulator

   ```bash
   firebase emulators:start
   ```

   > **_✏️NOTE_** - _**Firebase Tools**_:
   > _Asegúrate de tener firebase-tools instalado globalmente y haber iniciado sesión con firebase login._

## 🚀 Deploy a Firebase

> **_✏️NOTE_** - _**admin.json**_:
> _Es necesario que en la ruta <br> 📁 `functions/src/config` tengas alojado el archivo
> de la cuenta de servicio nombrado como **admin.json** para el uso de Firestore en tu proyecto Firebase. Sin esto,
> la aplicación no puede conectar para nada a tu Firebase online._

```bash
npm run build # Se encargará de compilar los últimos cambios hechos en el código a JS
npm run deploy # Desplegará la función a Firebase
```

## 📬 Contacto

Built with 💙 by Luisangel M. Marcia Palma
