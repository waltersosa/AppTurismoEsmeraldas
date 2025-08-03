import * as placeService from '../services/placeService.js';
import ActivityService from '../services/activityService.js';

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
    console.error('❌ Error en getPlaces:', err);
    next(err);
  }
};

export const getPlacesCount = async (req, res, next) => {
  try {
    const count = await placeService.getPlacesCount();
    res.json({ 
      success: true,
      data: { count }
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
    await ActivityService.logPlaceCreated(req.usuario.id, place);
    
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
    await ActivityService.logPlaceUpdated(req.usuario.id, place, req.body);
    
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
    await ActivityService.logPlaceDeleted(req.usuario.id, place);
    
    res.json({ success: true, data: place });
  } catch (err) {
    next(err);
  }
};

export const togglePlaceStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { active } = req.body;
    
    const place = await placeService.togglePlaceStatus(id, active);
    if (!place) return res.status(404).json({ success: false, message: 'Place not found' });
    
    // Registrar actividad
    if (active) {
      await ActivityService.logPlaceActivated(req.usuario.id, place);
    } else {
      await ActivityService.logPlaceDeactivated(req.usuario.id, place);
    }
    
    res.json({ 
      success: true, 
      data: place,
      message: `Lugar ${place.active ? 'activado' : 'desactivado'} exitosamente`
    });
  } catch (err) {
    console.error('❌ Error en togglePlaceStatus:', err);
    next(err);
  }
}; 