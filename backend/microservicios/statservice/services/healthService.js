import axios from 'axios';
import config from '../config/config.js';

export const checkAllServicesHealth = async () => {
  const services = [
    {
      name: 'Auth Service',
      url: config.authServiceUrl,
      endpoint: '/',
      port: 3001
    },
    {
      name: 'Places Service',
      url: config.placesServiceUrl,
      endpoint: '/',
      port: 3002
    },
    {
      name: 'Media Upload Service',
      url: config.mediaServiceUrl,
      endpoint: '/',
      port: 3003
    },
    {
      name: 'Reviews Service',
      url: config.reviewsServiceUrl,
      endpoint: '/',
      port: 3004
    },
    {
      name: 'Notifications Service',
      url: config.notificationsServiceUrl,
      endpoint: '/',
      port: 3006
    }
  ];

  const healthChecks = await Promise.allSettled(
    services.map(async (service) => {
      const startTime = Date.now();
      try {
        const response = await axios.get(`${service.url}${service.endpoint}`, {
          timeout: 5000 // 5 segundos de timeout
        });
        const responseTime = Date.now() - startTime;
        
        return {
          service: service.name,
          url: service.url,
          port: service.port,
          status: 'online',
          responseTime: `${responseTime}ms`,
          statusCode: response.status,
          timestamp: new Date().toISOString(),
          data: response.data
        };
      } catch (error) {
        const responseTime = Date.now() - startTime;
        
        return {
          service: service.name,
          url: service.url,
          port: service.port,
          status: 'offline',
          responseTime: `${responseTime}ms`,
          error: error.message,
          statusCode: error.response?.status || 'N/A',
          timestamp: new Date().toISOString()
        };
      }
    })
  );

  const results = healthChecks.map((result, index) => {
    if (result.status === 'fulfilled') {
      return result.value;
    } else {
      return {
        service: services[index].name,
        url: services[index].url,
        port: services[index].port,
        status: 'error',
        responseTime: 'N/A',
        error: result.reason.message,
        statusCode: 'N/A',
        timestamp: new Date().toISOString()
      };
    }
  });

  // Calcular estadísticas generales
  const onlineServices = results.filter(service => service.status === 'online').length;
  const totalServices = results.length;
  const overallStatus = onlineServices === totalServices ? 'healthy' : 
                       onlineServices > 0 ? 'degraded' : 'unhealthy';

  return {
    overall: {
      status: overallStatus,
      onlineServices,
      totalServices,
      uptime: `${Math.round(process.uptime())}s`,
      timestamp: new Date().toISOString()
    },
    services: results
  };
};

export const checkServiceHealth = async (serviceName) => {
  const services = {
    'auth': {
      name: 'Auth Service',
      url: config.authServiceUrl,
      endpoint: '/',
      port: 3001
    },
    'places': {
      name: 'Places Service',
      url: config.placesServiceUrl,
      endpoint: '/',
      port: 3002
    },
    'media': {
      name: 'Media Upload Service',
      url: config.mediaServiceUrl,
      endpoint: '/',
      port: 3003
    },
    'reviews': {
      name: 'Reviews Service',
      url: config.reviewsServiceUrl,
      endpoint: '/',
      port: 3004
    },
    'notifications': {
      name: 'Notifications Service',
      url: config.notificationsServiceUrl,
      endpoint: '/',
      port: 3006
    }
  };

  const service = services[serviceName.toLowerCase()];
  if (!service) {
    throw new Error(`Servicio no encontrado: ${serviceName}`);
  }

  const startTime = Date.now();
  try {
    const response = await axios.get(`${service.url}${service.endpoint}`, {
      timeout: 5000
    });
    const responseTime = Date.now() - startTime;
    
    return {
      service: service.name,
      url: service.url,
      port: service.port,
      status: 'online',
      responseTime: `${responseTime}ms`,
      statusCode: response.status,
      timestamp: new Date().toISOString(),
      data: response.data
    };
  } catch (error) {
    const responseTime = Date.now() - startTime;
    
    return {
      service: service.name,
      url: service.url,
      port: service.port,
      status: 'offline',
      responseTime: `${responseTime}ms`,
      error: error.message,
      statusCode: error.response?.status || 'N/A',
      timestamp: new Date().toISOString()
    };
  }
}; 