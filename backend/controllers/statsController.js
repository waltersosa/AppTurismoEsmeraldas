import { getStatsCounts } from '../services/statsService.js';
import { successResponse, errorResponse } from '../utils/response.js';

const getStats = async (req, res) => {
  try {
    const stats = await getStatsCounts();
    return successResponse(res, 200, 'Estadísticas obtenidas correctamente', stats);
  } catch (error) {
    return errorResponse(res, 500, 'Error al obtener estadísticas', error.message);
  }
};

export default { getStats }; 