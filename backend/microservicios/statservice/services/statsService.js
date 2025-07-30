import axios from 'axios';
import config from '../config/config.js';

const services = [
  {
    key: 'auth',
    name: 'Servicio de Autenticación',
    url: `${config.authServiceUrl}/auth/health`,
    type: 'API',
    port: 3001
  },
  {
    key: 'places',
    name: 'Servicio de Lugares',
    url: `${config.placesServiceUrl}/places/health`,
    type: 'API',
    port: 3002
  },
  {
    key: 'media',
    name: 'Servicio de Media',
    url: `${config.mediaServiceUrl}/media/health`,
    type: 'API',
    port: 3003
  },
  {
    key: 'reviews',
    name: 'Servicio de Reseñas',
    url: `${config.reviewsServiceUrl}/reviews/health`,
    type: 'API',
    port: 3004
  },
  {
    key: 'stats',
    name: 'Servicio de Estadísticas',
    url: `http://localhost:3005/health`,
    type: 'API',
    port: 3005
  },
  {
    key: 'notifications',
    name: 'Servicio de Notificaciones',
    url: `http://localhost:3006/health`,
    type: 'API',
    port: 3006
  }
];

export const getStatsCounts = async () => {
  // Consultar cada microservicio por HTTP
  const [usuarios, lugares, resenas, imagenes] = await Promise.all([
    axios.get(`${config.authServiceUrl}/auth/users/count`).then(res => res.data.count).catch(() => 0),
    axios.get(`${config.placesServiceUrl}/places/count`).then(res => res.data.count).catch(() => 0),
    axios.get(`${config.reviewsServiceUrl}/reviews/count`).then(res => res.data.count).catch(() => 0),
    axios.get(`${config.mediaServiceUrl}/media/count`).then(res => res.data.count).catch(() => 0)
  ]);
  return { usuarios, lugares, resenas, imagenes };
};

export const getServicesHealth = async () => {
  const results = await Promise.all(services.map(async (svc) => {
    const start = Date.now();
    try {
      const res = await axios.get(svc.url, { timeout: 2000 });
      return {
        ...svc,
        status: 'online',
        responseTime: Date.now() - start,
        details: res.data
      };
    } catch (err) {
      return {
        ...svc,
        status: 'offline',
        responseTime: null,
        details: err.message
      };
    }
  }));
  return results;
}; 