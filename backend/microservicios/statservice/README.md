# Microservicio Stats Service

## Descripción
Microservicio para obtener estadísticas globales del sistema de turismo de Esmeraldas. Consulta los endpoints de conteo de todos los microservicios y proporciona un resumen general. También incluye funcionalidad de health check para monitorear el estado de todos los microservicios.

## Puerto
- **Puerto**: 3005

## Endpoints Principales

### 1. Health Check del Servicio
```
GET /
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Stats Microservice - Esmeraldas Turismo",
  "data": {
    "service": "Stats Service",
    "version": "1.0.0",
    "timestamp": "2024-01-XXT10:30:00.000Z",
    "status": "running",
    "port": 3005,
    "endpoints": {
      "stats": "/stats/overview",
      "health": "/health",
      "healthSimple": "/health/simple",
      "healthService": "/health/:serviceName"
    }
  }
}
```

### 2. Estadísticas Globales
```
GET /stats/overview
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Estadísticas obtenidas correctamente",
  "data": {
    "usuarios": 150,
    "lugares": 25,
    "resenas": 89,
    "imagenes": 156
  }
}
```

## Endpoints de Health Check

### 3. Health Check Completo de Todos los Microservicios
```
GET /health
```

**Respuesta Exitosa (200 - Todos los servicios online):**
```json
{
  "success": true,
  "message": "Estado de salud de todos los microservicios - HEALTHY",
  "data": {
    "overall": {
      "status": "healthy",
      "onlineServices": 5,
      "totalServices": 5,
      "uptime": "3600s",
      "timestamp": "2024-01-XXT10:30:00.000Z"
    },
    "services": [
      {
        "service": "Auth Service",
        "url": "http://localhost:3001",
        "port": 3001,
        "status": "online",
        "responseTime": "45ms",
        "statusCode": 200,
        "timestamp": "2024-01-XXT10:30:00.000Z",
        "data": {
          "success": true,
          "message": "Auth Microservice - Esmeraldas Turismo"
        }
      },
      {
        "service": "Places Service",
        "url": "http://localhost:3002",
        "port": 3002,
        "status": "online",
        "responseTime": "32ms",
        "statusCode": 200,
        "timestamp": "2024-01-XXT10:30:00.000Z",
        "data": {
          "success": true,
          "message": "Places Microservice - Esmeraldas Turismo"
        }
      }
    ]
  }
}
```

**Respuesta Degradada (207 - Algunos servicios offline):**
```json
{
  "success": true,
  "message": "Estado de salud de todos los microservicios - DEGRADED",
  "data": {
    "overall": {
      "status": "degraded",
      "onlineServices": 3,
      "totalServices": 5,
      "uptime": "3600s",
      "timestamp": "2024-01-XXT10:30:00.000Z"
    },
    "services": [
      {
        "service": "Auth Service",
        "url": "http://localhost:3001",
        "port": 3001,
        "status": "online",
        "responseTime": "45ms",
        "statusCode": 200,
        "timestamp": "2024-01-XXT10:30:00.000Z"
      },
      {
        "service": "Reviews Service",
        "url": "http://localhost:3004",
        "port": 3004,
        "status": "offline",
        "responseTime": "5000ms",
        "error": "timeout of 5000ms exceeded",
        "statusCode": "N/A",
        "timestamp": "2024-01-XXT10:30:00.000Z"
      }
    ]
  }
}
```

**Respuesta No Saludable (503 - Todos los servicios offline):**
```json
{
  "success": true,
  "message": "Estado de salud de todos los microservicios - UNHEALTHY",
  "data": {
    "overall": {
      "status": "unhealthy",
      "onlineServices": 0,
      "totalServices": 5,
      "uptime": "3600s",
      "timestamp": "2024-01-XXT10:30:00.000Z"
    },
    "services": [
      {
        "service": "Auth Service",
        "url": "http://localhost:3001",
        "port": 3001,
        "status": "offline",
        "responseTime": "5000ms",
        "error": "connect ECONNREFUSED 127.0.0.1:3001",
        "statusCode": "N/A",
        "timestamp": "2024-01-XXT10:30:00.000Z"
      }
    ]
  }
}
```

### 4. Health Check Simplificado (Para Monitoreo)
```
GET /health/simple
```

**Respuesta:**
```json
{
  "status": "healthy",
  "online": 5,
  "total": 5,
  "timestamp": "2024-01-XXT10:30:00.000Z",
  "services": [
    {
      "name": "Auth Service",
      "status": "online",
      "port": 3001
    },
    {
      "name": "Places Service",
      "status": "online",
      "port": 3002
    },
    {
      "name": "Media Upload Service",
      "status": "online",
      "port": 3003
    },
    {
      "name": "Reviews Service",
      "status": "online",
      "port": 3004
    },
    {
      "name": "Notifications Service",
      "status": "online",
      "port": 3006
    }
  ]
}
```

### 5. Health Check de Servicio Específico
```
GET /health/:serviceName
```

**Parámetros:**
- `serviceName`: Nombre del servicio (auth, places, media, reviews, notifications)

**Ejemplo:**
```
GET /health/auth
```

**Respuesta Exitosa (200):**
```json
{
  "success": true,
  "message": "Estado de salud del servicio Auth Service",
  "data": {
    "service": "Auth Service",
    "url": "http://localhost:3001",
    "port": 3001,
    "status": "online",
    "responseTime": "45ms",
    "statusCode": 200,
    "timestamp": "2024-01-XXT10:30:00.000Z",
    "data": {
      "success": true,
      "message": "Auth Microservice - Esmeraldas Turismo"
    }
  }
}
```

**Respuesta de Error (503):**
```json
{
  "success": true,
  "message": "Estado de salud del servicio Auth Service",
  "data": {
    "service": "Auth Service",
    "url": "http://localhost:3001",
    "port": 3001,
    "status": "offline",
    "responseTime": "5000ms",
    "error": "connect ECONNREFUSED 127.0.0.1:3001",
    "statusCode": "N/A",
    "timestamp": "2024-01-XXT10:30:00.000Z"
  }
}
```

## Microservicios Monitoreados

| Servicio | Puerto | URL por Defecto | Endpoint de Health Check |
|----------|--------|-----------------|-------------------------|
| Auth Service | 3001 | http://localhost:3001 | / |
| Places Service | 3002 | http://localhost:3002 | / |
| Media Upload Service | 3003 | http://localhost:3003 | / |
| Reviews Service | 3004 | http://localhost:3004 | / |
| Notifications Service | 3006 | http://localhost:3006 | / |

## Estados de Salud

### Estado General
- **healthy**: Todos los servicios están online
- **degraded**: Algunos servicios están offline, pero al menos uno está online
- **unhealthy**: Todos los servicios están offline

### Estado Individual
- **online**: El servicio responde correctamente
- **offline**: El servicio no responde o hay un error de conexión

## Códigos de Estado HTTP

| Estado General | Código HTTP | Descripción |
|----------------|-------------|-------------|
| healthy | 200 | Todos los servicios funcionando |
| degraded | 207 | Algunos servicios offline |
| unhealthy | 503 | Todos los servicios offline |

## Configuración

### Variables de Entorno
```env
PORT=3005
AUTH_SERVICE_URL=http://localhost:3001
PLACES_SERVICE_URL=http://localhost:3002
MEDIA_SERVICE_URL=http://localhost:3003
REVIEWS_SERVICE_URL=http://localhost:3004
NOTIFICATIONS_SERVICE_URL=http://localhost:3006
JWT_SECRET=secretAuth
```

### Timeout de Health Check
- **Timeout**: 5 segundos por servicio
- **Concurrent**: Todos los servicios se verifican en paralelo

## Ejemplos de Uso

### Verificar Estado de Todos los Servicios
```bash
curl -X GET http://localhost:3005/health
```

### Verificar Estado Simplificado
```bash
curl -X GET http://localhost:3005/health/simple
```

### Verificar Servicio Específico
```bash
curl -X GET http://localhost:3005/health/auth
```

### Obtener Estadísticas
```bash
curl -X GET http://localhost:3005/stats/overview
```

## Scripts de Prueba

### Probar Health Check
```bash
cd backend/microservicios/statservice
node test-health-check.js
```

## Monitoreo y Alertas

### Para Monitoreo Automático
- Usar `/health/simple` para verificaciones rápidas
- Configurar alertas basadas en códigos de estado HTTP
- Monitorear tiempo de respuesta de cada servicio

### Para Dashboards
- Usar `/health` para información detallada
- Mostrar estado de cada servicio individualmente
- Incluir métricas de tiempo de respuesta

## Integración con Herramientas de Monitoreo

### Prometheus/Grafana
```bash
# Endpoint para métricas
GET /health/simple
```

### Nagios/Zabbix
```bash
# Verificar estado general
curl -f http://localhost:3005/health/simple || exit 1
```

### Kubernetes Health Check
```yaml
livenessProbe:
  httpGet:
    path: /health/simple
    port: 3005
  initialDelaySeconds: 30
  periodSeconds: 10
readinessProbe:
  httpGet:
    path: /health/simple
    port: 3005
  initialDelaySeconds: 5
  periodSeconds: 5
```

## Notas Importantes

1. **Concurrencia**: Los health checks se ejecutan en paralelo para mayor velocidad
2. **Timeout**: Cada servicio tiene un timeout de 5 segundos
3. **Fallback**: Si un servicio no responde, se marca como offline pero no afecta otros
4. **Uptime**: Se incluye el tiempo de funcionamiento del microservicio de Stats
5. **Timestamp**: Todas las respuestas incluyen timestamp para auditoría
6. **Escalabilidad**: Fácil agregar nuevos servicios modificando la configuración

---

**Desarrollado para Esmeraldas Turismo** 