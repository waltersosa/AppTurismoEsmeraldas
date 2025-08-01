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

## Nueva funcionalidad: Reportar Incidencia

- Se ha añadido una nueva página llamada **Reportar Incidencia** en el frontend móvil.
- Puedes acceder a esta página desde el botón 'Reportar Incidencia' en la pantalla de Emergencias.
- Actualmente, todos los campos y botones de la página muestran el mensaje **'Próximamente'** y están deshabilitados, indicando que la funcionalidad estará disponible en el futuro.
- El diseño de la página es moderno y está completamente en español.
- El botón de regresar en la página de reporte te lleva de vuelta a la pantalla de Emergencias.

## Nueva funcionalidad: Portada de Bienvenida

- Ahora la app muestra una **pantalla de portada** al inicio, antes del login.
- La portada utiliza la imagen `src/assets/Portada.jpg` y cubre toda la pantalla.
- En la parte inferior hay un botón grande que dice **'Bienvenidos a Esmeraldas'**.
- Al pulsar el botón, se navega directamente a la pantalla de login.
- Esta portada es la ruta inicial (`'/'`) de la app móvil y ofrece una experiencia visual atractiva para los usuarios.

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
- `src/app/pages/emergencias` — Emergencias y acceso a reporte de incidencia
- `src/app/pages/reportar-incidencia` — Página de reporte de incidencia (Próximamente)
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
3. Abre [http://localhost:4300](http://localhost:4300) en tu navegador.

## Notas
- La app requiere que los microservicios de backend estén corriendo y configurados en el archivo de entorno correspondiente.
- El diseño y las funcionalidades pueden ampliarse según nuevas necesidades.
- Si ves el mensaje de error relacionado con la importación de la página de reporte, asegúrate de reiniciar el servidor de desarrollo para que Angular detecte los nuevos archivos.

---
Desarrollado para Esmeraldas Turismo 🏖️

## ¿Tienes problemas al ejecutar el backoffice?
 # Suelen haber problemas con el tema del caché del backoffice, así que si los tienes, ejecuta los siguientes comandos
```bash
cd backoffice-admin
 rm -rf ./node_modules/.vite
 rm -rf .angular/cache
 rm -rf node_modules
 ```