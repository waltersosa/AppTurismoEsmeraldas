import dotenv from 'dotenv';

dotenv.config();

export default {
  port: process.env.PORT || 3004,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/reviewsDB',
  jwtSecret: process.env.JWT_SECRET || 'secretAuth',
  authServiceUrl: process.env.AUTH_SERVICE_URL || 'http://localhost:3001',
  placesServiceUrl: process.env.PLACES_SERVICE_URL || 'http://localhost:3002'
}; 