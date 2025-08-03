import dotenv from 'dotenv';

dotenv.config();

export const config = {
  server: {
    port: process.env.PORT || 3001,
    nodeEnv: process.env.NODE_ENV
  },
  database: {
    uri: process.env.MONGODB_URI
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'esmeraldas-turismo-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    audience: 'esmeraldas-turismo-users',
    issuer: 'esmeraldas-turismo-auth'
  },
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:4200', 'http://localhost:4300']
  }
}; 