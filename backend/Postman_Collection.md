# 🧪 Pruebas en Postman - Auth Service Esmeraldas Turismo

Esta guía te ayudará a probar todas las funcionalidades del microservicio de autenticación usando Postman.

## 📋 Configuración Inicial

### 1. Variables de Entorno en Postman

Crea un nuevo environment en Postman con las siguientes variables:

| Variable | Valor Inicial | Descripción |
|----------|---------------|-------------|
| `base_url` | `http://localhost:3001` | URL base del microservicio |
| `auth_token` | (vacío) | Token JWT para autenticación |
| `user_id` | (vacío) | ID del usuario creado |

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
   JWT_SECRET=mi_secret_super_seguro_123
   JWT_EXPIRES_IN=24h
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Iniciar el servidor:**
   ```bash
   npm run dev
   ```

## 🧪 Colección de Pruebas

### 1. Health Check - Verificar Estado del Servicio

**Método:** `GET`  
**URL:** `{{base_url}}/auth/health`

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Auth Service funcionando correctamente",
  "data": {
    "service": "Auth Service",
    "version": "1.0.0",
    "timestamp": "2024-01-01T00:00:00.000Z",
    "status": "healthy"
  }
}
```

---

### 2. Registro de Usuario - Crear Cuenta

**Método:** `POST`  
**URL:** `{{base_url}}/auth/register`  
**Headers:** `Content-Type: application/json`

**Body (JSON):**
```json
{
  "nombre": "Juan Pérez",
  "correo": "juan.perez@example.com",
  "contraseña": "Password123",
  "rol": "usuario"
}
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "usuario": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "nombre": "Juan Pérez",
      "correo": "juan.perez@example.com",
      "rol": "usuario",
      "fechaCreacion": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Script de Postman (Tests):**
```javascript
// Extraer y guardar el token
if (pm.response.code === 201) {
    const response = pm.response.json();
    pm.environment.set("auth_token", response.data.token);
    pm.environment.set("user_id", response.data.usuario.id);
    console.log("Usuario registrado y token guardado");
}
```

---

### 3. Login - Autenticación

**Método:** `POST`  
**URL:** `{{base_url}}/auth/login`  
**Headers:** `Content-Type: application/json`

**Body (JSON):**
```json
{
  "correo": "juan.perez@example.com",
  "contraseña": "Password123"
}
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Autenticación exitosa",
  "data": {
    "usuario": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "nombre": "Juan Pérez",
      "correo": "juan.perez@example.com",
      "rol": "usuario",
      "ultimoAcceso": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Script de Postman (Tests):**
```javascript
// Extraer y guardar el token
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("auth_token", response.data.token);
    pm.environment.set("user_id", response.data.usuario.id);
    console.log("Login exitoso y token guardado");
}
```

---

### 4. Validar Token - Verificar Autenticación

**Método:** `GET`  
**URL:** `{{base_url}}/auth/validate`  
**Headers:** 
```
Authorization: Bearer {{auth_token}}
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Token válido",
  "data": {
    "usuario": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "nombre": "Juan Pérez",
      "correo": "juan.perez@example.com",
      "rol": "usuario",
      "ultimoAcceso": "2024-01-01T00:00:00.000Z",
      "fechaCreacion": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

### 5. Obtener Perfil - Datos del Usuario

**Método:** `GET`  
**URL:** `{{base_url}}/auth/profile`  
**Headers:** 
```
Authorization: Bearer {{auth_token}}
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Perfil obtenido exitosamente",
  "data": {
    "usuario": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "nombre": "Juan Pérez",
      "correo": "juan.perez@example.com",
      "rol": "usuario",
      "ultimoAcceso": "2024-01-01T00:00:00.000Z",
      "fechaCreacion": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

### 6. Actualizar Perfil - Modificar Datos

**Método:** `PUT`  
**URL:** `{{base_url}}/auth/profile`  
**Headers:** 
```
Authorization: Bearer {{auth_token}}
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "nombre": "Juan Carlos Pérez",
  "correo": "juancarlos.perez@example.com",
  "rol": "propietario"
}
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Perfil actualizado exitosamente",
  "data": {
    "usuario": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "nombre": "Juan Carlos Pérez",
      "correo": "juancarlos.perez@example.com",
      "rol": "propietario",
      "ultimoAcceso": "2024-01-01T00:00:00.000Z",
      "fechaCreacion": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

---

### 7. Cambiar Contraseña

**Método:** `PUT`  
**URL:** `{{base_url}}/auth/change-password`  
**Headers:** 
```
Authorization: Bearer {{auth_token}}
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "contraseñaActual": "Password123",
  "nuevaContraseña": "NewPassword456"
}
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Contraseña cambiada exitosamente",
  "data": {
    "usuario": {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "nombre": "Juan Carlos Pérez",
      "correo": "juancarlos.perez@example.com",
      "rol": "propietario"
    }
  }
}
```

---

### 8. Eliminar Usuario - Soft Delete

**Método:** `DELETE`  
**URL:** `{{base_url}}/auth/profile`  
**Headers:** 
```
Authorization: Bearer {{auth_token}}
```

**Respuesta esperada:**
```json
{
  "success": true,
  "message": "Usuario eliminado exitosamente",
  "data": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "nombre": "Juan Carlos Pérez",
    "correo": "juancarlos.perez@example.com",
    "rol": "propietario",
    "activo": false,
    "mensaje": "Usuario eliminado exitosamente"
  }
}
```

**Script de Postman (Tests):**
```javascript
// Limpiar token después de eliminar usuario
if (pm.response.code === 200) {
    pm.environment.unset("auth_token");
    pm.environment.unset("user_id");
    console.log("Usuario eliminado y variables limpiadas");
}
```

---

## 🔄 Flujo Completo de Pruebas

### Secuencia Recomendada:

1. **Health Check** - Verificar que el servicio esté funcionando
2. **Registro** - Crear un nuevo usuario
3. **Login** - Autenticarse con el usuario creado
4. **Validar Token** - Verificar que el token funcione
5. **Obtener Perfil** - Ver datos del usuario
6. **Actualizar Perfil** - Modificar información
7. **Cambiar Contraseña** - Actualizar contraseña
8. **Login con Nueva Contraseña** - Verificar cambio de contraseña
9. **Eliminar Usuario** - Desactivar la cuenta (soft delete)
10. **Intentar Login con Usuario Eliminado** - Verificar que no pueda acceder

## 🧪 Casos de Prueba Adicionales

### Pruebas de Validación

#### Registro con Datos Inválidos:
```json
{
  "nombre": "J",
  "correo": "correo-invalido",
  "contraseña": "123",
  "rol": "rol-invalido"
}
```

#### Login con Credenciales Incorrectas:
```json
{
  "correo": "juan.perez@example.com",
  "contraseña": "ContraseñaIncorrecta"
}
```

#### Token Inválido:
```
Authorization: Bearer token_invalido_aqui
```

### Pruebas de Roles

#### Crear Usuario Propietario:
```json
{
  "nombre": "María García",
  "correo": "maria.garcia@example.com",
  "contraseña": "Password123",
  "rol": "propietario"
}
```

#### Crear Usuario GAD:
```json
{
  "nombre": "Admin GAD",
  "correo": "admin@gad.esmeraldas.gob.ec",
  "contraseña": "AdminPassword123",
  "rol": "gad"
}
```

## 📊 Scripts de Automatización

### Script para Limpiar Variables (Pre-request):
```javascript
// Limpiar token al inicio de cada prueba
pm.environment.unset("auth_token");
pm.environment.unset("user_id");
```

### Script para Verificar Respuestas (Tests):
```javascript
// Verificar estructura de respuesta
pm.test("Respuesta tiene estructura correcta", function () {
    const response = pm.response.json();
    pm.expect(response).to.have.property('success');
    pm.expect(response).to.have.property('message');
    pm.expect(response).to.have.property('timestamp');
});

// Verificar código de estado
pm.test("Código de estado es 200", function () {
    pm.response.to.have.status(200);
});

// Verificar que success sea true
pm.test("Operación exitosa", function () {
    const response = pm.response.json();
    pm.expect(response.success).to.be.true;
});
```

## 🚨 Manejo de Errores

### Errores Comunes y Soluciones:

1. **Error 500 - Servidor no responde**
   - Verificar que MongoDB esté ejecutándose
   - Verificar que el servidor esté iniciado
   - Revisar logs del servidor

2. **Error 401 - No autorizado**
   - Verificar que el token sea válido
   - Verificar formato del header Authorization
   - Verificar que el token no haya expirado

3. **Error 400 - Datos inválidos**
   - Verificar formato del JSON
   - Verificar validaciones de campos
   - Revisar mensajes de error específicos

4. **Error 409 - Conflicto**
   - Usuario ya existe (correo duplicado)
   - Usar un correo diferente para pruebas

## 📝 Notas Importantes

- **Tokens JWT**: Tienen una duración de 24 horas por defecto
- **Contraseñas**: Deben tener al menos 6 caracteres con mayúsculas, minúsculas y números
- **Correos**: Deben ser únicos en el sistema
- **Roles**: Solo se permiten 'usuario', 'propietario' y 'gad'
- **Base de datos**: Se conecta a MongoDB en `mongodb://localhost:27017/turismoDB`
- **Eliminación**: Es un soft delete (desactiva el usuario, no lo elimina físicamente)

## 🔗 Importar Colección

Para facilitar las pruebas, puedes crear una colección en Postman con todas estas requests y usar las variables de entorno para automatizar el flujo de pruebas.

¡Con esta guía podrás probar completamente todas las funcionalidades del microservicio de autenticación! 