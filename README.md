
# Sistema de Gestión Académica

Proyecto fullstack desarrollado con **Angular** (frontend) y **Express + Sequelize** (backend), orientado a la gestión de usuarios, cursos y dashboards personalizados según rol (Administrador, Profesor, Estudiante).

---

# Tecnologías utilizadas

- **Frontend**
  - Angular 17
  - Angular Material (UI/UX corporativo)
  - RxJS
  - TypeScript

- **Backend**
  - Node.js + Express
  - Sequelize (ORM)
  - MySQL / PostgreSQL (BD relacional)
  - JWT (autenticación)
  - Bcrypt (hash de contraseñas)

---

## ⚙️ Instalación

### 1. Clonar repositorio
```bash
(https://github.com/paolo2007/final-desarollo3)
cd sistema-academico
2. Backend
bash
cd backend
npm install
Configura tu archivo .env
Inicia el servidor:

bash
npm run dev
3. Frontend
bash
cd frontend
npm install
ng serve -o
 Autenticación
Login: POST /auth

Perfil del usuario autenticado: GET /auth/me (requiere token JWT)

Registro de usuario: POST /auth/register

El token JWT se guarda en localStorage y se envía en cada petición con el header:

http
Authorization: Bearer <token> Estructura del proyecto
Código
 Funcionalidades principales
Administrador

Gestión de usuarios

Gestión de cursos

Asignación de roles

Profesor

Validación de estudiantes por DNI

Gestión de cursos dictados

Estudiante

Dashboard con datos personales

Tabla de cursos inscritos

Visualización de ciclo y carrera
 UI/UX
Angular Material para tarjetas, tablas y formularios.

Diseño corporativo moderno.

Dashboard con:

Tarjeta de datos personales.

Tabla dinámica de cursos inscritos.

Scripts útiles
Backend:

bash
npm run dev   # iniciar servidor en modo desarrollo
npm run start # iniciar servidor en producción
Frontend:

bash
ng serve -o   # iniciar Angular y abrir navegador
ng build      # compilar para producción
