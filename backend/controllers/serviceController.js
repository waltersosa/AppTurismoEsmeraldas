import Service from '../models/Service.js';
import Activity from '../models/Activity.js';
import { successResponse, errorResponse } from '../utils/response.js';

export class ServiceController {
  /**
   * Listar todos los servicios
   * GET /services
   */
  async listarServicios(req, res) {
    try {
      const servicios = await Service.find().sort({ nombre: 1 });
      return successResponse(
        res,
        200,
        'Servicios obtenidos exitosamente',
        { servicios }
      );
    } catch (error) {
      return errorResponse(res, 500, 'Error al obtener servicios', error.message);
    }
  }

  /**
   * Obtener un servicio específico
   * GET /services/:id
   */
  async obtenerServicio(req, res) {
    try {
      const servicio = await Service.findById(req.params.id);
      if (!servicio) {
        return errorResponse(res, 404, 'Servicio no encontrado');
      }
      return successResponse(
        res,
        200,
        'Servicio obtenido exitosamente',
        { servicio }
      );
    } catch (error) {
      return errorResponse(res, 500, 'Error al obtener servicio', error.message);
    }
  }



  /**
   * Actualizar un servicio
   * PUT /services/:id
   */
  async actualizarServicio(req, res) {
    try {
      // Solo admins pueden actualizar servicios
      if (!req.usuario || req.usuario.rol.toLowerCase() !== 'gad') {
        return errorResponse(res, 403, 'Solo los administradores pueden actualizar servicios');
      }

      const servicio = await Service.findByIdAndUpdate(
        req.params.id,
        { ...req.body, fechaActualizacion: new Date() },
        { new: true }
      );

      if (!servicio) {
        return errorResponse(res, 404, 'Servicio no encontrado');
      }

      // Registrar actividad
      await Activity.create({
        usuario: req.usuario.id,
        nombreUsuario: req.usuario.nombre || req.usuario.correo || 'Admin',
        accion: 'actualizó un servicio',
        recurso: servicio.nombre
      });

      return successResponse(
        res,
        200,
        'Servicio actualizado exitosamente',
        { servicio }
      );
    } catch (error) {
      return errorResponse(res, 500, 'Error al actualizar servicio', error.message);
    }
  }



  /**
   * Alternar estado activo/inactivo de un servicio
   * PATCH /services/:id/toggle
   */
  async alternarEstadoServicio(req, res) {
    try {
      // Solo admins pueden alternar estados
      if (!req.usuario || req.usuario.rol.toLowerCase() !== 'gad') {
        return errorResponse(res, 403, 'Solo los administradores pueden alternar estados de servicios');
      }

      const servicio = await Service.findById(req.params.id);
      if (!servicio) {
        return errorResponse(res, 404, 'Servicio no encontrado');
      }

      // Proteger el servicio de autenticación
      if (servicio.nombre.toLowerCase().includes('auth') || servicio.nombre.toLowerCase().includes('autenticacion')) {
        return errorResponse(res, 403, 'No se puede desactivar el servicio de autenticación');
      }

      await servicio.alternarEstado();

      // Registrar actividad
      await Activity.create({
        usuario: req.usuario.id,
        nombreUsuario: req.usuario.nombre || req.usuario.correo || 'Admin',
        accion: `${servicio.activo ? 'activó' : 'desactivó'} un servicio`,
        recurso: servicio.nombre
      });

      return successResponse(
        res,
        200,
        `Servicio ${servicio.activo ? 'activado' : 'desactivado'} exitosamente`,
        { servicio }
      );
    } catch (error) {
      return errorResponse(res, 500, 'Error al alternar estado del servicio', error.message);
    }
  }

  /**
   * Activar todos los servicios
   * PATCH /services/activate-all
   */
  async activarTodosServicios(req, res) {
    try {
      // Solo admins pueden activar servicios
      if (!req.usuario || req.usuario.rol.toLowerCase() !== 'gad') {
        return errorResponse(res, 403, 'Solo los administradores pueden activar servicios');
      }

      const servicios = await Service.find();
      const serviciosActivados = [];
      const serviciosNoActivados = [];

      for (const servicio of servicios) {
        try {
          if (!servicio.activo) {
            await servicio.iniciarServicio();
            serviciosActivados.push(servicio.nombre);
          } else {
            serviciosNoActivados.push(`${servicio.nombre} (ya activo)`);
          }
        } catch (error) {
          serviciosNoActivados.push(`${servicio.nombre} (error: ${error.message})`);
        }
      }

      // Registrar actividad
      await Activity.create({
        usuario: req.usuario.id,
        nombreUsuario: req.usuario.nombre || req.usuario.correo || 'Admin',
        accion: 'activó todos los servicios',
        recurso: `Servicios activados: ${serviciosActivados.join(', ')}`
      });

      return successResponse(
        res,
        200,
        'Servicios activados exitosamente',
        { 
          serviciosActivados,
          serviciosNoActivados,
          totalActivados: serviciosActivados.length,
          totalNoActivados: serviciosNoActivados.length
        }
      );
    } catch (error) {
      return errorResponse(res, 500, 'Error al activar servicios', error.message);
    }
  }

  /**
   * Desactivar todos los servicios (excepto auth)
   * PATCH /services/deactivate-all
   */
  async desactivarTodosServicios(req, res) {
    try {
      // Solo admins pueden desactivar servicios
      if (!req.usuario || req.usuario.rol.toLowerCase() !== 'gad') {
        return errorResponse(res, 403, 'Solo los administradores pueden desactivar servicios');
      }

      const servicios = await Service.find();
      const serviciosDesactivados = [];
      const serviciosNoDesactivados = [];

      for (const servicio of servicios) {
        // Proteger el servicio de autenticación
        if (servicio.nombre.toLowerCase().includes('auth') || servicio.nombre.toLowerCase().includes('autenticacion')) {
          serviciosNoDesactivados.push(`${servicio.nombre} (protegido)`);
          continue;
        }

        try {
          if (servicio.activo) {
            await servicio.detenerServicio();
            serviciosDesactivados.push(servicio.nombre);
          } else {
            serviciosNoDesactivados.push(`${servicio.nombre} (ya inactivo)`);
          }
        } catch (error) {
          serviciosNoDesactivados.push(`${servicio.nombre} (error: ${error.message})`);
        }
      }

      // Registrar actividad
      await Activity.create({
        usuario: req.usuario.id,
        nombreUsuario: req.usuario.nombre || req.usuario.correo || 'Admin',
        accion: 'desactivó todos los servicios',
        recurso: `Servicios desactivados: ${serviciosDesactivados.join(', ')}`
      });

      return successResponse(
        res,
        200,
        'Servicios desactivados exitosamente',
        { 
          serviciosDesactivados,
          serviciosNoDesactivados,
          totalDesactivados: serviciosDesactivados.length,
          totalNoDesactivados: serviciosNoDesactivados.length
        }
      );
    } catch (error) {
      return errorResponse(res, 500, 'Error al desactivar servicios', error.message);
    }
  }

  /**
   * Verificar estado de un servicio
   * POST /services/:id/check
   */
  async verificarServicio(req, res) {
    try {
      const servicio = await Service.verificarServicio(req.params.id);
      return successResponse(
        res,
        200,
        'Estado del servicio verificado',
        { servicio }
      );
    } catch (error) {
      return errorResponse(res, 500, 'Error al verificar servicio', error.message);
    }
  }

  /**
   * Verificar estado de todos los servicios
   * POST /services/check-all
   */
  async verificarTodosServicios(req, res) {
    try {
      const servicios = await Service.find();
      const resultados = [];

      for (const servicio of servicios) {
        try {
          const servicioVerificado = await Service.verificarServicio(servicio._id);
          resultados.push(servicioVerificado);
        } catch (error) {
          resultados.push({
            ...servicio.toObject(),
            estado: 'error',
            tiempoRespuesta: 0
          });
        }
      }

      return successResponse(
        res,
        200,
        'Estados de todos los servicios verificados',
        { servicios: resultados }
      );
    } catch (error) {
      return errorResponse(res, 500, 'Error al verificar servicios', error.message);
    }
  }

  /**
   * Obtener estadísticas de servicios
   * GET /services/stats
   */
  async obtenerEstadisticas(req, res) {
    try {
      const total = await Service.countDocuments();
      const activos = await Service.countDocuments({ activo: true });
      const online = await Service.countDocuments({ estado: 'online' });
      const offline = await Service.countDocuments({ estado: 'offline' });
      const error = await Service.countDocuments({ estado: 'error' });
      const maintenance = await Service.countDocuments({ estado: 'maintenance' });

      const estadisticas = {
        total,
        activos,
        inactivos: total - activos,
        online,
        offline,
        error,
        maintenance,
        porcentajeDisponibilidad: total > 0 ? Math.round((online / total) * 100) : 0
      };

      return successResponse(
        res,
        200,
        'Estadísticas de servicios obtenidas',
        { estadisticas }
      );
    } catch (error) {
      return errorResponse(res, 500, 'Error al obtener estadísticas', error.message);
    }
  }
}

export default new ServiceController(); 