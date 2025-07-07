# Microservicio de Reviews - Esmeraldas Turismo

## 🚀 Cómo iniciar el microservicio

1. Instala las dependencias:
   ```bash
   npm install
   ```
2. Inicia el microservicio:
   ```bash
   node index.js
   ```
   El microservicio escuchará en: `http://localhost:3004`

---

## 📬 Endpoints para probar en Postman

### 1. **Estado del servicio**
- **GET** `http://localhost:3004/`

### 2. **Crear reseña (usuarios)**
- **POST** `http://localhost:3004/reviews/`
- **Headers:**
  - `Authorization: Bearer <token-usuario>`
- **Body:**
  ```json
  {
    "lugarId": "64f...",
    "comentario": "Excelente lugar turístico, muy recomendado para visitar con la familia. El paisaje es impresionante y la atención es muy buena.",
    "calificacion": 5
  }
  ```

### 3. **Obtener reseñas de un lugar (público)**
- **GET** `http://localhost:3004/reviews/lugar/<lugarId>`
- **Query params (opcionales):**
  - `page`: Número de página
  - `limit`: Elementos por página
  - `sortBy`: Campo para ordenar (fecha, calificacion)
  - `order`: asc o desc

### 4. **Listar todas las reseñas (solo GAD)**
- **GET** `http://localhost:3004/reviews/admin`
- **Headers:**
  - `Authorization: Bearer <token-GAD>`
- **Query params (opcionales):**
  - `page`: Número de página
  - `limit`: Elementos por página
  - `estado`: aprobada o bloqueada
  - `search`: Buscar en comentarios
  - `lugarId`: Filtrar por lugar
  - `usuarioId`: Filtrar por usuario
  - `sortBy`: Campo para ordenar
  - `order`: asc o desc

### 5. **Obtener reseña específica (solo GAD)**
- **GET** `http://localhost:3004/reviews/admin/<reviewId>`
- **Headers:**
  - `Authorization: Bearer <token-GAD>`

### 6. **Cambiar estado de reseña (solo GAD)**
- **PUT** `http://localhost:3004/reviews/admin/<reviewId>`
- **Headers:**
  - `Authorization: Bearer <token-GAD>`
- **Body:**
  ```json
  {
    "estado": "aprobada"
  }
  ```
  o
  ```json
  {
    "estado": "bloqueada"
  }
  ```

### 7. **Eliminar reseña (solo GAD)**
- **DELETE** `http://localhost:3004/reviews/admin/<reviewId>`
- **Headers:**
  - `Authorization: Bearer <token-GAD>`

---

## 📝 Notas importantes
- **Solo usuarios autenticados pueden crear reseñas.**
- **Un usuario solo puede reseñar un lugar una vez.**
- **Solo administradores GAD pueden moderar reseñas.**
- **Las reseñas bloqueadas no aparecen en las consultas públicas.**
- **El microservicio valida que el lugar existe antes de crear la reseña.**
- **Todas las acciones administrativas quedan registradas en el historial de actividades.**

---

**Desarrollado para Esmeraldas Turismo** 