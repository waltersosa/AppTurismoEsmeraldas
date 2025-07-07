# Microservicio de Reviews (reviewservice)

## Descripción
Gestiona las reseñas y calificaciones de lugares turísticos para Esmeraldas Turismo. Permite a los usuarios crear reseñas y a los administradores GAD moderar el contenido.

## Endpoints principales
- `GET /` — Estado del servicio
- `POST /reviews/` — Crear una reseña (requiere token de usuario)
- `GET /reviews/lugar/:lugarId` — Obtener reseñas públicas de un lugar
- `GET /reviews/admin` — Listar todas las reseñas (solo GAD, requiere token)
- `PUT /reviews/admin/:id` — Cambiar estado de reseña (solo GAD)
- `DELETE /reviews/admin/:id` — Eliminar reseña (solo GAD)

## Funcionalidades
- **Para usuarios:** Crear reseñas, ver reseñas públicas aprobadas
- **Para administradores GAD:** Moderación completa, filtros, paginación, registro de actividades
- **Validaciones:** Un usuario solo puede reseñar un lugar una vez
- **Integración:** Valida que el lugar existe consultando al microservicio de lugares

## Variables de entorno / Configuración
- `PORT`: Puerto en el que corre el microservicio (por defecto: 3004)
- `MONGO_URI`: URI de conexión a MongoDB (por defecto: mongodb://localhost:27017/reviewsDB)
- `JWT_SECRET`: Clave secreta para validación de tokens JWT (debe ser igual en todos los microservicios, ej: `secretAuth`)
- `AUTH_SERVICE_URL`: URL del microservicio de autenticación (por defecto: http://localhost:3001)
- `PLACES_SERVICE_URL`: URL del microservicio de lugares (por defecto: http://localhost:3002)

## Ejecución local
```bash
npm install
node index.js
```

## Dependencias principales
- express
- mongoose
- axios (para comunicación entre microservicios)
- dotenv
- cors
- helmet
- express-rate-limit

## Arquitectura
- Basado en Node.js + Express
- Estructura modular: controllers, services, models, middlewares, routes, config
- MongoDB como base de datos independiente
- Autenticación centralizada vía microservicio de auth
- Validación de lugares vía microservicio de places

## Endpoints detallados

### Para usuarios
- `POST /reviews/` — Crear reseña
  - Body: `{ lugarId, comentario, calificacion }`
  - Headers: `Authorization: Bearer <token>`
  - Validaciones: Usuario no puede reseñar el mismo lugar dos veces

- `GET /reviews/lugar/:lugarId` — Obtener reseñas públicas
  - Query params: `page`, `limit`, `sortBy`, `order`
  - Solo muestra reseñas aprobadas (no bloqueadas)

### Para administradores GAD
- `GET /reviews/admin` — Listar todas las reseñas
  - Query params: `page`, `limit`, `estado`, `search`, `lugarId`, `usuarioId`, `sortBy`, `order`
  - Headers: `Authorization: Bearer <token-GAD>`

- `GET /reviews/admin/:id` — Obtener reseña específica
  - Headers: `Authorization: Bearer <token-GAD>`

- `PUT /reviews/admin/:id` — Cambiar estado
  - Body: `{ estado: "aprobada" | "bloqueada" }`
  - Headers: `Authorization: Bearer <token-GAD>`
  - Registra actividad administrativa

- `DELETE /reviews/admin/:id` — Eliminar reseña
  - Headers: `Authorization: Bearer <token-GAD>`
  - Registra actividad administrativa

## Modelo de datos
```javascript
{
  lugarId: ObjectId,      // Referencia al lugar
  usuarioId: ObjectId,    // Referencia al usuario
  comentario: String,     // Texto de la reseña
  calificacion: Number,   // 1-5 estrellas
  fecha: Date,           // Fecha de creación
  estado: String         // "aprobada" | "bloqueada"
}
```

## Pruebas
- Puedes usar herramientas como Postman para probar todos los endpoints
- Ejemplo de creación de reseña:
  - Endpoint: `POST /reviews/`
  - Body: `{ "lugarId": "64f...", "comentario": "Excelente lugar...", "calificacion": 5 }`
  - Header: `Authorization: Bearer <token>`

## Despliegue en producción
- Configura las variables de entorno en el servidor de producción
- Usa un proceso manager como PM2 o Docker para mantener el servicio activo
- Asegúrate de que la base de datos MongoDB esté accesible
- Verifica que los microservicios de auth y places estén disponibles

## Troubleshooting
- **Error de token inválido:** Verifica que la clave JWT_SECRET sea igual en todos los microservicios
- **Error de conexión a MongoDB:** Verifica la URI y que el servicio de MongoDB esté activo
- **Error de lugar no encontrado:** Verifica que el microservicio de places esté funcionando

## Contacto
- Equipo de desarrollo: turismo@esmeraldas.gob.ec
- Documentación oficial: [Enlace a la wiki o documentación interna]

---

**Desarrollado para Esmeraldas Turismo** 