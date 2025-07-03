# BackOffice Esmeraldas Turismo

## Descripción

Este BackOffice es la plataforma administrativa del sistema "Esmeraldas Turismo". Permite la gestión y administración de la plataforma turística, y está diseñado exclusivamente para usuarios con el rol **GAD** (Gobierno Autónomo Descentralizado). El acceso está restringido a este tipo de usuario por motivos de seguridad y control institucional.

## Funcionalidades actuales

- **Login seguro**: Solo usuarios con rol `gad` pueden acceder al panel.
- **Protección de rutas**: El sistema impide el acceso a cualquier usuario que no sea GAD.
- **Panel de administración moderno**: Interfaz profesional y oscura, construida con Angular Material.
- **Dashboard de bienvenida**: Muestra estadísticas simuladas, acciones rápidas y actividad reciente.
- **Gestión de sesión**: Manejo de token JWT, almacenamiento seguro en localStorage y cierre de sesión.
- **Validación de permisos**: El sistema verifica el rol del usuario antes de permitir el acceso al BackOffice.

## Estructura del proyecto

```
BackOffice/
  backoffice-admin/
    src/
      app/
        auth/           # Módulo de autenticación (login, guard, servicio)
        dashboard/      # Componentes del dashboard principal
        ...
      styles.scss       # Estilos globales
    ...
  README.md            # Este archivo
```

## Requisitos

- Node.js >= 18
- Angular >= 17
- Backend corriendo en `http://localhost:3001` (ver carpeta `/backend`)

## Instalación y uso

1. Instala las dependencias:
   ```bash
   cd BackOffice/backoffice-admin
   npm install
   ```

2. Inicia el servidor de desarrollo:
   ```bash
   ng serve --port 4200
   ```

3. Accede al BackOffice en:
   [http://localhost:4200](http://localhost:4200)

4. Inicia sesión con un usuario GAD:
   - **Correo:** `gad@gmail.com`
   - **Contraseña:** `Admin123`

> **Nota:** Si necesitas crear un usuario GAD, usa el endpoint `/auth/register` del backend o los scripts de ejemplo en la carpeta `/backend/scripts`.

## Seguridad
- Solo usuarios con rol `gad` pueden acceder al BackOffice.
- El token JWT se almacena en localStorage y se valida en cada petición.
- El guard de rutas impide el acceso a usuarios no autorizados.

## Próximos pasos sugeridos
- Implementar gestión de usuarios, destinos, reservas y reportes.
- Mejorar el dashboard con datos reales desde el backend.
- Agregar control de roles más granular si se requiere.

---

**Desarrollado para Esmeraldas Turismo** 