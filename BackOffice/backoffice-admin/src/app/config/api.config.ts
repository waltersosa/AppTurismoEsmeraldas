// Configuración del backend unificado
export const BACKEND_CONFIG = {
  BASE_URL: 'http://localhost:3001',
  ENDPOINTS: {
    // Autenticación
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      VALIDATE: '/auth/validate',
      USERS: '/auth/users',
      USERS_COUNT: '/auth/users/count'
    },
    // Lugares turísticos
    PLACES: {
      LIST: '/places',
      CREATE: '/places',
      UPDATE: (id: string) => `/places/${id}`,
      UPDATE_STATUS: (id: string) => `/places/${id}/status`,
      DELETE: (id: string) => `/places/${id}`,
      GET_BY_ID: (id: string) => `/places/${id}`,
      COUNT: '/places/count'
    },
    // Reseñas
    REVIEWS: {
      LIST: '/reviews',
      CREATE: '/reviews',
      UPDATE: (id: string) => `/reviews/${id}`,
      DELETE: (id: string) => `/reviews/${id}`,
      APPROVE: (id: string) => `/reviews/${id}/approve`,
      REJECT: (id: string) => `/reviews/${id}/reject`,
      COUNT: '/reviews/count'
    },
    // Notificaciones
    NOTIFICATIONS: {
      LIST: '/notifications',
      CREATE: '/notifications',
      MARK_READ: (id: string) => `/notifications/${id}/read`,
      DELETE: (id: string) => `/notifications/${id}`,
      COUNT: '/notifications/count'
    },
    // Estadísticas
    STATS: {
      OVERVIEW: '/stats/overview',
      HEALTH: '/health',
      HEALTH_SIMPLE: '/health/simple',
      HEALTH_SERVICE: (serviceName: string) => `/health/${serviceName}`
    }
  }
};

// Configuración legacy para compatibilidad (mantener temporalmente)
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3001',
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      VALIDATE: '/auth/validate'
    },
    PLACES: {
      LIST: '/places',
      CREATE: '/places',
      UPDATE: (id: string) => `/places/${id}`,
      UPDATE_STATUS: (id: string) => `/places/${id}/status`,
      DELETE: (id: string) => `/places/${id}`,
      GET_BY_ID: (id: string) => `/places/${id}`
    },
    REVIEWS: {
      LIST: '/reviews',
      CREATE: '/reviews',
      UPDATE: (id: string) => `/reviews/${id}`,
      DELETE: (id: string) => `/reviews/${id}`,
      APPROVE: (id: string) => `/reviews/${id}/approve`,
      REJECT: (id: string) => `/reviews/${id}/reject`
    },
    USERS: {
      LIST: '/auth/users',
      CREATE: '/auth/register',
      UPDATE: (id: string) => `/auth/users/${id}`,
      DELETE: (id: string) => `/auth/users/${id}`
    },
    STATS: {
      DASHBOARD: '/stats/overview'
    }
  }
};

// Función para obtener URL del backend unificado
export const getBackendUrl = (endpoint: string): string => {
  return `${BACKEND_CONFIG.BASE_URL}${endpoint}`;
};

// Función para obtener URL de endpoint específico
export const getEndpoint = (section: keyof typeof BACKEND_CONFIG.ENDPOINTS, endpointKey: string, ...params: any[]): string => {
  const sectionConfig = BACKEND_CONFIG.ENDPOINTS[section];
  const endpoint = sectionConfig[endpointKey as keyof typeof sectionConfig];
  
  if (typeof endpoint === 'function') {
    return `${BACKEND_CONFIG.BASE_URL}${(endpoint as Function)(...params)}`;
  }
  
  return `${BACKEND_CONFIG.BASE_URL}${endpoint}`;
};

// Función legacy para compatibilidad
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Funciones específicas para cada sección (mantener compatibilidad)
export const getAuthServiceUrl = (endpoint: string): string => {
  return getBackendUrl(endpoint);
};

export const getPlacesServiceUrl = (endpoint: string): string => {
  return getBackendUrl(endpoint);
};

export const getReviewsServiceUrl = (endpoint: string): string => {
  return getBackendUrl(endpoint);
};

export const getNotificationsServiceUrl = (endpoint: string): string => {
  return getBackendUrl(endpoint);
};

export const getStatsServiceUrl = (endpoint: string): string => {
  return getBackendUrl(endpoint);
};

// Funciones específicas para cada endpoint
export const getAuthEndpoint = (endpointKey: string, ...params: any[]): string => {
  return getEndpoint('AUTH', endpointKey, ...params);
};

export const getPlacesEndpoint = (endpointKey: string, ...params: any[]): string => {
  return getEndpoint('PLACES', endpointKey, ...params);
};

export const getReviewsEndpoint = (endpointKey: string, ...params: any[]): string => {
  return getEndpoint('REVIEWS', endpointKey, ...params);
};

export const getNotificationsEndpoint = (endpointKey: string, ...params: any[]): string => {
  return getEndpoint('NOTIFICATIONS', endpointKey, ...params);
};

export const getStatsEndpoint = (endpointKey: string, ...params: any[]): string => {
  return getEndpoint('STATS', endpointKey, ...params);
}; 