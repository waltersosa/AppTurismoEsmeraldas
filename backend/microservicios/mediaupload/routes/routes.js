import express from 'express';
import upload from '../middlewares/upload.js';
import * as mediaController from '../controllers/mediaController.js';
import { autenticarTokenPorHttp } from '../middlewares/authHttpMiddleware.js';
import Activity from '../models/Activity.js';

const router = express.Router();

// Middleware para autorizar solo admins (rol gad)
const autorizarGAD = (req, res, next) => {
  if (!req.usuario || req.usuario.rol !== 'gad') {
    return res.status(403).json({ error: 'Acceso solo para administradores (GAD)' });
  }
  next();
};

// Estado del servicio
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'MediaUploadService - Microservicio de Archivos Multimedia',
    data: {
      service: 'MediaUploadService',
      version: '1.0.0',
      status: 'active',
      timestamp: new Date().toISOString(),
      endpoints: {
        upload: '/media/upload',
        get: '/media/file/:filename',
        byPlace: '/media/place/:placeId',
        delete: '/media/:mediaId'
      }
    }
  });
});

// Subir imágenes (solo admins GAD)
router.post('/media/upload', autenticarTokenPorHttp, autorizarGAD, upload.array('imagenes', 10), mediaController.uploadMedia);

// Obtener archivo
router.get('/media/file/:filename', mediaController.getMedia);

// Obtener imágenes por lugar
router.get('/media/place/:placeId', mediaController.getMediaByPlace);

// Obtener conteo de imágenes
router.get('/media/count', mediaController.getMediaCount);

// Eliminar imagen
router.delete('/media/:mediaId', mediaController.deleteMedia);

// Endpoint para actividades (para el endpoint unificado)
router.get('/admin/actividades', async (req, res) => {
  try {
    const actividades = await Activity.find().sort({ fecha: -1 }).limit(50);
    res.json({ actividades });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener actividades' });
  }
});

export default router; 