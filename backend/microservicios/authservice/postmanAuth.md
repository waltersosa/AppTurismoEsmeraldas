# Microservicio de Autenticación - Esmeraldas Turismo

## 🚀 Cómo iniciar el microservicio

1. Instala las dependencias:
   ```bash
   npm install
   ```
2. Inicia el microservicio:
   ```bash
   node index.js
   ```
   El microservicio escuchará en: `http://localhost:3001`

---

## 📬 Endpoints para probar en Postman

### 1. **Estado del servicio**
- **GET** `http://localhost:3001/`

### 2. **Probar que el microservicio está corriendo**
- **GET** `http://localhost:3001/auth/health`

### 3. **Registro de usuario**
- **POST** `http://localhost:3001/auth/register`
- **Body (JSON):**
  ```json
  {
    "nombre": "Juan Pérez",
    "correo": "juan@correo.com",
    "contraseña": "Clave123"
  }
  ```

### 4. **Login de usuario**
- **POST** `http://localhost:3001/auth/login`
- **Body (JSON):**
  ```json
  {
    "correo": "juan@correo.com",
    "contraseña": "Clave123"
  }
  ```
- **Respuesta:**
  ```json
  {
    "message": "Login exitoso",
    "token": "...jwt...",
    "user": { "_id": "...", "nombre": "Juan Pérez", "email": "juan@correo.com", "rol": "usuario", "activo": true }
  }
  ```

### 4. **Validar token**
- **GET** `http://localhost:3001/auth/validate`
- **Headers:**
  - `Authorization: Bearer <token>`

### 5. **Obtener perfil**
- **GET** `http://localhost:3001/auth/profile`
- **Headers:**
  - `Authorization: Bearer <token>`

### 6. **Actualizar perfil**
- **PUT** `http://localhost:3001/auth/profile`
- **Headers:**
  - `Authorization: Bearer <token>`
- **Body (JSON):**
  ```json
  {
    "nombre": "Nuevo Nombre"
  }
  ```

### 7. **Eliminar perfil**
- **DELETE** `http://localhost:3001/auth/profile`
- **Headers:**
  - `Authorization: Bearer <token>`

### 8. **Cambiar contraseña**
- **PUT** `http://localhost:3001/auth/change-password`
- **Headers:**
  - `Authorization: Bearer <token>`
- **Body (JSON):**
  ```json
  {
    "contraseñaActual": "Clave123",
    "nuevaContraseña": "NuevaClave456"
  }
  ```

### 9. **Listar usuarios (solo GAD)**
- **GET** `http://localhost:3001/auth/users`
- **Headers:**
  - `Authorization: Bearer <token-GAD>`

### 10. **Crear usuario como admin (solo GAD)**
- **POST** `http://localhost:3001/auth/users`
- **Headers:**
  - `Authorization: Bearer <token-GAD>`
- **Body (JSON):**
  ```json
  {
    "nombre": "Nuevo Usuario",
    "correo": "nuevo@correo.com",
    "contraseña": "Clave123",
    "rol": "usuario"
  }
  ```

### 11. **Deshabilitar usuario (solo GAD)**
- **DELETE** `http://localhost:3001/auth/users/:id`
- **Headers:**
  - `Authorization: Bearer <token-GAD>`

### 12. **Habilitar usuario (solo GAD)**
- **PATCH** `http://localhost:3001/auth/users/:id/enable`
- **Headers:**
  - `Authorization: Bearer <token-GAD>`

### 13. **Eliminar usuario permanentemente (solo GAD)**
- **DELETE** `http://localhost:3001/auth/users/:id/permanent`
- **Headers:**
  - `Authorization: Bearer <token-GAD>`

### 14. **Listar actividades administrativas (solo GAD)**
- **GET** `http://localhost:3001/auth/admin/actividades`
- **Headers:**
  - `Authorization: Bearer <token-GAD>`

---

## 📝 Notas
- Todos los endpoints protegidos requieren el header `Authorization: Bearer <token>`.
- El campo `rol` debe ser `gad` para acceder a endpoints administrativos.
- La base de datos utilizada es `authDB` en MongoDB local.
- **Validaciones de contraseña:** Debe tener al menos 6 caracteres, una mayúscula, una minúscula y un número.
- **Validaciones de nombre:** Solo letras y espacios, entre 2 y 50 caracteres.
- **Validaciones de correo:** Formato de email válido.

---

**Desarrollado para Esmeraldas Turismo** 