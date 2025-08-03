import authService from '../services/authService.js';
import { successResponse, errorResponse } from '../utils/response.js';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';
import ActivityService from '../services/activityService.js';

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
   * Autenticar usuario
   * POST /auth/login
   */
  async autenticarUsuario(req, res) {
    try {
      const { correo, contraseña } = req.body;

      // Buscar usuario por correo
      const usuario = await User.findOne({ correo: correo.toLowerCase() });
      if (!usuario) {
        return errorResponse(res, 401, 'Credenciales inválidas');
      }

      // Verificar contraseña
      const contraseñaValida = await usuario.compararContraseña(contraseña);
      if (!contraseñaValida) {
        return errorResponse(res, 401, 'Credenciales inválidas');
      }

      // Verificar si el usuario está activo
      if (!usuario.activo) {
        return errorResponse(res, 401, 'Cuenta deshabilitada');
      }

      // Actualizar último acceso
      await usuario.actualizarUltimoAcceso();

      // Generar token JWT
      const token = jwt.sign(
        {
          id: usuario._id,
          nombre: usuario.nombre,
          correo: usuario.correo,
          rol: usuario.rol
        },
        config.jwt.secret,
        {
          expiresIn: config.jwt.expiresIn,
          audience: config.jwt.audience || 'esmeraldas-turismo-users',
          issuer: config.jwt.issuer || 'esmeraldas-turismo-auth'
        }
      );

      // Registrar actividad de login si es admin
      if (usuario.rol === 'admin') {
        try {
          await ActivityService.logLogin(usuario._id, usuario.correo);
        } catch (error) {
          console.error('Error al registrar login:', error);
        }
      }

      return successResponse(
        res,
        200,
        'Autenticación exitosa',
        {
          usuario: {
            _id: usuario._id,
            nombre: usuario.nombre,
            correo: usuario.correo,
            rol: usuario.rol,
            activo: usuario.activo,
            fechaCreacion: usuario.fechaCreacion,
            ultimoAcceso: usuario.ultimoAcceso
          },
          token
        }
      );
    } catch (error) {
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
   * Listar todos los usuarios (solo ADMIN)
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

  /**
   * Obtener conteo de usuarios (solo ADMIN)
   * GET /auth/users/count
   */
  async getUsersCount(req, res) {
    try {
      const count = await User.countDocuments();
      return successResponse(
        res,
        200,
        'Conteo obtenido exitosamente',
        { count }
      );
    } catch (error) {
      return errorResponse(res, 500, 'Error al obtener conteo de usuarios', error.message);
    }
  }

  /**
   * Crear usuario desde el admin (solo ADMIN)
   * POST /auth/users
   */
  async crearUsuarioAdmin(req, res) {
    try {
      const { nombre, correo, contraseña, rol } = req.body;
      
      console.log('Datos recibidos para crear usuario:', { nombre, correo, rol });
      console.log('Contraseña recibida (longitud):', contraseña ? contraseña.length : 'undefined');

      // Verificar si el usuario ya existe
      const usuarioExistente = await User.findOne({ correo });
      if (usuarioExistente) {
        return errorResponse(res, 400, 'El correo ya está registrado');
      }

      // Crear el nuevo usuario
      const nuevoUsuario = new User({
        nombre,
        correo,
        contraseña,
        rol: rol || 'usuario',
        activo: true
      });

      await nuevoUsuario.save();

      // Registrar actividad
      try {
        await ActivityService.logUserCreated(req.usuario.id, nuevoUsuario);
      } catch (error) {
        console.error('Error al registrar actividad de creación:', error);
      }

      return successResponse(
        res,
        201,
        'Usuario creado exitosamente',
        { usuario: nuevoUsuario }
      );
    } catch (error) {
      console.error('Error completo al crear usuario:', error);
      return errorResponse(res, 500, 'Error al crear usuario', error.message);
    }
  }

  /**
   * Actualizar usuario desde el admin (solo ADMIN)
   * PUT /auth/users/:id
   */
  async actualizarUsuarioAdmin(req, res) {
    try {
      const { id } = req.params;
      const { nombre, correo, rol } = req.body;

      const usuario = await User.findById(id);
      if (!usuario) {
        return errorResponse(res, 404, 'Usuario no encontrado');
      }

      // Verificar si el correo ya existe en otro usuario
      if (correo && correo !== usuario.correo) {
        const usuarioExistente = await User.findOne({ correo });
        if (usuarioExistente) {
          return errorResponse(res, 400, 'El correo ya está registrado');
        }
      }

      // Actualizar campos
      if (nombre) usuario.nombre = nombre;
      if (correo) usuario.correo = correo;
      if (rol) usuario.rol = rol;

      await usuario.save();

      return successResponse(
        res,
        200,
        'Usuario actualizado exitosamente',
        { usuario }
      );
    } catch (error) {
      return errorResponse(res, 500, 'Error al actualizar usuario', error.message);
    }
  }

  /**
   * Habilitar usuario (solo ADMIN)
   * PATCH /auth/users/:id/enable
   */
  async habilitarUsuario(req, res) {
    try {
      const { id } = req.params;

      const usuario = await User.findById(id);
      if (!usuario) {
        return errorResponse(res, 404, 'Usuario no encontrado');
      }

      usuario.activo = true;
      await usuario.save();

      // Registrar actividad
      try {
        await ActivityService.logUserEnabled(req.usuario.id, usuario);
      } catch (error) {
        console.error('Error al registrar actividad de habilitación:', error);
      }

      return successResponse(
        res,
        200,
        'Usuario habilitado exitosamente',
        { usuario }
      );
    } catch (error) {
      return errorResponse(res, 500, 'Error al habilitar usuario', error.message);
    }
  }

  /**
   * Deshabilitar usuario (solo ADMIN)
   * PATCH /auth/users/:id/disable
   */
  async deshabilitarUsuario(req, res) {
    try {
      const { id } = req.params;

      const usuario = await User.findById(id);
      if (!usuario) {
        return errorResponse(res, 404, 'Usuario no encontrado');
      }

      usuario.activo = false;
      await usuario.save();

      // Registrar actividad
      try {
        await ActivityService.logUserDisabled(req.usuario.id, usuario);
      } catch (error) {
        console.error('Error al registrar actividad de deshabilitación:', error);
      }

      return successResponse(
        res,
        200,
        'Usuario deshabilitado exitosamente',
        { usuario }
      );
    } catch (error) {
      return errorResponse(res, 500, 'Error al deshabilitar usuario', error.message);
    }
  }

  /**
   * Eliminar usuario permanentemente (solo ADMIN)
   * DELETE /auth/users/:id
   */
  async eliminarUsuarioAdmin(req, res) {
    try {
      const { id } = req.params;

      const usuario = await User.findById(id);
      if (!usuario) {
        return errorResponse(res, 404, 'Usuario no encontrado');
      }

      // No permitir eliminar al usuario admin principal
      if (usuario.correo === 'admin@esmeraldas.gob.ec') {
        return errorResponse(res, 400, 'No se puede eliminar al administrador principal');
      }

      // Guardar información antes de eliminar para el log
      const usuarioEliminado = { ...usuario.toObject() };

      await User.findByIdAndDelete(id);

      // Registrar actividad
      try {
        await ActivityService.logUserDeleted(req.usuario.id, usuarioEliminado);
      } catch (error) {
        console.error('Error al registrar actividad de eliminación:', error);
      }

      return successResponse(
        res,
        200,
        'Usuario eliminado exitosamente'
      );
    } catch (error) {
      return errorResponse(res, 500, 'Error al eliminar usuario', error.message);
    }
  }

  /**
   * Registrar logout de administrador
   * POST /auth/logout
   */
  async registrarLogout(req, res) {
    try {
      // Registrar actividad de logout
      try {
        await ActivityService.logLogout(req.usuario.id, req.usuario.correo);
      } catch (error) {
        console.error('Error al registrar logout:', error);
      }

      return successResponse(
        res,
        200,
        'Logout registrado exitosamente'
      );
    } catch (error) {
      return errorResponse(res, 500, 'Error al registrar logout', error.message);
    }
  }
}

export default new AuthController(); 