# BackOffice Admin - Esmeraldas Turismo

## Descripción

Este BackOffice es la plataforma administrativa del sistema "Esmeraldas Turismo". Permite la gestión y monitoreo de la plataforma turística, diseñado exclusivamente para usuarios con el rol **GAD** (Gobierno Autónomo Descentralizado).

## 🚀 Funcionalidades principales

- **Autenticación segura**: Solo usuarios GAD pueden acceder.
- **Dashboard con métricas en tiempo real**: Usuarios, lugares, reseñas y actividades recientes.
- **Gestión de usuarios**: Alta, baja, edición, activación/desactivación y búsqueda.
- **Gestión de lugares turísticos**: CRUD completo, subida de imágenes y categorización.
- **Gestión de reseñas**: Moderación, filtrado y acciones masivas.
- **Panel de monitoreo de servicios**:
  - Visualización en tiempo real del estado de los microservicios.
  - Control individual: activar, detener o reiniciar cada servicio desde la interfaz.
  - Control masivo: activar o detener todos los servicios (excepto autenticación y estadísticas) con un solo clic.
  - Feedback visual y actualización automática del estado.
- **Historial de actividades**: Registro de todas las acciones administrativas.
- **Interfaz moderna y responsiva**: Basada en Angular Material.

## 🛠️ Instalación y ejecución

1. **Instala las dependencias:**
   ```bash
   npm install
   ```

2. **Inicia el servidor de desarrollo:**
   ```bash
   ng serve --port 4300
   ```

3. **Accede a la aplicación:**
   - Abre tu navegador en [http://localhost:4300](http://localhost:4300)

## ⚙️ Integración y monitoreo de servicios

- El panel de servicios muestra el estado real de los microservicios del sistema.
- Puedes activar, detener o reiniciar servicios desde la interfaz (según permisos y configuración del entorno).
- Los botones "Activar todos" y "Detener todos" permiten el control masivo, excluyendo siempre los servicios críticos (autenticación y estadísticas).
- El estado de los servicios se actualiza automáticamente cada 30 segundos.
- Si un servicio no responde, se mostrará como "detenido" o "error" en la tabla.

## 👤 Acceso

- **Usuario GAD de ejemplo:**
  - Usuario: `gad@gmail.com`
  - Contraseña: `Admin123`

## 📦 Estructura del proyecto

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

## 📝 Notas

- Este proyecto es solo el **frontend** administrativo. La integración con los microservicios y el backend debe estar correctamente configurada en el entorno de desarrollo o producción.
- Si tienes problemas con el monitoreo de servicios, asegúrate de que los endpoints de estado estén disponibles y configurados en el archivo de entorno correspondiente.
- Para más información sobre la arquitectura completa, consulta la documentación del proyecto principal.

---
**Desarrollado para Esmeraldas Turismo** 🏖️
