// Servicio de autenticación (base)

import bcrypt from 'bcryptjs';
import jwtUtils from '../utils/jwt.js';
import userRepository from '../repositories/userRepository.js';
import config from '../config/config.js';
import User from '../models/User.js';
import Activity from '../models/Activity.js';

const authService = {
  register: async (userData) => {
    // Validar datos mínimos
    if (!userData.nombre || !userData.correo || !userData.contraseña) {
      throw new Error('Faltan datos obligatorios');
    }
    // Verificar si ya existe el usuario
    const existente = await userRepository.findByEmail(userData.correo);
    if (existente) {
      throw new Error('El correo ya está registrado');
    }
    // Hashear la contraseña
    const hash = await bcrypt.hash(userData.contraseña, 10);
    const userToSave = { 
      nombre: userData.nombre, 
      email: userData.correo, 
      password: hash, 
      rol: userData.rol || 'usuario' 
    };
    const user = await userRepository.createUser(userToSave);
    return { user: { _id: user._id, nombre: user.nombre, email: user.email, rol: user.rol, activo: user.activo } };
  },
  login: async (correo, contraseña) => {
    const user = await userRepository.findByEmail(correo);
    if (!user || !user.activo) throw new Error('Usuario o contraseña incorrectos');
    const ok = await bcrypt.compare(contraseña, user.password);
    if (!ok) throw new Error('Usuario o contraseña incorrectos');
    // Generar JWT
    const token = jwtUtils.sign({ userId: user._id, rol: user.rol }, config.jwtSecret);
    return { token, user: { _id: user._id, nombre: user.nombre, email: user.email, rol: user.rol, activo: user.activo } };
  },
  validateToken: async (token) => {
    const payload = jwtUtils.verify(token, config.jwtSecret);
    const user = await User.findById(payload.userId);
    if (!user) throw new Error('Usuario no encontrado');
    return { _id: user._id, nombre: user.nombre, email: user.email, rol: user.rol, activo: user.activo };
  },
  getProfile: async (userId) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('Usuario no encontrado');
    return { _id: user._id, nombre: user.nombre, email: user.email, rol: user.rol, activo: user.activo };
  },
  updateProfile: async (userId, data) => {
    const update = {};
    if (data.nombre) update.nombre = data.nombre;
    if (data.correo) update.email = data.correo;
    const user = await User.findByIdAndUpdate(userId, update, { new: true });
    if (!user) throw new Error('Usuario no encontrado');
    return { _id: user._id, nombre: user.nombre, email: user.email, rol: user.rol, activo: user.activo };
  },
  deleteProfile: async (userId) => {
    await User.findByIdAndDelete(userId);
    return true;
  },
  changePassword: async (userId, currentPassword, newPassword) => {
    const user = await User.findById(userId);
    if (!user) throw new Error('Usuario no encontrado');
    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) throw new Error('Contraseña actual incorrecta');
    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();
    return true;
  },
  // Admin
  listUsers: async (search) => {
    const query = search ? { nombre: { $regex: search, $options: 'i' } } : {};
    return await User.find(query).select('-password');
  },
  createUserByAdmin: async (userData) => {
    if (!userData.nombre || !userData.correo || !userData.contraseña) {
      throw new Error('Faltan datos obligatorios');
    }
    const existente = await userRepository.findByEmail(userData.correo);
    if (existente) {
      throw new Error('El correo ya está registrado');
    }
    const hash = await bcrypt.hash(userData.contraseña, 10);
    const userToSave = { 
      nombre: userData.nombre, 
      email: userData.correo, 
      password: hash, 
      rol: userData.rol 
    };
    const user = await userRepository.createUser(userToSave);
    await Activity.create({ usuario: user._id, nombreUsuario: user.nombre, accion: 'creó usuario', recurso: user.email });
    return { _id: user._id, nombre: user.nombre, email: user.email, rol: user.rol, activo: user.activo };
  },
  disableUserByAdmin: async (userId) => {
    const user = await User.findByIdAndUpdate(userId, { activo: false }, { new: true });
    if (!user) throw new Error('Usuario no encontrado');
    await Activity.create({ usuario: user._id, nombreUsuario: user.nombre, accion: 'deshabilitó usuario', recurso: user.email });
    return true;
  },
  enableUserByAdmin: async (userId) => {
    const user = await User.findByIdAndUpdate(userId, { activo: true }, { new: true });
    if (!user) throw new Error('Usuario no encontrado');
    await Activity.create({ usuario: user._id, nombreUsuario: user.nombre, accion: 'habilitó usuario', recurso: user.email });
    return true;
  },
  deleteUserByAdmin: async (userId) => {
    const user = await User.findByIdAndDelete(userId);
    if (!user) throw new Error('Usuario no encontrado');
    await Activity.create({ usuario: user._id, nombreUsuario: user.nombre, accion: 'eliminó usuario', recurso: user.email });
    return true;
  },
  listAdminActivities: async () => {
    return await Activity.find().sort({ fecha: -1 }).limit(100);
  },
  getUsersCount: async () => {
    return await User.countDocuments({ activo: true });
  }
};

export default authService; 