import * as placeService from '../services/placeService.js';
import Activity from '../models/Activity.js';

export const getPlaces = async (req, res, next) => {
  try {
    const { page, limit, search, category, active, sortBy, order } = req.query;
    const { data, total } = await placeService.getPlaces({ page, limit, search, category, active, sortBy, order });
    res.json({
      success: true,
      data,
      pagination: {
        total,
        page: Number(page) || 1,
        limit: Number(limit) || 10
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getPlaceById = async (req, res, next) => {
  try {
    const place = await placeService.getPlaceById(req.params.id);
    if (!place) return res.status(404).json({ success: false, message: 'Place not found' });
    res.json({ success: true, data: place });
  } catch (err) {
    next(err);
  }
};

export const createPlace = async (req, res, next) => {
  try {
    const place = await placeService.createPlace(req.body);
    // Registrar actividad
    if (req.usuario && req.usuario.rol === 'gad') {
      await Activity.create({
        usuario: req.usuario.id,
        nombreUsuario: req.usuario.nombre || req.usuario.correo || 'Admin',
        accion: 'creó un lugar',
        recurso: place.name
      });
    }
    res.status(201).json({ success: true, data: place });
  } catch (err) {
    // Manejar errores específicos de validación
    if (err.message.includes('URLs de imágenes inválidas') || err.message.includes('URL de imagen de portada inválida')) {
      return res.status(400).json({
        success: false,
        message: err.message,
        timestamp: new Date().toISOString()
      });
    }
    next(err);
  }
};

export const updatePlace = async (req, res, next) => {
  try {
    const place = await placeService.updatePlace(req.params.id, req.body);
    if (!place) return res.status(404).json({ success: false, message: 'Place not found' });
    // Registrar actividad
    if (req.usuario && req.usuario.rol === 'gad') {
      await Activity.create({
        usuario: req.usuario.id,
        nombreUsuario: req.usuario.nombre || req.usuario.correo || 'Admin',
        accion: 'editó un lugar',
        recurso: place.name
      });
    }
    res.json({ success: true, data: place });
  } catch (err) {
    // Manejar errores específicos de validación
    if (err.message.includes('URLs de imágenes inválidas') || err.message.includes('URL de imagen de portada inválida')) {
      return res.status(400).json({
        success: false,
        message: err.message,
        timestamp: new Date().toISOString()
      });
    }
    next(err);
  }
};

export const deletePlace = async (req, res, next) => {
  try {
    const place = await placeService.deletePlace(req.params.id);
    if (!place) return res.status(404).json({ success: false, message: 'Place not found' });
    // Registrar actividad
    if (req.usuario && req.usuario.rol === 'gad') {
      await Activity.create({
        usuario: req.usuario.id,
        nombreUsuario: req.usuario.nombre || req.usuario.correo || 'Admin',
        accion: 'eliminó un lugar',
        recurso: place.name
      });
    }
    res.json({ success: true, data: place });
  } catch (err) {
    next(err);
  }
};

export const updatePlaceStatus = async (req, res, next) => {
  try {
    const { active } = req.body;
    
    // Validar que active sea un booleano
    if (typeof active !== 'boolean') {
      return res.status(400).json({ 
        success: false, 
        message: 'El campo active debe ser un booleano' 
      });
    }
    
    const place = await placeService.updatePlaceStatus(req.params.id, { active });
    if (!place) return res.status(404).json({ success: false, message: 'Place not found' });
    
    // Registrar actividad
    if (req.usuario && req.usuario.rol === 'gad') {
      await Activity.create({
        usuario: req.usuario.id,
        nombreUsuario: req.usuario.nombre || req.usuario.correo || 'Admin',
        accion: `${active ? 'activó' : 'desactivó'} un lugar`,
        recurso: place.name
      });
    }
    
    res.json({ success: true, data: place });
  } catch (err) {
    next(err);
  }
}; 