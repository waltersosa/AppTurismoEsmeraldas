import mongoose from 'mongoose';
import config from './config.js';

const connectPlacesDB = async () => {
  try {
    await mongoose.connect(config.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Conectado a la base de datos placesDB');
  } catch (error) {
    console.error('❌ Error conectando a placesDB:', error);
    process.exit(1);
  }
};

export default connectPlacesDB; 