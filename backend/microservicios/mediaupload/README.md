# Microservicio de Archivos Multimedia (mediaupload)

## Descripción
Gestiona la subida, consulta, eliminación y almacenamiento de imágenes asociadas a lugares turísticos para Esmeraldas Turismo.

## Endpoints principales
- `GET /` — Estado del servicio
- `POST /media/upload` — Subir una o varias imágenes (campo `imagenes`, solo admins GAD, requiere token)
- `GET /media/file/:filename` — Obtener/descargar imagen por nombre de archivo
- `GET /media/place/:placeId` — Listar imágenes asociadas a un lugar
- `DELETE /media/:mediaId` — Eliminar imagen por ID

## Subida y almacenamiento de imágenes
- **Solo usuarios con rol GAD (admin) pueden subir imágenes.**
- Las imágenes se suben mediante el endpoint `POST /media/upload` usando el campo `imagenes` (form-data, permite múltiples archivos).
- **Solo se permite un campo `type` por petición. Si envías varios, se producirá un error. Todas las imágenes subidas tendrán el mismo tipo.**
- Debes enviar el header `Authorization: Bearer <token-GAD>`.
- Las imágenes se guardan en la carpeta `uploads` dentro del microservicio. Si la carpeta no existe, se crea automáticamente.
- Las imágenes subidas pueden ser accedidas vía URL: `http://localhost:3003/uploads/<nombre_archivo>`
- Cada imagen queda registrada en la base de datos con referencia opcional a un lugar (`placeId`).

## Variables de entorno / Configuración
- `PORT`: Puerto en el que corre el microservicio (por defecto: 3003)
- `MONGO_URI`: URI de conexión a MongoDB (por defecto: mongodb://localhost:27017/mediaDB)
- `JWT_SECRET`: Clave secreta para validación de tokens JWT (debe ser igual en todos los microservicios, ej: `secretAuth`)

## Ejecución local
```bash
npm install
node index.js
```

## Dependencias principales
- express
- mongoose
- multer
- dotenv

## Arquitectura
- Basado en Node.js + Express
- Estructura modular: controllers, models, middlewares, routes, config
- MongoDB como base de datos
- Subida y gestión de imágenes en carpeta local

## Pruebas
- Puedes usar herramientas como Postman para probar la subida y consulta de imágenes.
- Ejemplo de subida:
  - Endpoint: `POST /media/upload`
  - Body: form-data, clave `imagenes` (tipo archivo, permite múltiples)
  - Header: `Authorization: Bearer <token-GAD>`
  - **Solo un campo `type` por petición.**
  - Respuesta: JSON con información de los archivos subidos

## Despliegue en producción
- Configura las variables de entorno en el servidor de producción.
- Usa un proceso manager como PM2 o Docker para mantener el servicio activo.
- Asegúrate de que la base de datos MongoDB esté accesible desde el entorno de producción.
- **Importante:** Si usas almacenamiento local para imágenes, respalda la carpeta `uploads` y considera almacenamiento externo en producción.

## Troubleshooting
- **Error de conexión a MongoDB:** Verifica la URI y que el servicio de MongoDB esté activo.
- **Imágenes no accesibles:** Verifica que la carpeta `uploads` exista y que el endpoint `/uploads` esté sirviendo archivos estáticos.

## Contacto
- Equipo de desarrollo: turismo@esmeraldas.gob.ec
- Documentación oficial: [Enlace a la wiki o documentación interna]

---

**Desarrollado para Esmeraldas Turismo** 