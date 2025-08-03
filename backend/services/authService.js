import userRepository from '../repositories/userRepository.js';
import { generarToken, generarPayload, generarEmailBienvenida } from '../utils/jwt.js';

export class AuthService {
  /**
   * Registrar un nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @returns {Promise<Object>} Usuario creado y token
   */
  async registrarUsuario(userData) {
    // Verificar si el correo ya existe
    const correoExiste = await userRepository.correoExiste(userData.correo);
    if (correoExiste) {
      throw new Error('El correo electrónico ya está registrado');
    }

    // Crear el usuario
    const usuario = await userRepository.crearUsuario(userData);

    // Generar token
    const payload = generarPayload(usuario);
    const token = generarToken(payload);

    //Enviar correo de Bienvenida
    generarEmailBienvenida(usuario)

    return {
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
        fechaCreacion: usuario.fechaCreacion
      },
      token
    };
  }

  /**
   * Autenticar usuario (login)
   * @param {string} correo - Correo electrónico
   * @param {string} contraseña - Contraseña
   * @returns {Promise<Object>} Usuario autenticado y token
   */
  async autenticarUsuario(correo, contraseña) {
    // Buscar usuario por correo
    const usuario = await userRepository.buscarPorCorreo(correo);
    if (!usuario) {
      throw new Error('Credenciales inválidas');
    }

    // Verificar contraseña
    const contraseñaValida = await usuario.compararContraseña(contraseña);
    if (!contraseñaValida) {
      throw new Error('Credenciales inválidas');
    }

    // Verificar que el usuario esté activo
    if (!usuario.activo) {
      throw new Error('Cuenta desactivada');
    }

    // Actualizar último acceso
    await userRepository.actualizarUltimoAcceso(usuario._id);

    // Generar token
    const payload = generarPayload(usuario);
    const token = generarToken(payload);

    return {
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
        ultimoAcceso: usuario.ultimoAcceso
      },
      token
    };
  }

  /**
   * Validar token y obtener datos del usuario
   * @param {string} token - Token JWT
   * @returns {Promise<Object>} Datos del usuario
   */
  async validarToken(token) {
    const { verificarToken } = await import('../utils/jwt.js');

    try {
      // Verificar token
      const payload = verificarToken(token);

      // Buscar usuario en la base de datos
      const usuario = await userRepository.buscarPorId(payload.id);
      if (!usuario) {
        throw new Error('Usuario no encontrado');
      }

      // Verificar que el usuario esté activo
      if (!usuario.activo) {
        throw new Error('Cuenta desactivada');
      }

      return {
        id: usuario._id,
        nombre: usuario.nombre,
        correo: usuario.correo,
        rol: usuario.rol,
        ultimoAcceso: usuario.ultimoAcceso,
        fechaCreacion: usuario.fechaCreacion
      };
    } catch (error) {
      throw new Error('Token inválido o expirado');
    }
  }

  /**
   * Cambiar contraseña de usuario
   * @param {string} id - ID del usuario
   * @param {string} contraseñaActual - Contraseña actual
   * @param {string} nuevaContraseña - Nueva contraseña
   * @returns {Promise<Object>} Usuario actualizado
   */
  async cambiarContraseña(id, contraseñaActual, nuevaContraseña) {
    const usuario = await userRepository.buscarPorId(id);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    // Verificar contraseña actual
    const contraseñaValida = await usuario.compararContraseña(contraseñaActual);
    if (!contraseñaValida) {
      throw new Error('Contraseña actual incorrecta');
    }

    // Actualizar contraseña
    usuario.contraseña = nuevaContraseña;
    await usuario.save();

    return {
      id: usuario._id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol
    };
  }

  /**
   * Obtener perfil del usuario
   * @param {string} id - ID del usuario
   * @returns {Promise<Object>} Datos del usuario
   */
  async obtenerPerfil(id) {
    const usuario = await userRepository.buscarPorId(id);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    return {
      id: usuario._id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol,
      ultimoAcceso: usuario.ultimoAcceso,
      fechaCreacion: usuario.fechaCreacion
    };
  }

  /**
   * Actualizar perfil del usuario
   * @param {string} id - ID del usuario
   * @param {Object} datosActualizados - Datos a actualizar
   * @returns {Promise<Object>} Usuario actualizado
   */
  async actualizarPerfil(id, datosActualizados) {
    const usuario = await userRepository.actualizarUsuario(id, datosActualizados);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    return {
      id: usuario._id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol,
      ultimoAcceso: usuario.ultimoAcceso,
      fechaCreacion: usuario.fechaCreacion
    };
  }

  /**
   * Eliminar usuario (soft delete)
   * @param {string} id - ID del usuario a eliminar
   * @returns {Promise<Object>} Confirmación de eliminación
   */
  async eliminarUsuario(id) {
    const usuario = await userRepository.desactivarUsuario(id);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }

    return {
      id: usuario._id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      rol: usuario.rol,
      activo: usuario.activo,
      mensaje: 'Usuario eliminado exitosamente'
    };
  }
}

export default new AuthService(); 