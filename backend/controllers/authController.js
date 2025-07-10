import authService from '../services/authService.js';
import { successResponse, errorResponse } from '../utils/response.js';
import User from '../models/User.js';

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
   * GET /auth/users
   */
  async listarUsuarios(req, res) {
    try {
      const usuarios = await User.find();
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
}

export default new AuthController(); 