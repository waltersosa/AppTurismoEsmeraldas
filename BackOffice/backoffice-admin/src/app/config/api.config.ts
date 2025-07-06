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
      DASHBOARD: '/stats'
    }
  }
};

export const getApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
}; 