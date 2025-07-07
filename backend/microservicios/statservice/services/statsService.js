import axios from 'axios';
import config from '../config/config.js';

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