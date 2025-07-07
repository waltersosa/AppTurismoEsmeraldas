# Migración del BackOffice a Microservicios

## Resumen de Cambios

El BackOffice ha sido actualizado para conectarse a los microservicios en lugar del backend monolítico anterior. Todos los componentes ahora utilizan la nueva arquitectura de microservicios.

## Configuración Actualizada

### Archivo de Configuración Principal
`src/app/config/api.config.ts`

#### Nuevas Configuraciones de Microservicios
```typescript
export const MICROSERVICES_CONFIG = {
  AUTH_SERVICE: {
    BASE_URL: 'http://localhost:3001',
    ENDPOINTS: { /* ... */ }
  },
  PLACES_SERVICE: {
    BASE_URL: 'http://localhost:3002',
    ENDPOINTS: { /* ... */ }
  },
  MEDIA_SERVICE: {
    BASE_URL: 'http://localhost:3003',
    ENDPOINTS: { /* ... */ }
  },
  REVIEWS_SERVICE: {
    BASE_URL: 'http://localhost:3004',
    ENDPOINTS: { /* ... */ }
  },
  NOTIFICATIONS_SERVICE: {
    BASE_URL: 'http://localhost:3006',
    ENDPOINTS: { /* ... */ }
  },
  STATS_SERVICE: {
    BASE_URL: 'http://localhost:3005',
    ENDPOINTS: { /* ... */ }
  }
};
```

#### Funciones de Utilidad
- `getMicroserviceUrl()`: Obtiene URL de microservicio específico
- `getServiceEndpoint()`: Obtiene endpoint específico con parámetros
- `getAuthServiceUrl()`, `getPlacesServiceUrl()`, etc.: Funciones específicas por servicio

## Servicios Actualizados

### 1. AuthService (`src/app/auth/auth.service.ts`)
**Cambios:**
- Usa `getAuthServiceUrl()` en lugar de `getApiUrl()`
- Conecta al microservicio de Auth (puerto 3001)
- Agregados métodos para gestión de usuarios

**Endpoints utilizados:**
- `/auth/login` - Autenticación
- `/auth/register` - Registro
- `/auth/validate` - Validación de token
- `/auth/users` - Gestión de usuarios
- `/auth/users/count` - Conteo de usuarios

### 2. PlaceComponent (`src/app/dashboard/place/place.component.ts`)
**Cambios:**
- Usa `getPlacesServiceUrl()` en lugar de `getApiUrl()`
- Conecta al microservicio de Places (puerto 3002)
- Manejo de errores mejorado

**Endpoints utilizados:**
- `GET /places` - Listar lugares
- `POST /places` - Crear lugar
- `PUT /places/:id` - Actualizar lugar
- `PATCH /places/:id/status` - Cambiar estado

### 3. StatsService (`src/app/services/stats.service.ts`)
**Nuevo servicio creado:**
- Maneja estadísticas y health check
- Conecta al microservicio de Stats (puerto 3005)
- Proporciona métodos para monitoreo del sistema

**Endpoints utilizados:**
- `/stats/overview` - Estadísticas generales
- `/health` - Health check completo
- `/health/simple` - Health check simplificado
- `/health/:serviceName` - Health check de servicio específico

### 4. HomeComponent (`src/app/dashboard/home/home.component.ts`)
**Cambios:**
- Integra health check del sistema
- Usa StatsService para estadísticas
- Muestra estado de todos los microservicios
- Carga datos en paralelo para mejor rendimiento

## Nuevas Funcionalidades

### Health Check del Sistema
El dashboard principal ahora muestra:
- Estado general del sistema (healthy/degraded/unhealthy)
- Número de servicios online/total
- Indicador visual del estado
- Actualización en tiempo real

### Estadísticas Mejoradas
- Estadísticas obtenidas del microservicio de Stats
- Conteo de usuarios, lugares, reseñas e imágenes
- Datos más precisos y actualizados

### Gestión de Errores
- Manejo específico de errores por microservicio
- Mensajes de error más descriptivos
- Fallback graceful cuando un servicio está offline

## Compatibilidad

### Configuración Legacy
Se mantiene la configuración legacy temporalmente:
```typescript
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3001', // Auth Service como base
  // ... endpoints legacy
};
```

### Función Legacy
```typescript
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};
```

## Puertos de Microservicios

| Microservicio | Puerto | URL |
|---------------|--------|-----|
| Auth Service | 3001 | http://localhost:3001 |
| Places Service | 3002 | http://localhost:3002 |
| Media Upload Service | 3003 | http://localhost:3003 |
| Reviews Service | 3004 | http://localhost:3004 |
| Stats Service | 3005 | http://localhost:3005 |
| Notifications Service | 3006 | http://localhost:3006 |

## Beneficios de la Migración

### 1. Escalabilidad
- Cada microservicio puede escalar independientemente
- Mejor distribución de carga
- Fácil agregar nuevos servicios

### 2. Mantenibilidad
- Código más modular y organizado
- Responsabilidades claramente separadas
- Fácil debugging y testing

### 3. Resiliencia
- Fallo de un servicio no afecta otros
- Health check en tiempo real
- Mejor manejo de errores

### 4. Performance
- Respuestas más rápidas
- Carga paralela de datos
- Optimización por servicio

## Próximos Pasos

### 1. Migración de Componentes Restantes
- Actualizar componentes de reseñas
- Migrar gestión de usuarios
- Integrar notificaciones

### 2. Optimizaciones
- Implementar cache de datos
- Agregar retry logic
- Mejorar manejo de errores

### 3. Monitoreo
- Dashboard de monitoreo avanzado
- Alertas automáticas
- Métricas de performance

## Comandos de Desarrollo

### Iniciar BackOffice
```bash
cd BackOffice/backoffice-admin
npm install
ng serve
```

### Verificar Microservicios
```bash
# Verificar que todos los microservicios estén corriendo
curl http://localhost:3005/health/simple
```

### Testing
```bash
# Ejecutar tests del BackOffice
ng test

# Verificar conectividad con microservicios
node test-health-check.js
```

## Troubleshooting

### Error de Conexión
Si el BackOffice no puede conectarse a los microservicios:
1. Verificar que todos los microservicios estén corriendo
2. Comprobar puertos en `api.config.ts`
3. Verificar firewall/red

### Error de CORS
Si hay errores de CORS:
1. Verificar configuración CORS en microservicios
2. Comprobar headers de autorización
3. Verificar configuración de proxy en Angular

### Error de Autenticación
Si hay problemas de autenticación:
1. Verificar token JWT
2. Comprobar configuración de Auth Service
3. Verificar roles y permisos

## Notas Importantes

1. **Tokens JWT**: Los tokens siguen siendo válidos entre microservicios
2. **CORS**: Todos los microservicios deben tener CORS configurado
3. **Timeouts**: Configurar timeouts apropiados para cada servicio
4. **Logs**: Monitorear logs de cada microservicio para debugging
5. **Backup**: Mantener backup de la configuración anterior 