export const environment = {
  production: true,
  
  // URLs de autenticación
  auth: {
    // Base de datos local
    local: {
      register: 'http://localhost:3001/auth/register',
      login: 'http://localhost:3001/auth/login',
      profile: 'http://localhost:3001/auth/profile',
      changePassword: 'http://localhost:3001/auth/change-password'
    },
    // API del municipio
    municipio: {
      login: 'https://geoapi.esmeraldas.gob.ec/new/login',
      profile: 'https://geoapi.esmeraldas.gob.ec/new/me',
      updateProfile: 'https://geoapi.esmeraldas.gob.ec/new/actualizarUser'
    }
  },
  
  // URLs de otros servicios
  api: {
    places: 'http://localhost:3001/places',
    reviews: 'http://localhost:3001/reviews',
    notifications: 'http://localhost:3001/notifications'
  },
  
  // Socket.io
  socket: {
    url: 'https://geoapi.esmeraldas.gob.ec',
    path: '/new/socket.io'
  }
}; 