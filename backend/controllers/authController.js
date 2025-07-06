import authService from '../services/authService.js';
import { successResponse, errorResponse } from '../utils/response.js';
import User from '../models/User.js';
import Activity from '../models/Activity.js';

export class AuthController {
  /**
   * Registrar un nuevo usuario
   * POST /auth/register
   */
  async registrarUsuario(req, res) {
    try {
      const { nombre, correo, contraseña, rol } = req.body;
      
      const resultado = await authService.registrarUsuario({
        nombre,
        correo,
        contraseña,
        rol: rol || 'usuario'
      });

      return successResponse(
        res,
        201,
        'Usuario registrado exitosamente',
        resultado
      );
    } catch (error) {
      if (error.message.includes('correo electrónico ya está registrado')) {
        return errorResponse(res, 409, error.message);
      }
      return errorResponse(res, 500, 'Error al registrar usuario', error.message);
    }
  }

  /**
   * Autenticar usuario (login)
   * POST /auth/login
   */
  async autenticarUsuario(req, res) {
    try {
      const { correo, contraseña } = req.body;
      
      const resultado = await authService.autenticarUsuario(correo, contraseña);

      return successResponse(
        res,
        200,
        'Autenticación exitosa',
        resultado
      );
    } catch (error) {
      if (error.message.includes('Credenciales inválidas') || 
          error.message.includes('Cuenta desactivada')) {
        return errorResponse(res, 401, error.message);
      }
      return errorResponse(res, 500, 'Error en la autenticación', error.message);
    }
  }

  /**
   * Validar token y obtener datos del usuario
   * GET /auth/validate
   */
  async validarToken(req, res) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return errorResponse(res, 401, 'Token de acceso requerido');
      }

      const token = authHeader.substring(7);
      const usuario = await authService.validarToken(token);

      return successResponse(
        res,
        200,
        'Token válido',
        { usuario }
      );
    } catch (error) {
      return errorResponse(res, 401, error.message);
    }
  }

  /**
   * Obtener perfil del usuario autenticado
   * GET /auth/profile
   */
  async obtenerPerfil(req, res) {
    try {
      const usuario = await authService.obtenerPerfil(req.usuario.id);

      return successResponse(
        res,
        200,
        'Perfil obtenido exitosamente',
        { usuario }
      );
    } catch (error) {
      return errorResponse(res, 404, error.message);
    }
  }

  /**
   * Cambiar contraseña del usuario autenticado
   * PUT /auth/change-password
   */
  async cambiarContraseña(req, res) {
    try {
      const { contraseñaActual, nuevaContraseña } = req.body;
      
      const usuario = await authService.cambiarContraseña(
        req.usuario.id,
        contraseñaActual,
        nuevaContraseña
      );

      return successResponse(
        res,
        200,
        'Contraseña cambiada exitosamente',
        { usuario }
      );
    } catch (error) {
      if (error.message.includes('Contraseña actual incorrecta')) {
        return errorResponse(res, 400, error.message);
      }
      return errorResponse(res, 500, 'Error al cambiar contraseña', error.message);
    }
  }

  /**
   * Actualizar perfil del usuario autenticado
   * PUT /auth/profile
   */
  async actualizarPerfil(req, res) {
    try {
      const { nombre, correo, rol } = req.body;
      const datosActualizados = {};
      
      if (nombre) datosActualizados.nombre = nombre;
      if (correo) datosActualizados.correo = correo;
      if (rol) datosActualizados.rol = rol;

      const usuario = await authService.actualizarPerfil(req.usuario.id, datosActualizados);

      return successResponse(
        res,
        200,
        'Perfil actualizado exitosamente',
        { usuario }
      );
    } catch (error) {
      return errorResponse(res, 500, 'Error al actualizar perfil', error.message);
    }
  }

  /**
   * Eliminar usuario autenticado
   * DELETE /auth/profile
   */
  async eliminarUsuario(req, res) {
    try {
      const resultado = await authService.eliminarUsuario(req.usuario.id);

      return successResponse(
        res,
        200,
        'Usuario eliminado exitosamente',
        resultado
      );
    } catch (error) {
      return errorResponse(res, 500, 'Error al eliminar usuario', error.message);
    }
  }

  /**
   * Verificar estado del servicio
   * GET /auth/health
   */
  async healthCheck(req, res) {
    return successResponse(
      res,
      200,
      'Auth Service funcionando correctamente',
      {
        service: 'Auth Service',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        status: 'healthy'
      }
    );
  }

  /**
   * Listar todos los usuarios (solo GAD)
   * GET /auth/users?search=nombre
   */
  async listarUsuarios(req, res) {
    try {
      const { search } = req.query;
      let query = {};
      
      // Filtrar por nombre si se proporciona
      if (search) {
        query.nombre = { $regex: search, $options: 'i' };
      }
      
      const usuarios = await User.find(query).sort({ fechaCreacion: -1 });
      return successResponse(
        res,
        200,
        'Usuarios obtenidos exitosamente',
        { usuarios }
      );
    } catch (error) {
      return errorResponse(res, 500, 'Error al obtener usuarios', error.message);
    }
  }

  /**
   * Deshabilitar usuario por admin (GAD)
   * DELETE /auth/users/:id
   */
  async deshabilitarUsuarioPorAdmin(req, res) {
    try {
      // Solo admins pueden usar este endpoint
      if (!req.usuario || req.usuario.rol.toLowerCase() !== 'gad') {
        return errorResponse(res, 403, 'Solo los administradores pueden deshabilitar usuarios');
      }
      const userId = req.params.id;
      if (!userId) {
        return errorResponse(res, 400, 'ID de usuario requerido');
      }
      const resultado = await authService.eliminarUsuario(userId, req.usuario);
      return successResponse(
        res,
        200,
        'Usuario deshabilitado exitosamente',
        resultado
      );
    } catch (error) {
      return errorResponse(res, 500, 'Error al deshabilitar usuario', error.message);
    }
  }

  /**
   * Consultar actividades recientes de administradores
   * GET /admin/actividades?limit=10
   */
  async listarActividadesAdmin(req, res) {
    try {
      // Solo admins pueden ver actividades
      if (!req.usuario || req.usuario.rol.toLowerCase() !== 'gad') {
        return errorResponse(res, 403, 'Solo los administradores pueden ver actividades');
      }
      const limit = parseInt(req.query.limit) || 10;
      const actividades = await Activity.find()
        .sort({ fecha: -1 })
        .limit(limit)
        .populate('usuario', 'nombre correo');
      return successResponse(res, 200, 'Actividades recientes obtenidas', { actividades });
    } catch (error) {
      return errorResponse(res, 500, 'Error al obtener actividades', error.message);
    }
  }

  /**
   * Crear usuario por admin (GAD)
   * POST /auth/users
   */
  async crearUsuarioPorAdmin(req, res) {
    try {
      // Solo admins pueden crear usuarios
      if (!req.usuario || req.usuario.rol.toLowerCase() !== 'gad') {
        return errorResponse(res, 403, 'Solo los administradores pueden crear usuarios');
      }

      const resultado = await authService.registrarUsuario(req.body);
      
      // Registrar actividad
      await Activity.create({
        usuario: req.usuario.id,
        nombreUsuario: req.usuario.nombre || req.usuario.correo || 'Admin',
        accion: 'creó un usuario',
        recurso: resultado.usuario.nombre
      });

      return successResponse(
        res,
        201,
        'Usuario creado exitosamente',
        { usuario: resultado.usuario }
      );
    } catch (error) {
      if (error.message.includes('ya está registrado')) {
        return errorResponse(res, 400, error.message);
      }
      return errorResponse(res, 500, 'Error al crear usuario', error.message);
    }
  }

  /**
   * Habilitar usuario por admin (GAD)
   * PATCH /auth/users/:id/enable
   */
  async habilitarUsuarioPorAdmin(req, res) {
    try {
      // Solo admins pueden habilitar usuarios
      if (!req.usuario || req.usuario.rol.toLowerCase() !== 'gad') {
        return errorResponse(res, 403, 'Solo los administradores pueden habilitar usuarios');
      }

      const userId = req.params.id;
      if (!userId) {
        return errorResponse(res, 400, 'ID de usuario requerido');
      }

      // Buscar y habilitar usuario
      const usuario = await User.findByIdAndUpdate(
        userId, 
        { activo: true }, 
        { new: true }
      );

      if (!usuario) {
        return errorResponse(res, 404, 'Usuario no encontrado');
      }

      // Registrar actividad
      await Activity.create({
        usuario: req.usuario.id,
        nombreUsuario: req.usuario.nombre || req.usuario.correo || 'Admin',
        accion: 'habilitó un usuario',
        recurso: usuario.nombre
      });

      return successResponse(
        res,
        200,
        'Usuario habilitado exitosamente',
        { usuario: usuario.nombre }
      );
    } catch (error) {
      return errorResponse(res, 500, 'Error al habilitar usuario', error.message);
    }
  }

  /**
   * Eliminar usuario permanentemente por admin (GAD)
   * DELETE /auth/users/:id/permanent
   */
  async eliminarUsuarioPorAdmin(req, res) {
    try {
      // Solo admins pueden eliminar usuarios
      if (!req.usuario || req.usuario.rol.toLowerCase() !== 'gad') {
        return errorResponse(res, 403, 'Solo los administradores pueden eliminar usuarios');
      }

      const userId = req.params.id;
      if (!userId) {
        return errorResponse(res, 400, 'ID de usuario requerido');
      }

      // Buscar usuario antes de eliminarlo para registrar la actividad
      const usuarioAEliminar = await User.findById(userId);
      if (!usuarioAEliminar) {
        return errorResponse(res, 404, 'Usuario no encontrado');
      }

      // Eliminar usuario permanentemente
      await User.findByIdAndDelete(userId);

      // Registrar actividad
      await Activity.create({
        usuario: req.usuario.id,
        nombreUsuario: req.usuario.nombre || req.usuario.correo || 'Admin',
        accion: 'eliminó permanentemente un usuario',
        recurso: usuarioAEliminar.nombre
      });

      return successResponse(
        res,
        200,
        'Usuario eliminado permanentemente',
        { usuarioEliminado: usuarioAEliminar.nombre }
      );
    } catch (error) {
      return errorResponse(res, 500, 'Error al eliminar usuario', error.message);
    }
  }
}

export default new AuthController(); 