# Microservicio de Archivos Multimedia - Esmeraldas Turismo

## 🚀 Cómo iniciar el microservicio

1. Instala las dependencias:
   ```bash
   npm install
   ```
2. Inicia el microservicio:
   ```bash
   node index.js
   ```
   El microservicio escuchará en: `http://localhost:3003`

---

## 📬 Endpoints para probar en Postman

### 1. **Estado del servicio**
- **GET** `http://localhost:3003/`

### 2. **Subir imágenes (solo admins GAD)**
- **POST** `http://localhost:3003/media/upload`
- **Headers:**
  - `Authorization: Bearer <token-GAD>`
- **Body:**
  - Tipo: `form-data`
  - Clave: `imagenes` (tipo archivo, permite múltiples)
  - (Opcional) `placeId`: ID del lugar al que asociar las imágenes
  - (Opcional) `type`: `cover` o `gallery` (**solo uno por petición**)

### 3. **Obtener imagen por nombre de archivo**
- **GET** `http://localhost:3003/media/file/<nombre_archivo>`

### 4. **Listar imágenes por lugar**
- **GET** `http://localhost:3003/media/place/<placeId>`

### 5. **Eliminar imagen por ID**
- **DELETE** `http://localhost:3003/media/<mediaId>`

---

## 📝 Notas
- **Solo usuarios con rol GAD (admin) pueden subir imágenes.**
- **Solo se permite un campo `type` por petición. Si envías varios, se producirá un error. Todas las imágenes subidas tendrán el mismo tipo.**
- Las imágenes subidas se guardan en la carpeta `uploads` y pueden ser accedidas vía `/uploads/<nombre_archivo>`.
- Puedes asociar imágenes a un lugar usando el campo `placeId`.
- El campo `type` permite distinguir entre portada (`cover`) y galería (`gallery`).

---

**Desarrollado para Esmeraldas Turismo** 