# 🧪 Pruebas en Postman - Esmeraldas Turismo (Todos los Servicios)

Esta guía te ayudará a probar todas las funcionalidades de los microservicios de Esmeraldas Turismo usando Postman.

## 📋 Configuración Inicial

### 1. Variables de Entorno en Postman

Crea un nuevo environment en Postman con las siguientes variables:

| Variable     | Valor Inicial           | Descripción                          |
| ------------ | ----------------------- | ------------------------------------ |
| `base_url`   | `http://localhost:3001` | URL base del microservicio           |
| `auth_token` | (vacío)                 | Token JWT para autenticación general |
| `gad_token`  | (vacío)                 | Token JWT para usuario GAD           |
| `user_id`    | (vacío)                 | ID del usuario creado                |
| `place_id`   | (vacío)                 | ID del lugar creado                  |
| `review_id`  | (vacío)                 | ID de la reseña creada               |
| `media_id`   | (vacío)                 | ID del archivo multimedia            |

### 2. Headers Globales

Configura estos headers en la colección:

```
Content-Type: application/json
Accept: application/json
```

## 🔧 Configuración del Servidor

Antes de probar, asegúrate de:

1. **Tener MongoDB ejecutándose**
2. **Instalar dependencias:**

   ```bash
   cd backend
   npm install
   ```

3. **Crear archivo .env:**

   ```env
   PORT=3001
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/turismoDB
   JWT_SECRET=mi_secret_super_seguro_123
   JWT_EXPIRES_IN=24h
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Iniciar el servidor:**
   ```bash
   npm run dev
   ```

## 🧪 Servicios Disponibles

### 1. 🔐 Auth Service

**Descripción:** Autenticación y gestión de usuarios
**Base URL:** `{{base_url}}/auth`
**Documentación:** [Postman_Collection.md](./Postman_Collection.md)

**Endpoints principales:**

- `POST /auth/register` - Registro de usuario
- `POST /auth/login` - Autenticación
- `GET /auth/validate` - Validación de token
- `GET /auth/profile` - Obtener perfil (protegido)
- `GET /auth/users` - Listar usuarios (solo GAD)

### 2. 📍 Places Service

**Descripción:** Gestión de lugares turísticos
**Base URL:** `{{base_url}}/places`
**Documentación:** [Postman_Collection_Places.md](./Postman_Collection_Places.md)

**Endpoints principales:**

- `GET /places` - Listar lugares (público)
- `GET /places/:id` - Obtener lugar por ID (público)
- `POST /places` - Crear lugar (solo GAD)
- `PUT /places/:id` - Actualizar lugar (solo GAD)
- `DELETE /places/:id` - Eliminar lugar (solo GAD)

### 3. 📝 Reviews Service

**Descripción:** Gestión de reseñas de lugares
**Base URL:** `{{base_url}}/reviews`
**Documentación:** [Postman_Collection_Reviews.md](./Postman_Collection_Reviews.md)

**Endpoints principales:**

- `GET /reviews/lugar/:lugarId` - Reseñas de un lugar (público)
- `POST /reviews` - Crear reseña (autenticado)
- `GET /reviews/admin` - Listar todas las reseñas (solo GAD)
- `PUT /reviews/admin/:id` - Cambiar estado (solo GAD)

### 4. 📸 Media Service

**Descripción:** Gestión de archivos multimedia
**Base URL:** `{{base_url}}/media`
**Documentación:** [Postman_Collection_Media.md](./Postman_Collection_Media.md)

**Endpoints principales:**

- `GET /media/file/:filename` - Obtener archivo (público)
- `GET /media/place/:placeId` - Imágenes de un lugar (público)
- `POST /media/upload` - Subir imágenes (solo GAD)
- `DELETE /media/:mediaId` - Eliminar imagen (solo GAD)

## 🔐 Flujo de Autenticación

### 1. Crear Usuario GAD (si no existe)

```bash
POST {{base_url}}/auth/register
{
  "nombre": "Admin GAD",
  "correo": "admin@gad.esmeraldas.ec",
  "contraseña": "Admin123!",
  "rol": "gad"
}
```

### 2. Obtener Token GAD

```bash
POST {{base_url}}/auth/login
{
  "correo": "admin@gad.esmeraldas.ec",
  "contraseña": "Admin123!"
}
```

### 3. Usar Token en Rutas Protegidas

```
Authorization: Bearer {{gad_token}}
```

## 🧪 Colección de Pruebas - Auth Service

### 1. Health Check - Verificar Estado del Servicio

**Método:** `GET`  
**URL:** `{{base_url}}/auth/health`

**Respuesta esperada:**

```json
{
  "success": true,
  "message": "Auth Service funcionando correctamente",
  "data": {
    "service": "Auth Service",
    "version": "1.0.0",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "status": "healthy"
  }
}
```

---

### 2. Registro de Usuario - Crear Cuenta

**Método:** `POST`  
**URL:** `{{base_url}}/auth/register`  
**Headers:** `Content-Type: application/json`

**Body (JSON):**

```json
{
  "nombre": "Juan Pérez",
  "correo": "juan.perez@example.com",
  "contraseña": "Password123",
  "rol": "usuario"
}
```

**Respuesta esperada:**

```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "usuario": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "nombre": "Juan Pérez",
      "correo": "juan.perez@example.com",
      "rol": "usuario",
      "fechaCreacion": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Script de Postman (Tests):**

```javascript
// Extraer y guardar el token
if (pm.response.code === 201) {
  const response = pm.response.json();
  pm.environment.set("auth_token", response.data.token);
  pm.environment.set("user_id", response.data.usuario.id);
  console.log("Usuario registrado y token guardado");
}
```

---

### 3. Login - Autenticación

**Método:** `POST`  
**URL:** `{{base_url}}/auth/login`  
**Headers:** `Content-Type: application/json`

**Body (JSON):**

```json
{
  "correo": "juan.perez@example.com",
  "contraseña": "Password123"
}
```

**Respuesta esperada:**

```json
{
  "success": true,
  "message": "Autenticación exitosa",
  "data": {
    "usuario": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "nombre": "Juan Pérez",
      "correo": "juan.perez@example.com",
      "rol": "usuario",
      "ultimoAcceso": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Script de Postman (Tests):**

```javascript
// Extraer y guardar el token
if (pm.response.code === 200) {
  const response = pm.response.json();
  pm.environment.set("auth_token", response.data.token);
  pm.environment.set("user_id", response.data.usuario.id);
  console.log("Login exitoso y token guardado");
}
```

---

### 4. Validar Token - Verificar Autenticación

**Método:** `GET`  
**URL:** `{{base_url}}/auth/validate`  
**Headers:**

```
Authorization: Bearer {{auth_token}}
```

**Respuesta esperada:**

```json
{
  "success": true,
  "message": "Token válido",
  "data": {
    "usuario": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "nombre": "Juan Pérez",
      "correo": "juan.perez@example.com",
      "rol": "usuario",
      "ultimoAcceso": "2024-01-01T00:00:00.000Z",
      "fechaCreacion": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

### 5. Obtener Perfil - Datos del Usuario

**Método:** `GET`  
**URL:** `{{base_url}}/auth/profile`  
**Headers:**

```
Authorization: Bearer {{auth_token}}
```

**Respuesta esperada:**

```json
{
  "success": true,
  "message": "Perfil obtenido exitosamente",
  "data": {
    "usuario": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "nombre": "Juan Pérez",
      "correo": "juan.perez@example.com",
      "rol": "usuario",
      "activo": true,
      "ultimoAcceso": "2024-01-01T00:00:00.000Z",
      "fechaCreacion": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

### 6. Actualizar Perfil

**Método:** `PUT`  
**URL:** `{{base_url}}/auth/profile`  
**Headers:**

```
Content-Type: application/json
Authorization: Bearer {{auth_token}}
```

**Body (JSON):**

```json
{
  "nombre": "Juan Carlos Pérez"
}
```

**Respuesta esperada:**

```json
{
  "success": true,
  "message": "Perfil actualizado exitosamente",
  "data": {
    "usuario": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "nombre": "Juan Carlos Pérez",
      "correo": "juan.perez@example.com",
      "rol": "usuario",
      "activo": true,
      "ultimoAcceso": "2024-01-01T00:00:00.000Z",
      "fechaCreacion": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

### 7. Cambiar Contraseña

**Método:** `PUT`  
**URL:** `{{base_url}}/auth/change-password`  
**Headers:**

```
Content-Type: application/json
Authorization: Bearer {{auth_token}}
```

**Body (JSON):**

```json
{
  "contraseñaActual": "Password123",
  "nuevaContraseña": "NewPassword456"
}
```

**Respuesta esperada:**

```json
{
  "success": true,
  "message": "Contraseña cambiada exitosamente"
}
```

---

### 8. Listar Usuarios (Solo GAD)

**Método:** `GET`  
**URL:** `{{base_url}}/auth/users`  
**Headers:**

```
Authorization: Bearer {{gad_token}}
```

**Respuesta esperada:**

```json
{
  "success": true,
  "message": "Usuarios obtenidos exitosamente",
  "data": {
    "usuarios": [
      {
        "id": "64f8a1b2c3d4e5f6a7b8c9d0",
        "nombre": "Juan Carlos Pérez",
        "correo": "juan.perez@example.com",
        "rol": "usuario",
        "activo": true,
        "ultimoAcceso": "2024-01-01T00:00:00.000Z",
        "fechaCreacion": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 1
  }
}
```

---

### 9. Eliminar Usuario (Solo GAD)

**Método:** `DELETE`  
**URL:** `{{base_url}}/auth/users/{{user_id}}`  
**Headers:**

```
Authorization: Bearer {{gad_token}}
```

**Respuesta esperada:**

```json
{
  "success": true,
  "message": "Usuario eliminado exitosamente",
  "data": {
    "usuario": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "nombre": "Juan Carlos Pérez",
      "correo": "juan.perez@example.com",
      "rol": "usuario"
    }
  }
}
```

---

## 📝 Notas Importantes

### Roles de Usuario

- **`usuario`**: Usuario regular, puede crear reseñas
- **`propietario`**: Propietario de lugares, permisos extendidos
- **`gad`**: Administrador, acceso completo a todos los servicios

### Seguridad

- **Tokens JWT**: Duración de 24 horas por defecto
- **Contraseñas**: Mínimo 6 caracteres, mayúsculas, minúsculas y números
- **Correos**: Únicos en el sistema
- **Acceso GAD**: Solo usuarios con rol GAD pueden gestionar lugares e imágenes

### Validaciones

- **Nombre**: 2-50 caracteres
- **Correo**: Formato de email válido
- **Contraseña**: Mínimo 6 caracteres, mayúsculas, minúsculas y números
- **Rol**: Solo 'usuario', 'propietario' y 'gad'

### Manejo de Errores

- **400**: Error de validación
- **401**: No autenticado
- **403**: No autorizado
- **404**: Recurso no encontrado
- **409**: Conflicto (ej: correo duplicado)
- **500**: Error interno del servidor

---

## 🔗 Enlaces a Documentación Detallada

- **[Auth Service](./Postman_Collection.md)** - Documentación completa del Auth Service
- **[Places Service](./Postman_Collection_Places.md)** - Documentación completa del Places Service
- **[Reviews Service](./Postman_Collection_Reviews.md)** - Documentación completa del Reviews Service
- **[Media Service](./Postman_Collection_Media.md)** - Documentación completa del Media Service

---

## 🚀 Flujo de Trabajo Recomendado

1. **Configurar variables de entorno** en Postman
2. **Crear usuario GAD** para acceso administrativo
3. **Obtener token GAD** para rutas protegidas
4. **Probar Auth Service** (registro, login, validación)
5. **Probar Places Service** (crear, listar, actualizar lugares)
6. **Probar Media Service** (subir imágenes a lugares)
7. **Probar Reviews Service** (crear reseñas, moderación)
8. **Probar integración** entre servicios

---

## 📞 Soporte

Para soporte técnico o preguntas sobre los microservicios, contactar al equipo de desarrollo de Esmeraldas Turismo.
