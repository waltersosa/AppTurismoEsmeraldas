# Esmeraldas Turismo — Sistema Modular

Esmeraldas Turismo es un sistema modular basado en microservicios para la gestión de usuarios, lugares turísticos, reseñas y archivos multimedia, pensado para gobiernos locales (GAD), propietarios y turistas. Incluye autenticación robusta, gestión de lugares, reseñas, subida de imágenes y está listo para integrarse con frontends modernos y un API Gateway.

# AppTurismoMovil

Aplicación móvil de turismo para Esmeraldas desarrollada en Angular. Permite explorar lugares turísticos, ver detalles, filtrar por categorías, consultar y agregar reseñas, y gestionar el perfil de usuario.

## Funcionalidades principales

- **Inicio de sesión y registro de usuarios**
- **Listado de lugares turísticos** con filtros por categoría
- **Detalle de lugar** con información, galería y sección de reseñas
- **Visualización y envío de reseñas** (comentarios y valoraciones)
- **Pantalla de perfil de usuario** (básica)
- **Diseño moderno y responsivo**
- **Integración con microservicios REST** para lugares y reseñas

## Scripts de carga masiva

- **Crear usuarios de ejemplo (authservice):**
  
  Ejecuta el script para poblar la base de datos con 10 usuarios de prueba:
  ```bash
  cd backend/microservicios/authservice
  node scripts/create-users.js
  ```
  El script crea usuarios con nombre, email, contraseña y rol (incluye un usuario GAD). Si el usuario ya existe, lo omite.

- **Crear lugares turísticos reales (placeservice):**
  
  Ejecuta el script para poblar la base de datos con lugares turísticos reales de Esmeraldas:
  ```bash
  cd backend/microservicios/placeservice
  node scripts/create-real-places.js
  ```
  Este script agrega lugares turísticos reales de Esmeraldas, cubriendo todas las categorías.

## Estructura de carpetas (frontend móvil)

- `src/app/pages/home` — Pantalla principal
- `src/app/pages/places` — Listado de lugares turísticos
- `src/app/pages/place-detail` — Detalle de lugar y comentarios
- `src/app/pages/login` — Inicio de sesión
- `src/app/pages/register` — Registro de usuario
- `src/app/pages/profile` — Perfil de usuario
- `src/app/services/places.service.ts` — Consumo de microservicio de lugares
- `src/app/services/reviews.service.ts` — Consumo de microservicio de reseñas

## Cómo ejecutar el frontend móvil

1. Instala dependencias:
   ```bash
   npm install
   ```
2. Ejecuta la app en modo desarrollo:
   ```bash
   ng serve
   ```
3. Abre [http://localhost:4200](http://localhost:4200) en tu navegador.

## Notas
- La app requiere que los microservicios de backend estén corriendo y configurados en el archivo de entorno correspondiente.
- El diseño y las funcionalidades pueden ampliarse según nuevas necesidades.

---
Desarrollado para la materia de Arquitectura de Software — 2024.
