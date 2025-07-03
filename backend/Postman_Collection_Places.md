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

### 2. Crear Lugar Turístico

**Método:** `POST`  
**URL:** `{{base_url}}/places`  
**Headers:** `Content-Type: application/json`

**Body (JSON):**

```json
{
  "name": "Malecón de Esmeraldas",
  "description": "Paseo turístico junto al río Esmeraldas.",
  "location": "Esmeraldas, Ecuador",
  "category": "natural",
  "images": ["https://ejemplo.com/malecon1.jpg"],
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
    "images": ["https://ejemplo.com/malecon1.jpg"],
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
      "images": ["https://ejemplo.com/malecon1.jpg"],
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
    "images": ["https://ejemplo.com/malecon1.jpg"],
    "active": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 5. Actualizar Lugar

**Método:** `PUT`  
**URL:** `{{base_url}}/places/{{place_id}}`  
**Headers:** `Content-Type: application/json`

**Body (JSON):**

```json
{
  "name": "Malecón de Esmeraldas Renovado",
  "description": "Renovado paseo turístico junto al río.",
  "location": "Esmeraldas, Ecuador",
  "category": "natural",
  "images": ["https://ejemplo.com/malecon2.jpg"],
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
    "images": ["https://ejemplo.com/malecon2.jpg"],
    "active": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

### 6. Eliminar Lugar

**Método:** `DELETE`  
**URL:** `{{base_url}}/places/{{place_id}}`

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
    "images": ["https://ejemplo.com/malecon2.jpg"],
    "active": true,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```
