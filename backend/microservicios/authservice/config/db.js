import mongoose from 'mongoose';

const connectAuthDB = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/authDB', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Conectado a la base de datos authDB');
  } catch (error) {
    console.error('❌ Error conectando a authDB:', error);
    process.exit(1);
  }
};

export default connectAuthDB; 