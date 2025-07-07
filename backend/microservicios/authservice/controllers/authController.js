// Controlador de autenticación (base)

import authService from '../services/authService.js';

const authController = {
  register: async (req, res) => {
    try {
      const result = await authService.register(req.body);
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
      res.json({ message: 'Perfil actualizado', usuario });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  deleteProfile: async (req, res) => {
    try {
      await authService.deleteProfile(req.usuario._id);
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
      res.status(201).json({ message: 'Usuario creado por admin', user });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  disableUserByAdmin: async (req, res) => {
    try {
      await authService.disableUserByAdmin(req.params.id);
      res.json({ message: 'Usuario deshabilitado' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  enableUserByAdmin: async (req, res) => {
    try {
      await authService.enableUserByAdmin(req.params.id);
      res.json({ message: 'Usuario habilitado' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  deleteUserByAdmin: async (req, res) => {
    try {
      await authService.deleteUserByAdmin(req.params.id);
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