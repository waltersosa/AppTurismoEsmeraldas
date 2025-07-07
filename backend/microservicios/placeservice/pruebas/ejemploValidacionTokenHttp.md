# Ejemplo base: Validación de token JWT vía HTTP en microservicios

## ¿Para qué sirve?
Centraliza la validación de autenticación en el microservicio de autenticación (`authservice`). Todos los microservicios deben consultar a `/auth/validate` para validar tokens y obtener datos del usuario.

---

## Middleware de ejemplo (Node.js/Express)

```js
import axios from 'axios';

export const autenticarTokenPorHttp = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de acceso requerido' });
  }
  const token = authHeader.split(' ')[1];

  try {
    // Cambia la URL si tu authservice está en otro host/puerto
    const response = await axios.get('http://localhost:3001/auth/validate', {
      headers: { Authorization: `Bearer ${token}` }
    });
    req.usuario = response.data.usuario;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado (validado por authservice)' });
  }
};
```

---

## Uso en rutas protegidas

```js
import { autenticarTokenPorHttp } from '../middlewares/authHttpMiddleware.js';

router.post('/recurso-protegido', autenticarTokenPorHttp, (req, res) => {
  // req.usuario contiene los datos del usuario autenticado
  res.json({ message: 'Acceso permitido', usuario: req.usuario });
});
```

---

## Notas
- Todos los microservicios deben usar la misma clave secreta JWT (`jwtSecret: 'secretAuth'`).
- Si cambias el host o puerto del authservice, actualiza la URL en el middleware.
- Si el usuario es deshabilitado o el token es revocado, el authservice lo detectará y los demás microservicios lo rechazarán automáticamente.

---

**Reutiliza este ejemplo en todos los microservicios que requieran autenticación.** 