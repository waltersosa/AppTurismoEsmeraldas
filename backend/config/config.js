import dotenv from 'dotenv';

dotenv.config();

export const config = {
  server: {
    port: process.env.PORT || 3001,
    nodeEnv: process.env.NODE_ENV || 'development'
  },
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/turismoDB'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'default_secret_change_in_production',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h'
  },
  cors: {
    //origin: process.env.CORS_ORIGIN || 'http://localhost:3000'
    origin: ['http://localhost:3000', 'http://localhost:4200']
  }
}; 