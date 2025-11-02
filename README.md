[readme.txt](https://github.com/user-attachments/files/22585933/readme.txt)
# 📱 Proyecto Full Stack: Ionic + Node.js/Express

Este proyecto incluye un **frontend en Ionic** y un **backend en Node.js con Express**. Ambos se comunican vía API REST.

---

## 📦 Requisitos previos

Asegúrate de tener instalados:

- [Node.js](https://nodejs.org/) (v14 o superior)
- [Ionic CLI](https://ionicframework.com/docs/cli) (v7+):  
```bash
  npm install -g @ionic/cli

  /virtual_assistant_for_gamers
│
├── backend/         # Node.js + Express
│   ├── config
    ├── controllers
    ├── middlewares
    ├── models
    ├── node_models
    ├── repositories
    ├── routes
    ├── services
    ├── .env
    ├── package-lock.json
    ├── package.json
    ├── server.config.js
    └── server.js
│
└── frontend/        # Ionic Angular
    ├── src/
    └── package.json
```
## 🚀Instrucciones para correr el proyecto
### ▶️ 1. Iniciar el Backend (Node.js + Express)
  ```bash
cd backend
npm install
npm start
```
Esto levanta el servidor en http://localhost:3000.

# ▶️ 2. Iniciar el Frontend (Ionic)
```bash
cd frontend
npm install
ionic serve
```
# 🔗 Comunicación entre frontend y backend
  - El frontend hace peticiones HTTP a la API REST del backend.

  - Ejemplo de uso:

      - POST /api/users/login → retorna JWT


**Asegúrate de que el CORS esté habilitado**  en el backend para permitir llamadas desde Ionic:
```bash
const cors = require('cors');
app.use(cors());
```

# 🔐 Autenticación

  - El backend emite un token JWT al iniciar sesión.

  - El frontend guarda el token y lo incluye en las peticiones protegidas:

```ts 
Authorization: Bearer <token>
```
# ✅ Funcionalidades implementadas

1. Registro de usuarios
2. Inicio de sesión con JWT
3. Comunicación full stack
- - -

## Consideraciones 
- No se implementó el servicio de chat virtual, tanto su registro en la base de datos como su funcionamiento en la pagina web.
- La mayoria de las funcionalidades son beta, por lo tanto, pueden ser propensas a errores y poco fidedignas al resultado final de la aplicacion web.
