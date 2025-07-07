import mongoose from 'mongoose';
import config from './config.js';

const connectMediaDB = async () => {
  try {
    await mongoose.connect(config.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Conectado a la base de datos mediaDB');
  } catch (error) {
    console.error('❌ Error conectando a mediaDB:', error);
    process.exit(1);
  }
};

export default connectMediaDB; 