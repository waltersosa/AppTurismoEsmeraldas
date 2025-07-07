// Controlador de autenticación (base)

import authService from '../services/authService.js';
import Activity from '../models/Activity.js';

const authController = {
  register: async (req, res) => {
    try {
      const result = await authService.register(req.body);
      // Registrar actividad
      if (req.usuario && req.usuario.rol === 'gad') {
        await Activity.create({
          usuario: req.usuario._id,
          nombreUsuario: req.usuario.nombre || req.usuario.correo || 'Admin',
          accion: 'registró un usuario',
          recurso: result?.user?.correo || '',
        });
      }
      res.status(201).json({ message: 'Usuario registrado correctamente', ...result });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  login: async (req, res) => {
    try {
      const { correo, contraseña } = req.body;
      const result = await authService.login(correo, contraseña);
      res.json({ message: 'Login exitoso', ...result });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  },
  validateToken: async (req, res) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token de acceso requerido' });
      }
      const token = authHeader.substring(7);
      const usuario = await authService.validateToken(token);
      res.json({ message: 'Token válido', usuario });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  },
  healthCheck: (req, res) => {
    res.json({
      service: 'Auth Service',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      status: 'healthy'
    });
  },
  getProfile: async (req, res) => {
    try {
      const usuario = await authService.getProfile(req.usuario._id);
      res.json({ usuario });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },
  updateProfile: async (req, res) => {
    try {
      const usuario = await authService.updateProfile(req.usuario._id, req.body);
      // Registrar actividad
      if (req.usuario && req.usuario.rol === 'gad') {
        await Activity.create({
          usuario: req.usuario._id,
          nombreUsuario: req.usuario.nombre || req.usuario.correo || 'Admin',
          accion: 'actualizó su perfil',
          recurso: usuario.correo || '',
        });
      }
      res.json({ message: 'Perfil actualizado', usuario });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  deleteProfile: async (req, res) => {
    try {
      await authService.deleteProfile(req.usuario._id);
      // Registrar actividad
      if (req.usuario && req.usuario.rol === 'gad') {
        await Activity.create({
          usuario: req.usuario._id,
          nombreUsuario: req.usuario.nombre || req.usuario.correo || 'Admin',
          accion: 'eliminó su perfil',
          recurso: req.usuario.correo || '',
        });
      }
      res.json({ message: 'Usuario eliminado correctamente' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  changePassword: async (req, res) => {
    try {
      const { contraseñaActual, nuevaContraseña } = req.body;
      await authService.changePassword(req.usuario._id, contraseñaActual, nuevaContraseña);
      res.json({ message: 'Contraseña cambiada correctamente' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  listUsers: async (req, res) => {
    try {
      const users = await authService.listUsers(req.query.search);
      res.json({ users });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  createUserByAdmin: async (req, res) => {
    try {
      const user = await authService.createUserByAdmin(req.body);
      // Registrar actividad
      if (req.usuario && req.usuario.rol === 'gad') {
        await Activity.create({
          usuario: req.usuario._id,
          nombreUsuario: req.usuario.nombre || req.usuario.correo || 'Admin',
          accion: 'creó un usuario',
          recurso: user.correo || '',
        });
      }
      res.status(201).json({ message: 'Usuario creado por admin', user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  disableUserByAdmin: async (req, res) => {
    try {
      const userToDisable = await authService.getUserById(req.params.id);
      await authService.disableUserByAdmin(req.params.id);
      if (req.usuario && req.usuario.rol === 'gad') {
        await Activity.create({
          usuario: req.usuario._id,
          nombreUsuario: req.usuario.nombre || req.usuario.correo || 'Admin',
          accion: 'deshabilitó un usuario',
          recurso: userToDisable ? `${userToDisable.nombre} (${userToDisable.email})` : 'Usuario desconocido',
        });
      }
      res.json({ message: 'Usuario deshabilitado' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  enableUserByAdmin: async (req, res) => {
    try {
      const userToEnable = await authService.getUserById(req.params.id);
      await authService.enableUserByAdmin(req.params.id);
      if (req.usuario && req.usuario.rol === 'gad') {
        await Activity.create({
          usuario: req.usuario._id,
          nombreUsuario: req.usuario.nombre || req.usuario.correo || 'Admin',
          accion: 'habilitó un usuario',
          recurso: userToEnable ? `${userToEnable.nombre} (${userToEnable.email})` : 'Usuario desconocido',
        });
      }
      res.json({ message: 'Usuario habilitado' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  deleteUserByAdmin: async (req, res) => {
    try {
      const userToDelete = await authService.getUserById(req.params.id);
      await authService.deleteUserByAdmin(req.params.id);
      if (req.usuario && req.usuario.rol === 'gad') {
        await Activity.create({
          usuario: req.usuario._id,
          nombreUsuario: req.usuario.nombre || req.usuario.correo || 'Admin',
          accion: 'eliminó un usuario',
          recurso: userToDelete ? `${userToDelete.nombre} (${userToDelete.email})` : 'Usuario desconocido',
        });
      }
      res.json({ message: 'Usuario eliminado permanentemente' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  listAdminActivities: async (req, res) => {
    try {
      const actividades = await authService.listAdminActivities();
      res.json({ actividades });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  getUsersCount: async (req, res) => {
    try {
      const count = await authService.getUsersCount();
      res.json({ count });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export default authController; 