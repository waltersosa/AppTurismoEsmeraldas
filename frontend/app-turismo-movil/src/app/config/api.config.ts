export const API_CONFIG = {
  // Backend unificado local
  BACKEND: {
    BASE_URL: 'http://localhost:3001',
    ENDPOINTS: {
      AUTH: '/auth',
      PLACES: '/places',
      REVIEWS: '/reviews',
      NOTIFICATIONS: '/notifications'
    }
  },
  // API externa del municipio
  MUNICIPALITY: {
    BASE_URL: 'https://geoapi.esmeraldas.gob.ec/new',
    ENDPOINTS: {
      LOGIN: '/login',
      ME: '/me'
    }
  }
};

export const getBackendUrl = (endpoint: string): string => {
  return `${API_CONFIG.BACKEND.BASE_URL}${endpoint}`;
};

export const getMunicipalityUrl = (endpoint: string): string => {
  return `${API_CONFIG.MUNICIPALITY.BASE_URL}${endpoint}`;
}; 