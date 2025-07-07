# Solución al Problema de CORS

## Problema Identificado

El error que estás viendo es un problema de **CORS (Cross-Origin Resource Sharing)**:

```
Access to XMLHttpRequest at 'http://localhost:3001/auth/users' from origin 'http://localhost:4200' has been blocked by CORS policy
```

Esto significa que el BackOffice (puerto 4200) no puede comunicarse con los microservicios porque no están configurados para permitir peticiones desde otros dominios.

## Solución Implementada

### 1. Configuración CORS Agregada

Se ha agregado configuración CORS a todos los microservicios:

```javascript
app.use(cors({
  origin: [
    'http://localhost:4200', // BackOffice Angular
    'http://localhost:3000', // Frontend principal (si existe)
    'http://127.0.0.1:4200',
    'http://127.0.0.1:3000'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control'
  ]
}));
```

### 2. Microservicios Actualizados

- ✅ **Auth Service** (puerto 3001) - CORS configurado
- ✅ **Places Service** (puerto 3002) - CORS configurado  
- ✅ **Media Upload Service** (puerto 3003) - CORS configurado
- ✅ **Reviews Service** (puerto 3004) - CORS mejorado
- ✅ **Notifications Service** (puerto 3006) - CORS mejorado
- ✅ **Stats Service** (puerto 3005) - CORS ya configurado

### 3. Package.json Creado

Se creó un `package.json` para el microservicio de Auth con las dependencias necesarias:

```json
{
  "name": "authservice",
  "version": "1.0.0",
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.3",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-rate-limit": "^7.1.5",
    "express-validator": "^7.0.1"
  }
}
```

## Pasos para Aplicar la Solución

### 1. Instalar Dependencias

```bash
cd backend
node install-dependencies.js
```

### 2. Reiniciar Microservicios

```bash
# Opción 1: Usar el script
node start-microservices.js

# Opción 2: Iniciar manualmente cada microservicio
cd microservicios/authservice && node index.js
cd microservicios/placeservice && node index.js
cd microservicios/mediaupload && node index.js
cd microservicios/reviewservice && node index.js
cd microservicios/statservice && node index.js
cd microservicios/notificationsservice && node index.js
```

### 3. Verificar que Funciona

```bash
# Verificar health check
curl http://localhost:3005/health/simple

# Verificar Auth Service
curl http://localhost:3001/

# Verificar Places Service
curl http://localhost:3002/
```

## Configuración CORS Detallada

### Orígenes Permitidos
- `http://localhost:4200` - BackOffice Angular
- `http://localhost:3000` - Frontend principal
- `http://127.0.0.1:4200` - BackOffice (IP local)
- `http://127.0.0.1:3000` - Frontend (IP local)

### Métodos HTTP Permitidos
- GET, POST, PUT, DELETE, PATCH, OPTIONS

### Headers Permitidos
- Origin, X-Requested-With, Content-Type, Accept, Authorization, Cache-Control

### Credenciales
- `credentials: true` - Permite enviar cookies y headers de autorización

## Verificación de la Solución

### 1. Verificar desde el Navegador
Abre las herramientas de desarrollador (F12) y verifica que no hay errores de CORS en la consola.

### 2. Verificar desde Postman
Hacer una petición GET a `http://localhost:3001/auth/users` desde Postman.

### 3. Verificar desde el BackOffice
- Iniciar el BackOffice: `ng serve`
- Navegar a la sección de usuarios
- Verificar que se cargan los datos sin errores

## Troubleshooting

### Si el problema persiste:

1. **Verificar que los microservicios están corriendo:**
   ```bash
   netstat -ano | findstr :3001
   netstat -ano | findstr :3002
   netstat -ano | findstr :3003
   netstat -ano | findstr :3004
   netstat -ano | findstr :3005
   netstat -ano | findstr :3006
   ```

2. **Verificar que CORS está configurado:**
   ```bash
   curl -H "Origin: http://localhost:4200" -H "Access-Control-Request-Method: GET" -H "Access-Control-Request-Headers: X-Requested-With" -X OPTIONS http://localhost:3001/auth/users
   ```

3. **Verificar logs de los microservicios:**
   - Revisar la consola donde están corriendo los microservicios
   - Buscar errores relacionados con CORS

4. **Verificar configuración de red:**
   - Firewall de Windows
   - Antivirus
   - Proxy corporativo

### Errores Comunes

1. **"Cannot find module 'cors'"**
   ```bash
   cd microservicios/authservice
   npm install cors
   ```

2. **"Port already in use"**
   ```bash
   # Encontrar proceso usando el puerto
   netstat -ano | findstr :3001
   # Terminar proceso
   taskkill /PID <PID> /F
   ```

3. **"Connection refused"**
   - Verificar que el microservicio está iniciado
   - Verificar que el puerto es correcto
   - Verificar firewall

## Configuración para Producción

Para producción, actualizar los orígenes permitidos:

```javascript
app.use(cors({
  origin: [
    'https://tu-dominio.com',
    'https://backoffice.tu-dominio.com'
  ],
  credentials: true,
  // ... resto de configuración
}));
```

## Notas Importantes

1. **Seguridad**: La configuración CORS actual es para desarrollo. En producción, especificar solo los dominios necesarios.

2. **Performance**: CORS agrega headers adicionales a las peticiones, pero el impacto es mínimo.

3. **Debugging**: Usar las herramientas de desarrollador del navegador para ver errores de CORS en tiempo real.

4. **Monitoreo**: El microservicio de Stats incluye health check para monitorear el estado de todos los servicios. 