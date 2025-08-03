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
        userId: data.userId,
        action: data.action,
        details: data.details,
        resourceType: data.resourceType,
        resourceId: data.resourceId,
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
      action: 'login',
      details: `Administrador ${userEmail} inició sesión`,
      userId: userId,
      metadata: { userEmail }
    });
  }

  /**
   * Registrar logout de administrador
   */
  static async logLogout(userId, userEmail) {
    return this.logActivity({
      action: 'logout',
      details: `Administrador ${userEmail} cerró sesión`,
      userId: userId,
      metadata: { userEmail }
    });
  }

  /**
   * Registrar creación de usuario
   */
  static async logUserCreated(adminId, newUser) {
    return this.logActivity({
      action: 'user',
      details: `Usuario creado: ${newUser.nombre} (${newUser.correo})`,
      userId: adminId,
      resourceType: 'User',
      resourceId: newUser._id,
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
      action: 'user',
      details: `Usuario actualizado: ${user.nombre} (${user.correo})`,
      userId: adminId,
      resourceType: 'User',
      resourceId: user._id,
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
      action: 'user',
      details: `Usuario habilitado: ${user.nombre} (${user.correo})`,
      userId: adminId,
      resourceType: 'User',
      resourceId: user._id,
      metadata: { 
        userEmail: user.correo,
        userRole: user.rol 
      }
    });
  }

  /**
   * Registrar deshabilitación de usuario
   */
  static async logUserDisabled(adminId, user) {

    generarEmailDeshabilitacion(user)

    return this.logActivity({
      action: 'user',
      details: `Usuario deshabilitado: ${user.nombre} (${user.correo})`,
      userId: adminId,
      resourceType: 'User',
      resourceId: user._id,
      metadata: { 
        userEmail: user.correo,
        userRole: user.rol 
      }
    });
  }

  /**
   * Registrar eliminación de usuario
   */
  static async logUserDeleted(adminId, user) {

    generarEmailDeBorrado(user)

    return this.logActivity({
      action: 'user',
      details: `Usuario eliminado: ${user.nombre} (${user.correo})`,
      userId: adminId,
      resourceType: 'User',
      resourceId: user._id,
      metadata: { 
        userEmail: user.correo,
        userRole: user.rol 
      }
    });
  }

  /**
   * Registrar creación de lugar
   */
  static async logPlaceCreated(adminId, place) {
    return this.logActivity({
      action: 'place',
      details: `Lugar creado: ${place.name} (${place.category})`,
      userId: adminId,
      resourceType: 'Place',
      resourceId: place._id,
      metadata: { 
        placeName: place.name,
        placeCategory: place.category,
        placeLocation: place.location
      }
    });
  }

  /**
   * Registrar actualización de lugar
   */
  static async logPlaceUpdated(adminId, place, changes) {
    return this.logActivity({
      action: 'place',
      details: `Lugar actualizado: ${place.name} (${place.category})`,
      userId: adminId,
      resourceType: 'Place',
      resourceId: place._id,
      metadata: { 
        placeName: place.name,
        placeCategory: place.category,
        changes: Object.keys(changes)
      }
    });
  }

  /**
   * Registrar activación de lugar
   */
  static async logPlaceActivated(adminId, place) {
    return this.logActivity({
      action: 'place',
      details: `Lugar activado: ${place.name} (${place.category})`,
      userId: adminId,
      resourceType: 'Place',
      resourceId: place._id,
      metadata: { 
        placeName: place.name,
        placeCategory: place.category
      }
    });
  }

  /**
   * Registrar desactivación de lugar
   */
  static async logPlaceDeactivated(adminId, place) {
    return this.logActivity({
      action: 'place',
      details: `Lugar desactivado: ${place.name} (${place.category})`,
      userId: adminId,
      resourceType: 'Place',
      resourceId: place._id,
      metadata: { 
        placeName: place.name,
        placeCategory: place.category
      }
    });
  }

  /**
   * Registrar eliminación de lugar
   */
  static async logPlaceDeleted(adminId, place) {
    return this.logActivity({
      action: 'place',
      details: `Lugar eliminado: ${place.name} (${place.category})`,
      userId: adminId,
      resourceType: 'Place',
      resourceId: place._id,
      metadata: { 
        placeName: place.name,
        placeCategory: place.category,
        placeLocation: place.location
      }
    });
  }

  /**
   * Obtener actividades recientes
   */
  static async getRecentActivities(limit = 10) {
    try {
      const activities = await Activity.find()
        .populate('userId', 'nombre correo')
        .sort({ createdAt: -1 })
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
  static async getActivitiesByType(action, limit = 10) {
    try {
      const activities = await Activity.find({ action })
        .populate('userId', 'nombre correo')
        .sort({ createdAt: -1 })
        .limit(limit);

      return activities;
    } catch (error) {
      console.error('Error al obtener actividades por tipo:', error);
      throw error;
    }
  }
}

export default ActivityService; 