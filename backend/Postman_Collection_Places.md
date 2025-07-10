# 🧪 Pruebas en Postman - Places Service Esmeraldas Turismo

Esta guía te ayudará a probar todas las funcionalidades del microservicio de lugares turísticos usando Postman.

## 📋 Configuración Inicial

### 1. Variables de Entorno en Postman

Crea un nuevo environment en Postman con las siguientes variables:

| Variable   | Valor Inicial           | Descripción                |
| ---------- | ----------------------- | -------------------------- |
| `base_url` | `http://localhost:3001` | URL base del microservicio |
| `place_id` | (vacío)                 | ID del lugar creado        |

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
**URL:** `{{base_url}}/places/health`

**Respuesta esperada:**

```json
{
  "success": true,
  "message": "Places Service running",
  "data": {
    "service": "Places Service",
    "version": "1.0.0",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "status": "healthy"
  }
}
```

---

### 2. Crear Lugar Turístico (Solo GAD)

**Método:** `POST`  
**URL:** `{{base_url}}/places`  
**Headers:**

```
Content-Type: application/json
Authorization: Bearer {{gad_token}}
```

**Nota:** Requiere autenticación con rol GAD. Obtén el token desde el Auth Service.

**Body (JSON):**

```json
{
  "name": "Malecón de Esmeraldas",
  "description": "Paseo turístico junto al río Esmeraldas.",
  "location": "Esmeraldas, Ecuador",
  "category": "natural",
  "coverImageUrl": "https://ejemplo.com/malecon-cover.jpg",
  "imageUrls": [
    "https://ejemplo.com/malecon1.jpg",
    "https://ejemplo.com/malecon2.jpg"
  ],
  "active": true
}
```

**Respuesta esperada:**

```json
{
  "success": true,
  "data": {
    "_id": "65f8a1b2c3d4e5f6a7b8c9d0",
    "name": "Malecón de Esmeraldas",
    "description": "Paseo turístico junto al río Esmeraldas.",
    "location": "Esmeraldas, Ecuador",
    "category": "natural",
    "coverImageUrl": "https://ejemplo.com/malecon-cover.jpg",
    "imageUrls": [
      "https://ejemplo.com/malecon1.jpg",
      "https://ejemplo.com/malecon2.jpg"
    ],
    "active": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Script de Postman (Tests):**

```javascript
if (pm.response.code === 201) {
  const response = pm.response.json();
  pm.environment.set("place_id", response.data._id);
  console.log("Lugar creado y place_id guardado");
}
```

---

### 3. Listar Lugares Turísticos (con paginación, filtro y orden)

**Método:** `GET`  
**URL:** `{{base_url}}/places?page=1&limit=10&search=malecon&category=natural&active=true&sortBy=name&order=asc`

**Respuesta esperada:**

```json
{
  "success": true,
  "data": [
    {
      "_id": "65f8a1b2c3d4e5f6a7b8c9d0",
      "name": "Malecón de Esmeraldas",
      "description": "Paseo turístico junto al río Esmeraldas.",
      "location": "Esmeraldas, Ecuador",
      "category": "natural",
      "coverImageUrl": "https://ejemplo.com/malecon-cover.jpg",
      "imageUrls": [
        "https://ejemplo.com/malecon1.jpg",
        "https://ejemplo.com/malecon2.jpg"
      ],
      "active": true,
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

### 4. Obtener Lugar por ID

**Método:** `GET`  
**URL:** `{{base_url}}/places/{{place_id}}`

**Respuesta esperada:**

```json
{
  "success": true,
  "data": {
    "_id": "65f8a1b2c3d4e5f6a7b8c9d0",
    "name": "Malecón de Esmeraldas",
    "description": "Paseo turístico junto al río Esmeraldas.",
    "location": "Esmeraldas, Ecuador",
    "category": "natural",
    "coverImageUrl": "https://ejemplo.com/malecon-cover.jpg",
    "imageUrls": [
      "https://ejemplo.com/malecon1.jpg",
      "https://ejemplo.com/malecon2.jpg"
    ],
    "active": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 5. Actualizar Lugar (Solo GAD)

**Método:** `PUT`  
**URL:** `{{base_url}}/places/{{place_id}}`  
**Headers:**

```
Content-Type: application/json
Authorization: Bearer {{gad_token}}
```

**Nota:** Requiere autenticación con rol GAD.

**Body (JSON):**

```json
{
  "name": "Malecón de Esmeraldas Renovado",
  "description": "Renovado paseo turístico junto al río.",
  "location": "Esmeraldas, Ecuador",
  "category": "natural",
  "coverImageUrl": "https://ejemplo.com/malecon-renovado-cover.jpg",
  "imageUrls": [
    "https://ejemplo.com/malecon-renovado1.jpg",
    "https://ejemplo.com/malecon-renovado2.jpg"
  ],
  "active": true
}
```

**Respuesta esperada:**

```json
{
  "success": true,
  "data": {
    "_id": "65f8a1b2c3d4e5f6a7b8c9d0",
    "name": "Malecón de Esmeraldas Renovado",
    "description": "Renovado paseo turístico junto al río.",
    "location": "Esmeraldas, Ecuador",
    "category": "natural",
    "coverImageUrl": "https://ejemplo.com/malecon-renovado-cover.jpg",
    "imageUrls": [
      "https://ejemplo.com/malecon-renovado1.jpg",
      "https://ejemplo.com/malecon-renovado2.jpg"
    ],
    "active": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 6. Eliminar Lugar (Solo GAD)

**Método:** `DELETE`  
**URL:** `{{base_url}}/places/{{place_id}}`  
**Headers:**

```
Authorization: Bearer {{gad_token}}
```

**Nota:** Requiere autenticación con rol GAD.

**Respuesta esperada:**

```json
{
  "success": true,
  "data": {
    "_id": "65f8a1b2c3d4e5f6a7b8c9d0",
    "name": "Malecón de Esmeraldas Renovado",
    "description": "Renovado paseo turístico junto al río.",
    "location": "Esmeraldas, Ecuador",
    "category": "natural",
    "coverImageUrl": "https://ejemplo.com/malecon-renovado-cover.jpg",
    "imageUrls": [
      "https://ejemplo.com/malecon-renovado1.jpg",
      "https://ejemplo.com/malecon-renovado2.jpg"
    ],
    "active": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 📝 Notas Importantes

### Tipos de Imágenes Soportados

**URLs de Imágenes:**

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

### Ejemplos de Uso

**Lugar con solo URLs (Recomendado):**

```json
{
  "name": "Playa Esmeraldas",
  "description": "Hermosa playa del Pacífico",
  "location": "Esmeraldas, Ecuador",
  "coverImageUrl": "https://ejemplo.com/playa-cover.jpg",
  "imageUrls": [
    "https://ejemplo.com/playa1.jpg",
    "https://ejemplo.com/playa2.jpg"
  ]
}
```

**Lugar con URLs en campo images (Compatibilidad):**

```json
{
  "name": "Playa Esmeraldas",
  "description": "Hermosa playa del Pacífico",
  "location": "Esmeraldas, Ecuador",
  "images": ["https://ejemplo.com/playa1.jpg", "https://ejemplo.com/playa2.jpg"]
}
```

_Nota: El sistema automáticamente moverá las URLs del campo `images` al campo `imageUrls`_

**Lugar sin imágenes:**

```json
{
  "name": "Parque Central",
  "description": "Parque central de la ciudad",
  "location": "Esmeraldas, Ecuador"
}
```

**Lugar mixto (URLs + archivos locales):**

```json
{
  "name": "Museo Regional",
  "description": "Museo con historia local",
  "location": "Esmeraldas, Ecuador",
  "coverImageUrl": "https://ejemplo.com/museo-cover.jpg"
}
```
