# Microservicio de Autenticación (authservice)

## Descripción
Gestiona la autenticación, registro, login, validación de tokens y administración de usuarios para Esmeraldas Turismo.

## Endpoints principales
- `GET /` — Estado del servicio
- `GET /auth/health` — Health check
- `POST /auth/register` — Registro de usuario
- `POST /auth/login` — Login de usuario
- `GET /auth/validate` — Validar token JWT
- `GET /auth/profile` — Obtener perfil (protegido)
- `PUT /auth/profile` — Actualizar perfil (protegido)
- `PUT /auth/change-password` — Cambiar contraseña (protegido)
- `GET /auth/users` — Listar usuarios (solo GAD)
- `POST /auth/users` — Crear usuario como admin (solo GAD)
- `GET /auth/admin/actividades` — Listar actividades administrativas (solo GAD)

## Variables de entorno / Configuración
- `PORT`: Puerto en el que corre el microservicio (por defecto: 3001)
- `DB_URI`: URI de conexión a MongoDB (por defecto: mongodb://localhost:27017/authDB)
- `JWT_SECRET`: Clave secreta para validación de tokens JWT (debe ser igual en todos los microservicios, ej: `secretAuth`)

## Ejecución local
```bash
npm install
node index.js
```

## Dependencias principales
- express
- mongoose
- bcryptjs
- jsonwebtoken
- express-validator
- dotenv
- axios (para validación HTTP en otros microservicios)

## Arquitectura
- Basado en Node.js + Express
- Estructura modular: controllers, services, repositories, middlewares, models, routes, config
- JWT para autenticación y autorización
- MongoDB como base de datos
- Registro de actividades administrativas
- Validación centralizada de tokens para todo el ecosistema

## Pruebas
- Puedes usar los archivos de la carpeta `pruebas/` para validar tokens y flujos de autenticación.
- Incluye colección Postman (`postmanAuth.md`) para pruebas manuales de endpoints.

## Despliegue en producción
- Configura las variables de entorno en el servidor de producción.
- Usa un proceso manager como PM2 o Docker para mantener el servicio activo.
- Asegúrate de que la base de datos MongoDB esté accesible desde el entorno de producción.
- Mantén la clave JWT en secreto y nunca la subas a repositorios públicos.

## Troubleshooting
- **Error de conexión a MongoDB:** Verifica la URI y que el servicio de MongoDB esté activo.
- **Token inválido:** Asegúrate de que todos los microservicios usan la misma clave JWT y que el token no esté expirado.
- **Problemas de CORS:** Configura correctamente los orígenes permitidos en producción.

## Contacto
- Equipo de desarrollo: turismo@esmeraldas.gob.ec
- Documentación oficial: [Enlace a la wiki o documentación interna]

## Validación de autenticación para otros microservicios
Este microservicio valida los tokens JWT y expone el endpoint:
```
GET http://localhost:3001/auth/validate
Headers: Authorization: Bearer <token>
```

## Ejemplo de uso de autenticación en otros microservicios
```js
import { autenticarTokenPorHttp } from '../middlewares/authHttpMiddleware.js';

router.post('/ruta-protegida', autenticarTokenPorHttp, (req, res) => {
  // req.usuario contiene los datos del usuario autenticado
  res.json({ message: 'Acceso permitido', usuario: req.usuario });
});
```

## Notas
- Usa la misma clave JWT en todos los microservicios.
- Si el usuario es deshabilitado o el token es revocado, el authservice lo detectará y los demás microservicios lo rechazarán automáticamente.
- Si cambias el host o puerto del authservice, actualiza la URL en el middleware.

---

**Desarrollado para Esmeraldas Turismo** 