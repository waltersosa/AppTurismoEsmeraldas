import { checkAllServicesHealth, checkServiceHealth } from '../services/healthService.js';

export const getAllServicesHealth = async (req, res) => {
  try {
    const healthData = await checkAllServicesHealth();
    
    // Determinar el código de estado HTTP basado en el estado general
    const statusCode = healthData.overall.status === 'healthy' ? 200 : 
                      healthData.overall.status === 'degraded' ? 207 : 503;

    res.status(statusCode).json({
      success: true,
      message: `Estado de salud de todos los microservicios - ${healthData.overall.status.toUpperCase()}`,
      data: healthData
    });
  } catch (error) {
    console.error('Error en health check:', error);
    res.status(500).json({
      success: false,
      message: 'Error al verificar el estado de salud de los servicios',
      error: error.message
    });
  }
};

export const getServiceHealth = async (req, res) => {
  try {
    const { serviceName } = req.params;
    const healthData = await checkServiceHealth(serviceName);
    
    const statusCode = healthData.status === 'online' ? 200 : 503;
    
    res.status(statusCode).json({
      success: true,
      message: `Estado de salud del servicio ${healthData.service}`,
      data: healthData
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: 'Error al verificar el estado de salud del servicio',
      error: error.message
    });
  }
};

export const getSimpleHealth = async (req, res) => {
  try {
    const healthData = await checkAllServicesHealth();
    
    // Respuesta simplificada para monitoreo
    const simpleResponse = {
      status: healthData.overall.status,
      online: healthData.overall.onlineServices,
      total: healthData.overall.totalServices,
      timestamp: healthData.overall.timestamp,
      services: healthData.services.map(service => ({
        name: service.service,
        status: service.status,
        port: service.port
      }))
    };

    const statusCode = healthData.overall.status === 'healthy' ? 200 : 
                      healthData.overall.status === 'degraded' ? 207 : 503;

    res.status(statusCode).json(simpleResponse);
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Error al verificar el estado de salud',
      error: error.message
    });
  }
}; 