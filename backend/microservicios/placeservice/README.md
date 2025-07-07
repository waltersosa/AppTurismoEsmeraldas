# Microservicio Places Service

## Descripción
Microservicio para la gestión de lugares turísticos en el sistema de turismo de Esmeraldas. Maneja el CRUD completo de lugares, incluyendo filtros, paginación y gestión de estados.

## Puerto
- **Puerto**: 3002

## Base de Datos
- **Base de datos**: `places_db`
- **Colección principal**: `places`

## Modelo de Datos

### Place Schema
```javascript
{
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  images: [{ type: String }],
  coverImage: { type: String },
  active: { type: Boolean, default: true },
  ownerId: { type: ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}
```

### Campos del Modelo
- **name**: Nombre del lugar turístico (requerido)
- **description**: Descripción detallada del lugar (requerido)
- **category**: Categoría del lugar (requerido)
- **location**: Ubicación del lugar (requerido)
- **images**: Array de URLs de imágenes del lugar
- **coverImage**: URL de la imagen de portada
- **active**: Estado activo/inactivo del lugar (por defecto: true)
- **ownerId**: ID del propietario/usuario que creó el lugar (requerido)
- **createdAt**: Fecha de creación
- **updatedAt**: Fecha de última actualización

## Endpoints

### 1. Obtener Todos los Lugares
```
GET /places
```

**Query Parameters:**
- `page` (opcional): Número de página (por defecto: 1)
- `limit` (opcional): Elementos por página (por defecto: 10)
- `search` (opcional): Búsqueda por nombre
- `category` (opcional): Filtrar por categoría
- `active` (opcional): Filtrar por estado (true/false)
- `sortBy` (opcional): Campo para ordenar (por defecto: createdAt)
- `order` (opcional): Orden ascendente/descendente (asc/desc, por defecto: desc)

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "Playa de Atacames",
      "description": "Hermosa playa con aguas cristalinas",
      "category": "playa",
      "location": "Atacames, Esmeraldas",
      "images": ["https://example.com/image1.jpg"],
      "coverImage": "https://example.com/cover.jpg",
      "active": true,
      "ownerId": "64f8a1b2c3d4e5f6a7b8c9d1",
      "createdAt": "2023-09-06T10:30:00.000Z",
      "updatedAt": "2023-09-06T10:30:00.000Z"
    }
  ],
  "pagination": {
    "total": 25,
    "page": 1,
    "limit": 10
  }
}
```

### 2. Obtener Lugar por ID
```
GET /places/:id
```

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "Playa de Atacames",
    "description": "Hermosa playa con aguas cristalinas",
    "category": "playa",
    "location": "Atacames, Esmeraldas",
    "images": ["https://example.com/image1.jpg"],
    "coverImage": "https://example.com/cover.jpg",
    "active": true,
    "ownerId": "64f8a1b2c3d4e5f6a7b8c9d1",
    "createdAt": "2023-09-06T10:30:00.000Z",
    "updatedAt": "2023-09-06T10:30:00.000Z"
  }
}
```

**Respuesta de Error (404):**
```json
{
  "success": false,
  "message": "Place not found"
}
```

### 3. Crear Nuevo Lugar
```
POST /places
```

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Playa de Atacames",
  "description": "Hermosa playa con aguas cristalinas y arena blanca",
  "category": "playa",
  "location": "Atacames, Esmeraldas",
  "images": ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
  "coverImage": "https://example.com/cover.jpg"
}
```

**Nota:** El campo `ownerId` se asigna automáticamente con el ID del usuario autenticado.

**Respuesta Exitosa (201):**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "Playa de Atacames",
    "description": "Hermosa playa con aguas cristalinas y arena blanca",
    "category": "playa",
    "location": "Atacames, Esmeraldas",
    "images": ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
    "coverImage": "https://example.com/cover.jpg",
    "active": true,
    "ownerId": "64f8a1b2c3d4e5f6a7b8c9d1",
    "createdAt": "2023-09-06T10:30:00.000Z",
    "updatedAt": "2023-09-06T10:30:00.000Z"
  }
}
```

**Respuesta de Error (400):**
```json
{
  "success": false,
  "message": "Faltan campos obligatorios: name, description, category, location, ownerId"
}
```

### 4. Actualizar Lugar
```
PUT /places/:id
```

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Playa de Atacames - Actualizada",
  "description": "Descripción actualizada del lugar",
  "category": "playa",
  "location": "Atacames, Esmeraldas",
  "images": ["https://example.com/new-image.jpg"],
  "coverImage": "https://example.com/new-cover.jpg"
}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "Playa de Atacames - Actualizada",
    "description": "Descripción actualizada del lugar",
    "category": "playa",
    "location": "Atacames, Esmeraldas",
    "images": ["https://example.com/new-image.jpg"],
    "coverImage": "https://example.com/new-cover.jpg",
    "active": true,
    "ownerId": "64f8a1b2c3d4e5f6a7b8c9d1",
    "createdAt": "2023-09-06T10:30:00.000Z",
    "updatedAt": "2023-09-06T11:00:00.000Z"
  }
}
```

### 5. Actualizar Estado del Lugar
```
PATCH /places/:id/status
```

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Body:**
```json
{
  "active": false
}
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "Playa de Atacames",
    "description": "Hermosa playa con aguas cristalinas",
    "category": "playa",
    "location": "Atacames, Esmeraldas",
    "images": ["https://example.com/image1.jpg"],
    "coverImage": "https://example.com/cover.jpg",
    "active": false,
    "ownerId": "64f8a1b2c3d4e5f6a7b8c9d1",
    "createdAt": "2023-09-06T10:30:00.000Z",
    "updatedAt": "2023-09-06T11:30:00.000Z"
  }
}
```

### 6. Eliminar Lugar
```
DELETE /places/:id
```

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "Playa de Atacames",
    "description": "Hermosa playa con aguas cristalinas",
    "category": "playa",
    "location": "Atacames, Esmeraldas",
    "images": ["https://example.com/image1.jpg"],
    "coverImage": "https://example.com/cover.jpg",
    "active": true,
    "ownerId": "64f8a1b2c3d4e5f6a7b8c9d1",
    "createdAt": "2023-09-06T10:30:00.000Z",
    "updatedAt": "2023-09-06T10:30:00.000Z"
  }
}
```

### 7. Obtener Actividades de Administrador
```
GET /places/admin/activities
```

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "actividades": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d2",
      "usuario": "64f8a1b2c3d4e5f6a7b8c9d1",
      "nombreUsuario": "admin@esmeraldas.gob.ec",
      "accion": "creó un lugar",
      "recurso": "Playa de Atacames",
      "fecha": "2023-09-06T10:30:00.000Z"
    }
  ]
}
```

### 8. Contar Lugares (Endpoint de Integración)
```
GET /places/count
```

**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Respuesta Exitosa (200):**
```json
{
  "count": 25
}
```

## Autenticación y Autorización

### Roles Requeridos
- **Todos los endpoints**: Requieren token JWT válido
- **Crear, actualizar, eliminar**: Solo usuarios autenticados
- **Actividades de admin**: Solo usuarios con rol 'gad'

### Headers de Autenticación
```
Authorization: Bearer <JWT_TOKEN>
```

## Validaciones

### Al Crear/Actualizar Lugares
- **name**: Requerido, string
- **description**: Requerido, string
- **category**: Requerido, string
- **location**: Requerido, string
- **ownerId**: Requerido, ObjectId (se asigna automáticamente)
- **images**: Array de URLs válidas (opcional)
- **coverImage**: URL válida (opcional)

### Validación de URLs de Imágenes
- Todas las URLs de imágenes deben comenzar con "http"
- Se filtran automáticamente URLs inválidas

## Códigos de Error

### 400 - Bad Request
- Campos obligatorios faltantes
- URLs de imágenes inválidas
- Datos de entrada incorrectos

### 401 - Unauthorized
- Token JWT faltante o inválido
- Token expirado

### 404 - Not Found
- Lugar no encontrado

### 500 - Internal Server Error
- Errores del servidor

## Ejemplos de Uso

### Crear un Lugar
```bash
curl -X POST http://localhost:3002/places \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Playa de Atacames",
    "description": "Hermosa playa con aguas cristalinas",
    "category": "playa",
    "location": "Atacames, Esmeraldas",
    "images": ["https://example.com/image1.jpg"],
    "coverImage": "https://example.com/cover.jpg"
  }'
```

### Obtener Lugares con Filtros
```bash
curl -X GET "http://localhost:3002/places?category=playa&active=true&page=1&limit=5" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Actualizar Estado de Lugar
```bash
curl -X PATCH http://localhost:3002/places/64f8a1b2c3d4e5f6a7b8c9d0/status \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"active": false}'
```

## Integración con Otros Microservicios

### Stats Service
- Proporciona el endpoint `/places/count` para estadísticas globales
- Devuelve el número total de lugares activos

### Media Upload Service
- Los lugares pueden incluir URLs de imágenes subidas a través del servicio de media
- Las imágenes se validan para asegurar que sean URLs válidas

### Reviews Service
- Los lugares pueden recibir reseñas de usuarios
- El `ownerId` permite identificar al propietario para notificaciones

## Notas Importantes

1. **ownerId**: Se asigna automáticamente al crear un lugar con el ID del usuario autenticado
2. **Imágenes**: Solo se aceptan URLs válidas que comiencen con "http"
3. **Actividades**: Se registran automáticamente las acciones de usuarios con rol 'gad'
4. **Paginación**: Todos los endpoints de listado incluyen información de paginación
5. **Filtros**: Se pueden combinar múltiples filtros en las consultas
6. **Ordenamiento**: Se puede ordenar por cualquier campo del modelo

---

**Desarrollado para Esmeraldas Turismo** 