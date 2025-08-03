import Activity from '../models/Activity.js';
import User from '../models/User.js';
import { generarEmailDeBorrado, generarEmailDeHabilitacion, generarEmailDeshabilitacion } from '../utils/jwt.js';

/**
 * Servicio para manejar actividades del sistema
 */
class ActivityService {
  
  /**
   * Registrar una nueva actividad
   */
  static async logActivity(data) {
    try {
      const activity = new Activity({
        type: data.type,
        action: data.action,
        description: data.description,
        userId: data.userId,
        targetId: data.targetId,
        targetModel: data.targetModel,
        metadata: data.metadata || {}
      });

      await activity.save();
      return activity;
    } catch (error) {
      console.error('Error al registrar actividad:', error);
      throw error;
    }
  }

  /**
   * Registrar login de administrador
   */
  static async logLogin(userId, userEmail) {
    return this.logActivity({
      type: 'login',
      action: 'login',
      description: `Administrador ${userEmail} inició sesión`,
      userId: userId,
      metadata: { userEmail }
    });
  }

  /**
   * Registrar logout de administrador
   */
  static async logLogout(userId, userEmail) {
    return this.logActivity({
      type: 'logout',
      action: 'logout',
      description: `Administrador ${userEmail} cerró sesión`,
      userId: userId,
      metadata: { userEmail }
    });
  }

  /**
   * Registrar creación de usuario
   */
  static async logUserCreated(adminId, newUser) {
    return this.logActivity({
      type: 'user',
      action: 'create',
      description: `Usuario creado: ${newUser.nombre} (${newUser.correo})`,
      userId: adminId,
      targetId: newUser._id,
      targetModel: 'User',
      metadata: { 
        userEmail: newUser.correo,
        userRole: newUser.rol 
      }
    });
  }

  /**
   * Registrar actualización de usuario
   */
  static async logUserUpdated(adminId, user, changes) {
    return this.logActivity({
      type: 'user',
      action: 'update',
      description: `Usuario actualizado: ${user.nombre} (${user.correo})`,
      userId: adminId,
      targetId: user._id,
      targetModel: 'User',
      metadata: { 
        userEmail: user.correo,
        changes: Object.keys(changes)
      }
    });
  }

  /**
   * Registrar habilitación de usuario
   */
  static async logUserEnabled(adminId, user) {
    
    generarEmailDeHabilitacion(user)
    
    return this.logActivity({
      type: 'user',
      action: 'enable',
      description: `Usuario habilitado: ${user.nombre} (${user.correo})`,
      userId: adminId,
      targetId: user._id,
      targetModel: 'User',
      metadata: { userEmail: user.correo }
    });
  }

  /**
   * Registrar deshabilitación de usuario
   */
  static async logUserDisabled(adminId, user) {

    generarEmailDeshabilitacion(user)

    return this.logActivity({
      type: 'user',
      action: 'disable',
      description: `Usuario deshabilitado: ${user.nombre} (${user.correo})`,
      userId: adminId,
      targetId: user._id,
      targetModel: 'User',
      metadata: { userEmail: user.correo }
    });
  }

  /**
   * Registrar eliminación de usuario
   */
  static async logUserDeleted(adminId, user) {

    generarEmailDeBorrado(user)

    return this.logActivity({
      type: 'user',
      action: 'delete',
      description: `Usuario eliminado: ${user.nombre} (${user.correo})`,
      userId: adminId,
      targetId: user._id,
      targetModel: 'User',
      metadata: { userEmail: user.correo }
    });
  }

  /**
   * Obtener actividades recientes
   */
  static async getRecentActivities(limit = 10) {
    try {
      const activities = await Activity.find()
        .populate('userId', 'nombre correo')
        .sort({ timestamp: -1 })
        .limit(limit);

      return activities;
    } catch (error) {
      console.error('Error al obtener actividades recientes:', error);
      throw error;
    }
  }

  /**
   * Obtener actividades por tipo
   */
  static async getActivitiesByType(type, limit = 10) {
    try {
      const activities = await Activity.find({ type })
        .populate('userId', 'nombre correo')
        .sort({ timestamp: -1 })
        .limit(limit);

      return activities;
    } catch (error) {
      console.error('Error al obtener actividades por tipo:', error);
      throw error;
    }
  }
}

export default ActivityService; 