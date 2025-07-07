# Microservicio de Lugares - Esmeraldas Turismo

## 🚀 Cómo iniciar el microservicio

1. Instala las dependencias:
   ```bash
   npm install
   ```
2. Inicia el microservicio:
   ```bash
   node index.js
   ```
   El microservicio escuchará en: `http://localhost:3002`

---

## 📬 Endpoints para probar en Postman

### 1. **Estado del servicio**
- **GET** `http://localhost:3002/`

### 2. **Health check**
- **GET** `http://localhost:3002/places/health`

### 3. **Listar lugares turísticos**
- **GET** `http://localhost:3002/places`

### 4. **Obtener lugar por ID**
- **GET** `http://localhost:3002/places/:id`

### 5. **Crear lugar turístico (solo GAD)**
- **POST** `http://localhost:3002/places`
- **Headers:**
  - `Authorization: Bearer <token-GAD>`
- **Body (JSON):**
  ```json
  {
    "name": "Playa Escondida",
    "description": "Hermosa playa de arena blanca.",
    "category": "playa",
    "location": "Esmeraldas, Ecuador",
    "images": ["<URL o ID de imagen del microservicio mediaupload>"],
    "coverImage": "<URL o ID de imagen del microservicio mediaupload>"
  }
  ```

### 6. **Actualizar lugar turístico (solo GAD)**
- **PUT** `http://localhost:3002/places/:id`
- **Headers:**
  - `Authorization: Bearer <token-GAD>`
- **Body (JSON):**
  ```json
  {
    "name": "Playa Actualizada"
  }
  ```

### 7. **Eliminar lugar turístico (solo GAD)**
- **DELETE** `http://localhost:3002/places/:id`
- **Headers:**
  - `Authorization: Bearer <token-GAD>`

### 8. **Cambiar estado (activo/inactivo) de un lugar (solo GAD)**
- **PATCH** `http://localhost:3002/places/:id/status`
- **Headers:**
  - `Authorization: Bearer <token-GAD>`
- **Body (JSON):**
  ```json
  {
    "active": true
  }
  ```

### 9. **Consultar historial de actividades administrativas (solo GAD)**
- **GET** `http://localhost:3002/places/admin/actividades`
- **Headers:**
  - `Authorization: Bearer <token-GAD>`

---

## 📝 Notas
- Todos los endpoints protegidos requieren el header `Authorization: Bearer <token>`.
- La base de datos utilizada es `placesDB` en MongoDB local.
- **La subida y gestión de imágenes se realiza en el microservicio [mediaupload](../mediaupload/postmanMedia.md). Usa los IDs o URLs devueltos para asociar imágenes a los lugares.**

---

**Desarrollado para Esmeraldas Turismo** 