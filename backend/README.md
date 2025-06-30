# Auth Service - Esmeraldas Turismo

Microservicio de autenticación para el sistema "Esmeraldas Turismo" desarrollado en Node.js con Express y MongoDB.

## 🚀 Características

- **Autenticación JWT**: Tokens seguros con expiración configurable
- **Roles de usuario**: Soporte para `usuario`, `propietario` y `gad`
- **Hash de contraseñas**: Encriptación con bcrypt
- **Validación robusta**: Validación de datos con express-validator
- **Arquitectura modular**: Separación clara de responsabilidades
- **Manejo de errores**: Sistema centralizado de manejo de errores
- **CORS configurado**: Soporte para peticiones cross-origin
- **Logging**: Registro de todas las peticiones

## 📁 Estructura del Proyecto

```
backend/
├── config/
│   └── config.js          # Configuración de la aplicación
├── controllers/
│   └── authController.js  # Controladores de autenticación
├── services/
│   └── authService.js     # Lógica de negocio
├── middlewares/
│   ├── auth.js           # Middlewares de autenticación
│   ├── validation.js     # Validaciones de datos
│   └── errorHandler.js   # Manejo de errores
├── repositories/
│   └── userRepository.js # Acceso a datos
├── models/
│   └── User.js          # Modelo de usuario
├── utils/
│   ├── jwt.js           # Utilidades JWT
│   └── response.js      # Respuestas estandarizadas
├── routes/
│   └── auth.js          # Rutas de autenticación
├── db/
│   └── connection.js    # Conexión a MongoDB
├── index.js             # Archivo principal
├── package.json         # Dependencias
└── README.md           # Documentación
```

## 🛠️ Instalación

1. **Clonar el repositorio**
   ```bash
   cd backend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar variables de entorno**
   ```bash
   cp env.example .env
   ```
   
   Editar el archivo `.env` con tus configuraciones:
   ```env
   PORT=3001
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/turismoDB
   JWT_SECRET=tu_jwt_secret_super_seguro_aqui
   JWT_EXPIRES_IN=24h
   CORS_ORIGIN=http://localhost:3000
   ```

4. **Iniciar MongoDB**
   Asegúrate de tener MongoDB ejecutándose en tu sistema.

5. **Ejecutar el servidor**
   ```bash
   # Desarrollo
   npm run dev
   
   # Producción
   npm start
   ```

## 📡 Endpoints

### Rutas Públicas

#### `POST /auth/register`
Registra un nuevo usuario.

**Body:**
```json
{
  "nombre": "Juan Pérez",
  "correo": "juan@example.com",
  "contraseña": "Password123",
  "rol": "usuario"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Usuario registrado exitosamente",
  "data": {
    "usuario": {
      "id": "...",
      "nombre": "Juan Pérez",
      "correo": "juan@example.com",
      "rol": "usuario",
      "fechaCreacion": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### `POST /auth/login`
Autentica un usuario existente.

**Body:**
```json
{
  "correo": "juan@example.com",
  "contraseña": "Password123"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Autenticación exitosa",
  "data": {
    "usuario": {
      "id": "...",
      "nombre": "Juan Pérez",
      "correo": "juan@example.com",
      "rol": "usuario",
      "ultimoAcceso": "2024-01-01T00:00:00.000Z"
    },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

#### `GET /auth/validate`
Valida un token JWT y retorna los datos del usuario.

**Headers:**
```
Authorization: Bearer <token>
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Token válido",
  "data": {
    "usuario": {
      "id": "...",
      "nombre": "Juan Pérez",
      "correo": "juan@example.com",
      "rol": "usuario",
      "ultimoAcceso": "2024-01-01T00:00:00.000Z",
      "fechaCreacion": "2024-01-01T00:00:00.000Z"
    }
  }
}
```

#### `GET /auth/health`
Verifica el estado del servicio.

**Respuesta:**
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

### Rutas Protegidas

#### `GET /auth/profile`
Obtiene el perfil del usuario autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

#### `PUT /auth/profile`
Actualiza el perfil del usuario autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "nombre": "Juan Carlos Pérez",
  "correo": "juancarlos@example.com",
  "rol": "propietario"
}
```

#### `PUT /auth/change-password`
Cambia la contraseña del usuario autenticado.

**Headers:**
```
Authorization: Bearer <token>
```

**Body:**
```json
{
  "contraseñaActual": "Password123",
  "nuevaContraseña": "NewPassword456"
}
```

## 🔐 Autenticación

### Roles de Usuario

- **usuario**: Usuario básico del sistema
- **propietario**: Propietario de establecimientos turísticos
- **gad**: Administrador del GAD (Gobierno Autónomo Descentralizado)

### Middlewares de Autorización

```javascript
// Verificar autenticación
import { autenticarToken } from './middlewares/auth.js';

// Verificar roles específicos
import { autorizarRoles } from './middlewares/auth.js';

// Middlewares predefinidos
import { autorizarPropietarioOGAD, autorizarGAD } from './middlewares/auth.js';
```

## 🗄️ Base de Datos

### Colección: `users`

```javascript
{
  _id: ObjectId,
  nombre: String,           // Requerido, 2-50 caracteres
  correo: String,           // Requerido, único, email válido
  contraseña: String,       // Requerido, hasheada con bcrypt
  rol: String,              // Enum: 'usuario', 'propietario', 'gad'
  activo: Boolean,          // Default: true
  fechaCreacion: Date,      // Default: Date.now
  ultimoAcceso: Date,       // Default: Date.now
  createdAt: Date,          // Timestamp automático
  updatedAt: Date           // Timestamp automático
}
```

## 🔧 Configuración

### Variables de Entorno

| Variable | Descripción | Default |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | `3001` |
| `NODE_ENV` | Entorno de ejecución | `development` |
| `MONGODB_URI` | URI de conexión a MongoDB | `mongodb://localhost:27017/turismoDB` |
| `JWT_SECRET` | Clave secreta para JWT | `default_secret_change_in_production` |
| `JWT_EXPIRES_IN` | Tiempo de expiración del token | `24h` |
| `CORS_ORIGIN` | Origen permitido para CORS | `http://localhost:3000` |

## 🚀 Despliegue

### Docker (Recomendado)

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

EXPOSE 3001

CMD ["npm", "start"]
```

### Variables de Producción

```env
NODE_ENV=production
JWT_SECRET=tu_jwt_secret_super_seguro_y_complejo_aqui
MONGODB_URI=mongodb://tu-servidor-mongodb:27017/turismoDB
```

## 📊 Monitoreo

El servicio incluye:

- **Health Check**: `/auth/health`
- **Logging**: Todas las peticiones se registran
- **Manejo de errores**: Errores centralizados y estructurados
- **Métricas básicas**: Timestamps en todas las respuestas

## 🔒 Seguridad

- **Contraseñas hasheadas**: Uso de bcrypt con salt de 12 rondas
- **JWT seguro**: Tokens con issuer y audience específicos
- **Validación de entrada**: Sanitización y validación de todos los datos
- **CORS configurado**: Control de orígenes permitidos
- **Rate limiting**: Implementar según necesidades

## 🤝 Integración con API Gateway

Para integrar con un API Gateway:

1. **Health Check**: Usar `/auth/health` para verificar disponibilidad
2. **Autenticación**: Validar tokens en `/auth/validate`
3. **CORS**: Configurar según el dominio del frontend
4. **Load Balancing**: El servicio es stateless y puede escalar horizontalmente

## 📝 Logs

Los logs incluyen:
- Timestamp de cada petición
- Método HTTP y URL
- Errores detallados en desarrollo
- Información de conexión a MongoDB

## 🐛 Troubleshooting

### Problemas Comunes

1. **Error de conexión a MongoDB**
   - Verificar que MongoDB esté ejecutándose
   - Comprobar la URI en las variables de entorno

2. **Error de JWT**
   - Verificar que `JWT_SECRET` esté configurado
   - Comprobar el formato del token en las peticiones

3. **Error de CORS**
   - Verificar `CORS_ORIGIN` en las variables de entorno
   - Asegurar que el frontend esté en el dominio permitido

## 📞 Soporte

Para soporte técnico o preguntas sobre el microservicio, contactar al equipo de desarrollo de Esmeraldas Turismo. 