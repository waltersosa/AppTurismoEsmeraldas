import { getStatsCounts } from '../services/statsService.js';

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