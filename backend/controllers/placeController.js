import * as placeService from '../services/placeService.js';

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

export const updatePlaceStatus = async (req, res, next) => {
  try {
    const { active } = req.body;
    const place = await placeService.updatePlace(req.params.id, { active });
    if (!place) return res.status(404).json({ success: false, message: 'Place not found' });
    res.json({ success: true, data: place });
  } catch (err) {
    next(err);
  }
};

export const deletePlace = async (req, res, next) => {
  try {
    const place = await placeService.deletePlace(req.params.id);
    if (!place) return res.status(404).json({ success: false, message: 'Place not found' });
    res.json({ success: true, data: place });
  } catch (err) {
    next(err);
  }
};

export const getUnifiedActivities = async (req, res, next) => {
  try {
    // Importar los modelos necesarios
    const User = (await import('../models/User.js')).default;
    const Place = (await import('../models/Place.js')).default;
    const Review = (await import('../models/Review.js')).default;

    // Obtener las últimas actividades
    const [recentPlaces, recentReviews, recentUsers] = await Promise.all([
      Place.find().sort({ createdAt: -1 }).limit(5).lean(),
      Review.find().sort({ createdAt: -1 }).limit(5).lean(),
      User.find().sort({ createdAt: -1 }).limit(5).lean()
    ]);

    const actividades = [
      ...recentPlaces.map(place => ({
        tipo: 'lugar',
        accion: 'creado',
        descripcion: `Lugar turístico "${place.name}" agregado`,
        fecha: place.createdAt,
        usuario: 'Sistema'
      })),
      ...recentReviews.map(review => ({
        tipo: 'resena',
        accion: 'creada',
        descripcion: `Reseña agregada para ${review.lugar?.name || 'lugar'}`,
        fecha: review.createdAt,
        usuario: review.usuario?.nombre || 'Usuario'
      })),
      ...recentUsers.map(user => ({
        tipo: 'usuario',
        accion: 'registrado',
        descripcion: `Usuario "${user.nombre}" registrado`,
        fecha: user.createdAt,
        usuario: 'Sistema'
      }))
    ].sort((a, b) => new Date(b.fecha) - new Date(a.fecha)).slice(0, 20);

    res.json({
      success: true,
      actividades
    });
  } catch (err) {
    console.error('Error getting unified activities:', err);
    res.status(500).json({
      success: false,
      message: 'Error al obtener actividades unificadas',
      actividades: []
    });
  }
}; 