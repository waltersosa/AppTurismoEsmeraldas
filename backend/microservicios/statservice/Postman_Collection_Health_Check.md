# Postman Collection - Stats Service Health Check

## Configuración del Entorno

### Variables de Entorno
```json
{
  "base_url": "http://localhost:3005",
  "auth_service_url": "http://localhost:3001",
  "places_service_url": "http://localhost:3002",
  "media_service_url": "http://localhost:3003",
  "reviews_service_url": "http://localhost:3004",
  "notifications_service_url": "http://localhost:3006"
}
```

## Colección de Requests - Health Check

### 1. Health Check Completo de Todos los Microservicios
```
GET {{base_url}}/health
```

**Descripción:** Verifica el estado de salud de todos los microservicios del sistema.

**Tests (Postman):**
```javascript
// Verificar que la respuesta es exitosa
pm.test("Status code is 200, 207, or 503", function () {
    pm.expect(pm.response.code).to.be.oneOf([200, 207, 503]);
});

// Verificar estructura de respuesta
pm.test("Response has correct structure", function () {
    const response = pm.response.json();
    pm.expect(response.success).to.be.true;
    pm.expect(response.data.overall).to.exist;
    pm.expect(response.data.services).to.be.an('array');
});

// Verificar información general
pm.test("Overall status is valid", function () {
    const response = pm.response.json();
    pm.expect(response.data.overall.status).to.be.oneOf(['healthy', 'degraded', 'unhealthy']);
    pm.expect(response.data.overall.onlineServices).to.be.a('number');
    pm.expect(response.data.overall.totalServices).to.be.a('number');
});

// Verificar cada servicio
pm.test("Each service has required fields", function () {
    const response = pm.response.json();
    response.data.services.forEach(service => {
        pm.expect(service.service).to.exist;
        pm.expect(service.url).to.exist;
        pm.expect(service.port).to.exist;
        pm.expect(service.status).to.be.oneOf(['online', 'offline']);
        pm.expect(service.timestamp).to.exist;
    });
});

// Mostrar resumen en consola
pm.test("Log health summary", function () {
    const response = pm.response.json();
    console.log(`Overall Status: ${response.data.overall.status.toUpperCase()}`);
    console.log(`Online Services: ${response.data.overall.onlineServices}/${response.data.overall.totalServices}`);
    response.data.services.forEach(service => {
        console.log(`${service.service}: ${service.status.toUpperCase()}`);
    });
});
```

**Respuesta Esperada (200 - Healthy):**
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
      },
      {
        "service": "Media Upload Service",
        "url": "http://localhost:3003",
        "port": 3003,
        "status": "online",
        "responseTime": "28ms",
        "statusCode": 200,
        "timestamp": "2024-01-XXT10:30:00.000Z",
        "data": {
          "success": true,
          "message": "Media Upload Microservice - Esmeraldas Turismo"
        }
      },
      {
        "service": "Reviews Service",
        "url": "http://localhost:3004",
        "port": 3004,
        "status": "online",
        "responseTime": "35ms",
        "statusCode": 200,
        "timestamp": "2024-01-XXT10:30:00.000Z",
        "data": {
          "success": true,
          "message": "Reviews Microservice - Esmeraldas Turismo"
        }
      },
      {
        "service": "Notifications Service",
        "url": "http://localhost:3006",
        "port": 3006,
        "status": "online",
        "responseTime": "40ms",
        "statusCode": 200,
        "timestamp": "2024-01-XXT10:30:00.000Z",
        "data": {
          "success": true,
          "message": "Notifications Microservice - Esmeraldas Turismo"
        }
      }
    ]
  }
}
```

### 2. Health Check Simplificado
```
GET {{base_url}}/health/simple
```

**Descripción:** Versión simplificada del health check para monitoreo rápido.

**Tests (Postman):**
```javascript
// Verificar código de estado
pm.test("Status code is 200, 207, or 503", function () {
    pm.expect(pm.response.code).to.be.oneOf([200, 207, 503]);
});

// Verificar estructura simplificada
pm.test("Simple response structure", function () {
    const response = pm.response.json();
    pm.expect(response.status).to.be.oneOf(['healthy', 'degraded', 'unhealthy']);
    pm.expect(response.online).to.be.a('number');
    pm.expect(response.total).to.be.a('number');
    pm.expect(response.timestamp).to.exist;
    pm.expect(response.services).to.be.an('array');
});

// Verificar consistencia de datos
pm.test("Data consistency", function () {
    const response = pm.response.json();
    pm.expect(response.online).to.be.at.most(response.total);
    pm.expect(response.services.length).to.equal(response.total);
});
```

**Respuesta Esperada:**
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

### 3. Health Check de Servicio Específico - Auth
```
GET {{base_url}}/health/auth
```

**Descripción:** Verifica el estado de salud del servicio de autenticación.

**Tests (Postman):**
```javascript
// Verificar código de estado
pm.test("Status code is 200 or 503", function () {
    pm.expect(pm.response.code).to.be.oneOf([200, 503]);
});

// Verificar datos del servicio
pm.test("Service data validation", function () {
    const response = pm.response.json();
    pm.expect(response.data.service).to.equal('Auth Service');
    pm.expect(response.data.url).to.equal(pm.environment.get('auth_service_url'));
    pm.expect(response.data.port).to.equal(3001);
    pm.expect(response.data.status).to.be.oneOf(['online', 'offline']);
    pm.expect(response.data.timestamp).to.exist;
});

// Si está online, verificar tiempo de respuesta
pm.test("Response time if online", function () {
    const response = pm.response.json();
    if (response.data.status === 'online') {
        pm.expect(response.data.responseTime).to.exist;
        pm.expect(response.data.statusCode).to.equal(200);
    }
});
```

**Respuesta Esperada (200):**
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

### 4. Health Check de Servicio Específico - Places
```
GET {{base_url}}/health/places
```

**Descripción:** Verifica el estado de salud del servicio de lugares.

**Tests (Postman):**
```javascript
// Verificar código de estado
pm.test("Status code is 200 or 503", function () {
    pm.expect(pm.response.code).to.be.oneOf([200, 503]);
});

// Verificar datos del servicio
pm.test("Service data validation", function () {
    const response = pm.response.json();
    pm.expect(response.data.service).to.equal('Places Service');
    pm.expect(response.data.url).to.equal(pm.environment.get('places_service_url'));
    pm.expect(response.data.port).to.equal(3002);
    pm.expect(response.data.status).to.be.oneOf(['online', 'offline']);
});
```

### 5. Health Check de Servicio Específico - Media
```
GET {{base_url}}/health/media
```

**Descripción:** Verifica el estado de salud del servicio de media upload.

**Tests (Postman):**
```javascript
// Verificar código de estado
pm.test("Status code is 200 or 503", function () {
    pm.expect(pm.response.code).to.be.oneOf([200, 503]);
});

// Verificar datos del servicio
pm.test("Service data validation", function () {
    const response = pm.response.json();
    pm.expect(response.data.service).to.equal('Media Upload Service');
    pm.expect(response.data.url).to.equal(pm.environment.get('media_service_url'));
    pm.expect(response.data.port).to.equal(3003);
    pm.expect(response.data.status).to.be.oneOf(['online', 'offline']);
});
```

### 6. Health Check de Servicio Específico - Reviews
```
GET {{base_url}}/health/reviews
```

**Descripción:** Verifica el estado de salud del servicio de reseñas.

**Tests (Postman):**
```javascript
// Verificar código de estado
pm.test("Status code is 200 or 503", function () {
    pm.expect(pm.response.code).to.be.oneOf([200, 503]);
});

// Verificar datos del servicio
pm.test("Service data validation", function () {
    const response = pm.response.json();
    pm.expect(response.data.service).to.equal('Reviews Service');
    pm.expect(response.data.url).to.equal(pm.environment.get('reviews_service_url'));
    pm.expect(response.data.port).to.equal(3004);
    pm.expect(response.data.status).to.be.oneOf(['online', 'offline']);
});
```

### 7. Health Check de Servicio Específico - Notifications
```
GET {{base_url}}/health/notifications
```

**Descripción:** Verifica el estado de salud del servicio de notificaciones.

**Tests (Postman):**
```javascript
// Verificar código de estado
pm.test("Status code is 200 or 503", function () {
    pm.expect(pm.response.code).to.be.oneOf([200, 503]);
});

// Verificar datos del servicio
pm.test("Service data validation", function () {
    const response = pm.response.json();
    pm.expect(response.data.service).to.equal('Notifications Service');
    pm.expect(response.data.url).to.equal(pm.environment.get('notifications_service_url'));
    pm.expect(response.data.port).to.equal(3006);
    pm.expect(response.data.status).to.be.oneOf(['online', 'offline']);
});
```

### 8. Health Check de Servicio Inexistente
```
GET {{base_url}}/health/inexistente
```

**Descripción:** Prueba el manejo de errores para servicios no configurados.

**Tests (Postman):**
```javascript
// Verificar código de error
pm.test("Status code is 400", function () {
    pm.expect(pm.response.code).to.equal(400);
});

// Verificar mensaje de error
pm.test("Error message validation", function () {
    const response = pm.response.json();
    pm.expect(response.success).to.be.false;
    pm.expect(response.message).to.include('Servicio no encontrado');
});
```

**Respuesta Esperada (400):**
```json
{
  "success": false,
  "message": "Error al verificar el estado de salud del servicio",
  "error": "Servicio no encontrado: inexistente"
}
```

## Tests de Integración

### Test 1: Verificar Todos los Servicios
```javascript
// En el request de health check completo
pm.test("All services are online", function () {
    const response = pm.response.json();
    const onlineServices = response.data.services.filter(s => s.status === 'online').length;
    const totalServices = response.data.services.length;
    
    if (onlineServices === totalServices) {
        console.log('✅ Todos los servicios están online');
    } else {
        console.log(`⚠️ ${totalServices - onlineServices} servicios están offline`);
    }
    
    pm.expect(onlineServices).to.be.at.least(1); // Al menos un servicio debe estar online
});
```

### Test 2: Verificar Tiempos de Respuesta
```javascript
// Verificar que los tiempos de respuesta son razonables
pm.test("Response times are reasonable", function () {
    const response = pm.response.json();
    response.data.services.forEach(service => {
        if (service.status === 'online') {
            const responseTimeMs = parseInt(service.responseTime);
            pm.expect(responseTimeMs).to.be.lessThan(5000); // Menos de 5 segundos
        }
    });
});
```

### Test 3: Verificar Consistencia de URLs
```javascript
// Verificar que las URLs coinciden con la configuración
pm.test("URLs match configuration", function () {
    const response = pm.response.json();
    const expectedUrls = {
        'Auth Service': pm.environment.get('auth_service_url'),
        'Places Service': pm.environment.get('places_service_url'),
        'Media Upload Service': pm.environment.get('media_service_url'),
        'Reviews Service': pm.environment.get('reviews_service_url'),
        'Notifications Service': pm.environment.get('notifications_service_url')
    };
    
    response.data.services.forEach(service => {
        if (expectedUrls[service.service]) {
            pm.expect(service.url).to.equal(expectedUrls[service.service]);
        }
    });
});
```

## Casos de Error

### Error 500 - Error Interno del Servidor
```json
{
  "success": false,
  "message": "Error al verificar el estado de salud de los servicios",
  "error": "Error details..."
}
```

### Error 404 - Ruta No Encontrada
```json
{
  "success": false,
  "message": "Ruta no encontrada"
}
```

## Monitoreo Automático

### Para Herramientas de Monitoreo
```bash
# Verificar estado general
curl -f http://localhost:3005/health/simple

# Verificar servicio específico
curl -f http://localhost:3005/health/auth

# Obtener métricas detalladas
curl http://localhost:3005/health
```

### Para Scripts de Automatización
```bash
#!/bin/bash
# Script de monitoreo básico

HEALTH_URL="http://localhost:3005/health/simple"
STATUS=$(curl -s $HEALTH_URL | jq -r '.status')

if [ "$STATUS" = "healthy" ]; then
    echo "✅ Todos los servicios están funcionando"
    exit 0
elif [ "$STATUS" = "degraded" ]; then
    echo "⚠️ Algunos servicios están offline"
    exit 1
else
    echo "❌ Sistema no saludable"
    exit 2
fi
```

## Notas Importantes

1. **Timeout**: Cada servicio tiene un timeout de 5 segundos
2. **Concurrencia**: Los health checks se ejecutan en paralelo
3. **Códigos de Estado**: 200 (healthy), 207 (degraded), 503 (unhealthy)
4. **Monitoreo**: Usar `/health/simple` para verificaciones rápidas
5. **Debugging**: Usar `/health` para información detallada
6. **Alertas**: Configurar alertas basadas en códigos de estado HTTP 