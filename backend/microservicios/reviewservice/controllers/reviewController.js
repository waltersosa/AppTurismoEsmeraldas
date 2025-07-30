import * as reviewService from '../services/reviewService.js';
import Activity from '../models/Activity.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
import Review from '../models/Review.js';
import axios from 'axios';
import config from '../config/config.js';

// ===== RUTAS PARA USUARIOS =====

// Crear una reseña
export const createReview = async (req, res, next) => {
  try {
    const { lugarId, comentario, calificacion } = req.body;
    if (!req.usuario || !(req.usuario._id || req.usuario.id)) {
      return res.status(401).json({ success: false, message: 'Usuario no autenticado' });
    }
    const usuarioId = req.usuario._id || req.usuario.id;
    const reviewData = {
      lugarId: new mongoose.Types.ObjectId(String(lugarId)),
      usuarioId: new mongoose.Types.ObjectId(String(usuarioId)),
      comentario: String(comentario),
      calificacion: Number(calificacion)
    };

    // Usar el modelo importado directamente
    const review = await Review.create(reviewData);

    // Registrar actividad si es admin
    if (req.usuario && req.usuario.rol === 'gad') {
      await Activity.create({
        usuario: req.usuario._id || req.usuario.id || req.usuario.userId,
        nombreUsuario: req.usuario.nombre || req.usuario.correo || 'Admin',
        accion: 'creó una reseña',
        recurso: `Lugar: ${lugarId}`
      });
    }

    res.status(201).json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
};

// Obtener reseñas públicas aprobadas de un lugar
export const getReviewsByPlace = async (req, res, next) => {
  try {
    const { lugarId } = req.params;
    const { page, limit, sortBy, order } = req.query;
    
    const { data, total } = await reviewService.getReviewsByPlace(lugarId, { 
      page, limit, sortBy, order 
    });

    // Consultar nombre del usuario en AuthService
    const dataWithUserName = await Promise.all(
      (data || []).map(async (review) => {
        let userName = '';
        if (review.usuarioId) {
          try {
            const resp = await axios.get(`${config.authServiceUrl}/auth/users/${review.usuarioId}`);
            userName = resp.data.nombre;
          } catch (err) {
            // Usuario no encontrado o error
          }
        }
        return {
          ...review.toObject(),
          userName,
          usuario: userName ? { nombre: userName } : undefined
        };
      })
    );

    res.json({
      success: true,
      data: dataWithUserName,
      pagination: {
        total,
        page: Number(page) || 1,
        limit: Number(limit) || 10
      }
    });
  } catch (err) {
    res.json({ success: true, data: [], pagination: { total: 0, page: 1, limit: 10 } });
  }
};

// ===== RUTAS PARA ADMINISTRADORES =====

// Listado filtrable y paginado para administradores
export const getReviewsAdmin = async (req, res, next) => {
  try {
    const { page, limit, estado, search, lugarId, usuarioId, sortBy, order } = req.query;
    
    const { data, total } = await reviewService.getReviewsAdmin({ 
      page, limit, estado, search, lugarId, usuarioId, sortBy, order 
    });

    // Consultar nombre y email del usuario en AuthService y nombre del lugar en PlaceService
    const dataWithUserAndPlace = await Promise.all((data || []).map(async (review) => {
      let usuario = { nombre: '', email: '' };
      let lugar = { name: '' };
      if (review.usuarioId) {
        try {
          const resp = await axios.get(`${config.authServiceUrl}/auth/users/${review.usuarioId}`);
          usuario = { nombre: resp.data.nombre, email: resp.data.email };
        } catch (err) {
          // Usuario no encontrado o error
        }
      }
      if (review.lugarId) {
        try {
          const resp = await axios.get(`${config.placesServiceUrl}/places/${review.lugarId}`);
          if (resp.data && resp.data.data && resp.data.data.name) {
            lugar = { name: resp.data.data.name };
          }
        } catch (err) {
          // Lugar no encontrado o error
        }
      }
      return {
        ...review.toObject(),
        usuario,
        lugar
      };
    }));

    res.json({
      success: true,
      data: dataWithUserAndPlace,
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

// Aprobar o bloquear una reseña
export const updateReviewStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!['aprobada', 'bloqueada'].includes(estado)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Estado inválido. Debe ser: aprobada o bloqueada' 
      });
    }

    const review = await reviewService.updateReview(id, { estado });
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review no encontrada' });
    }

    // Registrar actividad si es admin
    if (req.usuario && req.usuario.rol === 'gad') {
      await Activity.create({
        usuario: req.usuario._id || req.usuario.id || req.usuario.userId,
        nombreUsuario: req.usuario.nombre || req.usuario.correo || 'Admin',
        accion: `cambió estado de reseña a ${estado}`,
        recurso: `Reseña de ${review.usuario?.nombre || 'usuario'}`
      });
    }

    res.json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
};

// Eliminar una reseña
export const deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const review = await reviewService.deleteReview(id);
    
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review no encontrada' });
    }

    // Registrar actividad si es admin
    if (req.usuario && req.usuario.rol === 'gad') {
      await Activity.create({
        usuario: req.usuario._id || req.usuario.id || req.usuario.userId,
        nombreUsuario: req.usuario.nombre || req.usuario.correo || 'Admin',
        accion: 'eliminó una reseña',
        recurso: `Reseña de ${review.usuario?.nombre || 'usuario'}`
      });
    }

    res.json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
};

// Obtener una reseña específica por ID (admin)
export const getReviewByIdAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const review = await reviewService.getReviewById(id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review no encontrada' });
    }
    res.json({ success: true, data: review });
  } catch (err) {
    next(err);
  }
};

// Obtener conteo de reseñas
export const getReviewsCount = async (req, res, next) => {
  try {
    const count = await reviewService.getReviewsCount();
    res.json({ count });
  } catch (err) {
    next(err);
  }
};

// Editar una reseña (solo dueño)
export const updateReviewByUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const usuarioId = req.usuario.id || req.usuario._id;
    const review = await reviewService.getReviewById(id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review no encontrada' });
    }
    if (review.usuarioId.toString() !== usuarioId.toString()) {
      return res.status(403).json({ success: false, message: 'No autorizado para editar esta reseña' });
    }
    const { comentario, calificacion } = req.body;
    const updated = await reviewService.updateReview(id, { comentario, calificacion });
    res.json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

// Eliminar una reseña (solo dueño)
export const deleteReviewByUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const usuarioId = req.usuario.id || req.usuario._id;
    const review = await reviewService.getReviewById(id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review no encontrada' });
    }
    if (review.usuarioId.toString() !== usuarioId.toString()) {
      return res.status(403).json({ success: false, message: 'No autorizado para eliminar esta reseña' });
    }
    await reviewService.deleteReview(id);
    res.json({ success: true, message: 'Reseña eliminada' });
  } catch (err) {
    next(err);
  }
}; 