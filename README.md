# BackOffice Esmeraldas Turismo

## Descripción

Este BackOffice es la plataforma administrativa del sistema "Esmeraldas Turismo". Permite la gestión y administración completa de la plataforma turística, diseñado exclusivamente para usuarios con el rol **GAD** (Gobierno Autónomo Descentralizado). El acceso está restringido a este tipo de usuario por motivos de seguridad y control institucional.

## 🚀 Funcionalidades Implementadas

### 🔐 **Autenticación y Seguridad**
- **Login seguro**: Solo usuarios con rol `gad` pueden acceder al panel
- **Protección de rutas**: El sistema impide el acceso a usuarios no autorizados
- **Gestión de sesión**: Manejo de token JWT con almacenamiento seguro
- **Validación de permisos**: Verificación automática del rol en cada petición
- **Interceptor HTTP**: Añade automáticamente el token a todas las peticiones

### 🎨 **Interfaz de Usuario**
- **Panel de administración moderno**: Interfaz profesional con tema oscuro
- **Angular Material**: Componentes modernos y responsivos
- **Navegación lateral**: Menú intuitivo con todas las secciones
- **Diseño responsivo**: Adaptable a diferentes tamaños de pantalla
- **Estilos globales**: Consistencia visual en toda la aplicación

### 📊 **Dashboard Principal**
- **Estadísticas en tiempo real**: Métricas de usuarios, lugares y reseñas
- **Acciones rápidas**: Botones para funciones principales
- **Actividades recientes**: Historial de todas las acciones administrativas
- **Gráficos y métricas**: Visualización de datos del sistema

### 👥 **Gestión de Usuarios**
- **Listado completo**: Vista de todos los usuarios registrados
- **Filtrado por nombre**: Búsqueda rápida de usuarios
- **Acciones de usuario**:
  - ✅ **Activar/Desactivar**: Control de estado de usuarios
  - 🗑️ **Eliminar permanentemente**: Eliminación completa de usuarios
  - ➕ **Agregar usuarios**: Creación de nuevos usuarios
- **Confirmaciones**: Diálogos de confirmación para acciones críticas
- **Mensajes de feedback**: Notificaciones de éxito/error

### 🏞️ **Gestión de Lugares Turísticos**
- **CRUD completo**: Crear, leer, actualizar y eliminar lugares
- **Validaciones flexibles**: Sistema de validación robusto
- **Gestión de multimedia**: Subida y gestión de imágenes
- **Categorización**: Organización por tipos de lugares
- **Estados de lugares**: Control de visibilidad y estado

### ⭐ **Gestión de Reseñas**
- **Moderación de reseñas**: Aprobación/rechazo de comentarios
- **Filtrado avanzado**: Búsqueda por usuario, lugar, estado
- **Acciones masivas**: Operaciones en lote
- **Calificaciones**: Gestión de puntuaciones de usuarios

### 🔧 **Monitoreo de Servicios**
- **Panel de microservicios**: Control centralizado de todos los servicios
- **Estados en tiempo real**: 
  - 🟢 **Ejecutándose** - Servicios activos
  - 🔴 **Detenido** - Servicios inactivos
  - 🟡 **Iniciando/Deteniendo** - Estados transitorios con animaciones
- **Control individual**: Activar/desactivar servicios uno por uno
- **Control masivo**: 
  - ✅ **Activar todos** - Activa todos los servicios
  - ⏸️ **Desactivar todos** - Desactiva todos (excepto autenticación)
- **Protección de servicios críticos**: El servicio de autenticación nunca se puede desactivar
- **Estadísticas de disponibilidad**: Métricas de funcionamiento
- **Auto-refresh**: Actualización automática cada 30 segundos
- **Verificación de endpoints**: Comprobación de estado real de servicios

### 📈 **Sistema de Actividades**
- **Registro automático**: Todas las acciones administrativas quedan registradas
- **Historial completo**: Actividades de usuarios, lugares, reseñas y servicios
- **Información detallada**: Usuario, acción, recurso y timestamp
- **Filtrado por sección**: Visualización organizada por módulos

## 🏗️ **Arquitectura del Sistema**

### **Frontend (Angular)**
```
BackOffice/
  backoffice-admin/
    src/
      app/
        auth/           # Autenticación y autorización
        dashboard/      # Dashboard principal y componentes
          home/         # Página de inicio
          usuarios/     # Gestión de usuarios
          servicios/    # Monitoreo de microservicios
        interceptors/   # Interceptores HTTP
      styles.scss       # Estilos globales
```

### **Backend (Node.js)**
```
backend/
  controllers/         # Controladores de la API
  models/             # Modelos de MongoDB
  routes/             # Rutas de la API
  middlewares/        # Middlewares de autenticación y validación
  services/           # Lógica de negocio
  scripts/            # Scripts de inicialización
```

## 📋 **Servicios Monitoreados**

| Servicio | Tipo | Estado | Descripción |
|----------|------|--------|-------------|
| API Principal | API | 🟢 Activo | Servicio principal del sistema |
| Base de Datos MongoDB | Database | 🟢 Activo | Base de datos principal |
| Servicio de Autenticación | API | 🟢 Activo | Gestión de usuarios y sesiones |
| Servicio de Lugares | API | 🟢 Activo | Gestión de lugares turísticos |
| Servicio de Reseñas | API | 🟢 Activo | Gestión de reseñas y calificaciones |
| Servicio de Multimedia | API | 🟢 Activo | Gestión de archivos multimedia |
| Servicio de Estadísticas | API | 🟢 Activo | Métricas y reportes |
| Frontend Angular | External | 🟢 Activo | Aplicación frontend |

## 🔧 **Requisitos Técnicos**

- **Node.js** >= 18
- **Angular** >= 17
- **MongoDB** >= 6.0
- **Backend** corriendo en `http://localhost:3001`

## 🚀 **Instalación y Uso**

### **1. Instalación del Frontend**
```bash
cd BackOffice/backoffice-admin
npm install
```

### **2. Iniciar el BackOffice**
```bash
ng serve --port 4200
```

### **3. Acceder al Sistema**
- **URL:** [http://localhost:4200](http://localhost:4200)
- **Usuario GAD:** `gad@gmail.com`
- **Contraseña:** `Admin123`

### **4. Iniciar el Backend**
```bash
cd backend
npm install
npm start
```

## 🔒 **Seguridad**

- **Autenticación JWT**: Tokens seguros con expiración
- **Autorización por roles**: Solo usuarios GAD pueden acceder
- **Protección de rutas**: Guard de Angular para rutas protegidas
- **Validación de datos**: Middlewares de validación en backend
- **Sanitización**: Prevención de inyecciones y ataques
- **Logs de actividad**: Registro de todas las acciones administrativas

## 📊 **Métricas del Sistema**

- **Usuarios registrados**: Gestión completa de usuarios
- **Lugares turísticos**: CRUD completo con validaciones
- **Reseñas moderadas**: Sistema de aprobación/rechazo
- **Servicios monitoreados**: 8 microservicios en tiempo real
- **Actividades registradas**: Historial completo de acciones

## 🎯 **Próximas Funcionalidades**

- [ ] **Reportes avanzados**: Gráficos y estadísticas detalladas
- [ ] **Notificaciones en tiempo real**: Sistema de alertas
- [ ] **Backup automático**: Respaldo de datos críticos
- [ ] **Logs de auditoría**: Trazabilidad completa de acciones
- [ ] **Gestión de roles**: Roles más granulares
- [ ] **API de terceros**: Integración con servicios externos

## ⚙️ Panel de Monitoreo y Control de Microservicios (BackOffice)

### Funcionalidades avanzadas:
- **Visualización en tiempo real** del estado de todos los microservicios (online, detenido, error, etc.).
- **Control individual**: Puedes iniciar, detener o reiniciar cada microservicio desde el dashboard.
- **Control masivo**:
  - **Activar todos**: Inicia todos los microservicios (excepto autenticación y estadísticas) con un solo clic.
  - **Detener todos**: Detiene todos los microservicios (excepto autenticación y estadísticas) con un solo clic.
- **Protección de servicios críticos**: El servicio de autenticación (`auth`) y el de estadísticas (`statservice`) nunca se detienen desde el panel para evitar dejar el sistema sin acceso.
- **Feedback visual**: El dashboard muestra el estado real tras cada acción (detenidos, online, error, etc.).
- **Auto-refresh**: El estado de los servicios se actualiza automáticamente cada 30 segundos.

### ¿Cómo funciona el control de servicios?
- El BackOffice se comunica con el microservicio de estadísticas (`statservice`) mediante endpoints REST.
- El backend usa **PM2** para controlar los procesos Node.js de cada microservicio.
- Los comandos ejecutados son:
  - `pm2 start <servicio>` para iniciar
  - `pm2 stop <servicio>` para detener
  - `pm2 restart <servicio>` para reiniciar
- El backend expone endpoints como:
  - `POST /service/<servicio>/start` (inicia un servicio)
  - `POST /service/<servicio>/stop` (detiene un servicio)
  - `POST /service/<servicio>/restart` (reinicia un servicio)
  - `POST /service/stopAll` (detiene todos menos auth y stats)
  - `POST /service/startAll` (inicia todos menos auth y stats)

### Ejecución y administración de microservicios con PM2

#### **Iniciar statservice con PM2**
```bash
cd backend/microservicios/statservice
pm2 start index.js --name statservice
```

#### **Iniciar todos los microservicios con PM2**
Ejecuta cada uno en su carpeta:
```bash
pm2 start index.js --name authservice      # Autenticación
pm2 start index.js --name placeservice     # Lugares
pm2 start index.js --name reviewservice    # Reseñas
pm2 start index.js --name mediaupload      # Multimedia
pm2 start index.js --name notificationsservice # Notificaciones
pm2 start index.js --name statservice      # Estadísticas
```

#### **Ver el estado de todos los servicios**
```bash
pm2 list
```

#### **Ver logs de un servicio**
```bash
pm2 logs <nombre_del_servicio>
```

#### **Detener un servicio**
```bash
pm2 stop <nombre_del_servicio>
```

#### **Reiniciar un servicio**
```bash
pm2 restart <nombre_del_servicio>
```

#### **Detener todos los servicios (excepto auth y stats) desde el dashboard**
- Usa el botón "Detener todos" en la sección de servicios del BackOffice.
- El backend ejecuta `pm2 stop` para todos los servicios menos `authservice` y `statservice`.
- El estado real se refleja en la tabla tras la operación.

#### **Activar todos los servicios (excepto auth y stats) desde el dashboard**
- Usa el botón "Activar todos" en la sección de servicios del BackOffice.
- El backend ejecuta `pm2 start` para todos los servicios menos `authservice` y `statservice`.
- El estado real se refleja en la tabla tras la operación.

### ⚠️ Advertencias importantes
- **No detengas el servicio de autenticación ni el de estadísticas** si quieres mantener el acceso al sistema y el monitoreo.
- Si un servicio no inicia o se detiene, revisa los logs con `pm2 logs <servicio>` para ver el error.
- Si cambias el código de un microservicio, reinícialo con `pm2 restart <servicio>`.
- Puedes eliminar un proceso de PM2 con `pm2 delete <servicio>`, pero tendrás que volver a iniciarlo manualmente.

---

**Desarrollado para Esmeraldas Turismo** 🏖️ 