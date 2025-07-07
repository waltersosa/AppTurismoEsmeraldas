import dotenv from 'dotenv';
dotenv.config();

export default {
  port: process.env.PORT || 3006,
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/notificationsDB',
  jwtSecret: process.env.JWT_SECRET || 'secretAuth',
  authServiceUrl: process.env.AUTH_SERVICE_URL || 'http://localhost:3001'
}; 