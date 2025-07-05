# 🏝️ Esmeraldas Turismo - Microservicios (Auth, Places, Reviews & Media)

**Esmeraldas Turismo** es un sistema modular basado en microservicios para la gestión de usuarios, lugares turísticos, reseñas y archivos multimedia, pensado para gobiernos locales (GAD), propietarios y turistas. Incluye autenticación robusta, gestión de lugares, reseñas, subida de imágenes y está listo para integrarse con frontends modernos y un API Gateway.

---

## 📑 Tabla de Contenido

- [Arquitectura del Sistema](#arquitectura-del-sistema)
- [Auth Service](#auth-service)
- [Places Service](#places-service)
- [Reviews Service](#reviews-service)
- [Media Service](#media-service)
- [Modelos de Base de Datos](#modelos-de-base-de-datos)
- [Configuración](#configuración)
- [Seguridad](#seguridad)
- [Integración con API Gateway](#integración-con-api-gateway)
- [Notas Importantes](#notas-importantes)
- [Soporte](#soporte)

---

## 🏗️ Arquitectura del Sistema

### Arquitectura Completa

![Arquitectura Completa](./backend/arquitectura/aquitectura-turismo-esmeraldas.jpg)

### Estructura de Microservicios

![Estructura Microservicios](./backend/arquitectura/arquitectura-microservicios.jpg)

---

# 🔐 Auth Service

Microservicio de autenticación para el sistema "Esmeraldas Turismo".

## 🚀 Características

- **Autenticación JWT**: Tokens seguros con expiración configurable
- **Roles de usuario**: Soporte para `usuario`, `propietario` y `gad`
- **Hash de contraseñas**: Encriptación con bcrypt
- **Validación robusta**: Validación de datos con express-validator
- **Arquitectura modular**: Separación clara de responsabilidades
- **Manejo de errores**: Sistema centralizado de manejo de errores
- **CORS configurado**: Soporte para peticiones cross-origin
- **Logging**: Registro de todas las peticiones
- **Rutas administrativas solo para GAD**

## 📁 Estructura del Proyecto (Auth)

```
backend/
├── controllers/
│   └── authController.js
├── services/
│   └── authService.js
├── middlewares/
│   ├── auth.js
│   ├── validation.js
│   └── errorHandler.js
├── repositories/
│   └── userRepository.js
├── models/
│   └── User.js
├── utils/
│   ├── jwt.js
│   └── response.js
├── routes/
│   └── auth.js
├── db/
│   └── connection.js
```

## 🛠️ Instalación (General)

1. **Instalar dependencias**
   ```bash
   cd backend
   npm install
   ```
2. **Configurar variables de entorno**
   ```env
   PORT=3001
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/turismoDB
   JWT_SECRET=tu_jwt_secret_super_seguro_aqui
   JWT_EXPIRES_IN=24h
   CORS_ORIGIN=http://localhost:3000, http://localhost:4200
   ```
3. **Iniciar MongoDB**
4. **Ejecutar el servidor**
   ```bash
   npm run dev
   # o
   npm start
   ```

## 📡 Endpoints (Auth)

### Rutas Públicas

- `POST /auth/register` - Registro de usuario
- `POST /auth/login` - Autenticación
- `GET /auth/validate` - Validación de token
- `GET /auth/health` - Estado del servicio

### Rutas Protegidas

- `GET /auth/profile` - Obtener perfil
- `PUT /auth/profile` - Actualizar perfil
- `DELETE /auth/profile` - Eliminar usuario
- `PUT /auth/change-password` - Cambiar contraseña

### Rutas Administrativas (solo GAD)

- `GET /auth/users` - Listar todos los usuarios activos
- `DELETE /auth/users/:id` - Eliminar usuario (eliminación física)

## 🧪 Pruebas (Auth)

Para probar todas las funcionalidades del microservicio, consulta el archivo:
**[Postman_Collection.md](./backend/Postman_Collection.md)**

---

# 📍 Places Service

Microservicio de gestión de lugares turísticos para el sistema "Esmeraldas Turismo".

## 🚀 Características

- **CRUD completo de lugares turísticos**
- **Gestión de imágenes**: URLs de la web y archivos locales
- **Validación automática de URLs**: Verificación de accesibilidad
- **Compatibilidad total**: Mapeo automático de campos
- **Paginación, filtrado y orden dinámico**
- **Validación robusta**: express-validator con mensajes en español
- **Arquitectura modular**
- **Manejo de errores centralizado**
- **CORS configurado**
- **Logging de peticiones**
- **Acceso restringido**: Solo GAD puede gestionar lugares

## 📁 Estructura del Proyecto (Places)

```
backend/
├── controllers/
│   └── placeController.js
├── services/
│   ├── placeService.js
│   └── uploadMediaService.js
├── middlewares/
│   ├── placeValidation.js
│   └── errorHandler.js
├── models/
│   └── Place.js
├── routes/
│   └── place.js
├── scripts/
│   ├── migratePlaces.js
│   └── cleanPlacesData.js
```

## 📡 Endpoints (Places)

### Rutas Públicas

- `GET /places/health` - Estado del servicio
- `GET /places` - Listar lugares (con paginación, filtro y orden)
- `GET /places/:id` - Obtener lugar por ID

### Rutas de Gestión (Solo GAD)

- `POST /places` - Crear lugar (requiere autenticación GAD)
- `PUT /places/:id` - Actualizar lugar (requiere autenticación GAD)
- `DELETE /places/:id` - Eliminar lugar (requiere autenticación GAD)

## 🖼️ Gestión de Imágenes

### Tipos de Imágenes Soportados

**URLs de la Web:**

- ✅ URLs HTTP/HTTPS válidas
- ✅ Formatos: JPG, JPEG, PNG, GIF, WEBP, BMP
- ✅ Validación automática de accesibilidad
- ✅ Timeout de 5 segundos para validación

**Archivos Locales:**

- ✅ Subida a través del Media Service
- ✅ Almacenamiento en `/uploads/`
- ✅ Referencias por ObjectId

### Campos de Imágenes

- **`coverImageUrl`**: URL directa de la imagen de portada
- **`imageUrls`**: Array de URLs de imágenes de galería
- **`coverImage`**: Referencia a Media (archivo local)
- **`images`**: Array de referencias a Media (archivos locales)

### Validaciones

- **Nombre**: 2-100 caracteres
- **Descripción**: 10-1000 caracteres
- **Ubicación**: 5-200 caracteres
- **Categoría**: 2-50 caracteres (opcional)
- **URLs**: Deben ser válidas y accesibles
- **Imágenes**: Solo formatos de imagen soportados

## 🧪 Pruebas (Places)

Para probar todas las funcionalidades del microservicio, consulta el archivo:
**[Postman_Collection_Places.md](./backend/Postman_Collection_Places.md)**

---

# 📝 Reviews Service

Microservicio de gestión de reseñas de lugares turísticos para el sistema "Esmeraldas Turismo".

## 🚀 Características

- **Creación y gestión de reseñas**
- **Estados: aprobada/bloqueada**
- **Paginación, filtrado y orden dinámico**
- **Validación robusta**: express-validator
- **Moderación por administradores (GAD)**
- **CORS configurado**
- **Logging de peticiones**

## 📁 Estructura del Proyecto (Reviews)

```
backend/
├── controllers/
│   └── reviewController.js
├── services/
│   └── reviewService.js
├── middlewares/
│   ├── reviewValidation.js
│   └── errorHandler.js
├── models/
│   └── Review.js
├── routes/
│   └── review.js
```

## 📡 Endpoints (Reviews)

### Rutas Públicas

- `GET /reviews/health` - Estado del servicio
- `GET /reviews/lugar/:lugarId` - Listar reseñas públicas de un lugar (todas excepto bloqueadas)
- `POST /reviews` - Crear reseña (requiere autenticación)

### Rutas de Administración (solo GAD)

- `GET /reviews/admin` - Listar todas las reseñas (con filtros, paginación y orden)
- `GET /reviews/admin/:id` - Obtener una reseña específica por ID
- `PUT /reviews/admin/:id` - Cambiar estado (aprobada/bloqueada)
- `DELETE /reviews/admin/:id` - Eliminar reseña

## 🧪 Pruebas (Reviews)

Para probar todas las funcionalidades del microservicio, consulta el archivo:
**[Postman_Collection_Reviews.md](./backend/Postman_Collection_Reviews.md)**

---

# 📸 Media Service

Microservicio de gestión de archivos multimedia (imágenes) para el sistema "Esmeraldas Turismo".

## 🚀 Características

- **Subida de imágenes asociadas a lugares**
- **Imagen de portada específica por lugar**
- **Galería de imágenes por lugar**
- **Validación de tipos de archivo**
- **Almacenamiento local con URLs accesibles**
- **Relación directa con el Places Service**
- **CORS configurado**
- **Logging de peticiones**
- **Acceso restringido**: Solo GAD puede subir/eliminar imágenes

## 📁 Estructura del Proyecto (Media)

```
backend/
├── controllers/
│   └── mediaController.js
├── middlewares/
│   └── mediaValidation.js
├── models/
│   └── Media.js
├── routes/
│   └── media.js
├── uploads/
│   └── (archivos subidos)
```

## 📡 Endpoints (Media)

### Rutas Públicas

- `GET /media/health` - Estado del servicio
- `GET /media/file/:filename` - Obtener archivo por nombre
- `GET /media/place/:placeId` - Obtener imágenes por lugar

### Rutas de Gestión (Solo GAD)

- `POST /media/upload` - Subir imágenes (requiere placeId y autenticación GAD)
- `DELETE /media/:mediaId` - Eliminar imagen (requiere autenticación GAD)

## 🧪 Pruebas (Media)

Para probar todas las funcionalidades del microservicio, consulta el archivo:
**[Postman_Collection_Media.md](./backend/Postman_Collection_Media.md)**

---

# 🗄️ Modelos de Base de Datos

## Auth - Colección: `users`

```javascript
{
  _id: ObjectId,
  nombre: String,           // Requerido, 2-50 caracteres
  correo: String,           // Requerido, único, email válido
  contraseña: String,       // Requerido, hasheada con bcrypt
  rol: String,              // Enum: 'usuario', 'propietario', 'gad'
  activo: Boolean,          // Default: true
  fechaCreacion: Date,      // Default: Date.now
  ultimoAcceso: Date,       // Default: Date.now
  createdAt: Date,          // Timestamp automático
  updatedAt: Date           // Timestamp automático
}
```

- **Eliminación física:** Cuando se elimina un usuario desde el panel de administración, se borra completamente de la base de datos.

## Places - Colección: `places`

```javascript
{
  _id: ObjectId,
  name: String,         // Requerido, 2-100 caracteres
  description: String,  // Requerido, 10-1000 caracteres
  location: String,     // Requerido, 5-200 caracteres
  category: String,     // Opcional, 2-50 caracteres
  coverImage: ObjectId, // Referencia a Media (archivo local)
  coverImageUrl: String, // URL directa de imagen de portada
  images: [ObjectId],   // Referencias a Media (archivos locales)
  imageUrls: [String],  // URLs directas de imágenes
  active: Boolean,      // Default: true
  createdAt: Date,      // Timestamp automático
  updatedAt: Date       // Timestamp automático
}
```

## Media - Colección: `media`

```javascript
{
  _id: ObjectId,
  filename: String,     // Nombre del archivo en el servidor
  originalName: String, // Nombre original del archivo
  url: String,          // URL para acceder al archivo
  placeId: ObjectId,    // Referencia a Place (requerido)
  type: String,         // 'cover' o 'gallery'
  active: Boolean,      // Default: true
  createdAt: Date,      // Timestamp automático
  updatedAt: Date       // Timestamp automático
}
```

## Reviews - Colección: `reviews`

```javascript
{
  _id: ObjectId,
  lugarId: ObjectId,        // Referencia a Place
  usuarioId: ObjectId,      // Referencia a User
  comentario: String,       // Requerido
  calificacion: Number,     // 1-5
  fecha: Date,              // Default: Date.now
  estado: String,           // 'aprobada' o 'bloqueada'
  createdAt: Date,          // Timestamp automático
  updatedAt: Date           // Timestamp automático
}
```

---

# 🔧 Configuración

### Variables de Entorno (Generales)

| Variable         | Descripción                                | Default                                        |
| ---------------- | ------------------------------------------ | ---------------------------------------------- |
| `PORT`           | Puerto del servidor                        | `3001`                                         |
| `NODE_ENV`       | Entorno de ejecución                       | `development`                                  |
| `MONGODB_URI`    | URI de conexión a MongoDB                  | `mongodb://localhost:27017/turismoDB`          |
| `CORS_ORIGIN`    | Origen permitido para CORS                 | `http://localhost:3000, http://localhost:4200` |
| `JWT_SECRET`     | Clave secreta para JWT (solo Auth)         | `default_secret_change_in_production`          |
| `JWT_EXPIRES_IN` | Tiempo de expiración del token (solo Auth) | `24h`                                          |

# 🔒 Seguridad

- **Contraseñas hasheadas** (Auth): Uso de bcrypt con salt de 12 rondas
- **JWT seguro** (Auth): Tokens con issuer y audience específicos
- **Validación de entrada**: Sanitización y validación de todos los datos
- **CORS configurado**: Control de orígenes permitidos
- **Rate limiting**: Implementar según necesidades
- **Acceso restringido**: Solo GAD puede gestionar lugares e imágenes

---

# 🤝 Integración con API Gateway

- **Health Check**: Usar `/auth/health`, `/places/health`, `/reviews/health` y `/media/health` para verificar disponibilidad
- **Autenticación**: Validar tokens en `/auth/validate` (Auth)
- **CORS**: Configurar según el dominio del frontend
- **Load Balancing**: Los servicios son stateless y pueden escalar horizontalmente

---

# 📝 Notas Importantes

- **Tokens JWT**: Duración de 24 horas por defecto (Auth)
- **Contraseñas**: Mínimo 6 caracteres, mayúsculas, minúsculas y números (Auth)
- **Correos**: Únicos en el sistema (Auth)
- **Roles**: Solo 'usuario', 'propietario' y 'gad' (Auth)
- **Campos obligatorios en places**: name (2-100 chars), description (10-1000 chars), location (5-200 chars)
- **active en places**: Por defecto es `true`, puedes desactivar un lugar sin eliminarlo
- **category en places**: Opcional, 2-50 caracteres, se recomienda usar valores estándar
- **Imágenes en places**: Soporta URLs directas (`coverImageUrl`, `imageUrls`) y archivos locales (`coverImage`, `images`)
- **Validación de URLs**: Verifica automáticamente que las URLs de imágenes sean válidas y accesibles
- **Acceso GAD**: Solo usuarios con rol GAD pueden gestionar lugares e imágenes
- **Las reviews están aprobadas por defecto y solo pueden ser bloqueadas por el admin**
- **El endpoint público de reviews muestra todas excepto las bloqueadas**
- **Base de datos**: MongoDB en `mongodb://localhost:27017/turismoDB`
- **Eliminación**: Soft delete en users, delete físico en places, reviews y media
- **Imágenes**: Almacenadas en `/backend/uploads/` con URLs accesibles via `/media/file/:filename`
- **Relación Media-Places**: Cada imagen debe estar asociada a un lugar específico

---

# 📞 Soporte

Para soporte técnico o preguntas sobre los microservicios, contactar al equipo de desarrollo de Esmeraldas Turismo.

## 🛠️ Notas adicionales

- El frontend solo permite visualizar y eliminar usuarios. No es posible agregar ni actualizar usuarios desde la interfaz.
- El backend maneja errores de correo duplicado (409) y usuario no encontrado (404) de forma clara.
- Los scripts de migración y limpieza están disponibles en `/backend/scripts/` para mantener la integridad de los datos.
