# 🏖️ Esmeraldas Turismo — Sistema Completo de Gestión Turística

## 📋 Descripción General

**Esmeraldas Turismo** es un sistema completo de gestión turística para Esmeraldas, Ecuador. Diseñado para gobiernos locales (GAD), propietarios de establecimientos y turistas, incluye autenticación robusta, gestión de lugares turísticos, reseñas, subida de imágenes y notificaciones en tiempo real.

## 🏗️ Arquitectura del Sistema

### Componentes Principales

```
AppTurismoEsmeraldas/
├── 📱 Frontend/app-turismo-movil/   # Aplicación móvil Angular 17 + Capacitor
├── 🌐 Frontend/                     # Aplicación web Angular 19 (básica)
├── 🖥️ BackOffice/                   # Panel administrativo Angular 20
├── ⚙️ backend/                      # API Backend unificada Node.js/Express
└── 📚 Documentación                # APIs y guías de uso
```

### Stack Tecnológico

| Componente | Tecnología | Versión | Puerto |
|------------|------------|---------|--------|
| **Backend API** | Node.js + Express + ES Modules | v1.0.0 | 3001 |
| **Base de Datos** | MongoDB + Mongoose | 7.5.0 | 27017 |
| **App Móvil** | Angular + PrimeNG + Capacitor | 17.3.0 | 4300 |
| **App Web** | Angular + PrimeNG | 19.2.0 | 4200 |
| **BackOffice** | Angular + Material Design | 20.0.0 | 4300 |
| **Notificaciones** | Socket.io (tiempo real) | 4.8.1 | integrado |
| **Estilos** | Tailwind CSS | 3.4.17 | - |

### ⚠️ **Arquitectura Actual**
El sistema utiliza una **API Backend unificada** (monolítica) en el puerto 3001 que maneja todos los servicios: autenticación, lugares, reseñas, notificaciones y actividades. Aunque la documentación menciona microservicios, la implementación actual es un backend consolidado más eficiente para el tamaño del proyecto.

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

### 3. Configurar Aplicación Móvil

```bash
cd Frontend/app-turismo-movil
npm install
ng serve --port 4300
# La app estará disponible en http://localhost:4300
```

### 4. Configurar Aplicación Web (Opcional)

```bash
cd Frontend
npm install
ng serve --port 4200
# La app web estará disponible en http://localhost:4200
```

### 5. Configurar BackOffice Administrativo

```bash
cd BackOffice/backoffice-admin
npm install
ng serve --port 4300
# El panel admin estará disponible en http://localhost:4300
```

### 6. Crear Usuario Administrador

```bash
cd backend
node scripts/createAdminUser.js
# Credenciales por defecto: admin@esmeraldas.gob.ec / admin123
```

## 📱 Aplicación Móvil (Frontend/app-turismo-movil)

### Estado: ✅ **COMPLETAMENTE FUNCIONAL**

#### ✅ **Funcionalidades Implementadas**
- **Portada de bienvenida** con imagen atractiva
- **Sistema de autenticación** completo (login/registro/validación)
- **Dashboard principal** con navegación intuitiva
- **Listado de lugares turísticos** con 12 categorías de filtro
- **Detalle de lugares** con galería de imágenes y ubicación
- **Sistema de reseñas completo** (crear, editar, eliminar, calificaciones 1-5)
- **Perfil de usuario** con gestión de datos
- **Notificaciones en tiempo real** vía Socket.io
- **Página de emergencias** con información de contacto
- **Navegación con menú inferior** responsive
- **Diseño moderno** con Tailwind CSS + PrimeNG

#### 🔄 **En Desarrollo**
- **Reporte de incidencias** (UI implementada, lógica backend pendiente)
- **Mapa interactivo** (estructura básica lista)
- **Cultura y gastronomía** (sección preparada)

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
- Consumo de API backend unificada (puerto 3001)
- Filtros por categoría: playas, ríos, cascadas, reservas, montañas, bosques, museos, iglesias, parques, miradores, gastronomía
- Búsqueda por nombre y paginación
- Gestión de imágenes y estados

#### **ReviewsService** (`src/app/services/reviews.service.ts`)
- Integración completa con backend de reseñas
- CRUD completo: crear, editar, eliminar reseñas
- Sistema de calificaciones de 1-5 estrellas
- Autenticación JWT requerida

#### **AuthService** (`src/app/services/auth.service.ts`)
- Autenticación JWT con tokens seguros
- Login/registro con validaciones
- Gestión de sesiones y roles de usuario
- Interceptores HTTP automáticos

#### **SocketService** (`src/app/services/socket.io.service.ts`)
- Conexión en tiempo real con Socket.io
- Recepción de notificaciones push instantáneas
- Gestión de eventos de usuario
- Reconexión automática y manejo de errores

### Configuración de Capacitor

```typescript
// capacitor.config.ts
const config: CapacitorConfig = {
  appId: 'com.turismo.esmeraldas',
  appName: 'app-turismo-movil',
  webDir: 'dist'
};
```

## 🌐 Aplicación Web (Frontend)

### Estado: ⚠️ **DESARROLLO BÁSICO**

#### ✅ **Funcionalidades Implementadas**
- **Sistema de autenticación** (login/registro)
- **Dashboard inicial** básico
- **Listado de lugares** simple
- **Notificaciones** estructura básica

#### ⚠️ **Limitaciones Actuales**
- Funcionalidades limitadas comparado con la app móvil
- Diseño básico sin optimización
- Servicios de integración incompletos
- Falta implementar funcionalidades avanzadas

#### 🔄 **Recomendaciones**
- Unificar versión de Angular a v20
- Implementar funcionalidades completas de la app móvil
- Mejorar diseño y UX
- Completar servicios de integración

---

## 🖥️ BackOffice Administrativo

### Estado: ✅ **COMPLETAMENTE FUNCIONAL**

#### ✅ **Funcionalidades Administrativas Completas**
- **Dashboard principal** con métricas en tiempo real y estadísticas
- **Gestión de usuarios** (CRUD completo, roles, activación/desactivación)
- **Gestión de lugares turísticos** (CRUD + imágenes, categorías, estados)
- **Gestión de reseñas** (moderación, aprobación/rechazo, filtros)
- **Sistema de notificaciones avanzado** (plantillas, envío masivo, dirigido)
- **Monitoreo del sistema** (health check del backend, estadísticas)
- **Autenticación segura** (solo usuarios admin, JWT)
- **Actividad reciente** (log de acciones administrativas)

#### 🔄 **Próximamente**
- **Sistema de reportes avanzados** (analytics detallados)
- **Dashboard de métricas** (gráficos y estadísticas avanzadas)

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

### Configuración de Backend

```typescript
// src/app/config/api.config.ts
export const BACKEND_CONFIG = {
  BASE_URL: 'http://localhost:3001',
  ENDPOINTS: {
    AUTH: { /* endpoints de autenticación */ },
    PLACES: { /* endpoints de lugares */ },
    REVIEWS: { /* endpoints de reseñas */ },
    NOTIFICATIONS: { /* endpoints de notificaciones */ }
  }
};
```

### Acceso al BackOffice

- **URL:** http://localhost:4300
- **Usuario Admin:** `admin@esmeraldas.gob.ec`
- **Contraseña:** `admin123`

### Sistema de Notificaciones Administrativas

#### **Tipos de Notificaciones**
1. **Plantillas Administrativas** (sent: false) - Reutilizables para administradores
2. **Notificaciones de Usuario** (sent: true) - Enviadas a usuarios finales

#### **Flujo de Notificaciones**
1. Admin crea plantilla en BackOffice
2. Selecciona destinatarios (usuario específico o masivo)
3. Sistema envía vía Socket.io + persiste en BD
4. Apps cliente reciben en tiempo real
5. Usuarios marcan como leídas

## ⚙️ Backend API Unificada

### Arquitectura Actual

**API Backend Monolítica** - Puerto 3001

| Servicio Integrado | Endpoint Base | Descripción | Estado |
|-------------------|---------------|-------------|--------|
| **Auth** | `/auth` | Autenticación y gestión de usuarios | ✅ Funcional |
| **Places** | `/places` | CRUD de lugares turísticos | ✅ Funcional |
| **Reviews** | `/reviews` | Sistema de reseñas y calificaciones | ✅ Funcional |
| **Notifications** | `/notifications` | Notificaciones en tiempo real | ✅ Funcional |
| **Activities** | `/activities` | Log de actividades administrativas | ✅ Funcional |

### Ventajas de la Arquitectura Unificada
- **Simplicidad**: Un solo servidor para gestionar
- **Eficiencia**: Menos overhead de comunicación entre servicios
- **Desarrollo**: Más rápido para equipos pequeños
- **Mantenimiento**: Centralizado y fácil de debuggear

### Modelos de Datos

#### **Usuario (User)**
```javascript
{
  nombre: String (2-50 chars, requerido),
  correo: String (único, email válido),
  contraseña: String (hasheada con bcrypt, min 6 chars),
  rol: ['usuario', 'propietario', 'admin'], // admin para BackOffice
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
  category: String, // playa, rio, cascada, reserva, montaña, bosque, museo, iglesia, parque, mirador, gastronomía
  coverImageUrl: String (URL directa),
  imageUrls: [String] (URLs directas),
  active: Boolean (default: true),
  timestamps: true
}
```

#### **Reseña (Review)**
```javascript
{
  lugarId: ObjectId (referencia a Place),
  usuarioId: ObjectId (referencia a User),
  comentario: String (requerido),
  calificacion: Number (1-5, requerido),
  estado: ['aprobada', 'bloqueada'] (default: 'aprobada'),
  fecha: Date,
  timestamps: true
}
```

#### **Notificación (Notification)**
```javascript
{
  userId: ObjectId (null para notificaciones masivas),
  type: ['review', 'info', 'alert'] (default: 'info'),
  title: String (requerido),
  message: String (requerido),
  data: Object (metadatos adicionales),
  read: Boolean (default: false),
  sent: Boolean (default: false), // true = enviada a usuarios
  createdAt: Date
}
```

#### **Actividad (Activity)**
```javascript
{
  userId: ObjectId (referencia a User),
  action: ['user', 'place', 'review', 'notification', 'login', 'logout'],
  details: String (descripción de la acción),
  resourceType: String (tipo de recurso),
  resourceId: ObjectId (ID del recurso),
  metadata: Object (datos adicionales),
  timestamps: true
}
```

### APIs REST Disponibles

#### **Autenticación** (`/auth`)
```bash
POST /auth/register          # Registro de usuarios
POST /auth/login            # Autenticación y obtención de JWT
GET  /auth/validate         # Validación de token JWT
GET  /auth/profile          # Perfil del usuario autenticado
GET  /auth/users            # Listar usuarios (solo admin)
GET  /auth/users/count      # Contar usuarios (admin)
```

#### **Lugares Turísticos** (`/places`)
```bash
GET    /places              # Listar lugares (público, con filtros)
GET    /places/:id          # Obtener lugar específico (público)
POST   /places              # Crear lugar (solo admin)
PUT    /places/:id          # Actualizar lugar (solo admin)
DELETE /places/:id          # Eliminar lugar (solo admin)
PATCH  /places/:id/status   # Cambiar estado activo/inactivo (admin)
GET    /places/count        # Contar lugares (admin)
```

#### **Reseñas** (`/reviews`)
```bash
GET    /reviews/lugar/:id   # Reseñas de un lugar (público)
POST   /reviews             # Crear reseña (usuario autenticado)
PUT    /reviews/:id         # Actualizar reseña (propietario)
DELETE /reviews/:id         # Eliminar reseña (propietario/admin)
GET    /reviews/admin       # Listar todas las reseñas (admin)
PUT    /reviews/admin/:id   # Moderar reseña (admin)
GET    /reviews/count       # Contar reseñas (admin)
```

#### **Notificaciones** (`/notifications`)
```bash
GET    /notifications       # Obtener notificaciones del usuario
POST   /notifications       # Crear notificación/plantilla (admin)
PUT    /notifications/:id/read # Marcar como leída
DELETE /notifications/:id   # Eliminar notificación
GET    /notifications/admin # Plantillas administrativas (admin)
```

#### **Actividades** (`/activities`)
```bash
GET    /activities/recent   # Actividad reciente (admin)
POST   /activities          # Registrar actividad (sistema)
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

#### **Crear Usuario Administrador**
```bash
# Crear usuario admin para BackOffice
cd backend
node scripts/createAdminUser.js
```

#### **Documentación de APIs**
- `backend/Postman_Collection.md` - Colección completa de pruebas
- `backend/Postman_Collection_Places.md` - Pruebas específicas de lugares
- `backend/Postman_Collection_Reviews.md` - Pruebas específicas de reseñas

## 🔔 Sistema de Notificaciones

#### Funcionamiento
  Existen dos tipos de notificaciones, las administrativas y las de usuario.
  
  Las primeras se crean y usan en el backoffice, los adminstradores las usan como plantillas, en la sección de notificaciones, a los usuarios administradores les apareceran las notificaciones admintrativas, las mismas las podrán enviar a los usuarios, también pueden crear otras notificaciones adminostrativas, esto se hizo así por temas de reusabilidad.
  
  Las notificaciones de usuario contienen el campo sent = true, que quiere decir que la notificación fue enviada, y por ende la misma puede ser vista por otros usuarios.

  Al enviar la notificación, si la misma tiene la id del usuario, se almacenará la id. 

  En el frontend, la aplicación pedirá al backend las notificaciones cuyo campo sent sea igual a true y no tengan id de usuario, o que su campo sent sea igual a true, y contengan la id del usaurio.

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
- **usuario:** Acceso básico a las apps (móvil/web)
- **propietario:** Gestión de sus establecimientos (futuro)
- **admin:** Acceso completo al BackOffice administrativo

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

### Health Check del Sistema
- **Backend:** Monitoreo integrado del estado del servidor
- **Estado:** healthy/degraded/unhealthy
- **Métricas:** uptime, memoria, conexiones DB
- **BackOffice:** Dashboard de monitoreo en tiempo real

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
- **Usuarios registrados:** Conteo total y activos
- **Lugares turísticos:** Total por categoría y estado
- **Reseñas:** Total y promedio de calificaciones
- **Actividad reciente:** Log de acciones administrativas
- **Estado del sistema:** Health check del backend

### Métricas Disponibles
- Estadísticas de usuarios (total, activos, por rol)
- Análisis de lugares (categorías más populares)
- Análisis de reseñas (promedio de calificaciones)
- Actividad administrativa en tiempo real

## 🔄 Roadmap y Mejoras Futuras

### ✅ **Completado - Estado Actual del Proyecto**
- **Backend API unificada** con todos los servicios integrados
- **Sistema de autenticación JWT** robusto con roles
- **CRUD completo** para usuarios, lugares y reseñas
- **Aplicación móvil Angular 17** completamente funcional
- **BackOffice administrativo Angular 20** con gestión completa
- **Sistema de notificaciones** en tiempo real con Socket.io
- **Validaciones y manejo de errores** comprehensivo
- **Documentación completa** de APIs con Postman

### 🔄 **En Desarrollo Activo**
- **Aplicación web** (completar funcionalidades faltantes)
- **Reporte de incidencias** (UI lista, lógica backend pendiente)
- **Sistema de reportes avanzados** en BackOffice
- **Mapa interactivo** (estructura preparada)

### ⚠️ **Recomendaciones Inmediatas**
- **Unificar versiones de Angular** a v20 en todos los módulos
- **Completar aplicación web** con funcionalidades de la app móvil
- **Implementar testing automatizado**
- **Actualizar documentación** para reflejar arquitectura actual

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
- `BackOffice/backoffice-admin/MICROSERVICES_MIGRATION.md` - Historial de migración

### Scripts de Utilidad
- `backend/scripts/createAdminUser.js` - Crear usuario administrador
- `backend/scripts/migratePlaces.js` - Migración de datos de lugares
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

### Recursos Adicionales
- **Documentación Angular:** https://angular.io/docs
- **Documentación Express:** https://expressjs.com/
- **Documentación MongoDB:** https://docs.mongodb.com/
- **Documentación Socket.io:** https://socket.io/docs/

---

## 🏖️ Desarrollado para Esmeraldas Turismo

**Esmeraldas Turismo** es una iniciativa del Gobierno Autónomo Descentralizado de Esmeraldas para promover el turismo sostenible y la gestión eficiente de los recursos turísticos de la provincia.

**Versión:** 1.0.0  
**Estado:** 80% Completo - Listo para deployment gradual  
**Última actualización:** Diciembre 2024  
**Licencia:** MIT

---

## 📊 Resumen del Estado del Proyecto

| Componente | Estado | Completitud | Observaciones |
|------------|--------|-------------|---------------|
| **Backend API** | ✅ Funcional | 95% | API unificada completa |
| **App Móvil** | ✅ Funcional | 85% | Lista para producción |
| **BackOffice** | ✅ Funcional | 90% | Panel admin completo |
| **App Web** | ⚠️ Básica | 40% | Necesita desarrollo |
| **Documentación** | ✅ Completa | 90% | Actualizada |

### 🎯 **Recomendación de Deployment**
1. **Fase 1**: Backend + App Móvil + BackOffice (Listo)
2. **Fase 2**: Completar App Web y funcionalidades pendientes
3. **Fase 3**: Funcionalidades avanzadas y optimizaciones

