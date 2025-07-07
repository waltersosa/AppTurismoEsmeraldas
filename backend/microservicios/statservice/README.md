# Microservicio de Estadísticas (statservice)

## Descripción
Microservicio encargado de recopilar y exponer estadísticas globales del sistema Esmeraldas Turismo. Consulta los microservicios de usuarios, lugares, reseñas e imágenes para obtener métricas agregadas.

## Endpoints principales
- `GET /` — Estado del servicio
- `GET /stats/overview` — Resumen general de estadísticas (usuarios, lugares, reseñas, imágenes)

## Variables de entorno / Configuración
- `PORT`: Puerto en el que corre el microservicio (por defecto: 3005)
- `AUTH_SERVICE_URL`: URL del microservicio de autenticación (por defecto: http://localhost:3001)
- `PLACES_SERVICE_URL`: URL del microservicio de lugares (por defecto: http://localhost:3002)
- `MEDIA_SERVICE_URL`: URL del microservicio de imágenes (por defecto: http://localhost:3003)
- `REVIEWS_SERVICE_URL`: URL del microservicio de reseñas (por defecto: http://localhost:3004)
- `JWT_SECRET`: Clave secreta para validación de tokens JWT (debe ser igual en todos los microservicios, ej: `secretAuth`)

## Ejecución local
```bash
npm install
node index.js
```

## Dependencias principales
- express
- axios
- dotenv
- cors
- helmet
- express-rate-limit

## Arquitectura
- Basado en Node.js + Express
- Consulta otros microservicios vía HTTP (no accede a la base de datos directamente)
- Endpoints protegidos por autenticación (si se agregan endpoints sensibles)

## Ejemplo de respuesta
```json
{
  "success": true,
  "message": "Estadísticas obtenidas correctamente",
  "data": {
    "usuarios": 10,
    "lugares": 25,
    "resenas": 50,
    "imagenes": 100
  }
}
```

## Troubleshooting
- **Error de conteo en algún microservicio:** Verifica que todos los microservicios estén corriendo y expongan el endpoint `/count` correspondiente.
- **Error de conexión:** Verifica las URLs y puertos configurados en las variables de entorno.

---

**Desarrollado para Esmeraldas Turismo** 