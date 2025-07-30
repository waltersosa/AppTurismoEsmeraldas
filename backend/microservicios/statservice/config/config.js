import dotenv from 'dotenv';
dotenv.config();

export default {
  port: process.env.PORT || 3005,
  authServiceUrl: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
  placesServiceUrl: process.env.PLACES_SERVICE_URL || 'http://localhost:3002',
  mediaServiceUrl: process.env.MEDIA_SERVICE_URL || 'http://localhost:3003',
  reviewsServiceUrl: process.env.REVIEWS_SERVICE_URL || 'http://localhost:3004',
  notificationsServiceUrl: process.env.NOTIFICATIONS_SERVICE_URL || 'http://localhost:3006',
  jwtSecret: process.env.JWT_SECRET || 'secretAuth'
}; 