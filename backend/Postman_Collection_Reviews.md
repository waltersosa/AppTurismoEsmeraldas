# 🧪 Pruebas en Postman - Reviews Service Esmeraldas Turismo

Esta guía te ayudará a probar todas las funcionalidades del microservicio de reseñas turísticas usando Postman.

## 📋 Configuración Inicial

### 1. Variables de Entorno en Postman

Crea un nuevo environment en Postman con las siguientes variables:

| Variable     | Valor Inicial           | Descripción                   |
| ------------ | ----------------------- | ----------------------------- |
| `base_url`   | `http://localhost:3001` | URL base del microservicio    |
| `auth_token` | (vacío)                 | Token JWT para autenticación  |
| `place_id`   | (vacío)                 | ID del lugar para las reseñas |
| `review_id`  | (vacío)                 | ID de la reseña creada        |

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
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Iniciar el servidor:**
   ```bash
   npm run dev
   ```

## 🧪 Colección de Pruebas

### 1. Health Check - Verificar Estado del Servicio

**Método:** `GET`  
**URL:** `{{base_url}}/reviews/health`

**Respuesta esperada:**

```json
{
  "success": true,
  "message": "Reviews Service running",
  "data": {
    "service": "Reviews Service",
    "version": "1.0.0",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "status": "healthy"
  }
}
```

---

### 2. Crear Reseña (Usuario)

**Método:** `POST`  
**URL:** `{{base_url}}/reviews`  
**Headers:**

```
Content-Type: application/json
Authorization: Bearer {{auth_token}}
```

**Body (JSON):**

```json
{
  "lugarId": "{{place_id}}",
  "comentario": "Excelente lugar turístico, muy recomendado para visitar en familia.",
  "calificacion": 5
}
```

**Respuesta esperada:**

```json
{
  "success": true,
  "data": {
    "_id": "65f8a1b2c3d4e5f6a7b8c9d0",
    "lugarId": "65f8a1b2c3d4e5f6a7b8c9d1",
    "usuarioId": "65f8a1b2c3d4e5f6a7b8c9d2",
    "comentario": "Excelente lugar turístico, muy recomendado para visitar en familia.",
    "calificacion": 5,
    "fecha": "2024-01-01T00:00:00.000Z",
    "estado": "aprobada",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Script de Postman (Tests):**

```javascript
if (pm.response.code === 201) {
  const response = pm.response.json();
  pm.environment.set("review_id", response.data._id);
  console.log("Reseña creada y review_id guardado");
}
```

---

### 3. Obtener Reseñas de un Lugar (Públicas)

**Método:** `GET`  
**URL:** `{{base_url}}/reviews/lugar/{{place_id}}?page=1&limit=10&sortBy=fecha&order=desc`

**Respuesta esperada:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "65f8a1b2c3d4e5f6a7b8c9d0",
      "lugarId": "65f8a1b2c3d4e5f6a7b8c9d1",
      "usuarioId": {
        "_id": "65f8a1b2c3d4e5f6a7b8c9d2",
        "nombre": "Juan Pérez"
      },
      "comentario": "Excelente lugar turístico, muy recomendado para visitar en familia.",
      "calificacion": 5,
      "fecha": "2024-01-01T00:00:00.000Z",
      "estado": "aprobada",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10
  }
}
```

---

### 4. Listar Reseñas (Administrador)

> **IMPORTANTE:** Las rutas de administración requieren autenticación y que el usuario tenga el rol `gad` (administrador). Si no tienes el rol adecuado, recibirás un error de autorización.

**Método:** `GET`  
**URL:** `{{base_url}}/reviews/admin?page=1&limit=10&estado=aprobada&search=excelente&sortBy=fecha&order=desc`
**Headers:**

```
Authorization: Bearer {{auth_token}}
```

**Respuesta esperada:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "65f8a1b2c3d4e5f6a7b8c9d0",
      "lugarId": {
        "_id": "65f8a1b2c3d4e5f6a7b8c9d1",
        "name": "Malecón de Esmeraldas"
      },
      "usuarioId": {
        "_id": "65f8a1b2c3d4e5f6a7b8c9d2",
        "nombre": "Juan Pérez"
      },
      "comentario": "Excelente lugar turístico, muy recomendado para visitar en familia.",
      "calificacion": 5,
      "fecha": "2024-01-01T00:00:00.000Z",
      "estado": "aprobada",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "total": 1,
    "page": 1,
    "limit": 10
  }
}
```

**Ejemplo de error de autorización:**

```json
{
  "success": false,
  "message": "No tienes permisos para acceder a este recurso",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

---

### 5. Bloquear Reseña (Administrador)

**Método:** `PUT`  
**URL:** `{{base_url}}/reviews/admin/{{review_id}}`  
**Headers:**

```
Content-Type: application/json
Authorization: Bearer {{auth_token}}
```

**Body (JSON):**

```json
{
  "estado": "bloqueada"
}
```

**Respuesta esperada:**

```json
{
  "success": true,
  "data": {
    "_id": "65f8a1b2c3d4e5f6a7b8c9d0",
    "lugarId": "65f8a1b2c3d4e5f6a7b8c9d1",
    "usuarioId": "65f8a1b2c3d4e5f6a7b8c9d2",
    "comentario": "Excelente lugar turístico, muy recomendado para visitar en familia.",
    "calificacion": 5,
    "fecha": "2024-01-01T00:00:00.000Z",
    "estado": "bloqueada",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 6. Aprobar Reseña (Administrador)

**Método:** `PUT`  
**URL:** `{{base_url}}/reviews/admin/{{review_id}}`  
**Headers:**

```
Content-Type: application/json
Authorization: Bearer {{auth_token}}
```

**Body (JSON):**

```json
{
  "estado": "aprobada"
}
```

**Respuesta esperada:**

```json
{
  "success": true,
  "data": {
    "_id": "65f8a1b2c3d4e5f6a7b8c9d0",
    "lugarId": "65f8a1b2c3d4e5f6a7b8c9d1",
    "usuarioId": "65f8a1b2c3d4e5f6a7b8c9d2",
    "comentario": "Excelente lugar turístico, muy recomendado para visitar en familia.",
    "calificacion": 5,
    "fecha": "2024-01-01T00:00:00.000Z",
    "estado": "aprobada",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 7. Eliminar Reseña (Administrador)

**Método:** `DELETE`  
**URL:** `{{base_url}}/reviews/admin/{{review_id}}`  
**Headers:**

```
Authorization: Bearer {{auth_token}}
```

**Respuesta esperada:**

```json
{
  "success": true,
  "data": {
    "_id": "65f8a1b2c3d4e5f6a7b8c9d0",
    "lugarId": "65f8a1b2c3d4e5f6a7b8c9d1",
    "usuarioId": "65f8a1b2c3d4e5f6a7b8c9d2",
    "comentario": "Excelente lugar turístico, muy recomendado para visitar en familia.",
    "calificacion": 5,
    "fecha": "2024-01-01T00:00:00.000Z",
    "estado": "bloqueada",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 🔍 Casos de Prueba Adicionales

### Error: Calificación inválida

**Método:** `POST`  
**URL:** `{{base_url}}/reviews`  
**Body:**

```json
{
  "lugarId": "{{place_id}}",
  "comentario": "Lugar regular",
  "calificacion": 6
}
```

**Respuesta esperada:**

```json
{
  "success": false,
  "errors": [
    {
      "type": "field",
      "value": 6,
      "msg": "La calificación debe ser un número del 1 al 5",
      "path": "calificacion",
      "location": "body"
    }
  ]
}
```

### Error: Estado inválido

**Método:** `PUT`  
**URL:** `{{base_url}}/reviews/admin/{{review_id}}`  
**Body:**

```json
{
  "estado": "invalido"
}
```

**Respuesta esperada:**

```json
{
  "success": false,
  "errors": [
    {
      "type": "field",
      "value": "invalido",
      "msg": "Estado inválido",
      "path": "estado",
      "location": "body"
    }
  ]
}
```

---

## 📝 Notas Importantes

- **Autenticación**: Las rutas de usuario requieren token JWT válido
- **Autorización**: Las rutas de administrador requieren token JWT válido y rol GAD
- **Validación**: Un usuario solo puede reseñar un lugar una vez
- **Estados**: Las reseñas están aprobadas por defecto y solo pueden ser bloqueadas por el admin
- **El endpoint público muestra todas las reseñas excepto las bloqueadas**
- **Paginación**: Todas las listas soportan paginación y ordenamiento
