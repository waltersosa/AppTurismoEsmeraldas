# Microservicio de Estadísticas - Esmeraldas Turismo

## 🚀 Cómo iniciar el microservicio

1. Instala las dependencias:
   ```bash
   npm install
   ```
2. Inicia el microservicio:
   ```bash
   node index.js
   ```
   El microservicio escuchará en: `http://localhost:3005`

---

## 📬 Endpoints para probar en Postman

### 1. **Estado del servicio**
- **GET** `http://localhost:3005/`

### 2. **Resumen de estadísticas**
- **GET** `http://localhost:3005/stats/overview`
- **Respuesta esperada:**
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

---

## 📝 Notas importantes
- El microservicio de stats consulta los endpoints `/count` de los microservicios de usuarios, lugares, reseñas e imágenes.
- Si algún microservicio no está disponible, el conteo correspondiente será 0.
- Puedes poblar los datos en los otros microservicios y ver reflejados los cambios en tiempo real.

---

**Desarrollado para Esmeraldas Turismo** 