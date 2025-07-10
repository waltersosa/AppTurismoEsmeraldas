# Media Service - Postman Collection

## Descripción

Servicio para manejo de archivos multimedia (imágenes) asociados a lugares turísticos.

## Base URL

```
http://localhost:3000/media
```

## 🔐 Autenticación GAD

Para usar las rutas protegidas, necesitas obtener un token de un usuario con rol GAD:

### 1. Crear usuario GAD (si no existe)

```bash
# Usar el Auth Service para crear un usuario con rol 'gad'
POST /auth/register
{
  "nombre": "Admin GAD",
  "correo": "admin@gad.esmeraldas.ec",
  "contraseña": "Admin123!",
  "rol": "gad"
}
```

### 2. Obtener token GAD

```bash
POST /auth/login
{
  "correo": "admin@gad.esmeraldas.ec",
  "contraseña": "Admin123!"
}
```

### 3. Usar el token

En Postman, agrega la variable de entorno `gad_token` con el token obtenido y úsalo en los headers:

```
Authorization: Bearer {{gad_token}}
```

## Endpoints

### 1. Health Check

**GET** `/health`

- **Descripción**: Verificar estado del servicio
- **Respuesta**:

```json
{
  "success": true,
  "message": "Media Service running",
  "data": {
    "service": "Media Service",
    "version": "1.0.0",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "status": "healthy"
  }
}
```

### 2. Subir Imágenes (Solo GAD)

**POST** `/upload`

- **Descripción**: Subir una o varias imágenes para un lugar específico
- **Content-Type**: `multipart/form-data`
- **Headers**: `Authorization: Bearer {{gad_token}}`
- **Parámetros del formulario**:

  - `files`: Archivo(s) de imagen (máximo 10)
  - `placeId`: ID del lugar al que pertenecen las imágenes (requerido)
  - `type`: Tipo de imagen - `cover` (portada) o `gallery` (galería) - por defecto `gallery`

- **Ejemplo de uso en Postman**:

  - Headers: `Authorization: Bearer {{gad_token}}`
  - Body → form-data
  - Key: `files` (Type: File) → Seleccionar archivo(s)
  - Key: `placeId` (Type: Text) → `64f1a2b3c4d5e6f7g8h9i0j1`
  - Key: `type` (Type: Text) → `cover` (para imagen de portada)

**Nota:** Requiere autenticación con rol GAD.

- **Respuesta exitosa**:

```json
{
  "success": true,
  "message": "Files uploaded successfully",
  "files": [
    {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
      "filename": "image_1234567890.jpg",
      "originalName": "playa_esmeraldas.jpg",
      "url": "/media/image_1234567890.jpg",
      "type": "cover"
    }
  ]
}
```

- **Respuesta de error**:

```json
{
  "success": false,
  "message": "placeId is required"
}
```

### 3. Obtener Imágenes por Lugar

**GET** `/place/:placeId`

- **Descripción**: Obtener todas las imágenes asociadas a un lugar específico
- **Parámetros**:

  - `placeId`: ID del lugar

- **Respuesta exitosa**:

```json
{
  "success": true,
  "media": [
    {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
      "filename": "image_1234567890.jpg",
      "originalName": "playa_esmeraldas.jpg",
      "url": "/media/image_1234567890.jpg",
      "placeId": "64f1a2b3c4d5e6f7g8h9i0j1",
      "type": "cover",
      "active": true,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

### 4. Obtener Archivo

**GET** `/file/:filename`

- **Descripción**: Obtener un archivo específico por su nombre
- **Parámetros**:

  - `filename`: Nombre del archivo

- **Respuesta**: Archivo binario (imagen)

### 5. Eliminar Imagen (Solo GAD)

**DELETE** `/mediaId`

- **Descripción**: Eliminar una imagen específica
- **Headers**: `Authorization: Bearer {{gad_token}}`
- **Parámetros**:

  - `mediaId`: ID de la imagen a eliminar

**Nota:** Requiere autenticación con rol GAD.

- **Respuesta exitosa**:

```json
{
  "success": true,
  "message": "Media deleted successfully"
}
```

## Flujo de Trabajo Recomendado

### 1. Crear un Lugar (Solo GAD)

1. Usar el endpoint de Places para crear un lugar (requiere token GAD)
2. Guardar el `_id` del lugar creado

### 2. Subir Imagen de Portada (Solo GAD)

1. POST `/media/upload` (con token GAD)
2. Incluir `placeId` y `type: "cover"`
3. Seleccionar la imagen de portada

### 3. Subir Imágenes de Galería (Solo GAD)

1. POST `/media/upload` (con token GAD)
2. Incluir `placeId` y `type: "gallery"` (o omitir type)
3. Seleccionar las imágenes de galería

### 4. Verificar Imágenes

1. GET `/media/place/:placeId` para ver todas las imágenes del lugar
2. GET `/places/:id` para ver el lugar con sus imágenes incluidas

## Notas Importantes

- **Acceso Restringido**: Solo usuarios con rol GAD pueden crear, actualizar y eliminar lugares e imágenes
- **Relación con Lugares**: Cada imagen debe estar asociada a un lugar específico
- **Imagen de Portada**: Solo una imagen por lugar puede ser de tipo `cover`
- **Galería**: Múltiples imágenes pueden ser de tipo `gallery`
- **Ordenamiento**: Las imágenes se ordenan con la portada primero, luego por fecha de creación
- **Validación**: El sistema verifica que el lugar existe antes de subir imágenes

## Integración con Places Service

Al obtener un lugar mediante el Places Service, las imágenes se incluyen automáticamente:

```json
{
  "success": true,
  "data": {
    "_id": "64f1a2b3c4d5e6f7g8h9i0j1",
    "name": "Playa Esmeraldas",
    "description": "Hermosa playa...",
    "coverImage": {
      "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
      "filename": "image_1234567890.jpg",
      "url": "/media/image_1234567890.jpg",
      "originalName": "playa_esmeraldas.jpg"
    },
    "images": [
      {
        "_id": "64f1a2b3c4d5e6f7g8h9i0j2",
        "filename": "image_1234567890.jpg",
        "url": "/media/image_1234567890.jpg",
        "originalName": "playa_esmeraldas.jpg",
        "type": "cover"
      }
    ]
  }
}
```
