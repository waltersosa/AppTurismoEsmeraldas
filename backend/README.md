# Backend - AppTurismoEsmeraldas

## Arquitectura General

El backend de AppTurismoEsmeraldas está basado en una arquitectura de microservicios, cada uno encargado de una funcionalidad específica y comunicándose entre sí principalmente a través de HTTP y JWT. Puedes visualizar la arquitectura general y la composición de los microservicios en las siguientes imágenes ubicadas en la carpeta `arquitectura/`:

- ![Arquitectura General](arquitectura/aquitectura-turismo-esmeraldas.jpg)
- ![Arquitectura Microservicios](arquitectura/arquitectura-microservicios.jpg)

---

## Microservicios

### 1. AuthService (Autenticación)
- **Ruta:** `microservicios/authservice/`
- **Descripción:** Gestiona el registro, login, validación de tokens, perfiles de usuario y administración de usuarios (incluyendo roles como GAD y propietario).
- **Ejecución:**  
  ```bash
  npm install
  node index.js
  ```
- **Pruebas Postman:** [postmanAuth.md](microservicios/authservice/postmanAuth.md)
- **Scripts útiles:**  
  - `scripts/create-users.js`: Crea usuarios de ejemplo en la base de datos.
- **Endpoints principales:** Registro, login, validación de token, gestión de usuarios y actividades administrativas.
- **Base de datos:** `authDB`
- **Puerto por defecto:** 3001

---

### 2. PlaceService (Lugares)
- **Ruta:** `microservicios/placeservice/`
- **Descripción:** CRUD de lugares turísticos, filtrado, paginación, gestión de estados y asociación de imágenes.
- **Ejecución:**  
  ```bash
  npm install
  node index.js
  ```
- **Pruebas Postman:** [postmanPlace.md](microservicios/placeservice/postmanPlace.md)
- **Scripts útiles:**  
  - `scripts/create-real-places.js`: Inserta lugares reales de ejemplo.
  - `scripts/migrate-ownerId.js`: Migra el campo ownerId en los lugares existentes.
- **Endpoints principales:** Listar, crear, actualizar, eliminar y cambiar estado de lugares.
- **Base de datos:** `placesDB`
- **Puerto por defecto:** 3002

---

### 3. MediaUploadService (Archivos Multimedia)
- **Ruta:** `microservicios/mediaupload/`
- **Descripción:** Subida, consulta y eliminación de imágenes asociadas a lugares turísticos.
- **Ejecución:**  
  ```bash
  npm install
  node index.js
  ```
- **Pruebas Postman:** [postmanMedia.md](microservicios/mediaupload/postmanMedia.md)
- **Carpeta de almacenamiento:** `uploads/`
- **Endpoints principales:** Subida de imágenes (solo admins GAD), consulta y eliminación.
- **Base de datos:** `mediaDB`
- **Puerto por defecto:** 3003

---

### 4. ReviewService (Reseñas)
- **Ruta:** `microservicios/reviewservice/`
- **Descripción:** Gestión de reseñas y calificaciones de lugares turísticos. Permite a usuarios crear reseñas y a administradores GAD moderarlas.
- **Ejecución:**  
  ```bash
  npm install
  node index.js
  ```
- **Pruebas Postman:** [postmanReviews.md](microservicios/reviewservice/postmanReviews.md)
- **Scripts útiles:**  
  - `pruebas/test-review.js`: Script de pruebas automáticas de endpoints de reseñas.
- **Endpoints principales:** Crear, listar, moderar y eliminar reseñas.
- **Base de datos:** `reviewsDB`
- **Puerto por defecto:** 3004

---

### 5. NotificationsService (Notificaciones)
- **Ruta:** `microservicios/notificationsservice/`
- **Descripción:** Envía y gestiona notificaciones para los usuarios (por ejemplo, avisos de nuevas reseñas, alertas, etc.).
- **Ejecución:**  
  ```bash
  npm install
  node index.js
  ```
- **Endpoints principales:**
  - `POST /notifications/`: Crear notificación.
  - `GET /notifications/user/:userId`: Listar notificaciones de un usuario.
  - `GET /notifications/:id`: Obtener detalle de una notificación.
  - `PATCH /notifications/:id/read`: Marcar como leída.
  - `DELETE /notifications/:id`: Eliminar notificación.
  - `GET /notifications/count`: Conteo total de notificaciones.
- **Base de datos:** `notificationsDB`
- **Puerto por defecto:** 3006

---

### 6. StatService (Estadísticas y Health Check)
- **Ruta:** `microservicios/statservice/`
- **Descripción:** Proporciona estadísticas globales del sistema y monitorea el estado de todos los microservicios.
- **Ejecución:**  
  ```bash
  npm install
  node index.js
  ```
- **Pruebas Postman:** [postmanStats.md](microservicios/statservice/postmanStats.md)
- **Scripts útiles:**  
  - `test-health-check.js`: Script para probar el estado de todos los microservicios.
- **Endpoints principales:**  
  - `/stats/overview`: Estadísticas globales.
  - `/health`: Estado detallado de todos los microservicios.
  - `/health/simple`: Estado simplificado para monitoreo.
  - `/health/:serviceName`: Estado de un microservicio específico.
- **Base de datos:** *No utiliza base de datos propia, solo consulta a los otros microservicios.*
- **Puerto por defecto:** 3005

---

## Scripts de Utilidad

- **start-all-services.ps1**  
  Script en PowerShell para iniciar todos los microservicios automáticamente y gestionarlos con PM2.  
  ```powershell
  ./start-all-services.ps1
  ```
  Este script detiene y elimina cualquier proceso previo gestionado por PM2, instala dependencias y ejecuta cada microservicio en su propio proceso bajo PM2.  
  **Ventaja:** Si usas este script, podrás detener, reiniciar y monitorear los microservicios desde el dashboard o con comandos PM2 sin problemas.

- **start-microservices.js**  
  Script en Node.js para iniciar los microservicios.  
  ```bash
  node start-microservices.js
  ```
  **Limitación:** Si usas este script, los microservicios NO serán gestionados por PM2, por lo que no podrás detenerlos ni reiniciarlos desde el dashboard ni con PM2. Solo se recomienda para pruebas rápidas o desarrollo local simple.

---

## Pruebas y Colecciones Postman

Cada microservicio cuenta con un archivo `.md` con ejemplos de pruebas y endpoints para ser usados en Postman:

- **AuthService:** [postmanAuth.md](microservicios/authservice/postmanAuth.md)
- **PlaceService:** [postmanPlace.md](microservicios/placeservice/postmanPlace.md)
- **MediaUploadService:** [postmanMedia.md](microservicios/mediaupload/postmanMedia.md)
- **ReviewService:** [postmanReviews.md](microservicios/reviewservice/postmanReviews.md)
- **StatService:** [postmanStats.md](microservicios/statservice/postmanStats.md)

---

## Recomendaciones Generales

- Asegúrate de tener MongoDB corriendo localmente o en la nube.
- Configura las variables de entorno necesarias en cada microservicio (puerto, URI de MongoDB, JWT_SECRET, etc.).
- Usa los scripts de ejemplo para poblar la base de datos y probar funcionalidades.
- Consulta las imágenes de arquitectura para entender la relación y flujo entre los microservicios.

---

**Desarrollado para Esmeraldas Turismo**  
