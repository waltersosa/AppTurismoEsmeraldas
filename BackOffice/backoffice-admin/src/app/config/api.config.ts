// Configuración del backend monolítico
export const BACKEND_CONFIG = {
  BASE_URL: 'http://localhost:3001',
  ENDPOINTS: {
    // Auth endpoints
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      VALIDATE: '/auth/validate',
      USERS: '/auth/users',
      USERS_COUNT: '/auth/users/count',
      PROFILE: '/auth/profile'
    },
    // Places endpoints
    PLACES: {
      LIST: '/places',
      CREATE: '/places',
      UPDATE: (id: string) => `/places/${id}`,
      UPDATE_STATUS: (id: string) => `/places/${id}/status`,
      DELETE: (id: string) => `/places/${id}`,
      GET_BY_ID: (id: string) => `/places/${id}`,
      COUNT: '/places/count'
    },
    // Media endpoints
    MEDIA: {
      UPLOAD: '/media/upload',
      GET: (id: string) => `/media/${id}`,
      DELETE: (id: string) => `/media/${id}`,
      COUNT: '/media/count'
    },
    // Reviews endpoints
    REVIEWS: {
      LIST: '/reviews',
      CREATE: '/reviews',
      UPDATE: (id: string) => `/reviews/${id}`,
      DELETE: (id: string) => `/reviews/${id}`,
      APPROVE: (id: string) => `/reviews/${id}/approve`,
      REJECT: (id: string) => `/reviews/${id}/reject`,
      COUNT: '/reviews/count',
      BY_PLACE: (placeId: string) => `/reviews/lugar/${placeId}`
    },
    // Notifications endpoints
    NOTIFICATIONS: {
      LIST: '/notifications',
      CREATE: '/notifications',
      MARK_READ: (id: string) => `/notifications/${id}/read`,
      DELETE: (id: string) => `/notifications/${id}`,
      COUNT: '/notifications/count'
    },
    // Health check
    HEALTH: '/health'
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
    }
  }
};

// Función para obtener URL del backend monolítico
export const getBackendUrl = (endpoint: string): string => {
  return `${BACKEND_CONFIG.BASE_URL}${endpoint}`;
};

// Función para obtener URL de endpoint específico
export const getEndpointUrl = (endpointKey: string, ...params: any[]): string => {
  const endpoint = BACKEND_CONFIG.ENDPOINTS[endpointKey as keyof typeof BACKEND_CONFIG.ENDPOINTS];
  
  if (typeof endpoint === 'function') {
    return `${BACKEND_CONFIG.BASE_URL}${(endpoint as Function)(...params)}`;
  }
  
  return `${BACKEND_CONFIG.BASE_URL}${endpoint}`;
};

// Función legacy para compatibilidad
export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Funciones específicas para cada módulo del backend
export const getAuthUrl = (endpoint: string): string => {
  return getBackendUrl(`/auth${endpoint}`);
};

export const getPlacesUrl = (endpoint: string): string => {
  return getBackendUrl(`/places${endpoint}`);
};

export const getMediaUrl = (endpoint: string): string => {
  return getBackendUrl(`/media${endpoint}`);
};

export const getReviewsUrl = (endpoint: string): string => {
  return getBackendUrl(`/reviews${endpoint}`);
};

export const getNotificationsUrl = (endpoint: string): string => {
  return getBackendUrl(`/notifications${endpoint}`);
};

// Funciones de conveniencia para endpoints específicos
export const getAuthEndpoints = () => BACKEND_CONFIG.ENDPOINTS.AUTH;
export const getPlacesEndpoints = () => BACKEND_CONFIG.ENDPOINTS.PLACES;
export const getMediaEndpoints = () => BACKEND_CONFIG.ENDPOINTS.MEDIA;
export const getReviewsEndpoints = () => BACKEND_CONFIG.ENDPOINTS.REVIEWS;
export const getNotificationsEndpoints = () => BACKEND_CONFIG.ENDPOINTS.NOTIFICATIONS; 