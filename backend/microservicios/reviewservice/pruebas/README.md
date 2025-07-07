# Pruebas del Microservicio de Reviews

## 📋 Descripción
Esta carpeta contiene scripts de prueba para verificar el funcionamiento del microservicio de reviews y su integración con otros microservicios.

## 🚀 Cómo ejecutar las pruebas

### 1. Instalar dependencias
```bash
npm install
```

### 2. Verificar estado de todos los microservicios
```bash
npm run check-services
```
Este comando verifica:
- Health check de todos los microservicios
- Validación de tokens en el servicio de auth
- Comunicación entre microservicios

### 3. Probar autenticación específicamente
```bash
npm run test-auth
```
Este comando prueba:
- Validación directa con el microservicio de auth
- Endpoints protegidos del microservicio de reviews
- Creación de reseñas con token válido

### 4. Ejecutar pruebas completas
```bash
npm run test
```
Este comando ejecuta todas las pruebas del microservicio.

## 🔧 Configuración

### Token de prueba
El token utilizado en las pruebas es:
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODZiMDkxMTE3ZmZkMTFjNzFiZDg2MTkiLCJyb2wiOiJ1c3VhcmlvIiwiaWF0IjoxNzUxODQ1MTUwLCJleHAiOjE3NTE4NTIzNTB9.lP3RHydX4_se4m5ORfjOEu35rW9frT7qeTi33XKF1-Y
```

### URLs de los microservicios
- **Auth Service:** http://localhost:3001
- **Places Service:** http://localhost:3002
- **Media Service:** http://localhost:3003
- **Reviews Service:** http://localhost:3004

## 🐛 Troubleshooting

### Error: "Request failed with status code 404"
- Verifica que el microservicio de auth esté corriendo en el puerto 3001
- Verifica que el endpoint `/auth/validate` exista en el microservicio de auth

### Error: "Token inválido"
- Verifica que la clave JWT_SECRET sea igual en todos los microservicios
- Verifica que el token no haya expirado

### Error: "Lugar no encontrado"
- Verifica que el microservicio de places esté corriendo en el puerto 3002
- Verifica que el ID del lugar sea válido

## 📝 Notas
- Los scripts usan el token proporcionado para las pruebas
- Se incluyen IDs de ejemplo para lugares (pueden no existir en la base de datos)
- Los errores se muestran de forma detallada para facilitar el debugging 