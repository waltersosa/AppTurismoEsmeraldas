import express from 'express';
import { autenticarToken, autorizarAdmin } from '../middlewares/auth.js';
import ActivityService from '../services/activityService.js';

const router = express.Router();

/**
 * Obtener actividades recientes (solo ADMIN)
 * GET /activities/recent
 */
router.get('/recent', autenticarToken, autorizarAdmin, async (req, res) => {
  try {
    const activities = await ActivityService.getRecentActivities(10);
    
    return res.status(200).json({
      success: true,
      message: 'Actividades recientes obtenidas exitosamente',
      data: activities
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error al obtener actividades recientes',
      error: error.message
    });
  }
});

export default router; 