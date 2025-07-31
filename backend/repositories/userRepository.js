import User from '../models/User.js';

export class UserRepository {
  /**
   * Crear un nuevo usuario
   * @param {Object} userData - Datos del usuario
   * @returns {Promise<Object>} Usuario creado
   */
  async crearUsuario(userData) {
    try {
      const usuario = new User(userData);
      return await usuario.save();
    } catch (error) {
      if (error.code === 11000) {
        throw new Error('El correo electrónico ya está registrado');
      }
      throw error;
    }
  }

  /**
   * Buscar usuario por correo electrónico (solo usuarios activos)
   * @param {string} correo - Correo electrónico del usuario
   * @returns {Promise<Object|null>} Usuario encontrado o null
   */
  async buscarPorCorreo(correo) {
    return await User.buscarPorCorreo(correo);
  }

  /**
   * Buscar usuario por correo electrónico (incluyendo inactivos)
   * @param {string} correo - Correo electrónico del usuario
   * @returns {Promise<Object|null>} Usuario encontrado o null
   */
  async buscarPorCorreoIncluyendoInactivos(correo) {
    return await User.buscarPorCorreoIncluyendoInactivos(correo);
  }

  /**
   * Buscar usuario por ID
   * @param {string} id - ID del usuario
   * @returns {Promise<Object|null>} Usuario encontrado o null
   */
  async buscarPorId(id) {
    return await User.findById(id).select('-contraseña');
  }

  /**
   * Verificar si existe un correo electrónico (solo usuarios activos)
   * @param {string} correo - Correo electrónico a verificar
   * @returns {Promise<boolean>} True si existe, false si no
   */
  async correoExiste(correo) {
    return await User.correoExiste(correo);
  }

  /**
   * Verificar si existe un correo electrónico (incluyendo inactivos)
   * @param {string} correo - Correo electrónico a verificar
   * @returns {Promise<boolean>} True si existe, false si no
   */
  async correoExisteIncluyendoInactivos(correo) {
    return await User.correoExisteIncluyendoInactivos(correo);
  }

  /**
   * Actualizar último acceso del usuario
   * @param {string} id - ID del usuario
   * @returns {Promise<Object>} Usuario actualizado
   */
  async actualizarUltimoAcceso(id) {
    const usuario = await User.findById(id);
    if (!usuario) {
      throw new Error('Usuario no encontrado');
    }
    return await usuario.actualizarUltimoAcceso();
  }

  /**
   * Obtener todos los usuarios (para administración)
   * @param {Object} filtros - Filtros opcionales
   * @returns {Promise<Array>} Lista de usuarios
   */
  async obtenerTodos(filtros = {}) {
    const query = { activo: true };
    
    if (filtros.rol) {
      query.rol = filtros.rol;
    }
    
    return await User.find(query).select('-contraseña').sort({ fechaCreacion: -1 });
  }

  /**
   * Actualizar datos del usuario
   * @param {string} id - ID del usuario
   * @param {Object} datosActualizados - Datos a actualizar
   * @returns {Promise<Object>} Usuario actualizado
   */
  async actualizarUsuario(id, datosActualizados) {
    // No permitir actualizar contraseña desde aquí
    delete datosActualizados.contraseña;
    
    return await User.findByIdAndUpdate(
      id,
      datosActualizados,
      { new: true, runValidators: true }
    ).select('-contraseña');
  }

  /**
   * Desactivar usuario (soft delete)
   * @param {string} id - ID del usuario
   * @returns {Promise<Object>} Usuario desactivado
   */
  async desactivarUsuario(id) {
    return await User.findByIdAndUpdate(
      id,
      { activo: false },
      { new: true }
    ).select('-contraseña');
  }
}

export default new UserRepository(); 