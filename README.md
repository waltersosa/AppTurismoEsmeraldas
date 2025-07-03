# 🏝️ Esmeraldas Turismo - Auth Service

Microservicio de autenticación para el sistema "Esmeraldas Turismo" desarrollado en Node.js con Express y MongoDB.

## 🏗️ Arquitectura del Sistema

### Arquitectura Completa
![Arquitectura Completa](./arquitectura//aquitectura-turismo-esmeraldas.jpg)

### Estructura de Microservicios
![Estructura Microservicios](./arquitectura/arquitectura-microservicios.jpg)

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
├── arquitectura/        # Diagramas de arquitectura
├── index.js             # Archivo principal
├── package.json         # Dependencias
└── README.md           # Documentación
```

## 🛠️ Instalación

1. **Instalar dependencias**
   ```bash
   cd backend
   npm install
   ```

2. **Configurar variables de entorno**
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
   CORS_ORIGIN=http://localhost:3000, http://localhost:4200
   ```

3. **Iniciar MongoDB**
   Asegúrate de tener MongoDB ejecutándose en tu sistema.

4. **Ejecutar el servidor**
   ```bash
   # Desarrollo
   npm run dev
   
   # Producción
   npm start
   ```

## 📡 Endpoints

### Rutas Públicas
- `POST /auth/register` - Registro de usuario
- `POST /auth/login` - Autenticación
- `GET /auth/validate` - Validación de token
- `GET /auth/health` - Estado del servicio

### Rutas Protegidas
- `GET /auth/profile` - Obtener perfil
- `PUT /auth/profile` - Actualizar perfil
- `DELETE /auth/profile` - Eliminar usuario
- `PUT /auth/change-password` - Cambiar contraseña


### Rutas Administrativas (solo GAD)
- `GET /auth/users` - Listar todos los usuarios activos
- `DELETE /auth/users/:id` - Eliminar usuario (eliminación física)

## 🧪 Pruebas

Para probar todas las funcionalidades del microservicio, consulta el archivo:
**[Postman_Collection.md](./Postman_Collection.md)**

Este archivo contiene:
- Configuración completa para Postman
- Ejemplos de todas las peticiones
- Scripts de automatización
- Casos de prueba y manejo de errores

## 🔐 Autenticación

### Roles de Usuario
- **usuario**: Usuario básico del sistema
- **propietario**: Propietario de establecimientos turísticos
- **gad**: Administrador del GAD (Gobierno Autónomo Descentralizado)

  - Solo el rol `gad` puede acceder a los endpoints administrativos de usuarios.

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
- **Eliminación física:** Cuando se elimina un usuario desde el panel de administración, se borra completamente de la base de datos.

## 🔧 Configuración

### Variables de Entorno

| Variable | Descripción | Default |
|----------|-------------|---------|
| `PORT` | Puerto del servidor | `3001` |
| `NODE_ENV` | Entorno de ejecución | `development` |
| `MONGODB_URI` | URI de conexión a MongoDB | `mongodb://localhost:27017/turismoDB` |
| `JWT_SECRET` | Clave secreta para JWT | `default_secret_change_in_production` |
| `JWT_EXPIRES_IN` | Tiempo de expiración del token | `24h` |
| `CORS_ORIGIN` | Origen permitido para CORS | `http://localhost:3000, http://localhost:4200` |

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

## 📝 Notas Importantes

- **Tokens JWT**: Tienen una duración de 24 horas por defecto
- **Contraseñas**: Deben tener al menos 6 caracteres con mayúsculas, minúsculas y números
- **Correos**: Deben ser únicos en el sistema
- **Roles**: Solo se permiten 'usuario', 'propietario' y 'gad'
- **Base de datos**: Se conecta a MongoDB en `mongodb://localhost:27017/turismoDB`
- **Eliminación**: Es un soft delete (desactiva el usuario, no lo elimina físicamente)

## 📞 Soporte

Para soporte técnico o preguntas sobre el microservicio, contactar al equipo de desarrollo de Esmeraldas Turismo. 

## 🛠️ Notas adicionales
- El frontend solo permite visualizar y eliminar usuarios. No es posible agregar ni actualizar usuarios desde la interfaz.
- El backend maneja errores de correo duplicado (409) y usuario no encontrado (404) de forma clara. 
