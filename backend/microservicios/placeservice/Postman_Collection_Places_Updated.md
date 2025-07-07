# Postman Collection - Places Service (Actualizado con ownerId)

## Configuración del Entorno

### Variables de Entorno
```json
{
  "base_url": "http://localhost:3002",
  "auth_token": "{{jwt_token}}",
  "place_id": "{{created_place_id}}"
}
```

### Headers Globales
```
Authorization: Bearer {{auth_token}}
Content-Type: application/json
```

## Colección de Requests

### 1. Obtener Todos los Lugares
```
GET {{base_url}}/places
```

**Query Params (opcionales):**
- `page`: 1
- `limit`: 10
- `search`: atacames
- `category`: playa
- `active`: true
- `sortBy`: createdAt
- `order`: desc

**Respuesta Esperada (200):**
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
GET {{base_url}}/places/{{place_id}}
```

**Respuesta Esperada (200):**
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

### 3. Crear Nuevo Lugar
```
POST {{base_url}}/places
```

**Body:**
```json
{
  "name": "Playa de Atacames",
  "description": "Hermosa playa con aguas cristalinas y arena blanca",
  "category": "playa",
  "location": "Atacames, Esmeraldas",
  "images": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ],
  "coverImage": "https://example.com/cover.jpg"
}
```

**Tests (Postman):**
```javascript
// Extraer el ID del lugar creado
if (pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("created_place_id", response.data._id);
    
    // Verificar que ownerId está presente
    pm.test("OwnerId está presente", function () {
        pm.expect(response.data.ownerId).to.exist;
    });
    
    // Verificar que ownerId coincide con el usuario autenticado
    pm.test("OwnerId coincide con usuario autenticado", function () {
        const token = pm.environment.get("auth_token");
        const decoded = jwt_decode(token);
        pm.expect(response.data.ownerId).to.equal(decoded.userId);
    });
}
```

**Respuesta Esperada (201):**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "Playa de Atacames",
    "description": "Hermosa playa con aguas cristalinas y arena blanca",
    "category": "playa",
    "location": "Atacames, Esmeraldas",
    "images": [
      "https://example.com/image1.jpg",
      "https://example.com/image2.jpg"
    ],
    "coverImage": "https://example.com/cover.jpg",
    "active": true,
    "ownerId": "64f8a1b2c3d4e5f6a7b8c9d1",
    "createdAt": "2023-09-06T10:30:00.000Z",
    "updatedAt": "2023-09-06T10:30:00.000Z"
  }
}
```

### 4. Actualizar Lugar
```
PUT {{base_url}}/places/{{place_id}}
```

**Body:**
```json
{
  "name": "Playa de Atacames - Actualizada",
  "description": "Descripción actualizada del lugar turístico",
  "category": "playa",
  "location": "Atacames, Esmeraldas",
  "images": ["https://example.com/new-image.jpg"],
  "coverImage": "https://example.com/new-cover.jpg"
}
```

**Tests (Postman):**
```javascript
// Verificar que ownerId se mantiene después de la actualización
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.test("OwnerId se mantiene después de actualización", function () {
        pm.expect(response.data.ownerId).to.exist;
    });
}
```

**Respuesta Esperada (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "Playa de Atacames - Actualizada",
    "description": "Descripción actualizada del lugar turístico",
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
PATCH {{base_url}}/places/{{place_id}}/status
```

**Body:**
```json
{
  "active": false
}
```

**Tests (Postman):**
```javascript
// Verificar que ownerId se mantiene al cambiar estado
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.test("OwnerId se mantiene al cambiar estado", function () {
        pm.expect(response.data.ownerId).to.exist;
    });
}
```

**Respuesta Esperada (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "Playa de Atacames - Actualizada",
    "description": "Descripción actualizada del lugar turístico",
    "category": "playa",
    "location": "Atacames, Esmeraldas",
    "images": ["https://example.com/new-image.jpg"],
    "coverImage": "https://example.com/new-cover.jpg",
    "active": false,
    "ownerId": "64f8a1b2c3d4e5f6a7b8c9d1",
    "createdAt": "2023-09-06T10:30:00.000Z",
    "updatedAt": "2023-09-06T11:30:00.000Z"
  }
}
```

### 6. Eliminar Lugar
```
DELETE {{base_url}}/places/{{place_id}}
```

**Tests (Postman):**
```javascript
// Verificar que ownerId está presente en la respuesta de eliminación
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.test("OwnerId está presente en respuesta de eliminación", function () {
        pm.expect(response.data.ownerId).to.exist;
    });
}
```

**Respuesta Esperada (200):**
```json
{
  "success": true,
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "Playa de Atacames - Actualizada",
    "description": "Descripción actualizada del lugar turístico",
    "category": "playa",
    "location": "Atacames, Esmeraldas",
    "images": ["https://example.com/new-image.jpg"],
    "coverImage": "https://example.com/new-cover.jpg",
    "active": false,
    "ownerId": "64f8a1b2c3d4e5f6a7b8c9d1",
    "createdAt": "2023-09-06T10:30:00.000Z",
    "updatedAt": "2023-09-06T11:30:00.000Z"
  }
}
```

### 7. Obtener Actividades de Administrador
```
GET {{base_url}}/places/admin/activities
```

**Respuesta Esperada (200):**
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
GET {{base_url}}/places/count
```

**Respuesta Esperada (200):**
```json
{
  "count": 25
}
```

## Tests de Validación de ownerId

### Test 1: Verificar Asignación Automática
```javascript
// En el request de crear lugar
pm.test("OwnerId se asigna automáticamente", function () {
    const response = pm.response.json();
    pm.expect(response.data.ownerId).to.exist;
    pm.expect(response.data.ownerId).to.be.a('string');
});
```

### Test 2: Verificar Consistencia en Todas las Respuestas
```javascript
// En cualquier request que devuelva un lugar
pm.test("OwnerId está presente en respuesta", function () {
    const response = pm.response.json();
    if (response.data && response.data.ownerId) {
        pm.expect(response.data.ownerId).to.exist;
    } else if (response.data && Array.isArray(response.data)) {
        response.data.forEach(place => {
            pm.expect(place.ownerId).to.exist;
        });
    }
});
```

### Test 3: Verificar Formato de ownerId
```javascript
// Verificar que ownerId es un ObjectId válido
pm.test("OwnerId tiene formato ObjectId válido", function () {
    const response = pm.response.json();
    if (response.data && response.data.ownerId) {
        pm.expect(response.data.ownerId).to.match(/^[0-9a-fA-F]{24}$/);
    }
});
```

## Casos de Error

### Error 400 - Campos Obligatorios Faltantes
```json
{
  "success": false,
  "message": "Faltan campos obligatorios: name, description, category, location, ownerId"
}
```

### Error 404 - Lugar No Encontrado
```json
{
  "success": false,
  "message": "Place not found"
}
```

### Error 401 - No Autorizado
```json
{
  "success": false,
  "message": "Token no válido"
}
```

## Notas Importantes

1. **ownerId**: Se asigna automáticamente al crear un lugar con el ID del usuario autenticado
2. **Validación**: El campo ownerId es requerido y debe ser un ObjectId válido
3. **Consistencia**: Todas las respuestas que incluyen datos de lugar contienen el campo ownerId
4. **Migración**: Los lugares existentes pueden necesitar migración para agregar el campo ownerId
5. **Seguridad**: Solo el propietario del lugar puede realizar ciertas operaciones (implementar según necesidades)

## Scripts de Migración

### Ejecutar Migración de ownerId
```bash
cd backend/microservicios/placeservice
node scripts/migrate-ownerId.js
```

### Probar Funcionalidad de ownerId
```bash
cd backend/microservicios/placeservice
node test-ownerId.js
``` 