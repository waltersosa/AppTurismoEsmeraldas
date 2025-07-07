import { getStatsCounts, getServicesHealth } from '../services/statsService.js';

export const getStats = async (req, res) => {
  try {
    const stats = await getStatsCounts();
    res.status(200).json({
      success: true,
      message: 'Estadísticas obtenidas correctamente',
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas',
      error: error.message
    });
  }
};

export const getHealthOverview = async (req, res) => {
  try {
    const health = await getServicesHealth();
    res.status(200).json({
      success: true,
      message: 'Estado de servicios obtenido correctamente',
      data: health
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener estado de servicios',
      error: error.message
    });
  }
}; 