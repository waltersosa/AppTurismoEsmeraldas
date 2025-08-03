# 🏖️ Esmeraldas Turismo — Sistema Modular Completo

## 📋 Descripción General

**Esmeraldas Turismo** es un sistema modular basado en microservicios para la gestión integral de turismo en Esmeraldas, Ecuador. Diseñado para gobiernos locales (GAD), propietarios de establecimientos y turistas, incluye autenticación robusta, gestión de lugares turísticos, reseñas, subida de imágenes y notificaciones en tiempo real.

## 🏗️ Arquitectura del Sistema

### Componentes Principales

```
AppTurismoEsmeraldas/
├── 📱 Frontend/                    # Aplicación móvil Angular 17
├── 🖥️ BackOffice/                  # Panel administrativo Angular 20
├── ⚙️ backend/                     # Microservicios Node.js/Express
└── 📚 Documentación               # APIs y guías de uso
```

### Stack Tecnológico

| Componente | Tecnología | Versión | Puerto |
|------------|------------|---------|--------|
| **Backend** | Node.js + Express | ES Modules | 3001 |
| **Base de Datos** | MongoDB + Mongoose | 7.5.0 | 27017 |
| **Frontend Móvil** | Angular + PrimeNG | 17.3.0 | 4300 |
| **BackOffice** | Angular + Material | 20.0.0 | 4200 |
| **Notificaciones** | Socket.io | 4.8.1 | 3000 |
| **Estilos** | Tailwind CSS | 3.4.17 | - |

## 🚀 Instalación y Configuración

### Prerrequisitos

- **Node.js** 18+ 
- **MongoDB** 6.0+
- **npm**
- **Git**

### 1. Clonar el Repositorio

```bash
git clone <repository-url>
cd AppTurismoEsmeraldas
```

### 2. Configurar Backend

```bash
cd backend
npm install

# Crear archivo .env
cat > .env << EOF
PORT=3001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/turismoDB
JWT_SECRET=mi_secret_super_seguro_123
JWT_EXPIRES_IN=24h
CORS_ORIGIN=http://localhost:3000
EOF

# Iniciar servidor
node index.js
```

### 3. Configurar Frontend Móvil

```bash
cd Frontend/app-turismo-movil
npm install
ng serve
```

### 4. Configurar BackOffice

```bash
cd BackOffice/backoffice-admin
npm install
ng serve
```

## 📱 Aplicación Móvil (Frontend)

### Funcionalidades Implementadas

#### ✅ **Completadas**
- **Portada de bienvenida** con imagen atractiva
- **Sistema de autenticación** (login/registro)
- **Listado de lugares turísticos** con filtros por categoría
- **Detalle de lugares** con galería de imágenes
- **Sistema de reseñas** (comentarios y valoraciones)
- **Perfil de usuario** básico
- **Notificaciones en tiempo real** via Socket.io
- **Página de emergencias** con acceso a reporte
- **Navegación con menú inferior** intuitivo
- **Diseño responsivo** con Tailwind CSS

#### 🔄 **En Desarrollo**
- **Reporte de incidencias** (UI lista, lógica pendiente)

### Estructura de Páginas

```
src/app/pages/
├── portada/              # Pantalla de bienvenida
├── login/                # Autenticación de usuarios
├── register/             # Registro de nuevos usuarios
├── home/                 # Dashboard principal
├── places/               # Listado de lugares turísticos
├── place-detail/         # Detalle y reseñas de lugar
├── profile/              # Perfil de usuario
├── notificaciones/       # Centro de notificaciones
├── emergencias/          # Información de emergencias
├── reportar-incidencia/  # Reporte de incidencias (Próximamente)
├── eventos-noticias/     # Eventos y noticias locales
├── cultura-gastronomia/  # Cultura y gastronomía
└── mapa-interactivo/     # Mapa interactivo de lugares
```

### Servicios Integrados

#### **PlacesService** (`src/app/services/places.service.ts`)
- Consumo de microservicio de lugares (puerto 3002)
- Filtros por categoría, búsqueda, paginación
- CRUD completo para usuarios autenticados
- Gestión de imágenes y estados

#### **ReviewsService** (`src/app/services/reviews.service.ts`)
- Consumo de microservicio de reseñas (puerto 3004)
- Creación, edición y eliminación de reseñas
- Calificaciones y comentarios
- Autenticación requerida

#### **SocketService** (`src/app/services/socket.io.service.ts`)
- Conexión en tiempo real con Socket.io
- Recepción de notificaciones push
- Gestión de eventos de usuario
- Reconexión automática

### Configuración de Capacitor

```typescript
// capacitor.config.ts
const config: CapacitorConfig = {
  appId: 'com.turismo.esmeraldas',
  appName: 'app-turismo-movil',
  webDir: 'dist'
};
```

## 🖥️ BackOffice Administrativo

### Funcionalidades del Panel

#### ✅ **Completadas**
- **Dashboard** con métricas en tiempo real
- **Gestión de usuarios** (CRUD completo)
- **Gestión de lugares turísticos** (CRUD + imágenes)
- **Gestión de reseñas** (moderación y filtros)
- **Sistema de notificaciones** (envío masivo)
- **Monitoreo de servicios** (health check)
- **Autenticación segura** (solo usuarios GAD)

#### 🔄 **En Desarrollo**
- **Sistema de reportes** (marcado como "Próximamente")

### Estructura del BackOffice

```
src/app/
├── auth/                 # Autenticación y autorización
├── dashboard/            # Dashboard principal
│   ├── home/            # Página de inicio con métricas
│   ├── usuarios/        # Gestión de usuarios
│   ├── place/           # Gestión de lugares
│   ├── review/          # Gestión de reseñas
│   ├── servicios/       # Monitoreo de microservicios
│   └── notifications/   # Sistema de notificaciones
├── interceptors/        # Interceptores HTTP
└── services/            # Servicios de datos
```

### Configuración de Microservicios

```typescript
// src/app/config/api.config.ts
export const MICROSERVICES_CONFIG = {
  AUTH_SERVICE: { BASE_URL: 'http://localhost:3001' },
  PLACES_SERVICE: { BASE_URL: 'http://localhost:3002' },
  MEDIA_SERVICE: { BASE_URL: 'http://localhost:3003' },
  REVIEWS_SERVICE: { BASE_URL: 'http://localhost:3004' },
  STATS_SERVICE: { BASE_URL: 'http://localhost:3005' },
  NOTIFICATIONS_SERVICE: { BASE_URL: 'http://localhost:3006' }
};
```

### Acceso al BackOffice

- **URL:** http://localhost:4200
- **Usuario GAD:** `gad@gmail.com`
- **Contraseña:** `Admin123`

## ⚙️ Backend (Microservicios)

### Arquitectura de Microservicios

| Servicio | Puerto | Descripción | Estado |
|----------|--------|-------------|--------|
| **Auth Service** | 3001 | Autenticación y usuarios | ✅ Activo |
| **Places Service** | 3002 | Gestión de lugares | ✅ Activo |
| **Media Service** | 3003 | Subida de imágenes | ✅ Activo |
| **Reviews Service** | 3004 | Gestión de reseñas | ✅ Activo |
| **Stats Service** | 3005 | Estadísticas y health check | ✅ Activo |
| **Notifications Service** | 3006 | Notificaciones en tiempo real | ✅ Activo |

### Modelos de Datos

#### **Usuario (User)**
```javascript
{
  nombre: String (requerido, 2-50 chars),
  correo: String (único, email válido),
  contraseña: String (hasheada con bcrypt),
  rol: ['usuario', 'propietario', 'gad'],
  activo: Boolean (default: true),
  fechaCreacion: Date,
  ultimoAcceso: Date
}
```

#### **Lugar Turístico (Place)**
```javascript
{
  name: String (requerido),
  description: String (requerido),
  location: String (requerido),
  category: String,
  coverImage: Mixed (ObjectId o URL),
  coverImageUrl: String,
  images: [ObjectId],
  imageUrls: [String],
  active: Boolean (default: true)
}
```

#### **Reseña (Review)**
```javascript
{
  lugarId: ObjectId (referencia a Place),
  usuarioId: ObjectId (referencia a User),
  comentario: String,
  calificacion: Number (1-5),
  estado: String (default: 'activo')
}
```

#### **Notificación (Notification)**
```javascript
{
  titulo: String (requerido),
  mensaje: String (requerido),
  tipo: String,
  userId: ObjectId (opcional),
  leida: Boolean (default: false),
  fechaEnvio: Date
}
```

#### **Media (Media)**
```javascript
{
  filename: String,
  originalName: String,
  mimetype: String,
  size: Number,
  placeId: ObjectId,
  type: String (cover/gallery)
}
```

### APIs REST Disponibles

#### **Auth Service** (`/auth`)
```bash
POST /auth/register          # Registro de usuarios
POST /auth/login            # Autenticación
GET  /auth/validate         # Validación de token
GET  /auth/profile          # Perfil del usuario
GET  /auth/users            # Listar usuarios (solo GAD)
GET  /auth/health           # Health check
```

#### **Places Service** (`/places`)
```bash
GET    /places              # Listar lugares con filtros
GET    /places/:id          # Obtener lugar específico
POST   /places              # Crear lugar (solo GAD)
PUT    /places/:id          # Actualizar lugar (solo GAD)
DELETE /places/:id          # Eliminar lugar (solo GAD)
PATCH  /places/:id/status   # Cambiar estado
GET    /places/health       # Health check
```

#### **Reviews Service** (`/reviews`)
```bash
GET    /reviews/lugar/:id   # Reseñas de un lugar
POST   /reviews             # Crear reseña (autenticado)
PUT    /reviews/:id         # Actualizar reseña
DELETE /reviews/:id         # Eliminar reseña
GET    /reviews/admin       # Listar todas (solo GAD)
PUT    /reviews/admin/:id   # Moderar reseña (solo GAD)
GET    /reviews/health      # Health check
```

#### **Media Service** (`/media`)
```bash
POST   /media/upload        # Subir imágenes (solo GAD)
GET    /media/:id           # Obtener imagen
DELETE /media/:id           # Eliminar imagen (solo GAD)
GET    /media/health        # Health check
```

#### **Notifications Service** (`/notifications`)
```bash
GET    /notifications       # Obtener notificaciones
POST   /notifications       # Crear notificación (solo GAD)
PUT    /notifications/:id   # Marcar como leída
DELETE /notifications/:id   # Eliminar notificación
GET    /notifications/health # Health check
```

### Scripts de Utilidad

#### **Migración de Datos**
```bash
# Migrar lugares (limpiar datos de imágenes)
cd backend
node scripts/migratePlaces.js

# Limpiar datos de lugares
node scripts/cleanPlacesData.js
```

#### **Documentación de APIs**
- `Postman_Collection.md` - Colección completa de pruebas
- `Postman_Collection_Places.md` - Pruebas específicas de lugares
- `Postman_Collection_Reviews.md` - Pruebas específicas de reseñas
- `Postman_Collection_Media.md` - Pruebas específicas de media

## 🔔 Sistema de Notificaciones

### Arquitectura de 4 Nodos

1. **Backend** - Persistencia en MongoDB
2. **BackOffice** - Interfaz de envío
3. **Servidor Socket.io** - Distribución en tiempo real
4. **Frontend móvil** - Recepción de notificaciones

### Flujo de Notificaciones

1. **Plantillas sin userId** = disponibles para todos los administradores
2. **Envío desde BackOffice** → Socket.io + persistencia en BD
3. **Recepción en tiempo real** + almacenamiento persistente
4. **Marcado como leída** cuando el usuario las ve

### Configuración Socket.io

```javascript
// Frontend - Conexión
this.socket = io('https://geoapi.esmeraldas.gob.ec', {
  path: '/new/socket.io'
});

// Backend - Emisión
socket.emit('notification', { titulo, mensaje, userId });
```

## 🔐 Sistema de Autenticación

### JWT (JSON Web Tokens)
- **Secret:** Configurable via `JWT_SECRET`
- **Expiración:** 24h por defecto (configurable)
- **Algoritmo:** HS256

### Roles y Permisos
- **usuario:** Acceso básico a la app móvil
- **propietario:** Gestión de sus establecimientos
- **gad:** Acceso completo al BackOffice

### Middleware de Autenticación
```javascript
// Verificación automática en rutas protegidas
app.use('/protected', authMiddleware);
```

## 🎨 Interfaz de Usuario

### Frontend Móvil
- **Framework:** Angular 17 + PrimeNG
- **Estilos:** Tailwind CSS
- **Iconos:** PrimeIcons
- **Responsive:** Mobile-first design
- **Tema:** Moderno y turístico

### BackOffice
- **Framework:** Angular 20 + Material Design
- **Componentes:** Angular Material
- **Navegación:** Sidebar con categorías
- **Tablas:** Interactivas con filtros
- **Formularios:** Validación en tiempo real

## 🚀 Despliegue

### Variables de Entorno

#### **Backend (.env)**
```env
PORT=3001
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/turismoDB
JWT_SECRET=tu_secret_super_seguro
JWT_EXPIRES_IN=24h
CORS_ORIGIN=https://tu-dominio.com
```

#### **Frontend (environment.ts)**
```typescript
export const environment = {
  production: true,
  apiUrl: 'https://api.tu-dominio.com',
  socketUrl: 'https://socket.tu-dominio.com'
};
```

### Comandos de Despliegue

```bash
# Backend
cd backend
npm install --production
npm start

# Frontend Móvil
cd Frontend/app-turismo-movil
ng build --configuration production
ng add @capacitor/android
npx cap sync

# BackOffice
cd BackOffice/backoffice-admin
ng build --configuration production
```

## 📊 Monitoreo y Logs

### Health Checks
- **Endpoint:** `/health` en cada microservicio
- **Estado:** healthy/degraded/unhealthy
- **Métricas:** uptime, memoria, conexiones DB

### Logs Estructurados
```javascript
console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
```

## 🔧 Troubleshooting

### Problemas Comunes

#### **Error de CORS**
```bash
# Verificar configuración en backend/config/config.js
origin: ['http://localhost:3000', 'http://localhost:4200', 'http://localhost:4300']
```

#### **Error de Conexión MongoDB**
```bash
# Verificar que MongoDB esté corriendo
sudo systemctl status mongod
# o
brew services list | grep mongodb
```

#### **Error de Cache en BackOffice**
```bash
cd BackOffice/backoffice-admin
rm -rf ./node_modules/.vite
rm -rf .angular/cache
rm -rf node_modules
npm install
```

#### **Error de Puerto en Uso**
```bash
# Verificar puertos ocupados
lsof -i :3001
lsof -i :4200
lsof -i :4300

# Matar proceso si es necesario
kill -9 <PID>
```

## 📈 Métricas y Estadísticas

### Dashboard del BackOffice
- **Usuarios activos:** Conteo en tiempo real
- **Lugares turísticos:** Total y por categoría
- **Reseñas:** Total y promedio de calificaciones
- **Imágenes:** Total subidas al sistema
- **Estado de servicios:** Health check de microservicios

### APIs de Estadísticas
```bash
GET /stats/overview      # Estadísticas generales
GET /stats/users         # Métricas de usuarios
GET /stats/places        # Métricas de lugares
GET /stats/reviews       # Métricas de reseñas
```

## 🔄 Roadmap y Mejoras Futuras

### ✅ **Completado**
- Arquitectura base de microservicios
- Sistema de autenticación robusto
- CRUD completo para lugares y reseñas
- Frontend móvil funcional
- BackOffice administrativo
- Sistema de notificaciones en tiempo real
- Validaciones y manejo de errores
- Documentación completa de APIs

### 🔄 **En Desarrollo**
- Reporte de incidencias (UI lista, lógica pendiente)
- Sistema de reportes en BackOffice
- Optimización de rendimiento
- Tests automatizados

### 🚀 **Próximas Funcionalidades**
- **Sistema de reservas** para establecimientos
- **Mapa interactivo** con ubicaciones en tiempo real
- **Sistema de eventos** y calendario turístico
- **Galería multimedia** avanzada
- **Sistema de recomendaciones** basado en IA
- **Analytics avanzado** para GAD
- **App nativa** para iOS y Android
- **Sistema de pagos** integrado

## 📚 Documentación Adicional

### Archivos de Documentación
- `backend/Postman_Collection.md` - Guía completa de APIs
- `backend/Postman_Collection_Places.md` - Pruebas de lugares
- `backend/Postman_Collection_Reviews.md` - Pruebas de reseñas
- `backend/Postman_Collection_Media.md` - Pruebas de media
- `BackOffice/backoffice-admin/MICROSERVICES_MIGRATION.md` - Guía de migración

### Scripts de Desarrollo
- `backend/scripts/migratePlaces.js` - Migración de datos
- `backend/scripts/cleanPlacesData.js` - Limpieza de datos

## 👥 Contribución

### Estructura de Commits
```
feat: nueva funcionalidad
fix: corrección de bug
docs: documentación
style: cambios de estilo
refactor: refactorización
test: tests
chore: tareas de mantenimiento
```

### Guías de Desarrollo
1. **Seguir convenciones** de Angular y Node.js
2. **Documentar APIs** con ejemplos
3. **Escribir tests** para nuevas funcionalidades
4. **Validar cambios** en múltiples navegadores
5. **Probar en dispositivos móviles** reales

## 📞 Soporte

### Contacto del Equipo
- **Desarrollador Principal:** [Tu Nombre]
- **Email:** [tu-email@dominio.com]
- **GitHub:** [tu-usuario-github]

### Recursos Adicionales
- **Documentación Angular:** https://angular.io/docs
- **Documentación Express:** https://expressjs.com/
- **Documentación MongoDB:** https://docs.mongodb.com/
- **Documentación Socket.io:** https://socket.io/docs/

---

## 🏖️ Desarrollado para Esmeraldas Turismo

**Esmeraldas Turismo** es una iniciativa del Gobierno Autónomo Descentralizado de Esmeraldas para promover el turismo sostenible y la gestión eficiente de los recursos turísticos de la provincia.

**Versión:** 1.0.0  
**Última actualización:** Diciembre 2024  
**Licencia:** MIT

