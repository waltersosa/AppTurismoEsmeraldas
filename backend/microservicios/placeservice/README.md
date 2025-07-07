# Microservicio de Lugares Turísticos (placeservice)

## Descripción
Gestiona el CRUD de lugares turísticos, búsquedas, filtros, paginación y registro de actividades administrativas para Esmeraldas Turismo.

## Endpoints principales
- `GET /` — Estado del servicio
- `GET /places/health` — Health check
- `GET /places` — Listar lugares turísticos
- `GET /places/:id` — Obtener lugar por ID
- `POST /places` — Crear lugar (protegido, solo GAD)
- `PUT /places/:id` — Actualizar lugar (protegido, solo GAD)
- `PATCH /places/:id/status` — Cambiar estado (protegido, solo GAD)
- `DELETE /places/:id` — Eliminar lugar (protegido, solo GAD)
- `GET /places/admin/actividades` — Historial de actividades admin (protegido, solo GAD)

## Gestión de imágenes
- **La subida, consulta y eliminación de imágenes ahora se realiza en el microservicio [mediaupload](../mediaupload/README.md).**
- Para asociar imágenes a un lugar:
  1. Sube la imagen usando el endpoint `POST /media/upload` del microservicio mediaupload.
  2. Usa la URL o el ID devuelto para asociarlo al lugar en este microservicio (en los campos `images` o `coverImage`).
- Las imágenes ya no se gestionan ni almacenan en este microservicio.

## Variables de entorno / Configuración
- `PORT`: Puerto en el que corre el microservicio (por defecto: 3002)
- `MONGO_URI`: URI de conexión a MongoDB (por defecto: mongodb://localhost:27017/placesDB)
- `JWT_SECRET`: Clave secreta para validación de tokens JWT (debe ser igual en todos los microservicios, ej: `secretAuth`)

## Ejecución local
```bash
npm install
node index.js
```

## Dependencias principales
- express
- mongoose
- axios
- dotenv
- jsonwebtoken

## Arquitectura
- Basado en Node.js + Express
- Estructura modular: controllers, services, repositories, middlewares, models, routes, config
- JWT para autenticación y autorización (validación vía HTTP a authservice)
- MongoDB como base de datos
- Registro de actividades administrativas
- **Gestión de imágenes delegada al microservicio mediaupload**
- Validación centralizada de tokens para todo el ecosistema

## Pruebas
- Puedes usar los archivos de la carpeta `pruebas/` para probar la validación de tokens y la creación de lugares.
- Incluye colección Postman (`postmanPlace.md`) para pruebas manuales de endpoints.

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

## Validación de autenticación
Este microservicio valida los tokens JWT consultando por HTTP al microservicio de autenticación:
```
GET http://localhost:3001/auth/validate
Headers: Authorization: Bearer <token>
```

## Ejemplo de uso de autenticación en rutas protegidas
```js
import { autenticarTokenPorHttp } from '../middlewares/authHttpMiddleware.js';

router.post('/places', autenticarTokenPorHttp, autorizarGAD, placeController.createPlace);
```

## Notas
- Usa la misma clave JWT en todos los microservicios.
- Si el usuario es deshabilitado o el token es revocado, el authservice lo detectará y los demás microservicios lo rechazarán automáticamente.
- Si cambias el host o puerto del authservice, actualiza la URL en el middleware.

---

**Desarrollado para Esmeraldas Turismo** 