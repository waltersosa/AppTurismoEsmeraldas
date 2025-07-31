// Configuración de microservicios
export const MICROSERVICES_CONFIG = {
  AUTH_SERVICE: {
    BASE_URL: 'http://localhost:3001',
    ENDPOINTS: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      VALIDATE: '/auth/validate',
      USERS: '/auth/users',
      USERS_COUNT: '/auth/users/count'
    }
  },
  PLACES_SERVICE: {
    BASE_URL: 'http://localhost:3002',
    ENDPOINTS: {
      LIST: '/places',
      CREATE: '/places',
      UPDATE: (id: string) => `/places/${id}`,
      UPDATE_STATUS: (id: string) => `/places/${id}/status`,
      DELETE: (id: string) => `/places/${id}`,
      GET_BY_ID: (id: string) => `/places/${id}`,
      COUNT: '/places/count'
    }
  },

  REVIEWS_SERVICE: {
    BASE_URL: 'http://localhost:3004',
    ENDPOINTS: {
      LIST: '/reviews',
      CREATE: '/reviews',
      UPDATE: (id: string) => `/reviews/${id}`,
      DELETE: (id: string) => `/reviews/${id}`,
      APPROVE: (id: string) => `/reviews/${id}/approve`,
      REJECT: (id: string) => `/reviews/${id}/reject`,
      COUNT: '/reviews/count'
    }
  },
  NOTIFICATIONS_SERVICE: {
    BASE_URL: 'http://localhost:3006',
    ENDPOINTS: {
      LIST: '/notifications',
      CREATE: '/notifications',
      MARK_READ: (id: string) => `/notifications/${id}/read`,
      DELETE: (id: string) => `/notifications/${id}`,
      COUNT: '/notifications/count'
    }
  },
  STATS_SERVICE: {
    BASE_URL: 'http://localhost:3005',
    ENDPOINTS: {
      OVERVIEW: '/stats/overview',
      HEALTH: '/health',
      HEALTH_SIMPLE: '/health/simple',
      HEALTH_SERVICE: (serviceName: string) => `/health/${serviceName}`
    }
  }
};

// Configuración legacy para compatibilidad (mantener temporalmente)
export const API_CONFIG = {
  BASE_URL: 'http://localhost:3001', // Auth Service como base por defecto
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

// Función para obtener URL de microservicio específico
export const getMicroserviceUrl = (service: keyof typeof MICROSERVICES_CONFIG, endpoint: string): string => {
  const serviceConfig = MICROSERVICES_CONFIG[service];
  return `${serviceConfig.BASE_URL}${endpoint}`;
};

// Función para obtener URL de endpoint específico de un microservicio
export const getServiceEndpoint = (service: keyof typeof MICROSERVICES_CONFIG, endpointKey: string, ...params: any[]): string => {
  const serviceConfig = MICROSERVICES_CONFIG[service];
  const endpoint = serviceConfig.ENDPOINTS[endpointKey as keyof typeof serviceConfig.ENDPOINTS];
  
  if (typeof endpoint === 'function') {
    return `${serviceConfig.BASE_URL}${(endpoint as Function)(...params)}`;
  }
  
  return `${serviceConfig.BASE_URL}${endpoint}`;
};

// Función legacy para compatibilidad
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Funciones específicas para cada microservicio
export const getAuthServiceUrl = (endpoint: string): string => {
  return getMicroserviceUrl('AUTH_SERVICE', endpoint);
};

export const getPlacesServiceUrl = (endpoint: string): string => {
  return getMicroserviceUrl('PLACES_SERVICE', endpoint);
};



export const getReviewsServiceUrl = (endpoint: string): string => {
  return getMicroserviceUrl('REVIEWS_SERVICE', endpoint);
};

export const getNotificationsServiceUrl = (endpoint: string): string => {
  return getMicroserviceUrl('NOTIFICATIONS_SERVICE', endpoint);
};

export const getStatsServiceUrl = (endpoint: string): string => {
  return getMicroserviceUrl('STATS_SERVICE', endpoint);
}; 